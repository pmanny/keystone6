'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fields = require('@keystone-6/core/fields');
var types = require('@keystone-6/core/types');
var graphql = require('graphql');
var core = require('@keystone-6/core');
var crypto = require('crypto');

async function validateSecret(secretFieldImpl, identityField, identity, secretField, secret, dbItemAPI) {
  const item = await dbItemAPI.findOne({
    where: {
      [identityField]: identity
    }
  });
  if (!item || !item[secretField]) {
    // See "Identity Protection" in the README as to why this is a thing
    await secretFieldImpl.generateHash('simulated-password-to-counter-timing-attack');
    return {
      success: false
    };
  } else if (await secretFieldImpl.compare(secret, item[secretField])) {
    // Authenticated!
    return {
      success: true,
      item
    };
  } else {
    return {
      success: false
    };
  }
}

function getBaseAuthSchema({
  listKey,
  identityField,
  secretField,
  gqlNames,
  secretFieldImpl,
  base
}) {
  const ItemAuthenticationWithPasswordSuccess = core.graphql.object()({
    name: gqlNames.ItemAuthenticationWithPasswordSuccess,
    fields: {
      sessionToken: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      }),
      item: core.graphql.field({
        type: core.graphql.nonNull(base.object(listKey))
      })
    }
  });
  const ItemAuthenticationWithPasswordFailure = core.graphql.object()({
    name: gqlNames.ItemAuthenticationWithPasswordFailure,
    fields: {
      message: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      })
    }
  });
  const AuthenticationResult = core.graphql.union({
    name: gqlNames.ItemAuthenticationWithPasswordResult,
    types: [ItemAuthenticationWithPasswordSuccess, ItemAuthenticationWithPasswordFailure],
    resolveType(val) {
      if ('sessionToken' in val) {
        return gqlNames.ItemAuthenticationWithPasswordSuccess;
      }
      return gqlNames.ItemAuthenticationWithPasswordFailure;
    }
  });
  const extension = {
    query: {
      authenticatedItem: core.graphql.field({
        type: core.graphql.union({
          name: 'AuthenticatedItem',
          types: [base.object(listKey)],
          resolveType: (root, context) => {
            var _context$session;
            return (_context$session = context.session) === null || _context$session === void 0 ? void 0 : _context$session.listKey;
          }
        }),
        resolve(root, args, context) {
          const {
            session
          } = context;
          if (!session) return null;
          if (!session.itemId) return null;
          if (session.listKey !== listKey) return null;
          return context.db[listKey].findOne({
            where: {
              id: session.itemId
            }
          });
        }
      })
    },
    mutation: {
      [gqlNames.authenticateItemWithPassword]: core.graphql.field({
        type: AuthenticationResult,
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          [secretField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(root, {
          [identityField]: identity,
          [secretField]: secret
        }, context) {
          if (!context.sessionStrategy) throw new Error('No session implementation available on context');
          const dbItemAPI = context.sudo().db[listKey];
          const result = await validateSecret(secretFieldImpl, identityField, identity, secretField, secret, dbItemAPI);
          if (!result.success) {
            return {
              code: 'FAILURE',
              message: 'Authentication failed.'
            };
          }

          // Update system state
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: result.item.id
            },
            context
          });

          // return Failure if sessionStrategy.start() is incompatible
          if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
            return {
              code: 'FAILURE',
              message: 'Failed to start session.'
            };
          }
          return {
            sessionToken,
            item: result.item
          };
        }
      })
    }
  };
  return {
    extension,
    ItemAuthenticationWithPasswordSuccess
  };
}

function getInitFirstItemSchema({
  listKey,
  fields,
  itemData,
  gqlNames,
  graphQLSchema,
  ItemAuthenticationWithPasswordSuccess
}) {
  const createInputConfig = graphql.assertInputObjectType(graphQLSchema.getType(`${listKey}CreateInput`)).toConfig();
  const fieldsSet = new Set(fields);
  const initialCreateInput = core.graphql.wrap.inputObject(new graphql.GraphQLInputObjectType({
    ...createInputConfig,
    fields: Object.fromEntries(Object.entries(createInputConfig.fields).filter(([fieldKey]) => fieldsSet.has(fieldKey))),
    name: gqlNames.CreateInitialInput
  }));
  return {
    mutation: {
      [gqlNames.createInitialItem]: core.graphql.field({
        type: core.graphql.nonNull(ItemAuthenticationWithPasswordSuccess),
        args: {
          data: core.graphql.arg({
            type: core.graphql.nonNull(initialCreateInput)
          })
        },
        async resolve(rootVal, {
          data
        }, context) {
          if (!context.sessionStrategy) {
            throw new Error('No session implementation available on context');
          }
          const sudoContext = context.sudo();

          // should approximate hasInitFirstItemConditions
          const count = await sudoContext.db[listKey].count();
          if (count !== 0) {
            throw new Error('Initial items can only be created when no items exist in that list');
          }

          // Update system state
          // this is strictly speaking incorrect. the db API will do GraphQL coercion on a value which has already been coerced
          // (this is also mostly fine, the chance that people are using things where
          // the input value can't round-trip like the Upload scalar here is quite low)
          const item = await sudoContext.db[listKey].createOne({
            data: {
              ...data,
              ...itemData
            }
          });
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: item.id.toString()
            },
            context
          });

          // return Failure if sessionStrategy.start() is incompatible
          if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
            throw new Error('Failed to start session');
          }
          return {
            item,
            sessionToken
          };
        }
      })
    }
  };
}

async function createAuthToken(identityField, identity, dbItemAPI) {
  // FIXME : identity lookups may leak information due to timing attacks
  const item = await dbItemAPI.findOne({
    where: {
      [identityField]: identity
    }
  });
  if (!item) return {
    success: false
  };
  return {
    success: true,
    itemId: item.id,
    token: crypto.randomBytes(16).toString('base64url').slice(0, 20) // (128 / Math.log2(64)) < 20
  };
}

// The tokensValidForMins config is from userland so could be anything; make it sane
function sanitiseValidForMinsConfig(input) {
  const parsed = Number.parseFloat(input);
  // > 10 seconds, < 24 hrs, default 10 mins
  return parsed ? Math.max(1 / 6, Math.min(parsed, 60 * 24)) : 10;
}
async function validateAuthToken(listKey, secretFieldImpl, tokenType, identityField, identity, tokenValidMins, token, dbItemAPI) {
  const result = await validateSecret(secretFieldImpl, identityField, identity, `${tokenType}Token`, token, dbItemAPI);
  if (!result.success) {
    // Could be due to:
    // - Missing identity
    // - Missing secret
    // - Secret mismatch.
    return {
      success: false,
      code: 'FAILURE'
    };
  }

  // Now that we know the identity and token are valid, we can always return 'helpful' errors and stop worrying about protecting identities.
  const {
    item
  } = result;
  const fieldKeys = {
    issuedAt: `${tokenType}IssuedAt`,
    redeemedAt: `${tokenType}RedeemedAt`
  };

  // Check that the token has not been redeemed already
  if (item[fieldKeys.redeemedAt]) {
    return {
      success: false,
      code: 'TOKEN_REDEEMED'
    };
  }

  // Check that the token has not expired
  if (!item[fieldKeys.issuedAt] || typeof item[fieldKeys.issuedAt].getTime !== 'function') {
    throw new Error(`Error redeeming authToken: field ${listKey}.${fieldKeys.issuedAt} isn't a valid Date object.`);
  }
  const elapsedMins = (Date.now() - item[fieldKeys.issuedAt].getTime()) / (1000 * 60);
  const validForMins = sanitiseValidForMinsConfig(tokenValidMins);
  if (elapsedMins > validForMins) {
    return {
      success: false,
      code: 'TOKEN_EXPIRED'
    };
  }

  // Authenticated!
  return {
    success: true,
    item
  };
}

function getAuthTokenErrorMessage({
  code
}) {
  switch (code) {
    case 'FAILURE':
      return 'Auth token redemption failed.';
    case 'TOKEN_EXPIRED':
      return 'The auth token provided has expired.';
    case 'TOKEN_REDEEMED':
      return 'Auth tokens are single use and the auth token provided has already been redeemed.';
  }
}

const errorCodes$1 = ['FAILURE', 'TOKEN_EXPIRED', 'TOKEN_REDEEMED'];
const PasswordResetRedemptionErrorCode = core.graphql.enum({
  name: 'PasswordResetRedemptionErrorCode',
  values: core.graphql.enumValues(errorCodes$1)
});
function getPasswordResetSchema({
  listKey,
  identityField,
  secretField,
  gqlNames,
  passwordResetLink,
  passwordResetTokenSecretFieldImpl
}) {
  const getResult = name => core.graphql.object()({
    name,
    fields: {
      code: core.graphql.field({
        type: core.graphql.nonNull(PasswordResetRedemptionErrorCode)
      }),
      message: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      })
    }
  });
  const ValidateItemPasswordResetTokenResult = getResult(gqlNames.ValidateItemPasswordResetTokenResult);
  const RedeemItemPasswordResetTokenResult = getResult(gqlNames.RedeemItemPasswordResetTokenResult);
  return {
    mutation: {
      [gqlNames.sendItemPasswordResetLink]: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.Boolean),
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, {
          [identityField]: identity
        }, context) {
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'passwordReset';
          const result = await createAuthToken(identityField, identity, dbItemAPI);

          // Update system state
          if (result.success) {
            // Save the token and related info back to the item
            const {
              token,
              itemId
            } = result;
            await dbItemAPI.updateOne({
              where: {
                id: `${itemId}`
              },
              data: {
                [`${tokenType}Token`]: token,
                [`${tokenType}IssuedAt`]: new Date().toISOString(),
                [`${tokenType}RedeemedAt`]: null
              }
            });
            await passwordResetLink.sendToken({
              itemId,
              identity,
              token,
              context
            });
          }
          return true;
        }
      }),
      [gqlNames.redeemItemPasswordResetToken]: core.graphql.field({
        type: RedeemItemPasswordResetTokenResult,
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          token: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          [secretField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, {
          [identityField]: identity,
          token,
          [secretField]: secret
        }, context) {
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'passwordReset';
          const result = await validateAuthToken(listKey, passwordResetTokenSecretFieldImpl, tokenType, identityField, identity, passwordResetLink.tokensValidForMins, token, dbItemAPI);
          if (!result.success) {
            return {
              code: result.code,
              message: getAuthTokenErrorMessage({
                code: result.code
              })
            };
          }

          // Update system state
          const itemId = result.item.id;
          // Save the token and related info back to the item
          await dbItemAPI.updateOne({
            where: {
              id: itemId
            },
            data: {
              [`${tokenType}RedeemedAt`]: new Date().toISOString()
            }
          });

          // Save the provided secret. Do this as a separate step as password validation
          // may fail, in which case we still want to mark the token as redeemed
          // (NB: Is this *really* what we want? -TL)
          await dbItemAPI.updateOne({
            where: {
              id: itemId
            },
            data: {
              [secretField]: secret
            }
          });
          return null;
        }
      })
    },
    query: {
      [gqlNames.validateItemPasswordResetToken]: core.graphql.field({
        type: ValidateItemPasswordResetTokenResult,
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          token: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, {
          [identityField]: identity,
          token
        }, context) {
          const dbItemAPI = context.sudo().db[listKey];
          const result = await validateAuthToken(listKey, passwordResetTokenSecretFieldImpl, 'passwordReset', identityField, identity, passwordResetLink.tokensValidForMins, token, dbItemAPI);
          if (!result.success) {
            return {
              code: result.code,
              message: getAuthTokenErrorMessage({
                code: result.code
              })
            };
          }
          return null;
        }
      })
    }
  };
}

const errorCodes = ['FAILURE', 'TOKEN_EXPIRED', 'TOKEN_REDEEMED'];
const MagicLinkRedemptionErrorCode = core.graphql.enum({
  name: 'MagicLinkRedemptionErrorCode',
  values: core.graphql.enumValues(errorCodes)
});
function getMagicAuthLinkSchema({
  listKey,
  identityField,
  gqlNames,
  magicAuthLink,
  magicAuthTokenSecretFieldImpl,
  base
}) {
  const RedeemItemMagicAuthTokenFailure = core.graphql.object()({
    name: gqlNames.RedeemItemMagicAuthTokenFailure,
    fields: {
      code: core.graphql.field({
        type: core.graphql.nonNull(MagicLinkRedemptionErrorCode)
      }),
      message: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      })
    }
  });
  const RedeemItemMagicAuthTokenSuccess = core.graphql.object()({
    name: gqlNames.RedeemItemMagicAuthTokenSuccess,
    fields: {
      token: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      }),
      item: core.graphql.field({
        type: core.graphql.nonNull(base.object(listKey))
      })
    }
  });
  const RedeemItemMagicAuthTokenResult = core.graphql.union({
    name: gqlNames.RedeemItemMagicAuthTokenResult,
    types: [RedeemItemMagicAuthTokenSuccess, RedeemItemMagicAuthTokenFailure],
    resolveType(val) {
      return 'token' in val ? gqlNames.RedeemItemMagicAuthTokenSuccess : gqlNames.RedeemItemMagicAuthTokenFailure;
    }
  });
  return {
    mutation: {
      [gqlNames.sendItemMagicAuthLink]: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.Boolean),
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, {
          [identityField]: identity
        }, context) {
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'magicAuth';
          const result = await createAuthToken(identityField, identity, dbItemAPI);

          // Update system state
          if (result.success) {
            // Save the token and related info back to the item
            const {
              token,
              itemId
            } = result;
            await dbItemAPI.updateOne({
              where: {
                id: `${itemId}`
              },
              data: {
                [`${tokenType}Token`]: token,
                [`${tokenType}IssuedAt`]: new Date().toISOString(),
                [`${tokenType}RedeemedAt`]: null
              }
            });
            await magicAuthLink.sendToken({
              itemId,
              identity,
              token,
              context
            });
          }
          return true;
        }
      }),
      [gqlNames.redeemItemMagicAuthToken]: core.graphql.field({
        type: core.graphql.nonNull(RedeemItemMagicAuthTokenResult),
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          token: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, {
          [identityField]: identity,
          token
        }, context) {
          if (!context.sessionStrategy) throw new Error('No session implementation available on context');
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'magicAuth';
          const result = await validateAuthToken(listKey, magicAuthTokenSecretFieldImpl, tokenType, identityField, identity, magicAuthLink.tokensValidForMins, token, dbItemAPI);
          if (!result.success) {
            return {
              code: result.code,
              message: getAuthTokenErrorMessage({
                code: result.code
              })
            };
          }

          // Update system state
          // Save the token and related info back to the item
          await dbItemAPI.updateOne({
            where: {
              id: result.item.id
            },
            data: {
              [`${tokenType}RedeemedAt`]: new Date().toISOString()
            }
          });
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: result.item.id.toString()
            },
            context
          });

          // return Failure if sessionStrategy.start() is incompatible
          if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
            return {
              code: 'FAILURE',
              message: 'Failed to start session.'
            };
          }
          return {
            token: sessionToken,
            item: result.item
          };
        }
      })
    }
  };
}

function assertSecretFieldImpl(impl, listKey, secretField) {
  if (!impl || typeof impl.compare !== 'function' || impl.compare.length < 2 || typeof impl.generateHash !== 'function') {
    const s = JSON.stringify(secretField);
    const msg = `A createAuth() invocation for the "${listKey}" list specifies ${s} as its secretField, but the field type doesn't implement the required functionality.`;
    throw new Error(msg);
  }
}
function getSecretFieldImpl(schema, listKey, fieldKey) {
  var _gqlOutputType$getFie;
  const gqlOutputType = graphql.assertObjectType(schema.getType(listKey));
  const secretFieldImpl = (_gqlOutputType$getFie = gqlOutputType.getFields()) === null || _gqlOutputType$getFie === void 0 || (_gqlOutputType$getFie = _gqlOutputType$getFie[fieldKey].extensions) === null || _gqlOutputType$getFie === void 0 ? void 0 : _gqlOutputType$getFie.keystoneSecretField;
  assertSecretFieldImpl(secretFieldImpl, listKey, fieldKey);
  return secretFieldImpl;
}
const getSchemaExtension = ({
  identityField,
  listKey,
  secretField,
  gqlNames,
  initFirstItem,
  passwordResetLink,
  magicAuthLink,
  sessionData
}) => core.graphql.extend(base => {
  const uniqueWhereInputType = graphql.assertInputObjectType(base.schema.getType(`${listKey}WhereUniqueInput`));
  const identityFieldOnUniqueWhere = uniqueWhereInputType.getFields()[identityField];
  if (base.schema.extensions.sudo && (identityFieldOnUniqueWhere === null || identityFieldOnUniqueWhere === void 0 ? void 0 : identityFieldOnUniqueWhere.type) !== graphql.GraphQLString && (identityFieldOnUniqueWhere === null || identityFieldOnUniqueWhere === void 0 ? void 0 : identityFieldOnUniqueWhere.type) !== graphql.GraphQLID) {
    throw new Error(`createAuth was called with an identityField of ${identityField} on the list ${listKey} ` + `but that field doesn't allow being searched uniquely with a String or ID. ` + `You should likely add \`isIndexed: 'unique'\` ` + `to the field at ${listKey}.${identityField}`);
  }
  const baseSchema = getBaseAuthSchema({
    identityField,
    listKey,
    secretField,
    gqlNames,
    secretFieldImpl: getSecretFieldImpl(base.schema, listKey, secretField),
    base
  });

  // technically this will incorrectly error if someone has a schema extension that adds a field to the list output type
  // and then wants to fetch that field with `sessionData` but it's extremely unlikely someone will do that since if
  // they want to add a GraphQL field, they'll probably use a virtual field
  const {
    itemQueryName
  } = types.getGqlNames({
    listKey,
    pluralGraphQLName: ''
  });
  const query = `query($id: ID!) { ${itemQueryName}(where: { id: $id }) { ${sessionData} } }`;
  let ast;
  try {
    ast = graphql.parse(query);
  } catch (err) {
    throw new Error(`The query to get session data has a syntax error, the sessionData option in your createAuth usage is likely incorrect\n${err}`);
  }
  const errors = graphql.validate(base.schema, ast);
  if (errors.length) {
    throw new Error(`The query to get session data has validation errors, the sessionData option in your createAuth usage is likely incorrect\n${errors.join('\n')}`);
  }
  return [baseSchema.extension, initFirstItem && getInitFirstItemSchema({
    listKey,
    fields: initFirstItem.fields,
    itemData: initFirstItem.itemData,
    gqlNames,
    graphQLSchema: base.schema,
    ItemAuthenticationWithPasswordSuccess: baseSchema.ItemAuthenticationWithPasswordSuccess
  }), passwordResetLink && getPasswordResetSchema({
    identityField,
    listKey,
    secretField,
    passwordResetLink,
    gqlNames,
    passwordResetTokenSecretFieldImpl: getSecretFieldImpl(base.schema, listKey, 'passwordResetToken')
  }), magicAuthLink && getMagicAuthLinkSchema({
    identityField,
    listKey,
    magicAuthLink,
    gqlNames,
    magicAuthTokenSecretFieldImpl: getSecretFieldImpl(base.schema, listKey, 'magicAuthToken'),
    base
  })].filter(x => x !== undefined);
});

const signinTemplate = ({
  gqlNames,
  identityField,
  secretField
}) => {
  // -- TEMPLATE START
  return `import { getSigninPage } from '@keystone-6/auth/pages/SigninPage'

export default getSigninPage(${JSON.stringify({
    identityField: identityField,
    secretField: secretField,
    mutationName: gqlNames.authenticateItemWithPassword,
    successTypename: gqlNames.ItemAuthenticationWithPasswordSuccess,
    failureTypename: gqlNames.ItemAuthenticationWithPasswordFailure
  })});
`;
  // -- TEMPLATE END
};

const initTemplate = ({
  listKey,
  initFirstItem
}) => {
  // -- TEMPLATE START
  return `import { getInitPage } from '@keystone-6/auth/pages/InitPage';

const fieldPaths = ${JSON.stringify(initFirstItem.fields)};

export default getInitPage(${JSON.stringify({
    listKey,
    fieldPaths: initFirstItem.fields,
    enableWelcome: !initFirstItem.skipKeystoneWelcome
  })});
`;
  // -- TEMPLATE END
};

// TODO: use TypeInfo and listKey for types
/**
 * createAuth function
 *
 * Generates config for Keystone to implement standard auth features.
 */
function createAuth({
  listKey,
  secretField,
  initFirstItem,
  identityField,
  magicAuthLink,
  passwordResetLink,
  sessionData = 'id'
}) {
  const gqlNames = {
    // Core
    authenticateItemWithPassword: `authenticate${listKey}WithPassword`,
    ItemAuthenticationWithPasswordResult: `${listKey}AuthenticationWithPasswordResult`,
    ItemAuthenticationWithPasswordSuccess: `${listKey}AuthenticationWithPasswordSuccess`,
    ItemAuthenticationWithPasswordFailure: `${listKey}AuthenticationWithPasswordFailure`,
    // Initial data
    CreateInitialInput: `CreateInitial${listKey}Input`,
    createInitialItem: `createInitial${listKey}`,
    // Password reset
    sendItemPasswordResetLink: `send${listKey}PasswordResetLink`,
    SendItemPasswordResetLinkResult: `Send${listKey}PasswordResetLinkResult`,
    validateItemPasswordResetToken: `validate${listKey}PasswordResetToken`,
    ValidateItemPasswordResetTokenResult: `Validate${listKey}PasswordResetTokenResult`,
    redeemItemPasswordResetToken: `redeem${listKey}PasswordResetToken`,
    RedeemItemPasswordResetTokenResult: `Redeem${listKey}PasswordResetTokenResult`,
    // Magic auth
    sendItemMagicAuthLink: `send${listKey}MagicAuthLink`,
    SendItemMagicAuthLinkResult: `Send${listKey}MagicAuthLinkResult`,
    redeemItemMagicAuthToken: `redeem${listKey}MagicAuthToken`,
    RedeemItemMagicAuthTokenResult: `Redeem${listKey}MagicAuthTokenResult`,
    RedeemItemMagicAuthTokenSuccess: `Redeem${listKey}MagicAuthTokenSuccess`,
    RedeemItemMagicAuthTokenFailure: `Redeem${listKey}MagicAuthTokenFailure`
  };

  /**
   * fields
   *
   * Fields added to the auth list.
   */
  const fieldConfig = {
    access: () => false,
    ui: {
      createView: {
        fieldMode: 'hidden'
      },
      itemView: {
        fieldMode: 'hidden'
      },
      listView: {
        fieldMode: 'hidden'
      }
    }
  };
  const authFields = {
    ...(passwordResetLink ? {
      passwordResetToken: fields.password({
        ...fieldConfig
      }),
      passwordResetIssuedAt: fields.timestamp({
        ...fieldConfig
      }),
      passwordResetRedeemedAt: fields.timestamp({
        ...fieldConfig
      })
    } : null),
    ...(magicAuthLink ? {
      magicAuthToken: fields.password({
        ...fieldConfig
      }),
      magicAuthIssuedAt: fields.timestamp({
        ...fieldConfig
      }),
      magicAuthRedeemedAt: fields.timestamp({
        ...fieldConfig
      })
    } : null)
  };

  /**
   * getAdditionalFiles
   *
   * This function adds files to be generated into the Admin UI build. Must be added to the
   * ui.getAdditionalFiles config.
   *
   * The signin page is always included, and the init page is included when initFirstItem is set
   */
  const authGetAdditionalFiles = () => {
    const filesToWrite = [{
      mode: 'write',
      src: signinTemplate({
        gqlNames,
        identityField,
        secretField
      }),
      outputPath: 'pages/signin.js'
    }];
    if (initFirstItem) {
      filesToWrite.push({
        mode: 'write',
        src: initTemplate({
          listKey,
          initFirstItem
        }),
        outputPath: 'pages/init.js'
      });
    }
    return filesToWrite;
  };

  /**
   * extendGraphqlSchema
   *
   * Must be added to the extendGraphqlSchema config. Can be composed.
   */
  const authExtendGraphqlSchema = getSchemaExtension({
    identityField,
    listKey,
    secretField,
    gqlNames,
    initFirstItem,
    passwordResetLink,
    magicAuthLink,
    sessionData
  });
  function throwIfInvalidConfig(config) {
    if (!(listKey in config.lists)) {
      throw new Error(`withAuth cannot find the list "${listKey}"`);
    }

    // TODO: verify that the identity field is unique
    // TODO: verify that the field is required
    const list = config.lists[listKey];
    if (!(identityField in list.fields)) {
      throw new Error(`withAuth cannot find the identity field "${listKey}.${identityField}"`);
    }
    if (!(secretField in list.fields)) {
      throw new Error(`withAuth cannot find the secret field "${listKey}.${secretField}"`);
    }
    for (const fieldKey of (initFirstItem === null || initFirstItem === void 0 ? void 0 : initFirstItem.fields) || []) {
      if (fieldKey in list.fields) continue;
      throw new Error(`initFirstItem.fields has unknown field "${listKey}.${fieldKey}"`);
    }
  }

  // this strategy wraps the existing session strategy,
  //   and injects the requested session.data before returning
  function authSessionStrategy(_sessionStrategy) {
    const {
      get,
      ...sessionStrategy
    } = _sessionStrategy;
    return {
      ...sessionStrategy,
      get: async ({
        context
      }) => {
        const session = await get({
          context
        });
        const sudoContext = context.sudo();
        if (!session) return;
        if (!session.itemId) return;
        if (session.listKey !== listKey) return;
        try {
          const data = await sudoContext.query[listKey].findOne({
            where: {
              id: session.itemId
            },
            query: sessionData
          });
          if (!data) return;
          return {
            ...session,
            itemId: session.itemId,
            listKey,
            data
          };
        } catch (e) {
          console.error(e);
          // TODO: the assumption is this could only be from an invalid sessionData configuration
          //   it could be something else though, either way, result is a bad session
          return;
        }
      }
    };
  }
  async function hasInitFirstItemConditions(context) {
    // do nothing if they aren't using this feature
    if (!initFirstItem) return false;

    // if they have a session, there is no initialisation necessary
    if (context.session) return false;
    const count = await context.sudo().db[listKey].count({});
    return count === 0;
  }
  async function authMiddleware({
    context,
    wasAccessAllowed,
    basePath
  }) {
    const {
      req
    } = context;
    const {
      pathname
    } = new URL(req.url, 'http://_');

    // redirect to init if initFirstItem conditions are met
    if (pathname !== `${basePath}/init` && (await hasInitFirstItemConditions(context))) {
      return {
        kind: 'redirect',
        to: `${basePath}/init`
      };
    }

    // redirect to / if attempting to /init and initFirstItem conditions are not met
    if (pathname === `${basePath}/init` && !(await hasInitFirstItemConditions(context))) {
      return {
        kind: 'redirect',
        to: basePath
      };
    }

    // don't redirect if we have access
    if (wasAccessAllowed) return;

    // otherwise, redirect to signin
    return {
      kind: 'redirect',
      to: `${basePath}/signin`
    };
  }
  function defaultIsAccessAllowed({
    session,
    sessionStrategy
  }) {
    return session !== undefined;
  }
  function defaultExtendGraphqlSchema(schema) {
    return schema;
  }

  /**
   * withAuth
   *
   * Automatically extends your configuration with a prescriptive implementation.
   */
  function withAuth(config) {
    var _ui;
    throwIfInvalidConfig(config);
    let {
      ui
    } = config;
    if (!((_ui = ui) !== null && _ui !== void 0 && _ui.isDisabled)) {
      var _ui$basePath, _ui2;
      const {
        getAdditionalFiles = [],
        isAccessAllowed = defaultIsAccessAllowed,
        pageMiddleware,
        publicPages = []
      } = ui || {};
      const authPublicPages = [`${(_ui$basePath = (_ui2 = ui) === null || _ui2 === void 0 ? void 0 : _ui2.basePath) !== null && _ui$basePath !== void 0 ? _ui$basePath : ''}/signin`];
      ui = {
        ...ui,
        publicPages: [...publicPages, ...authPublicPages],
        getAdditionalFiles: [...getAdditionalFiles, authGetAdditionalFiles],
        isAccessAllowed: async context => {
          if (await hasInitFirstItemConditions(context)) return true;
          return isAccessAllowed(context);
        },
        pageMiddleware: async args => {
          const shouldRedirect = await authMiddleware(args);
          if (shouldRedirect) return shouldRedirect;
          return pageMiddleware === null || pageMiddleware === void 0 ? void 0 : pageMiddleware(args);
        }
      };
    }
    if (!config.session) throw new TypeError('Missing .session configuration');
    const {
      graphql
    } = config;
    const {
      extendGraphqlSchema = defaultExtendGraphqlSchema
    } = graphql !== null && graphql !== void 0 ? graphql : {};
    const authListConfig = config.lists[listKey];
    return {
      ...config,
      graphql: {
        ...config.graphql,
        extendGraphqlSchema: schema => {
          return extendGraphqlSchema(authExtendGraphqlSchema(schema));
        }
      },
      ui,
      session: authSessionStrategy(config.session),
      lists: {
        ...config.lists,
        [listKey]: {
          ...authListConfig,
          fields: {
            ...authListConfig.fields,
            ...authFields
          }
        }
      }
    };
  }
  return {
    withAuth
  };
}

exports.createAuth = createAuth;

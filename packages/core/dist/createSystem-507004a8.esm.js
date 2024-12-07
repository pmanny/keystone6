import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { GraphQLScalarType, GraphQLObjectType, Kind, OperationTypeNode, GraphQLSchema, execute, astFromValue, GraphQLNonNull, GraphQLList, assertInputObjectType, parse, validate as validate$1, print, graphql as graphql$1, isInputObjectType, GraphQLString, GraphQLError } from 'graphql';
import { allowAll } from '../access/dist/keystone-6-core-access.esm.js';
import 'pluralize';
import { f as fieldType, o as orderDirectionEnum, Q as QueryMode, _ as __getNames } from './next-fields-2535337e.esm.js';
import { f as field, g as graphqlBoundToKeystoneContext, E as Empty, J as JSON$1 } from './graphql-ts-schema-5ba48382.esm.js';
import { u as userInputError, e as extensionError, a as accessReturnError, b as accessDeniedError, f as filterAccessError, l as limitsExceededError, v as validationFailureError, r as resolverError, c as relationshipError, d as createAdminMeta } from './create-admin-meta-164cca6b.esm.js';
import { arg, ID, list, nonNull as nonNull$1, inputObject, Int, Boolean } from '@graphql-ts/schema/api-without-context';
import { bindGraphQLSchemaAPIToContext } from '@graphql-ts/schema';
import { maybeCacheControlFromInfo } from '@apollo/cache-control-types';
import { getVariableValues } from 'graphql/execution/values';
import _classPrivateFieldInitSpec from '@babel/runtime/helpers/esm/classPrivateFieldInitSpec';
import _classPrivateFieldGet from '@babel/runtime/helpers/esm/classPrivateFieldGet2';
import _classPrivateFieldSet from '@babel/runtime/helpers/esm/classPrivateFieldSet2';
import { object } from '@graphql-ts/schema/api-with-context';
import imageSize from 'image-size';
import fs from 'node:fs/promises';
import fs$1 from 'node:fs';
import { pipeline } from 'node:stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import DataLoader from 'dataloader';

function isInt(x) {
  if (x === null) return;
  if (x === '') return;
  const nom = typeof x === 'string' ? Number(x) : x;
  if (Number.isInteger(nom)) return nom;
}
function isBigInt(x) {
  if (x === null) return;
  if (x === '') return;
  try {
    return BigInt(x);
  } catch {}
}
function isString(x) {
  if (typeof x !== 'string') return;
  if (x === '') return;
  return x;
}

// TODO: this should be on the user, remove in breaking change?
function isUuid(x) {
  if (typeof x !== 'string') return;
  if (x === '') return;
  return x.toLowerCase();
}
const nonCircularFields = {
  equals: arg({
    type: ID
  }),
  in: arg({
    type: list(nonNull$1(ID))
  }),
  notIn: arg({
    type: list(nonNull$1(ID))
  }),
  lt: arg({
    type: ID
  }),
  lte: arg({
    type: ID
  }),
  gt: arg({
    type: ID
  }),
  gte: arg({
    type: ID
  })
};
const IDFilter = inputObject({
  name: 'IDFilter',
  fields: () => ({
    ...nonCircularFields,
    not: arg({
      type: IDFilter
    })
  })
});
const filterArg = arg({
  type: IDFilter
});
function resolveInput(input, parseId) {
  const where = {};
  if (input === null) return where;
  for (const key of ['equals', 'gt', 'gte', 'lt', 'lte']) {
    const value = input[key];
    if (value === undefined) continue;
    where[key] = parseId(value);
  }
  for (const key of ['in', 'notIn']) {
    const value = input[key];
    if (!Array.isArray(value)) continue;
    where[key] = value.map(x => parseId(x));
  }
  if (input.not !== undefined) {
    where.not = resolveInput(input.not, parseId);
  }
  return where;
}
const NATIVE_TYPES = {
  postgresql: {
    uuid: 'Uuid'
  }
};
function unpack(i) {
  if (i.kind === 'random') {
    const {
      kind,
      bytes,
      encoding
    } = i;
    if (typeof bytes === 'number') {
      if (bytes !== bytes >>> 0) {
        throw new TypeError(`Expected positive integer for random bytes, not ${bytes}`);
      }
    }
    return {
      kind,
      type: 'String',
      // our defaults are 32 bytes, as base64url
      //   256 / Math.log2(64) ~ 43 characters
      //
      // for case-insensitive databases that is
      //   225 bits ~ Math.log2((26 + 10 + 2) ** 43)
      default_: {
        kind,
        bytes: bytes !== null && bytes !== void 0 ? bytes : 32,
        encoding: encoding !== null && encoding !== void 0 ? encoding : 'base64url'
      }
    };
  }
  const {
    kind,
    type
  } = i;
  if (kind === 'cuid') return {
    kind: 'cuid',
    type: 'String',
    default_: {
      kind
    }
  };
  if (kind === 'uuid') return {
    kind: 'uuid',
    type: 'String',
    default_: {
      kind
    }
  };
  if (kind === 'string') return {
    kind: 'string',
    type: 'String',
    default_: undefined
  };
  if (kind === 'number') return {
    kind: 'number',
    type: type !== null && type !== void 0 ? type : 'Int',
    default_: undefined
  };
  if (kind === 'autoincrement') return {
    kind: 'autoincrement',
    type: type !== null && type !== void 0 ? type : 'Int',
    default_: {
      kind
    }
  };
  throw new Error(`Unknown id type ${kind}`);
}
function idFieldType(config) {
  const {
    kind,
    type: type_,
    default_
  } = unpack(config);
  const parseTypeFn = {
    Int: isInt,
    BigInt: isBigInt,
    String: isString,
    UUID: isUuid // TODO: remove in breaking change
  }[kind === 'uuid' ? 'UUID' : type_];
  function parse(value) {
    const result = parseTypeFn(value);
    if (result === undefined) {
      throw userInputError(`Only a ${type_.toLowerCase()} can be passed to id filters`);
    }
    return result;
  }
  return meta => {
    var _NATIVE_TYPES$meta$pr;
    if (meta.provider === 'sqlite' && kind === 'autoincrement' && type_ === 'BigInt') {
      throw new Error(`{ kind: ${kind}, type: ${type_} } is not supported by SQLite`);
    }
    return fieldType({
      kind: 'scalar',
      mode: 'required',
      scalar: type_,
      nativeType: (_NATIVE_TYPES$meta$pr = NATIVE_TYPES[meta.provider]) === null || _NATIVE_TYPES$meta$pr === void 0 ? void 0 : _NATIVE_TYPES$meta$pr[kind],
      default: default_
    })({
      ...config,
      // the ID field is always filterable and orderable
      isFilterable: true,
      // TODO: should it be?
      isOrderable: true,
      // TODO: should it be?

      input: {
        where: {
          arg: filterArg,
          resolve(val) {
            return resolveInput(val, parse);
          }
        },
        uniqueWhere: {
          arg: arg({
            type: ID
          }),
          resolve: parse
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: nonNull$1(ID),
        resolve({
          value
        }) {
          return value.toString();
        }
      }),
      views: '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/id-field-view',
      getAdminMeta: () => ({
        kind,
        type: type_
      }),
      ui: {
        createView: {
          fieldMode: 'hidden'
        },
        itemView: {
          fieldMode: 'hidden'
        }
      }
    });
  };
}

function injectDefaults(config, defaultIdField) {
  // some error checking
  for (const [listKey, list] of Object.entries(config.lists)) {
    var _list$db;
    if (list.fields.id) {
      throw new Error(`"fields.id" is reserved by Keystone, use "db.idField" for the "${listKey}" list`);
    }
    if (list.isSingleton && (_list$db = list.db) !== null && _list$db !== void 0 && _list$db.idField) {
      throw new Error(`"db.idField" on the "${listKey}" list conflicts with singleton defaults`);
    }
  }
  const updated = {};
  for (const [listKey, list] of Object.entries(config.lists)) {
    var _list$db$idField, _list$db2;
    if (list.isSingleton) {
      updated[listKey] = {
        listKey,
        ...list,
        fields: {
          id: idFieldType({
            kind: 'number',
            type: 'Int'
          }),
          ...list.fields
        }
      };
      continue;
    }
    updated[listKey] = {
      listKey,
      ...list,
      fields: {
        id: idFieldType((_list$db$idField = (_list$db2 = list.db) === null || _list$db2 === void 0 ? void 0 : _list$db2.idField) !== null && _list$db$idField !== void 0 ? _list$db$idField : defaultIdField),
        ...list.fields
      }
    };
  }

  /** @deprecated, TODO: remove in breaking change */
  for (const [listKey, list] of Object.entries(updated)) {
    if (list.hooks === undefined) continue;
    if (list.hooks.validate !== undefined) {
      if (list.hooks.validateInput !== undefined) throw new TypeError(`"hooks.validate" conflicts with "hooks.validateInput" for the "${listKey}" list`);
      if (list.hooks.validateDelete !== undefined) throw new TypeError(`"hooks.validate" conflicts with "hooks.validateDelete" for the "${listKey}" list`);
      continue;
    }
    list.hooks = {
      ...list.hooks,
      validate: {
        create: list.hooks.validateInput,
        update: list.hooks.validateInput,
        delete: list.hooks.validateDelete
      }
    };
  }
  return updated;
}
function defaultIsAccessAllowed$1({
  session,
  sessionStrategy
}) {
  if (!sessionStrategy) return true;
  return session !== undefined;
}
async function noop() {}
function identity(x) {
  return x;
}
function resolveDefaults(config) {
  var _config$db, _config$db$url, _config$db$idField, _config$server, _config$server2, _config$server$cors, _config$server3, _config$types$path, _config$types, _config$db$shadowData, _config$db2, _config$db$extendPris, _config$db3, _config$db$extendPris2, _config$db4, _config$db$onConnect, _config$db$prismaClie, _config$db5, _config$db$prismaSche, _config$db6, _config$db$idField2, _config$db7, _config$db$enableLogg, _config$graphql$path, _config$graphql, _config$graphql$playg, _config$graphql2, _config$graphql$schem, _config$graphql3, _config$graphql$exten, _config$graphql4, _config$server$maxFil, _config$server4, _config$server$extend, _config$server5, _config$server$extend2, _config$server6, _config$telemetry, _config$ui$basePath, _config$ui, _config$ui$isAccessAl, _config$ui2, _config$ui$isDisabled, _config$ui3, _config$ui$getAdditio, _config$ui4, _config$ui$pageMiddle, _config$ui5, _config$ui$publicPage, _config$ui6;
  if (!['postgresql', 'sqlite', 'mysql'].includes(config.db.provider)) {
    throw new TypeError(`"db.provider" only supports "sqlite", "postgresql" or "mysql"`);
  }

  // WARNING: Typescript should prevent this, but any string is useful for Prisma errors
  (_config$db$url = (_config$db = config.db).url) !== null && _config$db$url !== void 0 ? _config$db$url : _config$db.url = 'postgres://';
  const defaultIdField = (_config$db$idField = config.db.idField) !== null && _config$db$idField !== void 0 ? _config$db$idField : {
    kind: 'cuid'
  };
  const cors = ((_config$server = config.server) === null || _config$server === void 0 ? void 0 : _config$server.cors) === true ? {
    origin: true,
    credentials: true
  } : ((_config$server2 = config.server) === null || _config$server2 === void 0 ? void 0 : _config$server2.cors) === false ? null : (_config$server$cors = (_config$server3 = config.server) === null || _config$server3 === void 0 ? void 0 : _config$server3.cors) !== null && _config$server$cors !== void 0 ? _config$server$cors : null;
  const httpOptions = {
    port: 3000
  };
  if (config !== null && config !== void 0 && config.server && 'port' in config.server) {
    httpOptions.port = config.server.port;
  }
  if (config !== null && config !== void 0 && config.server && 'options' in config.server && config.server.options) {
    Object.assign(httpOptions, config.server.options);
  }
  return {
    types: {
      ...config.types,
      path: (_config$types$path = (_config$types = config.types) === null || _config$types === void 0 ? void 0 : _config$types.path) !== null && _config$types$path !== void 0 ? _config$types$path : 'node_modules/.keystone/types.ts'
    },
    db: {
      ...config.db,
      shadowDatabaseUrl: (_config$db$shadowData = (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.shadowDatabaseUrl) !== null && _config$db$shadowData !== void 0 ? _config$db$shadowData : '',
      extendPrismaSchema: (_config$db$extendPris = (_config$db3 = config.db) === null || _config$db3 === void 0 ? void 0 : _config$db3.extendPrismaSchema) !== null && _config$db$extendPris !== void 0 ? _config$db$extendPris : identity,
      extendPrismaClient: (_config$db$extendPris2 = (_config$db4 = config.db) === null || _config$db4 === void 0 ? void 0 : _config$db4.extendPrismaClient) !== null && _config$db$extendPris2 !== void 0 ? _config$db$extendPris2 : identity,
      onConnect: (_config$db$onConnect = config.db.onConnect) !== null && _config$db$onConnect !== void 0 ? _config$db$onConnect : noop,
      prismaClientPath: (_config$db$prismaClie = (_config$db5 = config.db) === null || _config$db5 === void 0 ? void 0 : _config$db5.prismaClientPath) !== null && _config$db$prismaClie !== void 0 ? _config$db$prismaClie : '@prisma/client',
      prismaSchemaPath: (_config$db$prismaSche = (_config$db6 = config.db) === null || _config$db6 === void 0 ? void 0 : _config$db6.prismaSchemaPath) !== null && _config$db$prismaSche !== void 0 ? _config$db$prismaSche : 'schema.prisma',
      idField: (_config$db$idField2 = (_config$db7 = config.db) === null || _config$db7 === void 0 ? void 0 : _config$db7.idField) !== null && _config$db$idField2 !== void 0 ? _config$db$idField2 : defaultIdField,
      enableLogging: config.db.enableLogging === true ? ['query'] : config.db.enableLogging === false ? [] : (_config$db$enableLogg = config.db.enableLogging) !== null && _config$db$enableLogg !== void 0 ? _config$db$enableLogg : []
    },
    graphql: {
      ...config.graphql,
      path: (_config$graphql$path = (_config$graphql = config.graphql) === null || _config$graphql === void 0 ? void 0 : _config$graphql.path) !== null && _config$graphql$path !== void 0 ? _config$graphql$path : '/api/graphql',
      playground: (_config$graphql$playg = (_config$graphql2 = config.graphql) === null || _config$graphql2 === void 0 ? void 0 : _config$graphql2.playground) !== null && _config$graphql$playg !== void 0 ? _config$graphql$playg : process.env.NODE_ENV !== 'production',
      schemaPath: (_config$graphql$schem = (_config$graphql3 = config.graphql) === null || _config$graphql3 === void 0 ? void 0 : _config$graphql3.schemaPath) !== null && _config$graphql$schem !== void 0 ? _config$graphql$schem : 'schema.graphql',
      extendGraphqlSchema: (_config$graphql$exten = (_config$graphql4 = config.graphql) === null || _config$graphql4 === void 0 ? void 0 : _config$graphql4.extendGraphqlSchema) !== null && _config$graphql$exten !== void 0 ? _config$graphql$exten : s => s
    },
    lists: injectDefaults(config, defaultIdField),
    server: {
      ...config.server,
      maxFileSize: (_config$server$maxFil = (_config$server4 = config.server) === null || _config$server4 === void 0 ? void 0 : _config$server4.maxFileSize) !== null && _config$server$maxFil !== void 0 ? _config$server$maxFil : 200 * 1024 * 1024,
      // 200 MiB
      extendExpressApp: (_config$server$extend = (_config$server5 = config.server) === null || _config$server5 === void 0 ? void 0 : _config$server5.extendExpressApp) !== null && _config$server$extend !== void 0 ? _config$server$extend : noop,
      extendHttpServer: (_config$server$extend2 = (_config$server6 = config.server) === null || _config$server6 === void 0 ? void 0 : _config$server6.extendHttpServer) !== null && _config$server$extend2 !== void 0 ? _config$server$extend2 : noop,
      cors,
      options: httpOptions
    },
    session: config.session,
    storage: {
      ...config.storage
    },
    telemetry: (_config$telemetry = config.telemetry) !== null && _config$telemetry !== void 0 ? _config$telemetry : true,
    ui: {
      ...config.ui,
      basePath: (_config$ui$basePath = (_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.basePath) !== null && _config$ui$basePath !== void 0 ? _config$ui$basePath : '',
      isAccessAllowed: (_config$ui$isAccessAl = (_config$ui2 = config.ui) === null || _config$ui2 === void 0 ? void 0 : _config$ui2.isAccessAllowed) !== null && _config$ui$isAccessAl !== void 0 ? _config$ui$isAccessAl : defaultIsAccessAllowed$1,
      isDisabled: (_config$ui$isDisabled = (_config$ui3 = config.ui) === null || _config$ui3 === void 0 ? void 0 : _config$ui3.isDisabled) !== null && _config$ui$isDisabled !== void 0 ? _config$ui$isDisabled : false,
      getAdditionalFiles: (_config$ui$getAdditio = (_config$ui4 = config.ui) === null || _config$ui4 === void 0 ? void 0 : _config$ui4.getAdditionalFiles) !== null && _config$ui$getAdditio !== void 0 ? _config$ui$getAdditio : [],
      pageMiddleware: (_config$ui$pageMiddle = (_config$ui5 = config.ui) === null || _config$ui5 === void 0 ? void 0 : _config$ui5.pageMiddleware) !== null && _config$ui$pageMiddle !== void 0 ? _config$ui$pageMiddle : noop,
      publicPages: (_config$ui$publicPage = (_config$ui6 = config.ui) === null || _config$ui6 === void 0 ? void 0 : _config$ui6.publicPages) !== null && _config$ui$publicPage !== void 0 ? _config$ui$publicPage : []
    }
  };
}

const graphql = {
  ...graphqlBoundToKeystoneContext,
  ...bindGraphQLSchemaAPIToContext()
};
const KeystoneAdminUIFieldMeta = graphql.object()({
  name: 'KeystoneAdminUIFieldMeta',
  fields: {
    path: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    label: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    description: graphql.field({
      type: graphql.String
    }),
    ...contextFunctionField('isOrderable', graphql.Boolean),
    ...contextFunctionField('isFilterable', graphql.Boolean),
    isNonNull: graphql.field({
      type: graphql.list(graphql.nonNull(graphql.enum({
        name: 'KeystoneAdminUIFieldMetaIsNonNull',
        values: graphql.enumValues(['read', 'create', 'update'])
      })))
    }),
    fieldMeta: graphql.field({
      type: graphql.JSON
    }),
    viewsIndex: graphql.field({
      type: graphql.nonNull(graphql.Int)
    }),
    customViewsIndex: graphql.field({
      type: graphql.Int
    }),
    createView: graphql.field({
      type: graphql.nonNull(graphql.object()({
        name: 'KeystoneAdminUIFieldMetaCreateView',
        fields: contextFunctionField('fieldMode', graphql.enum({
          name: 'KeystoneAdminUIFieldMetaCreateViewFieldMode',
          values: graphql.enumValues(['edit', 'hidden'])
        }))
      }))
    }),
    listView: graphql.field({
      type: graphql.nonNull(graphql.object()({
        name: 'KeystoneAdminUIFieldMetaListView',
        fields: contextFunctionField('fieldMode', graphql.enum({
          name: 'KeystoneAdminUIFieldMetaListViewFieldMode',
          values: graphql.enumValues(['read', 'hidden'])
        }))
      }))
    }),
    itemView: graphql.field({
      args: {
        id: graphql.arg({
          type: graphql.ID
        })
      },
      resolve: ({
        itemView,
        listKey
      }, {
        id
      }) => ({
        listKey,
        fieldMode: itemView.fieldMode,
        itemId: id !== null && id !== void 0 ? id : null,
        fieldPosition: itemView.fieldPosition
      }),
      type: graphql.object()({
        name: 'KeystoneAdminUIFieldMetaItemView',
        fields: {
          fieldMode: graphql.field({
            type: graphql.enum({
              name: 'KeystoneAdminUIFieldMetaItemViewFieldMode',
              values: graphql.enumValues(['edit', 'read', 'hidden'])
            }),
            resolve({
              fieldMode,
              itemId,
              listKey
            }, args, context, info) {
              if (itemId !== null) assertInRuntimeContext(context, info);
              if (typeof fieldMode === 'string') return fieldMode;
              if (itemId === null) return null;

              // we need to re-assert this because typescript doesn't understand the relation between
              // rootVal.itemId !== null and the context being a runtime context
              assertInRuntimeContext(context, info);
              return fetchItemForItemViewFieldMode(context)(listKey, itemId).then(item => {
                if (item === null) return 'hidden';
                return fieldMode({
                  session: context.session,
                  context,
                  item
                });
              });
            }
          }),
          fieldPosition: graphql.field({
            type: graphql.enum({
              name: 'KeystoneAdminUIFieldMetaItemViewFieldPosition',
              values: graphql.enumValues(['form', 'sidebar'])
            }),
            resolve({
              fieldPosition,
              itemId,
              listKey
            }, args, context, info) {
              if (itemId !== null) assertInRuntimeContext(context, info);
              if (typeof fieldPosition === 'string') return fieldPosition;
              if (itemId === null) return null;
              assertInRuntimeContext(context, info);
              return fetchItemForItemViewFieldMode(context)(listKey, itemId).then(item => {
                if (item === null) {
                  return 'form';
                }
                return fieldPosition({
                  session: context.session,
                  context,
                  item
                });
              });
            }
          })
        }
      })
    }),
    search: graphql.field({
      type: QueryMode
    })
  }
});
const KeystoneAdminUIFieldGroupMeta = graphql.object()({
  name: 'KeystoneAdminUIFieldGroupMeta',
  fields: {
    label: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    description: graphql.field({
      type: graphql.String
    }),
    fields: graphql.field({
      type: graphql.nonNull(graphql.list(graphql.nonNull(KeystoneAdminUIFieldMeta)))
    })
  }
});
const KeystoneAdminUISort = graphql.object()({
  name: 'KeystoneAdminUISort',
  fields: {
    field: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    direction: graphql.field({
      type: graphql.nonNull(graphql.enum({
        name: 'KeystoneAdminUISortDirection',
        values: graphql.enumValues(['ASC', 'DESC'])
      }))
    })
  }
});
const KeystoneAdminUIGraphQLNames = graphql.object()({
  name: 'KeystoneAdminUIGraphQLNames',
  fields: {
    outputTypeName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    whereInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    whereUniqueInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    // create
    createInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    createMutationName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    createManyMutationName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    relateToOneForCreateInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    relateToManyForCreateInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    // read
    itemQueryName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    listOrderName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    listQueryCountName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    listQueryName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    // update
    updateInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    updateMutationName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    updateManyInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    updateManyMutationName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    relateToOneForUpdateInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    relateToManyForUpdateInputName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    // delete
    deleteMutationName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    deleteManyMutationName: graphql.field({
      type: graphql.nonNull(graphql.String)
    })
  }
});
const KeystoneAdminUIGraphQL = graphql.object()({
  name: 'KeystoneAdminUIGraphQL',
  fields: {
    names: graphql.field({
      type: graphql.nonNull(KeystoneAdminUIGraphQLNames)
    })
  }
});
const KeystoneAdminUIListMeta = graphql.object()({
  name: 'KeystoneAdminUIListMeta',
  fields: {
    key: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    path: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    label: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    singular: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    plural: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    description: graphql.field({
      type: graphql.String
    }),
    pageSize: graphql.field({
      type: graphql.nonNull(graphql.Int)
    }),
    labelField: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    fields: graphql.field({
      type: graphql.nonNull(graphql.list(graphql.nonNull(KeystoneAdminUIFieldMeta)))
    }),
    groups: graphql.field({
      type: graphql.nonNull(graphql.list(graphql.nonNull(KeystoneAdminUIFieldGroupMeta)))
    }),
    graphql: graphql.field({
      type: graphql.nonNull(KeystoneAdminUIGraphQL)
    }),
    initialColumns: graphql.field({
      type: graphql.nonNull(graphql.list(graphql.nonNull(graphql.String)))
    }),
    initialSearchFields: graphql.field({
      type: graphql.nonNull(graphql.list(graphql.nonNull(graphql.String)))
    }),
    initialSort: graphql.field({
      type: KeystoneAdminUISort
    }),
    isSingleton: graphql.field({
      type: graphql.nonNull(graphql.Boolean)
    }),
    ...contextFunctionField('hideCreate', graphql.Boolean),
    ...contextFunctionField('hideDelete', graphql.Boolean),
    ...contextFunctionField('isHidden', graphql.Boolean),
    // TODO: remove in breaking change
    itemQueryName: graphql.field({
      type: graphql.nonNull(graphql.String)
    }),
    listQueryName: graphql.field({
      type: graphql.nonNull(graphql.String)
    })
  }
});
const adminMeta = graphql.object()({
  name: 'KeystoneAdminMeta',
  fields: {
    lists: graphql.field({
      type: graphql.nonNull(graphql.list(graphql.nonNull(KeystoneAdminUIListMeta)))
    }),
    list: graphql.field({
      type: KeystoneAdminUIListMeta,
      args: {
        key: graphql.arg({
          type: graphql.nonNull(graphql.String)
        })
      },
      resolve(rootVal, {
        key
      }) {
        return rootVal.listsByKey[key];
      }
    })
  }
});
function defaultIsAccessAllowed({
  session,
  sessionStrategy
}) {
  if (!sessionStrategy) return true;
  return session !== undefined;
}
const KeystoneMeta = graphql.object()({
  name: 'KeystoneMeta',
  fields: {
    adminMeta: graphql.field({
      type: graphql.nonNull(adminMeta),
      resolve({
        adminMeta
      }, args, context) {
        var _adminMeta$isAccessAl;
        if ('isAdminUIBuildProcess' in context) {
          return adminMeta;
        }
        const isAccessAllowed = (_adminMeta$isAccessAl = adminMeta === null || adminMeta === void 0 ? void 0 : adminMeta.isAccessAllowed) !== null && _adminMeta$isAccessAl !== void 0 ? _adminMeta$isAccessAl : defaultIsAccessAllowed;
        return Promise.resolve(isAccessAllowed(context)).then(isAllowed => {
          if (isAllowed) return adminMeta;

          // TODO: ughhhhhh, we really need to talk about errors.
          // mostly unrelated to above: error or return null here(+ make field nullable)?s
          throw new Error('Access denied');
        });
      }
    })
  }
});
const fetchItemForItemViewFieldMode = extendContext(context => {
  const lists = new Map();
  return (listKey, id) => {
    if (!lists.has(listKey)) {
      lists.set(listKey, new Map());
    }
    const items = lists.get(listKey);
    if (items.has(id)) return items.get(id);
    const promise = context.db[listKey].findOne({
      where: {
        id
      }
    });
    items.set(id, promise);
    return promise;
  };
});
function extendContext(cb) {
  const cache = new WeakMap();
  return context => {
    if (cache.has(context)) return cache.get(context);
    const result = cb(context);
    cache.set(context, result);
    return result;
  };
}
function assertInRuntimeContext(context, {
  parentType,
  fieldName
}) {
  if ('isAdminUIBuildProcess' in context) {
    throw new Error(`${parentType}.${fieldName} cannot be resolved during the build process`);
  }
}
function contextFunctionField(key, type) {
  return {
    [key]: graphql.field({
      type: graphql.nonNull(type),
      resolve(source, args, context, info) {
        assertInRuntimeContext(context, info);
        return source[key](context);
      }
    })
  };
}

function getNamedOrListTypeNodeForType(type) {
  if (type instanceof GraphQLList) {
    return {
      kind: Kind.LIST_TYPE,
      type: getTypeNodeForType(type.ofType)
    };
  }
  return {
    kind: Kind.NAMED_TYPE,
    name: {
      kind: Kind.NAME,
      value: type.name
    }
  };
}
function getTypeNodeForType(type) {
  if (type instanceof GraphQLNonNull) {
    return {
      kind: Kind.NON_NULL_TYPE,
      type: getNamedOrListTypeNodeForType(type.ofType)
    };
  }
  return getNamedOrListTypeNodeForType(type);
}
function getVariablesForGraphQLField(field) {
  const variableDefinitions = field.args.map(arg => {
    var _ref;
    return {
      kind: Kind.VARIABLE_DEFINITION,
      type: getTypeNodeForType(arg.type),
      variable: {
        kind: Kind.VARIABLE,
        name: {
          kind: Kind.NAME,
          value: arg.name
        }
      },
      defaultValue: arg.defaultValue === undefined ? undefined : (_ref = astFromValue(arg.defaultValue, arg.type)) !== null && _ref !== void 0 ? _ref : undefined
    };
  });
  const argumentNodes = field.args.map(arg => ({
    kind: Kind.ARGUMENT,
    name: {
      kind: Kind.NAME,
      value: arg.name
    },
    value: {
      kind: Kind.VARIABLE,
      name: {
        kind: Kind.NAME,
        value: arg.name
      }
    }
  }));
  return {
    variableDefinitions,
    argumentNodes
  };
}
const rawField = 'raw';
const RawScalar = new GraphQLScalarType({
  name: 'RawThingPlsDontRelyOnThisAnywhere'
});
const ReturnRawValueObjectType = new GraphQLObjectType({
  name: 'ReturnRawValue',
  fields: {
    [rawField]: {
      type: RawScalar,
      resolve(rootVal) {
        return rootVal;
      }
    }
  }
});
function argsToArgsConfig(args) {
  return Object.fromEntries(args.map(arg => {
    const argConfig = {
      astNode: arg.astNode,
      defaultValue: arg.defaultValue,
      deprecationReason: arg.deprecationReason,
      description: arg.description,
      extensions: arg.extensions,
      type: arg.type
    };
    return [arg.name, argConfig];
  }));
}
// note the GraphQLNonNull and GraphQLList constructors are incorrectly
// not generic over their inner type which is why we have to use as
// (the classes are generic but not the constructors)
function getTypeForField(originalType) {
  if (originalType instanceof GraphQLNonNull) {
    return new GraphQLNonNull(getTypeForField(originalType.ofType));
  }
  if (originalType instanceof GraphQLList) {
    return new GraphQLList(getTypeForField(originalType.ofType));
  }
  return ReturnRawValueObjectType;
}
function getRootValGivenOutputType(originalType, value) {
  if (originalType instanceof GraphQLNonNull) {
    return getRootValGivenOutputType(originalType.ofType, value);
  }
  if (value === null) return null;
  if (originalType instanceof GraphQLList) {
    return value.map(x => getRootValGivenOutputType(originalType.ofType, x));
  }
  return value[rawField];
}
function executeGraphQLFieldToRootVal(field) {
  const {
    argumentNodes,
    variableDefinitions
  } = getVariablesForGraphQLField(field);
  const document = {
    kind: Kind.DOCUMENT,
    definitions: [{
      kind: Kind.OPERATION_DEFINITION,
      operation: OperationTypeNode.QUERY,
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections: [{
          kind: Kind.FIELD,
          name: {
            kind: Kind.NAME,
            value: field.name
          },
          arguments: argumentNodes,
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [{
              kind: Kind.FIELD,
              name: {
                kind: Kind.NAME,
                value: rawField
              }
            }]
          }
        }]
      },
      variableDefinitions
    }]
  };
  const type = getTypeForField(field.type);
  const fieldConfig = {
    args: argsToArgsConfig(field.args),
    astNode: undefined,
    deprecationReason: field.deprecationReason,
    description: field.description,
    extensions: field.extensions,
    resolve: field.resolve,
    subscribe: field.subscribe,
    type
  };
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        [field.name]: fieldConfig
      }
    }),
    assumeValid: true
  });
  return async (args, context, rootValue = {}) => {
    var _result$errors;
    const result = await execute({
      schema,
      document,
      contextValue: context,
      variableValues: args,
      rootValue
    });
    if ((_result$errors = result.errors) !== null && _result$errors !== void 0 && _result$errors.length) {
      throw result.errors[0];
    }
    return getRootValGivenOutputType(type, result.data[field.name]);
  };
}

const argName = 'where';
function coerceAndValidateForGraphQLInput(schema, type, value) {
  const variableDefintions = [{
    kind: Kind.VARIABLE_DEFINITION,
    type: getTypeNodeForType(type),
    variable: {
      kind: Kind.VARIABLE,
      name: {
        kind: Kind.NAME,
        value: argName
      }
    }
  }];
  const coercedVariableValues = getVariableValues(schema, variableDefintions, {
    [argName]: value
  });
  if (coercedVariableValues.errors) {
    return {
      kind: 'error',
      error: coercedVariableValues.errors[0]
    };
  }
  return {
    kind: 'valid',
    value: coercedVariableValues.coerced[argName]
  };
}

function cannotForItem(operation, list) {
  if (operation === 'create') return `You cannot ${operation} that ${list.listKey}`;
  return `You cannot ${operation} that ${list.listKey} - it may not exist`;
}
function cannotForItemFields(operation, list, fieldsDenied) {
  return `You cannot ${operation} that ${list.listKey} - you cannot ${operation} the fields ${JSON.stringify(fieldsDenied)}`;
}
async function getOperationFieldAccess(item, list, fieldKey, context, operation) {
  const {
    listKey
  } = list;
  let result;
  try {
    result = await list.fields[fieldKey].access.read({
      operation: 'read',
      session: context.session,
      listKey,
      fieldKey,
      context,
      item
    });
  } catch (error) {
    throw extensionError('Access control', [{
      error,
      tag: `${list.listKey}.${fieldKey}.access.${operation}`
    }]);
  }
  if (typeof result !== 'boolean') {
    throw accessReturnError([{
      tag: `${listKey}.access.operation.${operation}`,
      returned: typeof result
    }]);
  }
  return result;
}
async function getOperationAccess(list, context, operation) {
  const {
    listKey
  } = list;
  let result;
  try {
    if (operation === 'query') {
      result = await list.access.operation.query({
        operation,
        session: context.session,
        listKey,
        context
      });
    } else if (operation === 'create') {
      result = await list.access.operation.create({
        operation,
        session: context.session,
        listKey,
        context
      });
    } else if (operation === 'update') {
      result = await list.access.operation.update({
        operation,
        session: context.session,
        listKey,
        context
      });
    } else if (operation === 'delete') {
      result = await list.access.operation.delete({
        operation,
        session: context.session,
        listKey,
        context
      });
    }
  } catch (error) {
    throw extensionError('Access control', [{
      error,
      tag: `${listKey}.access.operation.${operation}`
    }]);
  }
  if (typeof result !== 'boolean') {
    throw accessReturnError([{
      tag: `${listKey}.access.operation.${operation}`,
      returned: typeof result
    }]);
  }
  return result;
}
async function getAccessFilters(list, context, operation) {
  try {
    let filters;
    if (operation === 'query') {
      filters = await list.access.filter.query({
        operation,
        session: context.session,
        listKey: list.listKey,
        context
      });
    } else if (operation === 'update') {
      filters = await list.access.filter.update({
        operation,
        session: context.session,
        listKey: list.listKey,
        context
      });
    } else if (operation === 'delete') {
      filters = await list.access.filter.delete({
        operation,
        session: context.session,
        listKey: list.listKey,
        context
      });
    }
    if (typeof filters === 'boolean') return filters;
    if (!filters) return false; // shouldn't happen, but, Typescript

    const schema = context.sudo().graphql.schema;
    const whereInput = assertInputObjectType(schema.getType(list.graphql.names.whereInputName));
    const result = coerceAndValidateForGraphQLInput(schema, whereInput, filters);
    if (result.kind === 'valid') return result.value;
    throw result.error;
  } catch (error) {
    throw extensionError('Access control', [{
      error,
      tag: `${list.listKey}.access.filter.${operation}`
    }]);
  }
}
async function enforceListLevelAccessControl(context, operation, list, inputData, item) {
  let accepted; // should be boolean, but dont trust, it might accidentally be a filter
  try {
    // apply access.item.* controls
    if (operation === 'create') {
      const itemAccessControl = list.access.item[operation];
      accepted = await itemAccessControl({
        operation,
        session: context.session,
        listKey: list.listKey,
        context,
        inputData
      });
    } else if (operation === 'update' && item !== undefined) {
      const itemAccessControl = list.access.item[operation];
      accepted = await itemAccessControl({
        operation,
        session: context.session,
        listKey: list.listKey,
        context,
        item,
        inputData
      });
    } else if (operation === 'delete' && item !== undefined) {
      const itemAccessControl = list.access.item[operation];
      accepted = await itemAccessControl({
        operation,
        session: context.session,
        listKey: list.listKey,
        context,
        item
      });
    }
  } catch (error) {
    throw extensionError('Access control', [{
      error,
      tag: `${list.listKey}.access.item.${operation}`
    }]);
  }

  // short circuit the safe path
  if (accepted === true) return;
  if (typeof accepted !== 'boolean') {
    throw accessReturnError([{
      tag: `${list.listKey}.access.item.${operation}`,
      returned: typeof accepted
    }]);
  }
  throw accessDeniedError(cannotForItem(operation, list));
}
async function enforceFieldLevelAccessControl(context, operation, list, inputData, item) {
  const nonBooleans = [];
  const fieldsDenied = [];
  const accessErrors = [];
  await Promise.allSettled(Object.keys(inputData).map(async fieldKey => {
    let accepted; // should be boolean, but dont trust
    try {
      // apply fields.[fieldKey].access.* controls
      if (operation === 'create') {
        const fieldAccessControl = list.fields[fieldKey].access[operation];
        accepted = await fieldAccessControl({
          operation,
          session: context.session,
          listKey: list.listKey,
          fieldKey,
          context,
          inputData: inputData // FIXME
        });
      } else if (operation === 'update' && item !== undefined) {
        const fieldAccessControl = list.fields[fieldKey].access[operation];
        accepted = await fieldAccessControl({
          operation,
          session: context.session,
          listKey: list.listKey,
          fieldKey,
          context,
          item,
          inputData
        });
      }
    } catch (error) {
      accessErrors.push({
        error,
        tag: `${list.listKey}.${fieldKey}.access.${operation}`
      });
      return;
    }

    // short circuit the safe path
    if (accepted === true) return;
    fieldsDenied.push(fieldKey);

    // wrong type?
    if (typeof accepted !== 'boolean') {
      nonBooleans.push({
        tag: `${list.listKey}.${fieldKey}.access.${operation}`,
        returned: typeof accepted
      });
    }
  }));
  if (nonBooleans.length) {
    throw accessReturnError(nonBooleans);
  }
  if (accessErrors.length) {
    throw extensionError('Access control', accessErrors);
  }
  if (fieldsDenied.length) {
    throw accessDeniedError(cannotForItemFields(operation, list, fieldsDenied));
  }
}
function parseFieldAccessControl(access) {
  var _access$read, _access$create, _access$update;
  if (typeof access === 'function') {
    return {
      read: access,
      create: access,
      update: access
    };
  }
  return {
    read: (_access$read = access === null || access === void 0 ? void 0 : access.read) !== null && _access$read !== void 0 ? _access$read : allowAll,
    create: (_access$create = access === null || access === void 0 ? void 0 : access.create) !== null && _access$create !== void 0 ? _access$create : allowAll,
    update: (_access$update = access === null || access === void 0 ? void 0 : access.update) !== null && _access$update !== void 0 ? _access$update : allowAll
  };
}
function parseListAccessControl(access) {
  var _filter$query, _filter$update, _filter$delete, _item$create, _item$update, _item$delete;
  if (typeof access === 'function') {
    return {
      operation: {
        query: access,
        create: access,
        update: access,
        delete: access
      },
      filter: {
        query: allowAll,
        update: allowAll,
        delete: allowAll
      },
      item: {
        create: allowAll,
        update: allowAll,
        delete: allowAll
      }
    };
  }
  let {
    operation,
    filter,
    item
  } = access;
  if (typeof operation === 'function') {
    operation = {
      query: operation,
      create: operation,
      update: operation,
      delete: operation
    };
  }
  return {
    operation: {
      query: operation.query,
      create: operation.create,
      update: operation.update,
      delete: operation.delete
    },
    filter: {
      query: (_filter$query = filter === null || filter === void 0 ? void 0 : filter.query) !== null && _filter$query !== void 0 ? _filter$query : allowAll,
      // create: not supported
      update: (_filter$update = filter === null || filter === void 0 ? void 0 : filter.update) !== null && _filter$update !== void 0 ? _filter$update : allowAll,
      delete: (_filter$delete = filter === null || filter === void 0 ? void 0 : filter.delete) !== null && _filter$delete !== void 0 ? _filter$delete : allowAll
    },
    item: {
      // query: not supported
      create: (_item$create = item === null || item === void 0 ? void 0 : item.create) !== null && _item$create !== void 0 ? _item$create : allowAll,
      update: (_item$update = item === null || item === void 0 ? void 0 : item.update) !== null && _item$update !== void 0 ? _item$update : allowAll,
      delete: (_item$delete = item === null || item === void 0 ? void 0 : item.delete) !== null && _item$delete !== void 0 ? _item$delete : allowAll
    }
  };
}

// this is wrong
// all the things should be generic over the id type
// i don't want to deal with that right now though

// these aren't here out of thinking this is better syntax(i do not think it is),
// it's just because TS won't infer the arg is X bit
const isFulfilled = arg => arg.status === 'fulfilled';
const isRejected = arg => arg.status === 'rejected';
async function promiseAllRejectWithAllErrors(promises) {
  const results = await Promise.allSettled(promises);
  if (!results.every(isFulfilled)) {
    const errors = results.filter(isRejected).map(x => x.reason);
    // AggregateError would be ideal here but it's not in Node 12 or 14
    // (also all of our error stuff is just meh. this whole thing is just to align with previous behaviour)
    const error = new Error(errors[0].message || errors[0].toString());
    error.errors = errors;
    throw error;
  }
  return results.map(x => x.value);
}
function getDBFieldKeyForFieldOnMultiField(fieldKey, subField) {
  return `${fieldKey}_${subField}`;
}
function areArraysEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

async function resolveUniqueWhereInput(inputFilter, list, context) {
  const where = {};
  for (const key in inputFilter) {
    const value = inputFilter[key];
    const resolver = list.fields[key].input.uniqueWhere.resolve;
    if (resolver !== undefined) {
      where[key] = await resolver(value, context);
    } else {
      where[key] = value;
    }
  }
  return where;
}
async function resolveWhereInput(inputFilter, list, context, isAtRootWhere = true) {
  return {
    AND: await Promise.all(Object.entries(inputFilter).map(async ([key, value]) => {
      if (key === 'OR' || key === 'AND' || key === 'NOT') {
        return {
          [key]: await Promise.all(value.map(value => resolveWhereInput(value, list, context, false)))
        };
      }

      // we know if there are filters in the input object with the key of a field,
      //   the field must have defined a where input so this non null assertion is okay
      const field = list.fields[key];
      const {
        dbField
      } = field;
      const resolve = field.input.where.resolve;
      const ret = resolve ? await resolve(value, context, (() => {
        if (dbField.kind !== 'relation') {
          return undefined;
        }
        const foreignList = dbField.list;
        const whereResolver = filter => resolveWhereInput(filter, list.lists[foreignList], context);
        if (dbField.mode === 'many') {
          return async () => {
            if (value === null) {
              throw userInputError('A many relation filter cannot be set to null');
            }
            return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, val]) => {
              if (val === null) {
                throw userInputError(`The key "${key}" in a many relation filter cannot be set to null`);
              }
              return [key, await whereResolver(val)];
            })));
          };
        }
        return value => {
          if (value === null) return null;
          return whereResolver(value);
        };
      })()) : value;
      if (ret === null) {
        if (dbField.kind === 'multi') {
          // Note: no built-in field types support multi valued database fields *and* filtering.
          // This code path is only relevent to custom fields which fit that criteria.
          throw new Error('multi db fields cannot return null from where input resolvers');
        }
        return {
          [key]: null
        };
      }
      return handleOperators(key, dbField, ret);
    }))
  };
}
function handleOperators(fieldKey, dbField, {
  AND,
  OR,
  NOT,
  ...rest
}) {
  return {
    AND: AND === null || AND === void 0 ? void 0 : AND.map(value => handleOperators(fieldKey, dbField, value)),
    OR: OR === null || OR === void 0 ? void 0 : OR.map(value => handleOperators(fieldKey, dbField, value)),
    NOT: NOT === null || NOT === void 0 ? void 0 : NOT.map(value => handleOperators(fieldKey, dbField, value)),
    ...nestWithAppropiateField(fieldKey, dbField, rest)
  };
}
function nestWithAppropiateField(fieldKey, dbField, value) {
  if (dbField.kind === 'multi') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [getDBFieldKeyForFieldOnMultiField(fieldKey, key), val]));
  }
  return {
    [fieldKey]: value
  };
}

async function checkFilterOrderAccess(things, context, operation) {
  const func = operation === 'filter' ? 'isFilterable' : 'isOrderable';
  const failures = [];
  const returnTypeErrors = [];
  const accessErrors = [];
  for (const {
    fieldKey,
    list
  } of things) {
    const field = list.fields[fieldKey];
    const rule = field.graphql.isEnabled[operation];
    if (!rule) throw new Error('Assert failed');
    if (typeof rule === 'function') {
      let result;
      try {
        result = await rule({
          context,
          session: context.session,
          listKey: list.listKey,
          fieldKey
        });
      } catch (error) {
        accessErrors.push({
          error,
          tag: `${list.listKey}.${fieldKey}.${func}`
        });
        continue;
      }
      const resultType = typeof result;

      // It's important that we don't cast objects to truthy values, as there's a strong chance that the user
      // has made a mistake.
      if (resultType !== 'boolean') {
        returnTypeErrors.push({
          tag: `${list.listKey}.${fieldKey}.${func}`,
          returned: resultType
        });
      } else if (!result) {
        failures.push(`${list.listKey}.${fieldKey}`);
      }
    }
  }
  if (accessErrors.length) {
    throw extensionError(func, accessErrors);
  }
  if (returnTypeErrors.length) {
    throw accessReturnError(returnTypeErrors);
  }
  if (failures.length) {
    throw filterAccessError({
      operation,
      fieldKeys: failures
    });
  }
}

// we want to put the value we get back from the field's unique where resolver into an equals
// rather than directly passing the value as the filter (even though Prisma supports that), we use equals
// because we want to disallow fields from providing an arbitrary filter
function mapUniqueWhereToWhere(uniqueWhere) {
  const where = {};
  for (const key in uniqueWhere) {
    where[key] = {
      equals: uniqueWhere[key]
    };
  }
  return where;
}
function* traverse(list, inputFilter) {
  for (const fieldKey in inputFilter) {
    const value = inputFilter[fieldKey];
    if (fieldKey === 'OR' || fieldKey === 'AND' || fieldKey === 'NOT') {
      for (const condition of value) {
        yield* traverse(list, condition);
      }
    } else if (fieldKey === 'some' || fieldKey === 'none' || fieldKey === 'every') {
      yield* traverse(list, value);
    } else {
      yield {
        fieldKey,
        list
      };

      // if it's a relationship, check the nested filters.
      const field = list.fields[fieldKey];
      if (field.dbField.kind === 'relation' && value !== null) {
        const foreignList = list.lists[field.dbField.list];
        yield* traverse(foreignList, value);
      }
    }
  }
}
async function accessControlledFilter(list, context, resolvedWhere, accessFilters) {
  // Merge the filter access control
  if (typeof accessFilters === 'object') {
    resolvedWhere = {
      AND: [resolvedWhere, await resolveWhereInput(accessFilters, list, context)]
    };
  }
  return resolvedWhere;
}
async function findOne(args, list, context) {
  // check operation permission to pass into single operation
  const operationAccess = await getOperationAccess(list, context, 'query');
  if (!operationAccess) return null;
  const accessFilters = await getAccessFilters(list, context, 'query');
  if (accessFilters === false) return null;

  // validate and resolve the input filter
  const uniqueWhere = await resolveUniqueWhereInput(args.where, list, context);
  const resolvedWhere = mapUniqueWhereToWhere(uniqueWhere);

  // findOne requires at least one filter
  if (Object.keys(resolvedWhere).length === 0) return null;

  // check filter access
  for (const fieldKey in resolvedWhere) {
    await checkFilterOrderAccess([{
      fieldKey,
      list
    }], context, 'filter');
  }

  // apply access control
  const filter = await accessControlledFilter(list, context, resolvedWhere, accessFilters);
  return await context.prisma[list.listKey].findFirst({
    where: filter
  });
}
async function findMany({
  where,
  take,
  skip,
  orderBy: rawOrderBy,
  cursor
}, list, context, info, extraFilter) {
  var _list$graphql$types$f;
  const maxTake = (_list$graphql$types$f = list.graphql.types.findManyArgs.take.defaultValue) !== null && _list$graphql$types$f !== void 0 ? _list$graphql$types$f : Infinity;
  if ((take !== null && take !== void 0 ? take : Infinity) > maxTake) {
    throw limitsExceededError({
      list: list.listKey,
      type: 'maxTake',
      limit: maxTake
    });
  }

  // TODO: rewrite, this actually checks access
  const orderBy = await resolveOrderBy(rawOrderBy, list, context);
  const operationAccess = await getOperationAccess(list, context, 'query');
  if (!operationAccess) return [];
  const accessFilters = await getAccessFilters(list, context, 'query');
  if (accessFilters === false) return [];
  const resolvedWhere = await resolveWhereInput(where, list, context);

  // check filter access (TODO: why isn't this using resolvedWhere)
  await checkFilterOrderAccess([...traverse(list, where)], context, 'filter');
  const filter = await accessControlledFilter(list, context, resolvedWhere, accessFilters);
  const results = await context.prisma[list.listKey].findMany({
    where: extraFilter === undefined ? filter : {
      AND: [filter, extraFilter]
    },
    orderBy,
    take: take !== null && take !== void 0 ? take : undefined,
    skip,
    cursor: cursor !== null && cursor !== void 0 ? cursor : undefined
  });
  if (list.cacheHint) {
    var _maybeCacheControlFro, _info$operation$name;
    (_maybeCacheControlFro = maybeCacheControlFromInfo(info)) === null || _maybeCacheControlFro === void 0 || _maybeCacheControlFro.setCacheHint(list.cacheHint({
      results,
      operationName: (_info$operation$name = info.operation.name) === null || _info$operation$name === void 0 ? void 0 : _info$operation$name.value,
      meta: false
    }));
  }
  return results;
}
async function resolveOrderBy(orderBy, list, context) {
  // Check input format. FIXME: Group all errors
  orderBy.forEach(orderBySelection => {
    const keys = Object.keys(orderBySelection);
    if (keys.length !== 1) {
      throw userInputError(`Only a single key must be passed to ${list.graphql.types.orderBy.graphQLType.name}`);
    }
    const fieldKey = keys[0];
    const value = orderBySelection[fieldKey];
    if (value === null) {
      throw userInputError('null cannot be passed as an order direction');
    }
  });

  // Check orderBy access
  const orderByKeys = orderBy.map(orderBySelection => ({
    fieldKey: Object.keys(orderBySelection)[0],
    list
  }));
  await checkFilterOrderAccess(orderByKeys, context, 'orderBy');
  return await Promise.all(orderBy.map(async orderBySelection => {
    const keys = Object.keys(orderBySelection);
    const fieldKey = keys[0];
    const value = orderBySelection[fieldKey];
    const field = list.fields[fieldKey];
    const resolve = field.input.orderBy.resolve;
    const resolvedValue = resolve ? await resolve(value, context) : value;
    if (field.dbField.kind === 'multi') {
      // Note: no built-in field types support multi valued database fields *and* orderBy.
      // This code path is only relevent to custom fields which fit that criteria.
      const keys = Object.keys(resolvedValue);
      if (keys.length !== 1) {
        throw new Error(`Only a single key must be returned from an orderBy input resolver for a multi db field`);
      }
      const innerKey = keys[0];
      return {
        [getDBFieldKeyForFieldOnMultiField(fieldKey, innerKey)]: resolvedValue[innerKey]
      };
    } else {
      return {
        [fieldKey]: resolvedValue
      };
    }
  }));
}
async function count({
  where
}, list, context, info, extraFilter) {
  const operationAccess = await getOperationAccess(list, context, 'query');
  if (!operationAccess) return 0;
  const accessFilters = await getAccessFilters(list, context, 'query');
  if (accessFilters === false) return 0;
  const resolvedWhere = await resolveWhereInput(where, list, context);

  // check filter access (TODO: why isn't this using resolvedWhere)
  await checkFilterOrderAccess([...traverse(list, where)], context, 'filter');
  const filter = await accessControlledFilter(list, context, resolvedWhere, accessFilters);
  const count = await context.prisma[list.listKey].count({
    where: extraFilter === undefined ? filter : {
      AND: [filter, extraFilter]
    }
  });
  if (list.cacheHint) {
    var _maybeCacheControlFro2, _info$operation$name2;
    (_maybeCacheControlFro2 = maybeCacheControlFromInfo(info)) === null || _maybeCacheControlFro2 === void 0 || _maybeCacheControlFro2.setCacheHint(list.cacheHint({
      results: count,
      operationName: (_info$operation$name2 = info.operation.name) === null || _info$operation$name2 === void 0 ? void 0 : _info$operation$name2.value,
      meta: true
    }));
  }
  return count;
}

function getQueriesForList(list$1) {
  if (!list$1.graphql.isEnabled.query) return {};
  const findOne$1 = field({
    type: list$1.graphql.types.output,
    args: {
      where: arg({
        type: nonNull$1(list$1.graphql.types.uniqueWhere),
        defaultValue: list$1.isSingleton ? {
          id: '1'
        } : undefined
      })
    },
    async resolve(_rootVal, args, context) {
      return findOne(args, list$1, context);
    }
  });
  const findMany$1 = field({
    type: list(nonNull$1(list$1.graphql.types.output)),
    args: list$1.graphql.types.findManyArgs,
    async resolve(_rootVal, args, context, info) {
      return findMany(args, list$1, context, info);
    }
  });
  const countQuery = field({
    type: Int,
    args: {
      where: arg({
        type: nonNull$1(list$1.graphql.types.where),
        defaultValue: list$1.isSingleton ? {
          id: {
            equals: '1'
          }
        } : {}
      })
    },
    async resolve(_rootVal, args, context, info) {
      return count(args, list$1, context, info);
    }
  });
  return {
    [list$1.graphql.names.itemQueryName]: findOne$1,
    [list$1.graphql.names.listQueryName]: findMany$1,
    [list$1.graphql.names.listQueryCountName]: countQuery
  };
}

async function validate({
  list,
  hookArgs
}) {
  const messages = [];
  const fieldsErrors = [];
  const {
    operation
  } = hookArgs;

  // field validation hooks
  await Promise.all(Object.entries(list.fields).map(async ([fieldKey, field]) => {
    const addValidationError = msg => void messages.push(`${list.listKey}.${fieldKey}: ${msg}`);
    const hook = field.hooks.validate[operation];
    try {
      await hook({
        ...hookArgs,
        addValidationError,
        fieldKey
      }); // TODO: FIXME
    } catch (error) {
      fieldsErrors.push({
        error,
        tag: `${list.listKey}.${fieldKey}.hooks.validateInput`
      });
    }
  }));
  if (fieldsErrors.length) {
    throw extensionError('validateInput', fieldsErrors);
  }

  // list validation hooks
  {
    const addValidationError = msg => void messages.push(`${list.listKey}: ${msg}`);
    const hook = list.hooks.validate[operation];
    try {
      await hook({
        ...hookArgs,
        addValidationError
      }); // TODO: FIXME
    } catch (error) {
      throw extensionError('validateInput', [{
        error,
        tag: `${list.listKey}.hooks.validateInput`
      }]);
    }
    if (messages.length) {
      throw validationFailureError(messages);
    }
  }
}
async function runSideEffectOnlyHook(list, hookName, args) {
  const {
    operation
  } = args;
  let shouldRunFieldLevelHook;
  if (operation === 'delete') {
    // always run field hooks for delete operations
    shouldRunFieldLevelHook = () => true;
  } else {
    // only run field hooks on if the field was specified in the
    //   original input for create and update operations.
    const inputDataKeys = new Set(Object.keys(args.inputData));
    shouldRunFieldLevelHook = fieldKey => inputDataKeys.has(fieldKey);
  }

  // field hooks
  const fieldsErrors = [];
  await Promise.all(Object.entries(list.fields).map(async ([fieldKey, field]) => {
    if (shouldRunFieldLevelHook(fieldKey)) {
      try {
        await field.hooks[hookName][operation]({
          fieldKey,
          ...args
        }); // TODO: FIXME any
      } catch (error) {
        fieldsErrors.push({
          error,
          tag: `${list.listKey}.${fieldKey}.hooks.${hookName}`
        });
      }
    }
  }));
  if (fieldsErrors.length) {
    throw extensionError(hookName, fieldsErrors);
  }

  // list hooks
  try {
    await list.hooks[hookName][operation](args); // TODO: FIXME any
  } catch (error) {
    throw extensionError(hookName, [{
      error,
      tag: `${list.listKey}.hooks.${hookName}`
    }]);
  }
}

async function checkUniqueItemExists(uniqueInput, foreignList, context, operation) {
  // Validate and resolve the input filter
  const uniqueWhere = await resolveUniqueWhereInput(uniqueInput, foreignList, context);

  // Check whether the item exists (from this users POV).
  try {
    const item = await context.db[foreignList.listKey].findOne({
      where: uniqueInput
    });
    if (item !== null) return uniqueWhere;
  } catch (err) {}
  throw accessDeniedError(cannotForItem(operation, foreignList));
}

class RelationshipErrors extends Error {
  constructor(errors) {
    super('Multiple relationship errors');
    this.errors = errors;
  }
}
function getResolvedUniqueWheres(uniqueInputs, context, foreignList, operation) {
  return uniqueInputs.map(uniqueInput => checkUniqueItemExists(uniqueInput, foreignList, context, operation));
}
function resolveRelateToManyForCreateInput(nestedMutationState, context, foreignList, tag) {
  return async value => {
    if (!Array.isArray(value.connect) && !Array.isArray(value.create)) {
      throw userInputError(`You must provide "connect" or "create" in to-many relationship inputs for "create" operations.`);
    }

    // Perform queries for the connections
    const connects = Promise.allSettled(getResolvedUniqueWheres(value.connect || [], context, foreignList, 'connect'));

    // Perform nested mutations for the creations
    const creates = Promise.allSettled((value.create || []).map(x => nestedMutationState.create(x, foreignList)));
    const [connectResult, createResult] = await Promise.all([connects, creates]);

    // Collect all the errors
    const errors = [...connectResult, ...createResult].filter(isRejected);
    if (errors.length) {
      throw new RelationshipErrors(errors.map(x => ({
        error: x.reason,
        tag
      })));
    }
    const result = {
      connect: [...connectResult, ...createResult].filter(isFulfilled).map(x => x.value)
    };

    // Perform queries for the connections
    return result;
  };
}
function resolveRelateToManyForUpdateInput(nestedMutationState, context, foreignList, tag) {
  return async value => {
    if (!Array.isArray(value.connect) && !Array.isArray(value.create) && !Array.isArray(value.disconnect) && !Array.isArray(value.set)) {
      throw userInputError(`You must provide at least one of "set", "connect", "create" or "disconnect" in to-many relationship inputs for "update" operations.`);
    }
    if (value.set && value.disconnect) {
      throw userInputError(`The "set" and "disconnect" fields cannot both be provided to to-many relationship inputs for "update" operations.`);
    }

    // Perform queries for the connections
    const connects = Promise.allSettled(getResolvedUniqueWheres(value.connect || [], context, foreignList, 'connect'));
    const disconnects = Promise.allSettled(getResolvedUniqueWheres(value.disconnect || [], context, foreignList, 'disconnect'));
    const sets = Promise.allSettled(getResolvedUniqueWheres(value.set || [], context, foreignList, 'set'));

    // Perform nested mutations for the creations
    const creates = Promise.allSettled((value.create || []).map(x => nestedMutationState.create(x, foreignList)));
    const [connectResult, createResult, disconnectResult, setResult] = await Promise.all([connects, creates, disconnects, sets]);

    // Collect all the errors
    const errors = [...connectResult, ...createResult, ...disconnectResult, ...setResult].filter(isRejected);
    if (errors.length) {
      throw new RelationshipErrors(errors.map(x => ({
        error: x.reason,
        tag
      })));
    }
    return {
      // unlike all the other operations, an empty array isn't a no-op for set
      set: value.set ? setResult.filter(isFulfilled).map(x => x.value) : undefined,
      disconnect: disconnectResult.filter(isFulfilled).map(x => x.value),
      connect: [...connectResult, ...createResult].filter(isFulfilled).map(x => x.value)
    };
  };
}

async function handleCreateAndUpdate(value, nestedMutationState, context, foreignList) {
  if (value.connect) {
    return {
      connect: await checkUniqueItemExists(value.connect, foreignList, context, 'connect')
    };
  } else if (value.create) {
    const {
      id
    } = await nestedMutationState.create(value.create, foreignList);
    return {
      connect: {
        id
      }
    };
  }
}
function resolveRelateToOneForCreateInput(nestedMutationState, context, foreignList) {
  return async value => {
    const numOfKeys = Object.keys(value).length;
    if (numOfKeys !== 1) {
      throw userInputError(`You must provide "connect" or "create" in to-one relationship inputs for "create" operations.`);
    }
    return handleCreateAndUpdate(value, nestedMutationState, context, foreignList);
  };
}
function resolveRelateToOneForUpdateInput(nestedMutationState, context, foreignList) {
  return async value => {
    if (Object.keys(value).length !== 1) {
      throw userInputError(`You must provide one of "connect", "create" or "disconnect" in to-one relationship inputs for "update" operations.`);
    }
    if (value.connect || value.create) {
      return handleCreateAndUpdate(value, nestedMutationState, context, foreignList);
    } else if (value.disconnect) {
      return {
        disconnect: true
      };
    }
  };
}

async function getFilteredItem(list, context, uniqueWhere, accessFilters, operation) {
  // early exit if they want to exclude everything
  if (accessFilters === false) {
    throw accessDeniedError(cannotForItem(operation, list));
  }

  // merge the filter access control and try to get the item
  let where = mapUniqueWhereToWhere(uniqueWhere);
  if (typeof accessFilters === 'object') {
    where = {
      AND: [where, await resolveWhereInput(accessFilters, list, context)]
    };
  }
  const item = await context.prisma[list.listKey].findFirst({
    where
  });
  if (item !== null) return item;
  throw accessDeniedError(cannotForItem(operation, list));
}
async function createSingle(inputData, list, context) {
  // throw an accessDeniedError if not allowed
  await enforceListLevelAccessControl(context, 'create', list, inputData, undefined);
  await enforceFieldLevelAccessControl(context, 'create', list, inputData, undefined);
  const {
    afterOperation,
    data
  } = await resolveInputForCreateOrUpdate(list, context, inputData, undefined);
  const item = await context.prisma[list.listKey].create({
    data: list.isSingleton ? {
      ...data,
      id: 1
    } : data
  });
  return {
    item,
    afterOperation
  };
}
var _afterOperations = /*#__PURE__*/new WeakMap();
var _context = /*#__PURE__*/new WeakMap();
class NestedMutationState {
  constructor(context) {
    _classPrivateFieldInitSpec(this, _afterOperations, []);
    _classPrivateFieldInitSpec(this, _context, void 0);
    _classPrivateFieldSet(_context, this, context);
  }
  async create(data, list) {
    const context = _classPrivateFieldGet(_context, this);
    const operationAccess = await getOperationAccess(list, context, 'create');
    if (!operationAccess) throw accessDeniedError(cannotForItem('create', list));
    const {
      item,
      afterOperation
    } = await createSingle(data, list, context);
    _classPrivateFieldGet(_afterOperations, this).push(() => afterOperation(item));
    return {
      id: item.id
    };
  }
  async afterOperation() {
    await promiseAllRejectWithAllErrors(_classPrivateFieldGet(_afterOperations, this).map(async x => x()));
  }
}
async function createOne(inputData, list, context) {
  const operationAccess = await getOperationAccess(list, context, 'create');
  if (!operationAccess) throw accessDeniedError(cannotForItem('create', list));

  // operation
  const {
    item,
    afterOperation
  } = await createSingle(inputData !== null && inputData !== void 0 ? inputData : {}, list, context);

  // after operation
  await afterOperation(item);
  return item;
}
async function createMany(inputDatas, list, context) {
  const operationAccess = await getOperationAccess(list, context, 'create');
  return inputDatas.map(async inputData => {
    // throw for each attempt
    if (!operationAccess) throw accessDeniedError(cannotForItem('create', list));

    // operation
    const {
      item,
      afterOperation
    } = await createSingle(inputData !== null && inputData !== void 0 ? inputData : {}, list, context);

    // after operation
    await afterOperation(item);
    return item;
  });
}
async function updateSingle({
  where,
  data: inputData
}, list, context, accessFilters) {
  // validate and resolve the input filter
  const uniqueWhere = await resolveUniqueWhereInput(where, list, context);

  // check filter access
  const fieldKey = Object.keys(uniqueWhere)[0];
  await checkFilterOrderAccess([{
    fieldKey,
    list
  }], context, 'filter');

  // filter and item access control - throws an AccessDeniedError if not allowed
  const item = await getFilteredItem(list, context, uniqueWhere, accessFilters, 'update');

  // throw an accessDeniedError if not allowed
  await enforceListLevelAccessControl(context, 'update', list, inputData !== null && inputData !== void 0 ? inputData : {}, item);
  await enforceFieldLevelAccessControl(context, 'update', list, inputData !== null && inputData !== void 0 ? inputData : {}, item);
  const {
    afterOperation,
    data
  } = await resolveInputForCreateOrUpdate(list, context, inputData !== null && inputData !== void 0 ? inputData : {}, item);

  // operation
  const updatedItem = await context.prisma[list.listKey].update({
    where: {
      id: item.id
    },
    data
  });

  // after operation
  await afterOperation(updatedItem);
  return updatedItem;
}
async function updateOne(updateInput, list, context) {
  const operationAccess = await getOperationAccess(list, context, 'update');
  if (!operationAccess) throw accessDeniedError(cannotForItem('update', list));

  // get list-level access control filters
  const accessFilters = await getAccessFilters(list, context, 'update');
  return updateSingle(updateInput, list, context, accessFilters);
}
async function updateMany(updateManyInput, list, context) {
  const operationAccess = await getOperationAccess(list, context, 'update');

  // get list-level access control filters
  const accessFilters = await getAccessFilters(list, context, 'update');
  return updateManyInput.map(async updateInput => {
    // throw for each attempt
    if (!operationAccess) throw accessDeniedError(cannotForItem('update', list));
    return updateSingle(updateInput, list, context, accessFilters);
  });
}
async function deleteSingle(where, list, context, accessFilters) {
  // validate and resolve the input filter
  const uniqueWhere = await resolveUniqueWhereInput(where, list, context);

  // check filter access
  const fieldKey = Object.keys(uniqueWhere)[0];
  await checkFilterOrderAccess([{
    fieldKey,
    list
  }], context, 'filter');

  // filter and item access control throw an AccessDeniedError if not allowed
  // apply access.filter.* controls
  const item = await getFilteredItem(list, context, uniqueWhere, accessFilters, 'delete');
  await enforceListLevelAccessControl(context, 'delete', list, {}, item);
  const hookArgs = {
    operation: 'delete',
    listKey: list.listKey,
    context,
    item,
    resolvedData: undefined,
    inputData: undefined
  };

  // hooks
  await validate({
    list,
    hookArgs
  });

  // before operation
  await runSideEffectOnlyHook(list, 'beforeOperation', hookArgs);

  // operation
  const result = await context.prisma[list.listKey].delete({
    where: {
      id: item.id
    }
  });

  // after operation
  await runSideEffectOnlyHook(list, 'afterOperation', {
    ...hookArgs,
    item: undefined,
    originalItem: item
  });
  return result;
}
async function deleteOne(where, list, context) {
  const operationAccess = await getOperationAccess(list, context, 'delete');
  if (!operationAccess) throw accessDeniedError(cannotForItem('delete', list));

  // get list-level access control filters
  const accessFilters = await getAccessFilters(list, context, 'delete');
  return deleteSingle(where, list, context, accessFilters);
}
async function deleteMany(wheres, list, context) {
  const operationAccess = await getOperationAccess(list, context, 'delete');

  // get list-level access control filters
  const accessFilters = await getAccessFilters(list, context, 'delete');
  return wheres.map(async where => {
    // throw for each attempt
    if (!operationAccess) throw accessDeniedError(cannotForItem('delete', list));
    return deleteSingle(where, list, context, accessFilters);
  });
}
async function getResolvedData(list, hookArgs, nestedMutationState) {
  const {
    context,
    operation
  } = hookArgs;
  let resolvedData = hookArgs.inputData;

  // apply non-relationship field type input resolvers
  const resolverErrors = [];
  resolvedData = Object.fromEntries(await Promise.all(Object.entries(list.fields).map(async ([fieldKey, field]) => {
    var _field$input;
    const inputResolver = (_field$input = field.input) === null || _field$input === void 0 || (_field$input = _field$input[operation]) === null || _field$input === void 0 ? void 0 : _field$input.resolve;
    if (inputResolver && field.dbField.kind !== 'relation') {
      try {
        return [fieldKey, await inputResolver(resolvedData[fieldKey], context, undefined)];
      } catch (error) {
        resolverErrors.push({
          error,
          tag: `${list.listKey}.${fieldKey}`
        });
      }
    }
    return [fieldKey, resolvedData[fieldKey]];
  })));
  if (resolverErrors.length) throw resolverError(resolverErrors);

  // apply relationship field type input resolvers
  const relationshipErrors = [];
  resolvedData = Object.fromEntries(await Promise.all(Object.entries(list.fields).map(async ([fieldKey, field]) => {
    var _field$input2;
    const inputResolver = (_field$input2 = field.input) === null || _field$input2 === void 0 || (_field$input2 = _field$input2[operation]) === null || _field$input2 === void 0 ? void 0 : _field$input2.resolve;
    let input = resolvedData[fieldKey];
    if (inputResolver && field.dbField.kind === 'relation') {
      const tag = `${list.listKey}.${fieldKey}`;
      try {
        input = await inputResolver(input, context,
        // this third argument only applies to relationship fields
        (() => {
          if (input === undefined) {
            // no-op: this is what we want
            return () => undefined;
          }
          if (input === null) {
            // no-op: should this be userinputerror?
            return () => undefined;
          }
          const foreignList = list.lists[field.dbField.list];
          if (field.dbField.mode === 'many' && operation === 'create') {
            return resolveRelateToManyForCreateInput(nestedMutationState, context, foreignList, tag);
          }
          if (field.dbField.mode === 'many' && operation === 'update') {
            return resolveRelateToManyForUpdateInput(nestedMutationState, context, foreignList, tag);
          }
          if (field.dbField.mode === 'one' && operation === 'create') {
            return resolveRelateToOneForCreateInput(nestedMutationState, context, foreignList);
          }
          if (field.dbField.mode === 'one' && operation === 'update') {
            return resolveRelateToOneForUpdateInput(nestedMutationState, context, foreignList);
          }
          throw new Error('Unknown relationship field type input mode or operation');
        })());
      } catch (error) {
        if (error instanceof RelationshipErrors) {
          relationshipErrors.push(...error.errors);
        } else {
          relationshipErrors.push({
            error,
            tag
          });
        }
      }
    }
    return [fieldKey, input];
  })));
  if (relationshipErrors.length) throw relationshipError(relationshipErrors);

  // field hooks
  const fieldsErrors = [];
  resolvedData = Object.fromEntries(await Promise.all(Object.entries(list.fields).map(async ([fieldKey, field]) => {
    try {
      return [fieldKey, operation === 'create' ? await field.hooks.resolveInput.create({
        ...hookArgs,
        resolvedData,
        fieldKey
      }) : await field.hooks.resolveInput.update({
        ...hookArgs,
        resolvedData,
        fieldKey
      })];
    } catch (error) {
      fieldsErrors.push({
        error,
        tag: `${list.listKey}.${fieldKey}.hooks.resolveInput`
      });
      return [fieldKey, undefined];
    }
  })));
  if (fieldsErrors.length) throw extensionError('resolveInput', fieldsErrors);

  // list hooks
  try {
    if (operation === 'create') {
      resolvedData = await list.hooks.resolveInput.create({
        ...hookArgs,
        resolvedData
      });
    } else if (operation === 'update') {
      resolvedData = await list.hooks.resolveInput.update({
        ...hookArgs,
        resolvedData
      });
    }
  } catch (error) {
    throw extensionError('resolveInput', [{
      error,
      tag: `${list.listKey}.hooks.resolveInput`
    }]);
  }
  return resolvedData;
}
async function resolveInputForCreateOrUpdate(list, context, inputData, item) {
  const nestedMutationState = new NestedMutationState(context);
  const baseHookArgs = {
    context,
    listKey: list.listKey,
    inputData,
    resolvedData: {}
  };
  const hookArgs = item === undefined ? {
    ...baseHookArgs,
    operation: 'create',
    item,
    originalItem: undefined
  } : {
    ...baseHookArgs,
    operation: 'update',
    item,
    originalItem: item
  };

  // Take the original input and resolve all the fields down to what
  // will be saved into the database.
  hookArgs.resolvedData = await getResolvedData(list, hookArgs, nestedMutationState);

  // Apply all validation checks
  await validate({
    list,
    hookArgs
  });

  // before operation
  await runSideEffectOnlyHook(list, 'beforeOperation', hookArgs);

  // Return the full resolved input (ready for prisma level operation),
  // and the afterOperation hook to be applied
  return {
    data: transformForPrismaClient(list.fields, hookArgs.resolvedData, context),
    afterOperation: async updatedItem => {
      await nestedMutationState.afterOperation();

      // after operation
      await runSideEffectOnlyHook(list, 'afterOperation', {
        ...hookArgs,
        item: updatedItem
      });
    }
  };
}
function transformInnerDBField(dbField, context, value) {
  if (dbField.kind === 'scalar' && dbField.scalar === 'Json' && value === null) {
    return context.__internal.prisma.DbNull;
  }
  return value;
}
function transformForPrismaClient(fields, data, context) {
  return Object.fromEntries([...function* () {
    for (const fieldKey in data) {
      const value = data[fieldKey];
      const {
        dbField
      } = fields[fieldKey];
      if (dbField.kind === 'multi') {
        for (const innerFieldKey in value) {
          const innerFieldValue = value[innerFieldKey];
          yield [getDBFieldKeyForFieldOnMultiField(fieldKey, innerFieldKey), transformInnerDBField(dbField.fields[innerFieldKey], context, innerFieldValue)];
        }
        continue;
      }
      yield [fieldKey, transformInnerDBField(dbField, context, value)];
    }
  }()]);
}

// This is not a thing that I really agree with but it's to make the behaviour consistent with old keystone.
// Basically, old keystone uses Promise.allSettled and then after that maps that into promises that resolve and reject,
// whereas the new stuff is just like "here are some promises" with no guarantees about the order they will be settled in.
// That doesn't matter when they all resolve successfully because the order they resolve successfully in
// doesn't affect anything, If some reject though, the order that they reject in will be the order in the errors array
// and some of our tests rely on the order of the graphql errors array. They shouldn't, but they do.
function promisesButSettledWhenAllSettledAndInOrder(promises) {
  const resultsPromise = Promise.allSettled(promises);
  return promises.map(async (_, i) => {
    const result = (await resultsPromise)[i];
    return result.status === 'fulfilled' ? Promise.resolve(result.value) : Promise.reject(result.reason);
  });
}
function nonNull(t) {
  if (t === Empty) return t;
  return nonNull$1(t);
}
function getMutationsForList(list$1) {
  const defaultUniqueWhereInput = list$1.isSingleton ? {
    id: '1'
  } : undefined;
  const createOne_ = field({
    type: list$1.graphql.types.output,
    args: {
      data: arg({
        type: nonNull(list$1.graphql.types.create)
      })
    },
    resolve(_rootVal, {
      data
    }, context) {
      return createOne(data, list$1, context);
    }
  });
  const createMany_ = field({
    type: list(list$1.graphql.types.output),
    args: {
      data: arg({
        type: nonNull$1(list(nonNull(list$1.graphql.types.create)))
      })
    },
    async resolve(_rootVal, {
      data
    }, context) {
      return promisesButSettledWhenAllSettledAndInOrder(await createMany(data, list$1, context));
    }
  });
  const updateOne_ = field({
    type: list$1.graphql.types.output,
    args: {
      where: arg({
        type: nonNull$1(list$1.graphql.types.uniqueWhere),
        defaultValue: defaultUniqueWhereInput
      }),
      data: arg({
        type: nonNull(list$1.graphql.types.update)
      })
    },
    resolve(_rootVal, {
      where,
      data
    }, context) {
      return updateOne({
        where,
        data
      }, list$1, context);
    }
  });
  const updateManyInput = inputObject({
    name: list$1.graphql.names.updateManyInputName,
    fields: {
      where: arg({
        type: nonNull$1(list$1.graphql.types.uniqueWhere),
        defaultValue: defaultUniqueWhereInput
      }),
      data: arg({
        type: nonNull(list$1.graphql.types.update)
      })
    }
  });
  const updateMany_ = field({
    type: list(list$1.graphql.types.output),
    args: {
      data: arg({
        type: nonNull$1(list(nonNull(updateManyInput)))
      })
    },
    async resolve(_rootVal, {
      data
    }, context) {
      return promisesButSettledWhenAllSettledAndInOrder(await updateMany(data, list$1, context));
    }
  });
  const deleteOne_ = field({
    type: list$1.graphql.types.output,
    args: {
      where: arg({
        type: nonNull$1(list$1.graphql.types.uniqueWhere),
        defaultValue: defaultUniqueWhereInput
      })
    },
    resolve(rootVal, {
      where
    }, context) {
      return deleteOne(where, list$1, context);
    }
  });
  const deleteMany_ = field({
    type: list(list$1.graphql.types.output),
    args: {
      where: arg({
        type: nonNull$1(list(nonNull$1(list$1.graphql.types.uniqueWhere)))
      })
    },
    async resolve(rootVal, {
      where
    }, context) {
      return promisesButSettledWhenAllSettledAndInOrder(await deleteMany(where, list$1, context));
    }
  });
  return {
    mutations: {
      ...(list$1.graphql.isEnabled.create && {
        [list$1.graphql.names.createMutationName]: createOne_,
        [list$1.graphql.names.createManyMutationName]: createMany_
      }),
      ...(list$1.graphql.isEnabled.update && {
        [list$1.graphql.names.updateMutationName]: updateOne_,
        [list$1.graphql.names.updateManyMutationName]: updateMany_
      }),
      ...(list$1.graphql.isEnabled.delete && {
        [list$1.graphql.names.deleteMutationName]: deleteOne_,
        [list$1.graphql.names.deleteManyMutationName]: deleteMany_
      })
    },
    updateManyInput
  };
}

function getGraphQLSchema(lists, extraFields, sudo) {
  const query = object()({
    name: 'Query',
    fields: Object.assign({}, ...Object.values(lists).map(list => getQueriesForList(list)), extraFields.query)
  });
  const updateManyByList = {};
  const mutation = object()({
    name: 'Mutation',
    fields: Object.assign({}, ...Object.values(lists).map(list => {
      const {
        mutations,
        updateManyInput
      } = getMutationsForList(list);
      updateManyByList[list.listKey] = updateManyInput;
      return mutations;
    }), extraFields.mutation)
  });
  return new GraphQLSchema({
    query: query.graphQLType,
    mutation: mutation.graphQLType,
    // not about behaviour, only ordering
    types: [...collectTypes(lists, updateManyByList), mutation.graphQLType],
    extensions: {
      sudo
    }
  });
}
function collectTypes(lists, updateManyByList) {
  const collectedTypes = [];
  for (const list of Object.values(lists)) {
    const {
      isEnabled
    } = list.graphql;
    if (!isEnabled.type) continue;
    // adding all of these types explicitly isn't strictly necessary but we do it to create a certain order in the schema
    collectedTypes.push(list.graphql.types.output.graphQLType);
    if (isEnabled.query || isEnabled.update || isEnabled.delete) {
      collectedTypes.push(list.graphql.types.uniqueWhere.graphQLType);
    }
    if (isEnabled.query) {
      for (const field of Object.values(list.fields)) {
        if (isEnabled.query && field.graphql.isEnabled.read && field.unreferencedConcreteInterfaceImplementations) {
          // this _IS_ actually necessary since they aren't implicitly referenced by other types, unlike the types above
          collectedTypes.push(...field.unreferencedConcreteInterfaceImplementations.map(x => x.graphQLType));
        }
      }
      collectedTypes.push(list.graphql.types.where.graphQLType);
      collectedTypes.push(list.graphql.types.orderBy.graphQLType);
    }
    if (isEnabled.update) {
      if (list.graphql.types.update.kind === 'input') {
        collectedTypes.push(list.graphql.types.update.graphQLType);
      }
      collectedTypes.push(updateManyByList[list.listKey].graphQLType);
    }
    if (isEnabled.create) {
      if (list.graphql.types.create.kind === 'input') {
        collectedTypes.push(list.graphql.types.create.graphQLType);
      }
    }
  }
  // this is not necessary, just about ordering
  collectedTypes.push(JSON$1.graphQLType);
  return collectedTypes;
}
function createGraphQLSchema(config, lists, adminMeta, sudo) {
  var _config$graphql$exten, _config$graphql, _config$graphql$exten2;
  const graphQLSchema = getGraphQLSchema(lists, {
    mutation: config.session ? {
      endSession: field({
        type: nonNull$1(Boolean),
        async resolve(rootVal, args, context) {
          var _context$sessionStrat;
          await ((_context$sessionStrat = context.sessionStrategy) === null || _context$sessionStrat === void 0 ? void 0 : _context$sessionStrat.end({
            context
          }));
          return true;
        }
      })
    } : {},
    query: adminMeta ? {
      keystone: field({
        type: nonNull$1(KeystoneMeta),
        resolve: () => ({
          adminMeta
        })
      })
    } : {}
  }, sudo);

  // merge in the user defined graphQL API
  return (_config$graphql$exten = (_config$graphql = config.graphql) === null || _config$graphql === void 0 || (_config$graphql$exten2 = _config$graphql.extendGraphqlSchema) === null || _config$graphql$exten2 === void 0 ? void 0 : _config$graphql$exten2.call(_config$graphql, graphQLSchema)) !== null && _config$graphql$exten !== void 0 ? _config$graphql$exten : graphQLSchema;
}

function localImageAssetsAPI(storageConfig) {
  return {
    async url(id, extension) {
      return storageConfig.generateUrl(`/${id}.${extension}`);
    },
    async upload(buffer, id, extension) {
      await fs.writeFile(path.join(storageConfig.storagePath, `${id}.${extension}`), buffer);
    },
    async delete(id, extension) {
      try {
        await fs.unlink(path.join(storageConfig.storagePath, `${id}.${extension}`));
      } catch (e) {
        const error = e;
        // If the file doesn't exist, we don't care
        if (error.code !== 'ENOENT') {
          throw e;
        }
      }
    }
  };
}
function localFileAssetsAPI(storageConfig) {
  return {
    async url(filename) {
      return storageConfig.generateUrl(`/${filename}`);
    },
    async upload(stream, filename) {
      const writeStream = fs$1.createWriteStream(path.join(storageConfig.storagePath, filename));
      const pipeStreams = new Promise((resolve, reject) => {
        pipeline(stream, writeStream, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      try {
        await pipeStreams;
        const {
          size: filesize
        } = await fs.stat(path.join(storageConfig.storagePath, filename));
        return {
          filesize,
          filename
        };
      } catch (e) {
        await fs.rm(path.join(storageConfig.storagePath, filename));
        throw e;
      }
    },
    async delete(filename) {
      try {
        await fs.unlink(path.join(storageConfig.storagePath, filename));
      } catch (e) {
        const error = e;
        // If the file doesn't exist, we don't care
        if (error.code !== 'ENOENT') {
          throw e;
        }
      }
    }
  };
}

function s3ImageAssetsAPI(storageConfig) {
  const {
    generateUrl,
    s3,
    presign,
    s3Endpoint
  } = s3AssetsCommon(storageConfig);
  return {
    async url(id, extension) {
      if (!storageConfig.signed) {
        return generateUrl(`${s3Endpoint}${storageConfig.pathPrefix || ''}${id}.${extension}`);
      }
      return generateUrl(await presign(`${id}.${extension}`));
    },
    async upload(buffer, id, extension) {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: storageConfig.bucketName,
          Key: `${storageConfig.pathPrefix || ''}${id}.${extension}`,
          Body: buffer,
          ContentType: {
            png: 'image/png',
            webp: 'image/webp',
            gif: 'image/gif',
            jpg: 'image/jpeg'
          }[extension],
          ACL: storageConfig.acl
        }
      });
      await upload.done();
    },
    async delete(id, extension) {
      await s3.deleteObject({
        Bucket: storageConfig.bucketName,
        Key: `${storageConfig.pathPrefix || ''}${id}.${extension}`
      });
    }
  };
}
function s3FileAssetsAPI(storageConfig) {
  const {
    generateUrl,
    s3,
    presign,
    s3Endpoint
  } = s3AssetsCommon(storageConfig);
  return {
    async url(filename) {
      if (!storageConfig.signed) {
        return generateUrl(`${s3Endpoint}${storageConfig.pathPrefix || ''}${filename}`);
      }
      return generateUrl(await presign(filename));
    },
    async upload(stream, filename) {
      let filesize = 0;
      stream.on('data', data => {
        filesize += data.length;
      });
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: storageConfig.bucketName,
          Key: (storageConfig.pathPrefix || '') + filename,
          Body: stream,
          ContentType: 'application/octet-stream',
          ACL: storageConfig.acl
        }
      });
      await upload.done();
      return {
        filename,
        filesize
      };
    },
    async delete(filename) {
      await s3.deleteObject({
        Bucket: storageConfig.bucketName,
        Key: (storageConfig.pathPrefix || '') + filename
      });
    }
  };
}
function getS3AssetsEndpoint(storageConfig) {
  let endpoint = storageConfig.endpoint ? new URL(storageConfig.endpoint) : new URL(`https://s3.${storageConfig.region}.amazonaws.com`);
  if (storageConfig.forcePathStyle) {
    endpoint = new URL(`/${storageConfig.bucketName}`, endpoint);
  } else {
    endpoint.hostname = `${storageConfig.bucketName}.${endpoint.hostname}`;
  }
  const endpointString = endpoint.toString();
  if (endpointString.endsWith('/')) return endpointString;
  return `${endpointString}/`;
}
function s3AssetsCommon(storageConfig) {
  var _storageConfig$genera;
  const s3 = new S3({
    credentials: storageConfig.accessKeyId && storageConfig.secretAccessKey ? {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey
    } : undefined,
    region: storageConfig.region,
    endpoint: storageConfig.endpoint,
    forcePathStyle: storageConfig.forcePathStyle
  });
  const s3Endpoint = getS3AssetsEndpoint(storageConfig);
  const generateUrl = (_storageConfig$genera = storageConfig.generateUrl) !== null && _storageConfig$genera !== void 0 ? _storageConfig$genera : url => url;
  return {
    generateUrl,
    s3,
    s3Endpoint,
    presign: async filename => {
      var _storageConfig$signed;
      const command = new GetObjectCommand({
        Bucket: storageConfig.bucketName,
        Key: (storageConfig.pathPrefix || '') + filename
      });
      return getSignedUrl(s3, command, {
        expiresIn: (_storageConfig$signed = storageConfig.signed) === null || _storageConfig$signed === void 0 ? void 0 : _storageConfig$signed.expiry
      });
    }
  };
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function defaultTransformName$1(path) {
  return randomBytes(16).toString('base64url');
}
async function getImageMetadataFromBuffer(buffer) {
  const fileType = await (await import('file-type')).fileTypeFromBuffer(buffer);
  if (!fileType) {
    throw new Error('File type not found');
  }
  const {
    ext: extension
  } = fileType;
  if (extension !== 'jpg' && extension !== 'png' && extension !== 'webp' && extension !== 'gif') {
    throw new Error(`${extension} is not a supported image type`);
  }
  const {
    height,
    width
  } = imageSize(buffer);
  if (width === undefined || height === undefined) {
    throw new Error('Height and width could not be found for image');
  }
  return {
    width,
    height,
    filesize: buffer.length,
    extension
  };
}
function createImagesContext(config) {
  const imageAssetsAPIs = new Map();
  for (const [storageKey, storageConfig] of Object.entries(config.storage || {})) {
    if (storageConfig.type === 'image') {
      imageAssetsAPIs.set(storageKey, storageConfig.kind === 'local' ? localImageAssetsAPI(storageConfig) : s3ImageAssetsAPI(storageConfig));
    }
  }
  return storageString => {
    const adapter = imageAssetsAPIs.get(storageString);
    if (adapter === undefined) {
      throw new Error(`No file assets API found for storage string "${storageString}"`);
    }
    return {
      getUrl: async (id, extension) => {
        return adapter.url(id, extension);
      },
      getDataFromStream: async (stream, originalFilename) => {
        const storageConfig = config.storage[storageString];
        const {
          transformName = defaultTransformName$1
        } = storageConfig;
        const buffer = await streamToBuffer(stream);
        const {
          extension,
          ...rest
        } = await getImageMetadataFromBuffer(buffer);
        const id = await transformName(originalFilename, extension);
        await adapter.upload(buffer, id, extension);
        return {
          id,
          extension,
          ...rest
        };
      },
      deleteAtSource: adapter.delete
    };
  };
}

// appends a 128-bit random identifier to the filename to prevent guessing
function defaultTransformName(path) {
  // this regex lazily matches for any characters that aren't a new line
  // it then optionally matches the last instance of a "." symbol
  // followed by any alphanumerical character before the end of the string
  const [, name, ext] = path.match(/^([^:\n].*?)(\.[A-Za-z0-9]{0,10})?$/);
  const id = randomBytes(16).toString('base64url');
  const urlSafeName = name.replace(/[^A-Za-z0-9]/g, '-');
  if (ext) return `${urlSafeName}-${id}${ext}`;
  return `${urlSafeName}-${id}`;
}
function createFilesContext(config) {
  const adaptersMap = new Map();
  for (const [storageKey, storageConfig] of Object.entries(config.storage || {})) {
    if (storageConfig.type === 'file') {
      adaptersMap.set(storageKey, storageConfig.kind === 'local' ? localFileAssetsAPI(storageConfig) : s3FileAssetsAPI(storageConfig));
    }
  }
  return storageString => {
    const adapter = adaptersMap.get(storageString);
    if (!adapter) {
      throw new Error(`No file assets API found for storage string "${storageString}"`);
    }
    return {
      getUrl: async filename => {
        return adapter.url(filename);
      },
      getDataFromStream: async (stream, originalFilename) => {
        const storageConfig = config.storage[storageString];
        const {
          transformName = defaultTransformName
        } = storageConfig;
        const filename = await transformName(originalFilename);
        const {
          filesize
        } = await adapter.upload(stream, filename);
        return {
          filename,
          filesize
        };
      },
      deleteAtSource: async filename => {
        await adapter.delete(filename);
      }
    };
  };
}

function getRootTypeName(type) {
  if (type instanceof GraphQLNonNull) {
    return getRootTypeName(type.ofType);
  }
  if (type instanceof GraphQLList) {
    return getRootTypeName(type.ofType);
  }
  return type.name;
}
function executeGraphQLFieldWithSelection(schema, operation, fieldName) {
  const rootType = operation === 'mutation' ? schema.getMutationType() : schema.getQueryType();
  const field = rootType.getFields()[fieldName];
  if (field === undefined) {
    return () => {
      // This will be triggered if the field is missing due to `omit` configuration.
      // The GraphQL equivalent would be a bad user input error.
      throw new Error(`This ${operation} is not supported by the GraphQL schema: ${fieldName}()`);
    };
  }
  const {
    argumentNodes,
    variableDefinitions
  } = getVariablesForGraphQLField(field);
  const rootName = getRootTypeName(field.type);
  return async (args, query, context) => {
    var _result$errors;
    const selectionSet = parse(`fragment x on ${rootName} {${query}}`).definitions[0].selectionSet;
    const document = {
      kind: Kind.DOCUMENT,
      definitions: [{
        kind: Kind.OPERATION_DEFINITION,
        // OperationTypeNode is an ts enum where the values are 'query' | 'mutation' | 'subscription'
        operation: operation,
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [{
            kind: Kind.FIELD,
            name: {
              kind: Kind.NAME,
              value: field.name
            },
            arguments: argumentNodes,
            selectionSet: selectionSet
          }]
        },
        variableDefinitions
      }]
    };
    const validationErrors = validate$1(schema, document);
    if (validationErrors.length > 0) {
      throw validationErrors[0];
    }
    const result = await execute({
      schema,
      document,
      contextValue: context,
      variableValues: Object.fromEntries(
      // GraphQL for some reason decides to make undefined values in args
      // skip defaulting for some reason
      // this ofc doesn't technically fully fix it (bc nested things)
      // but for the cases where we care, it does
      Object.entries(args).filter(([, val]) => val !== undefined)),
      rootValue: {}
    });
    if ((_result$errors = result.errors) !== null && _result$errors !== void 0 && _result$errors.length) {
      throw result.errors[0];
    }
    return result.data[field.name];
  };
}

function getQueryFactory(list, schema) {
  function f(operation, fieldName) {
    const exec = executeGraphQLFieldWithSelection(schema, operation, fieldName);
    return (_args = {}, context) => {
      const {
        query,
        ...args
      } = _args;
      return exec(args, query !== null && query !== void 0 ? query : 'id', context);
    };
  }
  const {
    listQueryCountName,
    whereInputName
  } = list.graphql.names;
  const fcache = {
    findOne: f('query', list.graphql.names.itemQueryName),
    findMany: f('query', list.graphql.names.listQueryName),
    count: async (args = {}, context) => {
      const {
        where = {}
      } = args;
      const {
        count
      } = await context.graphql.run({
        query: `query ($where: ${whereInputName}!) { count: ${listQueryCountName}(where: $where) }`,
        variables: {
          where
        }
      });
      return count;
    },
    createOne: f('mutation', list.graphql.names.createMutationName),
    createMany: f('mutation', list.graphql.names.createManyMutationName),
    updateOne: f('mutation', list.graphql.names.updateMutationName),
    updateMany: f('mutation', list.graphql.names.updateManyMutationName),
    deleteOne: f('mutation', list.graphql.names.deleteMutationName),
    deleteMany: f('mutation', list.graphql.names.deleteManyMutationName)
  };
  return context => {
    return {
      findOne: args => fcache.findOne(args, context),
      findMany: args => fcache.findMany(args, context),
      count: args => fcache.count(args, context),
      createOne: args => fcache.createOne(args, context),
      createMany: args => fcache.createMany(args, context),
      updateOne: args => fcache.updateOne(args, context),
      updateMany: args => fcache.updateMany(args, context),
      deleteOne: args => fcache.deleteOne(args, context),
      deleteMany: args => fcache.deleteMany(args, context)
    };
  };
}
function getDbFactory(list, schema) {
  const queryType = schema.getQueryType();
  const mutationType = schema.getMutationType();
  function f(operation, fieldName) {
    const rootType = operation === 'query' ? queryType : mutationType;
    const field = rootType.getFields()[fieldName];
    if (field === undefined) {
      return () => {
        // This will be triggered if the field is missing due to `omit` configuration.
        // The GraphQL equivalent would be a bad user input error.
        throw new Error(`This ${operation} is not supported by the GraphQL schema: ${fieldName}()`);
      };
    }
    return executeGraphQLFieldToRootVal(field);
  }
  const fcache = {
    findOne: f('query', list.graphql.names.itemQueryName),
    findMany: f('query', list.graphql.names.listQueryName),
    count: f('query', list.graphql.names.listQueryCountName),
    createOne: f('mutation', list.graphql.names.createMutationName),
    createMany: f('mutation', list.graphql.names.createManyMutationName),
    updateOne: f('mutation', list.graphql.names.updateMutationName),
    updateMany: f('mutation', list.graphql.names.updateManyMutationName),
    deleteOne: f('mutation', list.graphql.names.deleteMutationName),
    deleteMany: f('mutation', list.graphql.names.deleteManyMutationName)
  };
  return context => {
    return {
      findOne: args => fcache.findOne(args, context),
      findMany: args => fcache.findMany(args, context),
      count: args => fcache.count(args, context),
      createOne: args => fcache.createOne(args, context),
      createMany: args => fcache.createMany(args, context),
      updateOne: args => fcache.updateOne(args, context),
      updateMany: args => fcache.updateMany(args, context),
      deleteOne: args => fcache.deleteOne(args, context),
      deleteMany: args => fcache.deleteMany(args, context)
    };
  };
}

function createContext({
  config,
  lists,
  graphQLSchema,
  graphQLSchemaSudo,
  prismaClient,
  prismaTypes
}) {
  const dbFactories = {};
  for (const [listKey, list] of Object.entries(lists)) {
    dbFactories[listKey] = getDbFactory(list, graphQLSchema);
  }
  const dbFactoriesSudo = {};
  for (const [listKey, list] of Object.entries(lists)) {
    dbFactoriesSudo[listKey] = getDbFactory(list, graphQLSchemaSudo);
  }
  const queryFactories = {};
  for (const [listKey, list] of Object.entries(lists)) {
    queryFactories[listKey] = getQueryFactory(list, graphQLSchema);
  }
  const queryFactoriesSudo = {};
  for (const [listKey, list] of Object.entries(lists)) {
    queryFactoriesSudo[listKey] = getQueryFactory(list, graphQLSchemaSudo);
  }
  const images = createImagesContext(config);
  const files = createFilesContext(config);
  const construct = ({
    prisma,
    session,
    sudo,
    req,
    res
  }) => {
    const schema = sudo ? graphQLSchemaSudo : graphQLSchema;
    const rawGraphQL = async ({
      query,
      variables
    }) => {
      const source = typeof query === 'string' ? query : print(query);
      return await graphql$1({
        schema,
        source,
        contextValue: context,
        variableValues: variables
      });
    };
    const runGraphQL = async ({
      query,
      variables
    }) => {
      var _result$errors;
      const result = await rawGraphQL({
        query,
        variables
      });
      if ((_result$errors = result.errors) !== null && _result$errors !== void 0 && _result$errors.length) throw result.errors[0];
      return result.data;
    };
    const context = {
      prisma,
      db: {},
      query: {},
      graphql: {
        raw: rawGraphQL,
        run: runGraphQL,
        schema
      },
      sudo: () => construct({
        prisma,
        session,
        sudo: true,
        req,
        res
      }),
      transaction: async (f, opts) => {
        return await prisma.$transaction(async prisma_ => {
          const newContext = construct({
            prisma: prisma_,
            session,
            sudo,
            req,
            res
          });
          return await f(newContext);
        }, opts);
      },
      req,
      res,
      sessionStrategy: config.session,
      ...(session ? {
        session
      } : {}),
      withRequest: async (newReq, newRes) => {
        var _await$config$session, _config$session;
        const newContext = construct({
          prisma,
          session,
          sudo,
          req: newReq,
          res: newRes
        });
        return newContext.withSession((_await$config$session = await ((_config$session = config.session) === null || _config$session === void 0 ? void 0 : _config$session.get({
          context: newContext
        }))) !== null && _await$config$session !== void 0 ? _await$config$session : undefined);
      },
      withSession: session => {
        return construct({
          prisma,
          session,
          sudo,
          req,
          res
        });
      },
      images,
      files,
      __internal: {
        lists,
        prisma: {
          ...prismaTypes
        }
      }
    };
    const _dbFactories = sudo ? dbFactoriesSudo : dbFactories;
    const _queryFactories = sudo ? queryFactoriesSudo : queryFactories;
    for (const listKey of Object.keys(lists)) {
      context.db[listKey] = _dbFactories[listKey](context);
      context.query[listKey] = _queryFactories[listKey](context);
    }
    return context;
  };
  return construct({
    prisma: prismaClient,
    session: undefined,
    sudo: false
  });
}

// note: all keystone fields correspond to a field here
// not all fields here correspond to keystone fields(the implicit side of one-sided relation fields)

function sortRelationships(left, right) {
  if (left.field.mode === 'one' && right.field.mode === 'one') {
    if (left.field.foreignKey !== undefined && right.field.foreignKey !== undefined) {
      throw new Error(`You can only set db.foreignKey on one side of a one to one relationship, but foreignKey is set on both ${left.listKey}.${left.fieldPath} and ${right.listKey}.${right.fieldPath}`);
    }

    // return the field that specifies the foreignKey first
    if (left.field.foreignKey) return [left, right];
    if (right.field.foreignKey) return [right, left];
  } else if (left.field.mode === 'one' || right.field.mode === 'one') {
    // many relationships will never have a foreign key, so return the one relationship first
    const rels = left.field.mode === 'one' ? [left, right] : [right, left];
    // we're only doing this for rels[1] because:
    // - rels[1] is the many side
    // - for the one side, TypeScript will already disallow relationName
    if (rels[1].field.relationName !== undefined) throw new Error(`You can only set db.relationName on one side of a many to many relationship, but db.relationName is set on ${rels[1].listKey}.${rels[1].fieldPath} which is the many side of a many to one relationship with ${rels[0].listKey}.${rels[0].fieldPath}`);
    return rels;
  }
  if (left.field.mode === 'many' && right.field.mode === 'many' && (left.field.relationName !== undefined || right.field.relationName !== undefined)) {
    if (left.field.relationName !== undefined && right.field.relationName !== undefined) {
      throw new Error(`You can only set db.relationName on one side of a many to many relationship, but db.relationName is set on both ${left.listKey}.${left.fieldPath} and ${right.listKey}.${right.fieldPath}`);
    }
    return left.field.relationName !== undefined ? [left, right] : [right, left];
  }
  const order = left.listKey.localeCompare(right.listKey);
  if (order > 0) return [right, left]; // left comes after right, so swap them
  if (order === 0) {
    // self referential list, so check the paths.
    if (left.fieldPath.localeCompare(right.fieldPath) > 0) {
      return [right, left];
    }
  }
  return [left, right];
}

// what's going on here:
// - validating all the relationships
// - for relationships involving to-one: deciding which side owns the foreign key
// - turning one-sided relationships into two-sided relationships so that elsewhere in Keystone,
//   you only have to reason about two-sided relationships
//   (note that this means that there are "fields" in the returned ListsWithResolvedRelations
//   which are not actually proper Keystone fields, they are just a db field and nothing else)
function resolveRelationships(lists) {
  const alreadyResolvedTwoSidedRelationships = new Set();
  const resolvedLists = Object.fromEntries(Object.keys(lists).map(listKey => [listKey, {}]));
  for (const [listKey, fields] of Object.entries(lists)) {
    const resolvedList = resolvedLists[listKey];
    for (const [fieldPath, {
      dbField: field
    }] of Object.entries(fields.fields)) {
      if (field.kind !== 'relation') {
        resolvedList[fieldPath] = field;
        continue;
      }
      const foreignUnresolvedList = lists[field.list];
      if (!foreignUnresolvedList) {
        throw new Error(`The relationship field at ${listKey}.${fieldPath} points to the list ${listKey} which does not exist`);
      }
      if (foreignUnresolvedList.isSingleton) {
        throw new Error(`The relationship field at ${listKey}.${fieldPath} points to a singleton list, ${listKey}, which is not allowed`);
      }
      if (field.field) {
        var _foreignUnresolvedLis, _leftRel$field$foreig2;
        const localRef = `${listKey}.${fieldPath}`;
        const foreignRef = `${field.list}.${field.field}`;
        if (alreadyResolvedTwoSidedRelationships.has(localRef)) continue;
        alreadyResolvedTwoSidedRelationships.add(foreignRef);
        const foreignField = (_foreignUnresolvedLis = foreignUnresolvedList.fields[field.field]) === null || _foreignUnresolvedLis === void 0 ? void 0 : _foreignUnresolvedLis.dbField;
        if (!foreignField) throw new Error(`${localRef} points to ${foreignRef}, but ${foreignRef} doesn't exist`);
        if (foreignField.kind !== 'relation') {
          throw new Error(`${localRef} points to ${foreignRef}, but ${foreignRef} is not a relationship field`);
        }
        const actualRef = foreignField.field ? `${foreignField.list}.${foreignField.field}` : foreignField.list;
        if (actualRef !== localRef) {
          throw new Error(`${localRef} expects ${foreignRef} to be a two way relationship, but ${foreignRef} points to ${actualRef}`);
        }
        const [leftRel, rightRel] = sortRelationships({
          listKey,
          fieldPath,
          field
        }, {
          listKey: field.list,
          fieldPath: field.field,
          field: foreignField
        });
        if (leftRel.field.mode === 'one' && rightRel.field.mode === 'one') {
          var _leftRel$field$foreig;
          const relationName = `${leftRel.listKey}_${leftRel.fieldPath}`;
          resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
            kind: 'relation',
            mode: 'one',
            field: rightRel.fieldPath,
            list: rightRel.listKey,
            extendPrismaSchema: leftRel.field.extendPrismaSchema,
            foreignIdField: {
              kind: 'owned-unique',
              map: typeof leftRel.field.foreignKey === 'object' ? (_leftRel$field$foreig = leftRel.field.foreignKey) === null || _leftRel$field$foreig === void 0 ? void 0 : _leftRel$field$foreig.map : leftRel.fieldPath
            },
            relationName
          };
          resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
            kind: 'relation',
            mode: 'one',
            field: leftRel.fieldPath,
            list: leftRel.listKey,
            extendPrismaSchema: rightRel.field.extendPrismaSchema,
            foreignIdField: {
              kind: 'none'
            },
            relationName
          };
          continue;
        }
        if (leftRel.field.mode === 'many' && rightRel.field.mode === 'many') {
          var _leftRel$field$relati;
          const relationName = (_leftRel$field$relati = leftRel.field.relationName) !== null && _leftRel$field$relati !== void 0 ? _leftRel$field$relati : `${leftRel.listKey}_${leftRel.fieldPath}`;
          resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
            kind: 'relation',
            mode: 'many',
            extendPrismaSchema: leftRel.field.extendPrismaSchema,
            field: rightRel.fieldPath,
            list: rightRel.listKey,
            relationName
          };
          resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
            kind: 'relation',
            mode: 'many',
            extendPrismaSchema: rightRel.field.extendPrismaSchema,
            field: leftRel.fieldPath,
            list: leftRel.listKey,
            relationName
          };
          continue;
        }
        const relationName = `${leftRel.listKey}_${leftRel.fieldPath}`;
        resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
          kind: 'relation',
          mode: 'one',
          field: rightRel.fieldPath,
          extendPrismaSchema: leftRel.field.extendPrismaSchema,
          list: rightRel.listKey,
          foreignIdField: {
            kind: 'owned',
            map: typeof leftRel.field.foreignKey === 'object' ? (_leftRel$field$foreig2 = leftRel.field.foreignKey) === null || _leftRel$field$foreig2 === void 0 ? void 0 : _leftRel$field$foreig2.map : leftRel.fieldPath
          },
          relationName
        };
        resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
          kind: 'relation',
          mode: 'many',
          extendPrismaSchema: rightRel.field.extendPrismaSchema,
          field: leftRel.fieldPath,
          list: leftRel.listKey,
          relationName
        };
        continue;
      }
      const foreignFieldPath = `from_${listKey}_${fieldPath}`;
      if (foreignUnresolvedList.fields[foreignFieldPath]) {
        throw new Error(`The relationship field at ${listKey}.${fieldPath} points to the list ${field.list}, Keystone needs to a create a relationship field at ${field.list}.${foreignFieldPath} to support the relationship at ${listKey}.${fieldPath} but ${field.list} already has a field named ${foreignFieldPath}`);
      }
      if (field.mode === 'many') {
        var _field$relationName;
        const relationName = (_field$relationName = field.relationName) !== null && _field$relationName !== void 0 ? _field$relationName : `${listKey}_${fieldPath}`;
        resolvedLists[field.list][foreignFieldPath] = {
          kind: 'relation',
          mode: 'many',
          extendPrismaSchema: field.extendPrismaSchema,
          list: listKey,
          field: fieldPath,
          relationName
        };
        resolvedList[fieldPath] = {
          kind: 'relation',
          mode: 'many',
          extendPrismaSchema: field.extendPrismaSchema,
          list: field.list,
          field: foreignFieldPath,
          relationName
        };
      } else {
        var _field$foreignKey;
        const relationName = `${listKey}_${fieldPath}`;
        resolvedLists[field.list][foreignFieldPath] = {
          kind: 'relation',
          mode: 'many',
          extendPrismaSchema: field.extendPrismaSchema,
          list: listKey,
          field: fieldPath,
          relationName
        };
        resolvedList[fieldPath] = {
          kind: 'relation',
          list: field.list,
          extendPrismaSchema: field.extendPrismaSchema,
          field: foreignFieldPath,
          foreignIdField: {
            kind: 'owned',
            map: typeof field.foreignKey === 'object' ? (_field$foreignKey = field.foreignKey) === null || _field$foreignKey === void 0 ? void 0 : _field$foreignKey.map : fieldPath
          },
          relationName,
          mode: 'one'
        };
      }
    }
  }

  // the way we resolve the relationships means that the relationships will be in a
  // different order than the order the user specified in their config
  // doesn't really change the behaviour of anything but it means that the order of the fields in the prisma schema will be
  // the same as the user provided
  return Object.fromEntries(Object.entries(resolvedLists).map(([listKey, outOfOrderDbFields]) => {
    // this adds the fields based on the order that the user passed in
    // (except it will not add the opposites to one-sided relations)
    const resolvedDbFields = Object.fromEntries(Object.keys(lists[listKey].fields).map(fieldKey => [fieldKey, outOfOrderDbFields[fieldKey]]));
    // then we add the opposites to one-sided relations
    Object.assign(resolvedDbFields, outOfOrderDbFields);
    return [listKey, resolvedDbFields];
  }));
}

function getRelationVal(dbField, id, foreignList, context, info, fk) {
  const oppositeDbField = foreignList.resolvedDbFields[dbField.field];
  if (oppositeDbField.kind !== 'relation') throw new Error('failed assert');
  if (dbField.mode === 'many') {
    const relationFilter = {
      [dbField.field]: oppositeDbField.mode === 'many' ? {
        some: {
          id
        }
      } : {
        id
      }
    };
    return {
      findMany: async args => findMany(args, foreignList, context, info, relationFilter),
      count: async ({
        where
      }) => count({
        where
      }, foreignList, context, info, relationFilter)
    };
  } else {
    return async () => {
      if (fk === null) {
        // If the foreign key is explicitly null, there's no need to anything else,
        // since we know the related item doesn't exist.
        return null;
      }
      // for one-to-many relationships, the one side always owns the foreign key
      // so that means we have the id for the related item and we're fetching it by _its_ id.
      // for the a one-to-one relationship though, the id might be on the related item
      // so we need to fetch the related item by the id of the current item on the foreign key field
      const currentItemOwnsForeignKey = fk !== undefined;
      return fetchRelatedItem(context)(foreignList)(currentItemOwnsForeignKey ? 'id' : `${dbField.field}Id`)(currentItemOwnsForeignKey ? fk : id);
    };
  }
}
function weakMemoize(cb) {
  const cache = new WeakMap();
  return arg => {
    if (!cache.has(arg)) {
      const result = cb(arg);
      cache.set(arg, result);
    }
    return cache.get(arg);
  };
}
function memoize(cb) {
  const cache = new Map();
  return arg => {
    if (!cache.has(arg)) {
      const result = cb(arg);
      cache.set(arg, result);
    }
    return cache.get(arg);
  };
}
const fetchRelatedItem = weakMemoize(context => weakMemoize(foreignList => memoize(idFieldKey => {
  const relatedItemLoader = new DataLoader(keys => fetchRelatedItems(context, foreignList, idFieldKey, keys), {
    cache: false
  });
  return id => relatedItemLoader.load(id);
})));
async function fetchRelatedItems(context, foreignList, idFieldKey, toFetch) {
  const operationAccess = await getOperationAccess(foreignList, context, 'query');
  if (!operationAccess) {
    return toFetch.map(() => undefined);
  }
  const accessFilters = await getAccessFilters(foreignList, context, 'query');
  if (accessFilters === false) {
    return toFetch.map(() => undefined);
  }
  const toFetchUnique = Array.from(new Set(toFetch));
  const resolvedWhere = await accessControlledFilter(foreignList, context, {
    [idFieldKey]: {
      in: toFetchUnique
    }
  }, accessFilters);
  const results = await context.prisma[foreignList.listKey].findMany({
    where: resolvedWhere
  });
  const resultsById = new Map(results.map(x => [x[idFieldKey], x]));
  return toFetch.map(id => resultsById.get(id));
}
function getValueForDBField(rootVal, dbField, id, fieldPath, context, lists, info) {
  if (dbField.kind === 'multi') {
    return Object.fromEntries(Object.keys(dbField.fields).map(innerDBFieldKey => {
      const keyOnDbValue = getDBFieldKeyForFieldOnMultiField(fieldPath, innerDBFieldKey);
      return [innerDBFieldKey, rootVal[keyOnDbValue]];
    }));
  }
  if (dbField.kind === 'relation') {
    // If we're holding a foreign key value, let's take advantage of that.
    let fk;
    if (dbField.mode === 'one' && dbField.foreignIdField.kind !== 'none') {
      fk = rootVal[`${fieldPath}Id`];
    }
    return getRelationVal(dbField, id, lists[dbField.list], context, info, fk);
  } else {
    return rootVal[fieldPath];
  }
}
function outputTypeField(output, dbField, cacheHint, access, listKey, fieldKey, lists) {
  const list = lists[listKey];
  return field({
    type: output.type,
    deprecationReason: output.deprecationReason,
    description: output.description,
    args: output.args,
    extensions: output.extensions,
    async resolve(rootVal, args, context, info) {
      const id = rootVal.id;
      const fieldAccess = await getOperationFieldAccess(rootVal, list, fieldKey, context, 'read');
      if (!fieldAccess) return null;

      // only static cache hints are supported at the field level until a use-case makes it clear what parameters a dynamic hint would take
      if (cacheHint && info) {
        var _maybeCacheControlFro;
        (_maybeCacheControlFro = maybeCacheControlFromInfo(info)) === null || _maybeCacheControlFro === void 0 || _maybeCacheControlFro.setCacheHint(cacheHint);
      }
      const value = getValueForDBField(rootVal, dbField, id, fieldKey, context, lists, info);
      if (output.resolve) {
        return output.resolve({
          value,
          item: rootVal
        }, args, context, info);
      } else {
        return value;
      }
    }
  });
}

function assertFieldsValid(list) {
  assertNoConflictingExtraOutputFields(list);
  assertIdFieldGraphQLTypesCorrect(list);
  assertNoFieldKeysThatConflictWithFilterCombinators(list);
  assertUniqueWhereInputsValid(list);
  assertFieldsIsNonNullAllowed(list);
}
function assertFieldsIsNonNullAllowed(list) {
  for (const [fieldKey, field] of Object.entries(list.fields)) {
    if (field.access.read !== allowAll) {
      if (field.graphql.isNonNull.read) {
        throw new Error(`The field at ${list.listKey}.${fieldKey} sets graphql.isNonNull.read: true, and has 'read' field access control, this is not allowed.\n` + `Either disable graphql.read.isNonNull, or disable 'read' field access control.`);
      }
    }
  }
}
function assertUniqueWhereInputsValid(list) {
  for (const [fieldKey, {
    dbField,
    input
  }] of Object.entries(list.fields)) {
    if (input !== null && input !== void 0 && input.uniqueWhere) {
      if (dbField.kind !== 'scalar' && dbField.kind !== 'enum') {
        throw new Error(`Only scalar db fields can provide a uniqueWhere input currently but the field at ${list.listKey}.${fieldKey} specifies a uniqueWhere input`);
      }
      if (dbField.index !== 'unique' && fieldKey !== 'id') {
        throw new Error(`Fields must have a unique index or be the idField to specify a uniqueWhere input but the field at ${list.listKey}.${fieldKey} specifies a uniqueWhere input without a unique index`);
      }
    }
  }
}
function assertNoFieldKeysThatConflictWithFilterCombinators(list) {
  for (const fieldKey of Object.keys(list.fields)) {
    if (fieldKey === 'AND' || fieldKey === 'OR' || fieldKey === 'NOT') {
      throw new Error(`Fields cannot be named ${fieldKey} but there is a field named ${fieldKey} on ${list.listKey}`);
    }
  }
}
function assertNoConflictingExtraOutputFields(list) {
  const fieldKeys = new Set(Object.keys(list.fields));
  const alreadyFoundFields = {};
  for (const [fieldKey, field] of Object.entries(list.fields)) {
    if (field.extraOutputFields) {
      for (const outputTypeFieldName of Object.keys(field.extraOutputFields)) {
        // note that this and the case handled below are fundamentally the same thing but i want different errors for each of them
        if (fieldKeys.has(outputTypeFieldName)) {
          throw new Error(`The field ${fieldKey} on the ${list.listKey} list defines an extra GraphQL output field named ${outputTypeFieldName} which conflicts with the Keystone field type named ${outputTypeFieldName} on the same list`);
        }
        const alreadyFoundField = alreadyFoundFields[outputTypeFieldName];
        if (alreadyFoundField !== undefined) {
          throw new Error(`The field ${fieldKey} on the ${list.listKey} list defines an extra GraphQL output field named ${outputTypeFieldName} which conflicts with the Keystone field type named ${alreadyFoundField} which also defines an extra GraphQL output field named ${outputTypeFieldName}`);
        }
        alreadyFoundFields[outputTypeFieldName] = fieldKey;
      }
    }
  }
}
function assertIdFieldGraphQLTypesCorrect(list) {
  var _idField$input;
  const idField = list.fields.id;
  if (((_idField$input = idField.input) === null || _idField$input === void 0 ? void 0 : _idField$input.uniqueWhere) === undefined) {
    throw new Error(`The idField on a list must define a uniqueWhere GraphQL input with the ID GraphQL scalar type but the idField for ${list.listKey} does not define one`);
  }
  if (idField.input.uniqueWhere.arg.type !== ID) {
    throw new Error(`The idField on a list must define a uniqueWhere GraphQL input with the ID GraphQL scalar type but the idField for ${list.listKey} defines the type ${idField.input.uniqueWhere.arg.type.graphQLType.toString()}`);
  }
  // we may want to loosen these constraints in the future
  if (idField.input.create !== undefined) {
    throw new Error(`The idField on a list must not define a create GraphQL input but the idField for ${list.listKey} does define one`);
  }
  if (idField.input.update !== undefined) {
    throw new Error(`The idField on a list must not define an update GraphQL input but the idField for ${list.listKey} does define one`);
  }
  if (idField.graphql.isEnabled.read === false) {
    throw new Error(`The idField on a list must not have graphql.isEnabled.read be set to false but ${list.listKey} does`);
  }
  if (idField.output.type.kind !== 'non-null' || idField.output.type.of !== ID) {
    throw new Error(`The idField on a list must define a GraphQL output field with a non-nullable ID GraphQL scalar type but the idField for ${list.listKey} defines the type ${idField.output.type.graphQLType.toString()}`);
  }
}

function throwIfNotAFilter(x, listKey, fieldKey) {
  if (['boolean', 'undefined', 'function'].includes(typeof x)) return;
  throw new Error(`Configuration option '${listKey}.${fieldKey}' must be either a boolean value or a function. Received '${x}'.`);
}
function getIsEnabled(listKey, listConfig) {
  var _listConfig$graphql$o, _listConfig$graphql;
  const omit = (_listConfig$graphql$o = (_listConfig$graphql = listConfig.graphql) === null || _listConfig$graphql === void 0 ? void 0 : _listConfig$graphql.omit) !== null && _listConfig$graphql$o !== void 0 ? _listConfig$graphql$o : false;
  const {
    defaultIsFilterable = true,
    defaultIsOrderable = true
  } = listConfig;

  // TODO: check types in initConfig
  throwIfNotAFilter(defaultIsFilterable, listKey, 'defaultIsFilterable');
  throwIfNotAFilter(defaultIsOrderable, listKey, 'defaultIsOrderable');
  if (typeof omit === 'boolean') {
    const notOmit = !omit;
    return {
      type: notOmit,
      query: notOmit,
      create: notOmit,
      update: notOmit,
      delete: notOmit,
      filter: notOmit ? defaultIsFilterable : false,
      orderBy: notOmit ? defaultIsOrderable : false
    };
  }
  return {
    type: true,
    query: !omit.query,
    create: !omit.create,
    update: !omit.update,
    delete: !omit.delete,
    filter: defaultIsFilterable,
    orderBy: defaultIsOrderable
  };
}
function getIsEnabledField(f, listKey, list, lists) {
  var _f$graphql$omit, _f$graphql;
  const omit = (_f$graphql$omit = (_f$graphql = f.graphql) === null || _f$graphql === void 0 ? void 0 : _f$graphql.omit) !== null && _f$graphql$omit !== void 0 ? _f$graphql$omit : false;
  const {
    isFilterable = list.graphql.isEnabled.filter,
    isOrderable = list.graphql.isEnabled.orderBy
  } = f;

  // TODO: check types in initConfig
  throwIfNotAFilter(isFilterable, listKey, 'isFilterable');
  throwIfNotAFilter(isOrderable, listKey, 'isOrderable');
  if (f.dbField.kind === 'relation') {
    if (!lists[f.dbField.list].graphql.isEnabled.type) {
      return {
        type: false,
        read: false,
        create: false,
        update: false,
        filter: false,
        orderBy: false
      };
    }
  }
  if (typeof omit === 'boolean') {
    const notOmit = !omit;
    return {
      type: notOmit,
      read: notOmit,
      create: notOmit,
      update: notOmit,
      filter: notOmit ? isFilterable : false,
      orderBy: notOmit ? isOrderable : false
    };
  }
  return {
    type: true,
    read: !omit.read,
    create: !omit.create,
    update: !omit.update,
    filter: !omit.read ? isFilterable : false,
    // prevent filtering if read is false
    orderBy: !omit.read ? isOrderable : false // prevent ordering if read is false
  };
}
function defaultOperationHook() {}
function defaultListHooksResolveInput({
  resolvedData
}) {
  return resolvedData;
}
function parseListHooksResolveInput(f) {
  if (typeof f === 'function') {
    return {
      create: f,
      update: f
    };
  }
  const {
    create = defaultListHooksResolveInput,
    update = defaultListHooksResolveInput
  } = f !== null && f !== void 0 ? f : {};
  return {
    create,
    update
  };
}
function parseListHooksValidate(f) {
  if (typeof f === 'function') {
    return {
      create: f,
      update: f,
      delete: f
    };
  }
  const {
    create = defaultOperationHook,
    update = defaultOperationHook,
    delete: delete_ = defaultOperationHook
  } = f !== null && f !== void 0 ? f : {};
  return {
    create,
    update,
    delete: delete_
  };
}
function parseListHooksBeforeOperation(f) {
  if (typeof f === 'function') {
    return {
      create: f,
      update: f,
      delete: f
    };
  }
  const {
    create = defaultOperationHook,
    update = defaultOperationHook,
    delete: _delete = defaultOperationHook
  } = f !== null && f !== void 0 ? f : {};
  return {
    create,
    update,
    delete: _delete
  };
}
function parseListHooksAfterOperation(f) {
  if (typeof f === 'function') {
    return {
      create: f,
      update: f,
      delete: f
    };
  }
  const {
    create = defaultOperationHook,
    update = defaultOperationHook,
    delete: _delete = defaultOperationHook
  } = f !== null && f !== void 0 ? f : {};
  return {
    create,
    update,
    delete: _delete
  };
}
function parseListHooks(hooks) {
  return {
    resolveInput: parseListHooksResolveInput(hooks.resolveInput),
    validate: parseListHooksValidate(hooks.validate),
    beforeOperation: parseListHooksBeforeOperation(hooks.beforeOperation),
    afterOperation: parseListHooksAfterOperation(hooks.afterOperation)
  };
}
function defaultFieldHooksResolveInput({
  resolvedData,
  fieldKey
}) {
  return resolvedData[fieldKey];
}
function parseFieldHooks(fieldKey, hooks) {
  var _hooks$resolveInput, _hooks$resolveInput2, _ref, _hooks$validate$creat, _hooks$validate, _ref2, _hooks$validate$updat, _hooks$validate2, _ref3, _hooks$validate$delet, _hooks$validate3, _hooks$beforeOperatio, _hooks$beforeOperatio2, _hooks$beforeOperatio3, _hooks$afterOperation, _hooks$afterOperation2, _hooks$afterOperation3;
  /** @deprecated, TODO: remove in breaking change */
  if (hooks.validate !== undefined) {
    if (hooks.validateInput !== undefined) throw new TypeError(`"hooks.validate" conflicts with "hooks.validateInput" for the "${fieldKey}" field`);
    if (hooks.validateDelete !== undefined) throw new TypeError(`"hooks.validate" conflicts with "hooks.validateDelete" for the "${fieldKey}" field`);
    if (typeof hooks.validate === 'function') {
      return parseFieldHooks(fieldKey, {
        ...hooks,
        validate: {
          create: hooks.validate,
          update: hooks.validate,
          delete: hooks.validate
        }
      });
    }
  }
  return {
    resolveInput: {
      create: (_hooks$resolveInput = hooks.resolveInput) !== null && _hooks$resolveInput !== void 0 ? _hooks$resolveInput : defaultFieldHooksResolveInput,
      update: (_hooks$resolveInput2 = hooks.resolveInput) !== null && _hooks$resolveInput2 !== void 0 ? _hooks$resolveInput2 : defaultFieldHooksResolveInput
    },
    validate: {
      create: (_ref = (_hooks$validate$creat = (_hooks$validate = hooks.validate) === null || _hooks$validate === void 0 ? void 0 : _hooks$validate.create) !== null && _hooks$validate$creat !== void 0 ? _hooks$validate$creat : hooks.validateInput) !== null && _ref !== void 0 ? _ref : defaultOperationHook,
      update: (_ref2 = (_hooks$validate$updat = (_hooks$validate2 = hooks.validate) === null || _hooks$validate2 === void 0 ? void 0 : _hooks$validate2.update) !== null && _hooks$validate$updat !== void 0 ? _hooks$validate$updat : hooks.validateInput) !== null && _ref2 !== void 0 ? _ref2 : defaultOperationHook,
      delete: (_ref3 = (_hooks$validate$delet = (_hooks$validate3 = hooks.validate) === null || _hooks$validate3 === void 0 ? void 0 : _hooks$validate3.delete) !== null && _hooks$validate$delet !== void 0 ? _hooks$validate$delet : hooks.validateDelete) !== null && _ref3 !== void 0 ? _ref3 : defaultOperationHook
    },
    beforeOperation: {
      create: (_hooks$beforeOperatio = hooks.beforeOperation) !== null && _hooks$beforeOperatio !== void 0 ? _hooks$beforeOperatio : defaultOperationHook,
      update: (_hooks$beforeOperatio2 = hooks.beforeOperation) !== null && _hooks$beforeOperatio2 !== void 0 ? _hooks$beforeOperatio2 : defaultOperationHook,
      delete: (_hooks$beforeOperatio3 = hooks.beforeOperation) !== null && _hooks$beforeOperatio3 !== void 0 ? _hooks$beforeOperatio3 : defaultOperationHook
    },
    afterOperation: {
      create: (_hooks$afterOperation = hooks.afterOperation) !== null && _hooks$afterOperation !== void 0 ? _hooks$afterOperation : defaultOperationHook,
      update: (_hooks$afterOperation2 = hooks.afterOperation) !== null && _hooks$afterOperation2 !== void 0 ? _hooks$afterOperation2 : defaultOperationHook,
      delete: (_hooks$afterOperation3 = hooks.afterOperation) !== null && _hooks$afterOperation3 !== void 0 ? _hooks$afterOperation3 : defaultOperationHook
    }
  };
}
function getListsWithInitialisedFields(config, listsRef) {
  const {
    storage: configStorage,
    lists: listsConfig,
    db: {
      provider
    }
  } = config;
  const intermediateLists = Object.fromEntries(Object.values(config.lists).map(listConfig => [listConfig.listKey, {
    graphql: {
      isEnabled: getIsEnabled(listConfig.listKey, listConfig)
    }
  }]));
  const listGraphqlTypes = {};
  for (const listConfig of Object.values(listsConfig)) {
    var _listConfig$graphql2;
    const {
      listKey
    } = listConfig;
    const {
      graphql: {
        names
      }
    } = __getNames(listKey, listConfig);
    const output = object()({
      name: names.outputTypeName,
      fields: () => {
        const {
          fields
        } = listsRef[listKey];
        return {
          ...Object.fromEntries(Object.entries(fields).flatMap(([fieldPath, field]) => {
            if (!field.output || !field.graphql.isEnabled.read || field.dbField.kind === 'relation' && !intermediateLists[field.dbField.list].graphql.isEnabled.query) {
              return [];
            }
            const outputFieldRoot = graphqlForOutputField(field);
            return [[fieldPath, outputFieldRoot], ...Object.entries(field.extraOutputFields || {})].map(([outputTypeFieldName, outputField]) => {
              var _field$graphql;
              return [outputTypeFieldName, outputTypeField(outputField, field.dbField, (_field$graphql = field.graphql) === null || _field$graphql === void 0 ? void 0 : _field$graphql.cacheHint, field.access.read, listKey, fieldPath, listsRef)];
            });
          }))
        };
      }
    });
    const uniqueWhere = inputObject({
      name: names.whereUniqueInputName,
      fields: () => {
        const {
          fields
        } = listsRef[listKey];
        return {
          ...Object.fromEntries(Object.entries(fields).flatMap(([key, field]) => {
            var _field$input;
            if (!((_field$input = field.input) !== null && _field$input !== void 0 && (_field$input = _field$input.uniqueWhere) !== null && _field$input !== void 0 && _field$input.arg) || !field.graphql.isEnabled.read || !field.graphql.isEnabled.filter) {
              return [];
            }
            return [[key, field.input.uniqueWhere.arg]];
          })),
          // this is exactly what the id field will add
          // but this does it more explicitly so that typescript understands
          id: arg({
            type: ID
          })
        };
      }
    });
    const where = inputObject({
      name: names.whereInputName,
      fields: () => {
        const {
          fields
        } = listsRef[listKey];
        return Object.assign({
          AND: arg({
            type: list(nonNull$1(where))
          }),
          OR: arg({
            type: list(nonNull$1(where))
          }),
          NOT: arg({
            type: list(nonNull$1(where))
          })
        }, ...Object.entries(fields).map(([fieldKey, field]) => {
          var _field$input2, _field$input3;
          return ((_field$input2 = field.input) === null || _field$input2 === void 0 || (_field$input2 = _field$input2.where) === null || _field$input2 === void 0 ? void 0 : _field$input2.arg) && field.graphql.isEnabled.read && field.graphql.isEnabled.filter && {
            [fieldKey]: (_field$input3 = field.input) === null || _field$input3 === void 0 || (_field$input3 = _field$input3.where) === null || _field$input3 === void 0 ? void 0 : _field$input3.arg
          };
        }));
      }
    });
    const create = inputObject({
      name: names.createInputName,
      fields: () => {
        const {
          fields
        } = listsRef[listKey];
        const ret = {};
        for (const key in fields) {
          const arg = graphqlArgForInputField(fields[key], 'create', listsRef);
          if (!arg) continue;
          ret[key] = arg;
        }
        return ret;
      }
    });
    const update = inputObject({
      name: names.updateInputName,
      fields: () => {
        const {
          fields
        } = listsRef[listKey];
        const ret = {};
        for (const key in fields) {
          const arg = graphqlArgForInputField(fields[key], 'update', listsRef);
          if (!arg) continue;
          ret[key] = arg;
        }
        return ret;
      }
    });
    const orderBy = inputObject({
      name: names.listOrderName,
      fields: () => {
        const {
          fields
        } = listsRef[listKey];
        return Object.fromEntries(Object.entries(fields).flatMap(([key, field]) => {
          var _field$input4;
          if (!((_field$input4 = field.input) !== null && _field$input4 !== void 0 && (_field$input4 = _field$input4.orderBy) !== null && _field$input4 !== void 0 && _field$input4.arg) || !field.graphql.isEnabled.read || !field.graphql.isEnabled.orderBy) {
            return [];
          }
          return [[key, field.input.orderBy.arg]];
        }));
      }
    });
    let take = arg({
      type: Int
    });
    if (((_listConfig$graphql2 = listConfig.graphql) === null || _listConfig$graphql2 === void 0 ? void 0 : _listConfig$graphql2.maxTake) !== undefined) {
      take = arg({
        type: nonNull$1(Int),
        // WARNING: used by queries/resolvers.ts to enforce the limit
        defaultValue: listConfig.graphql.maxTake
      });
    }
    const findManyArgs = {
      where: arg({
        type: nonNull$1(where),
        defaultValue: listConfig.isSingleton ? {
          id: {
            equals: '1'
          }
        } : {}
      }),
      orderBy: arg({
        type: nonNull$1(list(nonNull$1(orderBy))),
        defaultValue: []
      }),
      take,
      skip: arg({
        type: nonNull$1(Int),
        defaultValue: 0
      }),
      cursor: arg({
        type: uniqueWhere
      })
    };
    const relateToOneForCreate = inputObject({
      name: names.relateToOneForCreateInputName,
      fields: () => {
        const listRef = listsRef[listKey];
        return {
          ...(listRef.graphql.isEnabled.create && {
            create: arg({
              type: listRef.graphql.types.create
            })
          }),
          connect: arg({
            type: listRef.graphql.types.uniqueWhere
          })
        };
      }
    });
    const relateToOneForUpdate = inputObject({
      name: names.relateToOneForUpdateInputName,
      fields: () => {
        const listRef = listsRef[listKey];
        return {
          ...(listRef.graphql.isEnabled.create && {
            create: arg({
              type: listRef.graphql.types.create
            })
          }),
          connect: arg({
            type: listRef.graphql.types.uniqueWhere
          }),
          disconnect: arg({
            type: Boolean
          })
        };
      }
    });
    const relateToManyForCreate = inputObject({
      name: names.relateToManyForCreateInputName,
      fields: () => {
        const listRef = listsRef[listKey];
        return {
          ...(listRef.graphql.isEnabled.create && {
            create: arg({
              type: list(nonNull$1(listRef.graphql.types.create))
            })
          }),
          connect: arg({
            type: list(nonNull$1(listRef.graphql.types.uniqueWhere))
          })
        };
      }
    });
    const relateToManyForUpdate = inputObject({
      name: names.relateToManyForUpdateInputName,
      fields: () => {
        const listRef = listsRef[listKey];
        return {
          // WARNING: the order of these fields reflects the order of mutations
          disconnect: arg({
            type: list(nonNull$1(listRef.graphql.types.uniqueWhere))
          }),
          set: arg({
            type: list(nonNull$1(listRef.graphql.types.uniqueWhere))
          }),
          ...(listRef.graphql.isEnabled.create && {
            create: arg({
              type: list(nonNull$1(listRef.graphql.types.create))
            })
          }),
          connect: arg({
            type: list(nonNull$1(listRef.graphql.types.uniqueWhere))
          })
        };
      }
    });
    listGraphqlTypes[listKey] = {
      types: {
        output,
        uniqueWhere,
        where,
        create,
        orderBy,
        update,
        findManyArgs,
        relateTo: {
          one: {
            create: relateToOneForCreate,
            update: relateToOneForUpdate
          },
          many: {
            where: inputObject({
              name: `${listKey}ManyRelationFilter`,
              fields: {
                every: arg({
                  type: where
                }),
                some: arg({
                  type: where
                }),
                none: arg({
                  type: where
                })
              }
            }),
            create: relateToManyForCreate,
            update: relateToManyForUpdate
          }
        }
      }
    };
  }
  const result = {};
  for (const listConfig of Object.values(listsConfig)) {
    var _listConfig$ui$labelF, _listConfig$ui4, _listConfig$ui$search, _listConfig$ui5, _listConfig$db, _listConfig$db2, _listConfig$hooks, _listConfig$isSinglet;
    const {
      listKey
    } = listConfig;
    const intermediateList = intermediateLists[listKey];
    const resultFields = {};
    const groups = [];
    const fieldKeys = Object.keys(listConfig.fields);
    for (const [idx, [fieldKey, fieldFunc]] of Object.entries(listConfig.fields).entries()) {
      var _ref4, _f$ui$createView$fiel, _f$ui, _listConfig$ui, _ref5, _f$ui$itemView$fieldM, _f$ui2, _listConfig$ui2, _ref6, _f$ui$listView$fieldM, _f$ui3, _listConfig$ui3, _f$hooks, _f$graphql2, _f$graphql$isNonNull$, _f$graphql3, _f$graphql$isNonNull$2, _f$graphql4, _f$graphql$isNonNull$3, _f$graphql5, _f$label, _f$ui$description, _f$ui4, _f$ui$views, _f$ui5, _f$ui$itemView$fieldP, _f$ui6;
      if (fieldKey.startsWith('__group')) {
        const group = fieldFunc;
        if (typeof group === 'object' && group !== null && typeof group.label === 'string' && (group.description === null || typeof group.description === 'string') && Array.isArray(group.fields) && areArraysEqual(group.fields, fieldKeys.slice(idx + 1, idx + 1 + group.fields.length))) {
          groups.push(group);
          continue;
        }
        throw new Error(`unexpected value for a group at ${listKey}.${fieldKey}`);
      }
      if (typeof fieldFunc !== 'function') {
        throw new Error(`The field at ${listKey}.${fieldKey} does not provide a function`);
      }
      const f = fieldFunc({
        fieldKey,
        listKey,
        lists: listGraphqlTypes,
        provider,
        getStorage: storage => configStorage === null || configStorage === void 0 ? void 0 : configStorage[storage]
      });
      const isEnabledField = getIsEnabledField(f, listKey, intermediateList, intermediateLists);
      const fieldModes = {
        create: (_ref4 = (_f$ui$createView$fiel = (_f$ui = f.ui) === null || _f$ui === void 0 || (_f$ui = _f$ui.createView) === null || _f$ui === void 0 ? void 0 : _f$ui.fieldMode) !== null && _f$ui$createView$fiel !== void 0 ? _f$ui$createView$fiel : (_listConfig$ui = listConfig.ui) === null || _listConfig$ui === void 0 || (_listConfig$ui = _listConfig$ui.createView) === null || _listConfig$ui === void 0 ? void 0 : _listConfig$ui.defaultFieldMode) !== null && _ref4 !== void 0 ? _ref4 : 'edit',
        item: (_ref5 = (_f$ui$itemView$fieldM = (_f$ui2 = f.ui) === null || _f$ui2 === void 0 || (_f$ui2 = _f$ui2.itemView) === null || _f$ui2 === void 0 ? void 0 : _f$ui2.fieldMode) !== null && _f$ui$itemView$fieldM !== void 0 ? _f$ui$itemView$fieldM : (_listConfig$ui2 = listConfig.ui) === null || _listConfig$ui2 === void 0 || (_listConfig$ui2 = _listConfig$ui2.itemView) === null || _listConfig$ui2 === void 0 ? void 0 : _listConfig$ui2.defaultFieldMode) !== null && _ref5 !== void 0 ? _ref5 : 'edit',
        list: (_ref6 = (_f$ui$listView$fieldM = (_f$ui3 = f.ui) === null || _f$ui3 === void 0 || (_f$ui3 = _f$ui3.listView) === null || _f$ui3 === void 0 ? void 0 : _f$ui3.fieldMode) !== null && _f$ui$listView$fieldM !== void 0 ? _f$ui$listView$fieldM : (_listConfig$ui3 = listConfig.ui) === null || _listConfig$ui3 === void 0 || (_listConfig$ui3 = _listConfig$ui3.listView) === null || _listConfig$ui3 === void 0 ? void 0 : _listConfig$ui3.defaultFieldMode) !== null && _ref6 !== void 0 ? _ref6 : 'read'
      };
      resultFields[fieldKey] = {
        fieldKey,
        dbField: f.dbField,
        access: parseFieldAccessControl(f.access),
        hooks: parseFieldHooks(fieldKey, (_f$hooks = f.hooks) !== null && _f$hooks !== void 0 ? _f$hooks : {}),
        graphql: {
          cacheHint: (_f$graphql2 = f.graphql) === null || _f$graphql2 === void 0 ? void 0 : _f$graphql2.cacheHint,
          isEnabled: isEnabledField,
          isNonNull: {
            read: (_f$graphql$isNonNull$ = (_f$graphql3 = f.graphql) === null || _f$graphql3 === void 0 || (_f$graphql3 = _f$graphql3.isNonNull) === null || _f$graphql3 === void 0 ? void 0 : _f$graphql3.read) !== null && _f$graphql$isNonNull$ !== void 0 ? _f$graphql$isNonNull$ : false,
            create: (_f$graphql$isNonNull$2 = (_f$graphql4 = f.graphql) === null || _f$graphql4 === void 0 || (_f$graphql4 = _f$graphql4.isNonNull) === null || _f$graphql4 === void 0 ? void 0 : _f$graphql4.create) !== null && _f$graphql$isNonNull$2 !== void 0 ? _f$graphql$isNonNull$2 : false,
            update: (_f$graphql$isNonNull$3 = (_f$graphql5 = f.graphql) === null || _f$graphql5 === void 0 || (_f$graphql5 = _f$graphql5.isNonNull) === null || _f$graphql5 === void 0 ? void 0 : _f$graphql5.update) !== null && _f$graphql$isNonNull$3 !== void 0 ? _f$graphql$isNonNull$3 : false
          }
        },
        ui: {
          label: (_f$label = f.label) !== null && _f$label !== void 0 ? _f$label : null,
          description: (_f$ui$description = (_f$ui4 = f.ui) === null || _f$ui4 === void 0 ? void 0 : _f$ui4.description) !== null && _f$ui$description !== void 0 ? _f$ui$description : null,
          views: (_f$ui$views = (_f$ui5 = f.ui) === null || _f$ui5 === void 0 ? void 0 : _f$ui5.views) !== null && _f$ui$views !== void 0 ? _f$ui$views : null,
          createView: {
            fieldMode: isEnabledField.create ? fieldModes.create : 'hidden'
          },
          itemView: {
            fieldPosition: (_f$ui$itemView$fieldP = (_f$ui6 = f.ui) === null || _f$ui6 === void 0 || (_f$ui6 = _f$ui6.itemView) === null || _f$ui6 === void 0 ? void 0 : _f$ui6.fieldPosition) !== null && _f$ui$itemView$fieldP !== void 0 ? _f$ui$itemView$fieldP : 'form',
            fieldMode: isEnabledField.update ? fieldModes.item : isEnabledField.read && fieldModes.item !== 'hidden' ? 'read' : 'hidden'
          },
          listView: {
            fieldMode: isEnabledField.read ? fieldModes.list : 'hidden'
          }
        },
        // copy
        __ksTelemetryFieldTypeName: f.__ksTelemetryFieldTypeName,
        extraOutputFields: f.extraOutputFields,
        getAdminMeta: f.getAdminMeta,
        input: {
          ...f.input
        },
        output: {
          ...f.output
        },
        unreferencedConcreteInterfaceImplementations: f.unreferencedConcreteInterfaceImplementations,
        views: f.views
      };
    }

    // Default the labelField to `name`, `label`, or `title` if they exist; otherwise fall back to `id`
    const labelField = (_listConfig$ui$labelF = (_listConfig$ui4 = listConfig.ui) === null || _listConfig$ui4 === void 0 ? void 0 : _listConfig$ui4.labelField) !== null && _listConfig$ui$labelF !== void 0 ? _listConfig$ui$labelF : listConfig.fields.label ? 'label' : listConfig.fields.name ? 'name' : listConfig.fields.title ? 'title' : 'id';
    const searchFields = new Set((_listConfig$ui$search = (_listConfig$ui5 = listConfig.ui) === null || _listConfig$ui5 === void 0 ? void 0 : _listConfig$ui5.searchFields) !== null && _listConfig$ui$search !== void 0 ? _listConfig$ui$search : []);
    if (searchFields.has('id')) {
      throw new Error(`${listKey}.ui.searchFields cannot include 'id'`);
    }
    const names = __getNames(listKey, listConfig);
    result[listKey] = {
      access: parseListAccessControl(listConfig.access),
      fields: resultFields,
      groups,
      graphql: {
        types: {
          ...listGraphqlTypes[listKey].types
        },
        names: {
          ...names.graphql.names
        },
        namePlural: names.graphql.namePlural,
        // TODO: remove
        ...intermediateList.graphql
      },
      prisma: {
        types: {
          ...names.graphql.names
        },
        listKey: listKey[0].toLowerCase() + listKey.slice(1),
        mapping: (_listConfig$db = listConfig.db) === null || _listConfig$db === void 0 ? void 0 : _listConfig$db.map,
        extendPrismaSchema: (_listConfig$db2 = listConfig.db) === null || _listConfig$db2 === void 0 ? void 0 : _listConfig$db2.extendPrismaSchema
      },
      ui: {
        labels: names.ui.labels,
        labelField,
        searchFields,
        searchableFields: new Map()
      },
      hooks: parseListHooks((_listConfig$hooks = listConfig.hooks) !== null && _listConfig$hooks !== void 0 ? _listConfig$hooks : {}),
      listKey,
      cacheHint: (_listConfig$graphql3 => {
        const cacheHint = (_listConfig$graphql3 = listConfig.graphql) === null || _listConfig$graphql3 === void 0 ? void 0 : _listConfig$graphql3.cacheHint;
        if (typeof cacheHint === 'function') return cacheHint;
        if (cacheHint !== undefined) return () => cacheHint;
        return undefined;
      })(),
      isSingleton: (_listConfig$isSinglet = listConfig.isSingleton) !== null && _listConfig$isSinglet !== void 0 ? _listConfig$isSinglet : false
    };
  }
  return result;
}
function introspectGraphQLTypes(lists) {
  for (const list of Object.values(lists)) {
    const {
      listKey,
      ui: {
        searchFields,
        searchableFields
      }
    } = list;
    if (searchFields.has('id')) {
      throw new Error(`The ui.searchFields option on the ${listKey} list includes 'id'. Lists can always be searched by an item's id so it must not be specified as a search field`);
    }
    const whereInputFields = list.graphql.types.where.graphQLType.getFields();
    for (const fieldKey of Object.keys(list.fields)) {
      var _whereInputFields$fie, _fieldFilterFields$co;
      const filterType = (_whereInputFields$fie = whereInputFields[fieldKey]) === null || _whereInputFields$fie === void 0 ? void 0 : _whereInputFields$fie.type;
      const fieldFilterFields = isInputObjectType(filterType) ? filterType.getFields() : undefined;
      if ((fieldFilterFields === null || fieldFilterFields === void 0 || (_fieldFilterFields$co = fieldFilterFields.contains) === null || _fieldFilterFields$co === void 0 ? void 0 : _fieldFilterFields$co.type) === GraphQLString) {
        var _fieldFilterFields$mo;
        searchableFields.set(fieldKey, (fieldFilterFields === null || fieldFilterFields === void 0 || (_fieldFilterFields$mo = fieldFilterFields.mode) === null || _fieldFilterFields$mo === void 0 ? void 0 : _fieldFilterFields$mo.type) === QueryMode.graphQLType ? 'insensitive' : 'default');
      }
    }
    if (searchFields.size === 0) {
      if (searchableFields.has(list.ui.labelField)) {
        searchFields.add(list.ui.labelField);
      }
    }
  }
}
function stripDefaultValue(thing) {
  return arg({
    ...thing,
    defaultValue: undefined
  });
}
function graphqlArgForInputField(field, operation, listsRef) {
  var _field$input5;
  const input = (_field$input5 = field.input) === null || _field$input5 === void 0 ? void 0 : _field$input5[operation];
  if (!(input !== null && input !== void 0 && input.arg) || !field.graphql.isEnabled[operation]) return;
  if (field.dbField.kind === 'relation') {
    if (!listsRef[field.dbField.list].graphql.isEnabled.type) return;
  }
  if (!field.graphql.isNonNull[operation]) return stripDefaultValue(input.arg);
  if (input.arg.type.kind === 'non-null') return input.arg;
  return arg({
    ...input.arg,
    type: nonNull$1(input.arg.type)
  });
}
function graphqlForOutputField(field$1) {
  const output = field$1.output;
  if (!output || !field$1.graphql.isEnabled.read) return output;
  if (!field$1.graphql.isNonNull.read) return output;
  if (output.type.kind === 'non-null') return output;
  return field({
    ...output,
    type: nonNull$1(output.type)
  });
}
function initialiseLists(config) {
  const listsRef = {};
  let intermediateLists;

  // step 1
  intermediateLists = getListsWithInitialisedFields(config, listsRef);

  // step 2
  const resolvedDBFieldsForLists = resolveRelationships(intermediateLists);
  intermediateLists = Object.fromEntries(Object.values(intermediateLists).map(list => [list.listKey, {
    ...list,
    resolvedDbFields: resolvedDBFieldsForLists[list.listKey]
  }]));

  // step 3
  intermediateLists = Object.fromEntries(Object.values(intermediateLists).map(list => {
    const fields = {};
    for (const [fieldKey, field] of Object.entries(list.fields)) {
      fields[fieldKey] = {
        ...field,
        dbField: list.resolvedDbFields[fieldKey]
      };
    }
    return [list.listKey, {
      ...list,
      fields
    }];
  }));
  for (const list of Object.values(intermediateLists)) {
    let hasAnEnabledCreateField = false;
    let hasAnEnabledUpdateField = false;
    for (const field of Object.values(list.fields)) {
      var _field$input6, _field$input7;
      if ((_field$input6 = field.input) !== null && _field$input6 !== void 0 && (_field$input6 = _field$input6.create) !== null && _field$input6 !== void 0 && _field$input6.arg && field.graphql.isEnabled.create) {
        hasAnEnabledCreateField = true;
      }
      if ((_field$input7 = field.input) !== null && _field$input7 !== void 0 && _field$input7.update && field.graphql.isEnabled.update) {
        hasAnEnabledUpdateField = true;
      }
    }
    if (!hasAnEnabledCreateField) {
      list.graphql.types.create = Empty;
      list.graphql.names.createInputName = 'Empty';
    }
    if (!hasAnEnabledUpdateField) {
      list.graphql.types.update = Empty;
      list.graphql.names.updateInputName = 'Empty';
    }
  }

  // error checking
  for (const list of Object.values(intermediateLists)) {
    assertFieldsValid(list);
  }

  // fixup the GraphQL refs
  for (const list of Object.values(intermediateLists)) {
    listsRef[list.listKey] = {
      ...list,
      lists: listsRef
    };
  }

  // do some introspection
  introspectGraphQLTypes(listsRef);
  return listsRef;
}

// TODO: this cannot be changed for now, circular dependency with getSystemPaths, getEsbuildConfig
function getBuiltKeystoneConfigurationPath(cwd) {
  return path.join(cwd, '.keystone/config.js');
}
function posixify(s) {
  return s.split(path.sep).join('/');
}
function getSystemPaths(cwd, config) {
  var _config$types, _config$db, _config$graphql;
  const prismaClientPath = config.db.prismaClientPath === '@prisma/client' ? null : config.db.prismaClientPath ? path.join(cwd, config.db.prismaClientPath) : null;
  const builtTypesPath = (_config$types = config.types) !== null && _config$types !== void 0 && _config$types.path ? path.join(cwd, config.types.path) // TODO: enforce initConfig before getSystemPaths
  : path.join(cwd, 'node_modules/.keystone/types.ts');
  const builtPrismaPath = (_config$db = config.db) !== null && _config$db !== void 0 && _config$db.prismaSchemaPath ? path.join(cwd, config.db.prismaSchemaPath) // TODO: enforce initConfig before getSystemPaths
  : path.join(cwd, 'schema.prisma');
  const relativePrismaPath = prismaClientPath ? `./${posixify(path.relative(path.dirname(builtTypesPath), prismaClientPath))}` : '@prisma/client';
  const builtGraphqlPath = (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && _config$graphql.schemaPath ? path.join(cwd, config.graphql.schemaPath) // TODO: enforce initConfig before getSystemPaths
  : path.join(cwd, 'schema.graphql');
  return {
    config: getBuiltKeystoneConfigurationPath(cwd),
    admin: path.join(cwd, '.keystone/admin'),
    prisma: prismaClientPath !== null && prismaClientPath !== void 0 ? prismaClientPath : '@prisma/client',
    types: {
      relativePrismaPath
    },
    schema: {
      types: builtTypesPath,
      prisma: builtPrismaPath,
      graphql: builtGraphqlPath
    }
  };
}
function getSudoGraphQLSchema(config) {
  // This function creates a GraphQLSchema based on a modified version of the provided config.
  // The modifications are:
  //  * All list level access control is disabled
  //  * All field level access control is disabled
  //  * All graphql.omit configuration is disabled
  //  * All fields are explicitly made filterable and orderable
  //
  // These changes result in a schema without any restrictions on the CRUD
  // operations that can be run.
  //
  // The resulting schema is used as the GraphQL schema when calling `context.sudo()`.
  const transformedConfig = {
    ...config,
    ui: {
      ...config.ui,
      isAccessAllowed: allowAll
    },
    lists: Object.fromEntries(Object.entries(config.lists).map(([listKey, list]) => {
      return [listKey, {
        ...list,
        access: allowAll,
        graphql: {
          ...(list.graphql || {}),
          omit: false
        },
        fields: Object.fromEntries(Object.entries(list.fields).map(([fieldKey, field]) => {
          if (fieldKey.startsWith('__group')) return [fieldKey, field];
          return [fieldKey, data => {
            const f = field(data);
            return {
              ...f,
              access: allowAll,
              isFilterable: true,
              isOrderable: true,
              graphql: {
                ...(f.graphql || {}),
                omit: false
              }
            };
          }];
        }))
      }];
    }))
  };
  const lists = initialiseLists(transformedConfig);
  const adminMeta = createAdminMeta(transformedConfig, lists);
  return createGraphQLSchema(transformedConfig, lists, adminMeta, true);
  // TODO: adminMeta not useful for sudo, remove in breaking change
  // return createGraphQLSchema(transformedConfig, lists, null, true);
}
function injectNewDefaults(prismaClient, lists) {
  for (const listKey in lists) {
    var _dbField$default;
    const list = lists[listKey];

    // TODO: other fields might use 'random' too
    const {
      dbField
    } = list.fields.id;
    if ('default' in dbField && ((_dbField$default = dbField.default) === null || _dbField$default === void 0 ? void 0 : _dbField$default.kind) === 'random') {
      const {
        bytes,
        encoding
      } = dbField.default;
      prismaClient = prismaClient.$extends({
        query: {
          [list.prisma.listKey]: {
            async create({
              model,
              args,
              query
            }) {
              var _args$data$id;
              return query({
                ...args,
                data: {
                  ...args.data,
                  id: (_args$data$id = args.data.id) !== null && _args$data$id !== void 0 ? _args$data$id : randomBytes(bytes).toString(encoding)
                }
              });
            }
          }
        }
      });
    }
  }
  prismaClient = prismaClient.$extends({
    query: {
      async $allOperations({
        model,
        operation,
        args,
        query
      }) {
        try {
          return await query(args);
        } catch (e) {
          var _e$message$split$pop;
          console.error(e);
          if (e.code === undefined) {
            return new GraphQLError(`Prisma error`, {
              extensions: {
                code: 'KS_PRISMA_ERROR',
                debug: {
                  message: e.message
                }
              }
            });
          }

          // TODO: remove e.message unless debug
          return new GraphQLError(`Prisma error: ${(_e$message$split$pop = e.message.split('\n').pop()) === null || _e$message$split$pop === void 0 ? void 0 : _e$message$split$pop.trim()}`, {
            extensions: {
              code: 'KS_PRISMA_ERROR',
              prisma: {
                ...e
              }
            }
          });
        }
      }
    }
  });
  return prismaClient;
}
function formatUrl(provider, url) {
  if (url.startsWith('file:')) {
    const parsed = new URL(url);
    if (provider === 'sqlite' && !parsed.searchParams.get('connection_limit')) {
      // https://github.com/prisma/prisma/issues/9562
      // https://github.com/prisma/prisma/issues/10403
      // https://github.com/prisma/prisma/issues/11789
      parsed.searchParams.set('connection_limit', '1');
      const [uri] = url.split('?');
      return `${uri}?${parsed.search}`;
    }
  }
  return url;
}
function createSystem(config_) {
  const config = resolveDefaults(config_);
  const lists = initialiseLists(config);
  const adminMeta = createAdminMeta(config, lists);
  const graphQLSchema = createGraphQLSchema(config, lists, adminMeta, false);
  const graphQLSchemaSudo = getSudoGraphQLSchema(config);
  return {
    config,
    graphQLSchema,
    adminMeta,
    lists,
    getPaths: cwd => {
      return getSystemPaths(cwd, config);
    },
    getKeystone: PM => {
      const prePrismaClient = new PM.PrismaClient({
        datasourceUrl: formatUrl(config.db.provider, config.db.url),
        log: config.db.enableLogging
      });
      const prismaClient = config.db.extendPrismaClient(injectNewDefaults(prePrismaClient, lists));
      const context = createContext({
        config,
        lists,
        graphQLSchema,
        graphQLSchemaSudo,
        prismaClient,
        prismaTypes: {
          DbNull: PM.Prisma.DbNull,
          JsonNull: PM.Prisma.JsonNull
        }
      });
      return {
        // TODO: replace with server.onStart, remove in breaking change
        async connect() {
          var _config$db$onConnect, _config$db2;
          await prismaClient.$connect();
          await ((_config$db$onConnect = (_config$db2 = config.db).onConnect) === null || _config$db$onConnect === void 0 ? void 0 : _config$db$onConnect.call(_config$db2, context));
        },
        // TODO: only used by tests, remove in breaking change
        async disconnect() {
          await prismaClient.$disconnect();
        },
        context
      };
    }
  };
}

export { getDBFieldKeyForFieldOnMultiField as a, areArraysEqual as b, createSystem as c, getSystemPaths as d, getBuiltKeystoneConfigurationPath as g, initialiseLists as i };

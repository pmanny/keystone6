'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createAdminMeta = require('../../dist/create-admin-meta-bc3ac1cf.cjs.prod.js');
require('pluralize');
var nextFields = require('../../dist/next-fields-d22d3935.cjs.prod.js');
var graphqlTsSchema = require('../../dist/graphql-ts-schema-80f16062.cjs.prod.js');
var apiWithoutContext = require('@graphql-ts/schema/api-without-context');
var Decimal$3 = require('decimal.js');
var apiWithContext = require('@graphql-ts/schema/api-with-context');
var fields_types_image_utils_dist_keystone6CoreFieldsTypesImageUtils = require('../types/image/utils/dist/keystone-6-core-fields-types-image-utils.cjs.prod.js');
var jsonFieldTypePolyfillForSqlite = require('../../dist/json-field-type-polyfill-for-sqlite-39a461cf.cjs.prod.js');
var bcryptjs = require('bcryptjs');
var dumbPasswords = require('dumb-passwords');
var inflection = require('inflection');
var graphql = require('graphql');
require('node:path');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('@graphql-ts/extend');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var Decimal__default = /*#__PURE__*/_interopDefault(Decimal$3);
var bcryptjs__default = /*#__PURE__*/_interopDefault(bcryptjs);
var dumbPasswords__default = /*#__PURE__*/_interopDefault(dumbPasswords);

function resolveDbNullable(validation, db) {
  if ((db === null || db === void 0 ? void 0 : db.isNullable) === false) return false;
  if ((db === null || db === void 0 ? void 0 : db.isNullable) === undefined && validation !== null && validation !== void 0 && validation.isRequired) {
    return false;
  }
  return true;
}
function makeValidateHook(meta, config, f) {
  var _config$validation, _config$db, _config$validation2;
  const dbNullable = resolveDbNullable(config.validation, config.db);
  const mode = dbNullable ? 'optional' : 'required';
  const valueRequired = ((_config$validation = config.validation) === null || _config$validation === void 0 ? void 0 : _config$validation.isRequired) || !dbNullable;
  assertReadIsNonNullAllowed(meta, config, dbNullable);
  const addValidation = ((_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.isNullable) === false || ((_config$validation2 = config.validation) === null || _config$validation2 === void 0 ? void 0 : _config$validation2.isRequired);
  if (addValidation) {
    const validate = async function (args) {
      const {
        operation,
        addValidationError,
        resolvedData
      } = args;
      if (valueRequired) {
        const value = resolvedData === null || resolvedData === void 0 ? void 0 : resolvedData[meta.fieldKey];
        if (operation === 'create' && value === undefined || (operation === 'create' || operation === 'update') && value === null) {
          addValidationError(`missing value`);
        }
      }
      await (f === null || f === void 0 ? void 0 : f(args));
    };
    return {
      mode,
      validate
    };
  }
  return {
    mode,
    validate: f
  };
}
function assertReadIsNonNullAllowed(meta, config, dbNullable) {
  var _config$graphql;
  if (!dbNullable) return;
  if (!((_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql = _config$graphql.isNonNull) !== null && _config$graphql !== void 0 && _config$graphql.read)) return;
  throw new Error(`${meta.listKey}.${meta.fieldKey} sets graphql.isNonNull.read: true, but not validation.isRequired: true (or db.isNullable: false)\n` + `Set validation.isRequired: true, or db.isNullable: false, or graphql.isNonNull.read: false`);
}

// yes, these two types have the fields but they're semantically different types
// (even though, yes, having EnumFilter by defined as EnumNullableFilter<Enum>, would be the same type but names would show up differently in editors for example)

function enumFilters(enumType) {
  const optional = apiWithoutContext.inputObject({
    name: `${enumType.graphQLType.name}NullableFilter`,
    fields: () => ({
      equals: apiWithoutContext.arg({
        type: enumType
      }),
      in: apiWithoutContext.arg({
        type: apiWithoutContext.list(apiWithoutContext.nonNull(enumType))
      }),
      notIn: apiWithoutContext.arg({
        type: apiWithoutContext.list(apiWithoutContext.nonNull(enumType))
      }),
      not: apiWithoutContext.arg({
        type: optional
      })
    })
  });
  const required = apiWithoutContext.inputObject({
    name: `${enumType.graphQLType.name}Filter`,
    fields: () => ({
      equals: apiWithoutContext.arg({
        type: enumType
      }),
      in: apiWithoutContext.arg({
        type: apiWithoutContext.list(apiWithoutContext.nonNull(enumType))
      }),
      notIn: apiWithoutContext.arg({
        type: apiWithoutContext.list(apiWithoutContext.nonNull(enumType))
      }),
      not: apiWithoutContext.arg({
        type: optional
      })
    })
  });
  const many = apiWithoutContext.inputObject({
    name: `${enumType.graphQLType.name}NullableListFilter`,
    fields: () => ({
      // can be null
      equals: apiWithoutContext.arg({
        type: apiWithoutContext.list(apiWithoutContext.nonNull(enumType))
      }),
      // can be null
      has: apiWithoutContext.arg({
        type: enumType
      }),
      hasEvery: apiWithoutContext.arg({
        type: apiWithoutContext.list(apiWithoutContext.nonNull(enumType))
      }),
      hasSome: apiWithoutContext.arg({
        type: apiWithoutContext.list(apiWithoutContext.nonNull(enumType))
      }),
      isEmpty: apiWithoutContext.arg({
        type: enumType
      })
    })
  });
  return {
    optional,
    required,
    many
  };
}

// Do not manually modify this file, it is automatically generated by the package at /prisma-utils in this repo.
const StringNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    mode: apiWithoutContext.arg({
      type: nextFields.QueryMode
    }),
    not: apiWithoutContext.arg({
      type: StringNullableFilter$2
    }) // can be null
  })
});
const StringFilter$2 = apiWithoutContext.inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    mode: apiWithoutContext.arg({
      type: nextFields.QueryMode
    }),
    not: apiWithoutContext.arg({
      type: NestedStringFilter$2
    })
  })
});
const NestedStringNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringNullableFilter$2
    }) // can be null
  })
});
const NestedStringFilter$2 = apiWithoutContext.inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringFilter$2
    })
  })
});
const BooleanNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Boolean
    }),
    // can be null
    not: apiWithoutContext.arg({
      type: BooleanNullableFilter$2
    }) // can be null
  })
});
const BooleanFilter$2 = apiWithoutContext.inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Boolean
    }),
    not: apiWithoutContext.arg({
      type: BooleanFilter$2
    })
  })
});
const IntFilter$2 = apiWithoutContext.inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    not: apiWithoutContext.arg({
      type: IntFilter$2
    })
  })
});
const IntNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    not: apiWithoutContext.arg({
      type: IntNullableFilter$2
    }) // can be null
  })
});
const FloatNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    not: apiWithoutContext.arg({
      type: FloatNullableFilter$2
    }) // can be null
  })
});
const FloatFilter$2 = apiWithoutContext.inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    not: apiWithoutContext.arg({
      type: FloatFilter$2
    })
  })
});
const DateTimeNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    not: apiWithoutContext.arg({
      type: DateTimeNullableFilter$2
    }) // can be null
  })
});
const DateTimeFilter$2 = apiWithoutContext.inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    not: apiWithoutContext.arg({
      type: DateTimeFilter$2
    })
  })
});
const DecimalNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    not: apiWithoutContext.arg({
      type: DecimalNullableFilter$2
    }) // can be null
  })
});
const DecimalFilter$2 = apiWithoutContext.inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    not: apiWithoutContext.arg({
      type: DecimalFilter$2
    })
  })
});
const BigIntNullableFilter$2 = apiWithoutContext.inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    not: apiWithoutContext.arg({
      type: BigIntNullableFilter$2
    }) // can be null
  })
});
const BigIntFilter$2 = apiWithoutContext.inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    not: apiWithoutContext.arg({
      type: BigIntFilter$2
    })
  })
});
const String$2 = {
  optional: StringNullableFilter$2,
  required: StringFilter$2
};
const Boolean$2 = {
  optional: BooleanNullableFilter$2,
  required: BooleanFilter$2
};
const Int$2 = {
  optional: IntNullableFilter$2,
  required: IntFilter$2
};
const Float$2 = {
  optional: FloatNullableFilter$2,
  required: FloatFilter$2
};
const DateTime$2 = {
  optional: DateTimeNullableFilter$2,
  required: DateTimeFilter$2
};
const Decimal$2 = {
  optional: DecimalNullableFilter$2,
  required: DecimalFilter$2
};
const BigInt$2 = {
  optional: BigIntNullableFilter$2,
  required: BigIntFilter$2
};

var postgresql = /*#__PURE__*/Object.freeze({
  __proto__: null,
  String: String$2,
  Boolean: Boolean$2,
  Int: Int$2,
  Float: Float$2,
  DateTime: DateTime$2,
  Decimal: Decimal$2,
  BigInt: BigInt$2,
  'enum': enumFilters
});

// Do not manually modify this file, it is automatically generated by the package at /prisma-utils in this repo.
const StringNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: StringNullableFilter$1
    }) // can be null
  })
});
const StringFilter$1 = apiWithoutContext.inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringFilter$1
    })
  })
});
const NestedStringNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringNullableFilter$1
    }) // can be null
  })
});
const NestedStringFilter$1 = apiWithoutContext.inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringFilter$1
    })
  })
});
const BooleanNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Boolean
    }),
    // can be null
    not: apiWithoutContext.arg({
      type: BooleanNullableFilter$1
    }) // can be null
  })
});
const BooleanFilter$1 = apiWithoutContext.inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Boolean
    }),
    not: apiWithoutContext.arg({
      type: BooleanFilter$1
    })
  })
});
const IntFilter$1 = apiWithoutContext.inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    not: apiWithoutContext.arg({
      type: IntFilter$1
    })
  })
});
const IntNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    not: apiWithoutContext.arg({
      type: IntNullableFilter$1
    }) // can be null
  })
});
const FloatNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    not: apiWithoutContext.arg({
      type: FloatNullableFilter$1
    }) // can be null
  })
});
const FloatFilter$1 = apiWithoutContext.inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    not: apiWithoutContext.arg({
      type: FloatFilter$1
    })
  })
});
const DateTimeNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    not: apiWithoutContext.arg({
      type: DateTimeNullableFilter$1
    }) // can be null
  })
});
const DateTimeFilter$1 = apiWithoutContext.inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    not: apiWithoutContext.arg({
      type: DateTimeFilter$1
    })
  })
});
const DecimalNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    not: apiWithoutContext.arg({
      type: DecimalNullableFilter$1
    }) // can be null
  })
});
const DecimalFilter$1 = apiWithoutContext.inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    not: apiWithoutContext.arg({
      type: DecimalFilter$1
    })
  })
});
const BigIntNullableFilter$1 = apiWithoutContext.inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    not: apiWithoutContext.arg({
      type: BigIntNullableFilter$1
    }) // can be null
  })
});
const BigIntFilter$1 = apiWithoutContext.inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    not: apiWithoutContext.arg({
      type: BigIntFilter$1
    })
  })
});
const String$1 = {
  optional: StringNullableFilter$1,
  required: StringFilter$1
};
const Boolean$1 = {
  optional: BooleanNullableFilter$1,
  required: BooleanFilter$1
};
const Int$1 = {
  optional: IntNullableFilter$1,
  required: IntFilter$1
};
const Float$1 = {
  optional: FloatNullableFilter$1,
  required: FloatFilter$1
};
const DateTime$1 = {
  optional: DateTimeNullableFilter$1,
  required: DateTimeFilter$1
};
const Decimal$1 = {
  optional: DecimalNullableFilter$1,
  required: DecimalFilter$1
};
const BigInt$1 = {
  optional: BigIntNullableFilter$1,
  required: BigIntFilter$1
};

var sqlite = /*#__PURE__*/Object.freeze({
  __proto__: null,
  String: String$1,
  Boolean: Boolean$1,
  Int: Int$1,
  Float: Float$1,
  DateTime: DateTime$1,
  Decimal: Decimal$1,
  BigInt: BigInt$1,
  'enum': enumFilters
});

// Do not manually modify this file, it is automatically generated by the package at /prisma-utils in this repo.
const StringNullableFilter = apiWithoutContext.inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: StringNullableFilter
    }) // can be null
  })
});
const StringFilter = apiWithoutContext.inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringFilter
    })
  })
});
const NestedStringNullableFilter = apiWithoutContext.inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringNullableFilter
    }) // can be null
  })
});
const NestedStringFilter = apiWithoutContext.inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.String))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    contains: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    startsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    endsWith: apiWithoutContext.arg({
      type: apiWithoutContext.String
    }),
    not: apiWithoutContext.arg({
      type: NestedStringFilter
    })
  })
});
const BooleanNullableFilter = apiWithoutContext.inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Boolean
    }),
    // can be null
    not: apiWithoutContext.arg({
      type: BooleanNullableFilter
    }) // can be null
  })
});
const BooleanFilter = apiWithoutContext.inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Boolean
    }),
    not: apiWithoutContext.arg({
      type: BooleanFilter
    })
  })
});
const IntFilter = apiWithoutContext.inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    not: apiWithoutContext.arg({
      type: IntFilter
    })
  })
});
const IntNullableFilter = apiWithoutContext.inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Int))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Int
    }),
    not: apiWithoutContext.arg({
      type: IntNullableFilter
    }) // can be null
  })
});
const FloatNullableFilter = apiWithoutContext.inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    not: apiWithoutContext.arg({
      type: FloatNullableFilter
    }) // can be null
  })
});
const FloatFilter = apiWithoutContext.inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(apiWithoutContext.Float))
    }),
    lt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    lte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gt: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    gte: apiWithoutContext.arg({
      type: apiWithoutContext.Float
    }),
    not: apiWithoutContext.arg({
      type: FloatFilter
    })
  })
});
const DateTimeNullableFilter = apiWithoutContext.inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    not: apiWithoutContext.arg({
      type: DateTimeNullableFilter
    }) // can be null
  })
});
const DateTimeFilter = apiWithoutContext.inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.DateTime))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.DateTime
    }),
    not: apiWithoutContext.arg({
      type: DateTimeFilter
    })
  })
});
const DecimalNullableFilter = apiWithoutContext.inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    not: apiWithoutContext.arg({
      type: DecimalNullableFilter
    }) // can be null
  })
});
const DecimalFilter = apiWithoutContext.inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.Decimal))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.Decimal
    }),
    not: apiWithoutContext.arg({
      type: DecimalFilter
    })
  })
});
const BigIntNullableFilter = apiWithoutContext.inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    // can be null
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    // can be null
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    // can be null
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    not: apiWithoutContext.arg({
      type: BigIntNullableFilter
    }) // can be null
  })
});
const BigIntFilter = apiWithoutContext.inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    in: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    notIn: apiWithoutContext.arg({
      type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.BigInt))
    }),
    lt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    lte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gt: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    gte: apiWithoutContext.arg({
      type: graphqlTsSchema.BigInt
    }),
    not: apiWithoutContext.arg({
      type: BigIntFilter
    })
  })
});
const String = {
  optional: StringNullableFilter,
  required: StringFilter
};
const Boolean = {
  optional: BooleanNullableFilter,
  required: BooleanFilter
};
const Int = {
  optional: IntNullableFilter,
  required: IntFilter
};
const Float = {
  optional: FloatNullableFilter,
  required: FloatFilter
};
const DateTime = {
  optional: DateTimeNullableFilter,
  required: DateTimeFilter
};
const Decimal = {
  optional: DecimalNullableFilter,
  required: DecimalFilter
};
const BigInt = {
  optional: BigIntNullableFilter,
  required: BigIntFilter
};

var mysql = /*#__PURE__*/Object.freeze({
  __proto__: null,
  String: String,
  Boolean: Boolean,
  Int: Int,
  Float: Float,
  DateTime: DateTime,
  Decimal: Decimal,
  BigInt: BigInt,
  'enum': enumFilters
});

const objectEntriesButAssumeNoExtraProperties = Object.entries;
function internalResolveFilter(entries, mode) {
  const entry = entries.shift();
  if (entry === undefined) return {};
  const [key, val] = entry;
  if (val == null) {
    return {
      AND: [{
        [key]: val
      }, internalResolveFilter(entries, mode)]
    };
  }
  switch (key) {
    case 'equals':
    case 'lt':
    case 'lte':
    case 'gt':
    case 'gte':
    case 'in':
    case 'contains':
    case 'startsWith':
    case 'endsWith':
      {
        return {
          AND: [{
            [key]: val,
            mode
          }, {
            not: null
          }, internalResolveFilter(entries, mode)]
        };
      }
    case 'notIn':
      {
        return {
          AND: [{
            NOT: [internalResolveFilter(objectEntriesButAssumeNoExtraProperties({
              in: val
            }), mode)]
          }, internalResolveFilter(entries, mode)]
        };
      }
    case 'not':
      {
        return {
          AND: [{
            NOT: [internalResolveFilter(objectEntriesButAssumeNoExtraProperties(val), mode)]
          }, internalResolveFilter(entries, mode)]
        };
      }
  }
}
function resolveCommon(val) {
  if (val === null) return null;
  return internalResolveFilter(objectEntriesButAssumeNoExtraProperties(val), undefined);
}
function resolveString(val) {
  if (val === null) return null;
  const {
    mode,
    ...value
  } = val;
  return internalResolveFilter(objectEntriesButAssumeNoExtraProperties(value), mode !== null && mode !== void 0 ? mode : undefined);
}

var filters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  postgresql: postgresql,
  sqlite: sqlite,
  mysql: mysql,
  resolveCommon: resolveCommon,
  resolveString: resolveString
});

function checkbox(config = {}) {
  const {
    defaultValue = false
  } = config;
  return meta => {
    var _config$db, _config$db2;
    if (config.isIndexed === 'unique') {
      throw TypeError("isIndexed: 'unique' is not a supported option for field type checkbox");
    }
    assertReadIsNonNullAllowed(meta, config, false);
    return nextFields.fieldType({
      kind: 'scalar',
      mode: 'required',
      scalar: 'Boolean',
      default: {
        kind: 'literal',
        value: defaultValue
      },
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
    })({
      ...config,
      input: {
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].Boolean.required
          })
        },
        create: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Boolean,
            defaultValue: typeof defaultValue === 'boolean' ? defaultValue : undefined
          }),
          resolve(val) {
            if (val === null) throw createAdminMeta.userInputError('Checkbox fields cannot be set to null');
            return val !== null && val !== void 0 ? val : defaultValue;
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Boolean
          }),
          resolve(val) {
            if (val === null) throw createAdminMeta.userInputError('Checkbox fields cannot be set to null');
            return val;
          }
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: apiWithoutContext.Boolean
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/checkbox',
      views: '@keystone-6/core/fields/types/checkbox/views',
      getAdminMeta: () => ({
        defaultValue
      })
    });
  };
}

// force new syntax for built-in fields
//   and block hooks from using resolveInput, they should use GraphQL resolvers

function merge(a, b) {
  if (!a && !b) return undefined;
  return async args => {
    await (a === null || a === void 0 ? void 0 : a(args));
    await (b === null || b === void 0 ? void 0 : b(args));
  };
}

/** @deprecated, TODO: remove in breaking change */
function resolveValidateHooks({
  validate,
  validateInput,
  validateDelete
}) {
  if (!validate && !validateInput && !validateDelete) return;
  return {
    create: merge(validateInput, typeof validate === 'function' ? validate : validate === null || validate === void 0 ? void 0 : validate.create),
    update: merge(validateInput, typeof validate === 'function' ? validate : validate === null || validate === void 0 ? void 0 : validate.update),
    delete: merge(validateDelete, typeof validate === 'function' ? validate : validate === null || validate === void 0 ? void 0 : validate.delete)
  };
}
function mergeFieldHooks(builtin, hooks) {
  if (hooks === undefined) return builtin;
  if (builtin === undefined) return hooks;
  const builtinValidate = resolveValidateHooks(builtin);
  const hooksValidate = resolveValidateHooks(hooks);
  return {
    ...hooks,
    // WARNING: beforeOperation is _after_ a user beforeOperation hook, TODO: this is align with user expectations about when "operations" happen
    //   our *Operation hooks are built-in, and should happen nearest to the database
    beforeOperation: merge(hooks.beforeOperation, builtin.beforeOperation),
    afterOperation: merge(builtin.afterOperation, hooks.afterOperation),
    validate: builtinValidate || hooksValidate ? {
      create: merge(builtinValidate === null || builtinValidate === void 0 ? void 0 : builtinValidate.create, hooksValidate === null || hooksValidate === void 0 ? void 0 : hooksValidate.create),
      update: merge(builtinValidate === null || builtinValidate === void 0 ? void 0 : builtinValidate.update, hooksValidate === null || hooksValidate === void 0 ? void 0 : hooksValidate.update),
      delete: merge(builtinValidate === null || builtinValidate === void 0 ? void 0 : builtinValidate.delete, hooksValidate === null || hooksValidate === void 0 ? void 0 : hooksValidate.delete)
    } : undefined,
    // TODO: remove in breaking change
    validateInput: undefined,
    // prevent continuation
    validateDelete: undefined // prevent continuation
  };
}

function parseDecimalValueOption(meta, value, name) {
  let decimal;
  try {
    decimal = new Decimal__default["default"](value);
  } catch (err) {
    throw new Error(`The decimal field at ${meta.listKey}.${meta.fieldKey} specifies ${name}: ${value}, this is not valid decimal value.`);
  }
  if (!decimal.isFinite()) {
    throw new Error(`The decimal field at ${meta.listKey}.${meta.fieldKey} specifies ${name}: ${value} which is not finite but ${name} must be finite.`);
  }
  return decimal;
}
function safeParseDecimalValueOption(meta, value, name) {
  if (value === null || value === undefined) {
    return value;
  }
  return parseDecimalValueOption(meta, value, name);
}
function decimal(config = {}) {
  const {
    isIndexed,
    precision = 18,
    scale = 4,
    validation,
    defaultValue
  } = config;
  return meta => {
    var _config$db, _config$db2;
    if (meta.provider === 'sqlite') {
      throw new Error('The decimal field does not support sqlite');
    }
    if (!Number.isInteger(scale)) {
      throw new Error(`The scale for decimal fields must be an integer but the scale for the decimal field at ${meta.listKey}.${meta.fieldKey} is not an integer`);
    }
    if (!Number.isInteger(precision)) {
      throw new Error(`The precision for decimal fields must be an integer but the precision for the decimal field at ${meta.listKey}.${meta.fieldKey} is not an integer`);
    }
    if (scale > precision) {
      throw new Error(`The scale configured for decimal field at ${meta.listKey}.${meta.fieldKey} (${scale}) ` + `must not be larger than the field's precision (${precision})`);
    }
    const max = (validation === null || validation === void 0 ? void 0 : validation.max) === undefined ? undefined : parseDecimalValueOption(meta, validation.max, 'validation.max');
    const min = (validation === null || validation === void 0 ? void 0 : validation.min) === undefined ? undefined : parseDecimalValueOption(meta, validation.min, 'validation.min');
    if (min !== undefined && max !== undefined && max.lessThan(min)) {
      throw new Error(`The decimal field at ${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    const parsedDefaultValue = defaultValue === undefined ? undefined : parseDecimalValueOption(meta, defaultValue, 'defaultValue');
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, ({
      resolvedData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const value = safeParseDecimalValueOption(meta, resolvedData[meta.fieldKey], 'value');
      if (value != null) {
        if (min !== undefined && value.lessThan(min)) {
          addValidationError(`value must be greater than or equal to ${min}`);
        }
        if (max !== undefined && value.greaterThan(max)) {
          addValidationError(`value must be less than or equal to ${max}`);
        }
      }
    });
    const index = isIndexed === true ? 'index' : isIndexed || undefined;
    const dbField = {
      kind: 'scalar',
      mode,
      scalar: 'Decimal',
      nativeType: `Decimal(${precision}, ${scale})`,
      index,
      default: defaultValue === undefined ? undefined : {
        kind: 'literal',
        value: defaultValue
      },
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
    };
    return nextFields.fieldType(dbField)({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.Decimal
          })
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].Decimal[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.Decimal,
            defaultValue: parsedDefaultValue
          }),
          resolve(val) {
            if (val === undefined) {
              return parsedDefaultValue !== null && parsedDefaultValue !== void 0 ? parsedDefaultValue : null;
            }
            return val;
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.Decimal
          })
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: graphqlTsSchema.Decimal,
        resolve({
          value
        }) {
          if (value === null) {
            return null;
          }
          const val = new Decimal__default["default"](value);
          val.scaleToPrint = scale;
          return val;
        }
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/decimal',
      views: '@keystone-6/core/fields/types/decimal/views',
      getAdminMeta: () => {
        var _validation$isRequire, _validation$max, _validation$min;
        return {
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
          precision,
          scale,
          validation: {
            isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false,
            max: (_validation$max = validation === null || validation === void 0 ? void 0 : validation.max) !== null && _validation$max !== void 0 ? _validation$max : null,
            min: (_validation$min = validation === null || validation === void 0 ? void 0 : validation.min) !== null && _validation$min !== void 0 ? _validation$min : null
          }
        };
      }
    });
  };
}

const FileFieldInput = apiWithoutContext.inputObject({
  name: 'FileFieldInput',
  fields: {
    upload: apiWithoutContext.arg({
      type: apiWithoutContext.nonNull(graphqlTsSchema.Upload)
    })
  }
});
const inputArg$1 = apiWithoutContext.arg({
  type: FileFieldInput
});
const FileFieldOutput = apiWithContext.object()({
  name: 'FileFieldOutput',
  fields: {
    filename: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.String)
    }),
    filesize: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.Int)
    }),
    url: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.String),
      resolve(data, args, context) {
        return context.files(data.storage).getUrl(data.filename);
      }
    })
  }
});
async function inputResolver$1(storage, data, context) {
  if (data === null || data === undefined) return {
    filename: data,
    filesize: data
  };
  const upload = await data.upload;
  return context.files(storage).getDataFromStream(upload.createReadStream(), upload.filename);
}
function file(config) {
  return meta => {
    var _config$db;
    const {
      fieldKey
    } = meta;
    const storage = meta.getStorage(config.storage);
    if (!storage) {
      throw new Error(`${meta.listKey}.${fieldKey} has storage set to ${config.storage}, but no storage configuration was found for that key`);
    }
    if ('isIndexed' in config) {
      throw Error("isIndexed: 'unique' is not a supported option for field type file");
    }
    const hooks = {};
    if (!storage.preserve) {
      hooks.beforeOperation = async function (args) {
        if (args.operation === 'update' || args.operation === 'delete') {
          const filenameKey = `${fieldKey}_filename`;
          const filename = args.item[filenameKey];

          // this will occur on an update where a file already existed but has been
          // changed, or on a delete, where there is no longer an item
          if ((args.operation === 'delete' || typeof args.resolvedData[fieldKey].filename === 'string' || args.resolvedData[fieldKey].filename === null) && typeof filename === 'string') {
            await args.context.files(config.storage).deleteAtSource(filename);
          }
        }
      };
    }
    return nextFields.fieldType({
      kind: 'multi',
      extendPrismaSchema: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.extendPrismaSchema,
      fields: {
        filesize: {
          kind: 'scalar',
          scalar: 'Int',
          mode: 'optional'
        },
        filename: {
          kind: 'scalar',
          scalar: 'String',
          mode: 'optional'
        }
      }
    })({
      ...config,
      hooks: mergeFieldHooks(hooks, config.hooks),
      input: {
        create: {
          arg: inputArg$1,
          resolve: (data, context) => inputResolver$1(config.storage, data, context)
        },
        update: {
          arg: inputArg$1,
          resolve: (data, context) => inputResolver$1(config.storage, data, context)
        }
      },
      output: graphqlTsSchema.field({
        type: FileFieldOutput,
        resolve({
          value: {
            filesize,
            filename
          }
        }) {
          if (filename === null) return null;
          if (filesize === null) return null;
          return {
            filename,
            filesize,
            storage: config.storage
          };
        }
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/file',
      views: '@keystone-6/core/fields/types/file/views'
    });
  };
}

// Float in GQL: A signed double-precision floating-point value.
function float(config = {}) {
  const {
    defaultValue,
    isIndexed,
    validation = {}
  } = config;
  const {
    isRequired = false,
    min,
    max
  } = validation;
  return meta => {
    var _config$db, _config$db2;
    if (defaultValue !== undefined && (typeof defaultValue !== 'number' || !Number.isFinite(defaultValue))) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies a default value of: ${defaultValue} but it must be a valid finite number`);
    }
    if (min !== undefined && (typeof min !== 'number' || !Number.isFinite(min))) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.min: ${min} but it must be a valid finite number`);
    }
    if (max !== undefined && (typeof max !== 'number' || !Number.isFinite(max))) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.max: ${max} but it must be a valid finite number`);
    }
    if (min !== undefined && max !== undefined && min > max) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    const hasAdditionalValidation = min !== undefined || max !== undefined;
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, hasAdditionalValidation ? ({
      resolvedData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const value = resolvedData[meta.fieldKey];
      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          addValidationError(`value must be greater than or equal to ${min}`);
        }
        if (max !== undefined && value > max) {
          addValidationError(`value must be less than or equal to ${max}`);
        }
      }
    } : undefined);
    return nextFields.fieldType({
      kind: 'scalar',
      mode,
      scalar: 'Float',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'number' ? {
        kind: 'literal',
        value: defaultValue
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
    })({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Float
          })
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].Float[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Float,
            defaultValue: typeof defaultValue === 'number' ? defaultValue : undefined
          }),
          resolve(value) {
            if (value === undefined) {
              return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
            }
            return value;
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Float
          })
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: apiWithoutContext.Float
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/float',
      views: '@keystone-6/core/fields/types/float/views',
      getAdminMeta() {
        return {
          validation: {
            isRequired,
            min: min !== null && min !== void 0 ? min : null,
            max: max !== null && max !== void 0 ? max : null
          },
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null
        };
      }
    });
  };
}

// these are the lowest and highest values for a signed 32-bit integer
const MAX_INT$3 = 2147483647;
const MIN_INT$3 = -2147483648;
function integer(config = {}) {
  const {
    defaultValue: _defaultValue,
    isIndexed,
    validation = {}
  } = config;
  const {
    isRequired = false,
    min,
    max
  } = validation;
  return meta => {
    var _config$db, _config$db2;
    const defaultValue = _defaultValue !== null && _defaultValue !== void 0 ? _defaultValue : null;
    const hasAutoIncDefault = typeof defaultValue == 'object' && defaultValue !== null && defaultValue.kind === 'autoincrement';
    if (hasAutoIncDefault) {
      if (meta.provider === 'sqlite' || meta.provider === 'mysql') {
        throw new Error(`${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' }, this is not supported on ${meta.provider}`);
      }
      const isNullable = resolveDbNullable(validation, config.db);
      if (isNullable !== false) {
        throw new Error(`${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' } but doesn't specify db.isNullable: false.\n` + `Having nullable autoincrements on Prisma currently incorrectly creates a non-nullable column so it is not allowed.\n` + `https://github.com/prisma/prisma/issues/8663`);
      }
    }
    if (min !== undefined && !Number.isInteger(min)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.min: ${min} but it must be an integer`);
    }
    if (max !== undefined && !Number.isInteger(max)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.max: ${max} but it must be an integer`);
    }
    if (min !== undefined && (min > MAX_INT$3 || min < MIN_INT$3)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.min: ${min} which is outside of the range of a 32-bit signed integer`);
    }
    if (max !== undefined && (max > MAX_INT$3 || max < MIN_INT$3)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.max: ${max} which is outside of the range of a 32-bit signed integer`);
    }
    if (min !== undefined && max !== undefined && min > max) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    const hasAdditionalValidation = min !== undefined || max !== undefined;
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, hasAdditionalValidation ? ({
      resolvedData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const value = resolvedData[meta.fieldKey];
      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          addValidationError(`value must be greater than or equal to ${min}`);
        }
        if (max !== undefined && value > max) {
          addValidationError(`value must be less than or equal to ${max}`);
        }
      }
    } : undefined);
    return nextFields.fieldType({
      kind: 'scalar',
      mode,
      scalar: 'Int',
      // this will resolve to 'index' if the boolean is true, otherwise other values - false will be converted to undefined
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'number' ? {
        kind: 'literal',
        value: defaultValue
      } : (defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.kind) === 'autoincrement' ? {
        kind: 'autoincrement'
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
    })({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Int
          })
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].Int[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Int,
            defaultValue: typeof defaultValue === 'number' ? defaultValue : undefined
          }),
          resolve(value) {
            if (value === undefined && typeof defaultValue === 'number') {
              return defaultValue;
            }
            return value;
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.Int
          })
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: apiWithoutContext.Int
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/integer',
      views: '@keystone-6/core/fields/types/integer/views',
      getAdminMeta() {
        return {
          validation: {
            min: min !== null && min !== void 0 ? min : MIN_INT$3,
            max: max !== null && max !== void 0 ? max : MAX_INT$3,
            isRequired
          },
          defaultValue: defaultValue === null || typeof defaultValue === 'number' ? defaultValue : 'autoincrement'
        };
      }
    });
  };
}

// these are the lowest and highest values for a signed 64-bit integer
const MAX_INT$2 = 9223372036854775807n;
const MIN_INT$2 = -9223372036854775808n;
function bigInt(config = {}) {
  const {
    defaultValue: _defaultValue,
    isIndexed,
    validation = {}
  } = config;
  const {
    isRequired = false,
    min,
    max
  } = validation;
  return meta => {
    var _config$db, _config$db2;
    const defaultValue = _defaultValue !== null && _defaultValue !== void 0 ? _defaultValue : null;
    const hasAutoIncDefault = typeof defaultValue == 'object' && defaultValue !== null && defaultValue.kind === 'autoincrement';
    if (hasAutoIncDefault) {
      if (meta.provider === 'sqlite' || meta.provider === 'mysql') {
        throw new Error(`${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' }, this is not supported on ${meta.provider}`);
      }
      const isNullable = resolveDbNullable(validation, config.db);
      if (isNullable !== false) {
        throw new Error(`${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' } but doesn't specify db.isNullable: false.\n` + `Having nullable autoincrements on Prisma currently incorrectly creates a non-nullable column so it is not allowed.\n` + `https://github.com/prisma/prisma/issues/8663`);
      }
      if (isRequired) {
        throw new Error(`${meta.listKey}.${meta.fieldKey} defaultValue: { kind: 'autoincrement' } conflicts with validation.isRequired: true`);
      }
    }
    if (min !== undefined && !Number.isInteger(min)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.min: ${min} but it must be an integer`);
    }
    if (max !== undefined && !Number.isInteger(max)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.max: ${max} but it must be an integer`);
    }
    if (min !== undefined && (min > MAX_INT$2 || min < MIN_INT$2)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.min: ${min} which is outside of the range of a 64-bit signed integer`);
    }
    if (max !== undefined && (max > MAX_INT$2 || max < MIN_INT$2)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.max: ${max} which is outside of the range of a 64-bit signed integer`);
    }
    if (min !== undefined && max !== undefined && min > max) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    const hasAdditionalValidation = min !== undefined || max !== undefined;
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, hasAdditionalValidation ? ({
      resolvedData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const value = resolvedData[meta.fieldKey];
      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          addValidationError(`value must be greater than or equal to ${min}`);
        }
        if (max !== undefined && value > max) {
          addValidationError(`value must be less than or equal to ${max}`);
        }
      }
    } : undefined);
    return nextFields.fieldType({
      kind: 'scalar',
      mode,
      scalar: 'BigInt',
      // this will resolve to 'index' if the boolean is true, otherwise other values - false will be converted to undefined
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'bigint' ? {
        kind: 'literal',
        value: defaultValue
      } : (defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.kind) === 'autoincrement' ? {
        kind: 'autoincrement'
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
    })({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.BigInt
          })
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].BigInt[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.BigInt,
            defaultValue: typeof defaultValue === 'bigint' ? defaultValue : undefined
          }),
          resolve(value) {
            if (value === undefined && typeof defaultValue === 'bigint') {
              return defaultValue;
            }
            return value;
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.BigInt
          })
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: graphqlTsSchema.BigInt
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/bigInt',
      views: '@keystone-6/core/fields/types/bigInt/views',
      getAdminMeta() {
        var _min$toString, _max$toString;
        return {
          validation: {
            min: (_min$toString = min === null || min === void 0 ? void 0 : min.toString()) !== null && _min$toString !== void 0 ? _min$toString : `${MIN_INT$2}`,
            max: (_max$toString = max === null || max === void 0 ? void 0 : max.toString()) !== null && _max$toString !== void 0 ? _max$toString : `${MAX_INT$2}`,
            isRequired
          },
          defaultValue: typeof defaultValue === 'bigint' ? defaultValue.toString() : defaultValue
        };
      }
    });
  };
}

const ImageExtensionEnum = apiWithoutContext["enum"]({
  name: 'ImageExtension',
  values: apiWithoutContext.enumValues(fields_types_image_utils_dist_keystone6CoreFieldsTypesImageUtils.SUPPORTED_IMAGE_EXTENSIONS)
});
const ImageFieldInput = apiWithoutContext.inputObject({
  name: 'ImageFieldInput',
  fields: {
    upload: apiWithoutContext.arg({
      type: apiWithoutContext.nonNull(graphqlTsSchema.Upload)
    })
  }
});
const inputArg = apiWithoutContext.arg({
  type: ImageFieldInput
});
const ImageFieldOutput = apiWithContext.object()({
  name: 'ImageFieldOutput',
  fields: {
    id: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.ID)
    }),
    filesize: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.Int)
    }),
    width: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.Int)
    }),
    height: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.Int)
    }),
    extension: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(ImageExtensionEnum)
    }),
    url: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.String),
      resolve(data, args, context) {
        return context.images(data.storage).getUrl(data.id, data.extension);
      }
    })
  }
});
async function inputResolver(storage, data, context) {
  if (data === null || data === undefined) {
    return {
      id: data,
      filesize: data,
      width: data,
      height: data,
      extension: data
    };
  }
  const upload = await data.upload;
  return context.images(storage).getDataFromStream(upload.createReadStream(), upload.filename);
}
const extensionsSet = new Set(fields_types_image_utils_dist_keystone6CoreFieldsTypesImageUtils.SUPPORTED_IMAGE_EXTENSIONS);
function isValidImageExtension(extension) {
  return extensionsSet.has(extension);
}
function image(config) {
  return meta => {
    var _config$db;
    const {
      fieldKey
    } = meta;
    const storage = meta.getStorage(config.storage);
    if (!storage) {
      throw new Error(`${meta.listKey}.${fieldKey} has storage set to ${config.storage}, but no storage configuration was found for that key`);
    }
    if ('isIndexed' in config) {
      throw Error("isIndexed: 'unique' is not a supported option for field type image");
    }
    const hooks = {};
    if (!storage.preserve) {
      hooks.beforeOperation = async args => {
        if (args.operation === 'update' || args.operation === 'delete') {
          const idKey = `${fieldKey}_id`;
          const id = args.item[idKey];
          const extensionKey = `${fieldKey}_extension`;
          const extension = args.item[extensionKey];

          // This will occur on an update where an image already existed but has been
          // changed, or on a delete, where there is no longer an item
          if ((args.operation === 'delete' || typeof args.resolvedData[fieldKey].id === 'string' || args.resolvedData[fieldKey].id === null) && typeof id === 'string' && typeof extension === 'string' && isValidImageExtension(extension)) {
            await args.context.images(config.storage).deleteAtSource(id, extension);
          }
        }
      };
    }
    return nextFields.fieldType({
      kind: 'multi',
      extendPrismaSchema: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.extendPrismaSchema,
      fields: {
        id: {
          kind: 'scalar',
          scalar: 'String',
          mode: 'optional'
        },
        filesize: {
          kind: 'scalar',
          scalar: 'Int',
          mode: 'optional'
        },
        width: {
          kind: 'scalar',
          scalar: 'Int',
          mode: 'optional'
        },
        height: {
          kind: 'scalar',
          scalar: 'Int',
          mode: 'optional'
        },
        extension: {
          kind: 'scalar',
          scalar: 'String',
          mode: 'optional'
        }
      }
    })({
      ...config,
      hooks: mergeFieldHooks(hooks, config.hooks),
      input: {
        create: {
          arg: inputArg,
          resolve: (data, context) => inputResolver(config.storage, data, context)
        },
        update: {
          arg: inputArg,
          resolve: (data, context) => inputResolver(config.storage, data, context)
        }
      },
      output: graphqlTsSchema.field({
        type: ImageFieldOutput,
        resolve({
          value: {
            id,
            filesize,
            width,
            height,
            extension
          }
        }) {
          if (id === null) return null;
          if (filesize === null) return null;
          if (width === null) return null;
          if (height === null) return null;
          if (extension === null) return null;
          if (!isValidImageExtension(extension)) return null;
          return {
            id,
            filesize,
            width,
            height,
            extension,
            storage: config.storage
          };
        }
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/image',
      views: '@keystone-6/core/fields/types/image/views'
    });
  };
}

const json = ({
  defaultValue = null,
  ...config
} = {}) => meta => {
  var _config$db, _config$db2;
  if (config.isIndexed === 'unique') {
    throw Error("isIndexed: 'unique' is not a supported option for field type json");
  }
  return jsonFieldTypePolyfillForSqlite.jsonFieldTypePolyfilledForSQLite(meta.provider, {
    ...config,
    __ksTelemetryFieldTypeName: '@keystone-6/json',
    input: {
      create: {
        arg: apiWithoutContext.arg({
          type: graphqlTsSchema.JSON
        }),
        resolve(val) {
          return val === undefined ? defaultValue : val;
        }
      },
      update: {
        arg: apiWithoutContext.arg({
          type: graphqlTsSchema.JSON
        })
      }
    },
    output: graphqlTsSchema.field({
      type: graphqlTsSchema.JSON
    }),
    views: '@keystone-6/core/fields/types/json/views',
    getAdminMeta: () => ({
      defaultValue
    })
  }, {
    default: defaultValue === null ? undefined : {
      kind: 'literal',
      value: JSON.stringify(defaultValue)
    },
    map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
    extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
  });
};

const PasswordState = apiWithContext.object()({
  name: 'PasswordState',
  fields: {
    isSet: graphqlTsSchema.field({
      type: apiWithoutContext.nonNull(apiWithoutContext.Boolean)
    })
  }
});
const PasswordFilter = apiWithoutContext.inputObject({
  name: 'PasswordFilter',
  fields: {
    isSet: apiWithoutContext.arg({
      type: apiWithoutContext.nonNull(apiWithoutContext.Boolean)
    })
  }
});
const bcryptHashRegex = /^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/;
function password(config = {}) {
  var _validation$length$mi, _validation$length, _validation$length2;
  const {
    bcrypt = bcryptjs__default["default"],
    workFactor = 10,
    validation = {}
  } = config;
  const {
    isRequired = false,
    rejectCommon = false,
    match,
    length: {
      max
    } = {}
  } = validation;
  const min = isRequired ? (_validation$length$mi = (_validation$length = validation.length) === null || _validation$length === void 0 ? void 0 : _validation$length.min) !== null && _validation$length$mi !== void 0 ? _validation$length$mi : 8 : (_validation$length2 = validation.length) === null || _validation$length2 === void 0 ? void 0 : _validation$length2.min;
  return meta => {
    var _config$db, _config$db2;
    if (config.isIndexed === 'unique') {
      throw Error("isIndexed: 'unique' is not a supported option for field type password");
    }
    if (min !== undefined && (!Number.isInteger(min) || min < 0)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.length.min: ${min} but it must be a positive integer`);
    }
    if (max !== undefined && (!Number.isInteger(max) || max < 0)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.length.max: ${max} but it must be a positive integer`);
    }
    if (isRequired && min !== undefined && min === 0) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.isRequired: true and validation.length.min: 0, this is not allowed because validation.isRequired implies at least a min length of 1`);
    }
    if (isRequired && max !== undefined && max === 0) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.isRequired: true and validation.length.max: 0, this is not allowed because validation.isRequired implies at least a max length of 1`);
    }
    if (min !== undefined && max !== undefined && min > max) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies a validation.length.max that is less than the validation.length.min, and therefore has no valid options`);
    }
    if (workFactor < 6 || workFactor > 31 || !Number.isInteger(workFactor)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey}: workFactor must be an integer between 6 and 31`);
    }
    function inputResolver(val) {
      if (val == null) return val;
      return bcrypt.hash(val, workFactor);
    }
    const hasAdditionalValidation = match || rejectCommon || min !== undefined || max !== undefined;
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, hasAdditionalValidation ? ({
      inputData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const value = inputData[meta.fieldKey]; // we use inputData, as resolveData is hashed
      if (value != null) {
        if (min !== undefined && value.length < min) {
          if (min === 1) {
            addValidationError(`value must not be empty`);
          } else {
            addValidationError(`value must be at least ${min} characters long`);
          }
        }
        if (max !== undefined && value.length > max) {
          addValidationError(`value must be no longer than ${max} characters`);
        }
        if (match && !match.regex.test(value)) {
          var _match$explanation;
          addValidationError((_match$explanation = match.explanation) !== null && _match$explanation !== void 0 ? _match$explanation : `value must match ${match.regex}`);
        }
        if (rejectCommon && dumbPasswords__default["default"].check(value)) {
          addValidationError(`value is too common and is not allowed`);
        }
      }
    } : undefined);
    return nextFields.fieldType({
      kind: 'scalar',
      scalar: 'String',
      mode,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
    })({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        where: mode === 'required' ? undefined : {
          arg: apiWithoutContext.arg({
            type: PasswordFilter
          }),
          resolve(val) {
            if (val === null) {
              throw createAdminMeta.userInputError('Password filters cannot be set to null');
            }
            if (val.isSet) {
              return {
                not: null
              };
            }
            return null;
          }
        },
        create: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String
          }),
          resolve(val) {
            if (val === undefined) {
              return null;
            }
            return inputResolver(val);
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String
          }),
          resolve: inputResolver
        }
      },
      __ksTelemetryFieldTypeName: '@keystone-6/password',
      views: '@keystone-6/core/fields/types/password/views',
      getAdminMeta: () => {
        var _match$explanation2;
        return {
          isNullable: mode === 'optional',
          validation: {
            isRequired,
            rejectCommon,
            match: match ? {
              regex: {
                source: match.regex.source,
                flags: match.regex.flags
              },
              explanation: (_match$explanation2 = match.explanation) !== null && _match$explanation2 !== void 0 ? _match$explanation2 : `value must match ${match.regex}`
            } : null,
            length: {
              max: max !== null && max !== void 0 ? max : null,
              min: min !== null && min !== void 0 ? min : 8
            }
          }
        };
      },
      output: graphqlTsSchema.field({
        type: PasswordState,
        resolve(val) {
          return {
            isSet: val.value !== null && bcryptHashRegex.test(val.value)
          };
        },
        extensions: {
          keystoneSecretField: {
            generateHash: async secret => {
              return bcrypt.hash(secret, workFactor);
            },
            compare: (secret, hash) => {
              return bcrypt.compare(secret, hash);
            }
          }
        }
      })
    });
  };
}

// This is the default display mode for Relationships

function throwIfMissingFields(localListMeta, foreignListMeta, refLabelField, refSearchFields) {
  if (!(refLabelField in foreignListMeta.fieldsByKey)) {
    throw new Error(`"${refLabelField}" is not a field of list "${foreignListMeta.key}"`);
  }
  for (const searchFieldKey of refSearchFields) {
    if (searchFieldKey in foreignListMeta.fieldsByKey) continue;
    throw new Error(`"${refSearchFields}" is not a field of list "${foreignListMeta.key}"`);
  }
}
function relationship({
  ref,
  ...config
}) {
  return ({
    fieldKey,
    listKey,
    lists
  }) => {
    var _config$db3, _config$db4;
    const {
      many = false
    } = config;
    const [foreignListKey, foreignFieldKey] = ref.split('.');
    const foreignList = lists[foreignListKey];
    if (!foreignList) throw new Error(`${listKey}.${fieldKey} points to ${ref}, but ${ref} doesn't exist`);
    const foreignListTypes = foreignList.types;
    const commonConfig = {
      ...config,
      __ksTelemetryFieldTypeName: '@keystone-6/relationship',
      views: '@keystone-6/core/fields/types/relationship/views',
      getAdminMeta: () => {
        var _config$ui$hideCreate, _config$ui, _config$ui2, _config$ui3, _config$ui4, _config$ui5, _config$ui6;
        const adminMetaRoot = createAdminMeta.getAdminMetaForRelationshipField();
        const localListMeta = adminMetaRoot.listsByKey[listKey];
        const foreignListMeta = adminMetaRoot.listsByKey[foreignListKey];
        if (!foreignListMeta) {
          throw new Error(`The ref [${ref}] on relationship [${listKey}.${fieldKey}] is invalid`);
        }
        const refLabelField = foreignListMeta.labelField;
        const refSearchFields = foreignListMeta.initialSearchFields;
        const hideCreate = (_config$ui$hideCreate = (_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.hideCreate) !== null && _config$ui$hideCreate !== void 0 ? _config$ui$hideCreate : false;
        if (((_config$ui2 = config.ui) === null || _config$ui2 === void 0 ? void 0 : _config$ui2.displayMode) === 'cards') {
          // we're checking whether the field which will be in the admin meta at the time that getAdminMeta is called.
          // in newer versions of keystone, it will be there and it will not be there for older versions of keystone.
          // this is so that relationship fields doesn't break in confusing ways
          // if people are using a slightly older version of keystone
          const currentField = localListMeta.fields.find(x => x.key === fieldKey);
          if (currentField) {
            const allForeignFields = new Set(foreignListMeta.fields.map(x => x.key));
            for (const [configOption, foreignFields] of [['ui.cardFields', config.ui.cardFields], ['ui.inlineCreate.fields', (_config$ui$inlineCrea = (_config$ui$inlineCrea2 = config.ui.inlineCreate) === null || _config$ui$inlineCrea2 === void 0 ? void 0 : _config$ui$inlineCrea2.fields) !== null && _config$ui$inlineCrea !== void 0 ? _config$ui$inlineCrea : []], ['ui.inlineEdit.fields', (_config$ui$inlineEdit = (_config$ui$inlineEdit2 = config.ui.inlineEdit) === null || _config$ui$inlineEdit2 === void 0 ? void 0 : _config$ui$inlineEdit2.fields) !== null && _config$ui$inlineEdit !== void 0 ? _config$ui$inlineEdit : []]]) {
              var _config$ui$inlineCrea, _config$ui$inlineCrea2, _config$ui$inlineEdit, _config$ui$inlineEdit2;
              for (const foreignField of foreignFields) {
                if (!allForeignFields.has(foreignField)) {
                  throw new Error(`The ${configOption} option on the relationship field at ${listKey}.${fieldKey} includes the "${foreignField}" field but that field does not exist on the "${foreignListKey}" list`);
                }
              }
            }
          }
        }
        if (((_config$ui3 = config.ui) === null || _config$ui3 === void 0 ? void 0 : _config$ui3.displayMode) === 'count') {
          return {
            displayMode: 'count',
            refFieldKey: foreignFieldKey,
            refListKey: foreignListKey,
            many,
            hideCreate,
            refLabelField,
            refSearchFields
          };
        }
        if (((_config$ui4 = config.ui) === null || _config$ui4 === void 0 ? void 0 : _config$ui4.displayMode) === 'cards') {
          var _config$ui$inlineConn, _config$ui$inlineConn2, _config$ui$inlineConn3, _config$ui$linkToItem, _config$ui$removeMode, _config$ui$inlineCrea3, _config$ui$inlineEdit3;
          // prefer the local definition to the foreign list, if provided
          const inlineConnectConfig = typeof config.ui.inlineConnect === 'object' ? {
            refLabelField: (_config$ui$inlineConn = config.ui.inlineConnect.labelField) !== null && _config$ui$inlineConn !== void 0 ? _config$ui$inlineConn : refLabelField,
            refSearchFields: (_config$ui$inlineConn2 = (_config$ui$inlineConn3 = config.ui.inlineConnect) === null || _config$ui$inlineConn3 === void 0 ? void 0 : _config$ui$inlineConn3.searchFields) !== null && _config$ui$inlineConn2 !== void 0 ? _config$ui$inlineConn2 : refSearchFields
          } : {
            refLabelField,
            refSearchFields
          };
          throwIfMissingFields(localListMeta, foreignListMeta, inlineConnectConfig.refLabelField, inlineConnectConfig.refSearchFields);
          return {
            displayMode: 'cards',
            refFieldKey: foreignFieldKey,
            refListKey: foreignListKey,
            many,
            hideCreate,
            cardFields: config.ui.cardFields,
            linkToItem: (_config$ui$linkToItem = config.ui.linkToItem) !== null && _config$ui$linkToItem !== void 0 ? _config$ui$linkToItem : false,
            removeMode: (_config$ui$removeMode = config.ui.removeMode) !== null && _config$ui$removeMode !== void 0 ? _config$ui$removeMode : 'disconnect',
            inlineCreate: (_config$ui$inlineCrea3 = config.ui.inlineCreate) !== null && _config$ui$inlineCrea3 !== void 0 ? _config$ui$inlineCrea3 : null,
            inlineEdit: (_config$ui$inlineEdit3 = config.ui.inlineEdit) !== null && _config$ui$inlineEdit3 !== void 0 ? _config$ui$inlineEdit3 : null,
            inlineConnect: config.ui.inlineConnect ? true : false,
            ...inlineConnectConfig
          };
        }

        // prefer the local definition to the foreign list, if provided
        const specificRefLabelField = ((_config$ui5 = config.ui) === null || _config$ui5 === void 0 ? void 0 : _config$ui5.labelField) || refLabelField;
        const specificRefSearchFields = ((_config$ui6 = config.ui) === null || _config$ui6 === void 0 ? void 0 : _config$ui6.searchFields) || refSearchFields;
        throwIfMissingFields(localListMeta, foreignListMeta, specificRefLabelField, specificRefSearchFields);
        return {
          displayMode: 'select',
          refFieldKey: foreignFieldKey,
          refListKey: foreignListKey,
          many,
          hideCreate,
          refLabelField: specificRefLabelField,
          refSearchFields: specificRefSearchFields
        };
      }
    };
    if (config.many) {
      var _config$db, _config$db2;
      return nextFields.fieldType({
        kind: 'relation',
        mode: 'many',
        list: foreignListKey,
        field: foreignFieldKey,
        relationName: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.relationName,
        extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
      })({
        ...commonConfig,
        input: {
          where: {
            arg: apiWithoutContext.arg({
              type: foreignListTypes.relateTo.many.where
            }),
            resolve(value, context, resolve) {
              return resolve(value);
            }
          },
          create: {
            arg: apiWithoutContext.arg({
              type: foreignListTypes.relateTo.many.create
            }),
            async resolve(value, context, resolve) {
              return resolve(value);
            }
          },
          update: {
            arg: apiWithoutContext.arg({
              type: foreignListTypes.relateTo.many.update
            }),
            async resolve(value, context, resolve) {
              return resolve(value);
            }
          }
        },
        output: graphqlTsSchema.field({
          args: foreignListTypes.findManyArgs,
          type: apiWithoutContext.list(apiWithoutContext.nonNull(foreignListTypes.output)),
          resolve({
            value
          }, args) {
            return value.findMany(args);
          }
        }),
        extraOutputFields: {
          [`${fieldKey}Count`]: graphqlTsSchema.field({
            type: apiWithoutContext.Int,
            args: {
              where: apiWithoutContext.arg({
                type: apiWithoutContext.nonNull(foreignListTypes.where),
                defaultValue: {}
              })
            },
            resolve({
              value
            }, args) {
              return value.count({
                where: args.where
              });
            }
          })
        }
      });
    }
    return nextFields.fieldType({
      kind: 'relation',
      mode: 'one',
      list: foreignListKey,
      field: foreignFieldKey,
      foreignKey: (_config$db3 = config.db) === null || _config$db3 === void 0 ? void 0 : _config$db3.foreignKey,
      extendPrismaSchema: (_config$db4 = config.db) === null || _config$db4 === void 0 ? void 0 : _config$db4.extendPrismaSchema
    })({
      ...commonConfig,
      input: {
        where: {
          arg: apiWithoutContext.arg({
            type: foreignListTypes.where
          }),
          resolve(value, context, resolve) {
            return resolve(value);
          }
        },
        create: foreignListTypes.relateTo.one.create && {
          arg: apiWithoutContext.arg({
            type: foreignListTypes.relateTo.one.create
          }),
          async resolve(value, context, resolve) {
            return resolve(value);
          }
        },
        update: foreignListTypes.relateTo.one.update && {
          arg: apiWithoutContext.arg({
            type: foreignListTypes.relateTo.one.update
          }),
          async resolve(value, context, resolve) {
            return resolve(value);
          }
        }
      },
      output: graphqlTsSchema.field({
        type: foreignListTypes.output,
        resolve({
          value
        }) {
          return value();
        }
      })
    });
  };
}

// these are the lowest and highest values for a signed 32-bit integer
const MAX_INT$1 = 2147483647;
const MIN_INT$1 = -2147483648;
function select(config) {
  const {
    isIndexed,
    ui: {
      displayMode = 'select',
      ...ui
    } = {},
    defaultValue,
    validation
  } = config;
  return meta => {
    var _config$db, _config$db2;
    const options = config.options.map(option => {
      if (typeof option === 'string') {
        return {
          label: nextFields.humanize(option),
          value: option
        };
      }
      return option;
    });
    const accepted = new Set(options.map(x => x.value));
    if (accepted.size !== options.length) {
      throw new Error(`${meta.listKey}.${meta.fieldKey}: duplicate options, this is not allowed`);
    }
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, ({
      resolvedData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const value = resolvedData[meta.fieldKey];
      if (value != null && !accepted.has(value)) {
        addValidationError(`value is not an accepted option`);
      }
    });
    const commonConfig = {
      ...config,
      mode,
      ui,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      __ksTelemetryFieldTypeName: '@keystone-6/select',
      views: '@keystone-6/core/fields/types/select/views',
      getAdminMeta: () => {
        var _config$type, _validation$isRequire;
        return {
          options,
          type: (_config$type = config.type) !== null && _config$type !== void 0 ? _config$type : 'string',
          displayMode: displayMode,
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
          isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false
        };
      }
    };
    const commonDbFieldConfig = {
      mode,
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: defaultValue === undefined ? undefined : {
        kind: 'literal',
        value: defaultValue
      },
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema
    };
    const resolveCreate = val => {
      if (val === undefined) {
        var _ref;
        return (_ref = defaultValue) !== null && _ref !== void 0 ? _ref : null;
      }
      return val;
    };
    if (config.type === 'integer') {
      if (config.options.some(({
        value
      }) => !Number.isInteger(value) || value > MAX_INT$1 || value < MIN_INT$1)) {
        throw new Error(`${meta.listKey}.${meta.fieldKey} specifies integer values that are outside the range of a 32-bit signed integer`);
      }
      return nextFields.fieldType({
        kind: 'scalar',
        scalar: 'Int',
        ...commonDbFieldConfig
      })({
        ...commonConfig,
        input: {
          uniqueWhere: isIndexed === 'unique' ? {
            arg: apiWithoutContext.arg({
              type: apiWithoutContext.Int
            })
          } : undefined,
          where: {
            arg: apiWithoutContext.arg({
              type: filters[meta.provider].Int[mode]
            }),
            resolve: mode === 'required' ? undefined : resolveCommon
          },
          create: {
            arg: apiWithoutContext.arg({
              type: apiWithoutContext.Int,
              defaultValue: typeof defaultValue === 'number' ? defaultValue : undefined
            }),
            resolve: resolveCreate
          },
          update: {
            arg: apiWithoutContext.arg({
              type: apiWithoutContext.Int
            })
          },
          orderBy: {
            arg: apiWithoutContext.arg({
              type: nextFields.orderDirectionEnum
            })
          }
        },
        output: graphqlTsSchema.field({
          type: apiWithoutContext.Int
        })
      });
    }
    if (config.type === 'enum') {
      const enumName = `${meta.listKey}${inflection.classify(meta.fieldKey)}Type`;
      const enumValues = options.map(x => `${x.value}`);
      const graphQLType = apiWithoutContext["enum"]({
        name: enumName,
        values: apiWithoutContext.enumValues(enumValues)
      });
      return nextFields.fieldType(meta.provider === 'sqlite' ? {
        kind: 'scalar',
        scalar: 'String',
        ...commonDbFieldConfig
      } : {
        kind: 'enum',
        values: enumValues,
        name: enumName,
        ...commonDbFieldConfig
      })({
        ...commonConfig,
        input: {
          uniqueWhere: isIndexed === 'unique' ? {
            arg: apiWithoutContext.arg({
              type: graphQLType
            })
          } : undefined,
          where: {
            arg: apiWithoutContext.arg({
              type: filters[meta.provider].enum(graphQLType).optional
            }),
            resolve: mode === 'required' ? undefined : resolveCommon
          },
          create: {
            arg: apiWithoutContext.arg({
              type: graphQLType,
              defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined
            }),
            resolve: resolveCreate
          },
          update: {
            arg: apiWithoutContext.arg({
              type: graphQLType
            })
          },
          orderBy: {
            arg: apiWithoutContext.arg({
              type: nextFields.orderDirectionEnum
            })
          }
        },
        output: graphqlTsSchema.field({
          type: graphQLType
        })
      });
    }
    return nextFields.fieldType({
      kind: 'scalar',
      scalar: 'String',
      ...commonDbFieldConfig
    })({
      ...commonConfig,
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String
          })
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].String[mode]
          }),
          resolve: mode === 'required' ? undefined : resolveString
        },
        create: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String,
            defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined
          }),
          resolve: resolveCreate
        },
        update: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String
          })
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: apiWithoutContext.String
      })
    });
  };
}

function text(config = {}) {
  var _config$db, _config$db2, _config$db2$isNullabl, _validation$isRequire, _validation$length$mi, _validation$length, _validation$length2, _validation$length3;
  const {
    defaultValue: defaultValue_,
    isIndexed,
    validation = {}
  } = config;
  (_config$db = config.db) !== null && _config$db !== void 0 ? _config$db : config.db = {};
  (_config$db2$isNullabl = (_config$db2 = config.db).isNullable) !== null && _config$db2$isNullabl !== void 0 ? _config$db2$isNullabl : _config$db2.isNullable = false; // TODO: sigh, remove in breaking change?

  const isRequired = (_validation$isRequire = validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false;
  const match = validation.match;
  const min = validation.isRequired ? (_validation$length$mi = (_validation$length = validation.length) === null || _validation$length === void 0 ? void 0 : _validation$length.min) !== null && _validation$length$mi !== void 0 ? _validation$length$mi : 1 : (_validation$length2 = validation.length) === null || _validation$length2 === void 0 ? void 0 : _validation$length2.min;
  const max = (_validation$length3 = validation.length) === null || _validation$length3 === void 0 ? void 0 : _validation$length3.max;
  return meta => {
    var _config$db$isNullable, _config$db3, _config$db4, _config$db5, _config$db6;
    if (min !== undefined && (!Number.isInteger(min) || min < 0)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.length.min: ${min} but it must be a positive integer`);
    }
    if (max !== undefined && (!Number.isInteger(max) || max < 0)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.length.max: ${max} but it must be a positive integer`);
    }
    if (isRequired && min !== undefined && min === 0) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.isRequired: true and validation.length.min: 0, this is not allowed because validation.isRequired implies at least a min length of 1`);
    }
    if (isRequired && max !== undefined && max === 0) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies validation.isRequired: true and validation.length.max: 0, this is not allowed because validation.isRequired implies at least a max length of 1`);
    }
    if (min !== undefined && max !== undefined && min > max) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies a validation.length.max that is less than the validation.length.min, and therefore has no valid options`);
    }

    // defaulted to false as a zero length string is preferred to null
    const isNullable = (_config$db$isNullable = (_config$db3 = config.db) === null || _config$db3 === void 0 ? void 0 : _config$db3.isNullable) !== null && _config$db$isNullable !== void 0 ? _config$db$isNullable : false;
    const defaultValue = isNullable ? defaultValue_ !== null && defaultValue_ !== void 0 ? defaultValue_ : null : defaultValue_ !== null && defaultValue_ !== void 0 ? defaultValue_ : '';
    const hasAdditionalValidation = match || min !== undefined || max !== undefined;
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, hasAdditionalValidation ? ({
      resolvedData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const value = resolvedData[meta.fieldKey];
      if (value != null) {
        if (min !== undefined && value.length < min) {
          if (min === 1) {
            addValidationError(`value must not be empty`);
          } else {
            addValidationError(`value must be at least ${min} characters long`);
          }
        }
        if (max !== undefined && value.length > max) {
          addValidationError(`value must be no longer than ${max} characters`);
        }
        if (match && !match.regex.test(value)) {
          var _match$explanation;
          addValidationError((_match$explanation = match.explanation) !== null && _match$explanation !== void 0 ? _match$explanation : `value must match ${match.regex}`);
        }
      }
    } : undefined);
    return nextFields.fieldType({
      kind: 'scalar',
      mode,
      scalar: 'String',
      default: defaultValue === null ? undefined : {
        kind: 'literal',
        value: defaultValue
      },
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      map: (_config$db4 = config.db) === null || _config$db4 === void 0 ? void 0 : _config$db4.map,
      nativeType: (_config$db5 = config.db) === null || _config$db5 === void 0 ? void 0 : _config$db5.nativeType,
      extendPrismaSchema: (_config$db6 = config.db) === null || _config$db6 === void 0 ? void 0 : _config$db6.extendPrismaSchema
    })({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String
          })
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].String[mode]
          }),
          resolve: mode === 'required' ? undefined : resolveString
        },
        create: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String,
            defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined
          }),
          resolve(val) {
            if (val !== undefined) return val;
            return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: apiWithoutContext.String
          })
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: apiWithoutContext.String
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/text',
      views: '@keystone-6/core/fields/types/text/views',
      getAdminMeta() {
        var _config$ui$displayMod, _config$ui, _match$explanation2;
        return {
          displayMode: (_config$ui$displayMod = (_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.displayMode) !== null && _config$ui$displayMod !== void 0 ? _config$ui$displayMod : 'input',
          shouldUseModeInsensitive: meta.provider === 'postgresql',
          validation: {
            isRequired,
            match: match ? {
              regex: {
                source: match.regex.source,
                flags: match.regex.flags
              },
              explanation: (_match$explanation2 = match.explanation) !== null && _match$explanation2 !== void 0 ? _match$explanation2 : `value must match ${match.regex}`
            } : null,
            length: {
              max: max !== null && max !== void 0 ? max : null,
              min: min !== null && min !== void 0 ? min : null
            }
          },
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : isNullable ? null : '',
          isNullable
        };
      }
    });
  };
}

function timestamp(config = {}) {
  const {
    isIndexed,
    defaultValue,
    validation
  } = config;
  return meta => {
    var _config$db, _config$db2, _config$db3;
    if (typeof defaultValue === 'string') {
      try {
        graphqlTsSchema.DateTime.graphQLType.parseValue(defaultValue);
      } catch (err) {
        throw new Error(`${meta.listKey}.${meta.fieldKey}.defaultValue is required to be an ISO8601 date-time string such as ${new Date().toISOString()}`);
      }
    }
    const parsedDefaultValue = typeof defaultValue === 'string' ? graphqlTsSchema.DateTime.graphQLType.parseValue(defaultValue) : defaultValue;
    const {
      mode,
      validate
    } = makeValidateHook(meta, config);
    return nextFields.fieldType({
      kind: 'scalar',
      mode,
      scalar: 'DateTime',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'string' ? {
        kind: 'literal',
        value: defaultValue
      } : defaultValue === undefined ? undefined : {
        kind: 'now'
      },
      updatedAt: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.updatedAt,
      map: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.map,
      extendPrismaSchema: (_config$db3 = config.db) === null || _config$db3 === void 0 ? void 0 : _config$db3.extendPrismaSchema
    })({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.DateTime
          })
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: filters[meta.provider].DateTime[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.DateTime,
            // TODO: add support for defaultValue of { kind: 'now' } in the GraphQL API
            defaultValue: parsedDefaultValue instanceof Date ? parsedDefaultValue : undefined
          }),
          resolve(val) {
            if (val === undefined) {
              var _config$db4;
              if (parsedDefaultValue === undefined && (_config$db4 = config.db) !== null && _config$db4 !== void 0 && _config$db4.updatedAt) return undefined;
              if (parsedDefaultValue instanceof Date || parsedDefaultValue === undefined) {
                return parsedDefaultValue !== null && parsedDefaultValue !== void 0 ? parsedDefaultValue : null;
              }
              return new Date();
            }
            return val;
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.DateTime
          })
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: graphqlTsSchema.DateTime
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/timestamp',
      views: '@keystone-6/core/fields/types/timestamp/views',
      getAdminMeta() {
        var _validation$isRequire, _config$db$updatedAt, _config$db5;
        return {
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
          isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false,
          updatedAt: (_config$db$updatedAt = (_config$db5 = config.db) === null || _config$db5 === void 0 ? void 0 : _config$db5.updatedAt) !== null && _config$db$updatedAt !== void 0 ? _config$db$updatedAt : false
        };
      }
    });
  };
}

function virtual({
  field,
  ...config
}) {
  return meta => {
    var _config$ui, _config$ui2, _config$ui3;
    const usableField = typeof field === 'function' ? field(meta.lists) : field;
    const namedType = graphql.getNamedType(usableField.type.graphQLType);
    const hasRequiredArgs = usableField.args && Object.values(usableField.args).some(x => x.type.kind === 'non-null' && x.defaultValue === undefined);
    if ((!graphql.isLeafType(namedType) || hasRequiredArgs) && !((_config$ui = config.ui) !== null && _config$ui !== void 0 && _config$ui.query) && (((_config$ui2 = config.ui) === null || _config$ui2 === void 0 || (_config$ui2 = _config$ui2.itemView) === null || _config$ui2 === void 0 ? void 0 : _config$ui2.fieldMode) !== 'hidden' || ((_config$ui3 = config.ui) === null || _config$ui3 === void 0 || (_config$ui3 = _config$ui3.listView) === null || _config$ui3 === void 0 ? void 0 : _config$ui3.fieldMode) !== 'hidden')) {
      throw new Error(`The virtual field at ${meta.listKey}.${meta.fieldKey} requires a selection for the Admin UI but ui.query is unspecified and ui.listView.fieldMode and ui.itemView.fieldMode are not both set to 'hidden'.\n` + `Either set ui.query with what the Admin UI should fetch or hide the field from the Admin UI by setting ui.listView.fieldMode and ui.itemView.fieldMode to 'hidden'.\n` + `When setting ui.query, it is interpolated into a GraphQL query like this:\n` + `query {\n` + `  ${nextFields.getGqlNames({
        listKey: meta.listKey,
        pluralGraphQLName: ''
      }).itemQueryName}(where: { id: "..." }) {\n` + `    ${meta.fieldKey}\${ui.query}\n` + `  }\n` + `}`);
    }
    return nextFields.fieldType({
      kind: 'none'
    })({
      ...config,
      output: graphqlTsSchema.field({
        ...usableField,
        resolve({
          item
        }, ...args) {
          return usableField.resolve(item, ...args);
        }
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/virtual',
      views: '@keystone-6/core/fields/types/virtual/views',
      getAdminMeta: () => {
        var _config$ui4;
        return {
          query: ((_config$ui4 = config.ui) === null || _config$ui4 === void 0 ? void 0 : _config$ui4.query) || ''
        };
      }
    });
  };
}

function calendarDay(config = {}) {
  const {
    isIndexed,
    validation,
    defaultValue
  } = config;
  return meta => {
    var _config$db, _config$db2;
    if (typeof defaultValue === 'string') {
      try {
        graphqlTsSchema.CalendarDay.graphQLType.parseValue(defaultValue);
      } catch (err) {
        throw new Error(`The calendarDay field at ${meta.listKey}.${meta.fieldKey} specifies defaultValue: ${defaultValue} but values must be provided as a full-date ISO8601 string such as 1970-01-01`);
      }
    }
    const usesNativeDateType = meta.provider === 'postgresql' || meta.provider === 'mysql';
    function resolveInput(value) {
      if (meta.provider === 'sqlite' || value == null) {
        return value;
      }
      return dateStringToDateObjectInUTC(value);
    }
    const {
      mode,
      validate
    } = makeValidateHook(meta, config);
    const commonResolveFilter = mode === 'optional' ? resolveCommon : x => x;
    return nextFields.fieldType({
      kind: 'scalar',
      mode,
      scalar: usesNativeDateType ? 'DateTime' : 'String',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'string' ? {
        kind: 'literal',
        value: defaultValue
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      extendPrismaSchema: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.extendPrismaSchema,
      nativeType: usesNativeDateType ? 'Date' : undefined
    })({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.CalendarDay
          }),
          resolve: usesNativeDateType ? dateStringToDateObjectInUTC : undefined
        } : undefined,
        where: {
          arg: apiWithoutContext.arg({
            type: mode === 'optional' ? CalendarDayNullableFilter : CalendarDayFilter
          }),
          resolve: usesNativeDateType ? value => commonResolveFilter(transformFilterDateStringsToDateObjects(value)) : commonResolveFilter
        },
        create: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.CalendarDay,
            defaultValue
          }),
          resolve(val) {
            if (val === undefined) {
              val = defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
            }
            return resolveInput(val);
          }
        },
        update: {
          arg: apiWithoutContext.arg({
            type: graphqlTsSchema.CalendarDay
          }),
          resolve: resolveInput
        },
        orderBy: {
          arg: apiWithoutContext.arg({
            type: nextFields.orderDirectionEnum
          })
        }
      },
      output: graphqlTsSchema.field({
        type: graphqlTsSchema.CalendarDay,
        resolve({
          value
        }) {
          if (value instanceof Date) {
            return value.toISOString().slice(0, 10);
          }
          return value;
        }
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/calendarDay',
      views: '@keystone-6/core/fields/types/calendarDay/views',
      getAdminMeta() {
        var _validation$isRequire;
        return {
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
          isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false
        };
      }
    });
  };
}
function dateStringToDateObjectInUTC(value) {
  return new Date(`${value}T00:00Z`);
}
function transformFilterDateStringsToDateObjects(filter) {
  if (filter === null) {
    return filter;
  }
  return Object.fromEntries(Object.entries(filter).map(([key, value]) => {
    if (value == null) {
      return [key, value];
    }
    if (Array.isArray(value)) {
      return [key, value.map(dateStringToDateObjectInUTC)];
    }
    if (typeof value === 'object') {
      return [key, transformFilterDateStringsToDateObjects(value)];
    }
    return [key, dateStringToDateObjectInUTC(value)];
  }));
}
const filterFields = nestedType => ({
  equals: apiWithoutContext.arg({
    type: graphqlTsSchema.CalendarDay
  }),
  in: apiWithoutContext.arg({
    type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.CalendarDay))
  }),
  notIn: apiWithoutContext.arg({
    type: apiWithoutContext.list(apiWithoutContext.nonNull(graphqlTsSchema.CalendarDay))
  }),
  lt: apiWithoutContext.arg({
    type: graphqlTsSchema.CalendarDay
  }),
  lte: apiWithoutContext.arg({
    type: graphqlTsSchema.CalendarDay
  }),
  gt: apiWithoutContext.arg({
    type: graphqlTsSchema.CalendarDay
  }),
  gte: apiWithoutContext.arg({
    type: graphqlTsSchema.CalendarDay
  }),
  not: apiWithoutContext.arg({
    type: nestedType
  })
});
const CalendarDayNullableFilter = apiWithoutContext.inputObject({
  name: 'CalendarDayNullableFilter',
  fields: () => filterFields(CalendarDayNullableFilter)
});
const CalendarDayFilter = apiWithoutContext.inputObject({
  name: 'CalendarDayFilter',
  fields: () => filterFields(CalendarDayFilter)
});

// these are the lowest and highest values for a signed 32-bit integer
const MAX_INT = 2147483647;
const MIN_INT = -2147483648;
function multiselect(config) {
  var _config$db, _config$db2, _config$db2$isNullabl;
  const {
    defaultValue: defaultValue_
  } = config;
  (_config$db = config.db) !== null && _config$db !== void 0 ? _config$db : config.db = {};
  (_config$db2$isNullabl = (_config$db2 = config.db).isNullable) !== null && _config$db2$isNullabl !== void 0 ? _config$db2$isNullabl : _config$db2.isNullable = false; // TODO: deprecated, remove in breaking change
  const defaultValue = config.db.isNullable ? defaultValue_ : defaultValue_ !== null && defaultValue_ !== void 0 ? defaultValue_ : []; // TODO: deprecated, remove in breaking change?

  return meta => {
    var _config$db3, _config$db4;
    if (config.isIndexed === 'unique') {
      throw TypeError("isIndexed: 'unique' is not a supported option for field type multiselect");
    }
    const output = type => nonNullList(type);
    const create = type => {
      return apiWithoutContext.arg({
        type: nonNullList(type)
      });
    };
    const resolveCreate = val => {
      const resolved = resolveUpdate(val);
      if (resolved === undefined) {
        return defaultValue;
      }
      return resolved;
    };
    const resolveUpdate = val => {
      return val;
    };
    const transformedConfig = configToOptionsAndGraphQLType(config, meta);
    const accepted = new Set(transformedConfig.options.map(x => x.value));
    if (accepted.size !== transformedConfig.options.length) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} has duplicate options, this is not allowed`);
    }
    const {
      mode,
      validate
    } = makeValidateHook(meta, config, ({
      inputData,
      operation,
      addValidationError
    }) => {
      if (operation === 'delete') return;
      const values = inputData[meta.fieldKey]; // resolvedData is JSON
      if (values != null) {
        for (const value of values) {
          if (!accepted.has(value)) {
            addValidationError(`'${value}' is not an accepted option`);
          }
        }
        if (new Set(values).size !== values.length) {
          addValidationError(`non-unique set of options selected`);
        }
      }
    });
    return jsonFieldTypePolyfillForSqlite.jsonFieldTypePolyfilledForSQLite(meta.provider, {
      ...config,
      __ksTelemetryFieldTypeName: '@keystone-6/multiselect',
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      views: '@keystone-6/core/fields/types/multiselect/views',
      getAdminMeta: () => {
        var _config$type;
        return {
          options: transformedConfig.options,
          type: (_config$type = config.type) !== null && _config$type !== void 0 ? _config$type : 'string',
          defaultValue: []
        };
      },
      input: {
        create: {
          arg: create(transformedConfig.graphqlType),
          resolve: resolveCreate
        },
        update: {
          arg: apiWithoutContext.arg({
            type: nonNullList(transformedConfig.graphqlType)
          }),
          resolve: resolveUpdate
        }
      },
      output: graphqlTsSchema.field({
        type: output(transformedConfig.graphqlType),
        resolve({
          value
        }) {
          return value;
        }
      })
    }, {
      mode,
      map: config === null || config === void 0 || (_config$db3 = config.db) === null || _config$db3 === void 0 ? void 0 : _config$db3.map,
      extendPrismaSchema: (_config$db4 = config.db) === null || _config$db4 === void 0 ? void 0 : _config$db4.extendPrismaSchema,
      default: {
        kind: 'literal',
        value: JSON.stringify(defaultValue !== null && defaultValue !== void 0 ? defaultValue : null)
      }
    });
  };
}
function configToOptionsAndGraphQLType(config, meta) {
  if (config.type === 'integer') {
    if (config.options.some(({
      value
    }) => !Number.isInteger(value) || value > MAX_INT || value < MIN_INT)) {
      throw new Error(`${meta.listKey}.${meta.fieldKey} specifies integer values that are outside the range of a 32-bit signed integer`);
    }
    return {
      type: 'integer',
      graphqlType: apiWithoutContext.Int,
      options: config.options
    };
  }
  const options = config.options.map(option => {
    if (typeof option === 'string') {
      return {
        label: nextFields.humanize(option),
        value: option
      };
    }
    return option;
  });
  if (config.type === 'enum') {
    const enumName = `${meta.listKey}${inflection.classify(meta.fieldKey)}Type`;
    const graphqlType = apiWithoutContext["enum"]({
      name: enumName,
      values: apiWithoutContext.enumValues(options.map(x => x.value))
    });
    return {
      type: 'enum',
      graphqlType,
      options
    };
  }
  return {
    type: 'string',
    graphqlType: apiWithoutContext.String,
    options
  };
}
const nonNullList = type => apiWithoutContext.list(apiWithoutContext.nonNull(type));

exports.bigInt = bigInt;
exports.calendarDay = calendarDay;
exports.checkbox = checkbox;
exports.decimal = decimal;
exports.file = file;
exports.float = float;
exports.image = image;
exports.integer = integer;
exports.json = json;
exports.multiselect = multiselect;
exports.password = password;
exports.relationship = relationship;
exports.select = select;
exports.text = text;
exports.timestamp = timestamp;
exports.virtual = virtual;

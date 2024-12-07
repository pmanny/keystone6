import { u as userInputError, g as getAdminMetaForRelationshipField } from '../../dist/create-admin-meta-164cca6b.esm.js';
import 'pluralize';
import { Q as QueryMode, f as fieldType, o as orderDirectionEnum, h as humanize, g as getGqlNames } from '../../dist/next-fields-2535337e.esm.js';
import { D as DateTime$3, a as Decimal$3, B as BigInt$3, f as field, U as Upload, J as JSON$1, C as CalendarDay } from '../../dist/graphql-ts-schema-5ba48382.esm.js';
import { inputObject, arg, list, nonNull, String as String$3, Boolean as Boolean$3, Int as Int$3, Float as Float$3, enum as enum$1, enumValues, ID } from '@graphql-ts/schema/api-without-context';
import Decimal$4 from 'decimal.js';
import { object } from '@graphql-ts/schema/api-with-context';
import { SUPPORTED_IMAGE_EXTENSIONS } from '../types/image/utils/dist/keystone-6-core-fields-types-image-utils.esm.js';
import { j as jsonFieldTypePolyfilledForSQLite } from '../../dist/json-field-type-polyfill-for-sqlite-b97d084a.esm.js';
import bcryptjs from 'bcryptjs';
import dumbPasswords from 'dumb-passwords';
import { classify } from 'inflection';
import { getNamedType, isLeafType } from 'graphql';
import 'node:path';
import '@graphql-ts/schema';
import 'graphql-upload/GraphQLUpload.js';
import '@graphql-ts/extend';

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
  const optional = inputObject({
    name: `${enumType.graphQLType.name}NullableFilter`,
    fields: () => ({
      equals: arg({
        type: enumType
      }),
      in: arg({
        type: list(nonNull(enumType))
      }),
      notIn: arg({
        type: list(nonNull(enumType))
      }),
      not: arg({
        type: optional
      })
    })
  });
  const required = inputObject({
    name: `${enumType.graphQLType.name}Filter`,
    fields: () => ({
      equals: arg({
        type: enumType
      }),
      in: arg({
        type: list(nonNull(enumType))
      }),
      notIn: arg({
        type: list(nonNull(enumType))
      }),
      not: arg({
        type: optional
      })
    })
  });
  const many = inputObject({
    name: `${enumType.graphQLType.name}NullableListFilter`,
    fields: () => ({
      // can be null
      equals: arg({
        type: list(nonNull(enumType))
      }),
      // can be null
      has: arg({
        type: enumType
      }),
      hasEvery: arg({
        type: list(nonNull(enumType))
      }),
      hasSome: arg({
        type: list(nonNull(enumType))
      }),
      isEmpty: arg({
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
const StringNullableFilter$2 = inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    mode: arg({
      type: QueryMode
    }),
    not: arg({
      type: StringNullableFilter$2
    }) // can be null
  })
});
const StringFilter$2 = inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    mode: arg({
      type: QueryMode
    }),
    not: arg({
      type: NestedStringFilter$2
    })
  })
});
const NestedStringNullableFilter$2 = inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringNullableFilter$2
    }) // can be null
  })
});
const NestedStringFilter$2 = inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter$2
    })
  })
});
const BooleanNullableFilter$2 = inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    // can be null
    not: arg({
      type: BooleanNullableFilter$2
    }) // can be null
  })
});
const BooleanFilter$2 = inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    not: arg({
      type: BooleanFilter$2
    })
  })
});
const IntFilter$2 = inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    in: arg({
      type: list(nonNull(Int$3))
    }),
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntFilter$2
    })
  })
});
const IntNullableFilter$2 = inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntNullableFilter$2
    }) // can be null
  })
});
const FloatNullableFilter$2 = inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatNullableFilter$2
    }) // can be null
  })
});
const FloatFilter$2 = inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    in: arg({
      type: list(nonNull(Float$3))
    }),
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatFilter$2
    })
  })
});
const DateTimeNullableFilter$2 = inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeNullableFilter$2
    }) // can be null
  })
});
const DateTimeFilter$2 = inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeFilter$2
    })
  })
});
const DecimalNullableFilter$2 = inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalNullableFilter$2
    }) // can be null
  })
});
const DecimalFilter$2 = inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalFilter$2
    })
  })
});
const BigIntNullableFilter$2 = inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
      type: BigIntNullableFilter$2
    }) // can be null
  })
});
const BigIntFilter$2 = inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
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
const StringNullableFilter$1 = inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: StringNullableFilter$1
    }) // can be null
  })
});
const StringFilter$1 = inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter$1
    })
  })
});
const NestedStringNullableFilter$1 = inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringNullableFilter$1
    }) // can be null
  })
});
const NestedStringFilter$1 = inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter$1
    })
  })
});
const BooleanNullableFilter$1 = inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    // can be null
    not: arg({
      type: BooleanNullableFilter$1
    }) // can be null
  })
});
const BooleanFilter$1 = inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    not: arg({
      type: BooleanFilter$1
    })
  })
});
const IntFilter$1 = inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    in: arg({
      type: list(nonNull(Int$3))
    }),
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntFilter$1
    })
  })
});
const IntNullableFilter$1 = inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntNullableFilter$1
    }) // can be null
  })
});
const FloatNullableFilter$1 = inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatNullableFilter$1
    }) // can be null
  })
});
const FloatFilter$1 = inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    in: arg({
      type: list(nonNull(Float$3))
    }),
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatFilter$1
    })
  })
});
const DateTimeNullableFilter$1 = inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeNullableFilter$1
    }) // can be null
  })
});
const DateTimeFilter$1 = inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeFilter$1
    })
  })
});
const DecimalNullableFilter$1 = inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalNullableFilter$1
    }) // can be null
  })
});
const DecimalFilter$1 = inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalFilter$1
    })
  })
});
const BigIntNullableFilter$1 = inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
      type: BigIntNullableFilter$1
    }) // can be null
  })
});
const BigIntFilter$1 = inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
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
const StringNullableFilter = inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: StringNullableFilter
    }) // can be null
  })
});
const StringFilter = inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter
    })
  })
});
const NestedStringNullableFilter = inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringNullableFilter
    }) // can be null
  })
});
const NestedStringFilter = inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter
    })
  })
});
const BooleanNullableFilter = inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    // can be null
    not: arg({
      type: BooleanNullableFilter
    }) // can be null
  })
});
const BooleanFilter = inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    not: arg({
      type: BooleanFilter
    })
  })
});
const IntFilter = inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    in: arg({
      type: list(nonNull(Int$3))
    }),
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntFilter
    })
  })
});
const IntNullableFilter = inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntNullableFilter
    }) // can be null
  })
});
const FloatNullableFilter = inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatNullableFilter
    }) // can be null
  })
});
const FloatFilter = inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    in: arg({
      type: list(nonNull(Float$3))
    }),
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatFilter
    })
  })
});
const DateTimeNullableFilter = inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeNullableFilter
    }) // can be null
  })
});
const DateTimeFilter = inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeFilter
    })
  })
});
const DecimalNullableFilter = inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalNullableFilter
    }) // can be null
  })
});
const DecimalFilter = inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalFilter
    })
  })
});
const BigIntNullableFilter = inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
      type: BigIntNullableFilter
    }) // can be null
  })
});
const BigIntFilter = inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
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
    return fieldType({
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
          arg: arg({
            type: filters[meta.provider].Boolean.required
          })
        },
        create: {
          arg: arg({
            type: Boolean$3,
            defaultValue: typeof defaultValue === 'boolean' ? defaultValue : undefined
          }),
          resolve(val) {
            if (val === null) throw userInputError('Checkbox fields cannot be set to null');
            return val !== null && val !== void 0 ? val : defaultValue;
          }
        },
        update: {
          arg: arg({
            type: Boolean$3
          }),
          resolve(val) {
            if (val === null) throw userInputError('Checkbox fields cannot be set to null');
            return val;
          }
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: Boolean$3
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
    decimal = new Decimal$4(value);
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
    return fieldType(dbField)({
      ...config,
      hooks: mergeFieldHooks({
        validate
      }, config.hooks),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: Decimal$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].Decimal[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: Decimal$3,
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
          arg: arg({
            type: Decimal$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: Decimal$3,
        resolve({
          value
        }) {
          if (value === null) {
            return null;
          }
          const val = new Decimal$4(value);
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

const FileFieldInput = inputObject({
  name: 'FileFieldInput',
  fields: {
    upload: arg({
      type: nonNull(Upload)
    })
  }
});
const inputArg$1 = arg({
  type: FileFieldInput
});
const FileFieldOutput = object()({
  name: 'FileFieldOutput',
  fields: {
    filename: field({
      type: nonNull(String$3)
    }),
    filesize: field({
      type: nonNull(Int$3)
    }),
    url: field({
      type: nonNull(String$3),
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
    return fieldType({
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
      output: field({
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
    return fieldType({
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
          arg: arg({
            type: Float$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].Float[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: Float$3,
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
          arg: arg({
            type: Float$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: Float$3
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
    return fieldType({
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
          arg: arg({
            type: Int$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].Int[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: Int$3,
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
          arg: arg({
            type: Int$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: Int$3
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
    return fieldType({
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
          arg: arg({
            type: BigInt$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].BigInt[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: BigInt$3,
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
          arg: arg({
            type: BigInt$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: BigInt$3
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

const ImageExtensionEnum = enum$1({
  name: 'ImageExtension',
  values: enumValues(SUPPORTED_IMAGE_EXTENSIONS)
});
const ImageFieldInput = inputObject({
  name: 'ImageFieldInput',
  fields: {
    upload: arg({
      type: nonNull(Upload)
    })
  }
});
const inputArg = arg({
  type: ImageFieldInput
});
const ImageFieldOutput = object()({
  name: 'ImageFieldOutput',
  fields: {
    id: field({
      type: nonNull(ID)
    }),
    filesize: field({
      type: nonNull(Int$3)
    }),
    width: field({
      type: nonNull(Int$3)
    }),
    height: field({
      type: nonNull(Int$3)
    }),
    extension: field({
      type: nonNull(ImageExtensionEnum)
    }),
    url: field({
      type: nonNull(String$3),
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
const extensionsSet = new Set(SUPPORTED_IMAGE_EXTENSIONS);
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
    return fieldType({
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
      output: field({
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
  return jsonFieldTypePolyfilledForSQLite(meta.provider, {
    ...config,
    __ksTelemetryFieldTypeName: '@keystone-6/json',
    input: {
      create: {
        arg: arg({
          type: JSON$1
        }),
        resolve(val) {
          return val === undefined ? defaultValue : val;
        }
      },
      update: {
        arg: arg({
          type: JSON$1
        })
      }
    },
    output: field({
      type: JSON$1
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

const PasswordState = object()({
  name: 'PasswordState',
  fields: {
    isSet: field({
      type: nonNull(Boolean$3)
    })
  }
});
const PasswordFilter = inputObject({
  name: 'PasswordFilter',
  fields: {
    isSet: arg({
      type: nonNull(Boolean$3)
    })
  }
});
const bcryptHashRegex = /^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/;
function password(config = {}) {
  var _validation$length$mi, _validation$length, _validation$length2;
  const {
    bcrypt = bcryptjs,
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
        if (rejectCommon && dumbPasswords.check(value)) {
          addValidationError(`value is too common and is not allowed`);
        }
      }
    } : undefined);
    return fieldType({
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
          arg: arg({
            type: PasswordFilter
          }),
          resolve(val) {
            if (val === null) {
              throw userInputError('Password filters cannot be set to null');
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
          arg: arg({
            type: String$3
          }),
          resolve(val) {
            if (val === undefined) {
              return null;
            }
            return inputResolver(val);
          }
        },
        update: {
          arg: arg({
            type: String$3
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
      output: field({
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
        const adminMetaRoot = getAdminMetaForRelationshipField();
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
      return fieldType({
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
            arg: arg({
              type: foreignListTypes.relateTo.many.where
            }),
            resolve(value, context, resolve) {
              return resolve(value);
            }
          },
          create: {
            arg: arg({
              type: foreignListTypes.relateTo.many.create
            }),
            async resolve(value, context, resolve) {
              return resolve(value);
            }
          },
          update: {
            arg: arg({
              type: foreignListTypes.relateTo.many.update
            }),
            async resolve(value, context, resolve) {
              return resolve(value);
            }
          }
        },
        output: field({
          args: foreignListTypes.findManyArgs,
          type: list(nonNull(foreignListTypes.output)),
          resolve({
            value
          }, args) {
            return value.findMany(args);
          }
        }),
        extraOutputFields: {
          [`${fieldKey}Count`]: field({
            type: Int$3,
            args: {
              where: arg({
                type: nonNull(foreignListTypes.where),
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
    return fieldType({
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
          arg: arg({
            type: foreignListTypes.where
          }),
          resolve(value, context, resolve) {
            return resolve(value);
          }
        },
        create: foreignListTypes.relateTo.one.create && {
          arg: arg({
            type: foreignListTypes.relateTo.one.create
          }),
          async resolve(value, context, resolve) {
            return resolve(value);
          }
        },
        update: foreignListTypes.relateTo.one.update && {
          arg: arg({
            type: foreignListTypes.relateTo.one.update
          }),
          async resolve(value, context, resolve) {
            return resolve(value);
          }
        }
      },
      output: field({
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
          label: humanize(option),
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
      return fieldType({
        kind: 'scalar',
        scalar: 'Int',
        ...commonDbFieldConfig
      })({
        ...commonConfig,
        input: {
          uniqueWhere: isIndexed === 'unique' ? {
            arg: arg({
              type: Int$3
            })
          } : undefined,
          where: {
            arg: arg({
              type: filters[meta.provider].Int[mode]
            }),
            resolve: mode === 'required' ? undefined : resolveCommon
          },
          create: {
            arg: arg({
              type: Int$3,
              defaultValue: typeof defaultValue === 'number' ? defaultValue : undefined
            }),
            resolve: resolveCreate
          },
          update: {
            arg: arg({
              type: Int$3
            })
          },
          orderBy: {
            arg: arg({
              type: orderDirectionEnum
            })
          }
        },
        output: field({
          type: Int$3
        })
      });
    }
    if (config.type === 'enum') {
      const enumName = `${meta.listKey}${classify(meta.fieldKey)}Type`;
      const enumValues$1 = options.map(x => `${x.value}`);
      const graphQLType = enum$1({
        name: enumName,
        values: enumValues(enumValues$1)
      });
      return fieldType(meta.provider === 'sqlite' ? {
        kind: 'scalar',
        scalar: 'String',
        ...commonDbFieldConfig
      } : {
        kind: 'enum',
        values: enumValues$1,
        name: enumName,
        ...commonDbFieldConfig
      })({
        ...commonConfig,
        input: {
          uniqueWhere: isIndexed === 'unique' ? {
            arg: arg({
              type: graphQLType
            })
          } : undefined,
          where: {
            arg: arg({
              type: filters[meta.provider].enum(graphQLType).optional
            }),
            resolve: mode === 'required' ? undefined : resolveCommon
          },
          create: {
            arg: arg({
              type: graphQLType,
              defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined
            }),
            resolve: resolveCreate
          },
          update: {
            arg: arg({
              type: graphQLType
            })
          },
          orderBy: {
            arg: arg({
              type: orderDirectionEnum
            })
          }
        },
        output: field({
          type: graphQLType
        })
      });
    }
    return fieldType({
      kind: 'scalar',
      scalar: 'String',
      ...commonDbFieldConfig
    })({
      ...commonConfig,
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: String$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].String[mode]
          }),
          resolve: mode === 'required' ? undefined : resolveString
        },
        create: {
          arg: arg({
            type: String$3,
            defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined
          }),
          resolve: resolveCreate
        },
        update: {
          arg: arg({
            type: String$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: String$3
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
    return fieldType({
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
          arg: arg({
            type: String$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].String[mode]
          }),
          resolve: mode === 'required' ? undefined : resolveString
        },
        create: {
          arg: arg({
            type: String$3,
            defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined
          }),
          resolve(val) {
            if (val !== undefined) return val;
            return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
          }
        },
        update: {
          arg: arg({
            type: String$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: String$3
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
        DateTime$3.graphQLType.parseValue(defaultValue);
      } catch (err) {
        throw new Error(`${meta.listKey}.${meta.fieldKey}.defaultValue is required to be an ISO8601 date-time string such as ${new Date().toISOString()}`);
      }
    }
    const parsedDefaultValue = typeof defaultValue === 'string' ? DateTime$3.graphQLType.parseValue(defaultValue) : defaultValue;
    const {
      mode,
      validate
    } = makeValidateHook(meta, config);
    return fieldType({
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
          arg: arg({
            type: DateTime$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].DateTime[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: DateTime$3,
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
          arg: arg({
            type: DateTime$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: DateTime$3
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
  field: field$1,
  ...config
}) {
  return meta => {
    var _config$ui, _config$ui2, _config$ui3;
    const usableField = typeof field$1 === 'function' ? field$1(meta.lists) : field$1;
    const namedType = getNamedType(usableField.type.graphQLType);
    const hasRequiredArgs = usableField.args && Object.values(usableField.args).some(x => x.type.kind === 'non-null' && x.defaultValue === undefined);
    if ((!isLeafType(namedType) || hasRequiredArgs) && !((_config$ui = config.ui) !== null && _config$ui !== void 0 && _config$ui.query) && (((_config$ui2 = config.ui) === null || _config$ui2 === void 0 || (_config$ui2 = _config$ui2.itemView) === null || _config$ui2 === void 0 ? void 0 : _config$ui2.fieldMode) !== 'hidden' || ((_config$ui3 = config.ui) === null || _config$ui3 === void 0 || (_config$ui3 = _config$ui3.listView) === null || _config$ui3 === void 0 ? void 0 : _config$ui3.fieldMode) !== 'hidden')) {
      throw new Error(`The virtual field at ${meta.listKey}.${meta.fieldKey} requires a selection for the Admin UI but ui.query is unspecified and ui.listView.fieldMode and ui.itemView.fieldMode are not both set to 'hidden'.\n` + `Either set ui.query with what the Admin UI should fetch or hide the field from the Admin UI by setting ui.listView.fieldMode and ui.itemView.fieldMode to 'hidden'.\n` + `When setting ui.query, it is interpolated into a GraphQL query like this:\n` + `query {\n` + `  ${getGqlNames({
        listKey: meta.listKey,
        pluralGraphQLName: ''
      }).itemQueryName}(where: { id: "..." }) {\n` + `    ${meta.fieldKey}\${ui.query}\n` + `  }\n` + `}`);
    }
    return fieldType({
      kind: 'none'
    })({
      ...config,
      output: field({
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
        CalendarDay.graphQLType.parseValue(defaultValue);
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
    return fieldType({
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
          arg: arg({
            type: CalendarDay
          }),
          resolve: usesNativeDateType ? dateStringToDateObjectInUTC : undefined
        } : undefined,
        where: {
          arg: arg({
            type: mode === 'optional' ? CalendarDayNullableFilter : CalendarDayFilter
          }),
          resolve: usesNativeDateType ? value => commonResolveFilter(transformFilterDateStringsToDateObjects(value)) : commonResolveFilter
        },
        create: {
          arg: arg({
            type: CalendarDay,
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
          arg: arg({
            type: CalendarDay
          }),
          resolve: resolveInput
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: CalendarDay,
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
  equals: arg({
    type: CalendarDay
  }),
  in: arg({
    type: list(nonNull(CalendarDay))
  }),
  notIn: arg({
    type: list(nonNull(CalendarDay))
  }),
  lt: arg({
    type: CalendarDay
  }),
  lte: arg({
    type: CalendarDay
  }),
  gt: arg({
    type: CalendarDay
  }),
  gte: arg({
    type: CalendarDay
  }),
  not: arg({
    type: nestedType
  })
});
const CalendarDayNullableFilter = inputObject({
  name: 'CalendarDayNullableFilter',
  fields: () => filterFields(CalendarDayNullableFilter)
});
const CalendarDayFilter = inputObject({
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
      return arg({
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
    return jsonFieldTypePolyfilledForSQLite(meta.provider, {
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
          arg: arg({
            type: nonNullList(transformedConfig.graphqlType)
          }),
          resolve: resolveUpdate
        }
      },
      output: field({
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
      graphqlType: Int$3,
      options: config.options
    };
  }
  const options = config.options.map(option => {
    if (typeof option === 'string') {
      return {
        label: humanize(option),
        value: option
      };
    }
    return option;
  });
  if (config.type === 'enum') {
    const enumName = `${meta.listKey}${classify(meta.fieldKey)}Type`;
    const graphqlType = enum$1({
      name: enumName,
      values: enumValues(options.map(x => x.value))
    });
    return {
      type: 'enum',
      graphqlType,
      options
    };
  }
  return {
    type: 'string',
    graphqlType: String$3,
    options
  };
}
const nonNullList = type => list(nonNull(type));

export { bigInt, calendarDay, checkbox, decimal, file, float, image, integer, json, multiselect, password, relationship, select, text, timestamp, virtual };

import * as graphqlTsSchema from '@graphql-ts/schema';
import { bindGraphQLSchemaAPIToContext } from '@graphql-ts/schema';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Decimal as Decimal$1 } from 'decimal.js';
import { Boolean, Float, ID, Int, String, enum as enum$1, enumValues, arg, inputObject, list, nonNull, scalar } from '@graphql-ts/schema/api-without-context';
import { extend, wrap } from '@graphql-ts/extend';
import { field as field$1, fields, interface as interface$1, interfaceField, object, union } from '@graphql-ts/schema/api-with-context';

// TODO: remove when we use { graphql } from '.keystone'

const field = field$1;
// TODO: remove when we use { graphql } from '.keystone'

const JSON = graphqlTsSchema.graphql.scalar(new GraphQLScalarType({
  name: 'JSON',
  description: 'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  specifiedByURL: 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf'
  // the defaults for serialize, parseValue and parseLiteral do what makes sense for JSON
}));
const Upload = graphqlTsSchema.graphql.scalar(GraphQLUpload);

// - Decimal.js throws on invalid inputs
// - Decimal.js can represent +Infinity and -Infinity, these aren't values in Postgres' decimal,
//   NaN is but Prisma doesn't support it
//   .isFinite refers to +Infinity, -Infinity and NaN
const Decimal = graphqlTsSchema.graphql.scalar(new GraphQLScalarType({
  name: 'Decimal',
  serialize(value) {
    if (!Decimal$1.isDecimal(value)) {
      throw new GraphQLError(`unexpected value provided to Decimal scalar: ${value}`);
    }
    const cast = value;
    if (cast.scaleToPrint !== undefined) {
      return value.toFixed(cast.scaleToPrint);
    }
    return value.toString();
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') {
      throw new GraphQLError('Decimal only accepts values as strings');
    }
    const decimal = new Decimal$1(value.value);
    if (!decimal.isFinite()) {
      throw new GraphQLError('Decimal values must be finite');
    }
    return decimal;
  },
  parseValue(value) {
    if (Decimal$1.isDecimal(value)) {
      if (!value.isFinite()) {
        throw new GraphQLError('Decimal values must be finite');
      }
      return value;
    }
    if (typeof value !== 'string') {
      throw new GraphQLError('Decimal only accepts values as strings');
    }
    const decimal = new Decimal$1(value);
    if (!decimal.isFinite()) {
      throw new GraphQLError('Decimal values must be finite');
    }
    return decimal;
  }
}));
const BigInt = graphqlTsSchema.graphql.scalar(new GraphQLScalarType({
  name: 'BigInt',
  serialize(value) {
    if (typeof value !== 'bigint') throw new GraphQLError(`unexpected value provided to BigInt scalar: ${value}`);
    return value.toString();
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') throw new GraphQLError('BigInt only accepts values as strings');
    return globalThis.BigInt(value.value);
  },
  parseValue(value) {
    if (typeof value === 'bigint') return value;
    if (typeof value !== 'string') throw new GraphQLError('BigInt only accepts values as strings');
    return globalThis.BigInt(value);
  }
}));

// from https://github.com/excitement-engineer/graphql-iso-date/blob/master/src/utils/validator.js#L121
// this is also what prisma uses https://github.com/prisma/prisma/blob/20b58fe65d581bcb43c0d5c28d4b89cabc2d99b2/packages/client/src/runtime/utils/common.ts#L126-L128
const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
function parseDate(input) {
  if (!RFC_3339_REGEX.test(input)) {
    throw new GraphQLError('DateTime scalars must be in the form of a full ISO 8601 date-time string');
  }
  const parsed = new Date(input);
  if (isNaN(parsed.valueOf())) {
    throw new GraphQLError('DateTime scalars must be in the form of a full ISO 8601 date-time string');
  }
  return parsed;
}
const DateTime = graphqlTsSchema.graphql.scalar(new GraphQLScalarType({
  name: 'DateTime',
  specifiedByURL: 'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6',
  serialize(value) {
    if (!(value instanceof Date) || isNaN(value.valueOf())) {
      throw new GraphQLError(`unexpected value provided to DateTime scalar: ${value}`);
    }
    return value.toISOString();
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') {
      throw new GraphQLError('DateTime only accepts values as strings');
    }
    return parseDate(value.value);
  },
  parseValue(value) {
    if (value instanceof Date) return value;
    if (typeof value !== 'string') {
      throw new GraphQLError('DateTime only accepts values as strings');
    }
    return parseDate(value);
  }
}));
const RFC_3339_FULL_DATE_REGEX = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
function validateCalendarDay(input) {
  if (!RFC_3339_FULL_DATE_REGEX.test(input)) {
    throw new GraphQLError('CalendarDay scalars must be in the form of a full-date ISO 8601 string');
  }
}
const CalendarDay = graphqlTsSchema.graphql.scalar(new GraphQLScalarType({
  name: 'CalendarDay',
  specifiedByURL: 'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6',
  serialize(value) {
    if (typeof value !== 'string') {
      throw new GraphQLError(`unexpected value provided to CalendarDay scalar: ${value}`);
    }
    return value;
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') {
      throw new GraphQLError('CalendarDay only accepts values as strings');
    }
    validateCalendarDay(value.value);
    return value.value;
  },
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new GraphQLError('CalendarDay only accepts values as strings');
    }
    validateCalendarDay(value);
    return value;
  }
}));
const Empty = graphqlTsSchema.graphql.scalar(new GraphQLScalarType({
  name: 'Empty',
  serialize(value) {
    return null;
  },
  parseLiteral(value) {
    return {};
  },
  parseValue(value) {
    return {};
  }
}));

var graphqlBoundToKeystoneContext = /*#__PURE__*/Object.freeze({
  __proto__: null,
  field: field,
  JSON: JSON,
  Upload: Upload,
  Decimal: Decimal,
  BigInt: BigInt,
  DateTime: DateTime,
  CalendarDay: CalendarDay,
  Empty: Empty,
  Boolean: Boolean,
  Float: Float,
  ID: ID,
  Int: Int,
  String: String,
  'enum': enum$1,
  enumValues: enumValues,
  arg: arg,
  inputObject: inputObject,
  list: list,
  nonNull: nonNull,
  scalar: scalar,
  bindGraphQLSchemaAPIToContext: bindGraphQLSchemaAPIToContext,
  extend: extend,
  wrap: wrap,
  fields: fields,
  'interface': interface$1,
  interfaceField: interfaceField,
  object: object,
  union: union
});

export { BigInt as B, CalendarDay as C, DateTime as D, Empty as E, JSON as J, Upload as U, Decimal as a, field as f, graphqlBoundToKeystoneContext as g };

'use strict';

var graphqlTsSchema = require('@graphql-ts/schema');
var GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
var graphql = require('graphql');
var Decimal$1 = require('decimal.js');
var apiWithoutContext = require('@graphql-ts/schema/api-without-context');
var extend = require('@graphql-ts/extend');
var apiWithContext = require('@graphql-ts/schema/api-with-context');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var graphqlTsSchema__namespace = /*#__PURE__*/_interopNamespace(graphqlTsSchema);
var GraphQLUpload__default = /*#__PURE__*/_interopDefault(GraphQLUpload);

// TODO: remove when we use { graphql } from '.keystone'

const field = apiWithContext.field;
// TODO: remove when we use { graphql } from '.keystone'

const JSON = graphqlTsSchema__namespace.graphql.scalar(new graphql.GraphQLScalarType({
  name: 'JSON',
  description: 'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  specifiedByURL: 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf'
  // the defaults for serialize, parseValue and parseLiteral do what makes sense for JSON
}));
const Upload = graphqlTsSchema__namespace.graphql.scalar(GraphQLUpload__default["default"]);

// - Decimal.js throws on invalid inputs
// - Decimal.js can represent +Infinity and -Infinity, these aren't values in Postgres' decimal,
//   NaN is but Prisma doesn't support it
//   .isFinite refers to +Infinity, -Infinity and NaN
const Decimal = graphqlTsSchema__namespace.graphql.scalar(new graphql.GraphQLScalarType({
  name: 'Decimal',
  serialize(value) {
    if (!Decimal$1.Decimal.isDecimal(value)) {
      throw new graphql.GraphQLError(`unexpected value provided to Decimal scalar: ${value}`);
    }
    const cast = value;
    if (cast.scaleToPrint !== undefined) {
      return value.toFixed(cast.scaleToPrint);
    }
    return value.toString();
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') {
      throw new graphql.GraphQLError('Decimal only accepts values as strings');
    }
    const decimal = new Decimal$1.Decimal(value.value);
    if (!decimal.isFinite()) {
      throw new graphql.GraphQLError('Decimal values must be finite');
    }
    return decimal;
  },
  parseValue(value) {
    if (Decimal$1.Decimal.isDecimal(value)) {
      if (!value.isFinite()) {
        throw new graphql.GraphQLError('Decimal values must be finite');
      }
      return value;
    }
    if (typeof value !== 'string') {
      throw new graphql.GraphQLError('Decimal only accepts values as strings');
    }
    const decimal = new Decimal$1.Decimal(value);
    if (!decimal.isFinite()) {
      throw new graphql.GraphQLError('Decimal values must be finite');
    }
    return decimal;
  }
}));
const BigInt = graphqlTsSchema__namespace.graphql.scalar(new graphql.GraphQLScalarType({
  name: 'BigInt',
  serialize(value) {
    if (typeof value !== 'bigint') throw new graphql.GraphQLError(`unexpected value provided to BigInt scalar: ${value}`);
    return value.toString();
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') throw new graphql.GraphQLError('BigInt only accepts values as strings');
    return globalThis.BigInt(value.value);
  },
  parseValue(value) {
    if (typeof value === 'bigint') return value;
    if (typeof value !== 'string') throw new graphql.GraphQLError('BigInt only accepts values as strings');
    return globalThis.BigInt(value);
  }
}));

// from https://github.com/excitement-engineer/graphql-iso-date/blob/master/src/utils/validator.js#L121
// this is also what prisma uses https://github.com/prisma/prisma/blob/20b58fe65d581bcb43c0d5c28d4b89cabc2d99b2/packages/client/src/runtime/utils/common.ts#L126-L128
const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
function parseDate(input) {
  if (!RFC_3339_REGEX.test(input)) {
    throw new graphql.GraphQLError('DateTime scalars must be in the form of a full ISO 8601 date-time string');
  }
  const parsed = new Date(input);
  if (isNaN(parsed.valueOf())) {
    throw new graphql.GraphQLError('DateTime scalars must be in the form of a full ISO 8601 date-time string');
  }
  return parsed;
}
const DateTime = graphqlTsSchema__namespace.graphql.scalar(new graphql.GraphQLScalarType({
  name: 'DateTime',
  specifiedByURL: 'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6',
  serialize(value) {
    if (!(value instanceof Date) || isNaN(value.valueOf())) {
      throw new graphql.GraphQLError(`unexpected value provided to DateTime scalar: ${value}`);
    }
    return value.toISOString();
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') {
      throw new graphql.GraphQLError('DateTime only accepts values as strings');
    }
    return parseDate(value.value);
  },
  parseValue(value) {
    if (value instanceof Date) return value;
    if (typeof value !== 'string') {
      throw new graphql.GraphQLError('DateTime only accepts values as strings');
    }
    return parseDate(value);
  }
}));
const RFC_3339_FULL_DATE_REGEX = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
function validateCalendarDay(input) {
  if (!RFC_3339_FULL_DATE_REGEX.test(input)) {
    throw new graphql.GraphQLError('CalendarDay scalars must be in the form of a full-date ISO 8601 string');
  }
}
const CalendarDay = graphqlTsSchema__namespace.graphql.scalar(new graphql.GraphQLScalarType({
  name: 'CalendarDay',
  specifiedByURL: 'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6',
  serialize(value) {
    if (typeof value !== 'string') {
      throw new graphql.GraphQLError(`unexpected value provided to CalendarDay scalar: ${value}`);
    }
    return value;
  },
  parseLiteral(value) {
    if (value.kind !== 'StringValue') {
      throw new graphql.GraphQLError('CalendarDay only accepts values as strings');
    }
    validateCalendarDay(value.value);
    return value.value;
  },
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new graphql.GraphQLError('CalendarDay only accepts values as strings');
    }
    validateCalendarDay(value);
    return value;
  }
}));
const Empty = graphqlTsSchema__namespace.graphql.scalar(new graphql.GraphQLScalarType({
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
  Boolean: apiWithoutContext.Boolean,
  Float: apiWithoutContext.Float,
  ID: apiWithoutContext.ID,
  Int: apiWithoutContext.Int,
  String: apiWithoutContext.String,
  'enum': apiWithoutContext["enum"],
  enumValues: apiWithoutContext.enumValues,
  arg: apiWithoutContext.arg,
  inputObject: apiWithoutContext.inputObject,
  list: apiWithoutContext.list,
  nonNull: apiWithoutContext.nonNull,
  scalar: apiWithoutContext.scalar,
  bindGraphQLSchemaAPIToContext: graphqlTsSchema.bindGraphQLSchemaAPIToContext,
  extend: extend.extend,
  wrap: extend.wrap,
  fields: apiWithContext.fields,
  'interface': apiWithContext["interface"],
  interfaceField: apiWithContext.interfaceField,
  object: apiWithContext.object,
  union: apiWithContext.union
});

exports.BigInt = BigInt;
exports.CalendarDay = CalendarDay;
exports.DateTime = DateTime;
exports.Decimal = Decimal;
exports.Empty = Empty;
exports.JSON = JSON;
exports.Upload = Upload;
exports.field = field;
exports.graphqlBoundToKeystoneContext = graphqlBoundToKeystoneContext;

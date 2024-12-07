'use strict';

var pluralize = require('pluralize');
require('decimal.js');
require('./graphql-ts-schema-73069614.cjs.dev.js');
var apiWithoutContext = require('@graphql-ts/schema/api-without-context');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var pluralize__default = /*#__PURE__*/_interopDefault(pluralize);

/**
 * Turns a passed in string into
 * a human readable label
 * @param {String} str The string to convert.
 * @returns The new string
 */
function humanize(str) {
  return str.replace(/([a-z])([A-Z]+)/g, '$1 $2').split(/\s|_|-/).filter(i => i).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
}

// WARNING: may break in patch

function getGqlNames({
  listKey,
  pluralGraphQLName
}) {
  const lowerPluralName = pluralGraphQLName.charAt(0).toLowerCase() + pluralGraphQLName.slice(1);
  const lowerSingularName = listKey.charAt(0).toLowerCase() + listKey.slice(1);
  return {
    outputTypeName: listKey,
    whereInputName: `${listKey}WhereInput`,
    whereUniqueInputName: `${listKey}WhereUniqueInput`,
    // create
    createInputName: `${listKey}CreateInput`,
    createMutationName: `create${listKey}`,
    createManyMutationName: `create${pluralGraphQLName}`,
    relateToOneForCreateInputName: `${listKey}RelateToOneForCreateInput`,
    relateToManyForCreateInputName: `${listKey}RelateToManyForCreateInput`,
    // read
    itemQueryName: lowerSingularName,
    listQueryName: lowerPluralName,
    listQueryCountName: `${lowerPluralName}Count`,
    listOrderName: `${listKey}OrderByInput`,
    // update
    updateInputName: `${listKey}UpdateInput`,
    updateMutationName: `update${listKey}`,
    updateManyInputName: `${listKey}UpdateArgs`,
    updateManyMutationName: `update${pluralGraphQLName}`,
    relateToOneForUpdateInputName: `${listKey}RelateToOneForUpdateInput`,
    relateToManyForUpdateInputName: `${listKey}RelateToManyForUpdateInput`,
    // delete
    deleteMutationName: `delete${listKey}`,
    deleteManyMutationName: `delete${pluralGraphQLName}`
  };
}
const labelToPath = str => str.split(' ').join('-').toLowerCase();
const labelToClass = str => str.replace(/\s+/g, '');

// WARNING: may break in patch
function __getNames(listKey, list) {
  const {
    graphql,
    ui,
    isSingleton
  } = list;
  if ((ui === null || ui === void 0 ? void 0 : ui.path) !== undefined && !/^[a-z-_][a-z0-9-_]*$/.test(ui.path)) {
    throw new Error(`ui.path for ${listKey} is ${ui.path} but it must only contain lowercase letters, numbers, dashes, and underscores and not start with a number`);
  }
  const computedSingular = humanize(listKey);
  const computedPlural = pluralize__default["default"].plural(computedSingular);
  const computedLabel = isSingleton ? computedSingular : computedPlural;
  const path = (ui === null || ui === void 0 ? void 0 : ui.path) || labelToPath(computedLabel);
  const pluralGraphQLName = (graphql === null || graphql === void 0 ? void 0 : graphql.plural) || labelToClass(computedPlural);
  if (pluralGraphQLName === listKey) {
    throw new Error(`The list key and the plural name used in GraphQL must be different but the list key ${listKey} is the same as the plural GraphQL name, please specify graphql.plural`);
  }
  return {
    graphql: {
      names: getGqlNames({
        listKey,
        pluralGraphQLName
      }),
      namePlural: pluralGraphQLName
    },
    ui: {
      labels: {
        label: (ui === null || ui === void 0 ? void 0 : ui.label) || computedLabel,
        singular: (ui === null || ui === void 0 ? void 0 : ui.singular) || computedSingular,
        plural: (ui === null || ui === void 0 ? void 0 : ui.plural) || computedPlural,
        path
      }
    }
  };
}

const orderDirectionEnum = apiWithoutContext["enum"]({
  name: 'OrderDirection',
  values: apiWithoutContext.enumValues(['asc', 'desc'])
});
const QueryMode = apiWithoutContext["enum"]({
  name: 'QueryMode',
  values: apiWithoutContext.enumValues(['default', 'insensitive'])
});

// TODO: merge

// TODO: this isn't right for create
// for create though, db level defaults need to be taken into account for when to not allow undefined

// fieldType(dbField)(fieldInfo) => { ...fieldInfo, dbField };
function fieldType(dbField) {
  return function fieldTypeWrapper(graphQLInfo) {
    return {
      ...graphQLInfo,
      dbField
    };
  };
}

exports.QueryMode = QueryMode;
exports.__getNames = __getNames;
exports.fieldType = fieldType;
exports.getGqlNames = getGqlNames;
exports.humanize = humanize;
exports.orderDirectionEnum = orderDirectionEnum;

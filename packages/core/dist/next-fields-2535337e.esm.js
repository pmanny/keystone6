import pluralize from 'pluralize';
import 'decimal.js';
import './graphql-ts-schema-5ba48382.esm.js';
import { enum as enum$1, enumValues } from '@graphql-ts/schema/api-without-context';

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
  const computedPlural = pluralize.plural(computedSingular);
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

const orderDirectionEnum = enum$1({
  name: 'OrderDirection',
  values: enumValues(['asc', 'desc'])
});
const QueryMode = enum$1({
  name: 'QueryMode',
  values: enumValues(['default', 'insensitive'])
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

export { QueryMode as Q, __getNames as _, fieldType as f, getGqlNames as g, humanize as h, orderDirectionEnum as o };

'use strict';

var graphql = require('graphql');
var path = require('node:path');
var nextFields = require('./next-fields-c62a31f4.cjs.dev.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);

const userInputError = msg => new graphql.GraphQLError(`Input error: ${msg}`, {
  extensions: {
    code: 'KS_USER_INPUT_ERROR'
  }
});
const accessDeniedError = msg => new graphql.GraphQLError(`Access denied: ${msg}`, {
  extensions: {
    code: 'KS_ACCESS_DENIED'
  }
});
const validationFailureError = messages => {
  const s = messages.map(m => `  - ${m}`).join('\n');
  return new graphql.GraphQLError(`You provided invalid data for this operation.\n${s}`, {
    extensions: {
      code: 'KS_VALIDATION_FAILURE'
    }
  });
};
const extensionError = (extension, things) => {
  const s = things.map(t => `  - ${t.tag}: ${t.error.message}`).join('\n');
  return new graphql.GraphQLError(`An error occurred while running "${extension}".\n${s}`, {
    extensions: {
      code: 'KS_EXTENSION_ERROR',
      debug: things.map(t => ({
        stacktrace: t.error.stack,
        message: t.error.message
      }))
    }
  });
};
const resolverError = things => {
  const s = things.map(t => `  - ${t.tag}: ${t.error.message}`).join('\n');
  return new graphql.GraphQLError(`An error occurred while resolving input fields.\n${s}`, {
    extensions: {
      code: 'KS_RESOLVER_ERROR',
      debug: things.map(t => ({
        stacktrace: t.error.stack,
        message: t.error.message
      }))
    }
  });
};
const relationshipError = things => {
  const s = things.map(t => `  - ${t.tag}: ${t.error.message}`).sort().join('\n');
  return new graphql.GraphQLError(`An error occurred while resolving relationship fields.\n${s}`, {
    extensions: {
      code: 'KS_RELATIONSHIP_ERROR',
      debug: things.map(t => ({
        stacktrace: t.error.stack,
        message: t.error.message
      }))
    }
  });
};
const accessReturnError = things => {
  const s = things.map(t => `  - ${t.tag}: Returned: ${t.returned}. Expected: boolean.`).join('\n');
  return new graphql.GraphQLError(`Invalid values returned from access control function.\n${s}`, {
    extensions: {
      code: 'KS_ACCESS_RETURN_ERROR'
    }
  });
};
const limitsExceededError = args => new graphql.GraphQLError('Your request exceeded server limits', {
  extensions: {
    code: 'KS_LIMITS_EXCEEDED'
  }
});
const filterAccessError = ({
  operation,
  fieldKeys
}) => new graphql.GraphQLError(`You do not have access to perform '${operation}' operations on the fields ${JSON.stringify(fieldKeys)}.`, {
  extensions: {
    code: 'KS_FILTER_DENIED'
  }
});

function createAdminMeta(config, initialisedLists) {
  var _config$ui;
  const {
    lists
  } = config;
  const adminMetaRoot = {
    listsByKey: {},
    lists: [],
    views: [],
    isAccessAllowed: (_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.isAccessAllowed
  };
  const omittedLists = [];
  for (const [listKey, list] of Object.entries(initialisedLists)) {
    var _listConfig$ui, _listConfig$ui2, _listConfig$ui$listVi, _listConfig$ui3, _list$graphql$types$f, _ref, _listConfig$ui$descri, _listConfig$ui4, _ref2, _listConfig$ui5, _listConfig$ui$hideCr, _listConfig$ui6, _listConfig$ui$hideDe, _listConfig$ui7, _listConfig$ui$isHidd, _listConfig$ui8;
    const listConfig = lists[listKey];

    // TODO: is this reasonable?
    if (list.graphql.isEnabled.query === false) {
      omittedLists.push(listKey);
      continue;
    }
    let initialColumns;
    if ((_listConfig$ui = listConfig.ui) !== null && _listConfig$ui !== void 0 && (_listConfig$ui = _listConfig$ui.listView) !== null && _listConfig$ui !== void 0 && _listConfig$ui.initialColumns) {
      // if they've asked for a particular thing, give them that thing
      initialColumns = listConfig.ui.listView.initialColumns;
    } else {
      // otherwise, we'll start with the labelfield on the left and then add
      // 2 more fields to the right of that. We don't include the 'id' field
      // unless it happened to be the labelField
      initialColumns = [list.ui.labelField, ...Object.keys(list.fields).filter(fieldKey => list.fields[fieldKey].graphql.isEnabled.read).filter(fieldKey => fieldKey !== list.ui.labelField).filter(fieldKey => fieldKey !== 'id')].slice(0, 3);
    }
    let initialSearchFields = (_listConfig$ui2 = listConfig.ui) === null || _listConfig$ui2 === void 0 || (_listConfig$ui2 = _listConfig$ui2.searchFields) === null || _listConfig$ui2 === void 0 ? void 0 : _listConfig$ui2.concat();
    if (!initialSearchFields) {
      initialSearchFields = [...list.ui.searchableFields.keys()];
    }
    const maximumPageSize = Math.min((_listConfig$ui$listVi = (_listConfig$ui3 = listConfig.ui) === null || _listConfig$ui3 === void 0 || (_listConfig$ui3 = _listConfig$ui3.listView) === null || _listConfig$ui3 === void 0 ? void 0 : _listConfig$ui3.pageSize) !== null && _listConfig$ui$listVi !== void 0 ? _listConfig$ui$listVi : 50, (_list$graphql$types$f = list.graphql.types.findManyArgs.take.defaultValue) !== null && _list$graphql$types$f !== void 0 ? _list$graphql$types$f : Infinity);
    adminMetaRoot.listsByKey[listKey] = {
      key: listKey,
      path: list.ui.labels.path,
      description: (_ref = (_listConfig$ui$descri = (_listConfig$ui4 = listConfig.ui) === null || _listConfig$ui4 === void 0 ? void 0 : _listConfig$ui4.description) !== null && _listConfig$ui$descri !== void 0 ? _listConfig$ui$descri : listConfig.description) !== null && _ref !== void 0 ? _ref : null,
      label: list.ui.labels.label,
      labelField: list.ui.labelField,
      singular: list.ui.labels.singular,
      plural: list.ui.labels.plural,
      fields: [],
      fieldsByKey: {},
      groups: [],
      graphql: {
        names: list.graphql.names
      },
      pageSize: maximumPageSize,
      initialColumns,
      initialSearchFields,
      initialSort: (_ref2 = (_listConfig$ui5 = listConfig.ui) === null || _listConfig$ui5 === void 0 || (_listConfig$ui5 = _listConfig$ui5.listView) === null || _listConfig$ui5 === void 0 ? void 0 : _listConfig$ui5.initialSort) !== null && _ref2 !== void 0 ? _ref2 : null,
      isSingleton: list.isSingleton,
      // TODO: probably remove this
      itemQueryName: listKey,
      listQueryName: list.graphql.namePlural,
      // TODO: remove

      hideCreate: normalizeMaybeSessionFunction((_listConfig$ui$hideCr = (_listConfig$ui6 = listConfig.ui) === null || _listConfig$ui6 === void 0 ? void 0 : _listConfig$ui6.hideCreate) !== null && _listConfig$ui$hideCr !== void 0 ? _listConfig$ui$hideCr : !list.graphql.isEnabled.create),
      hideDelete: normalizeMaybeSessionFunction((_listConfig$ui$hideDe = (_listConfig$ui7 = listConfig.ui) === null || _listConfig$ui7 === void 0 ? void 0 : _listConfig$ui7.hideDelete) !== null && _listConfig$ui$hideDe !== void 0 ? _listConfig$ui$hideDe : !list.graphql.isEnabled.delete),
      isHidden: normalizeMaybeSessionFunction((_listConfig$ui$isHidd = (_listConfig$ui8 = listConfig.ui) === null || _listConfig$ui8 === void 0 ? void 0 : _listConfig$ui8.isHidden) !== null && _listConfig$ui$isHidd !== void 0 ? _listConfig$ui$isHidd : false)
    };
    adminMetaRoot.lists.push(adminMetaRoot.listsByKey[listKey]);
  }
  let uniqueViewCount = -1;
  const stringViewsToIndex = {};
  function getViewId(view) {
    if (stringViewsToIndex[view] !== undefined) return stringViewsToIndex[view];
    uniqueViewCount++;
    stringViewsToIndex[view] = uniqueViewCount;
    adminMetaRoot.views.push(view);
    return uniqueViewCount;
  }

  // populate .fields array
  for (const [listKey, list] of Object.entries(initialisedLists)) {
    if (omittedLists.includes(listKey)) continue;
    for (const [fieldKey, field] of Object.entries(list.fields)) {
      var _field$ui$label, _field$ui$description, _list$ui$searchableFi, _field$input, _field$input2;
      // if the field is a relationship field and is related to an omitted list, skip.
      if (field.dbField.kind === 'relation' && omittedLists.includes(field.dbField.list)) continue;
      if (Object.values(field.graphql.isEnabled).every(x => x === false)) continue;
      assertValidView(field.views, `The \`views\` on the implementation of the field type at lists.${listKey}.fields.${fieldKey}`);
      const baseOrderFilterArgs = {
        fieldKey,
        listKey: list.listKey
      };
      const isNonNull = ['read', 'create', 'update'].filter(operation => field.graphql.isNonNull[operation]);
      const fieldMeta = {
        key: fieldKey,
        label: (_field$ui$label = field.ui.label) !== null && _field$ui$label !== void 0 ? _field$ui$label : nextFields.humanize(fieldKey),
        description: (_field$ui$description = field.ui.description) !== null && _field$ui$description !== void 0 ? _field$ui$description : null,
        viewsIndex: getViewId(field.views),
        customViewsIndex: field.ui.views === null ? null : (assertValidView(field.views, `lists.${listKey}.fields.${fieldKey}.ui.views`), getViewId(field.ui.views)),
        fieldMeta: null,
        listKey: listKey,
        search: (_list$ui$searchableFi = list.ui.searchableFields.get(fieldKey)) !== null && _list$ui$searchableFi !== void 0 ? _list$ui$searchableFi : null,
        createView: {
          fieldMode: normalizeMaybeSessionFunction(field.ui.createView.fieldMode)
        },
        itemView: {
          fieldMode: field.ui.itemView.fieldMode,
          fieldPosition: field.ui.itemView.fieldPosition
        },
        listView: {
          fieldMode: normalizeMaybeSessionFunction(field.ui.listView.fieldMode)
        },
        isFilterable: normalizeIsOrderFilter((_field$input = field.input) !== null && _field$input !== void 0 && _field$input.where ? field.graphql.isEnabled.filter : false, baseOrderFilterArgs),
        isOrderable: normalizeIsOrderFilter((_field$input2 = field.input) !== null && _field$input2 !== void 0 && _field$input2.orderBy ? field.graphql.isEnabled.orderBy : false, baseOrderFilterArgs),
        isNonNull,
        // TODO: deprecated, remove in breaking change
        path: fieldKey
      };
      adminMetaRoot.listsByKey[listKey].fields.push(fieldMeta);
      adminMetaRoot.listsByKey[listKey].fieldsByKey[fieldKey] = fieldMeta;
    }
    for (const group of list.groups) {
      adminMetaRoot.listsByKey[listKey].groups.push({
        label: group.label,
        description: group.description,
        fields: group.fields.map(fieldKey => adminMetaRoot.listsByKey[listKey].fieldsByKey[fieldKey])
      });
    }
  }

  // we do this seperately to the above so that fields can check other fields to validate their config or etc.
  // (ofc they won't necessarily be able to see other field's fieldMeta)
  for (const [key, list] of Object.entries(initialisedLists)) {
    if (list.graphql.isEnabled.query === false) continue;
    for (const fieldMetaRootVal of adminMetaRoot.listsByKey[key].fields) {
      // if the field is a relationship field and is related to an omitted list, skip.
      const dbField = list.fields[fieldMetaRootVal.path].dbField;
      if (dbField.kind === 'relation' && omittedLists.includes(dbField.list)) continue;
      currentAdminMeta = adminMetaRoot;
      try {
        var _list$fields$fieldMet, _list$fields$fieldMet2, _list$fields$fieldMet3;
        fieldMetaRootVal.fieldMeta = (_list$fields$fieldMet = (_list$fields$fieldMet2 = (_list$fields$fieldMet3 = list.fields[fieldMetaRootVal.path]).getAdminMeta) === null || _list$fields$fieldMet2 === void 0 ? void 0 : _list$fields$fieldMet2.call(_list$fields$fieldMet3)) !== null && _list$fields$fieldMet !== void 0 ? _list$fields$fieldMet : null;
      } finally {
        currentAdminMeta = undefined;
      }
    }
  }
  return adminMetaRoot;
}
let currentAdminMeta;
function getAdminMetaForRelationshipField() {
  if (currentAdminMeta === undefined) {
    throw new Error('unexpected call to getAdminMetaInRelationshipField');
  }
  return currentAdminMeta;
}
function assertValidView(view, location) {
  if (view.includes('\\')) {
    throw new Error(`${location} contains a backslash, which is invalid. You need to use a module path that is resolved from where 'keystone start' is run (see https://github.com/keystonejs/keystone/pull/7805)`);
  }
  if (path__default["default"].isAbsolute(view)) {
    throw new Error(`${location} is an absolute path, which is invalid. You need to use a module path that is resolved from where 'keystone start' is run (see https://github.com/keystonejs/keystone/pull/7805)`);
  }
}
function normalizeMaybeSessionFunction(input) {
  if (typeof input !== 'function') {
    return () => input;
  }
  return context => input({
    context,
    session: context.session
  });
}
function normalizeIsOrderFilter(input, baseOrderFilterArgs) {
  if (typeof input !== 'function') {
    return () => input;
  }
  return context => input({
    context,
    session: context.session,
    ...baseOrderFilterArgs
  });
}

exports.accessDeniedError = accessDeniedError;
exports.accessReturnError = accessReturnError;
exports.createAdminMeta = createAdminMeta;
exports.extensionError = extensionError;
exports.filterAccessError = filterAccessError;
exports.getAdminMetaForRelationshipField = getAdminMetaForRelationshipField;
exports.limitsExceededError = limitsExceededError;
exports.relationshipError = relationshipError;
exports.resolverError = resolverError;
exports.userInputError = userInputError;
exports.validationFailureError = validationFailureError;

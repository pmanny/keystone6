'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var copyToClipboard = require('clipboard-copy');
var router = require('next/router');
var React = require('react');
var button = require('@keystone-ui/button');
var core = require('@keystone-ui/core');
var loading = require('@keystone-ui/loading');
var ClipboardIcon = require('@keystone-ui/icons/icons/ClipboardIcon');
var modals = require('@keystone-ui/modals');
var notice = require('@keystone-ui/notice');
var toast = require('@keystone-ui/toast');
var tooltip = require('@keystone-ui/tooltip');
var fields = require('@keystone-ui/fields');
var dataGetter = require('../../../../../dist/dataGetter-2824eb60.cjs.prod.js');
var Fields = require('../../../../../dist/Fields-7213b21d.cjs.prod.js');
require('../../../../../dist/getRootGraphQLFieldsFromFieldController-96ccad4c.cjs.prod.js');
var useInvalidFields = require('../../../../../dist/useInvalidFields-e3821cb3.cjs.prod.js');
var client = require('@apollo/client');
var adminUi_context_dist_keystone6CoreAdminUiContext = require('../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.cjs.prod.js');
var PageContainer = require('../../../../../dist/PageContainer-ec7caac3.cjs.prod.js');
var GraphQLErrorNotice = require('../../../../../dist/GraphQLErrorNotice-1318ffa7.cjs.prod.js');
var usePreventNavigation = require('../../../../../dist/usePreventNavigation-aa803184.cjs.prod.js');
var CreateButtonLink = require('../../../../../dist/CreateButtonLink-2e6a33e1.cjs.prod.js');
var common = require('../../../../../dist/common-9baa5f82.cjs.prod.js');
require('@emotion/weak-memoize');
require('graphql');
require('fast-deep-equal');
require('apollo-upload-client');
require('@emotion/hash');
require('../../../../../dist/admin-meta-graphql-ea267ea5.cjs.prod.js');
require('@keystone-ui/icons');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.prod.js');
require('next/link');
require('next/head');
require('../../../../../dist/SignoutButton-777de56f.cjs.prod.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var copyToClipboard__default = /*#__PURE__*/_interopDefault(copyToClipboard);

function useEventCallback(callback) {
  const callbackRef = React.useRef(callback);
  const cb = React.useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  return cb;
}
function ItemForm({
  listKey,
  itemGetter,
  selectedFields,
  fieldModes,
  fieldPositions,
  showDelete,
  item
}) {
  var _useMemo, _state$item$data, _state$item$data2;
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(listKey);
  const {
    spacing,
    typography
  } = core.useTheme();
  const [update, {
    loading,
    error,
    data
  }] = client.useMutation(client.gql`mutation ($data: ${list.gqlNames.updateInputName}!, $id: ID!) {
      item: ${list.gqlNames.updateMutationName}(where: { id: $id }, data: $data) {
        ${selectedFields}
      }
    }`, {
    errorPolicy: 'all'
  });
  itemGetter = (_useMemo = React.useMemo(() => {
    if (data) {
      return dataGetter.makeDataGetter(data, error === null || error === void 0 ? void 0 : error.graphQLErrors).get('item');
    }
  }, [data, error])) !== null && _useMemo !== void 0 ? _useMemo : itemGetter;
  const [state, setValue] = React.useState(() => {
    const value = useInvalidFields.deserializeValue(list.fields, itemGetter);
    return {
      value,
      item: itemGetter
    };
  });
  if (!loading && state.item.data !== itemGetter.data && (itemGetter.errors || []).every(x => {
    var _x$path;
    return ((_x$path = x.path) === null || _x$path === void 0 ? void 0 : _x$path.length) !== 1;
  })) {
    const value = useInvalidFields.deserializeValue(list.fields, itemGetter);
    setValue({
      value,
      item: itemGetter
    });
  }
  const {
    changedFields,
    dataForUpdate
  } = useInvalidFields.useChangedFieldsAndDataForUpdate(list.fields, state.item, state.value);
  const invalidFields = useInvalidFields.useInvalidFields(list.fields, state.value);
  const [forceValidation, setForceValidation] = React.useState(false);
  const toasts = toast.useToasts();
  const onSave = useEventCallback(() => {
    const newForceValidation = invalidFields.size !== 0;
    setForceValidation(newForceValidation);
    if (newForceValidation) return;
    update({
      variables: {
        data: dataForUpdate,
        id: state.item.get('id').data
      }
    })
    // TODO -- Experimenting with less detail in the toasts, so the data lines are commented
    // out below. If we're happy with this, clean up the unused lines.
    .then(({
      /* data, */errors
    }) => {
      // we're checking for path being undefined OR path.length === 1 because errors with a path larger than 1 will
      // be field level errors which are handled seperately and do not indicate a failure to
      // update the item, path being undefined generally indicates a failure in the graphql mutation itself - ie a type error
      const error = errors === null || errors === void 0 ? void 0 : errors.find(x => {
        var _x$path2;
        return x.path === undefined || ((_x$path2 = x.path) === null || _x$path2 === void 0 ? void 0 : _x$path2.length) === 1;
      });
      if (error) {
        toasts.addToast({
          title: 'Failed to update item',
          tone: 'negative',
          message: error.message
        });
      } else {
        toasts.addToast({
          // title: data.item[list.labelField] || data.item.id,
          tone: 'positive',
          title: 'Saved successfully'
          // message: 'Saved successfully',
        });
      }
    }).catch(err => {
      toasts.addToast({
        title: 'Failed to update item',
        tone: 'negative',
        message: err.message
      });
    });
  });
  const labelFieldValue = list.isSingleton ? list.label : (_state$item$data = state.item.data) === null || _state$item$data === void 0 ? void 0 : _state$item$data[list.labelField];
  const itemId = (_state$item$data2 = state.item.data) === null || _state$item$data2 === void 0 ? void 0 : _state$item$data2.id;
  const hasChangedFields = !!changedFields.size;
  usePreventNavigation.usePreventNavigation(React.useMemo(() => ({
    current: hasChangedFields
  }), [hasChangedFields]));
  return core.jsx(React.Fragment, null, core.jsx(core.Box, {
    marginTop: "xlarge"
  }, core.jsx(GraphQLErrorNotice.GraphQLErrorNotice, {
    networkError: error === null || error === void 0 ? void 0 : error.networkError
    // we're checking for path.length === 1 because errors with a path larger than 1 will be field level errors
    // which are handled seperately and do not indicate a failure to update the item
    ,
    errors: error === null || error === void 0 ? void 0 : error.graphQLErrors.filter(x => {
      var _x$path3;
      return ((_x$path3 = x.path) === null || _x$path3 === void 0 ? void 0 : _x$path3.length) === 1;
    })
  }), core.jsx(Fields.Fields, {
    groups: list.groups,
    fieldModes: fieldModes,
    fields: list.fields,
    forceValidation: forceValidation,
    invalidFields: invalidFields,
    position: "form",
    fieldPositions: fieldPositions,
    onChange: React.useCallback(value => {
      setValue(state => ({
        item: state.item,
        value: value(state.value)
      }));
    }, [setValue]),
    value: state.value
  }), core.jsx(Toolbar, {
    onSave: onSave,
    hasChangedFields: !!changedFields.size,
    onReset: useEventCallback(() => {
      setValue(state => ({
        item: state.item,
        value: useInvalidFields.deserializeValue(list.fields, state.item)
      }));
    }),
    loading: loading,
    deleteButton: React.useMemo(() => showDelete ? core.jsx(DeleteButton, {
      list: list,
      itemLabel: labelFieldValue !== null && labelFieldValue !== void 0 ? labelFieldValue : itemId,
      itemId: itemId
    }) : undefined, [showDelete, list, labelFieldValue, itemId])
  })), core.jsx(StickySidebar, null, core.jsx(fields.FieldLabel, null, "Item ID"), core.jsx("div", {
    css: {
      display: 'flex',
      alignItems: 'center'
    }
  }, core.jsx(fields.TextInput, {
    css: {
      marginRight: spacing.medium,
      fontFamily: typography.fontFamily.monospace,
      fontSize: typography.fontSize.small
    },
    readOnly: true,
    value: item.id
  }), core.jsx(tooltip.Tooltip, {
    content: "Copy ID"
  }, props => core.jsx(button.Button, _extends({}, props, {
    "aria-label": "Copy ID",
    onClick: () => {
      copyToClipboard__default["default"](item.id);
    }
  }), core.jsx(ClipboardIcon.ClipboardIcon, {
    size: "small"
  })))), core.jsx(core.Box, {
    marginTop: "xlarge"
  }, core.jsx(Fields.Fields, {
    groups: list.groups,
    fieldModes: fieldModes,
    fields: list.fields,
    forceValidation: forceValidation,
    invalidFields: invalidFields,
    position: "sidebar",
    fieldPositions: fieldPositions,
    onChange: React.useCallback(value => {
      setValue(state => ({
        item: state.item,
        value: value(state.value)
      }));
    }, [setValue]),
    value: state.value
  }))));
}
function DeleteButton({
  itemLabel,
  itemId,
  list
}) {
  const toasts = toast.useToasts();
  const [deleteItem, {
    loading
  }] = client.useMutation(client.gql`mutation ($id: ID!) {
      ${list.gqlNames.deleteMutationName}(where: { id: $id }) {
        id
      }
    }`, {
    variables: {
      id: itemId
    }
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const router$1 = router.useRouter();
  return core.jsx(React.Fragment, null, core.jsx(button.Button, {
    tone: "negative",
    onClick: () => {
      setIsOpen(true);
    }
  }, "Delete"), core.jsx(modals.AlertDialog
  // TODO: change the copy in the title and body of the modal
  , {
    title: "Delete Confirmation",
    isOpen: isOpen,
    tone: "negative",
    actions: {
      confirm: {
        label: 'Delete',
        action: async () => {
          try {
            await deleteItem();
          } catch (err) {
            return toasts.addToast({
              title: `Failed to delete ${list.singular} item: ${itemLabel}`,
              message: err.message,
              tone: 'negative'
            });
          }
          router$1.push(list.isSingleton ? '/' : `/${list.path}`);
          return toasts.addToast({
            title: itemLabel,
            message: `Deleted ${list.singular} item successfully`,
            tone: 'positive'
          });
        },
        loading
      },
      cancel: {
        label: 'Cancel',
        action: () => {
          setIsOpen(false);
        }
      }
    }
  }, "Are you sure you want to delete ", core.jsx("strong", null, itemLabel), "?"));
}
const getItemPage = props => () => core.jsx(ItemPage, props);
function ItemPage({
  listKey
}) {
  var _dataGetter$data2, _dataGetter$data4;
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(listKey);
  const id = router.useRouter().query.id;
  const {
    query,
    selectedFields
  } = React.useMemo(() => {
    const selectedFields = Object.entries(list.fields).filter(([fieldKey, field]) => {
      if (fieldKey === 'id') return true;
      return field.itemView.fieldMode !== 'hidden';
    }).map(([fieldKey]) => {
      return list.fields[fieldKey].controller.graphqlSelection;
    }).join('\n');
    return {
      selectedFields,
      query: client.gql`
        query ItemPage($id: ID!, $listKey: String!) {
          item: ${list.gqlNames.itemQueryName}(where: {id: $id}) {
            ${selectedFields}
          }
          keystone {
            adminMeta {
              list(key: $listKey) {
                hideCreate
                hideDelete
                fields {
                  path
                  itemView(id: $id) {
                    fieldMode
                    fieldPosition
                  }
                }
              }
            }
          }
        }
      `
    };
  }, [list]);
  const {
    data,
    error,
    loading: loading$1
  } = client.useQuery(query, {
    variables: {
      id,
      listKey
    },
    errorPolicy: 'all',
    skip: id === undefined
  });
  const dataGetter$1 = dataGetter.makeDataGetter(data, error === null || error === void 0 ? void 0 : error.graphQLErrors);
  const itemViewFieldModesByField = React.useMemo(() => {
    var _dataGetter$data;
    const itemViewFieldModesByField = {};
    (_dataGetter$data = dataGetter$1.data) === null || _dataGetter$data === void 0 || (_dataGetter$data = _dataGetter$data.keystone) === null || _dataGetter$data === void 0 || (_dataGetter$data = _dataGetter$data.adminMeta) === null || _dataGetter$data === void 0 || (_dataGetter$data = _dataGetter$data.list) === null || _dataGetter$data === void 0 || (_dataGetter$data = _dataGetter$data.fields) === null || _dataGetter$data === void 0 || _dataGetter$data.forEach(field => {
      var _field$itemView;
      if (field === null || field.path === null || (field === null || field === void 0 || (_field$itemView = field.itemView) === null || _field$itemView === void 0 ? void 0 : _field$itemView.fieldMode) == null) return;
      itemViewFieldModesByField[field.path] = field.itemView.fieldMode;
    });
    return itemViewFieldModesByField;
  }, [(_dataGetter$data2 = dataGetter$1.data) === null || _dataGetter$data2 === void 0 || (_dataGetter$data2 = _dataGetter$data2.keystone) === null || _dataGetter$data2 === void 0 || (_dataGetter$data2 = _dataGetter$data2.adminMeta) === null || _dataGetter$data2 === void 0 || (_dataGetter$data2 = _dataGetter$data2.list) === null || _dataGetter$data2 === void 0 ? void 0 : _dataGetter$data2.fields]);
  const itemViewFieldPositionsByField = React.useMemo(() => {
    var _dataGetter$data3;
    const itemViewFieldPositionsByField = {};
    (_dataGetter$data3 = dataGetter$1.data) === null || _dataGetter$data3 === void 0 || (_dataGetter$data3 = _dataGetter$data3.keystone) === null || _dataGetter$data3 === void 0 || (_dataGetter$data3 = _dataGetter$data3.adminMeta) === null || _dataGetter$data3 === void 0 || (_dataGetter$data3 = _dataGetter$data3.list) === null || _dataGetter$data3 === void 0 || (_dataGetter$data3 = _dataGetter$data3.fields) === null || _dataGetter$data3 === void 0 || _dataGetter$data3.forEach(field => {
      var _field$itemView2;
      if (field === null || field.path === null || (field === null || field === void 0 || (_field$itemView2 = field.itemView) === null || _field$itemView2 === void 0 ? void 0 : _field$itemView2.fieldPosition) == null) return;
      itemViewFieldPositionsByField[field.path] = field.itemView.fieldPosition;
    });
    return itemViewFieldPositionsByField;
  }, [(_dataGetter$data4 = dataGetter$1.data) === null || _dataGetter$data4 === void 0 || (_dataGetter$data4 = _dataGetter$data4.keystone) === null || _dataGetter$data4 === void 0 || (_dataGetter$data4 = _dataGetter$data4.adminMeta) === null || _dataGetter$data4 === void 0 || (_dataGetter$data4 = _dataGetter$data4.list) === null || _dataGetter$data4 === void 0 ? void 0 : _dataGetter$data4.fields]);
  const pageLoading = loading$1 || id === undefined;
  const metaQueryErrors = dataGetter$1.get('keystone').errors;
  const pageTitle = list.isSingleton ? list.label : pageLoading ? undefined : data && data.item && (data.item[list.labelField] || data.item.id) || id;
  return core.jsx(PageContainer.PageContainer, {
    title: pageTitle,
    header: core.jsx(common.ItemPageHeader, {
      list: list,
      label: pageLoading ? 'Loading...' : data && data.item && (data.item[list.labelField] || data.item.id) || id
    })
  }, pageLoading ? core.jsx(core.Center, {
    css: {
      height: `calc(100vh - ${PageContainer.HEADER_HEIGHT}px)`
    }
  }, core.jsx(loading.LoadingDots, {
    label: "Loading item data",
    size: "large",
    tone: "passive"
  })) : metaQueryErrors ? core.jsx(core.Box, {
    marginY: "xlarge"
  }, core.jsx(notice.Notice, {
    tone: "negative"
  }, metaQueryErrors[0].message)) : core.jsx(common.ColumnLayout, null, (data === null || data === void 0 ? void 0 : data.item) == null ? core.jsx(core.Box, {
    marginY: "xlarge"
  }, error !== null && error !== void 0 && error.graphQLErrors.length || error !== null && error !== void 0 && error.networkError ? core.jsx(GraphQLErrorNotice.GraphQLErrorNotice, {
    errors: error === null || error === void 0 ? void 0 : error.graphQLErrors,
    networkError: error === null || error === void 0 ? void 0 : error.networkError
  }) : list.isSingleton ? id === '1' ? core.jsx(core.Stack, {
    gap: "medium"
  }, core.jsx(notice.Notice, {
    tone: "negative"
  }, list.label, " doesn't exist or you don't have access to it."), !data.keystone.adminMeta.list.hideCreate && core.jsx(CreateButtonLink.CreateButtonLink, {
    list: list
  })) : core.jsx(notice.Notice, {
    tone: "negative"
  }, "The item with id \"", id, "\" does not exist") : core.jsx(notice.Notice, {
    tone: "negative"
  }, "The item with id \"", id, "\" could not be found or you don't have access to it.")) : core.jsx(React.Fragment, null, core.jsx(ItemForm, {
    fieldModes: itemViewFieldModesByField,
    fieldPositions: itemViewFieldPositionsByField,
    selectedFields: selectedFields,
    showDelete: !data.keystone.adminMeta.list.hideDelete,
    listKey: listKey,
    itemGetter: dataGetter$1.get('item'),
    item: data.item
  }))));
}

// Styled Components
// ------------------------------

const Toolbar = /*#__PURE__*/React.memo(function Toolbar({
  hasChangedFields,
  loading,
  onSave,
  onReset,
  deleteButton
}) {
  return core.jsx(common.BaseToolbar, null, core.jsx(button.Button, {
    isDisabled: !hasChangedFields,
    isLoading: loading,
    weight: "bold",
    tone: "active",
    onClick: onSave
  }, "Save changes"), core.jsx(core.Stack, {
    align: "center",
    across: true,
    gap: "small"
  }, hasChangedFields ? core.jsx(ResetChangesButton, {
    onReset: onReset
  }) : core.jsx(core.Text, {
    weight: "medium",
    paddingX: "large",
    color: "neutral600"
  }, "No changes"), deleteButton));
});
function ResetChangesButton(props) {
  const [isConfirmModalOpen, setConfirmModalOpen] = React.useState(false);
  return core.jsx(React.Fragment, null, core.jsx(button.Button, {
    weight: "none",
    onClick: () => {
      setConfirmModalOpen(true);
    }
  }, "Reset changes"), core.jsx(modals.AlertDialog, {
    actions: {
      confirm: {
        action: () => props.onReset(),
        label: 'Reset changes'
      },
      cancel: {
        action: () => setConfirmModalOpen(false),
        label: 'Cancel'
      }
    },
    isOpen: isConfirmModalOpen,
    title: "Are you sure you want to reset changes?",
    tone: "negative"
  }, null));
}
function StickySidebar(props) {
  const {
    spacing
  } = core.useTheme();
  return core.jsx("div", _extends({
    css: {
      marginTop: spacing.xlarge,
      marginBottom: spacing.xxlarge,
      position: 'sticky',
      top: spacing.xlarge
    }
  }, props));
}

exports.getItemPage = getItemPage;

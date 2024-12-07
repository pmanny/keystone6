'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var core = require('@keystone-ui/core');
var toast = require('@keystone-ui/toast');
var loading = require('@keystone-ui/loading');
var modals = require('@keystone-ui/modals');
var apolloUploadClient = require('apollo-upload-client');
var hashString = require('@emotion/hash');
var client = require('@apollo/client');
var adminMetaGraphql = require('../../../dist/admin-meta-graphql-ea267ea5.cjs.prod.js');
var dataGetter = require('../../../dist/dataGetter-2824eb60.cjs.prod.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var hashString__default = /*#__PURE__*/_interopDefault(hashString);

const expectedExports = new Set(['Cell', 'Field', 'controller', 'CardValue']);
const adminMetaLocalStorageKey = 'keystone.adminMeta';
let _mustRenderServerResult = true;
function useMustRenderServerResult() {
  const [, forceUpdate] = React.useState(0);
  React.useEffect(() => {
    _mustRenderServerResult = false;
    forceUpdate(1);
  }, []);
  if (typeof window === 'undefined') return true;
  return _mustRenderServerResult;
}
function useAdminMeta(adminMetaHash, fieldViews) {
  const adminMetaFromLocalStorage = React.useMemo(() => {
    if (typeof window === 'undefined') return;
    const item = localStorage.getItem(adminMetaLocalStorageKey);
    if (item === null) return;
    try {
      const parsed = JSON.parse(item);
      if (parsed.hash === adminMetaHash) {
        return parsed.meta;
      }
    } catch (err) {
      return;
    }
  }, [adminMetaHash]);

  // it seems like Apollo doesn't skip the first fetch when using skip: true so we're using useLazyQuery instead
  const [fetchStaticAdminMeta, {
    data,
    error,
    called
  }] = client.useLazyQuery(adminMetaGraphql.staticAdminMetaQuery, {
    fetchPolicy: 'no-cache' // TODO: something is bugged
  });
  const shouldFetchAdminMeta = adminMetaFromLocalStorage === undefined && !called;
  React.useEffect(() => {
    if (shouldFetchAdminMeta) {
      fetchStaticAdminMeta();
    }
  }, [shouldFetchAdminMeta, fetchStaticAdminMeta]);
  const runtimeAdminMeta = React.useMemo(() => {
    if ((!data || error) && !adminMetaFromLocalStorage) return undefined;
    const adminMeta = adminMetaFromLocalStorage ? adminMetaFromLocalStorage : data.keystone.adminMeta;
    const runtimeAdminMeta = {
      lists: {}
    };
    for (const list of adminMeta.lists) {
      runtimeAdminMeta.lists[list.key] = {
        ...list,
        gqlNames: list.graphql.names,
        groups: [],
        fields: {}
      };
      for (const field of list.fields) {
        var _field$itemView$field, _field$itemView, _field$itemView$field2, _field$itemView2;
        for (const exportName of expectedExports) {
          if (fieldViews[field.viewsIndex][exportName] === undefined) {
            throw new Error(`The view for the field at ${list.key}.${field.path} is missing the ${exportName} export`);
          }
        }
        Object.keys(fieldViews[field.viewsIndex]).forEach(exportName => {
          if (!expectedExports.has(exportName) && exportName !== 'allowedExportsOnCustomViews') {
            throw new Error(`Unexpected export named ${exportName} from the view from the field at ${list.key}.${field.path}`);
          }
        });
        const views = {
          ...fieldViews[field.viewsIndex]
        };
        const customViews = {};
        if (field.customViewsIndex !== null) {
          const customViewsSource = fieldViews[field.customViewsIndex];
          const allowedExportsOnCustomViews = new Set(views.allowedExportsOnCustomViews);
          Object.keys(customViewsSource).forEach(exportName => {
            if (allowedExportsOnCustomViews.has(exportName)) {
              customViews[exportName] = customViewsSource[exportName];
            } else if (expectedExports.has(exportName)) {
              views[exportName] = customViewsSource[exportName];
            } else {
              throw new Error(`Unexpected export named ${exportName} from the custom view from field at ${list.key}.${field.path}`);
            }
          });
        }
        runtimeAdminMeta.lists[list.key].fields[field.path] = {
          ...field,
          itemView: {
            fieldMode: (_field$itemView$field = (_field$itemView = field.itemView) === null || _field$itemView === void 0 ? void 0 : _field$itemView.fieldMode) !== null && _field$itemView$field !== void 0 ? _field$itemView$field : null,
            fieldPosition: (_field$itemView$field2 = (_field$itemView2 = field.itemView) === null || _field$itemView2 === void 0 ? void 0 : _field$itemView2.fieldPosition) !== null && _field$itemView$field2 !== void 0 ? _field$itemView$field2 : null
          },
          graphql: {
            isNonNull: field.isNonNull
          },
          views,
          controller: views.controller({
            listKey: list.key,
            fieldMeta: field.fieldMeta,
            label: field.label,
            description: field.description,
            path: field.path,
            customViews
          })
        };
      }
      for (const group of list.groups) {
        runtimeAdminMeta.lists[list.key].groups.push({
          label: group.label,
          description: group.description,
          fields: group.fields.map(field => runtimeAdminMeta.lists[list.key].fields[field.path])
        });
      }
    }
    if (typeof window !== 'undefined' && !adminMetaFromLocalStorage) {
      localStorage.setItem(adminMetaLocalStorageKey, JSON.stringify({
        hash: hashString__default["default"](JSON.stringify(adminMeta)),
        meta: adminMeta
      }));
    }
    return runtimeAdminMeta;
  }, [data, error, adminMetaFromLocalStorage, fieldViews]);
  const mustRenderServerResult = useMustRenderServerResult();
  if (mustRenderServerResult) {
    return {
      state: 'loading'
    };
  }
  if (runtimeAdminMeta) {
    return {
      state: 'loaded',
      value: runtimeAdminMeta
    };
  }
  if (error) {
    return {
      state: 'error',
      error,
      refetch: async () => {
        await fetchStaticAdminMeta();
      }
    };
  }
  return {
    state: 'loading'
  };
}

function useLazyMetadata(query) {
  const result = client.useQuery(query, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });
  return React.useMemo(() => {
    var _result$error, _result$error$network, _result$error2, _result$error$network2, _result$error3, _result$error$network3, _result$error4;
    const refetch = async () => {
      await result.refetch();
    };
    const dataGetter$1 = dataGetter.makeDataGetter(result.data, (_result$error = result.error) === null || _result$error === void 0 ? void 0 : _result$error.graphQLErrors);
    const authenticatedItemGetter = dataGetter$1.get('authenticatedItem');
    const keystoneMetaGetter = dataGetter$1.get('keystone');
    return {
      refetch,
      authenticatedItem: getAuthenticatedItem(result, authenticatedItemGetter.errors || ((_result$error$network = (_result$error2 = result.error) === null || _result$error2 === void 0 ? void 0 : _result$error2.networkError) !== null && _result$error$network !== void 0 ? _result$error$network : undefined)),
      visibleLists: getVisibleLists(result, keystoneMetaGetter.errors || ((_result$error$network2 = (_result$error3 = result.error) === null || _result$error3 === void 0 ? void 0 : _result$error3.networkError) !== null && _result$error$network2 !== void 0 ? _result$error$network2 : undefined)),
      createViewFieldModes: getCreateViewFieldModes(result, keystoneMetaGetter.errors || ((_result$error$network3 = (_result$error4 = result.error) === null || _result$error4 === void 0 ? void 0 : _result$error4.networkError) !== null && _result$error$network3 !== void 0 ? _result$error$network3 : undefined))
    };
  }, [result]);
}
function getCreateViewFieldModes({
  data
}, error) {
  if (error) {
    return {
      state: 'error',
      error
    };
  }
  if (data) {
    const lists = {};
    data.keystone.adminMeta.lists.forEach(list => {
      lists[list.key] = {};
      list.fields.forEach(field => {
        lists[list.key][field.path] = field.createView.fieldMode;
      });
    });
    return {
      state: 'loaded',
      lists
    };
  }
  return {
    state: 'loading'
  };
}
function getVisibleLists({
  data
}, error) {
  if (error) {
    return {
      state: 'error',
      error
    };
  }
  if (data) {
    const lists = new Set();
    data.keystone.adminMeta.lists.forEach(list => {
      if (!list.isHidden) {
        lists.add(list.key);
      }
    });
    return {
      state: 'loaded',
      lists
    };
  }
  return {
    state: 'loading'
  };
}
function getAuthenticatedItem({
  data
}, error) {
  if (error) {
    return {
      state: 'error',
      error
    };
  }
  if (data) {
    if (!data.authenticatedItem ||
    // this is for the case where there is a new type
    // in the AuthenticatedItem union and the query
    // that the admin ui has doesn't get the id
    // (yes, undefined is very specific and very intentional, it should not be checking for null)
    data.authenticatedItem.id === undefined) {
      return {
        state: 'unauthenticated'
      };
    }
    const labelField = Object.keys(data.authenticatedItem).filter(x => x !== '__typename' && x !== 'id')[0];
    return {
      state: 'authenticated',
      id: data.authenticatedItem.id,
      label: data.authenticatedItem[labelField] || data.authenticatedItem.id,
      listKey: data.authenticatedItem.__typename
    };
  }
  return {
    state: 'loading'
  };
}

const KeystoneContext = /*#__PURE__*/React.createContext(undefined);
function InternalKeystoneProvider({
  adminConfig,
  fieldViews,
  adminMetaHash,
  children,
  lazyMetadataQuery,
  apiPath
}) {
  const adminMeta = useAdminMeta(adminMetaHash, fieldViews);
  const {
    authenticatedItem,
    visibleLists,
    createViewFieldModes,
    refetch
  } = useLazyMetadata(lazyMetadataQuery);
  const reinitContext = async () => {
    var _adminMeta$refetch;
    await (adminMeta === null || adminMeta === void 0 || (_adminMeta$refetch = adminMeta.refetch) === null || _adminMeta$refetch === void 0 ? void 0 : _adminMeta$refetch.call(adminMeta));
    await refetch();
  };
  if (adminMeta.state === 'loading') {
    return /*#__PURE__*/React__default["default"].createElement(core.Center, {
      fillView: true
    }, /*#__PURE__*/React__default["default"].createElement(loading.LoadingDots, {
      label: "Loading Admin Metadata",
      size: "large"
    }));
  }
  return /*#__PURE__*/React__default["default"].createElement(toast.ToastProvider, null, /*#__PURE__*/React__default["default"].createElement(modals.DrawerProvider, null, /*#__PURE__*/React__default["default"].createElement(KeystoneContext.Provider, {
    value: {
      adminConfig,
      adminMeta,
      fieldViews,
      authenticatedItem,
      reinitContext,
      visibleLists,
      createViewFieldModes,
      apiPath
    }
  }, children)));
}
function KeystoneProvider(props) {
  const apolloClient = React.useMemo(() => new client.ApolloClient({
    cache: new client.InMemoryCache(),
    link: apolloUploadClient.createUploadLink({
      uri: props.apiPath,
      headers: {
        'Apollo-Require-Preflight': 'true'
      }
    })
  }), [props.apiPath]);
  return /*#__PURE__*/React__default["default"].createElement(client.ApolloProvider, {
    client: apolloClient
  }, /*#__PURE__*/React__default["default"].createElement(InternalKeystoneProvider, props));
}
function useKeystone() {
  const value = React.useContext(KeystoneContext);
  if (!value) throw new Error('useKeystone must be called inside a KeystoneProvider component');
  if (value.adminMeta.state === 'error') throw new Error('An error occurred when loading Admin Metadata');
  return {
    adminConfig: value.adminConfig,
    adminMeta: value.adminMeta.value,
    authenticatedItem: value.authenticatedItem,
    visibleLists: value.visibleLists,
    createViewFieldModes: value.createViewFieldModes,
    apiPath: value.apiPath
  };
}
function useReinitContext() {
  const value = React.useContext(KeystoneContext);
  if (value) return value.reinitContext;
  throw new Error('useReinitContext must be called inside a KeystoneProvider component');
}
function useRawKeystone() {
  const value = React.useContext(KeystoneContext);
  if (value) return value;
  throw new Error('useRawKeystone must be called inside a KeystoneProvider component');
}
function useList(listKey) {
  const {
    adminMeta: {
      lists
    }
  } = useKeystone();
  const list = lists[listKey];
  if (!list) throw new Error(`Unknown field ${listKey}`);
  return list;
}
function useField(listKey, fieldKey) {
  const list = useList(listKey);
  const field = list.fields[fieldKey];
  if (!field) throw new Error(`Unknown field ${listKey}.${fieldKey}`);
  return field;
}

exports.KeystoneProvider = KeystoneProvider;
exports.useField = useField;
exports.useKeystone = useKeystone;
exports.useList = useList;
exports.useRawKeystone = useRawKeystone;
exports.useReinitContext = useReinitContext;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@keystone-ui/core');
var loading = require('@keystone-ui/loading');
var button = require('@keystone-ui/button');
var router = require('next/router');
var Fields = require('../../../../../dist/Fields-91ab38a7.cjs.dev.js');
require('../../../../../dist/getRootGraphQLFieldsFromFieldController-1605fcf4.cjs.dev.js');
require('react');
require('fast-deep-equal');
var PageContainer = require('../../../../../dist/PageContainer-92bd23ef.cjs.dev.js');
var adminUi_context_dist_keystone6CoreAdminUiContext = require('../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.cjs.dev.js');
require('@babel/runtime/helpers/extends');
require('next/link');
require('next/head');
require('@babel/runtime/helpers/defineProperty');
require('@keystone-ui/icons/icons/AlertTriangleIcon');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('../../../../../dist/SignoutButton-12f572cf.cjs.dev.js');
require('@keystone-ui/modals');
var useCreateItem = require('../../../../../dist/useCreateItem-5a2b74ca.cjs.dev.js');
var GraphQLErrorNotice = require('../../../../../dist/GraphQLErrorNotice-d9952d72.cjs.dev.js');
require('@keystone-ui/fields');
require('@keystone-ui/icons');
var common = require('../../../../../dist/common-9627a0fb.cjs.dev.js');
require('@emotion/weak-memoize');
require('graphql');
require('../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.dev.js');
require('@keystone-ui/toast');
require('apollo-upload-client');
require('@emotion/hash');
require('@apollo/client');
require('../../../../../dist/admin-meta-graphql-5b647d4a.cjs.dev.js');
require('../../../../../dist/dataGetter-cce02896.cjs.dev.js');
require('../../../../../dist/usePreventNavigation-7460e40a.cjs.dev.js');
require('@keystone-ui/notice');

/** @jsxRuntime classic */
function CreatePageForm(props) {
  var _createItem$error, _createItem$error2;
  const createItem = useCreateItem.useCreateItem(props.list);
  const router$1 = router.useRouter();
  return core.jsx(core.Box, {
    paddingTop: "xlarge"
  }, createItem.error && core.jsx(GraphQLErrorNotice.GraphQLErrorNotice, {
    networkError: (_createItem$error = createItem.error) === null || _createItem$error === void 0 ? void 0 : _createItem$error.networkError,
    errors: (_createItem$error2 = createItem.error) === null || _createItem$error2 === void 0 ? void 0 : _createItem$error2.graphQLErrors
  }), core.jsx(Fields.Fields, createItem.props), core.jsx(common.BaseToolbar, null, core.jsx(button.Button, {
    isLoading: createItem.state === 'loading',
    weight: "bold",
    tone: "active",
    onClick: async () => {
      const item = await createItem.create();
      if (item) {
        router$1.push(`/${props.list.path}/${item.id}`);
      }
    }
  }, "Create ", props.list.singular)));
}
const getCreateItemPage = props => () => core.jsx(CreateItemPage, props);
function CreateItemPage(props) {
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(props.listKey);
  const {
    createViewFieldModes
  } = adminUi_context_dist_keystone6CoreAdminUiContext.useKeystone();
  return core.jsx(PageContainer.PageContainer, {
    title: `Create ${list.singular}`,
    header: core.jsx(common.ItemPageHeader, {
      list: list,
      label: "Create"
    })
  }, core.jsx(common.ColumnLayout, null, core.jsx(core.Box, null, createViewFieldModes.state === 'error' && core.jsx(GraphQLErrorNotice.GraphQLErrorNotice, {
    networkError: createViewFieldModes.error instanceof Error ? createViewFieldModes.error : undefined,
    errors: createViewFieldModes.error instanceof Error ? undefined : createViewFieldModes.error
  }), createViewFieldModes.state === 'loading' && core.jsx(loading.LoadingDots, {
    label: "Loading create form"
  }), core.jsx(CreatePageForm, {
    list: list
  }))));
}

exports.getCreateItemPage = getCreateItemPage;

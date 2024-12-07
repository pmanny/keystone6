import { jsx, Box } from '@keystone-ui/core';
import { LoadingDots } from '@keystone-ui/loading';
import { Button } from '@keystone-ui/button';
import { useRouter } from 'next/router';
import { F as Fields } from '../../../../../dist/Fields-cb2c206c.esm.js';
import '../../../../../dist/getRootGraphQLFieldsFromFieldController-3d1a0f41.esm.js';
import 'react';
import 'fast-deep-equal';
import { P as PageContainer } from '../../../../../dist/PageContainer-85cc832f.esm.js';
import { useList, useKeystone } from '../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.esm.js';
import '@babel/runtime/helpers/extends';
import 'next/link';
import 'next/head';
import '@babel/runtime/helpers/defineProperty';
import '@keystone-ui/icons/icons/AlertTriangleIcon';
import '@keystone-ui/popover';
import '@keystone-ui/icons/icons/MoreHorizontalIcon';
import '@keystone-ui/icons/icons/ChevronRightIcon';
import '../../../../../dist/SignoutButton-ca58d8c9.esm.js';
import '@keystone-ui/modals';
import { u as useCreateItem } from '../../../../../dist/useCreateItem-1e0ba5a9.esm.js';
import { G as GraphQLErrorNotice } from '../../../../../dist/GraphQLErrorNotice-53983da1.esm.js';
import '@keystone-ui/fields';
import '@keystone-ui/icons';
import { I as ItemPageHeader, C as ColumnLayout, B as BaseToolbar } from '../../../../../dist/common-49d3255e.esm.js';
import '@emotion/weak-memoize';
import 'graphql';
import '../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';
import '@keystone-ui/toast';
import 'apollo-upload-client';
import '@emotion/hash';
import '@apollo/client';
import '../../../../../dist/admin-meta-graphql-3524c137.esm.js';
import '../../../../../dist/dataGetter-54fa8f6b.esm.js';
import '../../../../../dist/usePreventNavigation-11e5691f.esm.js';
import '@keystone-ui/notice';

/** @jsxRuntime classic */
function CreatePageForm(props) {
  var _createItem$error, _createItem$error2;
  const createItem = useCreateItem(props.list);
  const router = useRouter();
  return jsx(Box, {
    paddingTop: "xlarge"
  }, createItem.error && jsx(GraphQLErrorNotice, {
    networkError: (_createItem$error = createItem.error) === null || _createItem$error === void 0 ? void 0 : _createItem$error.networkError,
    errors: (_createItem$error2 = createItem.error) === null || _createItem$error2 === void 0 ? void 0 : _createItem$error2.graphQLErrors
  }), jsx(Fields, createItem.props), jsx(BaseToolbar, null, jsx(Button, {
    isLoading: createItem.state === 'loading',
    weight: "bold",
    tone: "active",
    onClick: async () => {
      const item = await createItem.create();
      if (item) {
        router.push(`/${props.list.path}/${item.id}`);
      }
    }
  }, "Create ", props.list.singular)));
}
const getCreateItemPage = props => () => jsx(CreateItemPage, props);
function CreateItemPage(props) {
  const list = useList(props.listKey);
  const {
    createViewFieldModes
  } = useKeystone();
  return jsx(PageContainer, {
    title: `Create ${list.singular}`,
    header: jsx(ItemPageHeader, {
      list: list,
      label: "Create"
    })
  }, jsx(ColumnLayout, null, jsx(Box, null, createViewFieldModes.state === 'error' && jsx(GraphQLErrorNotice, {
    networkError: createViewFieldModes.error instanceof Error ? createViewFieldModes.error : undefined,
    errors: createViewFieldModes.error instanceof Error ? undefined : createViewFieldModes.error
  }), createViewFieldModes.state === 'loading' && jsx(LoadingDots, {
    label: "Loading create form"
  }), jsx(CreatePageForm, {
    list: list
  }))));
}

export { getCreateItemPage };

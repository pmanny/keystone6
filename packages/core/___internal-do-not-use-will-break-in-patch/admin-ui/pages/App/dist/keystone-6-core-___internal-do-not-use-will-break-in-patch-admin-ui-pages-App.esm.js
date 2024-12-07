import React from 'react';
import { Core } from '@keystone-ui/core';
import '@babel/runtime/helpers/extends';
import 'next/router';
import 'next/link';
import 'next/head';
import { E as ErrorBoundary } from '../../../../../dist/Errors-790aea8c.esm.js';
import { KeystoneProvider } from '../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.esm.js';
import '@keystone-ui/button';
import '@keystone-ui/popover';
import '@keystone-ui/icons/icons/MoreHorizontalIcon';
import '@keystone-ui/icons/icons/ChevronRightIcon';
import '../../../../../dist/SignoutButton-ca58d8c9.esm.js';
import '@keystone-ui/icons';
import '@keystone-ui/modals';
import '@keystone-ui/loading';
import '../../../../../dist/Fields-cb2c206c.esm.js';
import '@keystone-ui/toast';
import 'fast-deep-equal';
import '@apollo/client';
import '@keystone-ui/notice';
import '@keystone-ui/fields';
import '@babel/runtime/helpers/defineProperty';
import '@keystone-ui/icons/icons/AlertTriangleIcon';
import 'apollo-upload-client';
import '@emotion/hash';
import '../../../../../dist/admin-meta-graphql-3524c137.esm.js';
import '../../../../../dist/dataGetter-54fa8f6b.esm.js';

const getApp = props => ({
  Component,
  pageProps
}) => {
  return /*#__PURE__*/React.createElement(Core, null, /*#__PURE__*/React.createElement(KeystoneProvider, props, /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(Component, pageProps))));
};

export { getApp };

import { jsx, Stack } from '@keystone-ui/core';
import { AlertTriangleIcon } from '@keystone-ui/icons/icons/AlertTriangleIcon';
import { S as SignoutButton } from '../../../../../dist/SignoutButton-ca58d8c9.esm.js';
import { a as ErrorContainer } from '../../../../../dist/Errors-790aea8c.esm.js';
import '@keystone-ui/button';
import 'react';
import '@apollo/client';
import '@babel/runtime/helpers/defineProperty';

/** @jsxRuntime classic */
const getNoAccessPage = props => () => jsx(NoAccessPage, props);
const NoAccessPage = ({
  sessionsEnabled
}) => {
  return jsx(ErrorContainer, null, jsx(Stack, {
    align: "center",
    gap: "medium"
  }, jsx(AlertTriangleIcon, {
    size: "large"
  }), jsx("div", null, "You don't have access to this page."), sessionsEnabled ? jsx(SignoutButton, null) : null));
};

export { NoAccessPage, getNoAccessPage };

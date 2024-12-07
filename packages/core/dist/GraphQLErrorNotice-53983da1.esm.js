import { Stack } from '@keystone-ui/core';
import { Notice } from '@keystone-ui/notice';
import React from 'react';

function GraphQLErrorNotice({
  errors,
  networkError
}) {
  if (networkError) {
    return /*#__PURE__*/React.createElement(Notice, {
      tone: "negative",
      marginBottom: "large"
    }, networkError.message);
  }
  if (errors !== null && errors !== void 0 && errors.length) {
    return /*#__PURE__*/React.createElement(Stack, {
      gap: "small",
      marginBottom: "large"
    }, errors.map((err, idx) => /*#__PURE__*/React.createElement(Notice, {
      tone: "negative",
      key: idx
    }, err.message)));
  }
  return null;
}

export { GraphQLErrorNotice as G };

'use strict';

var core = require('@keystone-ui/core');
var notice = require('@keystone-ui/notice');
var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function GraphQLErrorNotice({
  errors,
  networkError
}) {
  if (networkError) {
    return /*#__PURE__*/React__default["default"].createElement(notice.Notice, {
      tone: "negative",
      marginBottom: "large"
    }, networkError.message);
  }
  if (errors !== null && errors !== void 0 && errors.length) {
    return /*#__PURE__*/React__default["default"].createElement(core.Stack, {
      gap: "small",
      marginBottom: "large"
    }, errors.map((err, idx) => /*#__PURE__*/React__default["default"].createElement(notice.Notice, {
      tone: "negative",
      key: idx
    }, err.message)));
  }
  return null;
}

exports.GraphQLErrorNotice = GraphQLErrorNotice;

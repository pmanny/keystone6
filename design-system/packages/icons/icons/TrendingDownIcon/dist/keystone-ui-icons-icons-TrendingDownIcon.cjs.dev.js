'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Icon = require('../../../dist/Icon-c6e67175.cjs.dev.js');
require('@babel/runtime/helpers/extends');
require('@keystone-ui/core');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

const TrendingDownIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("polyline", {
  points: "23 18 13.5 8.5 8.5 13.5 1 6"
}), /*#__PURE__*/React__namespace.createElement("polyline", {
  points: "17 18 23 18 23 12"
})), 'TrendingDownIcon');

exports.TrendingDownIcon = TrendingDownIcon;

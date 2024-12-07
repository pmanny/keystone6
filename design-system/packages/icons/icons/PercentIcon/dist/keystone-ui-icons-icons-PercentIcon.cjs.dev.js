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

const PercentIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("line", {
  x1: 19,
  y1: 5,
  x2: 5,
  y2: 19
}), /*#__PURE__*/React__namespace.createElement("circle", {
  cx: 6.5,
  cy: 6.5,
  r: 2.5
}), /*#__PURE__*/React__namespace.createElement("circle", {
  cx: 17.5,
  cy: 17.5,
  r: 2.5
})), 'PercentIcon');

exports.PercentIcon = PercentIcon;

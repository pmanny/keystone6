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

const PauseCircleIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("circle", {
  cx: 12,
  cy: 12,
  r: 10
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 10,
  y1: 15,
  x2: 10,
  y2: 9
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 14,
  y1: 15,
  x2: 14,
  y2: 9
})), 'PauseCircleIcon');

exports.PauseCircleIcon = PauseCircleIcon;

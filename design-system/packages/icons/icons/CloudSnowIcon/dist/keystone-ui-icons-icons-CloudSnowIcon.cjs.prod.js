'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Icon = require('../../../dist/Icon-4ea0af4c.cjs.prod.js');
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

const CloudSnowIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("path", {
  d: "M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 8,
  y1: 16,
  x2: 8.01,
  y2: 16
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 8,
  y1: 20,
  x2: 8.01,
  y2: 20
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 12,
  y1: 18,
  x2: 12.01,
  y2: 18
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 12,
  y1: 22,
  x2: 12.01,
  y2: 22
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 16,
  y1: 16,
  x2: 16.01,
  y2: 16
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 16,
  y1: 20,
  x2: 16.01,
  y2: 20
})), 'CloudSnowIcon');

exports.CloudSnowIcon = CloudSnowIcon;

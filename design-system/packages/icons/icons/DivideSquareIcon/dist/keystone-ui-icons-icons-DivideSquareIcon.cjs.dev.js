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

const DivideSquareIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("rect", {
  x: 3,
  y: 3,
  width: 18,
  height: 18,
  rx: 2,
  ry: 2
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 8,
  y1: 12,
  x2: 16,
  y2: 12
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 12,
  y1: 16,
  x2: 12,
  y2: 16
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 12,
  y1: 8,
  x2: 12,
  y2: 8
})), 'DivideSquareIcon');

exports.DivideSquareIcon = DivideSquareIcon;

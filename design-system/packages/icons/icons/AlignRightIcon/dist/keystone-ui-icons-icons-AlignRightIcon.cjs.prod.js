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

const AlignRightIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("line", {
  x1: 21,
  y1: 10,
  x2: 7,
  y2: 10
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 21,
  y1: 6,
  x2: 3,
  y2: 6
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 21,
  y1: 14,
  x2: 3,
  y2: 14
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 21,
  y1: 18,
  x2: 7,
  y2: 18
})), 'AlignRightIcon');

exports.AlignRightIcon = AlignRightIcon;

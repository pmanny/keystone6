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

const Trash2Icon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("polyline", {
  points: "3 6 5 6 21 6"
}), /*#__PURE__*/React__namespace.createElement("path", {
  d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 10,
  y1: 11,
  x2: 10,
  y2: 17
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 14,
  y1: 11,
  x2: 14,
  y2: 17
})), 'Trash2Icon');

exports.Trash2Icon = Trash2Icon;

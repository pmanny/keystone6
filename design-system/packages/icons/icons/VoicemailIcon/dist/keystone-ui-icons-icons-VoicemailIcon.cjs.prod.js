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

const VoicemailIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("circle", {
  cx: 5.5,
  cy: 11.5,
  r: 4.5
}), /*#__PURE__*/React__namespace.createElement("circle", {
  cx: 18.5,
  cy: 11.5,
  r: 4.5
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 5.5,
  y1: 16,
  x2: 18.5,
  y2: 16
})), 'VoicemailIcon');

exports.VoicemailIcon = VoicemailIcon;

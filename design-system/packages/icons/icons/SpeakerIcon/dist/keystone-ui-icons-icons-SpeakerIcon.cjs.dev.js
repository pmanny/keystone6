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

const SpeakerIcon = Icon.createIcon(/*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement("rect", {
  x: 4,
  y: 2,
  width: 16,
  height: 20,
  rx: 2,
  ry: 2
}), /*#__PURE__*/React__namespace.createElement("circle", {
  cx: 12,
  cy: 14,
  r: 4
}), /*#__PURE__*/React__namespace.createElement("line", {
  x1: 12,
  y1: 6,
  x2: 12.01,
  y2: 6
})), 'SpeakerIcon');

exports.SpeakerIcon = SpeakerIcon;

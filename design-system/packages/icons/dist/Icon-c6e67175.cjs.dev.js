'use strict';

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var core = require('@keystone-ui/core');

// TODO: Move to theme?
const sizeMap = {
  small: 16,
  smallish: 20,
  medium: 24,
  largish: 28,
  large: 32
};
const createIcon = (children, name) => {
  const Icon = /*#__PURE__*/React.forwardRef(({
    size = 'medium',
    color,
    ...props
  }, ref) => {
    const resolvedSize = typeof size === 'number' ? size : core.mapResponsiveProp(size, sizeMap);
    return core.jsx("svg", _extends({
      "aria-hidden": "true",
      focusable: "false",
      css: {
        verticalAlign: 'text-bottom',
        // removes whitespace inside buttons
        fill: 'none',
        stroke: color || 'currentColor',
        strokeLinejoin: 'round',
        strokeLinecap: 'round',
        strokeWidth: 2
      },
      height: `${resolvedSize}px`,
      width: `${resolvedSize}px`,
      ref: ref,
      role: "img",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, props), children);
  });
  Icon.displayName = name;
  return Icon;
};

exports.createIcon = createIcon;

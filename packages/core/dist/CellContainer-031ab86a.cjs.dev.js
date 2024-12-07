'use strict';

var _extends = require('@babel/runtime/helpers/extends');
var core = require('@keystone-ui/core');

/**
 * This is the component you should use when you want the standard padding around a cell value
 */

const CellContainer = ({
  children,
  ...props
}) => {
  const {
    spacing
  } = core.useTheme();
  return core.jsx("div", _extends({
    css: {
      padding: spacing.small
    }
  }, props), children);
};

exports.CellContainer = CellContainer;

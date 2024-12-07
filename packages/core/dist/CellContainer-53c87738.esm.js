import _extends from '@babel/runtime/helpers/esm/extends';
import { useTheme, jsx } from '@keystone-ui/core';

/**
 * This is the component you should use when you want the standard padding around a cell value
 */

const CellContainer = ({
  children,
  ...props
}) => {
  const {
    spacing
  } = useTheme();
  return jsx("div", _extends({
    css: {
      padding: spacing.small
    }
  }, props), children);
};

export { CellContainer as C };

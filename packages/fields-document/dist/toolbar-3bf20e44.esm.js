import _extends from '@babel/runtime/helpers/esm/extends';
import { useTheme, jsx, Portal, forwardRefWithAs, Box } from '@keystone-ui/core';
import { forwardRef, createContext, useContext } from 'react';

const InlineDialog = /*#__PURE__*/forwardRef(({
  isRelative,
  ...props
}, ref) => {
  const {
    radii,
    spacing
  } = useTheme();
  const relativeStyles = isRelative ? {
    left: '50%',
    margin: spacing.small,
    transform: 'translateX(-50%)'
  } : {};
  const dialog = jsx("div", _extends({
    ref: ref,
    contentEditable: false,
    css: {
      background: 'white',
      borderRadius: radii.small,
      boxShadow: `rgba(9, 30, 66, 0.31) 0px 0px 1px, rgba(9, 30, 66, 0.25) 0px 4px 8px -2px`,
      padding: spacing.small,
      position: 'absolute',
      userSelect: 'none',
      ...relativeStyles
    }
  }, props));
  if (isRelative) {
    return dialog;
  }
  return jsx(Portal, null, dialog);
});

// Spacers and Separators
// ------------------------------

const ToolbarSpacer = () => {
  const {
    spacing
  } = useTheme();
  return jsx("span", {
    css: {
      display: 'inline-block',
      width: spacing.large
    }
  });
};
const ToolbarSeparator = () => {
  const {
    colors,
    spacing
  } = useTheme();
  return jsx("span", {
    css: {
      alignSelf: 'stretch',
      background: colors.border,
      display: 'inline-block',
      marginLeft: spacing.xsmall,
      marginRight: spacing.xsmall,
      width: 1
    }
  });
};

// Groups
// ------------------------------

const directionToAlignment = {
  row: 'center',
  column: 'start'
};
const ToolbarGroupContext = /*#__PURE__*/createContext({
  direction: 'row'
});
const useToolbarGroupContext = () => useContext(ToolbarGroupContext);
const ToolbarGroup = forwardRefWithAs(({
  children,
  direction = 'row',
  ...props
}, ref) => {
  const {
    spacing
  } = useTheme();
  return jsx(ToolbarGroupContext.Provider, {
    value: {
      direction
    }
  }, jsx(Box, _extends({
    ref: ref,
    css: {
      display: 'flex',
      gap: spacing.xxsmall,
      flexDirection: direction,
      justifyContent: 'start',
      alignItems: directionToAlignment[direction],
      height: '100%',
      overflowX: 'auto'
    }
  }, props), children));
});

// Buttons
// ------------------------------

const ToolbarButton = forwardRefWithAs(function ToolbarButton({
  as: Tag = 'button',
  isDisabled,
  isPressed,
  isSelected,
  variant = 'default',
  ...props
}, ref) {
  const extraProps = {};
  const {
    direction: groupDirection
  } = useToolbarGroupContext();
  const {
    colors,
    palette,
    radii,
    sizing,
    spacing,
    typography
  } = useTheme();
  if (Tag === 'button') {
    extraProps.type = 'button';
  }
  const variants = {
    default: {
      bgHover: palette.neutral200,
      bgActive: palette.neutral300,
      fg: palette.neutral800
    },
    action: {
      bgHover: palette.blue50,
      bgActive: palette.blue100,
      fg: palette.blue600
    },
    destructive: {
      bgHover: palette.red50,
      bgActive: palette.red100,
      fg: palette.red600
    }
  };
  const style = variants[variant];
  return jsx(Tag, _extends({}, extraProps, {
    ref: ref,
    disabled: isDisabled,
    "data-pressed": isPressed,
    "data-selected": isSelected,
    "data-display-mode": groupDirection,
    css: {
      alignItems: 'center',
      background: 0,
      border: 0,
      borderRadius: radii.xsmall,
      color: style.fg,
      cursor: 'pointer',
      display: 'flex',
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      height: sizing.medium,
      whiteSpace: 'nowrap',
      ':hover': {
        background: style.bgHover
      },
      ':active': {
        background: style.bgActive
      },
      '&:disabled': {
        color: colors.foregroundDisabled,
        pointerEvents: 'none'
      },
      '&[data-pressed=true]': {
        background: style.bgActive
      },
      '&[data-selected=true]': {
        background: colors.foregroundMuted,
        color: colors.background
      },
      // alternate styles within button group
      '&[data-display-mode=row]': {
        paddingLeft: spacing.small,
        paddingRight: spacing.small
      },
      '&[data-display-mode=column]': {
        paddingLeft: spacing.medium,
        paddingRight: spacing.medium,
        width: '100%'
      }
    }
  }, props));
});
function KeyboardInTooltip({
  children
}) {
  const theme = useTheme();
  return jsx("kbd", {
    css: {
      margin: 2,
      padding: theme.spacing.xxsmall,
      fontFamily: 'inherit',
      backgroundColor: theme.colors.foreground,
      borderRadius: theme.radii.xsmall,
      color: theme.colors.background,
      whiteSpace: 'pre'
    }
  }, children);
}

export { InlineDialog as I, KeyboardInTooltip as K, ToolbarSeparator as T, ToolbarButton as a, ToolbarGroup as b, ToolbarSpacer as c };

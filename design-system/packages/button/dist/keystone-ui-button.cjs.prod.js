'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var core = require('@keystone-ui/core');
var loading = require('@keystone-ui/loading');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

/** @jsxRuntime classic */
const buttonSizeValues = ['large', 'medium', 'small'];
const buttonToneValues = ['active', 'passive', 'positive', 'warning', 'negative', 'help'];
const buttonWeightValues = ['bold', 'light', 'none', 'link'];
const buttonPropDefaults = {
  size: 'medium',
  tone: 'passive',
  weight: 'light'
};
function useButtonTokens({
  tone: toneKey,
  size: sizeKey,
  weight: weightKey
}) {
  const {
    animation,
    colors,
    tones,
    typography,
    controlSizes,
    opacity
  } = core.useTheme();
  const tone = tones[toneKey];
  const size = controlSizes[sizeKey];
  const weights = {
    bold: {
      background: tone.fill[0],
      foreground: tone.fillForeground[0],
      focus: {
        shadow: `0 0 0 2px ${tone.focusRing}`
      },
      hover: {
        background: tone.fill[1]
      },
      pressed: {
        background: tone.fill[2]
      }
    },
    light: {
      background: tone.tint[0],
      foreground: tone.foreground[0],
      focus: {
        shadow: `0 0 0 2px ${tone.focusRing}`
      },
      hover: {
        foreground: tone.foreground[1],
        background: tone.tint[1]
      },
      pressed: {
        foreground: tone.foreground[2],
        background: tone.tint[2]
      }
    },
    none: {
      foreground: tone.foreground[0],
      focus: {
        shadow: `0 0 0 2px ${tone.focusRing}`
      },
      hover: {
        foreground: tone.foreground[1],
        background: tone.tint[0]
      },
      pressed: {
        foreground: tone.foreground[2],
        background: tone.tint[1]
      }
    },
    link: {
      foreground: colors.foreground,
      textDecoration: 'none',
      focus: {
        textDecoration: 'underline'
      },
      hover: {
        foreground: tone.foreground[0],
        textDecoration: 'underline'
      },
      pressed: {
        foreground: tone.foreground[1],
        textDecoration: 'underline'
      }
    }
  };
  const weight = weights[weightKey];
  const tokens = {
    borderRadius: size.borderRadius,
    borderWidth: size.borderWidth,
    disabledOpacity: opacity.disabled,
    fontSize: size.fontSize,
    fontWeight: typography.fontWeight.medium,
    height: size.height,
    paddingX: size.paddingX,
    transition: `
      background-color ${animation.duration100},
      box-shadow ${animation.duration100},
      border-color ${animation.duration100},
      opacity ${animation.duration100},
    `,
    ...weight
  };
  return tokens;
}
function useButtonStyles({
  isDisabled,
  isBlock,
  tokens
}) {
  const baseStyles = {
    alignItems: 'center',
    borderStyle: 'solid',
    boxSizing: 'border-box',
    cursor: isDisabled ? 'default' : 'pointer',
    display: isBlock ? 'flex' : 'inline-flex',
    flexShrink: 0,
    // button text should NOT wrap, even within a flex container
    justifyContent: 'center',
    opacity: isDisabled ? tokens.disabledOpacity : undefined,
    outline: 0,
    pointerEvents: isDisabled ? 'none' : undefined,
    // the `disabled` attribute only works for the `button` element
    position: 'relative',
    textDecoration: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    width: isBlock ? '100%' : undefined
  };
  const tokenStyles = {
    backgroundColor: tokens.background || 'transparent',
    borderColor: tokens.borderColor || 'transparent',
    borderRadius: tokens.borderRadius,
    borderWidth: tokens.borderWidth,
    color: tokens.foreground,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    height: tokens.height,
    paddingLeft: tokens.paddingX,
    paddingRight: tokens.paddingX,
    textDecoration: tokens.textDecoration,
    transition: tokens.transition,
    ':focus': {
      background: tokens.focus.background,
      borderColor: tokens.focus.borderColor,
      boxShadow: tokens.focus.shadow,
      color: tokens.focus.foreground,
      textDecoration: tokens.focus.textDecoration
    },
    ':hover': {
      background: tokens.hover.background,
      borderColor: tokens.hover.borderColor,
      boxShadow: tokens.hover.shadow,
      color: tokens.hover.foreground,
      textDecoration: tokens.hover.textDecoration
    },
    ':active': {
      background: tokens.pressed.background,
      borderColor: tokens.pressed.borderColor,
      boxShadow: tokens.pressed.shadow,
      color: tokens.pressed.foreground,
      textDecoration: tokens.pressed.textDecoration
    }
  };
  return {
    ...baseStyles,
    ...tokenStyles
  };
}

const ButtonContext = /*#__PURE__*/React.createContext({
  defaults: buttonPropDefaults,
  useButtonStyles,
  useButtonTokens
});

// Note hooks are optional for the provider value, but not in the context created above; this is
// because they will be merged with the existing context and always exist in the value

const ButtonProvider = ({
  defaults,
  hooks,
  children
}) => {
  const parentContext = React.useContext(ButtonContext);
  const newContext = React.useMemo(() => ({
    ...parentContext,
    ...hooks,
    defaults: {
      ...parentContext.defaults,
      ...defaults
    }
  }), [parentContext, hooks, defaults]);
  return /*#__PURE__*/React__default["default"].createElement(ButtonContext.Provider, {
    value: newContext
  }, children);
};

const loadingContainerStyles = {
  left: '50%',
  position: 'absolute',
  transform: 'translateX(-50%)'
};
const Button = core.forwardRefWithAs(({
  as: Tag = 'button',
  children,
  isDisabled,
  isLoading,
  size,
  tone,
  weight,
  ...otherProps
}, ref) => {
  const {
    useButtonStyles,
    useButtonTokens,
    defaults
  } = React.useContext(ButtonContext);
  const tokens = useButtonTokens({
    size: size || defaults.size,
    tone: tone || defaults.tone,
    weight: weight || defaults.weight
  });
  const styles = useButtonStyles({
    isDisabled,
    tokens
  });
  return core.jsx(Tag, _extends({
    type: Tag === 'button' ? 'button' : undefined,
    css: styles,
    ref: ref
  }, otherProps), core.jsx("span", {
    css: isLoading ? {
      opacity: 0
    } : null
  }, children), isLoading && core.jsx("span", {
    css: loadingContainerStyles
  }, core.jsx(loading.LoadingDots, {
    size: size || defaults.size,
    label: "Button loading indicator"
  })));
});

exports.Button = Button;
exports.ButtonContext = ButtonContext;
exports.ButtonProvider = ButtonProvider;
exports.buttonPropDefaults = buttonPropDefaults;
exports.buttonSizeValues = buttonSizeValues;
exports.buttonToneValues = buttonToneValues;
exports.buttonWeightValues = buttonWeightValues;
exports.useButtonStyles = useButtonStyles;
exports.useButtonTokens = useButtonTokens;

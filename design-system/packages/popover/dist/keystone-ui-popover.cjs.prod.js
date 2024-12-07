'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var react = require('react');
var focusTrapModule = require('focus-trap');
var reactPopper = require('react-popper');
var core = require('@keystone-ui/core');

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

var focusTrapModule__namespace = /*#__PURE__*/_interopNamespace(focusTrapModule);

// Hooks
// ------------------------------

// Generic Hook

const useControlledPopover = ({
  isOpen,
  onClose
}, popperOptions = {}, popoverOptions = {
  handleClose: 'both'
}) => {
  const [anchorElement, setAnchorElement] = react.useState(null);
  const [popoverElement, setPopoverElement] = react.useState();
  const [arrowElement, setArrowElement] = react.useState();
  const {
    styles,
    attributes,
    update
  } = reactPopper.usePopper(anchorElement, popoverElement, {
    ...popperOptions,
    modifiers: [...(popperOptions.modifiers || []), {
      name: 'arrow',
      options: {
        element: arrowElement
      }
    }, {
      name: 'eventListeners',
      options: {
        scroll: isOpen,
        resize: isOpen
      }
    }]
  });

  // update popper when it opens to get the latest placement
  // useful for prerendered popovers in modals etc.
  react.useEffect(() => {
    if (update && isOpen) {
      update();
    }
  }, [isOpen, update]);

  // close on click outside
  useClickOutside({
    handler: () => onClose(),
    elements: [anchorElement, popoverElement],
    listenWhen: ['both', 'mouse'].includes(popoverOptions.handleClose) && isOpen
  });

  // close on esc press
  useKeyPress({
    targetKey: 'Escape',
    downHandler: react.useCallback(event => {
      event.preventDefault(); // Avoid potential close of modal
      onClose();
    }, [onClose]),
    listenWhen: ['both', 'keyboard'].includes(popoverOptions.handleClose) && isOpen
  });
  return {
    trigger: react.useMemo(() => ({
      ref: setAnchorElement,
      props: {
        'aria-haspopup': true,
        'aria-expanded': isOpen
      }
    }), [isOpen]),
    dialog: react.useMemo(() => ({
      ref: setPopoverElement,
      props: {
        style: styles.popper,
        ...attributes.popper
      }
    }), [styles.popper, attributes.popper]),
    arrow: react.useMemo(() => ({
      ref: setArrowElement,
      props: {
        style: styles.arrow
      }
    }), [styles.arrow])
  };
};
const usePopover = (popperOptions = {}, popoverOptions = {
  handleClose: 'both'
}) => {
  const [isOpen, setOpen] = react.useState(false);
  return {
    isOpen,
    setOpen,
    ...useControlledPopover({
      isOpen,
      onClose: react.useCallback(() => setOpen(false), [])
    }, popperOptions, popoverOptions)
  };
};

// Component
// ------------------------------

const Popover = ({
  placement = 'bottom',
  triggerRenderer,
  ...props
}) => {
  const {
    isOpen,
    setOpen,
    trigger,
    dialog,
    arrow
  } = usePopover({
    placement,
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return core.jsx(react.Fragment, null, triggerRenderer({
    isOpen,
    triggerProps: {
      ref: trigger.ref,
      ...trigger.props,
      onClick: () => setOpen(!isOpen)
    }
  }), core.jsx(PopoverDialog, _extends({
    isVisible: isOpen,
    arrow: arrow,
    ref: dialog.ref
  }, dialog.props, props)));
};

// Dialog
// ------------------------------

const PopoverDialog = /*#__PURE__*/react.forwardRef(({
  isVisible,
  children,
  arrow,
  ...props
}, consumerRef) => {
  const {
    elevation,
    radii,
    shadow,
    colors
  } = core.useTheme();
  const focusTrapRef = react.useRef(null);
  const focusTrap = react.useRef(null);
  react.useEffect(() => {
    if (focusTrapRef.current) {
      focusTrap.current = focusTrapModule__namespace.createFocusTrap(focusTrapRef.current, {
        allowOutsideClick: true
      });
    }
  }, [focusTrapRef]);
  react.useEffect(() => {
    const focusTrapInstance = focusTrap.current;
    if (focusTrapInstance) {
      if (isVisible) {
        focusTrapInstance.activate();
        return () => {
          focusTrapInstance.deactivate();
        };
      } else {
        focusTrapInstance.deactivate();
      }
    }
  }, [isVisible, focusTrap]);
  return core.jsx(core.Portal, null, core.jsx("div", _extends({
    role: "dialog",
    "aria-hidden": isVisible ? 'false' : 'true',
    "aria-modal": "true",
    ref: consumerRef,
    css: {
      background: colors.background,
      borderRadius: radii.medium,
      boxShadow: shadow.s300,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? undefined : 'none',
      zIndex: elevation.e500,
      // on top of drawers
      ...useArrowStyles()
    }
  }, props), core.jsx("div", _extends({
    "data-popper-arrow": true,
    ref: arrow.ref,
    className: "tooltipArrow"
  }, arrow.props)), core.jsx("div", {
    ref: focusTrapRef
  }, isVisible ? children : null)));
});

// TODO: maybe we should add an invisible blanket and have a regular react event listener on that instead of this?

// NOTE: mouse event handler defined here rather than imported from react becase
// the event listener will return a native event, not a synthetic event

const useClickOutside = ({
  handler,
  elements,
  listenWhen
}) => {
  react.useEffect(() => {
    if (listenWhen) {
      const handleMouseDown = event => {
        // bail on mouse down "inside" any of the provided elements
        if (elements.some(el => el && el.contains(event.target))) {
          return;
        }
        handler(event);
      };
      document.addEventListener('mousedown', handleMouseDown);
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
      };
    }
  }, [handler, elements, listenWhen]);
};
const useKeyPress = ({
  targetKey,
  targetElement,
  downHandler,
  upHandler,
  listenWhen
}) => {
  // Keep track of whether the target key is pressed
  const [keyPressed, setKeyPressed] = react.useState(false);

  // add event listeners
  react.useEffect(() => {
    const target = targetElement || document.body;
    const onDown = event => {
      if (event.key === targetKey) {
        setKeyPressed(true);
        if (typeof downHandler === 'function') {
          downHandler(event);
        }
      }
    };
    const onUp = event => {
      if (event.key === targetKey) {
        setKeyPressed(false);
        if (typeof upHandler === 'function') {
          upHandler(event);
        }
      }
    };
    if (listenWhen) {
      target.addEventListener('keydown', onDown);
      target.addEventListener('keyup', onUp);

      // Remove event listeners on cleanup
      return () => {
        target.removeEventListener('keydown', onDown);
        target.removeEventListener('keyup', onUp);
      };
    }
  }, [listenWhen, targetKey, downHandler, upHandler, targetElement]);
  return keyPressed;
};
const useArrowStyles = () => {
  const theme = core.useTheme();
  const size = 16;
  return {
    '& [data-popper-arrow]': {
      position: 'absolute',
      overflow: 'hidden',
      pointerEvents: 'none',
      height: size * 2,
      width: size * 2,
      '&::after': {
        content: '""',
        position: 'absolute',
        background: theme.colors.background,
        width: size,
        height: size,
        transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
        boxShadow: theme.shadow.s200
      }
    },
    "&[data-popper-placement^='left'] > [data-popper-arrow]": {
      left: '100%',
      '&::after': {
        top: '50%',
        left: '0'
      }
    },
    "&[data-popper-placement^='right'] > [data-popper-arrow]": {
      right: '100%',
      '&::after': {
        top: '50%',
        left: '100%'
      }
    },
    "&[data-popper-placement^='top'] > [data-popper-arrow]": {
      top: '100%',
      '&::after': {
        top: 0,
        bottom: '-50%',
        left: '50%'
      }
    },
    "&[data-popper-placement^='bottom'] > [data-popper-arrow]": {
      bottom: '100%',
      right: 'unset',
      '&::after': {
        bottom: '-50%',
        left: '50%'
      }
    }
  };
};

exports.Popover = Popover;
exports.PopoverDialog = PopoverDialog;
exports.useControlledPopover = useControlledPopover;
exports.usePopover = usePopover;

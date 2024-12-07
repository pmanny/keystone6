import { Button } from '@keystone-ui/button';
import { keyframes, jsx, useTheme, useId, makeId, Portal, Heading, Divider, Stack, Box } from '@keystone-ui/core';
import _extends from '@babel/runtime/helpers/esm/extends';
import React, { forwardRef, useState, useCallback, useEffect, useContext, useRef, Fragment } from 'react';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
import { Transition } from 'react-transition-group';

const fadeInAnim = keyframes({
  from: {
    opacity: 0
  }
});
const easing$2 = 'cubic-bezier(0.2, 0, 0, 1)';
const Blanket = /*#__PURE__*/forwardRef((props, ref) => {
  return jsx("div", _extends({
    ref: ref,
    css: {
      animation: `${fadeInAnim} 320ms ${easing$2}`,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      // TODO get this from the theme
      bottom: 0,
      left: 0,
      position: 'fixed',
      right: 0,
      top: 0
    }
  }, props));
});

const ModalContext = /*#__PURE__*/React.createContext(null);
const DrawerProvider = ({
  children
}) => {
  const [drawerStack, setDrawerStack] = useState([]);
  const pushToDrawerStack = useCallback(key => {
    setDrawerStack(stack => [...stack, key]);
  }, []);
  const popFromDrawerStack = useCallback(() => {
    setDrawerStack(stack => {
      const less = stack.slice(0, -1);
      return less;
    });
  }, []);
  const context = {
    drawerStack,
    pushToDrawerStack,
    popFromDrawerStack
  };
  return /*#__PURE__*/React.createElement(ModalContext.Provider, {
    value: context
  }, children);
};

// Utils
// ------------------------------
const useDrawerManager = uniqueKey => {
  const modalState = React.useContext(ModalContext);
  if (modalState === null) {
    throw new Error('This component must have a <DrawerProvider/> ancestor in the same React tree.');
  }

  // keep the stack in sync on mount/unmount
  useEffect(() => {
    modalState.pushToDrawerStack(uniqueKey);
    return () => {
      modalState.popFromDrawerStack();
    };
  }, []);
  // the last key in the array is the "top" modal visually, so the depth is the inverse index
  // be careful not to mutate the stack
  const depth = modalState.drawerStack.slice().reverse().indexOf(uniqueKey);
  // if it's not in the stack already,
  // we know that it should be the last drawer in the stack but the effect hasn't happened yet
  // so we need to make the depth 0 so the depth is correct even though the effect hasn't happened yet
  return depth === -1 ? 0 : depth;
};

const DrawerControllerContext = /*#__PURE__*/React.createContext(null);
const DrawerControllerContextProvider = DrawerControllerContext.Provider;
const useDrawerControllerContext = () => {
  const context = useContext(DrawerControllerContext);
  if (!context) {
    throw new Error('Drawers must be wrapped in a <DrawerController>. You should generally do this outside of the component that renders the <Drawer> or <TabbedDrawer>.');
  }
  return context;
};
const DrawerController = ({
  isOpen,
  children
}) => {
  return /*#__PURE__*/React.createElement(Transition, {
    appear: true,
    mountOnEnter: true,
    unmountOnExit: true,
    in: isOpen,
    timeout: 150
  }, transitionState => /*#__PURE__*/React.createElement(DrawerControllerContextProvider, {
    value: transitionState
  }, children));
};

const DRAWER_WIDTHS = {
  narrow: 580,
  wide: 740
};
const easing$1 = 'cubic-bezier(0.2, 0, 0, 1)';
const blanketTransition = {
  entering: {
    opacity: 0
  },
  entered: {
    opacity: 1
  },
  exiting: {
    opacity: 0
  },
  exited: {
    opacity: 0
  },
  unmounted: {
    opacity: 0
  }
};
const DrawerBase = ({
  children,
  initialFocusRef,
  onClose,
  onSubmit,
  width = 'narrow',
  transitionState,
  ...props
}) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const id = useId();
  const uniqueKey = makeId('drawer', id);

  // sync drawer state
  const drawerDepth = useDrawerManager(uniqueKey);
  const onKeyDown = event => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      onClose();
    }
  };
  const activateFocusLock = useCallback(() => {
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [initialFocusRef]);
  const dialogTransition = getDialogTransition(drawerDepth);
  let Tag = 'div';
  if (onSubmit) {
    Tag = 'form';
    const oldOnSubmit = onSubmit;
    // @ts-expect-error
    onSubmit = event => {
      if (!event.defaultPrevented) {
        event.preventDefault();
        event.stopPropagation();
        oldOnSubmit();
      }
    };
  }
  return jsx(Portal, null, jsx(Fragment, null, jsx(Blanket, {
    onClick: onClose,
    style: {
      transition: `opacity 150ms linear`,
      ...blanketTransition[transitionState]
    }
  }), jsx(FocusLock, {
    autoFocus: true,
    returnFocus: true,
    onActivation: activateFocusLock
  }, jsx(RemoveScroll, {
    enabled: true
  }, jsx(Tag, _extends({
    onSubmit: onSubmit,
    "aria-modal": "true",
    role: "dialog",
    ref: containerRef,
    tabIndex: -1,
    onKeyDown: onKeyDown,
    style: dialogTransition[transitionState],
    css: {
      backgroundColor: theme.colors.background,
      bottom: 0,
      boxShadow: theme.shadow.s400,
      outline: 0,
      position: 'fixed',
      right: 0,
      top: 0,
      transition: `transform 150ms ${easing$1}`,
      width: DRAWER_WIDTHS[width],
      // flex layout must be applied here so content will grow/shrink properly
      display: 'flex',
      flexDirection: 'column'
    }
  }, props), jsx(DrawerControllerContextProvider, {
    value: null
  }, children))))));
};

// Utils
// ------------------------------

function getDialogTransition(depth) {
  const scaleInc = 0.05;
  const transformValue = `scale(${1 - scaleInc * depth}) translateX(-${depth * 40}px)`;
  return {
    entering: {
      transform: 'translateX(100%)'
    },
    entered: {
      transform: transformValue
    },
    exiting: {
      transform: 'translateX(100%)'
    },
    exited: {
      transform: 'translateX(100%)'
    },
    unmounted: {
      transform: 'none'
    }
  };
}

/** @jsxRuntime classic */
const Drawer = ({
  actions,
  children,
  title,
  id,
  initialFocusRef,
  width = 'narrow'
}) => {
  const transitionState = useDrawerControllerContext();
  const {
    cancel,
    confirm
  } = actions;
  const {
    colors,
    spacing
  } = useTheme();
  const safeClose = actions.confirm.loading ? () => {} : actions.cancel.action;
  const instanceId = useId(id);
  const headingId = makeId(instanceId, 'heading');
  return jsx(DrawerBase, {
    transitionState: transitionState,
    "aria-labelledby": headingId,
    initialFocusRef: initialFocusRef,
    onSubmit: actions.confirm.action,
    onClose: safeClose,
    width: width
  }, jsx("div", {
    css: {
      alignItems: 'center',
      borderBottom: `1px solid ${colors.border}`,
      boxSizing: 'border-box',
      display: 'flex',
      flexShrink: 0,
      height: 80,
      padding: `${spacing.large}px ${spacing.xlarge}px`
    }
  }, jsx(Heading, {
    id: headingId,
    type: "h3"
  }, title)), jsx("div", {
    css: {
      overflowY: 'auto',
      padding: `0 ${spacing.xlarge}px`
    }
  }, children), jsx(Divider, {
    marginX: "xlarge"
  }), jsx(Stack, {
    padding: "xlarge",
    across: true,
    gap: "small"
  }, jsx(Button, {
    tone: "active",
    weight: "bold",
    type: "submit",
    isLoading: confirm.loading
  }, confirm.label), jsx(Button, {
    onClick: safeClose,
    disabled: confirm.loading,
    weight: "none",
    tone: "passive"
  }, cancel.label)));
};

const slideInAnim = keyframes({
  from: {
    transform: 'translateY(20%)',
    opacity: 0
  }
});
const easing = 'cubic-bezier(0.2, 0, 0, 1)';
const DialogBase = ({
  children,
  isOpen,
  onClose,
  width,
  ...props
}) => {
  const theme = useTheme();
  const onKeyDown = event => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault(); // Avoid potential drawer close
      onClose();
    }
  };
  return isOpen ? jsx(Portal, null, jsx(Fragment, null, jsx(Blanket, {
    onClick: onClose
  }), jsx(FocusLock, {
    autoFocus: true,
    returnFocus: true
  }, jsx(RemoveScroll, {
    enabled: true
  }, jsx("div", {
    css: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, jsx("div", _extends({
    "aria-modal": "true",
    role: "dialog",
    tabIndex: -1,
    onKeyDown: onKeyDown,
    css: {
      animation: `${slideInAnim} 320ms ${easing}`,
      backgroundColor: theme.colors.background,
      borderRadius: theme.radii.large,
      boxShadow: theme.shadow.s400,
      transition: `transform 150ms ${easing}`,
      width,
      zIndex: theme.elevation.e400
    }
  }, props), children)))))) : null;
};

/** @jsxRuntime classic */
const AlertDialog = ({
  actions,
  isOpen,
  children,
  title,
  id,
  tone = 'active'
}) => {
  const {
    cancel,
    confirm
  } = actions;
  const theme = useTheme();
  const instanceId = useId(id);
  const headingId = makeId('heading', instanceId);
  const onClose = () => {
    if (actions.cancel) {
      actions.cancel.action();
    } else {
      actions.confirm.action();
    }
  };
  return jsx(DialogBase, {
    isOpen: isOpen,
    onClose: onClose,
    width: 440,
    "aria-labelledby": headingId
  }, jsx("div", {
    css: {
      padding: theme.spacing.xlarge
    }
  }, jsx(Heading, {
    id: headingId,
    type: "h4"
  }, title), jsx(Box, {
    marginY: "large"
  }, children), jsx("div", {
    css: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, cancel && jsx(Button, {
    disabled: confirm.loading,
    key: cancel.label,
    onClick: cancel.action,
    weight: "none",
    tone: "passive"
  }, cancel.label), jsx(Button, {
    css: {
      marginLeft: theme.spacing.medium
    },
    key: confirm.label,
    isLoading: confirm.loading,
    onClick: confirm.action,
    tone: tone
  }, confirm.label))));
};

export { AlertDialog, DRAWER_WIDTHS, Drawer, DrawerController, DrawerProvider };

'use client';
import _extends from '@babel/runtime/helpers/esm/extends';
import { createContext, useContext, useMemo } from 'react';
import { Transforms } from 'slate';
import { useFocused, useSelected, useSlateStatic, ReactEditor } from 'slate-react';
import { jsx, useTheme } from '@keystone-ui/core';
import { Tooltip } from '@keystone-ui/tooltip';
import { Trash2Icon } from '@keystone-ui/icons/icons/Trash2Icon';
import { ColumnsIcon } from '@keystone-ui/icons/icons/ColumnsIcon';
import { useControlledPopover } from '@keystone-ui/popover';
import { I as InlineDialog, b as ToolbarGroup, a as ToolbarButton, T as ToolbarSeparator } from './toolbar-3bf20e44.esm.js';
import './orderable-c4eafa5e.esm.js';
import { j as isElementActive } from './utils-3f0c9305.esm.js';
import { u as useToolbarState } from './toolbar-state-29badbe2.esm.js';
import { i as insertLayout } from './layouts-shared-02634bb2.esm.js';
import '@dnd-kit/core';
import '@dnd-kit/sortable';
import '@dnd-kit/modifiers';
import '@keystone-ui/button';
import './api-0cce34e4.esm.js';
import '@keystone-6/core';
import '@keystone-ui/fields';
import './isValidURL-3d5628de.esm.js';
import '@braintree/sanitize-url';
import './form-from-preview-0c5f473c.esm.js';
import '@keystone-6/core/admin-ui/context';
import '@keystone-6/core/fields/types/relationship/views/RelationshipSelect';
import '@keystone-ui/icons/icons/PlusCircleIcon';
import '@keystone-ui/modals';
import '@emotion/weak-memoize';
import './layouts-f767359a.esm.js';

const LayoutOptionsContext = /*#__PURE__*/createContext([]);
const LayoutOptionsProvider = LayoutOptionsContext.Provider;

// UI Components
function LayoutContainer({
  attributes,
  children,
  element
}) {
  const {
    spacing
  } = useTheme();
  const focused = useFocused();
  const selected = useSelected();
  const editor = useSlateStatic();
  const layout = element.layout;
  const layoutOptions = useContext(LayoutOptionsContext);
  const {
    dialog,
    trigger
  } = useControlledPopover({
    isOpen: focused && selected,
    onClose: () => {}
  }, {
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return jsx("div", _extends({
    css: {
      marginBottom: spacing.medium,
      marginTop: spacing.medium,
      position: 'relative'
    }
  }, attributes), jsx("div", _extends({}, trigger.props, {
    ref: trigger.ref,
    css: {
      columnGap: spacing.small,
      display: 'grid',
      gridTemplateColumns: layout.map(x => `${x}fr`).join(' ')
    }
  }), children), focused && selected && jsx(InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), jsx(ToolbarGroup, null, layoutOptions.map((layoutOption, i) => jsx(ToolbarButton, {
    isSelected: layoutOption.toString() === layout.toString(),
    key: i,
    onMouseDown: event => {
      event.preventDefault();
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, {
        type: 'layout',
        layout: layoutOption
      }, {
        at: path
      });
    }
  }, makeLayoutIcon(layoutOption))), jsx(ToolbarSeparator, null), jsx(Tooltip, {
    content: "Remove",
    weight: "subtle"
  }, attrs => jsx(ToolbarButton, _extends({
    variant: "destructive",
    onMouseDown: event => {
      event.preventDefault();
      const path = ReactEditor.findPath(editor, element);
      Transforms.removeNodes(editor, {
        at: path
      });
    }
  }, attrs), jsx(Trash2Icon, {
    size: "small"
  }))))));
}
function LayoutArea({
  attributes,
  children
}) {
  const {
    colors,
    radii,
    spacing
  } = useTheme();
  return jsx("div", _extends({
    css: {
      border: `2px dashed ${colors.border}`,
      borderRadius: radii.small,
      paddingLeft: spacing.medium,
      paddingRight: spacing.medium
    }
  }, attributes), children);
}
function makeLayoutIcon(ratios) {
  const size = 16;
  const element = jsx("div", {
    role: "img",
    css: {
      display: 'grid',
      gridTemplateColumns: ratios.map(r => `${r}fr`).join(' '),
      gap: 2,
      width: size,
      height: size
    }
  }, ratios.map((_, i) => {
    return jsx("div", {
      key: i,
      css: {
        backgroundColor: 'currentcolor',
        borderRadius: 1
      }
    });
  }));
  return element;
}
const layoutsIcon = jsx(ColumnsIcon, {
  size: "small"
});
function LayoutsButton({
  layouts
}) {
  const {
    editor,
    layouts: {
      isSelected
    }
  } = useToolbarState();
  return useMemo(() => jsx(Tooltip, {
    content: "Layouts",
    weight: "subtle"
  }, attrs => jsx(ToolbarButton, _extends({
    isSelected: isSelected,
    onMouseDown: event => {
      event.preventDefault();
      if (isElementActive(editor, 'layout')) {
        Transforms.unwrapNodes(editor, {
          match: node => node.type === 'layout'
        });
        return;
      }
      insertLayout(editor, layouts[0]);
    }
  }, attrs), layoutsIcon)), [editor, isSelected, layouts]);
}

export { LayoutArea, LayoutContainer, LayoutOptionsProvider, LayoutsButton };

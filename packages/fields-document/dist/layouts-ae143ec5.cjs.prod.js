'use client';
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var slate = require('slate');
var slateReact = require('slate-react');
var core = require('@keystone-ui/core');
var tooltip = require('@keystone-ui/tooltip');
var Trash2Icon = require('@keystone-ui/icons/icons/Trash2Icon');
var ColumnsIcon = require('@keystone-ui/icons/icons/ColumnsIcon');
var popover = require('@keystone-ui/popover');
var toolbar = require('./toolbar-5bb2846f.cjs.prod.js');
require('./orderable-1dded3d4.cjs.prod.js');
var utils = require('./utils-8f1d1f0a.cjs.prod.js');
var toolbarState = require('./toolbar-state-c025774a.cjs.prod.js');
var layoutsShared = require('./layouts-shared-e18ac1bf.cjs.prod.js');
require('@dnd-kit/core');
require('@dnd-kit/sortable');
require('@dnd-kit/modifiers');
require('@keystone-ui/button');
require('./api-337a07cb.cjs.prod.js');
require('@keystone-6/core');
require('@keystone-ui/fields');
require('./isValidURL-25023205.cjs.prod.js');
require('@braintree/sanitize-url');
require('./form-from-preview-39e46967.cjs.prod.js');
require('@keystone-6/core/admin-ui/context');
require('@keystone-6/core/fields/types/relationship/views/RelationshipSelect');
require('@keystone-ui/icons/icons/PlusCircleIcon');
require('@keystone-ui/modals');
require('@emotion/weak-memoize');
require('./layouts-ae143ec5.cjs.prod.js');

const LayoutOptionsContext = /*#__PURE__*/React.createContext([]);
const LayoutOptionsProvider = LayoutOptionsContext.Provider;

// UI Components
function LayoutContainer({
  attributes,
  children,
  element
}) {
  const {
    spacing
  } = core.useTheme();
  const focused = slateReact.useFocused();
  const selected = slateReact.useSelected();
  const editor = slateReact.useSlateStatic();
  const layout = element.layout;
  const layoutOptions = React.useContext(LayoutOptionsContext);
  const {
    dialog,
    trigger
  } = popover.useControlledPopover({
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
  return core.jsx("div", _extends({
    css: {
      marginBottom: spacing.medium,
      marginTop: spacing.medium,
      position: 'relative'
    }
  }, attributes), core.jsx("div", _extends({}, trigger.props, {
    ref: trigger.ref,
    css: {
      columnGap: spacing.small,
      display: 'grid',
      gridTemplateColumns: layout.map(x => `${x}fr`).join(' ')
    }
  }), children), focused && selected && core.jsx(toolbar.InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), core.jsx(toolbar.ToolbarGroup, null, layoutOptions.map((layoutOption, i) => core.jsx(toolbar.ToolbarButton, {
    isSelected: layoutOption.toString() === layout.toString(),
    key: i,
    onMouseDown: event => {
      event.preventDefault();
      const path = slateReact.ReactEditor.findPath(editor, element);
      slate.Transforms.setNodes(editor, {
        type: 'layout',
        layout: layoutOption
      }, {
        at: path
      });
    }
  }, makeLayoutIcon(layoutOption))), core.jsx(toolbar.ToolbarSeparator, null), core.jsx(tooltip.Tooltip, {
    content: "Remove",
    weight: "subtle"
  }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
    variant: "destructive",
    onMouseDown: event => {
      event.preventDefault();
      const path = slateReact.ReactEditor.findPath(editor, element);
      slate.Transforms.removeNodes(editor, {
        at: path
      });
    }
  }, attrs), core.jsx(Trash2Icon.Trash2Icon, {
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
  } = core.useTheme();
  return core.jsx("div", _extends({
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
  const element = core.jsx("div", {
    role: "img",
    css: {
      display: 'grid',
      gridTemplateColumns: ratios.map(r => `${r}fr`).join(' '),
      gap: 2,
      width: size,
      height: size
    }
  }, ratios.map((_, i) => {
    return core.jsx("div", {
      key: i,
      css: {
        backgroundColor: 'currentcolor',
        borderRadius: 1
      }
    });
  }));
  return element;
}
const layoutsIcon = core.jsx(ColumnsIcon.ColumnsIcon, {
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
  } = toolbarState.useToolbarState();
  return React.useMemo(() => core.jsx(tooltip.Tooltip, {
    content: "Layouts",
    weight: "subtle"
  }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
    isSelected: isSelected,
    onMouseDown: event => {
      event.preventDefault();
      if (utils.isElementActive(editor, 'layout')) {
        slate.Transforms.unwrapNodes(editor, {
          match: node => node.type === 'layout'
        });
        return;
      }
      layoutsShared.insertLayout(editor, layouts[0]);
    }
  }, attrs), layoutsIcon)), [editor, isSelected, layouts]);
}

exports.LayoutArea = LayoutArea;
exports.LayoutContainer = LayoutContainer;
exports.LayoutOptionsProvider = LayoutOptionsProvider;
exports.LayoutsButton = LayoutsButton;

'use client';
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@keystone-ui/core');
var fields = require('@keystone-ui/fields');
var slate = require('slate');
var documentRenderer = require('@keystone-6/document-renderer');
var components = require('@keystone-6/core/admin-ui/components');
var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var isHotkey = require('is-hotkey');
var slateReact = require('slate-react');
var editorShared = require('../../dist/editor-shared-67872be6.cjs.dev.js');
var utils = require('../../dist/utils-efe9b207.cjs.dev.js');
var applyRef = require('apply-ref');
var popover = require('@keystone-ui/popover');
var tooltip = require('@keystone-ui/tooltip');
var BoldIcon = require('@keystone-ui/icons/icons/BoldIcon');
var ItalicIcon = require('@keystone-ui/icons/icons/ItalicIcon');
var PlusIcon = require('@keystone-ui/icons/icons/PlusIcon');
var ChevronDownIcon = require('@keystone-ui/icons/icons/ChevronDownIcon');
var Maximize2Icon = require('@keystone-ui/icons/icons/Maximize2Icon');
var Minimize2Icon = require('@keystone-ui/icons/icons/Minimize2Icon');
var MoreHorizontalIcon = require('@keystone-ui/icons/icons/MoreHorizontalIcon');
var toolbar = require('../../dist/toolbar-e069925b.cjs.dev.js');
require('../../dist/orderable-13791705.cjs.dev.js');
var LinkIcon = require('@keystone-ui/icons/icons/LinkIcon');
var Trash2Icon = require('@keystone-ui/icons/icons/Trash2Icon');
var ExternalLinkIcon = require('@keystone-ui/icons/icons/ExternalLinkIcon');
var toolbarState = require('../../dist/toolbar-state-00fec422.cjs.dev.js');
var isValidURL = require('../../dist/isValidURL-23f0583b.cjs.dev.js');
var layouts = require('../../dist/layouts-807200de.cjs.dev.js');
var layoutsShared = require('../../dist/layouts-shared-f3c33d4d.cjs.dev.js');
var CodeIcon = require('@keystone-ui/icons/icons/CodeIcon');
var AlignLeftIcon = require('@keystone-ui/icons/icons/AlignLeftIcon');
var AlignRightIcon = require('@keystone-ui/icons/icons/AlignRightIcon');
var AlignCenterIcon = require('@keystone-ui/icons/icons/AlignCenterIcon');
var MinusIcon = require('@keystone-ui/icons/icons/MinusIcon');
var matchSorter = require('match-sorter');
var scrollIntoView = require('scroll-into-view-if-needed');
var weakMemoize = require('@emotion/weak-memoize');
require('slate-history');
require('mdast-util-from-markdown');
require('mdast-util-gfm-autolink-literal/from-markdown');
require('micromark-extension-gfm-autolink-literal');
require('mdast-util-gfm-strikethrough/from-markdown');
require('micromark-extension-gfm-strikethrough');
require('@dnd-kit/core');
require('@dnd-kit/sortable');
require('@dnd-kit/modifiers');
require('@keystone-ui/button');
require('../../dist/api-95d85239.cjs.dev.js');
require('@keystone-6/core');
require('../../dist/form-from-preview-39367d1c.cjs.dev.js');
require('@keystone-6/core/admin-ui/context');
require('@keystone-6/core/fields/types/relationship/views/RelationshipSelect');
require('@keystone-ui/icons/icons/PlusCircleIcon');
require('@keystone-ui/modals');
require('@braintree/sanitize-url');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var isHotkey__default = /*#__PURE__*/_interopDefault(isHotkey);
var scrollIntoView__default = /*#__PURE__*/_interopDefault(scrollIntoView);
var weakMemoize__default = /*#__PURE__*/_interopDefault(weakMemoize);

function LinkElement({
  attributes,
  children,
  element: __elementForGettingPath
}) {
  const {
    typography
  } = core.useTheme();
  const editor = slateReact.useSlateStatic();
  const [currentElement, setNode] = toolbarState.useElementWithSetNodes(editor, __elementForGettingPath);
  const href = currentElement.href;
  const selected = slateReact.useSelected();
  const focused = slateReact.useFocused();
  const [focusedInInlineDialog, setFocusedInInlineDialog] = React.useState(false);
  // we want to show the link dialog when the editor is focused and the link element is selected
  // or when the input inside the dialog is focused so you would think that would look like this:
  // (selected && focused) || focusedInInlineDialog
  // this doesn't work though because the blur will happen before the focus is inside the inline dialog
  // so this component would be rendered and focused would be false so the input would be removed so it couldn't be focused
  // to fix this, we delay our reading of the updated `focused` value so that we'll still render the dialog
  // immediately after the editor is blurred but before the input has been focused
  const [delayedFocused, setDelayedFocused] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => {
      setDelayedFocused(focused);
    }, 0);
    return () => {
      clearTimeout(id);
    };
  }, [focused]);
  const [localForceValidation, setLocalForceValidation] = React.useState(false);
  const {
    dialog,
    trigger
  } = popover.useControlledPopover({
    isOpen: selected && focused || focusedInInlineDialog,
    onClose: () => {}
  }, {
    placement: 'bottom-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  const unlink = toolbarState.useEventCallback(() => {
    slate.Transforms.unwrapNodes(editor, {
      at: slateReact.ReactEditor.findPath(editor, __elementForGettingPath)
    });
  });
  const forceValidation = toolbarState.useForceValidation();
  const showInvalidState = isValidURL.isValidURL(href) ? false : forceValidation || localForceValidation;
  return core.jsx("span", _extends({}, attributes, {
    css: {
      position: 'relative',
      display: 'inline-block'
    }
  }), core.jsx("a", _extends({}, trigger.props, {
    css: {
      color: showInvalidState ? 'red' : undefined
    },
    ref: trigger.ref,
    href: href
  }), children), (selected && delayedFocused || focusedInInlineDialog) && core.jsx(toolbar.InlineDialog, _extends({}, dialog.props, {
    ref: dialog.ref,
    onFocus: () => {
      setFocusedInInlineDialog(true);
    },
    onBlur: () => {
      setFocusedInInlineDialog(false);
      setLocalForceValidation(true);
    }
  }), core.jsx("div", {
    css: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, core.jsx(toolbar.ToolbarGroup, null, core.jsx("input", {
    css: {
      fontSize: typography.fontSize.small,
      width: 240
    },
    value: href,
    onChange: event => {
      setNode({
        href: event.target.value
      });
    }
  }), core.jsx(tooltip.Tooltip, {
    content: "Open link in new tab",
    weight: "subtle"
  }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
    as: "a",
    onMouseDown: event => {
      event.preventDefault();
    },
    href: href,
    target: "_blank",
    rel: "noreferrer",
    variant: "action"
  }, attrs), externalLinkIcon)), separator, core.jsx(UnlinkButton, {
    onUnlink: unlink
  })), showInvalidState && core.jsx("span", {
    css: {
      color: 'red'
    }
  }, "Please enter a valid URL"))));
}
const separator = core.jsx(toolbar.ToolbarSeparator, null);
const externalLinkIcon = core.jsx(ExternalLinkIcon.ExternalLinkIcon, {
  size: "small"
});
const UnlinkButton = /*#__PURE__*/React.memo(function UnlinkButton({
  onUnlink
}) {
  return core.jsx(tooltip.Tooltip, {
    content: "Unlink",
    weight: "subtle"
  }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
    variant: "destructive",
    onMouseDown: event => {
      event.preventDefault();
      onUnlink();
    }
  }, attrs), core.jsx(Trash2Icon.Trash2Icon, {
    size: "small"
  })));
});
const linkIcon = core.jsx(LinkIcon.LinkIcon, {
  size: "small"
});
const LinkButton = /*#__PURE__*/React.forwardRef(function LinkButton(props, ref) {
  const {
    editor,
    links: {
      isDisabled,
      isSelected
    }
  } = toolbarState.useToolbarState();
  return React.useMemo(() => core.jsx(toolbar.ToolbarButton, _extends({
    ref: ref,
    isDisabled: isDisabled,
    isSelected: isSelected,
    onMouseDown: event => {
      event.preventDefault();
      editorShared.wrapLink(editor, '');
    }
  }, props), linkIcon), [isSelected, isDisabled, editor, props, ref]);
});
const linkButton = core.jsx(tooltip.Tooltip, {
  content: "Link",
  weight: "subtle"
}, attrs => core.jsx(LinkButton, attrs));

const ListButton = /*#__PURE__*/React.forwardRef(function ListButton(props, ref) {
  const {
    editor,
    lists: {
      [props.type === 'ordered-list' ? 'ordered' : 'unordered']: {
        isDisabled,
        isSelected
      }
    }
  } = toolbarState.useToolbarState();
  return React.useMemo(() => {
    const {
      type,
      ...restProps
    } = props;
    return core.jsx(toolbar.ToolbarButton, _extends({
      ref: ref,
      isDisabled: isDisabled,
      isSelected: isSelected,
      onMouseDown: event => {
        event.preventDefault();
        layoutsShared.toggleList(editor, type);
      }
    }, restProps));
  }, [props, ref, isDisabled, isSelected, editor]);
});

const BlockquoteElement = ({
  attributes,
  children
}) => {
  const {
    colors,
    spacing
  } = core.useTheme();
  return core.jsx("blockquote", _extends({
    css: {
      borderLeft: '3px solid #CBD5E0',
      color: colors.foregroundDim,
      margin: 0,
      padding: `0 ${spacing.xlarge}px`
    }
  }, attributes), children);
};
const BlockquoteButton = ({
  attrs
}) => {
  const {
    editor,
    blockquote: {
      isDisabled,
      isSelected
    }
  } = toolbarState.useToolbarState();
  return React.useMemo(() => core.jsx(toolbar.ToolbarButton, _extends({
    isSelected: isSelected,
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      editorShared.insertBlockquote(editor);
    }
  }, attrs), core.jsx(QuoteIcon, null)), [editor, attrs, isDisabled, isSelected]);
};
const blockquoteButton = core.jsx(tooltip.Tooltip, {
  content: core.jsx(React.Fragment, null, "Quote", core.jsx(toolbar.KeyboardInTooltip, null, '> ')),
  weight: "subtle"
}, attrs => core.jsx(BlockquoteButton, {
  attrs: attrs
}));
const QuoteIcon = () => core.jsx(IconBase, null, core.jsx("path", {
  d: "M11.3031 2C9.83843 2 8.64879 3.22321 8.64879 4.73171C8.64879 6.23928 9.83843 7.46342 11.3031 7.46342C13.8195 7.46342 12.3613 12.2071 9.18767 12.7012C9.03793 12.7239 8.90127 12.7995 8.80243 12.9143C8.70358 13.029 8.64908 13.1754 8.64879 13.3268C8.64879 13.7147 8.99561 14.0214 9.37973 13.9627C15.148 13.0881 17.1991 2.00093 11.3031 2.00093V2ZM3.65526 2C2.18871 2 1 3.22228 1 4.73171C1 6.23835 2.18871 7.46155 3.65526 7.46155C6.17067 7.46155 4.71252 12.2071 1.53888 12.7012C1.3893 12.7239 1.25277 12.7993 1.15394 12.9139C1.05511 13.0285 1.00051 13.1746 1 13.3259C1 13.7137 1.34682 14.0205 1.73001 13.9617C7.50016 13.0872 9.55128 2 3.65526 2Z"
}));

function CodeButton({
  attrs
}) {
  const {
    editor,
    code: {
      isDisabled,
      isSelected
    }
  } = toolbarState.useToolbarState();
  return React.useMemo(() => core.jsx(toolbar.ToolbarButton, _extends({
    isSelected: isSelected,
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      if (isSelected) {
        slate.Transforms.unwrapNodes(editor, {
          match: node => node.type === 'code'
        });
      } else {
        slate.Transforms.wrapNodes(editor, {
          type: 'code',
          children: [{
            text: ''
          }]
        });
      }
    }
  }, attrs), core.jsx(CodeIcon.CodeIcon, {
    size: "small"
  })), [isDisabled, isSelected, attrs, editor]);
}
const codeButton = core.jsx(tooltip.Tooltip, {
  weight: "subtle",
  content: core.jsx(React.Fragment, null, "Code block ", core.jsx(toolbar.KeyboardInTooltip, null, "```"))
}, attrs => core.jsx(CodeButton, {
  attrs: attrs
}));

function TextAlignMenu({
  alignment
}) {
  const [showMenu, setShowMenu] = React.useState(false);
  const {
    dialog,
    trigger
  } = popover.useControlledPopover({
    isOpen: showMenu,
    onClose: () => setShowMenu(false)
  }, {
    placement: 'bottom-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return core.jsx("div", {
    css: {
      display: 'inline-block',
      position: 'relative'
    }
  }, core.jsx(tooltip.Tooltip, {
    content: "Text alignment",
    weight: "subtle"
  }, attrs => core.jsx(TextAlignButton, {
    attrs: attrs,
    onToggle: () => {
      setShowMenu(x => !x);
    },
    trigger: trigger,
    showMenu: showMenu
  })), showMenu ? core.jsx(toolbar.InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), core.jsx(TextAlignDialog, {
    alignment: alignment,
    onClose: () => {
      setShowMenu(false);
    }
  })) : null);
}
function TextAlignDialog({
  alignment,
  onClose
}) {
  const {
    alignment: {
      selected
    },
    editor
  } = toolbarState.useToolbarState();
  const alignments = ['start', ...Object.keys(alignment).filter(key => alignment[key])];
  return core.jsx(toolbar.ToolbarGroup, null, alignments.map(alignment => core.jsx(tooltip.Tooltip, {
    key: alignment,
    content: `Align ${alignment}`,
    weight: "subtle"
  }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
    isSelected: selected === alignment,
    onMouseDown: event => {
      event.preventDefault();
      if (alignment === 'start') {
        slate.Transforms.unsetNodes(editor, 'textAlign', {
          match: node => node.type === 'paragraph' || node.type === 'heading'
        });
      } else {
        slate.Transforms.setNodes(editor, {
          textAlign: alignment
        }, {
          match: node => node.type === 'paragraph' || node.type === 'heading'
        });
      }
      onClose();
    }
  }, attrs), alignmentIcons[alignment]))));
}
const alignmentIcons = {
  start: core.jsx(AlignLeftIcon.AlignLeftIcon, {
    size: "small"
  }),
  center: core.jsx(AlignCenterIcon.AlignCenterIcon, {
    size: "small"
  }),
  end: core.jsx(AlignRightIcon.AlignRightIcon, {
    size: "small"
  })
};
function TextAlignButton(props) {
  const {
    alignment: {
      isDisabled,
      selected
    }
  } = toolbarState.useToolbarState();
  return React.useMemo(() => core.jsx(toolbar.ToolbarButton, _extends({
    isDisabled: isDisabled,
    isPressed: props.showMenu,
    onMouseDown: event => {
      event.preventDefault();
      props.onToggle();
    }
  }, props.attrs, props.trigger.props, {
    ref: applyRef.applyRefs(props.attrs.ref, props.trigger.ref)
  }), alignmentIcons[selected], downIcon$1), [isDisabled, selected, props]);
}
const downIcon$1 = core.jsx(ChevronDownIcon.ChevronDownIcon, {
  size: "small"
});

const minusIcon = /*#__PURE__*/React__default["default"].createElement(MinusIcon.MinusIcon, {
  size: "small"
});
function DividerButton({
  attrs
}) {
  const {
    editor,
    dividers: {
      isDisabled
    }
  } = toolbarState.useToolbarState();
  return React.useMemo(() => /*#__PURE__*/React__default["default"].createElement(toolbar.ToolbarButton, _extends({
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      editorShared.insertDivider(editor);
    }
  }, attrs), minusIcon), [editor, isDisabled, attrs]);
}
const dividerButton = /*#__PURE__*/React__default["default"].createElement(tooltip.Tooltip, {
  content: /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, "Divider", /*#__PURE__*/React__default["default"].createElement(toolbar.KeyboardInTooltip, null, "---")),
  weight: "subtle"
}, attrs => /*#__PURE__*/React__default["default"].createElement(DividerButton, {
  attrs: attrs
}));

function Toolbar({
  documentFeatures,
  viewState
}) {
  const relationship = React.useContext(toolbarState.DocumentFieldRelationshipsContext);
  const blockComponent = React.useContext(toolbarState.ComponentBlockContext);
  const hasBlockItems = Object.entries(relationship).length || Object.keys(blockComponent).length;
  const hasMarks = Object.values(documentFeatures.formatting.inlineMarks).some(x => x);
  return core.jsx(ToolbarContainer, null, core.jsx(toolbar.ToolbarGroup, null, !!documentFeatures.formatting.headingLevels.length && core.jsx(HeadingMenu, {
    headingLevels: documentFeatures.formatting.headingLevels
  }), hasMarks && core.jsx(InlineMarks, {
    marks: documentFeatures.formatting.inlineMarks
  }), hasMarks && core.jsx(toolbar.ToolbarSeparator, null), (documentFeatures.formatting.alignment.center || documentFeatures.formatting.alignment.end) && core.jsx(TextAlignMenu, {
    alignment: documentFeatures.formatting.alignment
  }), documentFeatures.formatting.listTypes.unordered && core.jsx(tooltip.Tooltip, {
    content: core.jsx(React.Fragment, null, "Bullet List ", core.jsx(toolbar.KeyboardInTooltip, null, "- ")),
    weight: "subtle"
  }, attrs => core.jsx(ListButton, _extends({
    type: "unordered-list"
  }, attrs), core.jsx(BulletListIcon, null))), documentFeatures.formatting.listTypes.ordered && core.jsx(tooltip.Tooltip, {
    content: core.jsx(React.Fragment, null, "Numbered List ", core.jsx(toolbar.KeyboardInTooltip, null, "1. ")),
    weight: "subtle"
  }, attrs => core.jsx(ListButton, _extends({
    type: "ordered-list"
  }, attrs), core.jsx(NumberedListIcon, null))), (documentFeatures.formatting.alignment.center || documentFeatures.formatting.alignment.end || documentFeatures.formatting.listTypes.unordered || documentFeatures.formatting.listTypes.ordered) && core.jsx(toolbar.ToolbarSeparator, null), documentFeatures.dividers && dividerButton, documentFeatures.links && linkButton, documentFeatures.formatting.blockTypes.blockquote && blockquoteButton, !!documentFeatures.layouts.length && core.jsx(layouts.LayoutsButton, {
    layouts: documentFeatures.layouts
  }), documentFeatures.formatting.blockTypes.code && codeButton, !!hasBlockItems && core.jsx(InsertBlockMenu, null)), React.useMemo(() => {
    const ExpandIcon = viewState !== null && viewState !== void 0 && viewState.expanded ? Minimize2Icon.Minimize2Icon : Maximize2Icon.Maximize2Icon;
    return viewState && core.jsx(toolbar.ToolbarGroup, null, core.jsx(toolbar.ToolbarSeparator, null), core.jsx(tooltip.Tooltip, {
      content: viewState.expanded ? 'Collapse' : 'Expand',
      weight: "subtle"
    }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
      onMouseDown: event => {
        event.preventDefault();
        viewState.toggle();
      }
    }, attrs), core.jsx(ExpandIcon, {
      size: "small"
    }))));
  }, [viewState]));
}

/* UI Components */

const MarkButton = /*#__PURE__*/React.forwardRef(function MarkButton(props, ref) {
  const {
    editor,
    marks: {
      [props.type]: {
        isDisabled,
        isSelected
      }
    }
  } = toolbarState.useToolbarState();
  return React.useMemo(() => {
    const {
      type,
      ...restProps
    } = props;
    return core.jsx(toolbar.ToolbarButton, _extends({
      ref: ref,
      isDisabled: isDisabled,
      isSelected: isSelected,
      onMouseDown: event => {
        event.preventDefault();
        if (isSelected) {
          slate.Editor.removeMark(editor, props.type);
        } else {
          slate.Editor.addMark(editor, props.type, true);
        }
      }
    }, restProps));
  }, [editor, isDisabled, isSelected, props, ref]);
});
const ToolbarContainer = ({
  children
}) => {
  const {
    colors,
    spacing
  } = core.useTheme();
  return core.jsx("div", {
    css: {
      borderBottom: `1px solid ${colors.border}`,
      background: colors.background,
      position: 'sticky',
      top: 0,
      zIndex: 2,
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit'
    }
  }, core.jsx("div", {
    css: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 40,
      paddingLeft: spacing.xsmall,
      paddingRight: spacing.xsmall
    }
  }, children));
};
const downIcon = core.jsx(ChevronDownIcon.ChevronDownIcon, {
  size: "small"
});
function HeadingButton({
  trigger,
  onToggleShowMenu,
  showMenu
}) {
  const {
    textStyles
  } = toolbarState.useToolbarState();
  const buttonLabel = textStyles.selected === 'normal' ? 'Normal text' : 'Heading ' + textStyles.selected;
  const isDisabled = textStyles.allowedHeadingLevels.length === 0;
  return React.useMemo(() => core.jsx(toolbar.ToolbarButton, _extends({
    ref: trigger.ref,
    isPressed: showMenu,
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      onToggleShowMenu();
    },
    style: {
      textAlign: 'left',
      width: 116
    }
  }, trigger.props), core.jsx("span", {
    css: {
      flex: 1
    }
  }, buttonLabel), downIcon), [buttonLabel, trigger, showMenu, onToggleShowMenu, isDisabled]);
}
const HeadingMenu = ({
  headingLevels
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const {
    dialog,
    trigger
  } = popover.useControlledPopover({
    isOpen: showMenu,
    onClose: () => setShowMenu(false)
  }, {
    placement: 'bottom-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return core.jsx("div", {
    css: {
      display: 'inline-block',
      position: 'relative'
    }
  }, core.jsx(HeadingButton, {
    showMenu: showMenu,
    trigger: trigger,
    onToggleShowMenu: () => {
      setShowMenu(x => !x);
    }
  }), showMenu ? core.jsx(toolbar.InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), core.jsx(HeadingDialog, {
    headingLevels: headingLevels,
    onCloseMenu: () => {
      setShowMenu(false);
    }
  })) : null);
};
function HeadingDialog({
  headingLevels,
  onCloseMenu
}) {
  const {
    editor,
    textStyles
  } = toolbarState.useToolbarState();
  return core.jsx(toolbar.ToolbarGroup, {
    direction: "column"
  }, headingLevels.map(hNum => {
    const Tag = `h${hNum}`;
    const isSelected = textStyles.selected === hNum;
    return core.jsx(toolbar.ToolbarButton, {
      key: hNum,
      isSelected: isSelected,
      onMouseDown: event => {
        event.preventDefault();
        if (isSelected) {
          slate.Transforms.unwrapNodes(editor, {
            match: n => n.type === 'heading'
          });
        } else {
          slate.Transforms.setNodes(editor, {
            type: 'heading',
            level: hNum
          }, {
            match: node => node.type === 'paragraph' || node.type === 'heading'
          });
        }
        onCloseMenu();
      }
    }, core.jsx(Tag, null, "Heading ", hNum));
  }));
}
function InsertBlockMenu() {
  const [showMenu, setShowMenu] = React.useState(false);
  const {
    dialog,
    trigger
  } = popover.useControlledPopover({
    isOpen: showMenu,
    onClose: () => setShowMenu(false)
  }, {
    placement: 'bottom-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return core.jsx("div", {
    css: {
      display: 'inline-block',
      position: 'relative'
    }
  }, core.jsx(tooltip.Tooltip, {
    content: core.jsx(React.Fragment, null, "Insert ", core.jsx(toolbar.KeyboardInTooltip, null, "/")),
    weight: "subtle"
  }, ({
    ref,
    ...attrs
  }) => core.jsx(toolbar.ToolbarButton, _extends({
    ref: applyRef.applyRefs(ref, trigger.ref),
    isPressed: showMenu,
    onMouseDown: event => {
      event.preventDefault();
      setShowMenu(v => !v);
    }
  }, trigger.props, attrs), core.jsx(PlusIcon.PlusIcon, {
    size: "small",
    style: {
      strokeWidth: 3
    }
  }), core.jsx(ChevronDownIcon.ChevronDownIcon, {
    size: "small"
  }))), showMenu ? core.jsx(toolbar.InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), core.jsx(toolbar.ToolbarGroup, {
    direction: "column"
  }, core.jsx(toolbarState.RelationshipButton, {
    onClose: () => setShowMenu(false)
  }), core.jsx(toolbarState.BlockComponentsButtons, {
    onClose: () => setShowMenu(false)
  }))) : null);
}
function InlineMarks({
  marks
}) {
  const [showMenu, setShowMenu] = React.useState(false);
  const {
    dialog,
    trigger
  } = popover.useControlledPopover({
    isOpen: showMenu,
    onClose: () => setShowMenu(false)
  }, {
    placement: 'bottom-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return core.jsx(React.Fragment, null, marks.bold && core.jsx(tooltip.Tooltip, {
    content: core.jsx(React.Fragment, null, "Bold", core.jsx(toolbar.KeyboardInTooltip, null, utils.modifierKeyText, "B")),
    weight: "subtle"
  }, attrs => core.jsx(MarkButton, _extends({
    type: "bold"
  }, attrs), core.jsx(BoldIcon.BoldIcon, {
    size: "small",
    style: {
      strokeWidth: 3
    }
  }))), marks.italic && core.jsx(tooltip.Tooltip, {
    content: core.jsx(React.Fragment, null, "Italic", core.jsx(toolbar.KeyboardInTooltip, null, utils.modifierKeyText, "I")),
    weight: "subtle"
  }, attrs => core.jsx(MarkButton, _extends({
    type: "italic"
  }, attrs), core.jsx(ItalicIcon.ItalicIcon, {
    size: "small"
  }))), core.jsx(tooltip.Tooltip, {
    content: "More formatting",
    weight: "subtle"
  }, attrs => core.jsx(MoreFormattingButton, {
    isOpen: showMenu,
    onToggle: () => {
      setShowMenu(v => !v);
    },
    trigger: trigger,
    attrs: attrs
  })), showMenu && core.jsx(MoreFormattingDialog, {
    onCloseMenu: () => {
      setShowMenu(false);
    },
    dialog: dialog,
    marks: marks
  }));
}
function MoreFormattingDialog({
  dialog,
  marks,
  onCloseMenu
}) {
  // not doing optimisations in here because this will only render when it's open
  // which will be rare and you won't be typing while it's open
  const {
    editor,
    clearFormatting: {
      isDisabled
    }
  } = toolbarState.useToolbarState();
  return core.jsx(toolbar.InlineDialog, _extends({
    onMouseDown: event => {
      if (event.target instanceof HTMLElement && event.target.closest('button')) {
        onCloseMenu();
      }
    },
    ref: dialog.ref
  }, dialog.props), core.jsx(toolbar.ToolbarGroup, {
    direction: "column"
  }, marks.underline && core.jsx(MarkButton, {
    type: "underline"
  }, core.jsx(ContentInButtonWithShortcut, {
    content: "Underline",
    shortcut: `${utils.modifierKeyText}U`
  })), marks.strikethrough && core.jsx(MarkButton, {
    type: "strikethrough"
  }, "Strikethrough"), marks.code && core.jsx(MarkButton, {
    type: "code"
  }, "Code"), marks.keyboard && core.jsx(MarkButton, {
    type: "keyboard"
  }, "Keyboard"), marks.subscript && core.jsx(MarkButton, {
    type: "subscript"
  }, "Subscript"), marks.superscript && core.jsx(MarkButton, {
    type: "superscript"
  }, "Superscript"), core.jsx(toolbar.ToolbarButton, {
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      utils.clearFormatting(editor);
    }
  }, core.jsx(ContentInButtonWithShortcut, {
    content: "Clear Formatting",
    shortcut: `${utils.modifierKeyText}\\`
  }))));
}
function ContentInButtonWithShortcut({
  content,
  shortcut
}) {
  const theme = core.useTheme();
  return core.jsx("span", {
    css: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }
  }, core.jsx("span", null, content), core.jsx("kbd", {
    css: {
      fontFamily: 'inherit',
      marginLeft: theme.spacing.small,
      padding: theme.spacing.xxsmall,
      paddingLeft: theme.spacing.xsmall,
      paddingRight: theme.spacing.xsmall,
      backgroundColor: theme.palette.neutral400,
      borderRadius: theme.radii.xsmall,
      color: theme.colors.foregroundDim,
      whiteSpace: 'pre'
    }
  }, shortcut));
}
function MoreFormattingButton({
  onToggle,
  isOpen,
  trigger,
  attrs
}) {
  const {
    marks
  } = toolbarState.useToolbarState();
  const isActive = marks.strikethrough.isSelected || marks.underline.isSelected || marks.code.isSelected || marks.keyboard.isSelected || marks.subscript.isSelected || marks.superscript.isSelected;
  return React.useMemo(() => core.jsx(toolbar.ToolbarButton, _extends({
    isPressed: isOpen,
    isSelected: isActive,
    onMouseDown: event => {
      event.preventDefault();
      onToggle();
    }
  }, trigger.props, attrs, {
    ref: applyRef.applyRefs(attrs.ref, trigger.ref)
  }), core.jsx(MoreHorizontalIcon.MoreHorizontalIcon, {
    size: "small"
  })), [isActive, onToggle, isOpen, trigger, attrs]);
}

// Custom (non-feather) Icons
// ------------------------------

const IconBase = props => core.jsx("svg", _extends({
  "aria-hidden": "true",
  fill: "currentColor",
  focusable: "false",
  height: "16",
  role: "presentation",
  viewBox: "0 0 16 16",
  width: "16"
}, props));
const BulletListIcon = () => core.jsx(IconBase, null, core.jsx("path", {
  d: "M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"
}));
const NumberedListIcon = () => core.jsx(IconBase, null, core.jsx("path", {
  d: "M2.003 2.5a.5.5 0 00-.723-.447l-1.003.5a.5.5 0 00.446.895l.28-.14V6H.5a.5.5 0 000 1h2.006a.5.5 0 100-1h-.503V2.5zM5 3.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 3.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM.924 10.32l.003-.004a.851.851 0 01.144-.153A.66.66 0 011.5 10c.195 0 .306.068.374.146a.57.57 0 01.128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 00.5.5h2.003a.5.5 0 000-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.858 1.858 0 00-.348.384l-.007.011-.002.004-.001.002-.001.001a.5.5 0 00.851.525zM.5 10.055l-.427-.26.427.26z"
}));

const headingStylesMap = {
  h1: {
    fontSize: '2.2rem'
  },
  h2: {
    fontSize: '1.8rem'
  },
  h3: {
    fontSize: '1.5rem'
  },
  h4: {
    fontSize: '1.2rem'
  },
  h5: {
    fontSize: '0.83rem'
  },
  h6: {
    fontSize: '0.67rem'
  }
};
function HeadingElement({
  attributes,
  children,
  element
}) {
  const Tag = `h${element.level}`;
  const headingStyle = headingStylesMap[Tag];
  return core.jsx(Tag, _extends({}, attributes, {
    css: {
      ...headingStyle,
      textAlign: element.textAlign
    }
  }), children);
}

// some of the renderers read properties of the element
// and TS doesn't understand the type narrowing when doing a spread for some reason
// so that's why things aren't being spread in some cases
const renderElement = props => {
  switch (props.element.type) {
    case 'layout':
      return core.jsx(layouts.LayoutContainer, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'layout-area':
      return core.jsx(layouts.LayoutArea, props);
    case 'code':
      return core.jsx(CodeElement, props);
    case 'component-block':
      {
        return core.jsx(toolbarState.ComponentBlocksElement, {
          attributes: props.attributes,
          children: props.children,
          element: props.element
        });
      }
    case 'component-inline-prop':
    case 'component-block-prop':
      return core.jsx(toolbarState.ComponentInlineProp, props);
    case 'heading':
      return core.jsx(HeadingElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'link':
      return core.jsx(LinkElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'ordered-list':
      return core.jsx("ol", props.attributes, props.children);
    case 'unordered-list':
      return core.jsx("ul", props.attributes, props.children);
    case 'list-item':
      return core.jsx("li", props.attributes, props.children);
    case 'list-item-content':
      return core.jsx("span", props.attributes, props.children);
    case 'blockquote':
      return core.jsx(BlockquoteElement, props);
    case 'relationship':
      return core.jsx(toolbarState.RelationshipElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'divider':
      return core.jsx(DividerElement, props);
    default:
      return core.jsx("p", _extends({
        css: {
          textAlign: props.element.textAlign
        }
      }, props.attributes), props.children);
  }
};

/* Block Elements */

const CodeElement = ({
  attributes,
  children
}) => {
  const {
    colors,
    radii,
    spacing,
    typography
  } = core.useTheme();
  return core.jsx("pre", _extends({
    spellCheck: "false",
    css: {
      backgroundColor: colors.backgroundDim,
      border: `1px solid ${colors.border}`,
      borderRadius: radii.xsmall,
      fontFamily: typography.fontFamily.monospace,
      fontSize: typography.fontSize.small,
      padding: `${spacing.small}px ${spacing.medium}px`,
      overflowX: 'auto'
    }
  }, attributes), core.jsx("code", {
    css: {
      fontFamily: 'inherit'
    }
  }, children));
};
const DividerElement = ({
  attributes,
  children
}) => {
  const {
    colors,
    spacing
  } = core.useTheme();
  const selected = slateReact.useSelected();
  return core.jsx("div", _extends({}, attributes, {
    css: {
      paddingBottom: spacing.medium,
      paddingTop: spacing.medium,
      marginBottom: spacing.medium,
      marginTop: spacing.medium,
      caretColor: 'transparent'
    }
  }), core.jsx("hr", {
    css: {
      backgroundColor: selected ? colors.linkColor : colors.border,
      border: 0,
      height: 2
    }
  }), children);
};

function noop() {}
function getOptions(toolbarState$1, componentBlocks, relationships) {
  const options = [...Object.entries(relationships).map(([relationship, {
    label
  }]) => ({
    label,
    insert: editor => {
      slate.Transforms.insertNodes(editor, {
        type: 'relationship',
        relationship,
        data: null,
        children: [{
          text: ''
        }]
      });
    }
  })), ...Object.keys(componentBlocks).map(key => ({
    label: componentBlocks[key].label,
    insert: editor => {
      toolbarState.insertComponentBlock(editor, componentBlocks, key);
    }
  })), ...toolbarState$1.textStyles.allowedHeadingLevels.filter(a => toolbarState$1.editorDocumentFeatures.formatting.headingLevels.includes(a)).map(level => ({
    label: `Heading ${level}`,
    insert(editor) {
      utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'heading',
        level,
        children: [{
          text: ''
        }]
      });
    }
  })), !toolbarState$1.blockquote.isDisabled && toolbarState$1.editorDocumentFeatures.formatting.blockTypes.blockquote && {
    label: 'Blockquote',
    insert(editor) {
      utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'blockquote',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState$1.code.isDisabled && toolbarState$1.editorDocumentFeatures.formatting.blockTypes.code && {
    label: 'Code block',
    insert(editor) {
      utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'code',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState$1.dividers.isDisabled && toolbarState$1.editorDocumentFeatures.dividers && {
    label: 'Divider',
    insert(editor) {
      utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'divider',
        children: [{
          text: ''
        }]
      });
    }
  }, !!toolbarState$1.editorDocumentFeatures.layouts.length && {
    label: 'Layout',
    insert(editor) {
      layoutsShared.insertLayout(editor, toolbarState$1.editorDocumentFeatures.layouts[0]);
    }
  }, !toolbarState$1.lists.ordered.isDisabled && toolbarState$1.editorDocumentFeatures.formatting.listTypes.ordered && {
    label: 'Numbered List',
    keywords: ['ordered list'],
    insert(editor) {
      utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'ordered-list',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState$1.lists.unordered.isDisabled && toolbarState$1.editorDocumentFeatures.formatting.listTypes.unordered && {
    label: 'Bullet List',
    keywords: ['unordered list'],
    insert(editor) {
      utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'unordered-list',
        children: [{
          text: ''
        }]
      });
    }
  }];
  return options.filter(x => typeof x !== 'boolean');
}
function insertOption(editor, text, option) {
  const path = slateReact.ReactEditor.findPath(editor, text);
  slate.Transforms.delete(editor, {
    at: {
      focus: slate.Editor.start(editor, path),
      anchor: slate.Editor.end(editor, path)
    }
  });
  option.insert(editor);
}

// TODO: the changing width of the menu when searching isn't great
function InsertMenu({
  children,
  text
}) {
  const toolbarState$1 = toolbarState.useToolbarState();
  const {
    editor,
    relationships: {
      isDisabled: relationshipsDisabled
    }
  } = toolbarState$1;
  const {
    dialog,
    trigger
  } = popover.useControlledPopover({
    isOpen: true,
    onClose: noop
  }, {
    placement: 'bottom-start'
  });
  const componentBlocks = React.useContext(toolbarState.ComponentBlockContext);
  const relationships = toolbarState.useDocumentFieldRelationships();
  const options = matchSorter.matchSorter(getOptions(toolbarState$1, componentBlocks, relationshipsDisabled ? {} : relationships), text.text.slice(1), {
    keys: ['label', 'keywords']
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  if (options.length && selectedIndex >= options.length) {
    setSelectedIndex(0);
  }
  const stateRef = React.useRef({
    selectedIndex,
    options,
    text
  });
  React.useEffect(() => {
    stateRef.current = {
      selectedIndex,
      options,
      text
    };
  });
  const dialogRef = React.useRef(null);
  React.useEffect(() => {
    var _dialogRef$current;
    const element = (_dialogRef$current = dialogRef.current) === null || _dialogRef$current === void 0 || (_dialogRef$current = _dialogRef$current.children) === null || _dialogRef$current === void 0 ? void 0 : _dialogRef$current[selectedIndex];
    if (dialogRef.current && element) {
      scrollIntoView__default["default"](element, {
        scrollMode: 'if-needed',
        boundary: dialogRef.current,
        block: 'nearest'
      });
    }
  }, [selectedIndex]);
  React.useEffect(() => {
    const domNode = slateReact.ReactEditor.toDOMNode(editor, editor);
    const listener = event => {
      if (event.defaultPrevented) return;
      switch (event.key) {
        case 'ArrowDown':
          {
            if (stateRef.current.options.length) {
              event.preventDefault();
              setSelectedIndex(stateRef.current.selectedIndex === stateRef.current.options.length - 1 ? 0 : stateRef.current.selectedIndex + 1);
            }
            return;
          }
        case 'ArrowUp':
          {
            if (stateRef.current.options.length) {
              event.preventDefault();
              setSelectedIndex(stateRef.current.selectedIndex === 0 ? stateRef.current.options.length - 1 : stateRef.current.selectedIndex - 1);
            }
            return;
          }
        case 'Enter':
          {
            const option = stateRef.current.options[stateRef.current.selectedIndex];
            if (option) {
              insertOption(editor, stateRef.current.text, option);
              event.preventDefault();
            }
            return;
          }
        case 'Escape':
          {
            const path = slateReact.ReactEditor.findPath(editor, stateRef.current.text);
            slate.Transforms.unsetNodes(editor, 'insertMenu', {
              at: path
            });
            event.preventDefault();
            return;
          }
      }
    };
    domNode.addEventListener('keydown', listener);
    return () => {
      domNode.removeEventListener('keydown', listener);
    };
  }, [editor]);
  const DIALOG_HEIGHT = 300;
  return core.jsx(React.Fragment, null, core.jsx("span", _extends({}, trigger.props, {
    css: {
      color: 'blue'
    },
    ref: trigger.ref
  }), children), core.jsx(core.Portal, null, core.jsx(toolbar.InlineDialog, _extends({
    contentEditable: false
  }, dialog.props, {
    css: {
      display: options.length ? undefined : 'none',
      userSelect: 'none',
      maxHeight: DIALOG_HEIGHT,
      zIndex: 3
    },
    ref: dialog.ref
  }), core.jsx("div", {
    ref: dialogRef,
    css: {
      overflowY: 'auto',
      maxHeight: DIALOG_HEIGHT - 8 * 2
    }
  }, options.map((option, index) => core.jsx(toolbar.ToolbarButton, {
    key: option.label,
    isPressed: index === selectedIndex,
    onMouseEnter: () => {
      setSelectedIndex(index);
    },
    onMouseDown: event => {
      event.preventDefault();
      insertOption(editor, text, option);
    }
  }, option.label))))));
}

/** @jsxRuntime classic */
function Placeholder({
  placeholder,
  children
}) {
  const [width, setWidth] = React.useState(0);
  return core.jsx("span", {
    css: {
      position: 'relative',
      display: 'inline-block',
      width
    }
  }, core.jsx("span", {
    contentEditable: false,
    style: {
      position: 'absolute',
      pointerEvents: 'none',
      display: 'inline-block',
      left: 0,
      top: 0,
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      opacity: '0.5',
      userSelect: 'none',
      fontStyle: 'normal',
      fontWeight: 'normal',
      textDecoration: 'none',
      textAlign: 'left'
    }
  }, core.jsx("span", {
    ref: node => {
      if (node) {
        const offsetWidth = node.offsetWidth;
        if (offsetWidth !== width) {
          setWidth(offsetWidth);
        }
      }
    }
  }, placeholder)), children);
}
const Leaf = ({
  leaf,
  text,
  children,
  attributes
}) => {
  const {
    colors,
    radii,
    spacing,
    typography
  } = core.useTheme();
  const {
    underline,
    strikethrough,
    bold,
    italic,
    code,
    keyboard,
    superscript,
    subscript,
    placeholder,
    insertMenu
  } = leaf;
  if (placeholder !== undefined) {
    children = core.jsx(Placeholder, {
      placeholder: placeholder
    }, children);
  }
  if (insertMenu) {
    children = core.jsx(InsertMenu, {
      text: text
    }, children);
  }
  if (code) {
    children = core.jsx("code", {
      css: {
        backgroundColor: colors.backgroundDim,
        borderRadius: radii.xsmall,
        display: 'inline-block',
        fontFamily: typography.fontFamily.monospace,
        fontSize: typography.fontSize.small,
        padding: `0 ${spacing.xxsmall}px`
      }
    }, children);
  }
  if (bold) {
    children = core.jsx("strong", null, children);
  }
  if (strikethrough) {
    children = core.jsx("s", null, children);
  }
  if (italic) {
    children = core.jsx("em", null, children);
  }
  if (keyboard) {
    children = core.jsx("kbd", null, children);
  }
  if (superscript) {
    children = core.jsx("sup", null, children);
  }
  if (subscript) {
    children = core.jsx("sub", null, children);
  }
  if (underline) {
    children = core.jsx("u", null, children);
  }
  return core.jsx("span", attributes, children);
};
const renderLeaf = props => {
  return core.jsx(Leaf, props);
};

const styles = {
  flex: 1,
  'ol ol ol ol ol ol ol ol ol': {
    listStyle: 'lower-roman'
  },
  'ol ol ol ol ol ol ol ol': {
    listStyle: 'lower-alpha'
  },
  'ol ol ol ol ol ol ol': {
    listStyle: 'decimal'
  },
  'ol ol ol ol ol ol': {
    listStyle: 'lower-roman'
  },
  'ol ol ol ol ol': {
    listStyle: 'lower-alpha'
  },
  'ol ol ol ol': {
    listStyle: 'decimal'
  },
  'ol ol ol': {
    listStyle: 'lower-roman'
  },
  'ol ol': {
    listStyle: 'lower-alpha'
  },
  'ol': {
    listStyle: 'decimal'
  },
  'ul ul ul ul ul ul ul ul ul': {
    listStyle: 'square'
  },
  'ul ul ul ul ul ul ul ul': {
    listStyle: 'circle'
  },
  'ul ul ul ul ul ul ul': {
    listStyle: 'disc'
  },
  'ul ul ul ul ul ul': {
    listStyle: 'square'
  },
  'ul ul ul ul ul': {
    listStyle: 'circle'
  },
  'ul ul ul ul': {
    listStyle: 'disc'
  },
  'ul ul ul': {
    listStyle: 'square'
  },
  'ul ul': {
    listStyle: 'circle'
  },
  'ul': {
    listStyle: 'disc'
  }
};
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline'
};
function isMarkActive(editor, mark) {
  const marks = slate.Editor.marks(editor);
  if (marks !== null && marks !== void 0 && marks[mark]) {
    return true;
  }
  // see the stuff about marks in toolbar-state for why this is here
  for (const entry of slate.Editor.nodes(editor, {
    match: slate.Text.isText
  })) {
    if (entry[0][mark]) {
      return true;
    }
  }
  return false;
}
const getKeyDownHandler = editor => event => {
  if (event.defaultPrevented) return;
  for (const hotkey in HOTKEYS) {
    if (isHotkey__default["default"](hotkey, event.nativeEvent)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      const isActive = isMarkActive(editor, mark);
      if (isActive) {
        slate.Editor.removeMark(editor, mark);
      } else {
        slate.Editor.addMark(editor, mark, true);
      }
      return;
    }
  }
  if (isHotkey__default["default"]('mod+\\', event.nativeEvent)) {
    utils.clearFormatting(editor);
    return;
  }
  if (isHotkey__default["default"]('mod+k', event.nativeEvent)) {
    event.preventDefault();
    editorShared.wrapLink(editor, '');
    return;
  }
  if (event.key === 'Tab') {
    const didAction = event.shiftKey ? layoutsShared.unnestList(editor) : layoutsShared.nestList(editor);
    if (didAction) {
      event.preventDefault();
      return;
    }
  }
  if (event.key === 'Tab' && editor.selection) {
    const layoutArea = slate.Editor.above(editor, {
      match: node => node.type === 'layout-area'
    });
    if (layoutArea) {
      const layoutAreaToEnter = event.shiftKey ? slate.Editor.before(editor, layoutArea[1], {
        unit: 'block'
      }) : slate.Editor.after(editor, layoutArea[1], {
        unit: 'block'
      });
      slate.Transforms.setSelection(editor, {
        anchor: layoutAreaToEnter,
        focus: layoutAreaToEnter
      });
      event.preventDefault();
    }
  }
};
function DocumentEditor({
  onChange,
  value,
  componentBlocks,
  relationships,
  documentFeatures,
  initialExpanded = false,
  ...props
}) {
  const {
    radii,
    colors,
    spacing,
    fields
  } = core.useTheme();
  const [expanded, setExpanded] = React.useState(initialExpanded);
  const editor = React.useMemo(() => editorShared.createDocumentEditor(documentFeatures, componentBlocks, relationships, {
    ReactEditor: slateReact.ReactEditor,
    withReact: slateReact.withReact
  }), [documentFeatures, componentBlocks, relationships]);
  return core.jsx("div", {
    css: {
      border: `1px solid ${colors.border}`,
      borderRadius: radii.small
    }
  }, core.jsx(DocumentEditorProvider, {
    componentBlocks: componentBlocks,
    documentFeatures: documentFeatures,
    relationships: relationships,
    editor: editor,
    value: value,
    onChange: value => {
      onChange === null || onChange === void 0 || onChange(value);
      // this fixes a strange issue in Safari where the selection stays inside of the editor
      // after a blur event happens but the selection is still in the editor
      // so the cursor is visually in the wrong place and it inserts text backwards
      const selection = window.getSelection();
      if (selection && !slateReact.ReactEditor.isFocused(editor)) {
        const editorNode = slateReact.ReactEditor.toDOMNode(editor, editor);
        if (selection.anchorNode === editorNode) {
          slateReact.ReactEditor.focus(editor);
        }
      }
    }
  }, React.useMemo(() => onChange !== undefined && core.jsx(Toolbar, {
    documentFeatures: documentFeatures,
    viewState: {
      expanded,
      toggle: () => {
        setExpanded(v => !v);
      }
    }
  }), [expanded, documentFeatures, onChange]), core.jsx(DocumentEditorEditable, _extends({
    css: [{
      borderRadius: 'inherit',
      background: fields.focus.inputBackground,
      borderColor: fields.inputBorderColor,
      paddingLeft: spacing.medium,
      paddingRight: spacing.medium,
      minHeight: 120,
      scrollbarGutter: 'stable',
      // the !important is necessary to override the width set by resizing as an inline style
      height: expanded ? 'auto !important' : 224,
      resize: expanded ? undefined : 'vertical',
      overflowY: 'auto'
    }]
  }, props, {
    readOnly: onChange === undefined
  }))));
}
function DocumentEditorProvider({
  children,
  editor,
  onChange,
  value,
  componentBlocks,
  documentFeatures,
  relationships
}) {
  const identity = React.useMemo(() => Math.random().toString(36), [editor]);
  return core.jsx(slateReact.Slate
  // this fixes issues with Slate crashing when a fast refresh occcurs
  , {
    key: identity,
    editor: editor,
    initialValue: value,
    onChange: value => {
      onChange(value);
      // this fixes a strange issue in Safari where the selection stays inside of the editor
      // after a blur event happens but the selection is still in the editor
      // so the cursor is visually in the wrong place and it inserts text backwards
      const selection = window.getSelection();
      if (selection && !slateReact.ReactEditor.isFocused(editor)) {
        const editorNode = slateReact.ReactEditor.toDOMNode(editor, editor);
        if (selection.anchorNode === editorNode) {
          slateReact.ReactEditor.focus(editor);
        }
      }
    }
  }, core.jsx(toolbarState.ToolbarStateProvider, {
    componentBlocks: componentBlocks,
    editorDocumentFeatures: documentFeatures,
    relationships: relationships
  }, children));
}
function DocumentEditorEditable(props) {
  const editor = slateReact.useSlate();
  const componentBlocks = React.useContext(toolbarState.ComponentBlockContext);
  const onKeyDown = React.useMemo(() => getKeyDownHandler(editor), [editor]);
  return core.jsx(slateReact.Editable, _extends({
    decorate: React.useCallback(([node, path]) => {
      const decorations = [];
      if (node.type === 'component-block') {
        if (node.children.length === 1 && slate.Element.isElement(node.children[0]) && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined) {
          return decorations;
        }
        node.children.forEach((child, index) => {
          if (slate.Node.string(child) === '' && slate.Element.isElement(child) && (child.type === 'component-block-prop' || child.type === 'component-inline-prop') && child.propPath !== undefined) {
            const start = slate.Editor.start(editor, [...path, index]);
            const placeholder = utils.getPlaceholderTextForPropPath(child.propPath, componentBlocks[node.component].schema, node.props);
            if (placeholder) {
              decorations.push({
                placeholder,
                anchor: start,
                focus: start
              });
            }
          }
        });
      }
      return decorations;
    }, [editor, componentBlocks]),
    css: styles,
    onKeyDown: onKeyDown,
    renderElement: renderElement,
    renderLeaf: renderLeaf
  }, props));
}

/*
function Debugger () {
  const editor = useSlate()
  return (
    <pre>
      {JSON.stringify(
        {
          selection:
            editor.selection && Range.isCollapsed(editor.selection)
              ? editor.selection.anchor
              : editor.selection,
          marksWithoutCall: editor.marks,
          marks: Editor.marks(editor),
          children: editor.children,
        },
        null,
        2
      )}
    </pre>
  )
}
*/

function controller(config) {
  const memoizedIsComponentBlockValid = weakMemoize__default["default"](componentBlock => weakMemoize__default["default"](props => utils.clientSideValidateProp({
    kind: 'object',
    fields: componentBlock.schema
  }, props)));
  const componentBlocks = config.customViews.componentBlocks || {};
  const serverSideComponentBlocksSet = new Set(config.fieldMeta.componentBlocksPassedOnServer);
  const componentBlocksOnlyBeingPassedOnTheClient = Object.keys(componentBlocks).filter(x => !serverSideComponentBlocksSet.has(x));
  if (componentBlocksOnlyBeingPassedOnTheClient.length) {
    throw new Error(`(${config.listKey}:${config.path}) The following component blocks are being passed in the custom view but not in the server-side field config: ${JSON.stringify(componentBlocksOnlyBeingPassedOnTheClient)}`);
  }
  const clientSideComponentBlocksSet = new Set(Object.keys(componentBlocks));
  const componentBlocksOnlyBeingPassedOnTheServer = config.fieldMeta.componentBlocksPassedOnServer.filter(x => !clientSideComponentBlocksSet.has(x));
  if (componentBlocksOnlyBeingPassedOnTheServer.length) {
    throw new Error(`(${config.listKey}:${config.path}) The following component blocks are being passed in the server-side field config but not in the custom view: ${JSON.stringify(componentBlocksOnlyBeingPassedOnTheServer)}`);
  }
  const validateNode = weakMemoize__default["default"](node => {
    if (slate.Text.isText(node)) {
      return true;
    }
    if (node.type === 'component-block') {
      const componentBlock = componentBlocks[node.component];
      if (componentBlock) {
        if (!memoizedIsComponentBlockValid(componentBlock)(node.props)) {
          return false;
        }
      }
    }
    if (node.type === 'link' && (typeof node.href !== 'string' || !isValidURL.isValidURL(node.href))) {
      return false;
    }
    return node.children.every(node => validateNode(node));
  });
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: `${config.path} {document(hydrateRelationships: true)}`,
    componentBlocks: config.customViews.componentBlocks || {},
    documentFeatures: config.fieldMeta.documentFeatures,
    relationships: config.fieldMeta.relationships,
    defaultValue: [{
      type: 'paragraph',
      children: [{
        text: ''
      }]
    }],
    deserialize: data => {
      var _data$config$path;
      const documentFromServer = (_data$config$path = data[config.path]) === null || _data$config$path === void 0 ? void 0 : _data$config$path.document;
      if (!documentFromServer) {
        return [{
          type: 'paragraph',
          children: [{
            text: ''
          }]
        }];
      }
      // make a temporary editor to normalize the document
      const editor = editorShared.createDocumentEditor(config.fieldMeta.documentFeatures, componentBlocks, config.fieldMeta.relationships);
      editor.children = documentFromServer;
      slate.Editor.normalize(editor, {
        force: true
      });
      return editor.children;
    },
    serialize: value => ({
      [config.path]: value
    }),
    validate(value) {
      return value.every(node => validateNode(node));
    }
  };
}

/** @jsxRuntime classic */
function Field({
  field,
  value,
  onChange,
  autoFocus,
  forceValidation
}) {
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, {
    as: "span",
    id: `${field.path}-label`
  }, field.label), core.jsx(fields.FieldDescription, {
    id: `${field.path}-description`
  }, field.description), core.jsx(toolbarState.ForceValidationProvider, {
    value: !!forceValidation
  }, core.jsx(DocumentEditor, {
    autoFocus: autoFocus,
    "aria-labelledby": `${field.path}-label`,
    value: value,
    onChange: onChange,
    componentBlocks: field.componentBlocks,
    relationships: field.relationships,
    documentFeatures: field.documentFeatures
  })));
}
function serialize(nodes) {
  return nodes.map(n => slate.Node.string(n)).join('\n');
}
const Cell = ({
  item,
  field,
  linkTo
}) => {
  var _item$field$path;
  const value = (_item$field$path = item[field.path]) === null || _item$field$path === void 0 ? void 0 : _item$field$path.document;
  if (!value) return null;
  const plainText = serialize(value);
  const cutText = plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
  return linkTo ? core.jsx(components.CellLink, linkTo, cutText) : core.jsx(components.CellContainer, null, cutText);
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  var _item$field$path2;
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, null, field.label), core.jsx(documentRenderer.DocumentRenderer, {
    document: ((_item$field$path2 = item[field.path]) === null || _item$field$path2 === void 0 ? void 0 : _item$field$path2.document) || []
  }));
};
const allowedExportsOnCustomViews = ['componentBlocks'];

exports.CardValue = CardValue;
exports.Cell = Cell;
exports.Field = Field;
exports.allowedExportsOnCustomViews = allowedExportsOnCustomViews;
exports.controller = controller;

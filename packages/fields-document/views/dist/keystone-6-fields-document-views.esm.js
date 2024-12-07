'use client';
import { jsx, useTheme, Portal } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, FieldDescription } from '@keystone-ui/fields';
import { Transforms, Editor, Element, Node, Text } from 'slate';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { CellLink, CellContainer } from '@keystone-6/core/admin-ui/components';
import _extends from '@babel/runtime/helpers/esm/extends';
import React, { forwardRef, useMemo, useState, useEffect, memo, Fragment, useContext, useRef, useCallback } from 'react';
import isHotkey from 'is-hotkey';
import { useSlateStatic, useSelected, useFocused, ReactEditor, withReact, Slate, useSlate, Editable } from 'slate-react';
import { w as wrapLink, i as insertBlockquote, a as insertDivider, c as createDocumentEditor } from '../../dist/editor-shared-7275bfdd.esm.js';
import { p as modifierKeyText, q as clearFormatting, k as insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading, u as getPlaceholderTextForPropPath, v as clientSideValidateProp } from '../../dist/utils-3f0c9305.esm.js';
import { applyRefs } from 'apply-ref';
import { useControlledPopover } from '@keystone-ui/popover';
import { Tooltip } from '@keystone-ui/tooltip';
import { BoldIcon } from '@keystone-ui/icons/icons/BoldIcon';
import { ItalicIcon } from '@keystone-ui/icons/icons/ItalicIcon';
import { PlusIcon } from '@keystone-ui/icons/icons/PlusIcon';
import { ChevronDownIcon } from '@keystone-ui/icons/icons/ChevronDownIcon';
import { Maximize2Icon } from '@keystone-ui/icons/icons/Maximize2Icon';
import { Minimize2Icon } from '@keystone-ui/icons/icons/Minimize2Icon';
import { MoreHorizontalIcon } from '@keystone-ui/icons/icons/MoreHorizontalIcon';
import { T as ToolbarSeparator, a as ToolbarButton, I as InlineDialog, b as ToolbarGroup, K as KeyboardInTooltip } from '../../dist/toolbar-3bf20e44.esm.js';
import '../../dist/orderable-c4eafa5e.esm.js';
import { LinkIcon } from '@keystone-ui/icons/icons/LinkIcon';
import { Trash2Icon } from '@keystone-ui/icons/icons/Trash2Icon';
import { ExternalLinkIcon } from '@keystone-ui/icons/icons/ExternalLinkIcon';
import { u as useToolbarState, a as useElementWithSetNodes, b as useEventCallback, c as useForceValidation, D as DocumentFieldRelationshipsContext, C as ComponentBlockContext, R as RelationshipButton, B as BlockComponentsButtons, d as RelationshipElement, e as ComponentInlineProp, f as ComponentBlocksElement, g as useDocumentFieldRelationships, i as insertComponentBlock, T as ToolbarStateProvider, F as ForceValidationProvider } from '../../dist/toolbar-state-29badbe2.esm.js';
import { i as isValidURL } from '../../dist/isValidURL-3d5628de.esm.js';
import { LayoutsButton, LayoutArea, LayoutContainer } from '../../dist/layouts-f767359a.esm.js';
import { t as toggleList, i as insertLayout, u as unnestList, h as nestList } from '../../dist/layouts-shared-02634bb2.esm.js';
import { CodeIcon } from '@keystone-ui/icons/icons/CodeIcon';
import { AlignLeftIcon } from '@keystone-ui/icons/icons/AlignLeftIcon';
import { AlignRightIcon } from '@keystone-ui/icons/icons/AlignRightIcon';
import { AlignCenterIcon } from '@keystone-ui/icons/icons/AlignCenterIcon';
import { MinusIcon } from '@keystone-ui/icons/icons/MinusIcon';
import { matchSorter } from 'match-sorter';
import scrollIntoView from 'scroll-into-view-if-needed';
import weakMemoize from '@emotion/weak-memoize';
import 'slate-history';
import 'mdast-util-from-markdown';
import 'mdast-util-gfm-autolink-literal/from-markdown';
import 'micromark-extension-gfm-autolink-literal';
import 'mdast-util-gfm-strikethrough/from-markdown';
import 'micromark-extension-gfm-strikethrough';
import '@dnd-kit/core';
import '@dnd-kit/sortable';
import '@dnd-kit/modifiers';
import '@keystone-ui/button';
import '../../dist/api-0cce34e4.esm.js';
import '@keystone-6/core';
import '../../dist/form-from-preview-0c5f473c.esm.js';
import '@keystone-6/core/admin-ui/context';
import '@keystone-6/core/fields/types/relationship/views/RelationshipSelect';
import '@keystone-ui/icons/icons/PlusCircleIcon';
import '@keystone-ui/modals';
import '@braintree/sanitize-url';

function LinkElement({
  attributes,
  children,
  element: __elementForGettingPath
}) {
  const {
    typography
  } = useTheme();
  const editor = useSlateStatic();
  const [currentElement, setNode] = useElementWithSetNodes(editor, __elementForGettingPath);
  const href = currentElement.href;
  const selected = useSelected();
  const focused = useFocused();
  const [focusedInInlineDialog, setFocusedInInlineDialog] = useState(false);
  // we want to show the link dialog when the editor is focused and the link element is selected
  // or when the input inside the dialog is focused so you would think that would look like this:
  // (selected && focused) || focusedInInlineDialog
  // this doesn't work though because the blur will happen before the focus is inside the inline dialog
  // so this component would be rendered and focused would be false so the input would be removed so it couldn't be focused
  // to fix this, we delay our reading of the updated `focused` value so that we'll still render the dialog
  // immediately after the editor is blurred but before the input has been focused
  const [delayedFocused, setDelayedFocused] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      setDelayedFocused(focused);
    }, 0);
    return () => {
      clearTimeout(id);
    };
  }, [focused]);
  const [localForceValidation, setLocalForceValidation] = useState(false);
  const {
    dialog,
    trigger
  } = useControlledPopover({
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
  const unlink = useEventCallback(() => {
    Transforms.unwrapNodes(editor, {
      at: ReactEditor.findPath(editor, __elementForGettingPath)
    });
  });
  const forceValidation = useForceValidation();
  const showInvalidState = isValidURL(href) ? false : forceValidation || localForceValidation;
  return jsx("span", _extends({}, attributes, {
    css: {
      position: 'relative',
      display: 'inline-block'
    }
  }), jsx("a", _extends({}, trigger.props, {
    css: {
      color: showInvalidState ? 'red' : undefined
    },
    ref: trigger.ref,
    href: href
  }), children), (selected && delayedFocused || focusedInInlineDialog) && jsx(InlineDialog, _extends({}, dialog.props, {
    ref: dialog.ref,
    onFocus: () => {
      setFocusedInInlineDialog(true);
    },
    onBlur: () => {
      setFocusedInInlineDialog(false);
      setLocalForceValidation(true);
    }
  }), jsx("div", {
    css: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, jsx(ToolbarGroup, null, jsx("input", {
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
  }), jsx(Tooltip, {
    content: "Open link in new tab",
    weight: "subtle"
  }, attrs => jsx(ToolbarButton, _extends({
    as: "a",
    onMouseDown: event => {
      event.preventDefault();
    },
    href: href,
    target: "_blank",
    rel: "noreferrer",
    variant: "action"
  }, attrs), externalLinkIcon)), separator, jsx(UnlinkButton, {
    onUnlink: unlink
  })), showInvalidState && jsx("span", {
    css: {
      color: 'red'
    }
  }, "Please enter a valid URL"))));
}
const separator = jsx(ToolbarSeparator, null);
const externalLinkIcon = jsx(ExternalLinkIcon, {
  size: "small"
});
const UnlinkButton = /*#__PURE__*/memo(function UnlinkButton({
  onUnlink
}) {
  return jsx(Tooltip, {
    content: "Unlink",
    weight: "subtle"
  }, attrs => jsx(ToolbarButton, _extends({
    variant: "destructive",
    onMouseDown: event => {
      event.preventDefault();
      onUnlink();
    }
  }, attrs), jsx(Trash2Icon, {
    size: "small"
  })));
});
const linkIcon = jsx(LinkIcon, {
  size: "small"
});
const LinkButton = /*#__PURE__*/forwardRef(function LinkButton(props, ref) {
  const {
    editor,
    links: {
      isDisabled,
      isSelected
    }
  } = useToolbarState();
  return useMemo(() => jsx(ToolbarButton, _extends({
    ref: ref,
    isDisabled: isDisabled,
    isSelected: isSelected,
    onMouseDown: event => {
      event.preventDefault();
      wrapLink(editor, '');
    }
  }, props), linkIcon), [isSelected, isDisabled, editor, props, ref]);
});
const linkButton = jsx(Tooltip, {
  content: "Link",
  weight: "subtle"
}, attrs => jsx(LinkButton, attrs));

const ListButton = /*#__PURE__*/forwardRef(function ListButton(props, ref) {
  const {
    editor,
    lists: {
      [props.type === 'ordered-list' ? 'ordered' : 'unordered']: {
        isDisabled,
        isSelected
      }
    }
  } = useToolbarState();
  return useMemo(() => {
    const {
      type,
      ...restProps
    } = props;
    return jsx(ToolbarButton, _extends({
      ref: ref,
      isDisabled: isDisabled,
      isSelected: isSelected,
      onMouseDown: event => {
        event.preventDefault();
        toggleList(editor, type);
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
  } = useTheme();
  return jsx("blockquote", _extends({
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
  } = useToolbarState();
  return useMemo(() => jsx(ToolbarButton, _extends({
    isSelected: isSelected,
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      insertBlockquote(editor);
    }
  }, attrs), jsx(QuoteIcon, null)), [editor, attrs, isDisabled, isSelected]);
};
const blockquoteButton = jsx(Tooltip, {
  content: jsx(Fragment, null, "Quote", jsx(KeyboardInTooltip, null, '> ')),
  weight: "subtle"
}, attrs => jsx(BlockquoteButton, {
  attrs: attrs
}));
const QuoteIcon = () => jsx(IconBase, null, jsx("path", {
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
  } = useToolbarState();
  return useMemo(() => jsx(ToolbarButton, _extends({
    isSelected: isSelected,
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      if (isSelected) {
        Transforms.unwrapNodes(editor, {
          match: node => node.type === 'code'
        });
      } else {
        Transforms.wrapNodes(editor, {
          type: 'code',
          children: [{
            text: ''
          }]
        });
      }
    }
  }, attrs), jsx(CodeIcon, {
    size: "small"
  })), [isDisabled, isSelected, attrs, editor]);
}
const codeButton = jsx(Tooltip, {
  weight: "subtle",
  content: jsx(Fragment, null, "Code block ", jsx(KeyboardInTooltip, null, "```"))
}, attrs => jsx(CodeButton, {
  attrs: attrs
}));

function TextAlignMenu({
  alignment
}) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    dialog,
    trigger
  } = useControlledPopover({
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
  return jsx("div", {
    css: {
      display: 'inline-block',
      position: 'relative'
    }
  }, jsx(Tooltip, {
    content: "Text alignment",
    weight: "subtle"
  }, attrs => jsx(TextAlignButton, {
    attrs: attrs,
    onToggle: () => {
      setShowMenu(x => !x);
    },
    trigger: trigger,
    showMenu: showMenu
  })), showMenu ? jsx(InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), jsx(TextAlignDialog, {
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
  } = useToolbarState();
  const alignments = ['start', ...Object.keys(alignment).filter(key => alignment[key])];
  return jsx(ToolbarGroup, null, alignments.map(alignment => jsx(Tooltip, {
    key: alignment,
    content: `Align ${alignment}`,
    weight: "subtle"
  }, attrs => jsx(ToolbarButton, _extends({
    isSelected: selected === alignment,
    onMouseDown: event => {
      event.preventDefault();
      if (alignment === 'start') {
        Transforms.unsetNodes(editor, 'textAlign', {
          match: node => node.type === 'paragraph' || node.type === 'heading'
        });
      } else {
        Transforms.setNodes(editor, {
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
  start: jsx(AlignLeftIcon, {
    size: "small"
  }),
  center: jsx(AlignCenterIcon, {
    size: "small"
  }),
  end: jsx(AlignRightIcon, {
    size: "small"
  })
};
function TextAlignButton(props) {
  const {
    alignment: {
      isDisabled,
      selected
    }
  } = useToolbarState();
  return useMemo(() => jsx(ToolbarButton, _extends({
    isDisabled: isDisabled,
    isPressed: props.showMenu,
    onMouseDown: event => {
      event.preventDefault();
      props.onToggle();
    }
  }, props.attrs, props.trigger.props, {
    ref: applyRefs(props.attrs.ref, props.trigger.ref)
  }), alignmentIcons[selected], downIcon$1), [isDisabled, selected, props]);
}
const downIcon$1 = jsx(ChevronDownIcon, {
  size: "small"
});

const minusIcon = /*#__PURE__*/React.createElement(MinusIcon, {
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
  } = useToolbarState();
  return useMemo(() => /*#__PURE__*/React.createElement(ToolbarButton, _extends({
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      insertDivider(editor);
    }
  }, attrs), minusIcon), [editor, isDisabled, attrs]);
}
const dividerButton = /*#__PURE__*/React.createElement(Tooltip, {
  content: /*#__PURE__*/React.createElement(Fragment, null, "Divider", /*#__PURE__*/React.createElement(KeyboardInTooltip, null, "---")),
  weight: "subtle"
}, attrs => /*#__PURE__*/React.createElement(DividerButton, {
  attrs: attrs
}));

function Toolbar({
  documentFeatures,
  viewState
}) {
  const relationship = useContext(DocumentFieldRelationshipsContext);
  const blockComponent = useContext(ComponentBlockContext);
  const hasBlockItems = Object.entries(relationship).length || Object.keys(blockComponent).length;
  const hasMarks = Object.values(documentFeatures.formatting.inlineMarks).some(x => x);
  return jsx(ToolbarContainer, null, jsx(ToolbarGroup, null, !!documentFeatures.formatting.headingLevels.length && jsx(HeadingMenu, {
    headingLevels: documentFeatures.formatting.headingLevels
  }), hasMarks && jsx(InlineMarks, {
    marks: documentFeatures.formatting.inlineMarks
  }), hasMarks && jsx(ToolbarSeparator, null), (documentFeatures.formatting.alignment.center || documentFeatures.formatting.alignment.end) && jsx(TextAlignMenu, {
    alignment: documentFeatures.formatting.alignment
  }), documentFeatures.formatting.listTypes.unordered && jsx(Tooltip, {
    content: jsx(Fragment, null, "Bullet List ", jsx(KeyboardInTooltip, null, "- ")),
    weight: "subtle"
  }, attrs => jsx(ListButton, _extends({
    type: "unordered-list"
  }, attrs), jsx(BulletListIcon, null))), documentFeatures.formatting.listTypes.ordered && jsx(Tooltip, {
    content: jsx(Fragment, null, "Numbered List ", jsx(KeyboardInTooltip, null, "1. ")),
    weight: "subtle"
  }, attrs => jsx(ListButton, _extends({
    type: "ordered-list"
  }, attrs), jsx(NumberedListIcon, null))), (documentFeatures.formatting.alignment.center || documentFeatures.formatting.alignment.end || documentFeatures.formatting.listTypes.unordered || documentFeatures.formatting.listTypes.ordered) && jsx(ToolbarSeparator, null), documentFeatures.dividers && dividerButton, documentFeatures.links && linkButton, documentFeatures.formatting.blockTypes.blockquote && blockquoteButton, !!documentFeatures.layouts.length && jsx(LayoutsButton, {
    layouts: documentFeatures.layouts
  }), documentFeatures.formatting.blockTypes.code && codeButton, !!hasBlockItems && jsx(InsertBlockMenu, null)), useMemo(() => {
    const ExpandIcon = viewState !== null && viewState !== void 0 && viewState.expanded ? Minimize2Icon : Maximize2Icon;
    return viewState && jsx(ToolbarGroup, null, jsx(ToolbarSeparator, null), jsx(Tooltip, {
      content: viewState.expanded ? 'Collapse' : 'Expand',
      weight: "subtle"
    }, attrs => jsx(ToolbarButton, _extends({
      onMouseDown: event => {
        event.preventDefault();
        viewState.toggle();
      }
    }, attrs), jsx(ExpandIcon, {
      size: "small"
    }))));
  }, [viewState]));
}

/* UI Components */

const MarkButton = /*#__PURE__*/forwardRef(function MarkButton(props, ref) {
  const {
    editor,
    marks: {
      [props.type]: {
        isDisabled,
        isSelected
      }
    }
  } = useToolbarState();
  return useMemo(() => {
    const {
      type,
      ...restProps
    } = props;
    return jsx(ToolbarButton, _extends({
      ref: ref,
      isDisabled: isDisabled,
      isSelected: isSelected,
      onMouseDown: event => {
        event.preventDefault();
        if (isSelected) {
          Editor.removeMark(editor, props.type);
        } else {
          Editor.addMark(editor, props.type, true);
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
  } = useTheme();
  return jsx("div", {
    css: {
      borderBottom: `1px solid ${colors.border}`,
      background: colors.background,
      position: 'sticky',
      top: 0,
      zIndex: 2,
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit'
    }
  }, jsx("div", {
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
const downIcon = jsx(ChevronDownIcon, {
  size: "small"
});
function HeadingButton({
  trigger,
  onToggleShowMenu,
  showMenu
}) {
  const {
    textStyles
  } = useToolbarState();
  const buttonLabel = textStyles.selected === 'normal' ? 'Normal text' : 'Heading ' + textStyles.selected;
  const isDisabled = textStyles.allowedHeadingLevels.length === 0;
  return useMemo(() => jsx(ToolbarButton, _extends({
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
  }, trigger.props), jsx("span", {
    css: {
      flex: 1
    }
  }, buttonLabel), downIcon), [buttonLabel, trigger, showMenu, onToggleShowMenu, isDisabled]);
}
const HeadingMenu = ({
  headingLevels
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const {
    dialog,
    trigger
  } = useControlledPopover({
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
  return jsx("div", {
    css: {
      display: 'inline-block',
      position: 'relative'
    }
  }, jsx(HeadingButton, {
    showMenu: showMenu,
    trigger: trigger,
    onToggleShowMenu: () => {
      setShowMenu(x => !x);
    }
  }), showMenu ? jsx(InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), jsx(HeadingDialog, {
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
  } = useToolbarState();
  return jsx(ToolbarGroup, {
    direction: "column"
  }, headingLevels.map(hNum => {
    const Tag = `h${hNum}`;
    const isSelected = textStyles.selected === hNum;
    return jsx(ToolbarButton, {
      key: hNum,
      isSelected: isSelected,
      onMouseDown: event => {
        event.preventDefault();
        if (isSelected) {
          Transforms.unwrapNodes(editor, {
            match: n => n.type === 'heading'
          });
        } else {
          Transforms.setNodes(editor, {
            type: 'heading',
            level: hNum
          }, {
            match: node => node.type === 'paragraph' || node.type === 'heading'
          });
        }
        onCloseMenu();
      }
    }, jsx(Tag, null, "Heading ", hNum));
  }));
}
function InsertBlockMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const {
    dialog,
    trigger
  } = useControlledPopover({
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
  return jsx("div", {
    css: {
      display: 'inline-block',
      position: 'relative'
    }
  }, jsx(Tooltip, {
    content: jsx(Fragment, null, "Insert ", jsx(KeyboardInTooltip, null, "/")),
    weight: "subtle"
  }, ({
    ref,
    ...attrs
  }) => jsx(ToolbarButton, _extends({
    ref: applyRefs(ref, trigger.ref),
    isPressed: showMenu,
    onMouseDown: event => {
      event.preventDefault();
      setShowMenu(v => !v);
    }
  }, trigger.props, attrs), jsx(PlusIcon, {
    size: "small",
    style: {
      strokeWidth: 3
    }
  }), jsx(ChevronDownIcon, {
    size: "small"
  }))), showMenu ? jsx(InlineDialog, _extends({
    ref: dialog.ref
  }, dialog.props), jsx(ToolbarGroup, {
    direction: "column"
  }, jsx(RelationshipButton, {
    onClose: () => setShowMenu(false)
  }), jsx(BlockComponentsButtons, {
    onClose: () => setShowMenu(false)
  }))) : null);
}
function InlineMarks({
  marks
}) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    dialog,
    trigger
  } = useControlledPopover({
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
  return jsx(Fragment, null, marks.bold && jsx(Tooltip, {
    content: jsx(Fragment, null, "Bold", jsx(KeyboardInTooltip, null, modifierKeyText, "B")),
    weight: "subtle"
  }, attrs => jsx(MarkButton, _extends({
    type: "bold"
  }, attrs), jsx(BoldIcon, {
    size: "small",
    style: {
      strokeWidth: 3
    }
  }))), marks.italic && jsx(Tooltip, {
    content: jsx(Fragment, null, "Italic", jsx(KeyboardInTooltip, null, modifierKeyText, "I")),
    weight: "subtle"
  }, attrs => jsx(MarkButton, _extends({
    type: "italic"
  }, attrs), jsx(ItalicIcon, {
    size: "small"
  }))), jsx(Tooltip, {
    content: "More formatting",
    weight: "subtle"
  }, attrs => jsx(MoreFormattingButton, {
    isOpen: showMenu,
    onToggle: () => {
      setShowMenu(v => !v);
    },
    trigger: trigger,
    attrs: attrs
  })), showMenu && jsx(MoreFormattingDialog, {
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
  } = useToolbarState();
  return jsx(InlineDialog, _extends({
    onMouseDown: event => {
      if (event.target instanceof HTMLElement && event.target.closest('button')) {
        onCloseMenu();
      }
    },
    ref: dialog.ref
  }, dialog.props), jsx(ToolbarGroup, {
    direction: "column"
  }, marks.underline && jsx(MarkButton, {
    type: "underline"
  }, jsx(ContentInButtonWithShortcut, {
    content: "Underline",
    shortcut: `${modifierKeyText}U`
  })), marks.strikethrough && jsx(MarkButton, {
    type: "strikethrough"
  }, "Strikethrough"), marks.code && jsx(MarkButton, {
    type: "code"
  }, "Code"), marks.keyboard && jsx(MarkButton, {
    type: "keyboard"
  }, "Keyboard"), marks.subscript && jsx(MarkButton, {
    type: "subscript"
  }, "Subscript"), marks.superscript && jsx(MarkButton, {
    type: "superscript"
  }, "Superscript"), jsx(ToolbarButton, {
    isDisabled: isDisabled,
    onMouseDown: event => {
      event.preventDefault();
      clearFormatting(editor);
    }
  }, jsx(ContentInButtonWithShortcut, {
    content: "Clear Formatting",
    shortcut: `${modifierKeyText}\\`
  }))));
}
function ContentInButtonWithShortcut({
  content,
  shortcut
}) {
  const theme = useTheme();
  return jsx("span", {
    css: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }
  }, jsx("span", null, content), jsx("kbd", {
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
  } = useToolbarState();
  const isActive = marks.strikethrough.isSelected || marks.underline.isSelected || marks.code.isSelected || marks.keyboard.isSelected || marks.subscript.isSelected || marks.superscript.isSelected;
  return useMemo(() => jsx(ToolbarButton, _extends({
    isPressed: isOpen,
    isSelected: isActive,
    onMouseDown: event => {
      event.preventDefault();
      onToggle();
    }
  }, trigger.props, attrs, {
    ref: applyRefs(attrs.ref, trigger.ref)
  }), jsx(MoreHorizontalIcon, {
    size: "small"
  })), [isActive, onToggle, isOpen, trigger, attrs]);
}

// Custom (non-feather) Icons
// ------------------------------

const IconBase = props => jsx("svg", _extends({
  "aria-hidden": "true",
  fill: "currentColor",
  focusable: "false",
  height: "16",
  role: "presentation",
  viewBox: "0 0 16 16",
  width: "16"
}, props));
const BulletListIcon = () => jsx(IconBase, null, jsx("path", {
  d: "M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"
}));
const NumberedListIcon = () => jsx(IconBase, null, jsx("path", {
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
  return jsx(Tag, _extends({}, attributes, {
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
      return jsx(LayoutContainer, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'layout-area':
      return jsx(LayoutArea, props);
    case 'code':
      return jsx(CodeElement, props);
    case 'component-block':
      {
        return jsx(ComponentBlocksElement, {
          attributes: props.attributes,
          children: props.children,
          element: props.element
        });
      }
    case 'component-inline-prop':
    case 'component-block-prop':
      return jsx(ComponentInlineProp, props);
    case 'heading':
      return jsx(HeadingElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'link':
      return jsx(LinkElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'ordered-list':
      return jsx("ol", props.attributes, props.children);
    case 'unordered-list':
      return jsx("ul", props.attributes, props.children);
    case 'list-item':
      return jsx("li", props.attributes, props.children);
    case 'list-item-content':
      return jsx("span", props.attributes, props.children);
    case 'blockquote':
      return jsx(BlockquoteElement, props);
    case 'relationship':
      return jsx(RelationshipElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'divider':
      return jsx(DividerElement, props);
    default:
      return jsx("p", _extends({
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
  } = useTheme();
  return jsx("pre", _extends({
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
  }, attributes), jsx("code", {
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
  } = useTheme();
  const selected = useSelected();
  return jsx("div", _extends({}, attributes, {
    css: {
      paddingBottom: spacing.medium,
      paddingTop: spacing.medium,
      marginBottom: spacing.medium,
      marginTop: spacing.medium,
      caretColor: 'transparent'
    }
  }), jsx("hr", {
    css: {
      backgroundColor: selected ? colors.linkColor : colors.border,
      border: 0,
      height: 2
    }
  }), children);
};

function noop() {}
function getOptions(toolbarState, componentBlocks, relationships) {
  const options = [...Object.entries(relationships).map(([relationship, {
    label
  }]) => ({
    label,
    insert: editor => {
      Transforms.insertNodes(editor, {
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
      insertComponentBlock(editor, componentBlocks, key);
    }
  })), ...toolbarState.textStyles.allowedHeadingLevels.filter(a => toolbarState.editorDocumentFeatures.formatting.headingLevels.includes(a)).map(level => ({
    label: `Heading ${level}`,
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'heading',
        level,
        children: [{
          text: ''
        }]
      });
    }
  })), !toolbarState.blockquote.isDisabled && toolbarState.editorDocumentFeatures.formatting.blockTypes.blockquote && {
    label: 'Blockquote',
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'blockquote',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState.code.isDisabled && toolbarState.editorDocumentFeatures.formatting.blockTypes.code && {
    label: 'Code block',
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'code',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState.dividers.isDisabled && toolbarState.editorDocumentFeatures.dividers && {
    label: 'Divider',
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'divider',
        children: [{
          text: ''
        }]
      });
    }
  }, !!toolbarState.editorDocumentFeatures.layouts.length && {
    label: 'Layout',
    insert(editor) {
      insertLayout(editor, toolbarState.editorDocumentFeatures.layouts[0]);
    }
  }, !toolbarState.lists.ordered.isDisabled && toolbarState.editorDocumentFeatures.formatting.listTypes.ordered && {
    label: 'Numbered List',
    keywords: ['ordered list'],
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'ordered-list',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState.lists.unordered.isDisabled && toolbarState.editorDocumentFeatures.formatting.listTypes.unordered && {
    label: 'Bullet List',
    keywords: ['unordered list'],
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
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
  const path = ReactEditor.findPath(editor, text);
  Transforms.delete(editor, {
    at: {
      focus: Editor.start(editor, path),
      anchor: Editor.end(editor, path)
    }
  });
  option.insert(editor);
}

// TODO: the changing width of the menu when searching isn't great
function InsertMenu({
  children,
  text
}) {
  const toolbarState = useToolbarState();
  const {
    editor,
    relationships: {
      isDisabled: relationshipsDisabled
    }
  } = toolbarState;
  const {
    dialog,
    trigger
  } = useControlledPopover({
    isOpen: true,
    onClose: noop
  }, {
    placement: 'bottom-start'
  });
  const componentBlocks = useContext(ComponentBlockContext);
  const relationships = useDocumentFieldRelationships();
  const options = matchSorter(getOptions(toolbarState, componentBlocks, relationshipsDisabled ? {} : relationships), text.text.slice(1), {
    keys: ['label', 'keywords']
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  if (options.length && selectedIndex >= options.length) {
    setSelectedIndex(0);
  }
  const stateRef = useRef({
    selectedIndex,
    options,
    text
  });
  useEffect(() => {
    stateRef.current = {
      selectedIndex,
      options,
      text
    };
  });
  const dialogRef = useRef(null);
  useEffect(() => {
    var _dialogRef$current;
    const element = (_dialogRef$current = dialogRef.current) === null || _dialogRef$current === void 0 || (_dialogRef$current = _dialogRef$current.children) === null || _dialogRef$current === void 0 ? void 0 : _dialogRef$current[selectedIndex];
    if (dialogRef.current && element) {
      scrollIntoView(element, {
        scrollMode: 'if-needed',
        boundary: dialogRef.current,
        block: 'nearest'
      });
    }
  }, [selectedIndex]);
  useEffect(() => {
    const domNode = ReactEditor.toDOMNode(editor, editor);
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
            const path = ReactEditor.findPath(editor, stateRef.current.text);
            Transforms.unsetNodes(editor, 'insertMenu', {
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
  return jsx(Fragment, null, jsx("span", _extends({}, trigger.props, {
    css: {
      color: 'blue'
    },
    ref: trigger.ref
  }), children), jsx(Portal, null, jsx(InlineDialog, _extends({
    contentEditable: false
  }, dialog.props, {
    css: {
      display: options.length ? undefined : 'none',
      userSelect: 'none',
      maxHeight: DIALOG_HEIGHT,
      zIndex: 3
    },
    ref: dialog.ref
  }), jsx("div", {
    ref: dialogRef,
    css: {
      overflowY: 'auto',
      maxHeight: DIALOG_HEIGHT - 8 * 2
    }
  }, options.map((option, index) => jsx(ToolbarButton, {
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
  const [width, setWidth] = useState(0);
  return jsx("span", {
    css: {
      position: 'relative',
      display: 'inline-block',
      width
    }
  }, jsx("span", {
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
  }, jsx("span", {
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
  } = useTheme();
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
    children = jsx(Placeholder, {
      placeholder: placeholder
    }, children);
  }
  if (insertMenu) {
    children = jsx(InsertMenu, {
      text: text
    }, children);
  }
  if (code) {
    children = jsx("code", {
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
    children = jsx("strong", null, children);
  }
  if (strikethrough) {
    children = jsx("s", null, children);
  }
  if (italic) {
    children = jsx("em", null, children);
  }
  if (keyboard) {
    children = jsx("kbd", null, children);
  }
  if (superscript) {
    children = jsx("sup", null, children);
  }
  if (subscript) {
    children = jsx("sub", null, children);
  }
  if (underline) {
    children = jsx("u", null, children);
  }
  return jsx("span", attributes, children);
};
const renderLeaf = props => {
  return jsx(Leaf, props);
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
  const marks = Editor.marks(editor);
  if (marks !== null && marks !== void 0 && marks[mark]) {
    return true;
  }
  // see the stuff about marks in toolbar-state for why this is here
  for (const entry of Editor.nodes(editor, {
    match: Text.isText
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
    if (isHotkey(hotkey, event.nativeEvent)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      const isActive = isMarkActive(editor, mark);
      if (isActive) {
        Editor.removeMark(editor, mark);
      } else {
        Editor.addMark(editor, mark, true);
      }
      return;
    }
  }
  if (isHotkey('mod+\\', event.nativeEvent)) {
    clearFormatting(editor);
    return;
  }
  if (isHotkey('mod+k', event.nativeEvent)) {
    event.preventDefault();
    wrapLink(editor, '');
    return;
  }
  if (event.key === 'Tab') {
    const didAction = event.shiftKey ? unnestList(editor) : nestList(editor);
    if (didAction) {
      event.preventDefault();
      return;
    }
  }
  if (event.key === 'Tab' && editor.selection) {
    const layoutArea = Editor.above(editor, {
      match: node => node.type === 'layout-area'
    });
    if (layoutArea) {
      const layoutAreaToEnter = event.shiftKey ? Editor.before(editor, layoutArea[1], {
        unit: 'block'
      }) : Editor.after(editor, layoutArea[1], {
        unit: 'block'
      });
      Transforms.setSelection(editor, {
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
  } = useTheme();
  const [expanded, setExpanded] = useState(initialExpanded);
  const editor = useMemo(() => createDocumentEditor(documentFeatures, componentBlocks, relationships, {
    ReactEditor,
    withReact
  }), [documentFeatures, componentBlocks, relationships]);
  return jsx("div", {
    css: {
      border: `1px solid ${colors.border}`,
      borderRadius: radii.small
    }
  }, jsx(DocumentEditorProvider, {
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
      if (selection && !ReactEditor.isFocused(editor)) {
        const editorNode = ReactEditor.toDOMNode(editor, editor);
        if (selection.anchorNode === editorNode) {
          ReactEditor.focus(editor);
        }
      }
    }
  }, useMemo(() => onChange !== undefined && jsx(Toolbar, {
    documentFeatures: documentFeatures,
    viewState: {
      expanded,
      toggle: () => {
        setExpanded(v => !v);
      }
    }
  }), [expanded, documentFeatures, onChange]), jsx(DocumentEditorEditable, _extends({
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
  const identity = useMemo(() => Math.random().toString(36), [editor]);
  return jsx(Slate
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
      if (selection && !ReactEditor.isFocused(editor)) {
        const editorNode = ReactEditor.toDOMNode(editor, editor);
        if (selection.anchorNode === editorNode) {
          ReactEditor.focus(editor);
        }
      }
    }
  }, jsx(ToolbarStateProvider, {
    componentBlocks: componentBlocks,
    editorDocumentFeatures: documentFeatures,
    relationships: relationships
  }, children));
}
function DocumentEditorEditable(props) {
  const editor = useSlate();
  const componentBlocks = useContext(ComponentBlockContext);
  const onKeyDown = useMemo(() => getKeyDownHandler(editor), [editor]);
  return jsx(Editable, _extends({
    decorate: useCallback(([node, path]) => {
      const decorations = [];
      if (node.type === 'component-block') {
        if (node.children.length === 1 && Element.isElement(node.children[0]) && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined) {
          return decorations;
        }
        node.children.forEach((child, index) => {
          if (Node.string(child) === '' && Element.isElement(child) && (child.type === 'component-block-prop' || child.type === 'component-inline-prop') && child.propPath !== undefined) {
            const start = Editor.start(editor, [...path, index]);
            const placeholder = getPlaceholderTextForPropPath(child.propPath, componentBlocks[node.component].schema, node.props);
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
  const memoizedIsComponentBlockValid = weakMemoize(componentBlock => weakMemoize(props => clientSideValidateProp({
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
  const validateNode = weakMemoize(node => {
    if (Text.isText(node)) {
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
    if (node.type === 'link' && (typeof node.href !== 'string' || !isValidURL(node.href))) {
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
      const editor = createDocumentEditor(config.fieldMeta.documentFeatures, componentBlocks, config.fieldMeta.relationships);
      editor.children = documentFromServer;
      Editor.normalize(editor, {
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
  return jsx(FieldContainer, null, jsx(FieldLabel, {
    as: "span",
    id: `${field.path}-label`
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), jsx(ForceValidationProvider, {
    value: !!forceValidation
  }, jsx(DocumentEditor, {
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
  return nodes.map(n => Node.string(n)).join('\n');
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
  return linkTo ? jsx(CellLink, linkTo, cutText) : jsx(CellContainer, null, cutText);
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  var _item$field$path2;
  return jsx(FieldContainer, null, jsx(FieldLabel, null, field.label), jsx(DocumentRenderer, {
    document: ((_item$field$path2 = item[field.path]) === null || _item$field$path2 === void 0 ? void 0 : _item$field$path2.document) || []
  }));
};
const allowedExportsOnCustomViews = ['componentBlocks'];

export { CardValue, Cell, Field, allowedExportsOnCustomViews, controller };

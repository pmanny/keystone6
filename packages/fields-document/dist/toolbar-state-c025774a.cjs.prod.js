'use strict';

var React = require('react');
var slateReact = require('slate-react');
var slate = require('slate');
var core = require('@keystone-ui/core');
var _extends = require('@babel/runtime/helpers/extends');
var toolbar = require('./toolbar-5bb2846f.cjs.prod.js');
require('./orderable-1dded3d4.cjs.prod.js');
var utils = require('./utils-8f1d1f0a.cjs.prod.js');
var layoutsShared = require('./layouts-shared-e18ac1bf.cjs.prod.js');
var Trash2Icon = require('@keystone-ui/icons/icons/Trash2Icon');
var tooltip = require('@keystone-ui/tooltip');
var button = require('@keystone-ui/button');
var api = require('./api-337a07cb.cjs.prod.js');
var formFromPreview = require('./form-from-preview-39e46967.cjs.prod.js');
var popover = require('@keystone-ui/popover');
require('@emotion/weak-memoize');
var layouts = require('./layouts-ae143ec5.cjs.prod.js');
var context = require('@keystone-6/core/admin-ui/context');
var RelationshipSelect = require('@keystone-6/core/fields/types/relationship/views/RelationshipSelect');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

// this ensures that when changes happen, they are immediately shown
// this stops the problem of a cursor resetting to the end when a change is made
// because the changes are applied asynchronously
function useElementWithSetNodes(editor, element) {
  const [state, setState] = React.useState({
    element,
    elementWithChanges: element
  });
  if (state.element !== element) {
    setState({
      element,
      elementWithChanges: element
    });
  }
  const elementRef = React.useRef(element);
  React.useEffect(() => {
    elementRef.current = element;
  });
  const setNodes = React.useCallback(changesOrCallback => {
    const currentElement = elementRef.current;
    const changes = typeof changesOrCallback === 'function' ? changesOrCallback(currentElement) : changesOrCallback;
    slate.Transforms.setNodes(editor, changes, {
      at: slateReact.ReactEditor.findPath(editor, currentElement)
    });
    setState({
      element: currentElement,
      elementWithChanges: {
        ...currentElement,
        ...changes
      }
    });
  }, [editor]);
  return [state.elementWithChanges, setNodes];
}
function useEventCallback(callback) {
  const callbackRef = React.useRef(callback);
  const cb = React.useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  return cb;
}
const ForceValidationContext = /*#__PURE__*/React__default["default"].createContext(false);
const ForceValidationProvider = ForceValidationContext.Provider;
function useForceValidation() {
  return React.useContext(ForceValidationContext);
}

function updateComponentBlockElementProps(editor, componentBlock, prevProps, newProps, basePath, setElement) {
  slate.Editor.withoutNormalizing(editor, () => {
    setElement({
      props: newProps
    });
    const childPropPaths = findChildPropPathsWithPrevious(newProps, prevProps, {
      kind: 'object',
      fields: componentBlock.schema
    }, [], [], []);
    const getNode = () => slate.Node.get(editor, basePath);
    const elementForChildren = getNode();
    if (childPropPaths.length === 0) {
      const indexes = elementForChildren.children.map((_, i) => i).reverse();
      for (const idx of indexes) {
        slate.Transforms.removeNodes(editor, {
          at: [...basePath, idx]
        });
      }
      slate.Transforms.insertNodes(editor, {
        type: 'component-inline-prop',
        propPath: undefined,
        children: [{
          text: ''
        }]
      }, {
        at: [...basePath, 0]
      });
      return;
    }
    const initialPropPathsToEditorPath = new Map();
    for (const [idx, node] of elementForChildren.children.entries()) {
      utils.assert(node.type === 'component-block-prop' || node.type === 'component-inline-prop');
      initialPropPathsToEditorPath.set(node.propPath === undefined ? undefined : JSON.stringify(node.propPath), idx);
    }
    const childrenLeftToAdd = new Set(childPropPaths);
    for (const childProp of childPropPaths) {
      if (childProp.prevPath === undefined) {
        continue;
      }
      const stringifiedPath = JSON.stringify(childProp.prevPath);
      const idxInChildren = initialPropPathsToEditorPath.get(stringifiedPath);
      if (idxInChildren !== undefined) {
        const prevNode = elementForChildren.children[idxInChildren];
        utils.assert(prevNode.propPath !== undefined);
        if (!layoutsShared.areArraysEqual(childProp.path, prevNode.propPath)) {
          slate.Transforms.setNodes(editor, {
            propPath: childProp.path
          }, {
            at: [...basePath, idxInChildren]
          });
        }
        childrenLeftToAdd.delete(childProp);
        initialPropPathsToEditorPath.delete(stringifiedPath);
      }
    }
    let newIdx = getNode().children.length;
    for (const childProp of childrenLeftToAdd) {
      slate.Transforms.insertNodes(editor, {
        type: `component-${childProp.options.kind}-prop`,
        propPath: childProp.path,
        children: [childProp.options.kind === 'block' ? {
          type: 'paragraph',
          children: [{
            text: ''
          }]
        } : {
          text: ''
        }]
      }, {
        at: [...basePath, newIdx]
      });
      newIdx++;
    }
    const pathsToRemove = [];
    for (const [, idxInChildren] of initialPropPathsToEditorPath) {
      pathsToRemove.push(slate.Editor.pathRef(editor, [...basePath, idxInChildren]));
    }
    for (const pathRef of pathsToRemove) {
      const path = pathRef.unref();
      utils.assert(path !== null);
      slate.Transforms.removeNodes(editor, {
        at: path
      });
    }
    const propPathsToExpectedIndexes = new Map();
    for (const [idx, thing] of childPropPaths.entries()) {
      propPathsToExpectedIndexes.set(JSON.stringify(thing.path), idx);
    }
    outer: while (true) {
      for (const [idx, childNode] of getNode().children.entries()) {
        utils.assert(childNode.type === 'component-block-prop' || childNode.type === 'component-inline-prop');
        const expectedIndex = propPathsToExpectedIndexes.get(JSON.stringify(childNode.propPath));
        utils.assert(expectedIndex !== undefined);
        if (idx === expectedIndex) continue;
        slate.Transforms.moveNodes(editor, {
          at: [...basePath, idx],
          to: [...basePath, expectedIndex]
        });

        // start the for-loop again
        continue outer;
      }
      break;
    }
  });
}
function findChildPropPathsWithPrevious(value, prevValue, schema, newPath, prevPath, pathWithKeys) {
  switch (schema.kind) {
    case 'form':
      return [];
    case 'relationship':
      return [];
    case 'child':
      return [{
        path: newPath,
        prevPath,
        options: schema.options
      }];
    case 'conditional':
      {
        const hasChangedDiscriminant = value.discriminant === prevValue.discriminant;
        return findChildPropPathsWithPrevious(value.value, hasChangedDiscriminant ? prevValue.value : utils.getInitialPropsValue(schema.values[value.discriminant]), schema.values[value.discriminant], newPath.concat('value'), hasChangedDiscriminant ? undefined : prevPath === null || prevPath === void 0 ? void 0 : prevPath.concat('value'), hasChangedDiscriminant ? undefined : pathWithKeys === null || pathWithKeys === void 0 ? void 0 : pathWithKeys.concat('value'));
      }
    case 'object':
      {
        const paths = [];
        for (const key of Object.keys(schema.fields)) {
          paths.push(...findChildPropPathsWithPrevious(value[key], prevValue[key], schema.fields[key], newPath.concat(key), prevPath === null || prevPath === void 0 ? void 0 : prevPath.concat(key), pathWithKeys === null || pathWithKeys === void 0 ? void 0 : pathWithKeys.concat(key)));
        }
        return paths;
      }
    case 'array':
      {
        const paths = [];
        const prevKeys = utils.getKeysForArrayValue(prevValue);
        const keys = utils.getKeysForArrayValue(value);
        for (const [i, val] of value.entries()) {
          const key = keys[i];
          const prevIdx = prevKeys.indexOf(key);
          let prevVal;
          if (prevIdx === -1) {
            prevVal = utils.getInitialPropsValue(schema.element);
          } else {
            prevVal = prevValue[prevIdx];
          }
          paths.push(...findChildPropPathsWithPrevious(val, prevVal, schema.element, newPath.concat(i), prevIdx === -1 ? undefined : prevPath === null || prevPath === void 0 ? void 0 : prevPath.concat(prevIdx), prevIdx === -1 ? undefined : pathWithKeys === null || pathWithKeys === void 0 ? void 0 : pathWithKeys.concat(key)));
        }
        return paths;
      }
  }
}

/** @jsxRuntime classic */
const ChildrenByPathContext = /*#__PURE__*/React__default["default"].createContext({});
function ChildFieldEditable({
  path
}) {
  const childrenByPath = React.useContext(ChildrenByPathContext);
  const child = childrenByPath[JSON.stringify(path)];
  if (child === undefined) {
    return null;
  }
  return child;
}
function ComponentBlockRender({
  componentBlock,
  element,
  onChange,
  children
}) {
  const getPreviewProps = React.useMemo(() => {
    return utils.createGetPreviewProps({
      kind: 'object',
      fields: componentBlock.schema
    }, onChange, path => core.jsx(ChildFieldEditable, {
      path: path
    }));
  }, [onChange, componentBlock]);
  const previewProps = getPreviewProps(element.props);
  const childrenByPath = {};
  let maybeChild;
  children.forEach(child => {
    const propPath = child.props.children.props.element.propPath;
    if (propPath === undefined) {
      maybeChild = child;
    } else {
      childrenByPath[JSON.stringify(propPathWithIndiciesToKeys(propPath, element.props))] = child;
    }
  });
  const ComponentBlockPreview = componentBlock.preview;
  return core.jsx(ChildrenByPathContext.Provider, {
    value: childrenByPath
  }, React.useMemo(() => core.jsx(ComponentBlockPreview, previewProps), [previewProps, ComponentBlockPreview]), core.jsx("span", {
    css: {
      caretColor: 'transparent',
      '& ::selection': {
        backgroundColor: 'transparent'
      }
    }
  }, maybeChild));
}

// note this is written to avoid crashing when the given prop path doesn't exist in the value
// this is because editor updates happen asynchronously but we have some logic to ensure
// that updating the props of a component block synchronously updates it
// (this is primarily to not mess up things like cursors in inputs)
// this means that sometimes the child elements will be inconsistent with the values
// so to deal with this, we return a prop path this is "wrong" but won't break anything
function propPathWithIndiciesToKeys(propPath, val) {
  return propPath.map(key => {
    var _val2;
    if (typeof key === 'string') {
      var _val;
      val = (_val = val) === null || _val === void 0 ? void 0 : _val[key];
      return key;
    }
    if (!Array.isArray(val)) {
      val = undefined;
      return '';
    }
    const keys = utils.getKeysForArrayValue(val);
    val = (_val2 = val) === null || _val2 === void 0 ? void 0 : _val2[key];
    return keys[key];
  });
}

function ChromefulComponentBlockElement(props) {
  var _props$componentBlock;
  const selected = slateReact.useSelected();
  const {
    colors,
    fields,
    spacing,
    typography
  } = core.useTheme();
  const isValid = React.useMemo(() => utils.clientSideValidateProp({
    kind: 'object',
    fields: props.componentBlock.schema
  }, props.elementProps), [props.componentBlock, props.elementProps]);
  const [editMode, setEditMode] = React.useState(false);
  const onCloseEditMode = React.useCallback(() => {
    setEditMode(false);
  }, []);
  const onShowEditMode = React.useCallback(() => {
    setEditMode(true);
  }, []);
  const ChromefulToolbar = (_props$componentBlock = props.componentBlock.toolbar) !== null && _props$componentBlock !== void 0 ? _props$componentBlock : DefaultToolbarWithChrome;
  return core.jsx("div", _extends({}, props.attributes, {
    css: {
      marginBottom: spacing.xlarge,
      marginTop: spacing.xlarge,
      paddingLeft: spacing.xlarge,
      position: 'relative',
      ':before': {
        content: '" "',
        backgroundColor: selected ? colors.focusRing : editMode ? colors.linkColor : colors.border,
        borderRadius: 4,
        width: 4,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1
      }
    }
  }), core.jsx(api.NotEditable, {
    css: {
      color: fields.legendColor,
      display: 'block',
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1,
      marginBottom: spacing.small,
      textTransform: 'uppercase'
    }
  }, props.componentBlock.label), editMode ? core.jsx(React.Fragment, null, core.jsx(FormValue, {
    isValid: isValid,
    props: props.previewProps,
    onClose: onCloseEditMode
  }), core.jsx("div", {
    css: {
      display: 'none'
    }
  }, props.children)) : core.jsx(React.Fragment, null, props.renderedBlock, core.jsx(ChromefulToolbar, {
    isValid: isValid,
    onRemove: props.onRemove,
    onShowEditMode: onShowEditMode,
    props: props.previewProps
  })));
}
function DefaultToolbarWithChrome({
  onShowEditMode,
  onRemove,
  isValid
}) {
  const theme = core.useTheme();
  return core.jsx(toolbar.ToolbarGroup, {
    as: api.NotEditable,
    marginTop: "small"
  }, core.jsx(toolbar.ToolbarButton, {
    onClick: () => {
      onShowEditMode();
    }
  }, "Edit"), core.jsx(toolbar.ToolbarSeparator, null), core.jsx(tooltip.Tooltip, {
    content: "Remove",
    weight: "subtle"
  }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
    variant: "destructive",
    onClick: () => {
      onRemove();
    }
  }, attrs), core.jsx(Trash2Icon.Trash2Icon, {
    size: "small"
  }))), !isValid && core.jsx(React.Fragment, null, core.jsx(toolbar.ToolbarSeparator, null), core.jsx("span", {
    css: {
      color: theme.palette.red500,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing.small
    }
  }, "Please edit the form, there are invalid fields.")));
}
function FormValue({
  onClose,
  props,
  isValid
}) {
  const [forceValidation, setForceValidation] = React.useState(false);
  return core.jsx(core.Stack, {
    gap: "xlarge",
    contentEditable: false
  }, core.jsx(formFromPreview.FormValueContentFromPreviewProps, _extends({}, props, {
    forceValidation: forceValidation
  })), core.jsx(button.Button, {
    size: "small",
    tone: "active",
    weight: "bold",
    onClick: () => {
      if (isValid) {
        onClose();
      } else {
        setForceValidation(true);
      }
    }
  }, "Done"));
}

function ChromelessComponentBlockElement(props) {
  var _props$componentBlock;
  const {
    trigger,
    dialog
  } = popover.useControlledPopover({
    isOpen: props.isOpen,
    onClose: () => {}
  }, {
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  const {
    spacing
  } = core.useTheme();
  const ChromelessToolbar = (_props$componentBlock = props.componentBlock.toolbar) !== null && _props$componentBlock !== void 0 ? _props$componentBlock : DefaultToolbarWithoutChrome;
  return core.jsx("div", _extends({}, props.attributes, {
    css: {
      marginBottom: spacing.xlarge,
      marginTop: spacing.xlarge
    }
  }), core.jsx("div", _extends({}, trigger.props, {
    ref: trigger.ref
  }), props.renderedBlock, props.isOpen && core.jsx(toolbar.InlineDialog, _extends({}, dialog.props, {
    ref: dialog.ref
  }), core.jsx(ChromelessToolbar, {
    onRemove: props.onRemove,
    props: props.previewProps
  }))));
}
function DefaultToolbarWithoutChrome({
  onRemove
}) {
  return core.jsx(tooltip.Tooltip, {
    content: "Remove",
    weight: "subtle"
  }, attrs => core.jsx(toolbar.ToolbarButton, _extends({
    variant: "destructive",
    onMouseDown: event => {
      event.preventDefault();
      onRemove();
    }
  }, attrs), core.jsx(Trash2Icon.Trash2Icon, {
    size: "small"
  })));
}

/** @jsxRuntime classic */
const ComponentBlockContext = /*#__PURE__*/React.createContext({});
function ComponentInlineProp(props) {
  return core.jsx("span", props.attributes, props.children);
}
function insertComponentBlock(editor, componentBlocks, componentBlock) {
  const node = utils.getInitialValue(componentBlock, componentBlocks[componentBlock]);
  utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, node);
  const componentBlockEntry = slate.Editor.above(editor, {
    match: node => node.type === 'component-block'
  });
  if (componentBlockEntry) {
    const start = slate.Editor.start(editor, componentBlockEntry[1]);
    slate.Transforms.setSelection(editor, {
      anchor: start,
      focus: start
    });
  }
}
function BlockComponentsButtons({
  onClose
}) {
  const editor = slateReact.useSlateStatic();
  const blockComponents = React.useContext(ComponentBlockContext);
  return core.jsx(React.Fragment, null, Object.keys(blockComponents).map(key => core.jsx(toolbar.ToolbarButton, {
    key: key,
    onMouseDown: event => {
      event.preventDefault();
      insertComponentBlock(editor, blockComponents, key);
      onClose();
    }
  }, blockComponents[key].label)));
}
function ComponentBlocksElement({
  attributes,
  children,
  element: __elementToGetPath
}) {
  const editor = slateReact.useSlateStatic();
  const focused = slateReact.useFocused();
  const selected = slateReact.useSelected();
  const [currentElement, setElement] = useElementWithSetNodes(editor, __elementToGetPath);
  const {
    spacing
  } = core.useTheme();
  const blockComponents = React.useContext(ComponentBlockContext);
  const componentBlock = blockComponents[currentElement.component];
  const elementToGetPathRef = React.useRef({
    __elementToGetPath,
    currentElement
  });
  React.useEffect(() => {
    elementToGetPathRef.current = {
      __elementToGetPath,
      currentElement
    };
  });
  const onRemove = useEventCallback(() => {
    const path = slateReact.ReactEditor.findPath(editor, __elementToGetPath);
    slate.Transforms.removeNodes(editor, {
      at: path
    });
  });
  const onPropsChange = React.useCallback(cb => {
    const prevProps = elementToGetPathRef.current.currentElement.props;
    updateComponentBlockElementProps(editor, componentBlock, prevProps, cb(prevProps), slateReact.ReactEditor.findPath(editor, elementToGetPathRef.current.__elementToGetPath), setElement);
  }, [setElement, componentBlock, editor]);
  const getToolbarPreviewProps = React.useMemo(() => {
    if (!componentBlock) {
      return () => {
        throw new Error('expected component block to exist when called');
      };
    }
    return utils.createGetPreviewProps({
      kind: 'object',
      fields: componentBlock.schema
    }, onPropsChange, () => undefined);
  }, [componentBlock, onPropsChange]);
  if (!componentBlock) {
    return core.jsx("div", {
      css: {
        border: 'red 4px solid',
        padding: spacing.medium
      }
    }, core.jsx("pre", {
      contentEditable: false,
      css: {
        userSelect: 'none'
      }
    }, `The block "${currentElement.component}" no longer exists.

Props:

${JSON.stringify(currentElement.props, null, 2)}

Content:`), children);
  }
  const toolbarPreviewProps = getToolbarPreviewProps(currentElement.props);
  const renderedBlock = core.jsx(ComponentBlockRender, {
    children: children,
    componentBlock: componentBlock,
    element: currentElement,
    onChange: onPropsChange
  });
  return componentBlock.chromeless ? core.jsx(ChromelessComponentBlockElement, {
    attributes: attributes,
    renderedBlock: renderedBlock,
    componentBlock: componentBlock,
    isOpen: focused && selected,
    onRemove: onRemove,
    previewProps: toolbarPreviewProps
  }) : core.jsx(ChromefulComponentBlockElement, {
    attributes: attributes,
    children: children,
    componentBlock: componentBlock,
    onRemove: onRemove,
    previewProps: toolbarPreviewProps,
    renderedBlock: renderedBlock,
    elementProps: currentElement.props
  });
}

const DocumentFieldRelationshipsContext = /*#__PURE__*/React.createContext({});
function useDocumentFieldRelationships() {
  return React.useContext(DocumentFieldRelationshipsContext);
}
const DocumentFieldRelationshipsProvider = DocumentFieldRelationshipsContext.Provider;
function RelationshipButton({
  onClose
}) {
  const {
    editor,
    relationships: {
      isDisabled
    }
  } = useToolbarState();
  const relationships = React.useContext(DocumentFieldRelationshipsContext);
  return core.jsx(React.Fragment, null, Object.entries(relationships).map(([key, relationship]) => {
    return core.jsx(toolbar.ToolbarButton, {
      key: key,
      isDisabled: isDisabled,
      onMouseDown: event => {
        event.preventDefault();
        slate.Transforms.insertNodes(editor, {
          type: 'relationship',
          relationship: key,
          data: null,
          children: [{
            text: ''
          }]
        });
        onClose();
      }
    }, relationship.label);
  }));
}
function RelationshipElement({
  attributes,
  children,
  element
}) {
  const editor = slateReact.useSlateStatic();
  const relationships = React.useContext(DocumentFieldRelationshipsContext);
  const relationship = relationships[element.relationship];
  const list = context.useList(relationship.listKey);
  const searchFields = Object.keys(list.fields).filter(key => list.fields[key].search);
  return core.jsx("span", _extends({}, attributes, {
    css: {
      display: 'inline-flex',
      alignItems: 'center'
    }
  }), core.jsx("span", {
    contentEditable: false,
    css: {
      userSelect: 'none',
      width: 200,
      display: 'inline-block',
      paddingLeft: 4,
      paddingRight: 4,
      flex: 1
    }
  }, relationship ? core.jsx(RelationshipSelect.RelationshipSelect, {
    controlShouldRenderValue: true,
    isDisabled: false,
    list: list,
    labelField: list.labelField,
    searchFields: searchFields,
    portalMenu: true,
    state: {
      kind: 'one',
      value: element.data === null ? null : {
        id: element.data.id,
        label: element.data.label || element.data.id
      },
      onChange(value) {
        const at = slateReact.ReactEditor.findPath(editor, element);
        if (value === null) {
          slate.Transforms.removeNodes(editor, {
            at
          });
        } else {
          slate.Transforms.setNodes(editor, {
            data: value
          }, {
            at
          });
        }
      }
    }
  }) : 'Invalid relationship'), core.jsx("span", {
    css: {
      flex: 0
    }
  }, children));
}

const ToolbarStateContext = /*#__PURE__*/React__default["default"].createContext(null);
function useToolbarState() {
  const toolbarState = React.useContext(ToolbarStateContext);
  if (!toolbarState) {
    throw new Error('ToolbarStateProvider must be used to use useToolbarState');
  }
  return toolbarState;
}
const ToolbarStateProvider = ({
  children,
  componentBlocks,
  editorDocumentFeatures,
  relationships
}) => {
  const editor = slateReact.useSlate();
  return /*#__PURE__*/React__default["default"].createElement(DocumentFieldRelationshipsProvider, {
    value: relationships
  }, /*#__PURE__*/React__default["default"].createElement(layouts.LayoutOptionsProvider, {
    value: editorDocumentFeatures.layouts
  }, /*#__PURE__*/React__default["default"].createElement(ComponentBlockContext.Provider, {
    value: componentBlocks
  }, /*#__PURE__*/React__default["default"].createElement(ToolbarStateContext.Provider, {
    value: layoutsShared.createToolbarState(editor, componentBlocks, editorDocumentFeatures)
  }, children))));
};

exports.BlockComponentsButtons = BlockComponentsButtons;
exports.ComponentBlockContext = ComponentBlockContext;
exports.ComponentBlocksElement = ComponentBlocksElement;
exports.ComponentInlineProp = ComponentInlineProp;
exports.DocumentFieldRelationshipsContext = DocumentFieldRelationshipsContext;
exports.ForceValidationProvider = ForceValidationProvider;
exports.RelationshipButton = RelationshipButton;
exports.RelationshipElement = RelationshipElement;
exports.ToolbarStateProvider = ToolbarStateProvider;
exports.insertComponentBlock = insertComponentBlock;
exports.useDocumentFieldRelationships = useDocumentFieldRelationships;
exports.useElementWithSetNodes = useElementWithSetNodes;
exports.useEventCallback = useEventCallback;
exports.useForceValidation = useForceValidation;
exports.useToolbarState = useToolbarState;

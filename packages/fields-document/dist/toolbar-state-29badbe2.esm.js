import React, { useState, useRef, useEffect, useCallback, useContext, useMemo, Fragment, createContext } from 'react';
import { ReactEditor, useSelected, useSlateStatic, useFocused, useSlate } from 'slate-react';
import { Transforms, Editor, Node } from 'slate';
import { jsx, useTheme, Stack } from '@keystone-ui/core';
import _extends from '@babel/runtime/helpers/esm/extends';
import { b as ToolbarGroup, a as ToolbarButton, T as ToolbarSeparator, I as InlineDialog } from './toolbar-3bf20e44.esm.js';
import './orderable-c4eafa5e.esm.js';
import { d as assert, f as getKeysForArrayValue, g as getInitialPropsValue, w as createGetPreviewProps, v as clientSideValidateProp, x as getInitialValue, k as insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading } from './utils-3f0c9305.esm.js';
import { a as areArraysEqual, j as createToolbarState } from './layouts-shared-02634bb2.esm.js';
import { Trash2Icon } from '@keystone-ui/icons/icons/Trash2Icon';
import { Tooltip } from '@keystone-ui/tooltip';
import { Button } from '@keystone-ui/button';
import { N as NotEditable } from './api-0cce34e4.esm.js';
import { F as FormValueContentFromPreviewProps } from './form-from-preview-0c5f473c.esm.js';
import { useControlledPopover } from '@keystone-ui/popover';
import '@emotion/weak-memoize';
import { LayoutOptionsProvider } from './layouts-f767359a.esm.js';
import { useList } from '@keystone-6/core/admin-ui/context';
import { RelationshipSelect } from '@keystone-6/core/fields/types/relationship/views/RelationshipSelect';

// this ensures that when changes happen, they are immediately shown
// this stops the problem of a cursor resetting to the end when a change is made
// because the changes are applied asynchronously
function useElementWithSetNodes(editor, element) {
  const [state, setState] = useState({
    element,
    elementWithChanges: element
  });
  if (state.element !== element) {
    setState({
      element,
      elementWithChanges: element
    });
  }
  const elementRef = useRef(element);
  useEffect(() => {
    elementRef.current = element;
  });
  const setNodes = useCallback(changesOrCallback => {
    const currentElement = elementRef.current;
    const changes = typeof changesOrCallback === 'function' ? changesOrCallback(currentElement) : changesOrCallback;
    Transforms.setNodes(editor, changes, {
      at: ReactEditor.findPath(editor, currentElement)
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
  const callbackRef = useRef(callback);
  const cb = useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return cb;
}
const ForceValidationContext = /*#__PURE__*/React.createContext(false);
const ForceValidationProvider = ForceValidationContext.Provider;
function useForceValidation() {
  return useContext(ForceValidationContext);
}

function updateComponentBlockElementProps(editor, componentBlock, prevProps, newProps, basePath, setElement) {
  Editor.withoutNormalizing(editor, () => {
    setElement({
      props: newProps
    });
    const childPropPaths = findChildPropPathsWithPrevious(newProps, prevProps, {
      kind: 'object',
      fields: componentBlock.schema
    }, [], [], []);
    const getNode = () => Node.get(editor, basePath);
    const elementForChildren = getNode();
    if (childPropPaths.length === 0) {
      const indexes = elementForChildren.children.map((_, i) => i).reverse();
      for (const idx of indexes) {
        Transforms.removeNodes(editor, {
          at: [...basePath, idx]
        });
      }
      Transforms.insertNodes(editor, {
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
      assert(node.type === 'component-block-prop' || node.type === 'component-inline-prop');
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
        assert(prevNode.propPath !== undefined);
        if (!areArraysEqual(childProp.path, prevNode.propPath)) {
          Transforms.setNodes(editor, {
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
      Transforms.insertNodes(editor, {
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
      pathsToRemove.push(Editor.pathRef(editor, [...basePath, idxInChildren]));
    }
    for (const pathRef of pathsToRemove) {
      const path = pathRef.unref();
      assert(path !== null);
      Transforms.removeNodes(editor, {
        at: path
      });
    }
    const propPathsToExpectedIndexes = new Map();
    for (const [idx, thing] of childPropPaths.entries()) {
      propPathsToExpectedIndexes.set(JSON.stringify(thing.path), idx);
    }
    outer: while (true) {
      for (const [idx, childNode] of getNode().children.entries()) {
        assert(childNode.type === 'component-block-prop' || childNode.type === 'component-inline-prop');
        const expectedIndex = propPathsToExpectedIndexes.get(JSON.stringify(childNode.propPath));
        assert(expectedIndex !== undefined);
        if (idx === expectedIndex) continue;
        Transforms.moveNodes(editor, {
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
        return findChildPropPathsWithPrevious(value.value, hasChangedDiscriminant ? prevValue.value : getInitialPropsValue(schema.values[value.discriminant]), schema.values[value.discriminant], newPath.concat('value'), hasChangedDiscriminant ? undefined : prevPath === null || prevPath === void 0 ? void 0 : prevPath.concat('value'), hasChangedDiscriminant ? undefined : pathWithKeys === null || pathWithKeys === void 0 ? void 0 : pathWithKeys.concat('value'));
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
        const prevKeys = getKeysForArrayValue(prevValue);
        const keys = getKeysForArrayValue(value);
        for (const [i, val] of value.entries()) {
          const key = keys[i];
          const prevIdx = prevKeys.indexOf(key);
          let prevVal;
          if (prevIdx === -1) {
            prevVal = getInitialPropsValue(schema.element);
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
const ChildrenByPathContext = /*#__PURE__*/React.createContext({});
function ChildFieldEditable({
  path
}) {
  const childrenByPath = useContext(ChildrenByPathContext);
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
  const getPreviewProps = useMemo(() => {
    return createGetPreviewProps({
      kind: 'object',
      fields: componentBlock.schema
    }, onChange, path => jsx(ChildFieldEditable, {
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
  return jsx(ChildrenByPathContext.Provider, {
    value: childrenByPath
  }, useMemo(() => jsx(ComponentBlockPreview, previewProps), [previewProps, ComponentBlockPreview]), jsx("span", {
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
    const keys = getKeysForArrayValue(val);
    val = (_val2 = val) === null || _val2 === void 0 ? void 0 : _val2[key];
    return keys[key];
  });
}

function ChromefulComponentBlockElement(props) {
  var _props$componentBlock;
  const selected = useSelected();
  const {
    colors,
    fields,
    spacing,
    typography
  } = useTheme();
  const isValid = useMemo(() => clientSideValidateProp({
    kind: 'object',
    fields: props.componentBlock.schema
  }, props.elementProps), [props.componentBlock, props.elementProps]);
  const [editMode, setEditMode] = useState(false);
  const onCloseEditMode = useCallback(() => {
    setEditMode(false);
  }, []);
  const onShowEditMode = useCallback(() => {
    setEditMode(true);
  }, []);
  const ChromefulToolbar = (_props$componentBlock = props.componentBlock.toolbar) !== null && _props$componentBlock !== void 0 ? _props$componentBlock : DefaultToolbarWithChrome;
  return jsx("div", _extends({}, props.attributes, {
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
  }), jsx(NotEditable, {
    css: {
      color: fields.legendColor,
      display: 'block',
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1,
      marginBottom: spacing.small,
      textTransform: 'uppercase'
    }
  }, props.componentBlock.label), editMode ? jsx(Fragment, null, jsx(FormValue, {
    isValid: isValid,
    props: props.previewProps,
    onClose: onCloseEditMode
  }), jsx("div", {
    css: {
      display: 'none'
    }
  }, props.children)) : jsx(Fragment, null, props.renderedBlock, jsx(ChromefulToolbar, {
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
  const theme = useTheme();
  return jsx(ToolbarGroup, {
    as: NotEditable,
    marginTop: "small"
  }, jsx(ToolbarButton, {
    onClick: () => {
      onShowEditMode();
    }
  }, "Edit"), jsx(ToolbarSeparator, null), jsx(Tooltip, {
    content: "Remove",
    weight: "subtle"
  }, attrs => jsx(ToolbarButton, _extends({
    variant: "destructive",
    onClick: () => {
      onRemove();
    }
  }, attrs), jsx(Trash2Icon, {
    size: "small"
  }))), !isValid && jsx(Fragment, null, jsx(ToolbarSeparator, null), jsx("span", {
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
  const [forceValidation, setForceValidation] = useState(false);
  return jsx(Stack, {
    gap: "xlarge",
    contentEditable: false
  }, jsx(FormValueContentFromPreviewProps, _extends({}, props, {
    forceValidation: forceValidation
  })), jsx(Button, {
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
  } = useControlledPopover({
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
  } = useTheme();
  const ChromelessToolbar = (_props$componentBlock = props.componentBlock.toolbar) !== null && _props$componentBlock !== void 0 ? _props$componentBlock : DefaultToolbarWithoutChrome;
  return jsx("div", _extends({}, props.attributes, {
    css: {
      marginBottom: spacing.xlarge,
      marginTop: spacing.xlarge
    }
  }), jsx("div", _extends({}, trigger.props, {
    ref: trigger.ref
  }), props.renderedBlock, props.isOpen && jsx(InlineDialog, _extends({}, dialog.props, {
    ref: dialog.ref
  }), jsx(ChromelessToolbar, {
    onRemove: props.onRemove,
    props: props.previewProps
  }))));
}
function DefaultToolbarWithoutChrome({
  onRemove
}) {
  return jsx(Tooltip, {
    content: "Remove",
    weight: "subtle"
  }, attrs => jsx(ToolbarButton, _extends({
    variant: "destructive",
    onMouseDown: event => {
      event.preventDefault();
      onRemove();
    }
  }, attrs), jsx(Trash2Icon, {
    size: "small"
  })));
}

/** @jsxRuntime classic */
const ComponentBlockContext = /*#__PURE__*/createContext({});
function ComponentInlineProp(props) {
  return jsx("span", props.attributes, props.children);
}
function insertComponentBlock(editor, componentBlocks, componentBlock) {
  const node = getInitialValue(componentBlock, componentBlocks[componentBlock]);
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, node);
  const componentBlockEntry = Editor.above(editor, {
    match: node => node.type === 'component-block'
  });
  if (componentBlockEntry) {
    const start = Editor.start(editor, componentBlockEntry[1]);
    Transforms.setSelection(editor, {
      anchor: start,
      focus: start
    });
  }
}
function BlockComponentsButtons({
  onClose
}) {
  const editor = useSlateStatic();
  const blockComponents = useContext(ComponentBlockContext);
  return jsx(Fragment, null, Object.keys(blockComponents).map(key => jsx(ToolbarButton, {
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
  const editor = useSlateStatic();
  const focused = useFocused();
  const selected = useSelected();
  const [currentElement, setElement] = useElementWithSetNodes(editor, __elementToGetPath);
  const {
    spacing
  } = useTheme();
  const blockComponents = useContext(ComponentBlockContext);
  const componentBlock = blockComponents[currentElement.component];
  const elementToGetPathRef = useRef({
    __elementToGetPath,
    currentElement
  });
  useEffect(() => {
    elementToGetPathRef.current = {
      __elementToGetPath,
      currentElement
    };
  });
  const onRemove = useEventCallback(() => {
    const path = ReactEditor.findPath(editor, __elementToGetPath);
    Transforms.removeNodes(editor, {
      at: path
    });
  });
  const onPropsChange = useCallback(cb => {
    const prevProps = elementToGetPathRef.current.currentElement.props;
    updateComponentBlockElementProps(editor, componentBlock, prevProps, cb(prevProps), ReactEditor.findPath(editor, elementToGetPathRef.current.__elementToGetPath), setElement);
  }, [setElement, componentBlock, editor]);
  const getToolbarPreviewProps = useMemo(() => {
    if (!componentBlock) {
      return () => {
        throw new Error('expected component block to exist when called');
      };
    }
    return createGetPreviewProps({
      kind: 'object',
      fields: componentBlock.schema
    }, onPropsChange, () => undefined);
  }, [componentBlock, onPropsChange]);
  if (!componentBlock) {
    return jsx("div", {
      css: {
        border: 'red 4px solid',
        padding: spacing.medium
      }
    }, jsx("pre", {
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
  const renderedBlock = jsx(ComponentBlockRender, {
    children: children,
    componentBlock: componentBlock,
    element: currentElement,
    onChange: onPropsChange
  });
  return componentBlock.chromeless ? jsx(ChromelessComponentBlockElement, {
    attributes: attributes,
    renderedBlock: renderedBlock,
    componentBlock: componentBlock,
    isOpen: focused && selected,
    onRemove: onRemove,
    previewProps: toolbarPreviewProps
  }) : jsx(ChromefulComponentBlockElement, {
    attributes: attributes,
    children: children,
    componentBlock: componentBlock,
    onRemove: onRemove,
    previewProps: toolbarPreviewProps,
    renderedBlock: renderedBlock,
    elementProps: currentElement.props
  });
}

const DocumentFieldRelationshipsContext = /*#__PURE__*/createContext({});
function useDocumentFieldRelationships() {
  return useContext(DocumentFieldRelationshipsContext);
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
  const relationships = useContext(DocumentFieldRelationshipsContext);
  return jsx(Fragment, null, Object.entries(relationships).map(([key, relationship]) => {
    return jsx(ToolbarButton, {
      key: key,
      isDisabled: isDisabled,
      onMouseDown: event => {
        event.preventDefault();
        Transforms.insertNodes(editor, {
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
  const editor = useSlateStatic();
  const relationships = useContext(DocumentFieldRelationshipsContext);
  const relationship = relationships[element.relationship];
  const list = useList(relationship.listKey);
  const searchFields = Object.keys(list.fields).filter(key => list.fields[key].search);
  return jsx("span", _extends({}, attributes, {
    css: {
      display: 'inline-flex',
      alignItems: 'center'
    }
  }), jsx("span", {
    contentEditable: false,
    css: {
      userSelect: 'none',
      width: 200,
      display: 'inline-block',
      paddingLeft: 4,
      paddingRight: 4,
      flex: 1
    }
  }, relationship ? jsx(RelationshipSelect, {
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
        const at = ReactEditor.findPath(editor, element);
        if (value === null) {
          Transforms.removeNodes(editor, {
            at
          });
        } else {
          Transforms.setNodes(editor, {
            data: value
          }, {
            at
          });
        }
      }
    }
  }) : 'Invalid relationship'), jsx("span", {
    css: {
      flex: 0
    }
  }, children));
}

const ToolbarStateContext = /*#__PURE__*/React.createContext(null);
function useToolbarState() {
  const toolbarState = useContext(ToolbarStateContext);
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
  const editor = useSlate();
  return /*#__PURE__*/React.createElement(DocumentFieldRelationshipsProvider, {
    value: relationships
  }, /*#__PURE__*/React.createElement(LayoutOptionsProvider, {
    value: editorDocumentFeatures.layouts
  }, /*#__PURE__*/React.createElement(ComponentBlockContext.Provider, {
    value: componentBlocks
  }, /*#__PURE__*/React.createElement(ToolbarStateContext.Provider, {
    value: createToolbarState(editor, componentBlocks, editorDocumentFeatures)
  }, children))));
};

export { BlockComponentsButtons as B, ComponentBlockContext as C, DocumentFieldRelationshipsContext as D, ForceValidationProvider as F, RelationshipButton as R, ToolbarStateProvider as T, useElementWithSetNodes as a, useEventCallback as b, useForceValidation as c, RelationshipElement as d, ComponentInlineProp as e, ComponentBlocksElement as f, useDocumentFieldRelationships as g, insertComponentBlock as i, useToolbarState as u };

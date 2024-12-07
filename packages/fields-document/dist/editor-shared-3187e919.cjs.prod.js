'use strict';

var slate = require('slate');
var slateHistory = require('slate-history');
var weakMemoize = require('@emotion/weak-memoize');
var utils = require('./utils-8f1d1f0a.cjs.prod.js');
var layoutsShared = require('./layouts-shared-e18ac1bf.cjs.prod.js');
var isValidURL = require('./isValidURL-25023205.cjs.prod.js');
var mdASTUtilFromMarkdown = require('mdast-util-from-markdown');
var autoLinkLiteralFromMarkdownExtension = require('mdast-util-gfm-autolink-literal/from-markdown');
var autoLinkLiteralMarkdownSyntax = require('micromark-extension-gfm-autolink-literal');
var gfmStrikethroughFromMarkdownExtension = require('mdast-util-gfm-strikethrough/from-markdown');
var gfmStrikethroughMarkdownSyntax = require('micromark-extension-gfm-strikethrough');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var weakMemoize__default = /*#__PURE__*/_interopDefault(weakMemoize);
var mdASTUtilFromMarkdown__default = /*#__PURE__*/_interopDefault(mdASTUtilFromMarkdown);
var autoLinkLiteralFromMarkdownExtension__default = /*#__PURE__*/_interopDefault(autoLinkLiteralFromMarkdownExtension);
var autoLinkLiteralMarkdownSyntax__default = /*#__PURE__*/_interopDefault(autoLinkLiteralMarkdownSyntax);
var gfmStrikethroughFromMarkdownExtension__default = /*#__PURE__*/_interopDefault(gfmStrikethroughFromMarkdownExtension);
var gfmStrikethroughMarkdownSyntax__default = /*#__PURE__*/_interopDefault(gfmStrikethroughMarkdownSyntax);

function getAncestorComponentBlock(editor) {
  if (editor.selection) {
    const ancestorEntry = slate.Editor.above(editor, {
      match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node) && node.type !== 'paragraph'
    });
    if (ancestorEntry && (ancestorEntry[0].type === 'component-block-prop' || ancestorEntry[0].type === 'component-inline-prop')) {
      return {
        isInside: true,
        componentBlock: slate.Editor.parent(editor, ancestorEntry[1]),
        prop: ancestorEntry
      };
    }
  }
  return {
    isInside: false
  };
}
const alreadyNormalizedThings = new WeakMap();
function normalizeNodeWithinComponentProp([node, path], editor, fieldOptions, relationships) {
  let alreadyNormalizedNodes = alreadyNormalizedThings.get(fieldOptions);
  if (!alreadyNormalizedNodes) {
    alreadyNormalizedNodes = new WeakSet();
    alreadyNormalizedThings.set(fieldOptions, alreadyNormalizedNodes);
  }
  if (alreadyNormalizedNodes.has(node)) {
    return false;
  }
  let didNormalization = false;
  if (fieldOptions.inlineMarks !== 'inherit' && slate.Text.isText(node)) {
    didNormalization = layoutsShared.normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, fieldOptions.inlineMarks, fieldOptions.softBreaks);
  }
  if (slate.Element.isElement(node)) {
    const childrenHasChanged = node.children.map((node, i) => normalizeNodeWithinComponentProp([node, [...path, i]], editor, fieldOptions, relationships))
    // .map then .some because we don't want to exit early
    .some(x => x);
    if (fieldOptions.kind === 'block') {
      didNormalization = layoutsShared.normalizeElementBasedOnDocumentFeatures([node, path], editor, fieldOptions.documentFeatures, relationships) || childrenHasChanged;
    } else {
      didNormalization = layoutsShared.normalizeInlineBasedOnLinksAndRelationships([node, path], editor, fieldOptions.documentFeatures.links, fieldOptions.documentFeatures.relationships, relationships);
    }
  }
  if (didNormalization === false) {
    alreadyNormalizedNodes.add(node);
  }
  return didNormalization;
}
function canSchemaContainChildField(rootSchema) {
  const queue = new Set([rootSchema]);
  for (const schema of queue) {
    if (schema.kind === 'form' || schema.kind === 'relationship') ; else if (schema.kind === 'child') {
      return true;
    } else if (schema.kind === 'array') {
      queue.add(schema.element);
    } else if (schema.kind === 'object') {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
    } else if (schema.kind === 'conditional') {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
    } else {
      utils.assertNever(schema);
    }
  }
  return false;
}
function doesSchemaOnlyEverContainASingleChildField(rootSchema) {
  const queue = new Set([rootSchema]);
  let hasFoundChildField = false;
  for (const schema of queue) {
    if (schema.kind === 'form' || schema.kind === 'relationship') ; else if (schema.kind === 'child') {
      if (hasFoundChildField) {
        return false;
      }
      hasFoundChildField = true;
    } else if (schema.kind === 'array') {
      if (canSchemaContainChildField(schema.element)) {
        return false;
      }
    } else if (schema.kind === 'object') {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
    } else if (schema.kind === 'conditional') {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
    } else {
      utils.assertNever(schema);
    }
  }
  return hasFoundChildField;
}
function findArrayFieldsWithSingleChildField(schema, value) {
  const propPaths = [];
  utils.traverseProps(schema, value, (schema, value, path) => {
    if (schema.kind === 'array' && doesSchemaOnlyEverContainASingleChildField(schema.element)) {
      propPaths.push([path, schema]);
    }
  });
  return propPaths;
}
function isEmptyChildFieldNode(element) {
  const firstChild = element.children[0];
  return element.children.length === 1 && (element.type === 'component-inline-prop' && firstChild.type === undefined && firstChild.text === '' || element.type === 'component-block-prop' && firstChild.type === 'paragraph' && firstChild.children.length === 1 && firstChild.children[0].type === undefined && firstChild.children[0].text === '');
}
function withComponentBlocks(blockComponents, editorDocumentFeatures, relationships, editor) {
  // note that conflicts between the editor document features
  // and the child field document features are dealt with elsewhere
  const memoizedGetDocumentFeaturesForChildField = weakMemoize__default["default"](options => {
    return utils.getDocumentFeaturesForChildField(editorDocumentFeatures, options);
  });
  const {
    normalizeNode,
    deleteBackward,
    insertBreak
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const ancestorComponentBlock = getAncestorComponentBlock(editor);
      if (ancestorComponentBlock.isInside && slate.Range.isCollapsed(editor.selection) && slate.Editor.isStart(editor, editor.selection.anchor, ancestorComponentBlock.prop[1]) && ancestorComponentBlock.prop[1][ancestorComponentBlock.prop[1].length - 1] === 0) {
        slate.Transforms.unwrapNodes(editor, {
          at: ancestorComponentBlock.componentBlock[1]
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const ancestorComponentBlock = getAncestorComponentBlock(editor);
    if (editor.selection && ancestorComponentBlock.isInside) {
      const {
        prop: [componentPropNode, componentPropPath],
        componentBlock: [componentBlockNode, componentBlockPath]
      } = ancestorComponentBlock;
      const isLastProp = componentPropPath[componentPropPath.length - 1] === componentBlockNode.children.length - 1;
      if (componentPropNode.type === 'component-block-prop') {
        const [[paragraphNode, paragraphPath]] = slate.Editor.nodes(editor, {
          match: node => node.type === 'paragraph'
        });
        const isLastParagraph = paragraphPath[paragraphPath.length - 1] === componentPropNode.children.length - 1;
        if (slate.Node.string(paragraphNode) === '' && isLastParagraph) {
          if (isLastProp) {
            slate.Transforms.moveNodes(editor, {
              at: paragraphPath,
              to: slate.Path.next(ancestorComponentBlock.componentBlock[1])
            });
          } else {
            slate.Transforms.move(editor, {
              distance: 1,
              unit: 'line'
            });
            slate.Transforms.removeNodes(editor, {
              at: paragraphPath
            });
          }
          return;
        }
      }
      if (componentPropNode.type === 'component-inline-prop') {
        slate.Editor.withoutNormalizing(editor, () => {
          const componentBlock = blockComponents[componentBlockNode.component];
          if (componentPropNode.propPath !== undefined && componentBlock !== undefined) {
            const rootSchema = {
              kind: 'object',
              fields: componentBlock.schema
            };
            const ancestorFields = utils.getAncestorSchemas(rootSchema, componentPropNode.propPath, componentBlockNode.props);
            const idx = [...ancestorFields].reverse().findIndex(item => item.kind === 'array');
            if (idx !== -1) {
              const arrayFieldIdx = ancestorFields.length - 1 - idx;
              const arrayField = ancestorFields[arrayFieldIdx];
              utils.assert(arrayField.kind === 'array');
              const val = utils.getValueAtPropPath(componentBlockNode.props, componentPropNode.propPath.slice(0, arrayFieldIdx));
              if (doesSchemaOnlyEverContainASingleChildField(arrayField.element)) {
                if (slate.Node.string(componentPropNode) === '' && val.length - 1 === componentPropNode.propPath[arrayFieldIdx]) {
                  slate.Transforms.removeNodes(editor, {
                    at: componentPropPath
                  });
                  if (isLastProp) {
                    slate.Transforms.insertNodes(editor, {
                      type: 'paragraph',
                      children: [{
                        text: ''
                      }]
                    }, {
                      at: slate.Path.next(componentBlockPath)
                    });
                    slate.Transforms.select(editor, slate.Path.next(componentBlockPath));
                  } else {
                    slate.Transforms.move(editor, {
                      distance: 1,
                      unit: 'line'
                    });
                  }
                } else {
                  insertBreak();
                }
                return;
              }
            }
          }
          slate.Transforms.splitNodes(editor, {
            always: true
          });
          const splitNodePath = slate.Path.next(componentPropPath);
          if (isLastProp) {
            slate.Transforms.moveNodes(editor, {
              at: splitNodePath,
              to: slate.Path.next(componentBlockPath)
            });
          } else {
            utils.moveChildren(editor, splitNodePath, [...slate.Path.next(splitNodePath), 0]);
            slate.Transforms.removeNodes(editor, {
              at: splitNodePath
            });
          }
        });
        return;
      }
    }
    insertBreak();
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (node.type === 'component-inline-prop' && !node.propPath && (node.children.length !== 1 || !slate.Text.isText(node.children[0]) || node.children[0].text !== '')) {
      slate.Transforms.removeNodes(editor, {
        at: path
      });
      return;
    }
    if (node.type === 'component-block') {
      const componentBlock = blockComponents[node.component];
      if (componentBlock) {
        const rootSchema = {
          kind: 'object',
          fields: componentBlock.schema
        };
        const updatedProps = addMissingFields(node.props, rootSchema);
        if (updatedProps !== node.props) {
          slate.Transforms.setNodes(editor, {
            props: updatedProps
          }, {
            at: path
          });
          return;
        }
        for (const [propPath, arrayField] of findArrayFieldsWithSingleChildField(rootSchema, node.props)) {
          if (node.children.length === 1 && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined) {
            break;
          }
          const nodesWithin = [];
          for (const [idx, childNode] of node.children.entries()) {
            if ((childNode.type === 'component-block-prop' || childNode.type === 'component-inline-prop') && childNode.propPath !== undefined) {
              const subPath = childNode.propPath.concat();
              while (subPath.length) {
                if (typeof subPath.pop() === 'number') break;
              }
              if (layoutsShared.areArraysEqual(propPath, subPath)) {
                nodesWithin.push([idx, childNode]);
              }
            }
          }
          const arrVal = utils.getValueAtPropPath(node.props, propPath);
          const prevKeys = utils.getKeysForArrayValue(arrVal);
          const prevKeysSet = new Set(prevKeys);
          const alreadyUsedIndicies = new Set();
          const newVal = [];
          const newKeys = [];
          const getNewKey = () => {
            let key = utils.getNewArrayElementKey();
            while (prevKeysSet.has(key)) {
              key = utils.getNewArrayElementKey();
            }
            return key;
          };
          for (const [, node] of nodesWithin) {
            const idxFromValue = node.propPath[propPath.length];
            utils.assert(typeof idxFromValue === 'number');
            if (arrVal.length <= idxFromValue || alreadyUsedIndicies.has(idxFromValue) && isEmptyChildFieldNode(node)) {
              newVal.push(utils.getInitialPropsValue(arrayField.element));
              newKeys.push(getNewKey());
            } else {
              alreadyUsedIndicies.add(idxFromValue);
              newVal.push(arrVal[idxFromValue]);
              newKeys.push(alreadyUsedIndicies.has(idxFromValue) ? getNewKey() : prevKeys[idxFromValue]);
            }
          }
          utils.setKeysForArrayValue(newVal, newKeys);
          if (!layoutsShared.areArraysEqual(arrVal, newVal)) {
            const transformedProps = utils.replaceValueAtPropPath(rootSchema, node.props, newVal, propPath);
            slate.Transforms.setNodes(editor, {
              props: transformedProps
            }, {
              at: path
            });
            for (const [idx, [idxInChildrenOfBlock, nodeWithin]] of nodesWithin.entries()) {
              const newPropPath = [...nodeWithin.propPath];
              newPropPath[propPath.length] = idx;
              slate.Transforms.setNodes(editor, {
                propPath: newPropPath
              }, {
                at: [...path, idxInChildrenOfBlock]
              });
            }
            return;
          }
        }
        const missingKeys = new Map(utils.findChildPropPaths(node.props, componentBlock.schema).map(x => [JSON.stringify(x.path), x.options.kind]));
        node.children.forEach(node => {
          utils.assert(node.type === 'component-block-prop' || node.type === 'component-inline-prop');
          missingKeys.delete(JSON.stringify(node.propPath));
        });
        if (missingKeys.size) {
          slate.Transforms.insertNodes(editor, [...missingKeys].map(([prop, kind]) => ({
            type: `component-${kind}-prop`,
            propPath: prop ? JSON.parse(prop) : prop,
            children: [{
              text: ''
            }]
          })), {
            at: [...path, node.children.length]
          });
          return;
        }
        const foundProps = new Set();
        const stringifiedInlinePropPaths = {};
        utils.findChildPropPaths(node.props, blockComponents[node.component].schema).forEach((x, index) => {
          stringifiedInlinePropPaths[JSON.stringify(x.path)] = {
            options: x.options,
            index
          };
        });
        for (const [index, childNode] of node.children.entries()) {
          if (
          // children that are not these will be handled by
          // the generic allowedChildren normalization
          childNode.type !== 'component-inline-prop' && childNode.type !== 'component-block-prop') {
            continue;
          }
          const childPath = [...path, index];
          const stringifiedPropPath = JSON.stringify(childNode.propPath);
          if (stringifiedInlinePropPaths[stringifiedPropPath] === undefined) {
            slate.Transforms.removeNodes(editor, {
              at: childPath
            });
            return;
          }
          if (foundProps.has(stringifiedPropPath)) {
            slate.Transforms.removeNodes(editor, {
              at: childPath
            });
            return;
          }
          foundProps.add(stringifiedPropPath);
          const propInfo = stringifiedInlinePropPaths[stringifiedPropPath];
          const expectedIndex = propInfo.index;
          if (index !== expectedIndex) {
            slate.Transforms.moveNodes(editor, {
              at: childPath,
              to: [...path, expectedIndex]
            });
            return;
          }
          const expectedChildNodeType = `component-${propInfo.options.kind}-prop`;
          if (childNode.type !== expectedChildNodeType) {
            slate.Transforms.setNodes(editor, {
              type: expectedChildNodeType
            }, {
              at: childPath
            });
            return;
          }
          const documentFeatures = memoizedGetDocumentFeaturesForChildField(propInfo.options);
          if (normalizeNodeWithinComponentProp([childNode, childPath], editor, documentFeatures, relationships)) {
            return;
          }
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// the only thing that this will fix is a new field being added to an object field, nothing else.
function addMissingFields(value, schema) {
  if (schema.kind === 'child' || schema.kind === 'form' || schema.kind === 'relationship') {
    return value;
  }
  if (schema.kind === 'conditional') {
    const conditionalValue = value;
    const updatedInnerValue = addMissingFields(conditionalValue.value, schema.values[conditionalValue.discriminant.toString()]);
    if (updatedInnerValue === conditionalValue.value) {
      return value;
    }
    return {
      discriminant: conditionalValue.discriminant,
      value: updatedInnerValue
    };
  }
  if (schema.kind === 'array') {
    const arrValue = value;
    const newArrValue = arrValue.map(x => addMissingFields(x, schema.element));
    if (layoutsShared.areArraysEqual(arrValue, newArrValue)) {
      return value;
    }
    return newArrValue;
  }
  if (schema.kind === 'object') {
    const objectValue = value;
    let hasChanged = false;
    const newObjectValue = {};
    for (const [key, innerSchema] of Object.entries(schema.fields)) {
      const innerValue = objectValue[key];
      if (innerValue === undefined) {
        hasChanged = true;
        newObjectValue[key] = utils.getInitialPropsValue(innerSchema);
        continue;
      }
      const newInnerValue = addMissingFields(innerValue, innerSchema);
      if (newInnerValue !== innerValue) {
        hasChanged = true;
      }
      newObjectValue[key] = newInnerValue;
    }
    if (hasChanged) {
      return newObjectValue;
    }
    return value;
  }
  utils.assertNever(schema);
}

const isLinkActive = editor => {
  return utils.isElementActive(editor, 'link');
};
function wrapLink(editor, url) {
  if (isLinkActive(editor)) {
    slate.Transforms.unwrapNodes(editor, {
      match: n => n.type === 'link'
    });
    return;
  }
  const {
    selection
  } = editor;
  const isCollapsed = selection && slate.Range.isCollapsed(selection);
  if (isCollapsed) {
    slate.Transforms.insertNodes(editor, {
      type: 'link',
      href: url,
      children: [{
        text: url
      }]
    });
  } else {
    slate.Transforms.wrapNodes(editor, {
      type: 'link',
      href: url,
      children: [{
        text: ''
      }]
    }, {
      split: true
    });
  }
}
const markdownLinkPattern = /(^|\s)\[(.+?)\]\((\S+)\)$/;
function withLink(editorDocumentFeatures, componentBlocks, editor) {
  const {
    insertText,
    isInline,
    normalizeNode
  } = editor;
  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };
  if (editorDocumentFeatures.links) {
    editor.insertText = text => {
      insertText(text);
      if (text !== ')' || !editor.selection) return;
      const startOfBlock = slate.Editor.start(editor, slate.Editor.above(editor, {
        match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
      })[1]);
      const startOfBlockToEndOfShortcutString = slate.Editor.string(editor, {
        anchor: editor.selection.anchor,
        focus: startOfBlock
      });
      const match = markdownLinkPattern.exec(startOfBlockToEndOfShortcutString);
      if (!match) return;
      const ancestorComponentChildFieldDocumentFeatures = layoutsShared.getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks);
      if ((ancestorComponentChildFieldDocumentFeatures === null || ancestorComponentChildFieldDocumentFeatures === void 0 ? void 0 : ancestorComponentChildFieldDocumentFeatures.documentFeatures.links) === false) {
        return;
      }
      const [, maybeWhitespace, linkText, href] = match;
      // by doing this, the insertText(')') above will happen in a different undo than the link replacement
      // so that means that when someone does an undo after this
      // it will undo to the state of "[content](link)" rather than "[content](link" (note the missing closing bracket)
      editor.writeHistory('undos', {
        operations: [],
        selectionBefore: null
      });
      const startOfShortcut = match.index === 0 ? startOfBlock : utils.EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
        distance: match.index
      });
      const startOfLinkText = utils.EditorAfterButIgnoringingPointsWithNoContent(editor, startOfShortcut, {
        distance: maybeWhitespace === '' ? 1 : 2
      });
      const endOfLinkText = utils.EditorAfterButIgnoringingPointsWithNoContent(editor, startOfLinkText, {
        distance: linkText.length
      });
      slate.Transforms.delete(editor, {
        at: {
          anchor: endOfLinkText,
          focus: editor.selection.anchor
        }
      });
      slate.Transforms.delete(editor, {
        at: {
          anchor: startOfShortcut,
          focus: startOfLinkText
        }
      });
      slate.Transforms.wrapNodes(editor, {
        type: 'link',
        href,
        children: []
      }, {
        at: {
          anchor: editor.selection.anchor,
          focus: startOfShortcut
        },
        split: true
      });
      const nextNode = slate.Editor.next(editor);
      if (nextNode) {
        slate.Transforms.select(editor, nextNode[1]);
      }
    };
  }
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'link') {
      if (slate.Node.string(node) === '') {
        slate.Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'link') {
          // links cannot contain links
          slate.Transforms.unwrapNodes(editor, {
            at: [...path, idx]
          });
          return;
        }
      }
    }
    if (isInlineContainer(node)) {
      let lastMergableLink = null;
      for (const [idx, child] of node.children.entries()) {
        var _lastMergableLink;
        if (child.type === 'link' && child.href === ((_lastMergableLink = lastMergableLink) === null || _lastMergableLink === void 0 ? void 0 : _lastMergableLink.node.href)) {
          const firstLinkPath = [...path, lastMergableLink.index];
          const secondLinkPath = [...path, idx];
          const to = [...firstLinkPath, lastMergableLink.node.children.length];
          // note this is going in reverse, js doesn't have double-ended iterators so it's a for(;;)
          for (let i = child.children.length - 1; i >= 0; i--) {
            const childPath = [...secondLinkPath, i];
            slate.Transforms.moveNodes(editor, {
              at: childPath,
              to
            });
          }
          slate.Transforms.removeNodes(editor, {
            at: secondLinkPath
          });
          return;
        }
        if (!slate.Text.isText(child) || child.text !== '') {
          lastMergableLink = null;
        }
        if (child.type === 'link') {
          lastMergableLink = {
            index: idx,
            node: child
          };
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

function withHeading(editor) {
  const {
    insertBreak
  } = editor;
  editor.insertBreak = () => {
    insertBreak();
    const entry = slate.Editor.above(editor, {
      match: n => n.type === 'heading'
    });
    if (!entry || !editor.selection || !slate.Range.isCollapsed(editor.selection)) return;
    const path = entry[1];
    if (
    // we want to unwrap the heading when the user inserted a break at the end of the heading
    // when the user inserts a break at the end of a heading, the new heading
    // that we want to unwrap will be empty so the end will be equal to the selection
    slate.Point.equals(slate.Editor.end(editor, path), editor.selection.anchor)) {
      slate.Transforms.unwrapNodes(editor, {
        at: path
      });
      return;
    }
    // we also want to unwrap the _previous_ heading when the user inserted a break
    // at the start of the heading, essentially just inserting an empty paragraph above the heading
    if (!slate.Path.hasPrevious(path)) return;
    const previousPath = slate.Path.previous(path);
    const previousNode = slate.Node.get(editor, previousPath);
    if (previousNode.type === 'heading' && previousNode.children.length === 1 && slate.Text.isText(previousNode.children[0]) && previousNode.children[0].text === '') {
      slate.Transforms.unwrapNodes(editor, {
        at: previousPath
      });
    }
  };
  return editor;
}

function insertBlockquote(editor) {
  const isActive = utils.isElementActive(editor, 'blockquote');
  if (isActive) {
    slate.Transforms.unwrapNodes(editor, {
      match: node => node.type === 'blockquote'
    });
  } else {
    slate.Transforms.wrapNodes(editor, {
      type: 'blockquote',
      children: []
    });
  }
}
function getDirectBlockquoteParentFromSelection(editor) {
  if (!editor.selection) return {
    isInside: false
  };
  const [, parentPath] = slate.Editor.parent(editor, editor.selection);
  if (!parentPath.length) {
    return {
      isInside: false
    };
  }
  const [maybeBlockquoteParent, maybeBlockquoteParentPath] = slate.Editor.parent(editor, parentPath);
  const isBlockquote = maybeBlockquoteParent.type === 'blockquote';
  return isBlockquote ? {
    isInside: true,
    path: maybeBlockquoteParentPath
  } : {
    isInside: false
  };
}
function withBlockquote(editor) {
  const {
    insertBreak,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const parentBlockquote = getDirectBlockquoteParentFromSelection(editor);
      if (parentBlockquote.isInside && slate.Range.isCollapsed(editor.selection) &&
      // the selection is at the start of the paragraph
      editor.selection.anchor.offset === 0 &&
      // it's the first paragraph in the panel
      editor.selection.anchor.path[editor.selection.anchor.path.length - 2] === 0) {
        slate.Transforms.unwrapNodes(editor, {
          match: node => node.type === 'blockquote',
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const panel = getDirectBlockquoteParentFromSelection(editor);
    if (editor.selection && panel.isInside) {
      const [node, nodePath] = slate.Editor.node(editor, editor.selection);
      if (slate.Path.isDescendant(nodePath, panel.path) && slate.Node.string(node) === '') {
        slate.Transforms.unwrapNodes(editor, {
          match: node => node.type === 'blockquote',
          split: true
        });
        return;
      }
    }
    insertBreak();
  };
  return editor;
}

function withRelationship(editor) {
  const {
    isVoid,
    isInline
  } = editor;
  editor.isVoid = element => element.type === 'relationship' || isVoid(element);
  editor.isInline = element => element.type === 'relationship' || isInline(element);
  return editor;
}

function insertDivider(editor) {
  utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
    type: 'divider',
    children: [{
      text: ''
    }]
  });
  slate.Editor.insertNode(editor, {
    type: 'paragraph',
    children: [{
      text: ''
    }]
  });
}
function withDivider(editor) {
  const {
    isVoid
  } = editor;
  editor.isVoid = node => {
    return node.type === 'divider' || isVoid(node);
  };
  return editor;
}

function withCodeBlock(editor) {
  const {
    insertBreak,
    normalizeNode
  } = editor;
  editor.insertBreak = () => {
    const [node, path] = slate.Editor.above(editor, {
      match: n => slate.Element.isElement(n) && slate.Editor.isBlock(editor, n)
    }) || [editor, []];
    if (node.type === 'code' && slate.Text.isText(node.children[0])) {
      const text = node.children[0].text;
      if (text[text.length - 1] === '\n' && editor.selection && slate.Range.isCollapsed(editor.selection) && slate.Point.equals(slate.Editor.end(editor, path), editor.selection.anchor)) {
        insertBreak();
        slate.Transforms.setNodes(editor, {
          type: 'paragraph',
          children: []
        });
        slate.Transforms.delete(editor, {
          distance: 1,
          at: {
            path: [...path, 0],
            offset: text.length - 1
          }
        });
        return;
      }
      editor.insertText('\n');
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'code' && slate.Element.isElement(node)) {
      for (const [index, childNode] of node.children.entries()) {
        if (!slate.Text.isText(childNode)) {
          if (editor.isVoid(childNode)) {
            slate.Transforms.removeNodes(editor, {
              at: [...path, index]
            });
          } else {
            slate.Transforms.unwrapNodes(editor, {
              at: [...path, index]
            });
          }
          return;
        }
        const marks = Object.keys(childNode).filter(x => x !== 'text');
        if (marks.length) {
          slate.Transforms.unsetNodes(editor, marks, {
            at: [...path, index]
          });
          return;
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

const allMarkdownShortcuts = {
  bold: ['**', '__'],
  italic: ['*', '_'],
  strikethrough: ['~~'],
  code: ['`']
};
function applyMark(editor, mark, shortcutText, startOfStartPoint) {
  // so that this starts a new undo group
  editor.writeHistory('undos', {
    operations: [],
    selectionBefore: null
  });
  const startPointRef = slate.Editor.pointRef(editor, startOfStartPoint);
  slate.Transforms.delete(editor, {
    at: editor.selection.anchor,
    distance: shortcutText.length,
    reverse: true
  });
  slate.Transforms.delete(editor, {
    at: startOfStartPoint,
    distance: shortcutText.length
  });
  slate.Transforms.setNodes(editor, {
    [mark]: true
  }, {
    match: slate.Text.isText,
    split: true,
    at: {
      anchor: startPointRef.unref(),
      focus: editor.selection.anchor
    }
  });
  // once you've ended the shortcut, you're done with the mark
  // so we need to remove it so the text you insert after doesn't have it
  editor.removeMark(mark);
}
function withMarks(editorDocumentFeatures, componentBlocks, editor) {
  const {
    insertText,
    insertBreak
  } = editor;
  editor.insertBreak = () => {
    insertBreak();
    const marksAfterInsertBreak = slate.Editor.marks(editor);
    if (!marksAfterInsertBreak || !editor.selection) return;
    const parentBlock = slate.Editor.above(editor, {
      match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
    });
    if (!parentBlock) return;
    const point = utils.EditorAfterButIgnoringingPointsWithNoContent(editor, editor.selection.anchor);
    const marksAfterInsertBreakArr = Object.keys(marksAfterInsertBreak);
    if (!point || !slate.Path.isDescendant(point.path, parentBlock[1])) {
      for (const mark of marksAfterInsertBreakArr) {
        editor.removeMark(mark);
      }
      return;
    }
    const textNode = slate.Node.get(editor, point.path);
    for (const mark of marksAfterInsertBreakArr) {
      if (!textNode[mark]) {
        editor.removeMark(mark);
      }
    }
  };
  const selectedMarkdownShortcuts = {};
  const enabledMarks = editorDocumentFeatures.formatting.inlineMarks;
  Object.keys(allMarkdownShortcuts).forEach(mark => {
    if (enabledMarks[mark]) {
      selectedMarkdownShortcuts[mark] = allMarkdownShortcuts[mark];
    }
  });
  if (Object.keys(selectedMarkdownShortcuts).length === 0) return editor;
  editor.insertText = text => {
    insertText(text);
    if (editor.selection && slate.Range.isCollapsed(editor.selection)) {
      for (const [mark, shortcuts] of Object.entries(selectedMarkdownShortcuts)) {
        for (const shortcutText of shortcuts) {
          if (text === shortcutText[shortcutText.length - 1]) {
            // this function is not inlined because
            // https://github.com/swc-project/swc/issues/2622
            const startOfBlock = getStartOfBlock(editor);
            const startOfBlockToEndOfShortcutString = slate.Editor.string(editor, {
              anchor: editor.selection.anchor,
              focus: startOfBlock
            });
            const hasWhitespaceBeforeEndOfShortcut = /\s/.test(startOfBlockToEndOfShortcutString.slice(-shortcutText.length - 1, -shortcutText.length));
            const endOfShortcutContainsExpectedContent = shortcutText === startOfBlockToEndOfShortcutString.slice(-shortcutText.length);
            if (hasWhitespaceBeforeEndOfShortcut || !endOfShortcutContainsExpectedContent) {
              continue;
            }
            const strToMatchOn = startOfBlockToEndOfShortcutString.slice(0, -shortcutText.length - 1);
            // TODO: use regex probs
            for (const [offsetFromStartOfBlock] of [...strToMatchOn].reverse().entries()) {
              const expectedShortcutText = strToMatchOn.slice(offsetFromStartOfBlock, offsetFromStartOfBlock + shortcutText.length);
              if (expectedShortcutText !== shortcutText) {
                continue;
              }
              const startOfStartOfShortcut = offsetFromStartOfBlock === 0 ? startOfBlock : utils.EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
                distance: offsetFromStartOfBlock
              });
              const endOfStartOfShortcut = slate.Editor.after(editor, startOfStartOfShortcut, {
                distance: shortcutText.length
              });
              if (offsetFromStartOfBlock !== 0 && !/\s/.test(slate.Editor.string(editor, {
                anchor: slate.Editor.before(editor, startOfStartOfShortcut, {
                  unit: 'character'
                }),
                focus: startOfStartOfShortcut
              }))) {
                continue;
              }
              const contentBetweenShortcuts = slate.Editor.string(editor, {
                anchor: endOfStartOfShortcut,
                focus: editor.selection.anchor
              }).slice(0, -shortcutText.length);
              if (contentBetweenShortcuts === '' || /\s/.test(contentBetweenShortcuts[0])) {
                continue;
              }

              // this is a bit of a weird one
              // let's say you had <text>__thing _<cursor /></text> and you insert `_`.
              // without the below, that would turn into <text italic>_thing _<cursor /></text>
              // but it's probably meant to be bold but it's not because of the space before the ending _
              // there's probably a better way to do this but meh, this works
              if (mark === 'italic' && (contentBetweenShortcuts[0] === '_' || contentBetweenShortcuts[0] === '*')) {
                continue;
              }
              const ancestorComponentChildFieldDocumentFeatures = layoutsShared.getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks);
              if (ancestorComponentChildFieldDocumentFeatures && ancestorComponentChildFieldDocumentFeatures.inlineMarks !== 'inherit' && ancestorComponentChildFieldDocumentFeatures.inlineMarks[mark] === false) {
                continue;
              }
              applyMark(editor, mark, shortcutText, startOfStartOfShortcut);
              return;
            }
          }
        }
      }
    }
  };
  return editor;
}
function getStartOfBlock(editor) {
  return slate.Editor.start(editor, slate.Editor.above(editor, {
    match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
  })[1]);
}

function withSoftBreaks(editor) {
  // TODO: should soft breaks only work in particular places
  editor.insertSoftBreak = () => {
    slate.Transforms.insertText(editor, '\n');
  };
  return editor;
}

const shortcuts = {
  '...': '…',
  '-->': '→',
  '->': '→',
  '<-': '←',
  '<--': '←',
  '--': '–'
};
function withShortcuts(editor) {
  const {
    insertText
  } = editor;
  editor.insertText = text => {
    insertText(text);
    if (text === ' ' && editor.selection && slate.Range.isCollapsed(editor.selection)) {
      const selectionPoint = editor.selection.anchor;
      const ancestorBlock = slate.Editor.above(editor, {
        match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
      });
      if (ancestorBlock) {
        Object.keys(shortcuts).forEach(shortcut => {
          const pointBefore = slate.Editor.before(editor, selectionPoint, {
            unit: 'character',
            distance: shortcut.length + 1
          });
          if (pointBefore && slate.Path.isDescendant(pointBefore.path, ancestorBlock[1])) {
            const range = {
              anchor: selectionPoint,
              focus: pointBefore
            };
            const str = slate.Editor.string(editor, range);
            if (str.slice(0, shortcut.length) === shortcut) {
              editor.writeHistory('undos', {
                operations: [],
                selectionBefore: null
              });
              slate.Transforms.select(editor, range);
              editor.insertText(shortcuts[shortcut] + ' ');
            }
          }
        });
      }
    }
  };
  return editor;
}

const nodeListsWithoutInsertMenu = new WeakSet();
const nodesWithoutInsertMenu = new WeakSet();
function findPathWithInsertMenu(node, path) {
  if (slate.Text.isText(node)) return node.insertMenu ? path : undefined;
  if (nodeListsWithoutInsertMenu.has(node.children)) return;
  for (const [index, child] of node.children.entries()) {
    if (nodesWithoutInsertMenu.has(child)) continue;
    const maybePath = findPathWithInsertMenu(child, [...path, index]);
    if (maybePath) {
      return maybePath;
    }
    nodesWithoutInsertMenu.add(child);
  }
  nodeListsWithoutInsertMenu.add(node.children);
}
function removeInsertMenuMarkWhenOutsideOfSelection(editor) {
  var _Editor$marks;
  const path = findPathWithInsertMenu(editor, []);
  if (path && !((_Editor$marks = slate.Editor.marks(editor)) !== null && _Editor$marks !== void 0 && _Editor$marks.insertMenu) && (!editor.selection || !slate.Path.equals(editor.selection.anchor.path, path) || !slate.Path.equals(editor.selection.focus.path, path))) {
    slate.Transforms.unsetNodes(editor, 'insertMenu', {
      at: path
    });
    return true;
  }
  return false;
}
function withInsertMenu(editor) {
  const {
    normalizeNode,
    apply,
    insertText
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (slate.Text.isText(node) && node.insertMenu) {
      if (node.text[0] !== '/') {
        slate.Transforms.unsetNodes(editor, 'insertMenu', {
          at: path
        });
        return;
      }
      const whitespaceMatch = /\s/.exec(node.text);
      if (whitespaceMatch) {
        slate.Transforms.unsetNodes(editor, 'insertMenu', {
          at: {
            anchor: {
              path,
              offset: whitespaceMatch.index
            },
            focus: slate.Editor.end(editor, path)
          },
          match: slate.Text.isText,
          split: true
        });
        return;
      }
    }
    if (slate.Editor.isEditor(editor) && removeInsertMenuMarkWhenOutsideOfSelection(editor)) {
      return;
    }
    normalizeNode([node, path]);
  };
  editor.apply = op => {
    apply(op);
    // we're calling this here AND in normalizeNode
    // because normalizeNode won't be called on selection changes
    // but apply will
    // we're still calling this from normalizeNode though because we want it to happen
    // when normalization happens
    if (op.type === 'set_selection') {
      removeInsertMenuMarkWhenOutsideOfSelection(editor);
    }
  };
  editor.insertText = text => {
    insertText(text);
    if (editor.selection && text === '/') {
      const startOfBlock = slate.Editor.start(editor, slate.Editor.above(editor, {
        match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
      })[1]);
      const before = slate.Editor.before(editor, editor.selection.anchor, {
        unit: 'character'
      });
      if (before && (slate.Point.equals(startOfBlock, before) || before.offset !== 0 && /\s/.test(slate.Node.get(editor, before.path).text[before.offset - 1]))) {
        slate.Transforms.setNodes(editor, {
          insertMenu: true
        }, {
          at: {
            anchor: before,
            focus: editor.selection.anchor
          },
          match: slate.Text.isText,
          split: true
        });
      }
    }
  };
  return editor;
}

function withBlockMarkdownShortcuts(documentFeatures, componentBlocks, editor) {
  const {
    insertText
  } = editor;
  const shortcuts = Object.create(null);
  const editorDocumentFeaturesForNormalizationToCheck = {
    ...documentFeatures,
    relationships: true
  };
  const addShortcut = (text, insert, shouldBeEnabledInComponentBlock, type = 'paragraph') => {
    if (!shouldBeEnabledInComponentBlock(editorDocumentFeaturesForNormalizationToCheck)) return;
    const trigger = text[text.length - 1];
    if (!shortcuts[trigger]) {
      shortcuts[trigger] = Object.create(null);
    }
    shortcuts[trigger][text] = {
      insert,
      type,
      shouldBeEnabledInComponentBlock
    };
  };
  addShortcut('1. ', () => {
    slate.Transforms.wrapNodes(editor, {
      type: 'ordered-list',
      children: []
    }, {
      match: n => slate.Element.isElement(n) && slate.Editor.isBlock(editor, n)
    });
  }, features => features.formatting.listTypes.ordered);
  addShortcut('- ', () => {
    slate.Transforms.wrapNodes(editor, {
      type: 'unordered-list',
      children: []
    }, {
      match: n => slate.Element.isElement(n) && slate.Editor.isBlock(editor, n)
    });
  }, features => features.formatting.listTypes.unordered);
  addShortcut('* ', () => {
    slate.Transforms.wrapNodes(editor, {
      type: 'unordered-list',
      children: []
    }, {
      match: n => slate.Element.isElement(n) && slate.Editor.isBlock(editor, n)
    });
  }, features => features.formatting.listTypes.unordered);
  documentFeatures.formatting.headingLevels.forEach(level => {
    addShortcut('#'.repeat(level) + ' ', () => {
      slate.Transforms.setNodes(editor, {
        type: 'heading',
        level
      }, {
        match: node => node.type === 'paragraph' || node.type === 'heading'
      });
    }, features => features.formatting.headingLevels.includes(level), 'heading-or-paragraph');
  });
  addShortcut('> ', () => {
    slate.Transforms.wrapNodes(editor, {
      type: 'blockquote',
      children: []
    }, {
      match: node => node.type === 'paragraph'
    });
  }, features => features.formatting.blockTypes.blockquote);
  addShortcut('```', () => {
    slate.Transforms.wrapNodes(editor, {
      type: 'code',
      children: []
    }, {
      match: node => node.type === 'paragraph'
    });
  }, features => features.formatting.blockTypes.code);
  addShortcut('---', () => {
    insertDivider(editor);
  }, features => features.dividers);
  editor.insertText = text => {
    insertText(text);
    const shortcutsForTrigger = shortcuts[text];
    if (shortcutsForTrigger && editor.selection && slate.Range.isCollapsed(editor.selection)) {
      const {
        anchor
      } = editor.selection;
      const block = slate.Editor.above(editor, {
        match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
      });
      if (!block || block[0].type !== 'paragraph' && block[0].type !== 'heading') return;
      const start = slate.Editor.start(editor, block[1]);
      const range = {
        anchor,
        focus: start
      };
      const shortcutText = slate.Editor.string(editor, range);
      const shortcut = shortcutsForTrigger[shortcutText];
      if (!shortcut || shortcut.type === 'paragraph' && block[0].type !== 'paragraph') {
        return;
      }
      const locationDocumentFeatures = layoutsShared.getAncestorComponentChildFieldDocumentFeatures(editor, documentFeatures, componentBlocks);
      if (locationDocumentFeatures && (locationDocumentFeatures.kind === 'inline' || !shortcut.shouldBeEnabledInComponentBlock(locationDocumentFeatures.documentFeatures))) {
        return;
      }
      // so that this starts a new undo group
      editor.writeHistory('undos', {
        operations: [],
        selectionBefore: null
      });
      slate.Transforms.select(editor, range);
      slate.Transforms.delete(editor);
      shortcut.insert();
    }
  };
  return editor;
}

// a v important note
// marks in the markdown ast/html are represented quite differently to how they are in slate
// if you had the markdown **something https://keystonejs.com something**
// the bold node is the parent of the link node
// but in slate, marks are only represented on text nodes

const currentlyActiveMarks = new Set();
const currentlyDisabledMarks = new Set();
let currentLink = null;
function addMarkToChildren(mark, cb) {
  const wasPreviouslyActive = currentlyActiveMarks.has(mark);
  currentlyActiveMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyActive) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function setLinkForChildren(href, cb) {
  // we'll only use the outer link
  if (currentLink !== null) {
    return cb();
  }
  currentLink = href;
  try {
    return cb();
  } finally {
    currentLink = null;
  }
}
function addMarksToChildren(marks, cb) {
  const marksToRemove = new Set();
  for (const mark of marks) {
    if (!currentlyActiveMarks.has(mark)) {
      marksToRemove.add(mark);
    }
    currentlyActiveMarks.add(mark);
  }
  try {
    return cb();
  } finally {
    for (const mark of marksToRemove) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function forceDisableMarkForChildren(mark, cb) {
  const wasPreviouslyDisabled = currentlyDisabledMarks.has(mark);
  currentlyDisabledMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyDisabled) {
      currentlyDisabledMarks.delete(mark);
    }
  }
}

/**
 * This type is more strict than `Element & { type: 'link'; }` because `children`
 * is constrained to only contain Text nodes. This can't be assumed generally around the editor
 * (because of inline relationships or nested links(which are normalized away but the editor needs to not break if it happens))
 * but where this type is used, we're only going to allow links to contain Text and that's important
 * so that we know a block will never be inside an inline because Slate gets unhappy when that happens
 * (really the link inline should probably be a mark rather than an inline,
 * non-void inlines are probably always bad but that would imply changing the document
 * structure which would be such unnecessary breakage)
 */

// inline relationships are not here because we never create them from handling a paste from html or markdown

function getInlineNodes(text) {
  const node = {
    text
  };
  for (const mark of currentlyActiveMarks) {
    if (!currentlyDisabledMarks.has(mark)) {
      node[mark] = true;
    }
  }
  if (currentLink !== null) {
    return [{
      text: ''
    }, {
      type: 'link',
      href: currentLink,
      children: [node]
    }, {
      text: ''
    }];
  }
  return [node];
}

// very loosely based on https://github.com/ianstormtaylor/slate/blob/d22c76ae1313fe82111317417912a2670e73f5c9/site/examples/paste-html.tsx
function getAlignmentFromElement(element) {
  const parent = element.parentElement;
  // confluence
  const attribute = parent === null || parent === void 0 ? void 0 : parent.getAttribute('data-align');
  // note: we don't show html that confluence would parse as alignment
  // we could change that but meh
  // (they match on div.fabric-editor-block-mark with data-align)
  if (attribute === 'center' || attribute === 'end') {
    return attribute;
  }
  if (element instanceof HTMLElement) {
    // Google docs
    const textAlign = element.style.textAlign;
    if (textAlign === 'center') {
      return 'center';
    }
    // TODO: RTL things?
    if (textAlign === 'right' || textAlign === 'end') {
      return 'end';
    }
  }
}
const headings = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6
};
const TEXT_TAGS = {
  CODE: 'code',
  DEL: 'strikethrough',
  S: 'strikethrough',
  STRIKE: 'strikethrough',
  EM: 'italic',
  I: 'italic',
  STRONG: 'bold',
  U: 'underline',
  SUP: 'superscript',
  SUB: 'subscript',
  KBD: 'keyboard'
};
function marksFromElementAttributes(element) {
  const marks = new Set();
  const style = element.style;
  const {
    nodeName
  } = element;
  const markFromNodeName = TEXT_TAGS[nodeName];
  if (markFromNodeName) {
    marks.add(markFromNodeName);
  }
  const {
    fontWeight,
    textDecoration,
    verticalAlign
  } = style;
  if (textDecoration === 'underline') {
    marks.add('underline');
  } else if (textDecoration === 'line-through') {
    marks.add('strikethrough');
  }
  // confluence
  if (nodeName === 'SPAN' && element.classList.contains('code')) {
    marks.add('code');
  }
  // Google Docs does weird things with <b>
  if (nodeName === 'B' && fontWeight !== 'normal') {
    marks.add('bold');
  } else if (typeof fontWeight === 'string' && (fontWeight === 'bold' || fontWeight === 'bolder' || fontWeight === '1000' || /^[5-9]\d{2}$/.test(fontWeight))) {
    marks.add('bold');
  }
  if (style.fontStyle === 'italic') {
    marks.add('italic');
  }
  // Google Docs uses vertical align for subscript and superscript instead of <sup> and <sub>
  if (verticalAlign === 'super') {
    marks.add('superscript');
  } else if (verticalAlign === 'sub') {
    marks.add('subscript');
  }
  return marks;
}
function deserializeHTML(html) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  return fixNodesForBlockChildren(deserializeNodes(parsed.body.childNodes));
}
function deserializeHTMLNode(el) {
  if (!(el instanceof globalThis.HTMLElement)) {
    const text = el.textContent;
    if (!text) {
      return [];
    }
    return getInlineNodes(text);
  }
  if (el.nodeName === 'BR') {
    return getInlineNodes('\n');
  }
  if (el.nodeName === 'IMG') {
    const alt = el.getAttribute('alt');
    return getInlineNodes(alt !== null && alt !== void 0 ? alt : '');
  }
  if (el.nodeName === 'HR') {
    return [{
      type: 'divider',
      children: [{
        text: ''
      }]
    }];
  }
  const marks = marksFromElementAttributes(el);

  // Dropbox Paper displays blockquotes as lists for some reason
  if (el.classList.contains('listtype-quote')) {
    marks.delete('italic');
    return addMarksToChildren(marks, () => [{
      type: 'blockquote',
      children: fixNodesForBlockChildren(deserializeNodes(el.childNodes))
    }]);
  }
  return addMarksToChildren(marks, () => {
    const {
      nodeName
    } = el;
    if (nodeName === 'A') {
      const href = el.getAttribute('href');
      if (href) {
        return setLinkForChildren(href, () => forceDisableMarkForChildren('underline', () => deserializeNodes(el.childNodes)));
      }
    }
    if (nodeName === 'PRE' && el.textContent) {
      return [{
        type: 'code',
        children: [{
          text: el.textContent || ''
        }]
      }];
    }
    const deserialized = deserializeNodes(el.childNodes);
    const children = fixNodesForBlockChildren(deserialized);
    if (nodeName === 'LI') {
      let nestedList;
      const listItemContent = {
        type: 'list-item-content',
        children: children.filter(node => {
          if (nestedList === undefined && (node.type === 'ordered-list' || node.type === 'unordered-list')) {
            nestedList = node;
            return false;
          }
          return true;
        })
      };
      const listItemChildren = nestedList ? [listItemContent, nestedList] : [listItemContent];
      return [{
        type: 'list-item',
        children: listItemChildren
      }];
    }
    if (nodeName === 'P') {
      return [{
        type: 'paragraph',
        textAlign: getAlignmentFromElement(el),
        children
      }];
    }
    const headingLevel = headings[nodeName];
    if (typeof headingLevel === 'number') {
      return [{
        type: 'heading',
        level: headingLevel,
        textAlign: getAlignmentFromElement(el),
        children
      }];
    }
    if (nodeName === 'BLOCKQUOTE') {
      return [{
        type: 'blockquote',
        children
      }];
    }
    if (nodeName === 'OL') {
      return [{
        type: 'ordered-list',
        children
      }];
    }
    if (nodeName === 'UL') {
      return [{
        type: 'unordered-list',
        children
      }];
    }
    if (nodeName === 'DIV' && !isBlock(children[0])) {
      return [{
        type: 'paragraph',
        children
      }];
    }
    return deserialized;
  });
}
function deserializeNodes(nodes) {
  const outputNodes = [];
  for (const node of nodes) {
    outputNodes.push(...deserializeHTMLNode(node));
  }
  return outputNodes;
}
function fixNodesForBlockChildren(deserializedNodes) {
  if (!deserializedNodes.length) {
    // Slate also gets unhappy if an element has no children
    // the empty text nodes will get normalized away if they're not needed
    return [{
      text: ''
    }];
  }
  if (deserializedNodes.some(isBlock)) {
    const result = [];
    let queuedInlines = [];
    const flushInlines = () => {
      if (queuedInlines.length) {
        result.push({
          type: 'paragraph',
          children: queuedInlines
        });
        queuedInlines = [];
      }
    };
    for (const node of deserializedNodes) {
      if (isBlock(node)) {
        flushInlines();
        result.push(node);
        continue;
      }
      // we want to ignore whitespace between block level elements
      // useful info about whitespace in html:
      // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
      if (slate.Node.string(node).trim() !== '') {
        queuedInlines.push(node);
      }
    }
    flushInlines();
    return result;
  }
  return deserializedNodes;
}

const markdownConfig = {
  mdastExtensions: [autoLinkLiteralFromMarkdownExtension__default["default"], gfmStrikethroughFromMarkdownExtension__default["default"]],
  extensions: [autoLinkLiteralMarkdownSyntax__default["default"], gfmStrikethroughMarkdownSyntax__default["default"]()]
};
function deserializeMarkdown(markdown) {
  const root = mdASTUtilFromMarkdown__default["default"](markdown, markdownConfig);
  let nodes = root.children;
  if (nodes.length === 1 && nodes[0].type === 'paragraph') {
    nodes = nodes[0].children;
  }
  return deserializeChildren(nodes, markdown);
}
function deserializeChildren(nodes, input) {
  const outputNodes = [];
  for (const node of nodes) {
    const result = deserializeMarkdownNode(node, input);
    if (result.length) {
      outputNodes.push(...result);
    }
  }
  if (!outputNodes.length) {
    outputNodes.push({
      text: ''
    });
  }
  return outputNodes;
}
function deserializeMarkdownNode(node, input) {
  switch (node.type) {
    case 'blockquote':
      return [{
        type: 'blockquote',
        children: deserializeChildren(node.children, input)
      }];
    case 'link':
      {
        // arguably this could just return a link node rather than use setLinkForChildren since the children _should_ only be inlines
        // but rather than relying on the markdown parser we use being correct in this way since it isn't nicely codified in types
        // let's be safe since we already have the code to do it the safer way because of html pasting
        return setLinkForChildren(node.url, () => deserializeChildren(node.children, input));
      }
    case 'code':
      return [{
        type: 'code',
        children: [{
          text: node.value
        }]
      }];
    case 'paragraph':
      return [{
        type: 'paragraph',
        children: deserializeChildren(node.children, input)
      }];
    case 'heading':
      {
        return [{
          type: 'heading',
          level: node.depth,
          children: deserializeChildren(node.children, input)
        }];
      }
    case 'list':
      {
        return [{
          type: node.ordered ? 'ordered-list' : 'unordered-list',
          children: deserializeChildren(node.children, input)
        }];
      }
    case 'listItem':
      return [{
        type: 'list-item',
        children: deserializeChildren(node.children, input)
      }];
    case 'thematicBreak':
      return [{
        type: 'divider',
        children: [{
          text: ''
        }]
      }];
    case 'break':
      return getInlineNodes('\n');
    case 'delete':
      return addMarkToChildren('strikethrough', () => deserializeChildren(node.children, input));
    case 'strong':
      return addMarkToChildren('bold', () => deserializeChildren(node.children, input));
    case 'emphasis':
      return addMarkToChildren('italic', () => deserializeChildren(node.children, input));
    case 'inlineCode':
      return addMarkToChildren('code', () => getInlineNodes(node.value));
    case 'text':
      return getInlineNodes(node.value);
  }
  return getInlineNodes(input.slice(node.position.start.offset, node.position.end.offset));
}

const urlPattern = /https?:\/\//;
function insertFragmentButDifferent(editor, nodes) {
  const firstNode = nodes[0];
  if (slate.Element.isElement(firstNode) && slate.Editor.isBlock(editor, firstNode)) {
    utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, nodes);
  } else {
    slate.Transforms.insertFragment(editor, nodes);
  }
}
function withPasting(editor) {
  const {
    insertData,
    setFragmentData
  } = editor;
  editor.setFragmentData = data => {
    if (editor.selection) {
      data.setData('application/x-keystone-document-editor', 'true');
    }
    setFragmentData(data);
  };
  editor.insertData = data => {
    // this exists because behind the scenes, Slate sets the slate document
    // on the data transfer, this is great because it means when you copy and paste
    // something in the editor or between editors, it'll use the actual Slate data
    // rather than the serialized html so component blocks and etc. will work fine
    // we're setting application/x-keystone-document-editor
    // though so that we only accept slate data from Keystone's editor
    // because other editors will likely have a different structure
    // so we'll rely on the html deserialization instead
    // (note that yes, we do call insertData at the end of this function
    // which is where Slate's logic will run, it'll never do anything there though
    // since anything that will have slate data will also have text/html which we handle
    // before we call insertData)
    // TODO: handle the case of copying between editors with different components blocks
    // (right now, things will blow up in most cases)
    if (data.getData('application/x-keystone-document-editor') === 'true') {
      insertData(data);
      return;
    }
    const blockAbove = slate.Editor.above(editor, {
      match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
    });
    if ((blockAbove === null || blockAbove === void 0 ? void 0 : blockAbove[0].type) === 'code') {
      const plain = data.getData('text/plain');
      editor.insertText(plain);
      return;
    }
    const vsCodeEditorData = data.getData('vscode-editor-data');
    if (vsCodeEditorData) {
      try {
        const vsCodeData = JSON.parse(vsCodeEditorData);
        if ((vsCodeData === null || vsCodeData === void 0 ? void 0 : vsCodeData.mode) === 'markdown' || (vsCodeData === null || vsCodeData === void 0 ? void 0 : vsCodeData.mode) === 'mdx') {
          const plain = data.getData('text/plain');
          if (plain) {
            const fragment = deserializeMarkdown(plain);
            insertFragmentButDifferent(editor, fragment);
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    const plain = data.getData('text/plain');
    if (
    // isValidURL is a bit more permissive than a user might expect
    // so for pasting, we'll constrain it to starting with https:// or http://
    urlPattern.test(plain) && isValidURL.isValidURL(plain) && editor.selection && !slate.Range.isCollapsed(editor.selection) &&
    // we only want to turn the selected text into a link if the selection is within the same block
    slate.Editor.above(editor, {
      match: node => slate.Element.isElement(node) && slate.Editor.isBlock(editor, node) && !(slate.Element.isElement(node.children[0]) && slate.Editor.isBlock(editor, node.children[0]))
    }) &&
    // and there is only text(potentially with marks) in the selection
    // no other links or inline relationships
    slate.Editor.nodes(editor, {
      match: node => slate.Element.isElement(node) && slate.Editor.isInline(editor, node)
    }).next().done) {
      slate.Transforms.wrapNodes(editor, {
        type: 'link',
        href: plain,
        children: []
      }, {
        split: true
      });
      return;
    }
    const html = data.getData('text/html');
    if (html) {
      const fragment = deserializeHTML(html);
      insertFragmentButDifferent(editor, fragment);
      return;
    }
    if (plain) {
      const fragment = deserializeMarkdown(plain);
      insertFragmentButDifferent(editor, fragment);
      return;
    }
    insertData(data);
  };
  return editor;
}

const blockquoteChildren = ['paragraph', 'code', 'heading', 'ordered-list', 'unordered-list', 'divider'];
const paragraphLike = [...blockquoteChildren, 'blockquote'];
const insideOfLayouts = [...paragraphLike, 'component-block'];
const editorSchema = {
  editor: blockContainer({
    allowedChildren: [...insideOfLayouts, 'layout'],
    invalidPositionHandleMode: 'move'
  }),
  layout: blockContainer({
    allowedChildren: ['layout-area'],
    invalidPositionHandleMode: 'move'
  }),
  'layout-area': blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: 'unwrap'
  }),
  blockquote: blockContainer({
    allowedChildren: blockquoteChildren,
    invalidPositionHandleMode: 'move'
  }),
  paragraph: inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  code: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  divider: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  heading: inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  'component-block': blockContainer({
    allowedChildren: ['component-block-prop', 'component-inline-prop'],
    invalidPositionHandleMode: 'move'
  }),
  'component-inline-prop': inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  'component-block-prop': blockContainer({
    allowedChildren: paragraphLike,
    invalidPositionHandleMode: 'unwrap'
  }),
  'ordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move'
  }),
  'unordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move'
  }),
  'list-item': blockContainer({
    allowedChildren: ['list-item-content', 'ordered-list', 'unordered-list'],
    invalidPositionHandleMode: 'unwrap'
  }),
  'list-item-content': inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  })
};
function inlineContainer(args) {
  return {
    kind: 'inlines',
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
const inlineContainerTypes = new Set(Object.entries(editorSchema).filter(([, value]) => value.kind === 'inlines').map(([type]) => type));
function isInlineContainer(node) {
  return node.type !== undefined && inlineContainerTypes.has(node.type);
}
function createDocumentEditor(documentFeatures, componentBlocks, relationships, slate$1) {
  var _slate$withReact;
  return withPasting(withSoftBreaks(withBlocksSchema(withLink(documentFeatures, componentBlocks, layoutsShared.withList(withHeading(withRelationship(withInsertMenu(withComponentBlocks(componentBlocks, documentFeatures, relationships, layoutsShared.withParagraphs(withShortcuts(withDivider(layoutsShared.withLayouts(withMarks(documentFeatures, componentBlocks, withCodeBlock(withBlockMarkdownShortcuts(documentFeatures, componentBlocks, withBlockquote(layoutsShared.withDocumentFeaturesNormalization(documentFeatures, relationships, slateHistory.withHistory((_slate$withReact = slate$1 === null || slate$1 === void 0 ? void 0 : slate$1.withReact(slate.createEditor())) !== null && _slate$withReact !== void 0 ? _slate$withReact : slate.createEditor())))))))))))))))))));
}
function blockContainer(args) {
  return {
    kind: 'blocks',
    allowedChildren: new Set(args.allowedChildren),
    blockToWrapInlinesIn: args.allowedChildren[0],
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
const blockTypes = new Set(Object.keys(editorSchema).filter(x => x !== 'editor'));
function isBlock(node) {
  return blockTypes.has(node.type);
}
function withBlocksSchema(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (!slate.Text.isText(node) && node.type !== 'link' && node.type !== 'relationship') {
      const nodeType = slate.Editor.isEditor(node) ? 'editor' : node.type;
      if (typeof nodeType !== 'string' || editorSchema[nodeType] === undefined) {
        slate.Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      const info = editorSchema[nodeType];
      if (info.kind === 'blocks' && node.children.length !== 0 && node.children.every(child => !(slate.Element.isElement(child) && slate.Editor.isBlock(editor, child)))) {
        slate.Transforms.wrapNodes(editor, {
          type: info.blockToWrapInlinesIn,
          children: []
        }, {
          at: path,
          match: node => !(slate.Element.isElement(node) && slate.Editor.isBlock(editor, node))
        });
        return;
      }
      for (const [index, childNode] of node.children.entries()) {
        const childPath = [...path, index];
        if (info.kind === 'inlines') {
          if (!slate.Text.isText(childNode) && !slate.Editor.isInline(editor, childNode) &&
          // these checks are implicit in Editor.isBlock
          // but that isn't encoded in types so these will make TS happy
          childNode.type !== 'link' && childNode.type !== 'relationship') {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            return;
          }
        } else {
          if (!(slate.Element.isElement(childNode) && slate.Editor.isBlock(editor, childNode)) ||
          // these checks are implicit in Editor.isBlock
          // but that isn't encoded in types so these will make TS happy
          childNode.type === 'link' || childNode.type === 'relationship') {
            slate.Transforms.wrapNodes(editor, {
              type: info.blockToWrapInlinesIn,
              children: []
            }, {
              at: childPath
            });
            return;
          }
          if (slate.Element.isElement(childNode) && slate.Editor.isBlock(editor, childNode) && !info.allowedChildren.has(childNode.type)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            return;
          }
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}
function handleNodeInInvalidPosition(editor, [node, path], parentPath) {
  const nodeType = node.type;
  const childNodeInfo = editorSchema[nodeType];
  // the parent of a block will never be an inline so this casting is okay
  const parentNode = slate.Node.get(editor, parentPath);
  const parentNodeType = slate.Editor.isEditor(parentNode) ? 'editor' : parentNode.type;
  const parentNodeInfo = editorSchema[parentNodeType];
  if (!childNodeInfo || childNodeInfo.invalidPositionHandleMode === 'unwrap') {
    if (parentNodeInfo.kind === 'blocks' && parentNodeInfo.blockToWrapInlinesIn) {
      slate.Transforms.setNodes(editor, {
        type: parentNodeInfo.blockToWrapInlinesIn,
        ...Object.fromEntries(Object.keys(node).filter(key => key !== 'type' && key !== 'children').map(key => [key, null])) // the Slate types don't understand that null is allowed and it will unset properties with setNodes
      }, {
        at: path
      });
      return;
    }
    slate.Transforms.unwrapNodes(editor, {
      at: path
    });
    return;
  }
  const info = editorSchema[parentNode.type || 'editor'];
  if ((info === null || info === void 0 ? void 0 : info.kind) === 'blocks' && info.allowedChildren.has(nodeType)) {
    if (parentPath.length === 0) {
      slate.Transforms.moveNodes(editor, {
        at: path,
        to: [path[0] + 1]
      });
    } else {
      slate.Transforms.moveNodes(editor, {
        at: path,
        to: slate.Path.next(parentPath)
      });
    }
    return;
  }
  if (slate.Editor.isEditor(parentNode)) {
    slate.Transforms.moveNodes(editor, {
      at: path,
      to: [path[0] + 1]
    });
    slate.Transforms.unwrapNodes(editor, {
      at: [path[0] + 1]
    });
    return;
  }
  handleNodeInInvalidPosition(editor, [node, path], parentPath.slice(0, -1));
}

// to print the editor schema in Graphviz if you want to visualize it
// function printEditorSchema(editorSchema: EditorSchema) {
//   return `digraph G {
//   concentrate=true;
//   ${Object.keys(editorSchema)
//     .map(key => {
//       let val = editorSchema[key];
//       if (val.kind === 'inlines') {
//         return `"${key}" -> inlines`;
//       }
//       if (val.kind === 'blocks') {
//         return `"${key}" -> {${[...val.allowedChildren].map(x => JSON.stringify(x)).join(' ')}}`;
//       }
//     })
//     .join('\n  ')}
// }`;
// }

exports.createDocumentEditor = createDocumentEditor;
exports.insertBlockquote = insertBlockquote;
exports.insertDivider = insertDivider;
exports.wrapLink = wrapLink;

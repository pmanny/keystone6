'use strict';

var slate = require('slate');
var utils = require('./utils-8f1d1f0a.cjs.prod.js');

function areArraysEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
function normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, inlineMarks, softBreaks) {
  const marksToRemove = Object.keys(node).filter(x => x !== 'text' && x !== 'insertMenu' && inlineMarks[x] !== true);
  if (marksToRemove.length) {
    slate.Transforms.unsetNodes(editor, marksToRemove, {
      at: path
    });
    return true;
  }
  if (!softBreaks) {
    const hasSoftBreaks = node.text.includes('\n');
    if (hasSoftBreaks) {
      const [parentNode] = slate.Editor.parent(editor, path);
      if (parentNode.type !== 'code') {
        for (const position of slate.Editor.positions(editor, {
          at: path
        })) {
          const character = slate.Node.get(editor, position.path).text[position.offset];
          if (character === '\n') {
            slate.Transforms.delete(editor, {
              at: position
            });
            return true;
          }
        }
      }
    }
  }
  return false;
}
function normalizeInlineBasedOnLinksAndRelationships([node, path], editor, links, relationshipsEnabled, relationships) {
  if (node.type === 'link' && !links) {
    slate.Transforms.insertText(editor, ` (${node.href})`, {
      at: slate.Editor.end(editor, path)
    });
    slate.Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  if (node.type === 'relationship' && (!relationshipsEnabled || relationships[node.relationship] === undefined)) {
    const data = node.data;
    if (data) {
      const relationship = relationships[node.relationship];
      slate.Transforms.insertText(editor, `${data.label || data.id || ''} (${(relationship === null || relationship === void 0 ? void 0 : relationship.label) || node.relationship}:${data.id || ''})`, {
        at: slate.Editor.before(editor, path)
      });
    }
    slate.Transforms.removeNodes(editor, {
      at: path
    });
    return true;
  }
  return false;
}
function normalizeElementBasedOnDocumentFeatures([node, path], editor, {
  formatting,
  dividers,
  layouts,
  links,
  relationships: relationshipsEnabled
}, relationships) {
  if (node.type === 'heading' && (!formatting.headingLevels.length || !formatting.headingLevels.includes(node.level)) || node.type === 'ordered-list' && !formatting.listTypes.ordered || node.type === 'unordered-list' && !formatting.listTypes.unordered || node.type === 'code' && !formatting.blockTypes.code || node.type === 'blockquote' && !formatting.blockTypes.blockquote || node.type === 'layout' && (layouts.length === 0 || !layouts.some(layout => areArraysEqual(layout, node.layout)))) {
    slate.Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  if ((node.type === 'paragraph' || node.type === 'heading') && (!formatting.alignment.center && node.textAlign === 'center' || !formatting.alignment.end && node.textAlign === 'end' || 'textAlign' in node && node.textAlign !== 'center' && node.textAlign !== 'end')) {
    slate.Transforms.unsetNodes(editor, 'textAlign', {
      at: path
    });
    return true;
  }
  if (node.type === 'divider' && !dividers) {
    slate.Transforms.removeNodes(editor, {
      at: path
    });
    return true;
  }
  return normalizeInlineBasedOnLinksAndRelationships([node, path], editor, links, relationshipsEnabled, relationships);
}
function withDocumentFeaturesNormalization(documentFeatures, relationships, editor) {
  const {
    normalizeNode
  } = editor;
  const documentFeaturesForNormalization = {
    ...documentFeatures,
    relationships: true
  };
  editor.normalizeNode = ([node, path]) => {
    if (slate.Text.isText(node)) {
      normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, documentFeatures.formatting.inlineMarks, documentFeatures.formatting.softBreaks);
    } else if (slate.Element.isElement(node)) {
      normalizeElementBasedOnDocumentFeatures([node, path], editor, documentFeaturesForNormalization, relationships);
    }
    normalizeNode([node, path]);
  };
  return editor;
}

const paragraphElement = () => ({
  type: 'paragraph',
  children: [{
    text: ''
  }]
});
function withParagraphs(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (slate.Editor.isEditor(node)) {
      const lastNode = node.children[node.children.length - 1];
      if ((lastNode === null || lastNode === void 0 ? void 0 : lastNode.type) !== 'paragraph') {
        slate.Transforms.insertNodes(editor, paragraphElement(), {
          at: [...path, node.children.length]
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// component blocks are not in the ToolbarState because they're inserted in the closest available place and the selected state is not shown in the toolbar

// note that isDisabled being false here does not mean the action should be allowed
// it means that the action should be allowed if isDisabled is false AND the relevant document feature is enabled
// (because things are hidden if they're not enabled in the editor document features)

function getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks) {
  const ancestorComponentProp = slate.Editor.above(editor, {
    match: utils.nodeTypeMatcher('component-block-prop', 'component-inline-prop')
  });
  if (ancestorComponentProp) {
    const propPath = ancestorComponentProp[0].propPath;
    const ancestorComponent = slate.Editor.parent(editor, ancestorComponentProp[1]);
    if (ancestorComponent[0].type === 'component-block') {
      const component = ancestorComponent[0].component;
      const componentBlock = componentBlocks[component];
      if (componentBlock && propPath) {
        const childField = utils.getSchemaAtPropPath(propPath, ancestorComponent[0].props, componentBlock.schema);
        if ((childField === null || childField === void 0 ? void 0 : childField.kind) === 'child') {
          return utils.getDocumentFeaturesForChildField(editorDocumentFeatures, childField.options);
        }
      }
    }
  }
}
const createToolbarState = (editor, componentBlocks, editorDocumentFeatures) => {
  const locationDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks) || {
    kind: 'block',
    inlineMarks: 'inherit',
    documentFeatures: {
      dividers: true,
      formatting: {
        alignment: {
          center: true,
          end: true
        },
        blockTypes: {
          blockquote: true,
          code: true
        },
        headingLevels: [1, 2, 3, 4, 5, 6],
        listTypes: {
          ordered: true,
          unordered: true
        }
      },
      layouts: editorDocumentFeatures.layouts,
      links: true,
      relationships: true
    },
    softBreaks: true
  };
  const [maybeCodeBlockEntry] = slate.Editor.nodes(editor, {
    match: node => node.type !== 'code' && slate.Element.isElement(node) && slate.Editor.isBlock(editor, node)
  });
  const editorMarks = slate.Editor.marks(editor) || {};
  const marks = Object.fromEntries(utils.allMarks.map(mark => [mark, {
    isDisabled: locationDocumentFeatures.inlineMarks !== 'inherit' && !locationDocumentFeatures.inlineMarks[mark] || !maybeCodeBlockEntry,
    isSelected: !!editorMarks[mark]
  }]));

  // Editor.marks is "what are the marks that would be applied if text was inserted now"
  // that's not really the UX we want, if we have some a document like this
  // <paragraph>
  //   <text>
  //     <anchor />
  //     content
  //   </text>
  //   <text bold>bold</text>
  //   <text>
  //     content
  //     <focus />
  //   </text>
  // </paragraph>

  // we want bold to be shown as selected even though if you inserted text from that selection, it wouldn't be bold
  // so we look at all the text nodes in the selection to get their marks
  // but only if the selection is expanded because if you're in the middle of some text
  // with your selection collapsed with a mark but you've removed it(i.e. editor.removeMark)
  // the text nodes you're in will have the mark but the ui should show the mark as not being selected
  if (editor.selection && slate.Range.isExpanded(editor.selection)) {
    for (const node of slate.Editor.nodes(editor, {
      match: slate.Text.isText
    })) {
      for (const key of Object.keys(node[0])) {
        if (key === 'insertMenu' || key === 'text') {
          continue;
        }
        if (key in marks) {
          marks[key].isSelected = true;
        }
      }
    }
  }
  const [headingEntry] = slate.Editor.nodes(editor, {
    match: utils.nodeTypeMatcher('heading')
  });
  const [listEntry] = slate.Editor.nodes(editor, {
    match: isListNode
  });
  const [alignableEntry] = slate.Editor.nodes(editor, {
    match: utils.nodeTypeMatcher('paragraph', 'heading')
  });

  // (we're gonna use markdown here because the equivelant slate structure is quite large and doesn't add value here)
  // let's imagine a document that looks like this:
  // - thing
  //   1. something<cursor />
  // in the toolbar, you don't want to see that both ordered and unordered lists are selected
  // you want to see only ordered list selected, because
  // - you want to know what list you're actually in, you don't really care about the outer list
  // - when you want to change the list to a unordered list, the unordered list button should be inactive to show you can change to it
  const listTypeAbove = getListTypeAbove(editor);
  return {
    marks,
    textStyles: {
      selected: headingEntry ? headingEntry[0].level : 'normal',
      allowedHeadingLevels: locationDocumentFeatures.kind === 'block' && !listEntry ? locationDocumentFeatures.documentFeatures.formatting.headingLevels : []
    },
    relationships: {
      isDisabled: !locationDocumentFeatures.documentFeatures.relationships
    },
    code: {
      isSelected: utils.isElementActive(editor, 'code'),
      isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.blockTypes.code)
    },
    lists: {
      ordered: {
        isSelected: utils.isElementActive(editor, 'ordered-list') && (listTypeAbove === 'none' || listTypeAbove === 'ordered-list'),
        isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.listTypes.ordered && !headingEntry)
      },
      unordered: {
        isSelected: utils.isElementActive(editor, 'unordered-list') && (listTypeAbove === 'none' || listTypeAbove === 'unordered-list'),
        isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.listTypes.unordered && !headingEntry)
      }
    },
    alignment: {
      isDisabled: !alignableEntry && !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.alignment),
      selected: (alignableEntry === null || alignableEntry === void 0 ? void 0 : alignableEntry[0].textAlign) || 'start'
    },
    blockquote: {
      isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.blockTypes.blockquote),
      isSelected: utils.isElementActive(editor, 'blockquote')
    },
    layouts: {
      isSelected: utils.isElementActive(editor, 'layout')
    },
    links: {
      isDisabled: !editor.selection || slate.Range.isCollapsed(editor.selection) || !locationDocumentFeatures.documentFeatures.links,
      isSelected: utils.isElementActive(editor, 'link')
    },
    editor,
    dividers: {
      isDisabled: locationDocumentFeatures.kind === 'inline' || !locationDocumentFeatures.documentFeatures.dividers
    },
    clearFormatting: {
      isDisabled: !(Object.values(marks).some(x => x.isSelected) || !!hasBlockThatClearsOnClearFormatting(editor))
    },
    editorDocumentFeatures
  };
};
function hasBlockThatClearsOnClearFormatting(editor) {
  const [node] = slate.Editor.nodes(editor, {
    match: node => node.type === 'heading' || node.type === 'code' || node.type === 'blockquote'
  });
  return !!node;
}
function getListTypeAbove(editor) {
  const listAbove = slate.Editor.above(editor, {
    match: isListNode
  });
  if (!listAbove) {
    return 'none';
  }
  return listAbove[0].type;
}

const isListType = type => type === 'ordered-list' || type === 'unordered-list';
const isListNode = node => isListType(node.type);
const toggleList = (editor, format) => {
  const listAbove = getListTypeAbove(editor);
  const isActive = utils.isElementActive(editor, format) && (listAbove === 'none' || listAbove === format);
  slate.Editor.withoutNormalizing(editor, () => {
    slate.Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true,
      mode: isActive ? 'all' : 'lowest'
    });
    if (!isActive) {
      slate.Transforms.wrapNodes(editor, {
        type: format,
        children: []
      }, {
        match: x => x.type !== 'list-item-content' && slate.Element.isElement(x) && slate.Editor.isBlock(editor, x)
      });
    }
  });
};
function getAncestorList(editor) {
  if (editor.selection) {
    const listItem = slate.Editor.above(editor, {
      match: utils.nodeTypeMatcher('list-item')
    });
    const list = slate.Editor.above(editor, {
      match: isListNode
    });
    if (listItem && list) {
      return {
        isInside: true,
        listItem,
        list
      };
    }
  }
  return {
    isInside: false
  };
}
function withList(editor) {
  const {
    insertBreak,
    normalizeNode,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const ancestorList = getAncestorList(editor);
      if (ancestorList.isInside && slate.Range.isCollapsed(editor.selection) && slate.Editor.isStart(editor, editor.selection.anchor, ancestorList.list[1])) {
        slate.Transforms.unwrapNodes(editor, {
          match: isListNode,
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const [listItem] = slate.Editor.nodes(editor, {
      match: node => node.type === 'list-item',
      mode: 'lowest'
    });
    if (listItem && slate.Node.string(listItem[0]) === '') {
      slate.Transforms.unwrapNodes(editor, {
        match: isListNode,
        split: true
      });
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (slate.Element.isElement(node) || slate.Editor.isEditor(node)) {
      const isElementBeingNormalizedAList = isListNode(node);
      for (const [childNode, childPath] of slate.Node.children(editor, path)) {
        const index = childPath[childPath.length - 1];
        // merge sibling lists
        if (isListNode(childNode)) {
          var _node$children;
          if (((_node$children = node.children[childPath[childPath.length - 1] + 1]) === null || _node$children === void 0 ? void 0 : _node$children.type) === childNode.type) {
            const siblingNodePath = slate.Path.next(childPath);
            utils.moveChildren(editor, siblingNodePath, [...childPath, childNode.children.length]);
            slate.Transforms.removeNodes(editor, {
              at: siblingNodePath
            });
            return;
          }
          if (isElementBeingNormalizedAList) {
            const previousChild = node.children[index - 1];
            if (slate.Element.isElement(previousChild)) {
              slate.Transforms.moveNodes(editor, {
                at: childPath,
                to: [...slate.Path.previous(childPath), previousChild.children.length - 1]
              });
            } else {
              slate.Transforms.unwrapNodes(editor, {
                at: childPath
              });
            }
            return;
          }
        }
        if (node.type === 'list-item' && childNode.type !== 'list-item-content' && index === 0 && slate.Element.isElement(childNode) && slate.Editor.isBlock(editor, childNode)) {
          if (path[path.length - 1] !== 0) {
            const previousChild = slate.Node.get(editor, slate.Path.previous(path));
            if (slate.Element.isElement(previousChild)) {
              slate.Transforms.moveNodes(editor, {
                at: path,
                to: [...slate.Path.previous(path), previousChild.children.length]
              });
              return;
            }
          }
          slate.Transforms.unwrapNodes(editor, {
            at: childPath
          });
          return;
        }
        if (node.type === 'list-item' && childNode.type === 'list-item-content' && index !== 0) {
          slate.Transforms.splitNodes(editor, {
            at: childPath
          });
          return;
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}
function nestList(editor) {
  const block = slate.Editor.above(editor, {
    match: n => slate.Element.isElement(n) && slate.Editor.isBlock(editor, n)
  });
  if (!block || block[0].type !== 'list-item-content') {
    return false;
  }
  const listItemPath = slate.Path.parent(block[1]);
  // we're the first item in the list therefore we can't nest
  if (listItemPath[listItemPath.length - 1] === 0) {
    return false;
  }
  const previousListItemPath = slate.Path.previous(listItemPath);
  const previousListItemNode = slate.Node.get(editor, previousListItemPath);
  if (previousListItemNode.children.length !== 1) {
    // there's a list nested inside our previous sibling list item so move there
    slate.Transforms.moveNodes(editor, {
      at: listItemPath,
      to: [...previousListItemPath, previousListItemNode.children.length - 1, previousListItemNode.children[previousListItemNode.children.length - 1].children.length]
    });
    return true;
  }
  const type = slate.Editor.parent(editor, slate.Path.parent(block[1]))[0].type;
  slate.Editor.withoutNormalizing(editor, () => {
    slate.Transforms.wrapNodes(editor, {
      type,
      children: []
    }, {
      at: listItemPath
    });
    slate.Transforms.moveNodes(editor, {
      to: [...previousListItemPath, previousListItemNode.children.length],
      at: listItemPath
    });
  });
  return true;
}
function unnestList(editor) {
  const block = slate.Editor.above(editor, {
    match: n => slate.Element.isElement(n) && slate.Editor.isBlock(editor, n)
  });
  if (block && block[0].type === 'list-item-content') {
    slate.Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true
    });
    return true;
  }
  return false;
}

function insertLayout(editor, layout) {
  utils.insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, [{
    type: 'layout',
    layout,
    children: [{
      type: 'layout-area',
      children: [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }]
    }]
  }]);
  const layoutEntry = slate.Editor.above(editor, {
    match: x => x.type === 'layout'
  });
  if (layoutEntry) {
    slate.Transforms.select(editor, [...layoutEntry[1], 0]);
  }
}

// Plugin
function withLayouts(editor) {
  const {
    normalizeNode,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection && slate.Range.isCollapsed(editor.selection) &&
    // this is just an little optimisation
    // we're only doing things if we're at the start of a layout area
    // and the start of anything will always be offset 0
    // so we'll bailout if we're not at offset 0
    editor.selection.anchor.offset === 0) {
      const [aboveNode, abovePath] = slate.Editor.above(editor, {
        match: node => node.type === 'layout-area'
      }) || [editor, []];
      if (aboveNode.type === 'layout-area' && slate.Point.equals(slate.Editor.start(editor, abovePath), editor.selection.anchor)) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (slate.Element.isElement(node) && node.type === 'layout') {
      if (node.layout === undefined) {
        slate.Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      if (node.children.length < node.layout.length) {
        slate.Transforms.insertNodes(editor, Array.from({
          length: node.layout.length - node.children.length
        }).map(() => ({
          type: 'layout-area',
          children: [paragraphElement()]
        })), {
          at: [...path, node.children.length]
        });
        return;
      }
      if (node.children.length > node.layout.length) {
        Array.from({
          length: node.children.length - node.layout.length
        }).map((_, i) => i).reverse().forEach(i => {
          const layoutAreaToRemovePath = [...path, i + node.layout.length];
          const child = node.children[i + node.layout.length];
          utils.moveChildren(editor, layoutAreaToRemovePath, [...path, node.layout.length - 1, node.children[node.layout.length - 1].children.length], node => node.type !== 'paragraph' || slate.Node.string(child) !== '');
          slate.Transforms.removeNodes(editor, {
            at: layoutAreaToRemovePath
          });
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

exports.areArraysEqual = areArraysEqual;
exports.createToolbarState = createToolbarState;
exports.getAncestorComponentChildFieldDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures;
exports.insertLayout = insertLayout;
exports.nestList = nestList;
exports.normalizeElementBasedOnDocumentFeatures = normalizeElementBasedOnDocumentFeatures;
exports.normalizeInlineBasedOnLinksAndRelationships = normalizeInlineBasedOnLinksAndRelationships;
exports.normalizeTextBasedOnInlineMarksAndSoftBreaks = normalizeTextBasedOnInlineMarksAndSoftBreaks;
exports.toggleList = toggleList;
exports.unnestList = unnestList;
exports.withDocumentFeaturesNormalization = withDocumentFeaturesNormalization;
exports.withLayouts = withLayouts;
exports.withList = withList;
exports.withParagraphs = withParagraphs;

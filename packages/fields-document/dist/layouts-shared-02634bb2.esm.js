import { Text, Element, Transforms, Editor, Node, Range, Path, Point } from 'slate';
import { n as nodeTypeMatcher, l as getSchemaAtPropPath, b as getDocumentFeaturesForChildField, o as allMarks, j as isElementActive, m as moveChildren, k as insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading } from './utils-3f0c9305.esm.js';

function areArraysEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
function normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, inlineMarks, softBreaks) {
  const marksToRemove = Object.keys(node).filter(x => x !== 'text' && x !== 'insertMenu' && inlineMarks[x] !== true);
  if (marksToRemove.length) {
    Transforms.unsetNodes(editor, marksToRemove, {
      at: path
    });
    return true;
  }
  if (!softBreaks) {
    const hasSoftBreaks = node.text.includes('\n');
    if (hasSoftBreaks) {
      const [parentNode] = Editor.parent(editor, path);
      if (parentNode.type !== 'code') {
        for (const position of Editor.positions(editor, {
          at: path
        })) {
          const character = Node.get(editor, position.path).text[position.offset];
          if (character === '\n') {
            Transforms.delete(editor, {
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
    Transforms.insertText(editor, ` (${node.href})`, {
      at: Editor.end(editor, path)
    });
    Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  if (node.type === 'relationship' && (!relationshipsEnabled || relationships[node.relationship] === undefined)) {
    const data = node.data;
    if (data) {
      const relationship = relationships[node.relationship];
      Transforms.insertText(editor, `${data.label || data.id || ''} (${(relationship === null || relationship === void 0 ? void 0 : relationship.label) || node.relationship}:${data.id || ''})`, {
        at: Editor.before(editor, path)
      });
    }
    Transforms.removeNodes(editor, {
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
    Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  if ((node.type === 'paragraph' || node.type === 'heading') && (!formatting.alignment.center && node.textAlign === 'center' || !formatting.alignment.end && node.textAlign === 'end' || 'textAlign' in node && node.textAlign !== 'center' && node.textAlign !== 'end')) {
    Transforms.unsetNodes(editor, 'textAlign', {
      at: path
    });
    return true;
  }
  if (node.type === 'divider' && !dividers) {
    Transforms.removeNodes(editor, {
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
    if (Text.isText(node)) {
      normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, documentFeatures.formatting.inlineMarks, documentFeatures.formatting.softBreaks);
    } else if (Element.isElement(node)) {
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
    if (Editor.isEditor(node)) {
      const lastNode = node.children[node.children.length - 1];
      if ((lastNode === null || lastNode === void 0 ? void 0 : lastNode.type) !== 'paragraph') {
        Transforms.insertNodes(editor, paragraphElement(), {
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
  const ancestorComponentProp = Editor.above(editor, {
    match: nodeTypeMatcher('component-block-prop', 'component-inline-prop')
  });
  if (ancestorComponentProp) {
    const propPath = ancestorComponentProp[0].propPath;
    const ancestorComponent = Editor.parent(editor, ancestorComponentProp[1]);
    if (ancestorComponent[0].type === 'component-block') {
      const component = ancestorComponent[0].component;
      const componentBlock = componentBlocks[component];
      if (componentBlock && propPath) {
        const childField = getSchemaAtPropPath(propPath, ancestorComponent[0].props, componentBlock.schema);
        if ((childField === null || childField === void 0 ? void 0 : childField.kind) === 'child') {
          return getDocumentFeaturesForChildField(editorDocumentFeatures, childField.options);
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
  const [maybeCodeBlockEntry] = Editor.nodes(editor, {
    match: node => node.type !== 'code' && Element.isElement(node) && Editor.isBlock(editor, node)
  });
  const editorMarks = Editor.marks(editor) || {};
  const marks = Object.fromEntries(allMarks.map(mark => [mark, {
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
  if (editor.selection && Range.isExpanded(editor.selection)) {
    for (const node of Editor.nodes(editor, {
      match: Text.isText
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
  const [headingEntry] = Editor.nodes(editor, {
    match: nodeTypeMatcher('heading')
  });
  const [listEntry] = Editor.nodes(editor, {
    match: isListNode
  });
  const [alignableEntry] = Editor.nodes(editor, {
    match: nodeTypeMatcher('paragraph', 'heading')
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
      isSelected: isElementActive(editor, 'code'),
      isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.blockTypes.code)
    },
    lists: {
      ordered: {
        isSelected: isElementActive(editor, 'ordered-list') && (listTypeAbove === 'none' || listTypeAbove === 'ordered-list'),
        isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.listTypes.ordered && !headingEntry)
      },
      unordered: {
        isSelected: isElementActive(editor, 'unordered-list') && (listTypeAbove === 'none' || listTypeAbove === 'unordered-list'),
        isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.listTypes.unordered && !headingEntry)
      }
    },
    alignment: {
      isDisabled: !alignableEntry && !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.alignment),
      selected: (alignableEntry === null || alignableEntry === void 0 ? void 0 : alignableEntry[0].textAlign) || 'start'
    },
    blockquote: {
      isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.blockTypes.blockquote),
      isSelected: isElementActive(editor, 'blockquote')
    },
    layouts: {
      isSelected: isElementActive(editor, 'layout')
    },
    links: {
      isDisabled: !editor.selection || Range.isCollapsed(editor.selection) || !locationDocumentFeatures.documentFeatures.links,
      isSelected: isElementActive(editor, 'link')
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
  const [node] = Editor.nodes(editor, {
    match: node => node.type === 'heading' || node.type === 'code' || node.type === 'blockquote'
  });
  return !!node;
}
function getListTypeAbove(editor) {
  const listAbove = Editor.above(editor, {
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
  const isActive = isElementActive(editor, format) && (listAbove === 'none' || listAbove === format);
  Editor.withoutNormalizing(editor, () => {
    Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true,
      mode: isActive ? 'all' : 'lowest'
    });
    if (!isActive) {
      Transforms.wrapNodes(editor, {
        type: format,
        children: []
      }, {
        match: x => x.type !== 'list-item-content' && Element.isElement(x) && Editor.isBlock(editor, x)
      });
    }
  });
};
function getAncestorList(editor) {
  if (editor.selection) {
    const listItem = Editor.above(editor, {
      match: nodeTypeMatcher('list-item')
    });
    const list = Editor.above(editor, {
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
      if (ancestorList.isInside && Range.isCollapsed(editor.selection) && Editor.isStart(editor, editor.selection.anchor, ancestorList.list[1])) {
        Transforms.unwrapNodes(editor, {
          match: isListNode,
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const [listItem] = Editor.nodes(editor, {
      match: node => node.type === 'list-item',
      mode: 'lowest'
    });
    if (listItem && Node.string(listItem[0]) === '') {
      Transforms.unwrapNodes(editor, {
        match: isListNode,
        split: true
      });
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element.isElement(node) || Editor.isEditor(node)) {
      const isElementBeingNormalizedAList = isListNode(node);
      for (const [childNode, childPath] of Node.children(editor, path)) {
        const index = childPath[childPath.length - 1];
        // merge sibling lists
        if (isListNode(childNode)) {
          var _node$children;
          if (((_node$children = node.children[childPath[childPath.length - 1] + 1]) === null || _node$children === void 0 ? void 0 : _node$children.type) === childNode.type) {
            const siblingNodePath = Path.next(childPath);
            moveChildren(editor, siblingNodePath, [...childPath, childNode.children.length]);
            Transforms.removeNodes(editor, {
              at: siblingNodePath
            });
            return;
          }
          if (isElementBeingNormalizedAList) {
            const previousChild = node.children[index - 1];
            if (Element.isElement(previousChild)) {
              Transforms.moveNodes(editor, {
                at: childPath,
                to: [...Path.previous(childPath), previousChild.children.length - 1]
              });
            } else {
              Transforms.unwrapNodes(editor, {
                at: childPath
              });
            }
            return;
          }
        }
        if (node.type === 'list-item' && childNode.type !== 'list-item-content' && index === 0 && Element.isElement(childNode) && Editor.isBlock(editor, childNode)) {
          if (path[path.length - 1] !== 0) {
            const previousChild = Node.get(editor, Path.previous(path));
            if (Element.isElement(previousChild)) {
              Transforms.moveNodes(editor, {
                at: path,
                to: [...Path.previous(path), previousChild.children.length]
              });
              return;
            }
          }
          Transforms.unwrapNodes(editor, {
            at: childPath
          });
          return;
        }
        if (node.type === 'list-item' && childNode.type === 'list-item-content' && index !== 0) {
          Transforms.splitNodes(editor, {
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
  const block = Editor.above(editor, {
    match: n => Element.isElement(n) && Editor.isBlock(editor, n)
  });
  if (!block || block[0].type !== 'list-item-content') {
    return false;
  }
  const listItemPath = Path.parent(block[1]);
  // we're the first item in the list therefore we can't nest
  if (listItemPath[listItemPath.length - 1] === 0) {
    return false;
  }
  const previousListItemPath = Path.previous(listItemPath);
  const previousListItemNode = Node.get(editor, previousListItemPath);
  if (previousListItemNode.children.length !== 1) {
    // there's a list nested inside our previous sibling list item so move there
    Transforms.moveNodes(editor, {
      at: listItemPath,
      to: [...previousListItemPath, previousListItemNode.children.length - 1, previousListItemNode.children[previousListItemNode.children.length - 1].children.length]
    });
    return true;
  }
  const type = Editor.parent(editor, Path.parent(block[1]))[0].type;
  Editor.withoutNormalizing(editor, () => {
    Transforms.wrapNodes(editor, {
      type,
      children: []
    }, {
      at: listItemPath
    });
    Transforms.moveNodes(editor, {
      to: [...previousListItemPath, previousListItemNode.children.length],
      at: listItemPath
    });
  });
  return true;
}
function unnestList(editor) {
  const block = Editor.above(editor, {
    match: n => Element.isElement(n) && Editor.isBlock(editor, n)
  });
  if (block && block[0].type === 'list-item-content') {
    Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true
    });
    return true;
  }
  return false;
}

function insertLayout(editor, layout) {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, [{
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
  const layoutEntry = Editor.above(editor, {
    match: x => x.type === 'layout'
  });
  if (layoutEntry) {
    Transforms.select(editor, [...layoutEntry[1], 0]);
  }
}

// Plugin
function withLayouts(editor) {
  const {
    normalizeNode,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection && Range.isCollapsed(editor.selection) &&
    // this is just an little optimisation
    // we're only doing things if we're at the start of a layout area
    // and the start of anything will always be offset 0
    // so we'll bailout if we're not at offset 0
    editor.selection.anchor.offset === 0) {
      const [aboveNode, abovePath] = Editor.above(editor, {
        match: node => node.type === 'layout-area'
      }) || [editor, []];
      if (aboveNode.type === 'layout-area' && Point.equals(Editor.start(editor, abovePath), editor.selection.anchor)) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === 'layout') {
      if (node.layout === undefined) {
        Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      if (node.children.length < node.layout.length) {
        Transforms.insertNodes(editor, Array.from({
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
          moveChildren(editor, layoutAreaToRemovePath, [...path, node.layout.length - 1, node.children[node.layout.length - 1].children.length], node => node.type !== 'paragraph' || Node.string(child) !== '');
          Transforms.removeNodes(editor, {
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

export { areArraysEqual as a, normalizeElementBasedOnDocumentFeatures as b, normalizeInlineBasedOnLinksAndRelationships as c, withParagraphs as d, withLayouts as e, withDocumentFeaturesNormalization as f, getAncestorComponentChildFieldDocumentFeatures as g, nestList as h, insertLayout as i, createToolbarState as j, normalizeTextBasedOnInlineMarksAndSoftBreaks as n, toggleList as t, unnestList as u, withList as w };

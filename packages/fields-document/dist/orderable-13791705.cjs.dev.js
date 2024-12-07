'use strict';

var _extends = require('@babel/runtime/helpers/extends');
var core = require('@keystone-ui/core');
var React = require('react');
var core$1 = require('@dnd-kit/core');
var sortable = require('@dnd-kit/sortable');
var modifiers = require('@dnd-kit/modifiers');
var button = require('@keystone-ui/button');
var Trash2Icon = require('@keystone-ui/icons/icons/Trash2Icon');

const RemoveContext = /*#__PURE__*/React.createContext(null);
function OrderableList(props) {
  const sensors = core$1.useSensors(core$1.useSensor(core$1.MouseSensor, {
    activationConstraint: {
      distance: 3
    }
  }), core$1.useSensor(core$1.TouchSensor), core$1.useSensor(core$1.KeyboardSensor, {
    coordinateGetter: sortable.sortableKeyboardCoordinates
  }));
  const elementsRef = React.useRef(props.elements);
  React.useEffect(() => {
    elementsRef.current = props.elements;
  });
  const {
    onChange
  } = props;
  const onRemove = React.useCallback(index => {
    onChange(elementsRef.current.filter((_, i) => i !== index).map(x => ({
      key: x.key
    })));
  }, [onChange]);
  return core.jsx(RemoveContext.Provider, {
    value: onRemove
  }, core.jsx(core$1.DndContext, {
    sensors: sensors,
    collisionDetection: core$1.closestCenter,
    modifiers: [modifiers.restrictToVerticalAxis],
    onDragEnd: ({
      over,
      active
    }) => {
      if (over && over.id !== active.id) {
        const activeIndex = props.elements.findIndex(x => x.key === active.id);
        const overIndex = props.elements.findIndex(x => x.key === over.id);
        const newValue = sortable.arrayMove(props.elements.map(x => ({
          key: x.key
        })), activeIndex, overIndex);
        props.onChange(newValue);
      }
    }
  }, core.jsx(sortable.SortableContext, {
    items: React.useMemo(() => props.elements.map(x => x.key), [props.elements]),
    strategy: sortable.verticalListSortingStrategy
  }, core.jsx("ul", {
    css: {
      isolation: 'isolate',
      display: 'flex',
      gap: 8,
      flexDirection: 'column',
      padding: 0,
      margin: 0
    }
  }, props.children))));
}
const DragHandleListenersContext = /*#__PURE__*/React.createContext(null);
function OrderableItem(props) {
  var _transform$x, _transform$y;
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
    index
  } = sortable.useSortable({
    id: props.elementKey
  });
  const style = {
    transition,
    zIndex: isDragging ? 2 : 1,
    '--translate-x': `${Math.round((_transform$x = transform === null || transform === void 0 ? void 0 : transform.x) !== null && _transform$x !== void 0 ? _transform$x : 0)}px`,
    '--translate-y': `${Math.round((_transform$y = transform === null || transform === void 0 ? void 0 : transform.y) !== null && _transform$y !== void 0 ? _transform$y : 0)}px`,
    cursor: isDragging ? 'grabbing' : undefined
  };
  return core.jsx(DragHandleListenersContext.Provider, {
    value: React.useMemo(() => {
      return {
        attributes,
        listeners,
        isDragging,
        index
      };
    }, [attributes, listeners, isDragging, index])
  }, core.jsx("li", {
    ref: setNodeRef,
    css: {
      transform: `translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0))`,
      listStyle: 'none'
    },
    style: style
  }, core.jsx("div", {
    style: {
      pointerEvents: isDragging ? 'none' : undefined,
      transform: `scale(${isDragging ? '1.02' : '1'})`,
      border: '1px solid #DFDFE7'
    },
    css: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: '8px',
      transition: 'transform 100ms ease, box-shadow 150ms ease'
    }
  }, props.children)));
}
function RemoveButton() {
  const sortable = React.useContext(DragHandleListenersContext);
  const onRemove = React.useContext(RemoveContext);
  if (sortable === null || onRemove === null) {
    throw new Error('Must use OrderableItem above RemoveButton');
  }
  return core.jsx(button.Button, {
    weight: "none",
    css: {
      padding: 7
    },
    onClick: () => onRemove(sortable.index),
    "aria-label": "Remove"
  }, core.jsx(Trash2Icon.Trash2Icon, {
    size: "small"
  }));
}
function DragHandle() {
  const sortable = React.useContext(DragHandleListenersContext);
  if (sortable === null) {
    throw new Error('Must use OrderableItem above DragHandle');
  }
  return core.jsx(button.Button, _extends({}, sortable.attributes, sortable.listeners, {
    css: {
      cursor: sortable.isDragging ? 'grabbing' : undefined,
      padding: 7
    },
    weight: "none",
    size: "small",
    "aria-label": "Drag handle"
  }), dragIcon);
}
const dragIcon = core.jsx("span", {
  css: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}, core.jsx("svg", {
  width: "20",
  height: "21",
  xmlns: "http://www.w3.org/2000/svg"
}, core.jsx("path", {
  d: "M6 4h3v3H6V4Zm5 0h3v3h-3V4ZM9 9H6v3h3V9Zm2 0h3v3h-3V9Zm-2 5H6v3h3v-3Zm2 0h3v3h-3v-3Z",
  fill: "currentColor"
})));

exports.DragHandle = DragHandle;
exports.OrderableItem = OrderableItem;
exports.OrderableList = OrderableList;
exports.RemoveButton = RemoveButton;

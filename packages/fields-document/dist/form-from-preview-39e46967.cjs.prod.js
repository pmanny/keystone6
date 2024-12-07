'use strict';

var _extends = require('@babel/runtime/helpers/extends');
var context = require('@keystone-6/core/admin-ui/context');
var RelationshipSelect = require('@keystone-6/core/fields/types/relationship/views/RelationshipSelect');
var button = require('@keystone-ui/button');
var core = require('@keystone-ui/core');
var fields = require('@keystone-ui/fields');
var PlusCircleIcon = require('@keystone-ui/icons/icons/PlusCircleIcon');
var modals = require('@keystone-ui/modals');
var React = require('react');
var orderable = require('./orderable-1dded3d4.cjs.prod.js');
var utils = require('./utils-8f1d1f0a.cjs.prod.js');

const previewPropsToValueConverter = {
  child() {
    return null;
  },
  form(props) {
    return props.value;
  },
  array(props) {
    const values = props.elements.map(x => previewPropsToValue(x));
    utils.setKeysForArrayValue(values, props.elements.map(x => x.key));
    return values;
  },
  conditional(props) {
    return {
      discriminant: props.discriminant,
      value: previewPropsToValue(props.value)
    };
  },
  object(props) {
    return Object.fromEntries(Object.entries(props.fields).map(([key, val]) => [key, previewPropsToValue(val)]));
  },
  relationship(props) {
    return props.value;
  }
};
function previewPropsToValue(props) {
  return previewPropsToValueConverter[props.schema.kind](props);
}
const valueToUpdaters = {
  child() {
    return undefined;
  },
  form(value) {
    return value;
  },
  array(value, schema) {
    const keys = utils.getKeysForArrayValue(value);
    return value.map((x, i) => ({
      key: keys[i],
      value: valueToUpdater(x, schema.element)
    }));
  },
  conditional(value, schema) {
    return {
      discriminant: value.discriminant,
      value: valueToUpdater(value.value, schema.values[value.discriminant.toString()])
    };
  },
  object(value, schema) {
    return Object.fromEntries(Object.entries(schema.fields).map(([key, schema]) => [key, valueToUpdater(value[key], schema)]));
  },
  relationship(value) {
    return value;
  }
};
function valueToUpdater(value, schema) {
  return valueToUpdaters[schema.kind](value, schema);
}
function setValueToPreviewProps(value, props) {
  if (isKind(props, 'child')) {
    // child fields can't be updated through preview props, so we don't do anything here
    return;
  }
  if (isKind(props, 'form') || isKind(props, 'relationship') || isKind(props, 'object') || isKind(props, 'array')) {
    props.onChange(valueToUpdater(value, props.schema));
    return;
  }
  if (isKind(props, 'conditional')) {
    const updater = valueToUpdater(value, props.schema);
    props.onChange(updater.discriminant, updater.value);
    return;
  }
  utils.assertNever(props);
}

// this exists because for props.schema.kind === 'form', ts doesn't narrow props, only props.schema
function isKind(props, kind) {
  return props.schema.kind === kind;
}

function ArrayFieldPreview(props) {
  return core.jsx(core.Stack, {
    gap: "medium"
  }, props.schema.label && core.jsx(fields.FieldLabel, null, props.schema.label), core.jsx(orderable.OrderableList, props, props.elements.map(val => {
    var _props$schema$itemLab, _props$schema$itemLab2, _props$schema;
    return core.jsx(OrderableItemInForm, _extends({
      elementKey: val.key,
      label: (_props$schema$itemLab = (_props$schema$itemLab2 = (_props$schema = props.schema).itemLabel) === null || _props$schema$itemLab2 === void 0 ? void 0 : _props$schema$itemLab2.call(_props$schema, val)) !== null && _props$schema$itemLab !== void 0 ? _props$schema$itemLab : 'Item'
    }, val));
  })), core.jsx(button.Button, {
    autoFocus: props.autoFocus,
    onClick: () => {
      props.onChange([...props.elements.map(x => ({
        key: x.key
      })), {
        key: undefined
      }]);
    },
    tone: "active"
  }, core.jsx(core.Stack, {
    gap: "small",
    across: true
  }, core.jsx(PlusCircleIcon.PlusCircleIcon, {
    size: "smallish"
  }), " ", core.jsx("span", null, "Add"))));
}
function RelationshipFieldPreview({
  schema,
  autoFocus,
  onChange,
  value
}) {
  const list = context.useList(schema.listKey);
  const searchFields = Object.keys(list.fields).filter(key => list.fields[key].search);
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, null, schema.label), core.jsx(RelationshipSelect.RelationshipSelect, {
    autoFocus: autoFocus,
    controlShouldRenderValue: true,
    isDisabled: false,
    list: list,
    labelField: list.labelField,
    searchFields: searchFields,
    extraSelection: schema.selection || '',
    portalMenu: true,
    state: schema.many ? {
      kind: 'many',
      value: value.map(x => ({
        id: x.id,
        label: x.label || x.id,
        data: x.data
      })),
      onChange: onChange
    } : {
      kind: 'one',
      value: value ? {
        ...value,
        label: value.label || value.id
      } : null,
      onChange: onChange
    }
  }));
}
function FormFieldPreview({
  schema,
  autoFocus,
  forceValidation,
  onChange,
  value
}) {
  return core.jsx(schema.Input, {
    autoFocus: !!autoFocus,
    value: value,
    onChange: onChange,
    forceValidation: !!forceValidation
  });
}
function ObjectFieldPreview({
  schema,
  autoFocus,
  fields
}) {
  const firstFocusable = autoFocus ? findFocusableObjectFieldKey(schema) : undefined;
  return core.jsx(core.Stack, {
    gap: "xlarge"
  }, Object.entries(fields).map(([key, propVal]) => isNonChildFieldPreviewProps(propVal) && core.jsx(FormValueContentFromPreviewProps, _extends({
    autoFocus: key === firstFocusable,
    key: key
  }, propVal))));
}
function ConditionalFieldPreview({
  schema,
  autoFocus,
  discriminant,
  onChange,
  value
}) {
  const schemaDiscriminant = schema.discriminant;
  return core.jsx(core.Stack, {
    gap: "xlarge"
  }, React.useMemo(() => core.jsx(schemaDiscriminant.Input, {
    autoFocus: !!autoFocus,
    value: discriminant,
    onChange: onChange,
    forceValidation: false
  }), [autoFocus, schemaDiscriminant, discriminant, onChange]), isNonChildFieldPreviewProps(value) && core.jsx(FormValueContentFromPreviewProps, value));
}
function isNonChildFieldPreviewProps(props) {
  return props.schema.kind !== 'child';
}
const fieldRenderers = {
  array: ArrayFieldPreview,
  relationship: RelationshipFieldPreview,
  child: () => null,
  form: FormFieldPreview,
  object: ObjectFieldPreview,
  conditional: ConditionalFieldPreview
};
const FormValueContentFromPreviewProps = /*#__PURE__*/React.memo(function FormValueContentFromPreview(props) {
  const Comp = fieldRenderers[props.schema.kind];
  return core.jsx(Comp, props);
});
const OrderableItemInForm = /*#__PURE__*/React.memo(function OrderableItemInForm(props) {
  const [modalState, setModalState] = React.useState({
    state: 'closed'
  });
  const onModalChange = React.useCallback(cb => {
    setModalState(state => {
      if (state.state === 'open') {
        return {
          state: 'open',
          forceValidation: state.forceValidation,
          value: cb(state.value)
        };
      }
      return state;
    });
  }, [setModalState]);
  return core.jsx(orderable.OrderableItem, {
    elementKey: props.elementKey
  }, core.jsx(core.Stack, {
    gap: "medium"
  }, core.jsx("div", {
    css: {
      display: 'flex',
      gap: 4
    }
  }, core.jsx(core.Stack, {
    across: true,
    gap: "xsmall",
    align: "center",
    css: {
      cursor: 'pointer'
    }
  }, core.jsx(orderable.DragHandle, null)), core.jsx(button.Button, {
    weight: "none",
    onClick: () => {
      setModalState({
        state: 'open',
        value: previewPropsToValue(props),
        forceValidation: false
      });
    },
    css: {
      flexGrow: 1,
      justifyContent: 'start'
    }
  }, core.jsx("span", {
    css: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'start'
    }
  }, props.label)), core.jsx(orderable.RemoveButton, null)), isNonChildFieldPreviewProps(props) && core.jsx(modals.AlertDialog, {
    title: `Edit Item`,
    actions: {
      confirm: {
        action: () => {
          if (modalState.state !== 'open') return;
          if (!utils.clientSideValidateProp(props.schema, modalState.value)) {
            setModalState(state => ({
              ...state,
              forceValidation: true
            }));
            return;
          }
          setValueToPreviewProps(modalState.value, props);
          setModalState({
            state: 'closed'
          });
        },
        label: 'Done'
      },
      cancel: {
        action: () => {
          setModalState({
            state: 'closed'
          });
        },
        label: 'Cancel'
      }
    },
    isOpen: modalState.state === 'open'
  }, modalState.state === 'open' && core.jsx(ArrayFieldItemModalContent, {
    onChange: onModalChange,
    schema: props.schema,
    value: modalState.value
  }))));
});
function ArrayFieldItemModalContent(props) {
  const previewProps = React.useMemo(() => utils.createGetPreviewProps(props.schema, props.onChange, () => undefined), [props.schema, props.onChange])(props.value);
  return core.jsx(FormValueContentFromPreviewProps, previewProps);
}
function findFocusableObjectFieldKey(schema) {
  for (const [key, innerProp] of Object.entries(schema.fields)) {
    const childFocusable = canFieldBeFocused(innerProp);
    if (childFocusable) {
      return key;
    }
  }
  return undefined;
}
function canFieldBeFocused(schema) {
  if (schema.kind === 'array' || schema.kind === 'conditional' || schema.kind === 'form' || schema.kind === 'relationship') {
    return true;
  }
  if (schema.kind === 'child') {
    return false;
  }
  if (schema.kind === 'object') {
    for (const innerProp of Object.values(schema.fields)) {
      if (canFieldBeFocused(innerProp)) {
        return true;
      }
    }
    return false;
  }
  utils.assertNever(schema);
}

exports.FormValueContentFromPreviewProps = FormValueContentFromPreviewProps;

import _extends from '@babel/runtime/helpers/esm/extends';
import { useList } from '@keystone-6/core/admin-ui/context';
import { RelationshipSelect } from '@keystone-6/core/fields/types/relationship/views/RelationshipSelect';
import { Button } from '@keystone-ui/button';
import { jsx, Stack } from '@keystone-ui/core';
import { FieldLabel, FieldContainer } from '@keystone-ui/fields';
import { PlusCircleIcon } from '@keystone-ui/icons/icons/PlusCircleIcon';
import { AlertDialog } from '@keystone-ui/modals';
import { memo, useMemo, useState, useCallback } from 'react';
import { O as OrderableList, a as OrderableItem, D as DragHandle, R as RemoveButton } from './orderable-c4eafa5e.esm.js';
import { a as assertNever, s as setKeysForArrayValue, f as getKeysForArrayValue, v as clientSideValidateProp, w as createGetPreviewProps } from './utils-3f0c9305.esm.js';

const previewPropsToValueConverter = {
  child() {
    return null;
  },
  form(props) {
    return props.value;
  },
  array(props) {
    const values = props.elements.map(x => previewPropsToValue(x));
    setKeysForArrayValue(values, props.elements.map(x => x.key));
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
    const keys = getKeysForArrayValue(value);
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
  assertNever(props);
}

// this exists because for props.schema.kind === 'form', ts doesn't narrow props, only props.schema
function isKind(props, kind) {
  return props.schema.kind === kind;
}

function ArrayFieldPreview(props) {
  return jsx(Stack, {
    gap: "medium"
  }, props.schema.label && jsx(FieldLabel, null, props.schema.label), jsx(OrderableList, props, props.elements.map(val => {
    var _props$schema$itemLab, _props$schema$itemLab2, _props$schema;
    return jsx(OrderableItemInForm, _extends({
      elementKey: val.key,
      label: (_props$schema$itemLab = (_props$schema$itemLab2 = (_props$schema = props.schema).itemLabel) === null || _props$schema$itemLab2 === void 0 ? void 0 : _props$schema$itemLab2.call(_props$schema, val)) !== null && _props$schema$itemLab !== void 0 ? _props$schema$itemLab : 'Item'
    }, val));
  })), jsx(Button, {
    autoFocus: props.autoFocus,
    onClick: () => {
      props.onChange([...props.elements.map(x => ({
        key: x.key
      })), {
        key: undefined
      }]);
    },
    tone: "active"
  }, jsx(Stack, {
    gap: "small",
    across: true
  }, jsx(PlusCircleIcon, {
    size: "smallish"
  }), " ", jsx("span", null, "Add"))));
}
function RelationshipFieldPreview({
  schema,
  autoFocus,
  onChange,
  value
}) {
  const list = useList(schema.listKey);
  const searchFields = Object.keys(list.fields).filter(key => list.fields[key].search);
  return jsx(FieldContainer, null, jsx(FieldLabel, null, schema.label), jsx(RelationshipSelect, {
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
  return jsx(schema.Input, {
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
  return jsx(Stack, {
    gap: "xlarge"
  }, Object.entries(fields).map(([key, propVal]) => isNonChildFieldPreviewProps(propVal) && jsx(FormValueContentFromPreviewProps, _extends({
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
  return jsx(Stack, {
    gap: "xlarge"
  }, useMemo(() => jsx(schemaDiscriminant.Input, {
    autoFocus: !!autoFocus,
    value: discriminant,
    onChange: onChange,
    forceValidation: false
  }), [autoFocus, schemaDiscriminant, discriminant, onChange]), isNonChildFieldPreviewProps(value) && jsx(FormValueContentFromPreviewProps, value));
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
const FormValueContentFromPreviewProps = /*#__PURE__*/memo(function FormValueContentFromPreview(props) {
  const Comp = fieldRenderers[props.schema.kind];
  return jsx(Comp, props);
});
const OrderableItemInForm = /*#__PURE__*/memo(function OrderableItemInForm(props) {
  const [modalState, setModalState] = useState({
    state: 'closed'
  });
  const onModalChange = useCallback(cb => {
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
  return jsx(OrderableItem, {
    elementKey: props.elementKey
  }, jsx(Stack, {
    gap: "medium"
  }, jsx("div", {
    css: {
      display: 'flex',
      gap: 4
    }
  }, jsx(Stack, {
    across: true,
    gap: "xsmall",
    align: "center",
    css: {
      cursor: 'pointer'
    }
  }, jsx(DragHandle, null)), jsx(Button, {
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
  }, jsx("span", {
    css: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'start'
    }
  }, props.label)), jsx(RemoveButton, null)), isNonChildFieldPreviewProps(props) && jsx(AlertDialog, {
    title: `Edit Item`,
    actions: {
      confirm: {
        action: () => {
          if (modalState.state !== 'open') return;
          if (!clientSideValidateProp(props.schema, modalState.value)) {
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
  }, modalState.state === 'open' && jsx(ArrayFieldItemModalContent, {
    onChange: onModalChange,
    schema: props.schema,
    value: modalState.value
  }))));
});
function ArrayFieldItemModalContent(props) {
  const previewProps = useMemo(() => createGetPreviewProps(props.schema, props.onChange, () => undefined), [props.schema, props.onChange])(props.value);
  return jsx(FormValueContentFromPreviewProps, previewProps);
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
  assertNever(schema);
}

export { FormValueContentFromPreviewProps as F };

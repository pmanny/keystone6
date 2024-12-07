import _extends from '@babel/runtime/helpers/esm/extends';
import { jsx } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, FieldDescription, TextInput } from '@keystone-ui/fields';
import { useState } from 'react';
import { C as CellContainer } from '../../../../../dist/CellContainer-53c87738.esm.js';
import { C as CellLink } from '../../../../../dist/CellLink-0c553815.esm.js';
import '@babel/runtime/helpers/defineProperty';
import '@keystone-ui/button';
import '@keystone-ui/icons/icons/AlertTriangleIcon';
import 'next/link';
import '@keystone-ui/toast';
import '@keystone-ui/loading';
import '@keystone-ui/modals';
import 'apollo-upload-client';
import '@emotion/hash';
import '@apollo/client';
import '../../../../../dist/admin-meta-graphql-3524c137.esm.js';
import 'next/router';
import '@keystone-ui/popover';
import '@keystone-ui/icons/icons/MoreHorizontalIcon';
import '@keystone-ui/icons/icons/ChevronRightIcon';
import 'next/head';
import '../../../../../dist/SignoutButton-ca58d8c9.esm.js';
import '@keystone-ui/icons';
import '../../../../../dist/Fields-cb2c206c.esm.js';
import 'fast-deep-equal';
import '@keystone-ui/notice';
import { u as useFormattedInput } from '../../../../../dist/utils-a67969a8.esm.js';
import '../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';

function IntegerInput({
  value,
  onChange,
  id,
  autoFocus,
  forceValidation,
  validationMessage,
  placeholder
}) {
  const [hasBlurred, setHasBlurred] = useState(false);
  const props = useFormattedInput({
    format: value => value === null ? '' : value.toString(),
    parse: raw => {
      raw = raw.trim();
      if (raw === '') {
        return null;
      }
      if (/^[+-]?\d+$/.test(raw)) {
        const parsed = parseInt(raw);
        if (!Number.isSafeInteger(parsed)) {
          return raw;
        }
        return parsed;
      }
      return raw;
    }
  }, {
    value,
    onChange,
    onBlur: () => {
      setHasBlurred(true);
    }
  });
  return jsx("span", null, jsx(TextInput, _extends({
    placeholder: placeholder,
    id: id,
    autoFocus: autoFocus,
    inputMode: "numeric"
  }, props)), (hasBlurred || forceValidation) && validationMessage && jsx("span", {
    css: {
      color: 'red'
    }
  }, validationMessage));
}
const Field = ({
  field,
  value,
  onChange,
  autoFocus,
  forceValidation
}) => {
  const message = validate(value, field.validation, field.label, field.hasAutoIncrementDefault);
  return jsx(FieldContainer, null, jsx(FieldLabel, {
    htmlFor: field.path
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), onChange ? jsx("span", null, jsx(IntegerInput, {
    id: field.path,
    autoFocus: autoFocus,
    onChange: val => {
      onChange({
        ...value,
        value: val
      });
    },
    value: value.value,
    forceValidation: forceValidation,
    placeholder: field.hasAutoIncrementDefault && value.kind === 'create' ? 'Defaults to an incremented number' : undefined,
    validationMessage: message,
    "aria-describedby": field.description === null ? undefined : `${field.path}-description`
  })) : value.value);
};
const Cell = ({
  item,
  field,
  linkTo
}) => {
  const value = item[field.path] + '';
  return linkTo ? jsx(CellLink, linkTo, value) : jsx(CellContainer, null, value);
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  return jsx(FieldContainer, null, jsx(FieldLabel, null, field.label), item[field.path] === null ? '' : item[field.path]);
};
function validate(value, validation, label, hasAutoIncrementDefault) {
  const val = value.value;
  if (typeof val === 'string') {
    return `${label} must be a whole number`;
  }

  // if we recieve null initially on the item view and the current value is null,
  // we should always allow saving it because:
  // - the value might be null in the database and we don't want to prevent saving the whole item because of that
  // - we might have null because of an access control error
  if (value.kind === 'update' && value.initial === null && val === null) {
    return undefined;
  }
  if (value.kind === 'create' && value.value === null && hasAutoIncrementDefault) {
    return undefined;
  }
  if (validation.isRequired && val === null) {
    return `${label} is required`;
  }
  if (typeof val === 'number') {
    if (val < validation.min) {
      return `${label} must be greater than or equal to ${validation.min}`;
    }
    if (val > validation.max) {
      return `${label} must be less than or equal to ${validation.max}`;
    }
  }
  return undefined;
}
const controller = config => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    validation: config.fieldMeta.validation,
    defaultValue: {
      kind: 'create',
      value: config.fieldMeta.defaultValue === 'autoincrement' ? null : config.fieldMeta.defaultValue
    },
    deserialize: data => ({
      kind: 'update',
      value: data[config.path],
      initial: data[config.path]
    }),
    serialize: value => ({
      [config.path]: value.value
    }),
    hasAutoIncrementDefault: config.fieldMeta.defaultValue === 'autoincrement',
    validate: value => validate(value, config.fieldMeta.validation, config.label, config.fieldMeta.defaultValue === 'autoincrement') === undefined,
    filter: {
      Filter({
        autoFocus,
        type,
        onChange,
        value
      }) {
        return jsx(TextInput, {
          type: "text",
          onChange: event => {
            if (type === 'in' || type === 'not_in') {
              onChange(event.target.value.replace(/[^\d,\s-]/g, ''));
              return;
            }
            onChange(event.target.value.replace(/[^\d\s-]/g, ''));
          },
          value: value,
          autoFocus: autoFocus
        });
      },
      graphql: ({
        type,
        value
      }) => {
        const valueWithoutWhitespace = value.replace(/\s/g, '');
        const parsed = type === 'in' || type === 'not_in' ? valueWithoutWhitespace.split(',').map(x => parseInt(x)) : parseInt(valueWithoutWhitespace);
        if (type === 'not') {
          return {
            [config.path]: {
              not: {
                equals: parsed
              }
            }
          };
        }
        const key = type === 'is' ? 'equals' : type === 'not_in' ? 'notIn' : type;
        return {
          [config.path]: {
            [key]: parsed
          }
        };
      },
      Label({
        label,
        value,
        type
      }) {
        let renderedValue = value;
        if (['in', 'not_in'].includes(type)) {
          renderedValue = value.split(',').map(value => value.trim()).join(', ');
        }
        return `${label.toLowerCase()}: ${renderedValue}`;
      },
      types: {
        is: {
          label: 'Is exactly',
          initialValue: ''
        },
        not: {
          label: 'Is not exactly',
          initialValue: ''
        },
        gt: {
          label: 'Is greater than',
          initialValue: ''
        },
        lt: {
          label: 'Is less than',
          initialValue: ''
        },
        gte: {
          label: 'Is greater than or equal to',
          initialValue: ''
        },
        lte: {
          label: 'Is less than or equal to',
          initialValue: ''
        },
        in: {
          label: 'Is one of',
          initialValue: ''
        },
        not_in: {
          label: 'Is not one of',
          initialValue: ''
        }
      }
    }
  };
};

export { CardValue, Cell, Field, controller };

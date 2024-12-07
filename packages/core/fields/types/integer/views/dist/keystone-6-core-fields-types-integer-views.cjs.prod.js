'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var core = require('@keystone-ui/core');
var fields = require('@keystone-ui/fields');
var React = require('react');
var CellContainer = require('../../../../../dist/CellContainer-2b182353.cjs.prod.js');
var CellLink = require('../../../../../dist/CellLink-76b148c8.cjs.prod.js');
require('@babel/runtime/helpers/defineProperty');
require('@keystone-ui/button');
require('@keystone-ui/icons/icons/AlertTriangleIcon');
require('next/link');
require('@keystone-ui/toast');
require('@keystone-ui/loading');
require('@keystone-ui/modals');
require('apollo-upload-client');
require('@emotion/hash');
require('@apollo/client');
require('../../../../../dist/admin-meta-graphql-ea267ea5.cjs.prod.js');
require('next/router');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('next/head');
require('../../../../../dist/SignoutButton-777de56f.cjs.prod.js');
require('@keystone-ui/icons');
require('../../../../../dist/Fields-7213b21d.cjs.prod.js');
require('fast-deep-equal');
require('@keystone-ui/notice');
var utils = require('../../../../../dist/utils-c5b5b8b1.cjs.prod.js');
require('../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.prod.js');

function IntegerInput({
  value,
  onChange,
  id,
  autoFocus,
  forceValidation,
  validationMessage,
  placeholder
}) {
  const [hasBlurred, setHasBlurred] = React.useState(false);
  const props = utils.useFormattedInput({
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
  return core.jsx("span", null, core.jsx(fields.TextInput, _extends({
    placeholder: placeholder,
    id: id,
    autoFocus: autoFocus,
    inputMode: "numeric"
  }, props)), (hasBlurred || forceValidation) && validationMessage && core.jsx("span", {
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
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, {
    htmlFor: field.path
  }, field.label), core.jsx(fields.FieldDescription, {
    id: `${field.path}-description`
  }, field.description), onChange ? core.jsx("span", null, core.jsx(IntegerInput, {
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
  return linkTo ? core.jsx(CellLink.CellLink, linkTo, value) : core.jsx(CellContainer.CellContainer, null, value);
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, null, field.label), item[field.path] === null ? '' : item[field.path]);
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
        return core.jsx(fields.TextInput, {
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

exports.CardValue = CardValue;
exports.Cell = Cell;
exports.Field = Field;
exports.controller = controller;

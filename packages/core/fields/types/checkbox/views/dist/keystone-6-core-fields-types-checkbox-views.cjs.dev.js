'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@keystone-ui/core');
var fields = require('@keystone-ui/fields');
var CellContainer = require('../../../../../dist/CellContainer-031ab86a.cjs.dev.js');
require('@babel/runtime/helpers/extends');
require('next/router');
require('next/link');
require('next/head');
require('@babel/runtime/helpers/defineProperty');
require('react');
require('@keystone-ui/button');
require('@keystone-ui/icons/icons/AlertTriangleIcon');
require('@keystone-ui/toast');
require('@keystone-ui/loading');
require('@keystone-ui/modals');
require('apollo-upload-client');
require('@emotion/hash');
require('@apollo/client');
require('../../../../../dist/admin-meta-graphql-5b647d4a.cjs.dev.js');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('../../../../../dist/SignoutButton-12f572cf.cjs.dev.js');
require('@keystone-ui/icons');
require('../../../../../dist/Fields-91ab38a7.cjs.dev.js');
require('fast-deep-equal');
require('@keystone-ui/notice');

/** @jsxRuntime classic */
function Field({
  field,
  value,
  onChange,
  autoFocus
}) {
  const {
    fields: fields$1,
    typography,
    spacing
  } = core.useTheme();
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.Checkbox, {
    autoFocus: autoFocus,
    disabled: onChange === undefined,
    onChange: event => {
      onChange === null || onChange === void 0 || onChange(event.target.checked);
    },
    checked: value,
    "aria-describedby": field.description === null ? undefined : `${field.path}-description`
  }, core.jsx("span", {
    css: {
      color: fields$1.labelColor,
      display: 'block',
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.xsmall,
      minWidth: 120
    }
  }, field.label), core.jsx(fields.FieldDescription, {
    id: `${field.path}-description`
  }, field.description)));
}
const Cell = ({
  item,
  field
}) => {
  const value = !!item[field.path];
  return core.jsx(CellContainer.CellContainer, null, core.jsx(fields.Checkbox, {
    disabled: true,
    checked: value,
    size: "small"
  }, core.jsx("span", {
    css: {}
  }, value ? 'True' : 'False')));
};
const CardValue = ({
  item,
  field
}) => {
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, null, field.label), item[field.path] + '');
};
const controller = config => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: config.fieldMeta.defaultValue,
    deserialize(item) {
      const value = item[config.path];
      return typeof value === 'boolean' ? value : false;
    },
    serialize(value) {
      return {
        [config.path]: value
      };
    },
    filter: {
      Filter() {
        return null;
      },
      graphql({
        type
      }) {
        return {
          [config.path]: {
            equals: type === 'is'
          }
        };
      },
      Label({
        label
      }) {
        return label.toLowerCase();
      },
      types: {
        is: {
          label: 'is',
          initialValue: true
        },
        not: {
          label: 'is not',
          initialValue: true
        }
      }
    }
  };
};

exports.CardValue = CardValue;
exports.Cell = Cell;
exports.Field = Field;
exports.controller = controller;

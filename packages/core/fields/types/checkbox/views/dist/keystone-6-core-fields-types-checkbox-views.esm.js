import { useTheme, jsx } from '@keystone-ui/core';
import { FieldContainer, Checkbox, FieldDescription, FieldLabel } from '@keystone-ui/fields';
import { C as CellContainer } from '../../../../../dist/CellContainer-53c87738.esm.js';
import '@babel/runtime/helpers/extends';
import 'next/router';
import 'next/link';
import 'next/head';
import '@babel/runtime/helpers/defineProperty';
import 'react';
import '@keystone-ui/button';
import '@keystone-ui/icons/icons/AlertTriangleIcon';
import '@keystone-ui/toast';
import '@keystone-ui/loading';
import '@keystone-ui/modals';
import 'apollo-upload-client';
import '@emotion/hash';
import '@apollo/client';
import '../../../../../dist/admin-meta-graphql-3524c137.esm.js';
import '@keystone-ui/popover';
import '@keystone-ui/icons/icons/MoreHorizontalIcon';
import '@keystone-ui/icons/icons/ChevronRightIcon';
import '../../../../../dist/SignoutButton-ca58d8c9.esm.js';
import '@keystone-ui/icons';
import '../../../../../dist/Fields-cb2c206c.esm.js';
import 'fast-deep-equal';
import '@keystone-ui/notice';

/** @jsxRuntime classic */
function Field({
  field,
  value,
  onChange,
  autoFocus
}) {
  const {
    fields,
    typography,
    spacing
  } = useTheme();
  return jsx(FieldContainer, null, jsx(Checkbox, {
    autoFocus: autoFocus,
    disabled: onChange === undefined,
    onChange: event => {
      onChange === null || onChange === void 0 || onChange(event.target.checked);
    },
    checked: value,
    "aria-describedby": field.description === null ? undefined : `${field.path}-description`
  }, jsx("span", {
    css: {
      color: fields.labelColor,
      display: 'block',
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.xsmall,
      minWidth: 120
    }
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description)));
}
const Cell = ({
  item,
  field
}) => {
  const value = !!item[field.path];
  return jsx(CellContainer, null, jsx(Checkbox, {
    disabled: true,
    checked: value,
    size: "small"
  }, jsx("span", {
    css: {}
  }, value ? 'True' : 'False')));
};
const CardValue = ({
  item,
  field
}) => {
  return jsx(FieldContainer, null, jsx(FieldLabel, null, field.label), item[field.path] + '');
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

export { CardValue, Cell, Field, controller };

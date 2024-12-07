import { jsx, Stack, Text } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, FieldDescription, TextArea } from '@keystone-ui/fields';
import { C as CellContainer } from '../../../../../dist/CellContainer-53c87738.esm.js';
import { C as CellLink } from '../../../../../dist/CellLink-0c553815.esm.js';
import '@babel/runtime/helpers/defineProperty';
import 'react';
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
import '@babel/runtime/helpers/extends';
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
import '../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';

/** @jsxRuntime classic */
const Field = ({
  field,
  forceValidation,
  value,
  onChange,
  autoFocus
}) => {
  return jsx(FieldContainer, null, jsx(FieldLabel, {
    htmlFor: field.path
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), jsx(Stack, null, jsx(TextArea, {
    id: field.path,
    "aria-describedby": field.description === null ? undefined : `${field.path}-description`,
    readOnly: onChange === undefined,
    css: {
      fontFamily: 'monospace',
      ...(!onChange && {
        backgroundColor: '#eff3f6',
        border: '1px solid transparent',
        '&:focus-visible': {
          outline: 0,
          backgroundColor: '#eff3f6',
          boxShadow: '0 0 0 2px #e1e5e9',
          border: '1px solid #b1b5b9'
        }
      })
    },
    autoFocus: autoFocus,
    onChange: event => onChange === null || onChange === void 0 ? void 0 : onChange(event.target.value),
    value: value
  }), forceValidation && jsx(Text, {
    color: "red600",
    size: "small"
  }, 'Invalid JSON')));
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
  return jsx(FieldContainer, null, jsx(FieldLabel, null, field.label), item[field.path]);
};
const controller = config => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: config.fieldMeta.defaultValue === null ? '' : JSON.stringify(config.fieldMeta.defaultValue, null, 2),
    validate: value => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    },
    deserialize: data => {
      const value = data[config.path];
      // null is equivalent to Prisma.DbNull, and we show that as an empty input
      if (value === null) return '';
      return JSON.stringify(value, null, 2);
    },
    serialize: value => {
      if (!value) return {
        [config.path]: null
      };
      try {
        return {
          [config.path]: JSON.parse(value)
        };
      } catch (e) {
        return {
          [config.path]: undefined
        };
      }
    }
  };
};

export { CardValue, Cell, Field, controller };

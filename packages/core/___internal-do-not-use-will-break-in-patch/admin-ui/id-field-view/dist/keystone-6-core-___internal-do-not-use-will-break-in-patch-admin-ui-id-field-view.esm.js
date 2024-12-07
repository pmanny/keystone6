import { jsx } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { C as CellContainer } from '../../../../dist/CellContainer-53c87738.esm.js';
import { C as CellLink } from '../../../../dist/CellLink-0c553815.esm.js';
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
import '../../../../dist/admin-meta-graphql-3524c137.esm.js';
import '@babel/runtime/helpers/extends';
import 'next/router';
import '@keystone-ui/popover';
import '@keystone-ui/icons/icons/MoreHorizontalIcon';
import '@keystone-ui/icons/icons/ChevronRightIcon';
import 'next/head';
import '../../../../dist/SignoutButton-ca58d8c9.esm.js';
import '@keystone-ui/icons';
import '../../../../dist/Fields-cb2c206c.esm.js';
import 'fast-deep-equal';
import '@keystone-ui/notice';
import '../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';

/** @jsxRuntime classic */
function Field() {
  return null;
}
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
function controller(config) {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: undefined,
    deserialize: () => {},
    serialize: () => ({}),
    filter: {
      Filter(props) {
        return jsx(TextInput, {
          onChange: event => {
            props.onChange(event.target.value);
          },
          value: props.value,
          autoFocus: props.autoFocus
        });
      },
      graphql: ({
        type,
        value
      }) => {
        if (type === 'not') {
          return {
            [config.path]: {
              not: {
                equals: value
              }
            }
          };
        }
        const valueWithoutWhitespace = value.replace(/\s/g, '');
        const key = type === 'is' ? 'equals' : type === 'not_in' ? 'notIn' : type;
        return {
          [config.path]: {
            [key]: ['in', 'not_in'].includes(type) ? valueWithoutWhitespace.split(',') : valueWithoutWhitespace
          }
        };
      },
      Label({
        label,
        value,
        type
      }) {
        let renderedValue = value.replace(/\s/g, '');
        if (['in', 'not_in'].includes(type)) {
          renderedValue = value.split(',').join(', ');
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
}

export { CardValue, Cell, Field, controller };

import { Fragment } from 'react';
import { jsx } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, FieldDescription, MultiSelect } from '@keystone-ui/fields';
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
  value,
  onChange,
  autoFocus
}) => {
  return jsx(FieldContainer, null, jsx(Fragment, null, jsx(FieldLabel, {
    htmlFor: field.path
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), jsx(MultiSelect, {
    id: field.path,
    isClearable: true,
    autoFocus: autoFocus,
    options: field.options,
    isDisabled: onChange === undefined,
    onChange: newVal => {
      onChange === null || onChange === void 0 || onChange(newVal);
    },
    value: value,
    "aria-describedby": field.description === null ? undefined : `${field.path}-description`,
    portalMenu: true
  })));
};
const Cell = ({
  item,
  field,
  linkTo
}) => {
  var _item$field$path;
  const value = (_item$field$path = item[field.path]) !== null && _item$field$path !== void 0 ? _item$field$path : [];
  const label = value.map(value => field.valuesToOptionsWithStringValues[value].label).join(', ');
  return linkTo ? jsx(CellLink, linkTo, label) : jsx(CellContainer, null, label);
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  var _item$field$path2;
  const value = (_item$field$path2 = item[field.path]) !== null && _item$field$path2 !== void 0 ? _item$field$path2 : [];
  const label = value.map(value => field.valuesToOptionsWithStringValues[value].label).join(', ');
  return jsx(FieldContainer, null, jsx(FieldLabel, null, field.label), label);
};
const controller = config => {
  const optionsWithStringValues = config.fieldMeta.options.map(x => ({
    label: x.label,
    value: x.value.toString()
  }));
  const valuesToOptionsWithStringValues = Object.fromEntries(optionsWithStringValues.map(option => [option.value, option]));
  const parseValue = value => config.fieldMeta.type === 'integer' ? parseInt(value) : value;
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: config.fieldMeta.defaultValue.map(x => valuesToOptionsWithStringValues[x]),
    type: config.fieldMeta.type,
    options: optionsWithStringValues,
    valuesToOptionsWithStringValues,
    deserialize: data => {
      var _data$config$path;
      // if we get null from the GraphQL API (which will only happen if field read access control failed)
      // we'll just show it as nothing being selected for now.
      const values = (_data$config$path = data[config.path]) !== null && _data$config$path !== void 0 ? _data$config$path : [];
      const selectedOptions = values.map(x => valuesToOptionsWithStringValues[x]);
      return selectedOptions;
    },
    serialize: value => ({
      [config.path]: value.map(x => parseValue(x.value))
    })
  };
};

export { CardValue, Cell, Field, controller };

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var core = require('@keystone-ui/core');
var fields = require('@keystone-ui/fields');
var CellContainer = require('../../../../../dist/CellContainer-031ab86a.cjs.dev.js');
var CellLink = require('../../../../../dist/CellLink-14bf5ba1.cjs.dev.js');
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
require('../../../../../dist/admin-meta-graphql-5b647d4a.cjs.dev.js');
require('@babel/runtime/helpers/extends');
require('next/router');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('next/head');
require('../../../../../dist/SignoutButton-12f572cf.cjs.dev.js');
require('@keystone-ui/icons');
require('../../../../../dist/Fields-91ab38a7.cjs.dev.js');
require('fast-deep-equal');
require('@keystone-ui/notice');
require('../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.dev.js');

/** @jsxRuntime classic */
const Field = ({
  field,
  value,
  onChange,
  autoFocus
}) => {
  return core.jsx(fields.FieldContainer, null, core.jsx(React.Fragment, null, core.jsx(fields.FieldLabel, {
    htmlFor: field.path
  }, field.label), core.jsx(fields.FieldDescription, {
    id: `${field.path}-description`
  }, field.description), core.jsx(fields.MultiSelect, {
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
  return linkTo ? core.jsx(CellLink.CellLink, linkTo, label) : core.jsx(CellContainer.CellContainer, null, label);
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  var _item$field$path2;
  const value = (_item$field$path2 = item[field.path]) !== null && _item$field$path2 !== void 0 ? _item$field$path2 : [];
  const label = value.map(value => field.valuesToOptionsWithStringValues[value].label).join(', ');
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, null, field.label), label);
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

exports.CardValue = CardValue;
exports.Cell = Cell;
exports.Field = Field;
exports.controller = controller;

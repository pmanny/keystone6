import { useState, Fragment } from 'react';
import { jsx, Text, Stack } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, FieldDescription, Select, Radio, MultiSelect } from '@keystone-ui/fields';
import { SegmentedControl } from '@keystone-ui/segmented-control';
import { Button } from '@keystone-ui/button';
import { C as CellContainer } from '../../../../../dist/CellContainer-53c87738.esm.js';
import { C as CellLink } from '../../../../../dist/CellLink-0c553815.esm.js';
import '@babel/runtime/helpers/defineProperty';
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
  autoFocus,
  forceValidation
}) => {
  const [hasChanged, setHasChanged] = useState(false);
  const validationMessage = (hasChanged || forceValidation) && !validate(value, field.isRequired) ? jsx(Text, {
    color: "red600",
    size: "small"
  }, field.label, " is required") : null;
  return jsx(FieldContainer, {
    as: field.displayMode === 'select' ? 'div' : 'fieldset'
  }, field.displayMode === 'select' ? jsx(Fragment, null, jsx(FieldLabel, {
    htmlFor: field.path
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), jsx(Select, {
    id: field.path,
    isClearable: true,
    autoFocus: autoFocus,
    options: field.options,
    isDisabled: onChange === undefined,
    onChange: newVal => {
      onChange === null || onChange === void 0 || onChange({
        ...value,
        value: newVal
      });
      setHasChanged(true);
    },
    value: value.value,
    "aria-describedby": field.description === null ? undefined : `${field.path}-description`,
    portalMenu: true
  }), validationMessage) : field.displayMode === 'radio' ? jsx(Fragment, null, jsx(FieldLabel, {
    as: "legend"
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), jsx(Stack, {
    gap: "small",
    marginTop: 'small'
  }, field.options.map(option => {
    var _value$value;
    return jsx(Radio, {
      css: {
        alignItems: 'center'
      },
      key: option.value,
      value: option.value,
      checked: ((_value$value = value.value) === null || _value$value === void 0 ? void 0 : _value$value.value) === option.value,
      onChange: event => {
        if (event.target.checked) {
          onChange === null || onChange === void 0 || onChange({
            ...value,
            value: option
          });
          setHasChanged(true);
        }
      }
    }, option.label);
  }), value.value !== null && onChange !== undefined && !field.isRequired && jsx(Button, {
    onClick: () => {
      onChange({
        ...value,
        value: null
      });
      setHasChanged(true);
    }
  }, "Clear")), validationMessage) : jsx(Fragment, null, jsx(FieldLabel, {
    as: "legend"
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), jsx(Stack, {
    across: true,
    gap: "small",
    align: "center"
  }, jsx(SegmentedControl, {
    segments: field.options.map(x => x.label),
    selectedIndex: value.value ? field.options.findIndex(x => x.value === value.value.value) : undefined,
    isReadOnly: onChange === undefined,
    onChange: index => {
      onChange === null || onChange === void 0 || onChange({
        ...value,
        value: field.options[index]
      });
      setHasChanged(true);
    }
  }), value.value !== null && onChange !== undefined && !field.isRequired && jsx(Button, {
    onClick: () => {
      onChange({
        ...value,
        value: null
      });
      setHasChanged(true);
    }
  }, "Clear")), validationMessage));
};
const Cell = ({
  item,
  field,
  linkTo
}) => {
  var _field$options$find;
  const value = item[field.path] + '';
  const label = (_field$options$find = field.options.find(x => x.value === value)) === null || _field$options$find === void 0 ? void 0 : _field$options$find.label;
  return linkTo ? jsx(CellLink, linkTo, label) : jsx(CellContainer, null, label);
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  var _field$options$find2;
  const value = item[field.path] + '';
  const label = (_field$options$find2 = field.options.find(x => x.value === value)) === null || _field$options$find2 === void 0 ? void 0 : _field$options$find2.label;
  return jsx(FieldContainer, null, jsx(FieldLabel, null, field.label), label);
};
function validate(value, isRequired) {
  if (isRequired) {
    // if you got null initially on the update screen, we want to allow saving
    // since the user probably doesn't have read access control
    if (value.kind === 'update' && value.initial === null) {
      return true;
    }
    return value.value !== null;
  }
  return true;
}
const controller = config => {
  var _config$fieldMeta$def, _optionsWithStringVal;
  const optionsWithStringValues = config.fieldMeta.options.map(x => ({
    label: x.label,
    value: x.value.toString()
  }));

  // Transform from string value to type appropriate value
  const t = v => v === null ? null : config.fieldMeta.type === 'integer' ? parseInt(v) : v;
  const stringifiedDefault = (_config$fieldMeta$def = config.fieldMeta.defaultValue) === null || _config$fieldMeta$def === void 0 ? void 0 : _config$fieldMeta$def.toString();
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: {
      kind: 'create',
      value: (_optionsWithStringVal = optionsWithStringValues.find(x => x.value === stringifiedDefault)) !== null && _optionsWithStringVal !== void 0 ? _optionsWithStringVal : null
    },
    type: config.fieldMeta.type,
    displayMode: config.fieldMeta.displayMode,
    isRequired: config.fieldMeta.isRequired,
    options: optionsWithStringValues,
    deserialize: data => {
      for (const option of config.fieldMeta.options) {
        if (option.value === data[config.path]) {
          const stringifiedOption = {
            label: option.label,
            value: option.value.toString()
          };
          return {
            kind: 'update',
            initial: stringifiedOption,
            value: stringifiedOption
          };
        }
      }
      return {
        kind: 'update',
        initial: null,
        value: null
      };
    },
    serialize: value => {
      var _value$value$value, _value$value2;
      return {
        [config.path]: t((_value$value$value = (_value$value2 = value.value) === null || _value$value2 === void 0 ? void 0 : _value$value2.value) !== null && _value$value$value !== void 0 ? _value$value$value : null)
      };
    },
    validate: value => validate(value, config.fieldMeta.isRequired),
    filter: {
      Filter(props) {
        return jsx(MultiSelect, {
          onChange: props.onChange,
          options: optionsWithStringValues,
          value: props.value,
          autoFocus: true
        });
      },
      graphql: ({
        type,
        value: options
      }) => ({
        [config.path]: {
          [type === 'not_matches' ? 'notIn' : 'in']: options.map(x => t(x.value))
        }
      }),
      Label({
        type,
        value
      }) {
        if (!value.length) {
          return type === 'not_matches' ? `is set` : `has no value`;
        }
        if (value.length > 1) {
          const values = value.map(i => i.label).join(', ');
          return type === 'not_matches' ? `is not in [${values}]` : `is in [${values}]`;
        }
        const optionLabel = value[0].label;
        return type === 'not_matches' ? `is not ${optionLabel}` : `is ${optionLabel}`;
      },
      types: {
        matches: {
          label: 'Matches',
          initialValue: []
        },
        not_matches: {
          label: 'Does not match',
          initialValue: []
        }
      }
    }
  };
};

export { CardValue, Cell, Field, controller };

import _extends from '@babel/runtime/helpers/esm/extends';
import { useState } from 'react';
import { jsx, Stack, Inline, Text, VisuallyHidden } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, FieldDescription, DatePicker, TextInput } from '@keystone-ui/fields';
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
import { parse, format, isValid, formatISO } from 'date-fns';
import '../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';

const FULL_TIME_PATTERN = 'HH:mm:ss.SSS';
function formatFullTime(date) {
  return format(date, FULL_TIME_PATTERN);
}
function formatTime(time) {
  const date = parse(time, FULL_TIME_PATTERN, new Date());
  if (date.getMilliseconds() !== 0) {
    return format(date, FULL_TIME_PATTERN);
  }
  if (date.getSeconds() !== 0) {
    return format(date, 'HH:mm:ss');
  }
  return format(date, 'HH:mm');
}
function parseTime(time) {
  for (const pattern of ['H:m:s.SSS', 'H:m:s', 'H:m', 'H']) {
    const parsed = parse(time, pattern, new Date());
    if (isValid(parsed)) {
      return format(parsed, FULL_TIME_PATTERN);
    }
  }
  return undefined;
}
function constructTimestamp({
  dateValue,
  timeValue
}) {
  return new Date(`${dateValue}T${timeValue}`).toISOString();
}
function deconstructTimestamp(value) {
  return {
    dateValue: formatISO(new Date(value), {
      representation: 'date'
    }),
    timeValue: {
      kind: 'parsed',
      value: formatFullTime(new Date(value))
    }
  };
}
function formatOutput(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString();
}

const Field = ({
  field,
  value,
  onChange,
  forceValidation
}) => {
  var _value$value$dateValu;
  const [touchedFirstInput, setTouchedFirstInput] = useState(false);
  const [touchedSecondInput, setTouchedSecondInput] = useState(false);
  const showValidation = touchedFirstInput && touchedSecondInput || forceValidation;
  const validationMessages = showValidation ? validate(value, field.fieldMeta, field.label) : undefined;
  const timeInputProps = useFormattedInput({
    format({
      value
    }) {
      if (value === null) {
        return '';
      }
      return formatTime(value);
    },
    parse(value) {
      value = value.trim();
      if (value === '') {
        return {
          kind: 'parsed',
          value: null
        };
      }
      const parsed = parseTime(value);
      if (parsed !== undefined) {
        return {
          kind: 'parsed',
          value: parsed
        };
      }
      return value;
    }
  }, {
    value: value.value.timeValue,
    onChange(timeValue) {
      onChange === null || onChange === void 0 || onChange({
        ...value,
        value: {
          ...value.value,
          timeValue
        }
      });
    },
    onBlur() {
      setTouchedSecondInput(true);
    }
  });
  return jsx(FieldContainer, {
    as: "fieldset"
  }, jsx(Stack, null, jsx(FieldLabel, {
    as: "legend"
  }, field.label), jsx(FieldDescription, {
    id: `${field.path}-description`
  }, field.description), onChange ? jsx(Inline, {
    gap: "small"
  }, jsx(Stack, null, jsx(DatePicker, {
    onUpdate: date => {
      onChange({
        ...value,
        value: {
          dateValue: date,
          timeValue: typeof value.value.timeValue === 'object' && value.value.timeValue.value === null ? {
            kind: 'parsed',
            value: '00:00:00.000'
          } : value.value.timeValue
        }
      });
    },
    onClear: () => {
      onChange({
        ...value,
        value: {
          ...value.value,
          dateValue: null
        }
      });
    },
    onBlur: () => setTouchedFirstInput(true),
    value: (_value$value$dateValu = value.value.dateValue) !== null && _value$value$dateValu !== void 0 ? _value$value$dateValu : ''
  }), (validationMessages === null || validationMessages === void 0 ? void 0 : validationMessages.date) && jsx(Text, {
    color: "red600",
    size: "small"
  }, validationMessages.date)), jsx(Stack, null, jsx(VisuallyHidden, {
    as: "label",
    htmlFor: `${field.path}--time-input`
  }, `${field.label} time field`), jsx(TextInput, _extends({
    id: `${field.path}--time-input`
  }, timeInputProps, {
    "aria-describedby": field.description === null ? undefined : `${field.path}-description`,
    disabled: onChange === undefined,
    placeholder: "00:00"
  })), (validationMessages === null || validationMessages === void 0 ? void 0 : validationMessages.time) && jsx(Text, {
    color: "red600",
    size: "small"
  }, validationMessages.time))) : value.value.dateValue !== null && typeof value.value.timeValue === 'object' && value.value.timeValue.value !== null && jsx(Text, null, formatOutput(constructTimestamp({
    dateValue: value.value.dateValue,
    timeValue: value.value.timeValue.value
  })))));
};
function validate(value, fieldMeta, label) {
  var _fieldMeta$defaultVal;
  const val = value.value;
  const hasDateValue = val.dateValue !== null;
  const hasTimeValue = typeof val.timeValue === 'string' || typeof val.timeValue.value === 'string';
  const isValueEmpty = !hasDateValue && !hasTimeValue;
  // if we recieve null initially on the item view and the current value is null,
  // we should always allow saving it because:
  // - the value might be null in the database and we don't want to prevent saving the whole item because of that
  // - we might have null because of an access control error
  if (value.kind === 'update' && value.initial === null && isValueEmpty) {
    return undefined;
  }
  if (value.kind === 'create' && isValueEmpty && (typeof fieldMeta.defaultValue === 'object' && ((_fieldMeta$defaultVal = fieldMeta.defaultValue) === null || _fieldMeta$defaultVal === void 0 ? void 0 : _fieldMeta$defaultVal.kind) === 'now' || fieldMeta.updatedAt)) {
    return undefined;
  }
  if (fieldMeta.isRequired && isValueEmpty) {
    return {
      date: `${label} is required`
    };
  }
  if (hasDateValue && !hasTimeValue) {
    return {
      time: `${label} requires a time to be provided`
    };
  }
  const timeError = typeof val.timeValue === 'string' ? `${label} requires a valid time in the format hh:mm` : undefined;
  if (hasTimeValue && !hasDateValue) {
    return {
      date: `${label} requires a date to be selected`,
      time: timeError
    };
  }
  if (timeError) {
    return {
      time: timeError
    };
  }
  return undefined;
}
const Cell = ({
  item,
  field,
  linkTo
}) => {
  const value = item[field.path];
  return linkTo ? jsx(CellLink, linkTo, formatOutput(value)) : jsx(CellContainer, null, formatOutput(value));
};
Cell.supportsLinkTo = true;
const CardValue = ({
  item,
  field
}) => {
  return jsx(FieldContainer, null, jsx(FieldLabel, null, field.label), formatOutput(item[field.path]));
};
const controller = config => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    fieldMeta: config.fieldMeta,
    defaultValue: {
      kind: 'create',
      value: typeof config.fieldMeta.defaultValue === 'string' ? deconstructTimestamp(config.fieldMeta.defaultValue) : {
        dateValue: null,
        timeValue: {
          kind: 'parsed',
          value: null
        }
      }
    },
    deserialize: data => {
      const value = data[config.path];
      return {
        kind: 'update',
        initial: data[config.path],
        value: value ? deconstructTimestamp(value) : {
          dateValue: null,
          timeValue: {
            kind: 'parsed',
            value: null
          }
        }
      };
    },
    serialize: ({
      value: {
        dateValue,
        timeValue
      }
    }) => {
      if (dateValue && typeof timeValue === 'object' && timeValue.value !== null) {
        const formattedDate = constructTimestamp({
          dateValue,
          timeValue: timeValue.value
        });
        return {
          [config.path]: formattedDate
        };
      }
      return {
        [config.path]: null
      };
    },
    validate: value => validate(value, config.fieldMeta, config.label) === undefined
  };
};

export { CardValue, Cell, Field, controller };

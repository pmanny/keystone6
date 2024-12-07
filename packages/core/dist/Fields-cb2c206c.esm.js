import { jsx, Stack, useTheme, Text } from '@keystone-ui/core';
import { useId, useContext, memo, useMemo } from 'react';
import { FieldDescription } from '@keystone-ui/fields';
import { ButtonContext } from '@keystone-ui/button';

/** @jsxRuntime classic */
const RenderField = /*#__PURE__*/memo(function RenderField({
  field,
  value,
  itemValue,
  autoFocus,
  forceValidation,
  onChange
}) {
  return jsx(field.views.Field, {
    field: field.controller,
    onChange: useMemo(() => {
      if (onChange === undefined) return undefined;
      return value => {
        onChange(val => ({
          ...val,
          [field.controller.path]: {
            kind: 'value',
            value
          }
        }));
      };
    }, [onChange, field.controller.path]),
    value: value,
    itemValue: itemValue,
    autoFocus: autoFocus,
    forceValidation: forceValidation
  });
});
function Fields({
  fields,
  value,
  fieldModes = null,
  fieldPositions = null,
  forceValidation,
  invalidFields,
  position = 'form',
  groups = [],
  onChange
}) {
  const renderedFields = Object.fromEntries(Object.keys(fields).map((fieldKey, index) => {
    const field = fields[fieldKey];
    const val = value[fieldKey];
    const fieldMode = fieldModes === null ? 'edit' : fieldModes[fieldKey];
    const fieldPosition = fieldPositions === null ? 'form' : fieldPositions[fieldKey];
    if (fieldMode === 'hidden') return [fieldKey, null];
    if (fieldPosition !== position) return [fieldKey, null];
    if (val.kind === 'error') {
      return [fieldKey, jsx("div", {
        key: fieldKey
      }, field.label, ": ", jsx("span", {
        css: {
          color: 'red'
        }
      }, val.errors[0].message))];
    }
    return [fieldKey, jsx(RenderField, {
      key: fieldKey,
      field: field,
      value: val.value,
      itemValue: value,
      forceValidation: forceValidation && invalidFields.has(fieldKey),
      onChange: fieldMode === 'edit' ? onChange : undefined,
      autoFocus: index === 0
    })];
  }));
  const rendered = [];
  const fieldGroups = new Map();
  for (const group of groups) {
    const state = {
      group,
      rendered: false
    };
    for (const field of group.fields) {
      fieldGroups.set(field.path, state);
    }
  }
  for (const field of Object.values(fields)) {
    const fieldKey = field.path;
    if (fieldGroups.has(fieldKey)) {
      const groupState = fieldGroups.get(field.path);
      if (groupState.rendered) {
        continue;
      }
      groupState.rendered = true;
      const {
        group
      } = groupState;
      const renderedFieldsInGroup = group.fields.map(field => renderedFields[field.path]);
      if (renderedFieldsInGroup.every(field => field === null)) {
        continue;
      }
      rendered.push(jsx(FieldGroup, {
        label: group.label,
        description: group.description
      }, renderedFieldsInGroup));
      continue;
    }
    if (renderedFields[fieldKey] === null) {
      continue;
    }
    rendered.push(renderedFields[fieldKey]);
  }
  return jsx(Stack, {
    gap: "xlarge"
  }, rendered.length === 0 ? 'There are no fields that you can read or edit' : rendered);
}
function FieldGroup(props) {
  const descriptionId = useId();
  const labelId = useId();
  const theme = useTheme();
  const buttonSize = 24;
  const {
    useButtonStyles,
    useButtonTokens,
    defaults
  } = useContext(ButtonContext);
  const buttonStyles = useButtonStyles({
    tokens: useButtonTokens(defaults)
  });
  const divider = jsx("div", {
    css: {
      height: '100%',
      width: 2,
      backgroundColor: theme.colors.border
    }
  });
  return jsx("div", {
    role: "group",
    "aria-labelledby": labelId,
    "aria-describedby": props.description === null ? undefined : descriptionId
  }, jsx("details", {
    open: true
  }, jsx("summary", {
    css: {
      listStyle: 'none',
      outline: 0,
      '::-webkit-details-marker': {
        display: 'none'
      }
    }
  }, jsx(Stack, {
    across: true,
    gap: "medium"
  }, jsx("div", {
    // this is a div rather than a button because the interactive element here is the <summary> above
    css: {
      ...buttonStyles,
      'summary:focus &': buttonStyles[':focus'],
      padding: 0,
      height: buttonSize,
      width: buttonSize,
      'details[open] &': {
        transform: 'rotate(90deg)'
      }
    }
  }, downChevron), divider, jsx(Text, {
    id: labelId,
    size: "large",
    weight: "bold",
    css: {
      position: 'relative'
    }
  }, props.label))), jsx("div", {
    css: {
      display: 'flex'
    }
  }, jsx("div", {
    css: {
      display: 'flex'
    }
  }, jsx(Stack, {
    across: true,
    gap: "medium"
  }, jsx("div", {
    css: {
      width: buttonSize
    }
  }), divider)), jsx(Stack, {
    marginLeft: "medium",
    css: {
      width: '100%'
    }
  }, props.description !== null && jsx(FieldDescription, {
    id: descriptionId
  }, props.description), jsx(Stack, {
    marginTop: "large",
    gap: "xlarge"
  }, props.children)))));
}
const downChevron = jsx("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 12 12",
  xmlns: "http://www.w3.org/2000/svg"
}, jsx("path", {
  d: "M5 3L8.75 6L5 9L5 3Z",
  fill: "currentColor"
}));

export { Fields as F };

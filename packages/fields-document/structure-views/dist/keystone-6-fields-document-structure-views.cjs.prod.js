'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var core = require('@keystone-ui/core');
var fields = require('@keystone-ui/fields');
var React = require('react');
var utils = require('../../dist/utils-8f1d1f0a.cjs.prod.js');
var formFromPreview = require('../../dist/form-from-preview-39e46967.cjs.prod.js');
require('slate');
require('@keystone-6/core/admin-ui/context');
require('@keystone-6/core/fields/types/relationship/views/RelationshipSelect');
require('@keystone-ui/button');
require('@keystone-ui/icons/icons/PlusCircleIcon');
require('@keystone-ui/modals');
require('../../dist/orderable-1dded3d4.cjs.prod.js');
require('@dnd-kit/core');
require('@dnd-kit/sortable');
require('@dnd-kit/modifiers');
require('@keystone-ui/icons/icons/Trash2Icon');

function Field({
  field,
  value,
  onChange,
  autoFocus,
  forceValidation
}) {
  const valueRef = React.useRef(value);
  React.useEffect(() => {
    valueRef.current = value;
  });
  const createPreviewProps = React.useMemo(() => {
    return utils.createGetPreviewProps(field.schema, getNewVal => {
      onChange === null || onChange === void 0 || onChange({
        kind: valueRef.current.kind,
        value: getNewVal(valueRef.current.value)
      });
    }, () => undefined);
  }, [field.schema, onChange]);
  return core.jsx(fields.FieldContainer, null, core.jsx(fields.FieldLabel, null, field.label), core.jsx(formFromPreview.FormValueContentFromPreviewProps, _extends({
    forceValidation: forceValidation,
    autoFocus: autoFocus
  }, createPreviewProps(value.value))));
}
const Cell = () => {
  return null;
};
const CardValue = () => {
  return null;
};
const allowedExportsOnCustomViews = ['schema'];
function controller(config) {
  if (!config.customViews.schema) {
    throw new Error(`No schema in custom view. Did you forgot to set \`views\` to a file that exports a \`schema\` on ${config.listKey}.${config.path}`);
  }
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: `${config.path} { json(hydrateRelationships: true) }`,
    schema: config.customViews.schema,
    defaultValue: {
      kind: 'create',
      value: utils.getInitialPropsValue(config.customViews.schema)
    },
    validate: value => utils.clientSideValidateProp(config.customViews.schema, value.value),
    deserialize: data => {
      var _data$json, _data;
      return {
        kind: 'update',
        value: (_data$json = (_data = data[`${config.path}`]) === null || _data === void 0 ? void 0 : _data.json) !== null && _data$json !== void 0 ? _data$json : null
      };
    },
    serialize: value => {
      return {
        [config.path]: serializeValue(config.customViews.schema, value.value, value.kind)
      };
    }
  };
}
function serializeValue(schema, value, kind) {
  if (schema.kind === 'conditional') {
    return {
      [value.discriminant]: serializeValue(schema.values[value.discriminant], value.value, kind)
    };
  }
  if (schema.kind === 'array') {
    return value.map(a => serializeValue(schema.element, a, kind));
  }
  if (schema.kind === 'form') {
    return value;
  }
  if (schema.kind === 'object') {
    return Object.fromEntries(Object.entries(schema.fields).map(([key, val]) => {
      return [key, serializeValue(val, value[key], kind)];
    }));
  }
  if (schema.kind === 'relationship') {
    if (Array.isArray(value)) {
      return {
        [kind === 'create' ? 'connect' : 'set']: value.map(x => ({
          id: x.id
        }))
      };
    }
    if (value === null) {
      if (kind === 'create') {
        return undefined;
      }
      return {
        disconnect: true
      };
    }
    return {
      connect: {
        id: value.id
      }
    };
  }
  utils.assertNever(schema);
}

exports.CardValue = CardValue;
exports.Cell = Cell;
exports.Field = Field;
exports.allowedExportsOnCustomViews = allowedExportsOnCustomViews;
exports.controller = controller;

import { f as field } from './graphql-ts-schema-5ba48382.esm.js';
import 'pluralize';
import { f as fieldType } from './next-fields-2535337e.esm.js';
import { fields } from '@graphql-ts/schema/api-with-context';

function mapOutputFieldToSQLite(field$1) {
  const innerResolver = field$1.resolve || (({
    value
  }) => value);
  return fields()({
    value: field({
      type: field$1.type,
      args: field$1.args,
      deprecationReason: field$1.deprecationReason,
      description: field$1.description,
      extensions: field$1.extensions,
      resolve(rootVal, ...extra) {
        if (rootVal.value === null) {
          return innerResolver(rootVal, ...extra);
        }
        let value = null;
        try {
          value = JSON.parse(rootVal.value);
        } catch (err) {}
        return innerResolver({
          item: rootVal.item,
          value
        }, ...extra);
      }
    })
  }).value;
}
function mapUpdateInputArgToSQLite(arg) {
  if (arg === undefined) {
    return undefined;
  }
  return {
    arg: arg.arg,
    async resolve(input, context, relationshipInputResolver) {
      const resolvedInput = arg.resolve === undefined ? input : await arg.resolve(input, context, relationshipInputResolver);
      if (resolvedInput === undefined || resolvedInput === null) {
        return resolvedInput;
      }
      return JSON.stringify(resolvedInput);
    }
  };
}
function mapCreateInputArgToSQLite(arg) {
  if (arg === undefined) {
    return undefined;
  }
  return {
    arg: arg.arg,
    async resolve(input, context, relationshipInputResolver) {
      const resolvedInput = arg.resolve === undefined ? input : await arg.resolve(input, context, relationshipInputResolver);
      if (resolvedInput === undefined || resolvedInput === null) {
        return resolvedInput;
      }
      return JSON.stringify(resolvedInput);
    }
  };
}
function jsonFieldTypePolyfilledForSQLite(provider, config, dbFieldConfig) {
  var _dbFieldConfig$mode2;
  if (provider === 'sqlite') {
    var _dbFieldConfig$mode, _config$input, _config$input2;
    return fieldType({
      kind: 'scalar',
      mode: (_dbFieldConfig$mode = dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.mode) !== null && _dbFieldConfig$mode !== void 0 ? _dbFieldConfig$mode : 'optional',
      scalar: 'String',
      default: dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.default,
      map: dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.map,
      extendPrismaSchema: dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.extendPrismaSchema
    })({
      ...config,
      input: {
        create: mapCreateInputArgToSQLite((_config$input = config.input) === null || _config$input === void 0 ? void 0 : _config$input.create),
        update: mapUpdateInputArgToSQLite((_config$input2 = config.input) === null || _config$input2 === void 0 ? void 0 : _config$input2.update)
      },
      output: mapOutputFieldToSQLite(config.output),
      extraOutputFields: Object.fromEntries(Object.entries(config.extraOutputFields || {}).map(([key, field]) => [key, mapOutputFieldToSQLite(field)]))
    });
  }
  return fieldType({
    kind: 'scalar',
    mode: (_dbFieldConfig$mode2 = dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.mode) !== null && _dbFieldConfig$mode2 !== void 0 ? _dbFieldConfig$mode2 : 'optional',
    scalar: 'Json',
    default: dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.default,
    map: dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.map,
    extendPrismaSchema: dbFieldConfig === null || dbFieldConfig === void 0 ? void 0 : dbFieldConfig.extendPrismaSchema
  })(config);
}

export { jsonFieldTypePolyfilledForSQLite as j };

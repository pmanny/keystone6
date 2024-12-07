'use strict';

var fs = require('node:fs/promises');
var path = require('node:path');
var graphql = require('graphql');
var internals = require('@prisma/internals');
var createSystem = require('./createSystem-4d58fc1f.cjs.dev.js');
var http = require('http');
var cors = require('cors');
var bodyParser = require('body-parser');
var express4 = require('@apollo/server/express4');
var express = require('express');
var server = require('@apollo/server');
var disabled = require('@apollo/server/plugin/disabled');
var _default = require('@apollo/server/plugin/landingPage/default');
var graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);
var path__default = /*#__PURE__*/_interopDefault(path);
var cors__default = /*#__PURE__*/_interopDefault(cors);
var express__default = /*#__PURE__*/_interopDefault(express);
var graphqlUploadExpress__default = /*#__PURE__*/_interopDefault(graphqlUploadExpress);

class ExitError extends Error {
  constructor(code) {
    super(`The process exited with Error ${code}`);
    this.code = code;
  }
}

// TODO: this cannot be changed for now, circular dependency with getSystemPaths, getEsbuildConfig
async function importBuiltKeystoneConfiguration(cwd) {
  const builtConfigPath = createSystem.getBuiltKeystoneConfigurationPath(cwd);
  if (!(await fs__default["default"].stat(builtConfigPath).catch(() => null))) {
    console.error('🚨 keystone build has not been run');
    throw new ExitError(1);
  }
  return require(builtConfigPath).default;
}

const modifiers = {
  required: '',
  optional: '?',
  many: '[]'
};
function printIndex(fieldPath, index) {
  return {
    none: '',
    unique: '@unique',
    index: `\n@@index([${fieldPath}])`
  }[index !== null && index !== void 0 ? index : 'none'];
}
function printNativeType(nativeType, datasourceName) {
  return nativeType === undefined ? '' : ` @${datasourceName}.${nativeType}`;
}
function printScalarDefaultValue(defaultValue) {
  if (defaultValue.kind === 'literal') {
    if (typeof defaultValue.value === 'string') {
      return ` @default(${JSON.stringify(defaultValue.value)})`;
    }
    return ` @default(${defaultValue.value.toString()})`;
  }
  if (defaultValue.kind === 'now' || defaultValue.kind === 'autoincrement' || defaultValue.kind === 'cuid' || defaultValue.kind === 'uuid') {
    return ` @default(${defaultValue.kind}())`;
  }
  if (defaultValue.kind === 'dbgenerated') {
    return ` @default(dbgenerated(${JSON.stringify(defaultValue.value)}))`;
  }
  return '';
}
function assertNever(arg) {
  throw new Error(`expected to never be called but was called with ${arg}`);
}
function printField(fieldPath, field, datasourceName, lists) {
  if (field.kind === 'scalar') {
    const nativeType = printNativeType(field.nativeType, datasourceName);
    const index = printIndex(fieldPath, field.index);
    const defaultValue = field.default ? printScalarDefaultValue(field.default) : '';
    const map = field.map ? ` @map(${JSON.stringify(field.map)})` : '';
    const updatedAt = field.updatedAt ? ' @updatedAt' : '';
    return `${fieldPath} ${field.scalar}${modifiers[field.mode]}${updatedAt}${nativeType}${defaultValue}${map}${index}`;
  }
  if (field.kind === 'enum') {
    const index = printIndex(fieldPath, field.index);
    const defaultValue = field.default ? ` @default(${field.default.value})` : '';
    const map = field.map ? ` @map(${JSON.stringify(field.map)})` : '';
    return `${fieldPath} ${field.name}${modifiers[field.mode]}${defaultValue}${map}${index}`;
  }
  if (field.kind === 'multi') {
    return Object.entries(field.fields).map(([subField, field]) => printField(createSystem.getDBFieldKeyForFieldOnMultiField(fieldPath, subField), field, datasourceName, lists)).join('\n');
  }
  if (field.kind === 'relation') {
    if (field.mode === 'many') return `${fieldPath} ${field.list}[] @relation("${field.relationName}")`;
    if (field.foreignIdField.kind === 'none') return `${fieldPath} ${field.list}? @relation("${field.relationName}")`;
    const relationIdFieldPath = `${fieldPath}Id`;
    const relationField = `${fieldPath} ${field.list}? @relation("${field.relationName}", fields: [${relationIdFieldPath}], references: [id])`;
    const foreignList = lists[field.list];
    const foreignIdField = foreignList.resolvedDbFields.id;
    assertDbFieldIsValidForIdField(foreignList.listKey, foreignList.isSingleton, foreignIdField);
    const nativeType = printNativeType(foreignIdField.nativeType, datasourceName);
    const foreignIndex = field.foreignIdField.kind === 'owned' ? 'index' : 'unique';
    const index = printIndex(relationIdFieldPath, foreignIndex);
    const relationIdField = `${relationIdFieldPath} ${foreignIdField.scalar}? @map(${JSON.stringify(field.foreignIdField.map)}) ${nativeType}${index}`;
    return `${relationField}\n${relationIdField}`;
  }
  // TypeScript's control flow analysis doesn't understand that this will never happen without the assertNever
  // (this will still correctly validate if any case is unhandled though)
  return assertNever(field);
}
function collectEnums(lists) {
  const enums = {};
  for (const [listKey, {
    resolvedDbFields
  }] of Object.entries(lists)) {
    for (const [fieldPath, field] of Object.entries(resolvedDbFields)) {
      const fields = field.kind === 'multi' ? Object.entries(field.fields).map(([key, field]) => [field, `${listKey}.${fieldPath} (sub field ${key})`]) : [[field, `${listKey}.${fieldPath}`]];
      for (const [field, ref] of fields) {
        if (field.kind !== 'enum') continue;
        const alreadyExistingEnum = enums[field.name];
        if (alreadyExistingEnum === undefined) {
          enums[field.name] = {
            values: field.values,
            firstDefinedByRef: ref
          };
          continue;
        }
        if (!createSystem.areArraysEqual(alreadyExistingEnum.values, field.values)) {
          throw new Error(`The fields ${alreadyExistingEnum.firstDefinedByRef} and ${ref} both specify Prisma schema enums` + `with the name ${field.name} but they have different values:\n` + `enum from ${alreadyExistingEnum.firstDefinedByRef}:\n${JSON.stringify(alreadyExistingEnum.values, null, 2)}\n` + `enum from ${ref}:\n${JSON.stringify(field.values, null, 2)}`);
        }
      }
    }
  }
  return Object.entries(enums).map(([enumName, {
    values
  }]) => `enum ${enumName} {\n${values.join('\n')}\n}`).join('\n');
}
function assertDbFieldIsValidForIdField(listKey, isSingleton, field) {
  if (field.kind !== 'scalar') {
    throw new Error(`id fields must be either a String or Int Prisma scalar but the id field for the ${listKey} list is not a scalar`);
  }
  // this may be loosened in the future
  if (field.scalar !== 'String' && field.scalar !== 'Int' && field.scalar !== 'BigInt') {
    throw new Error(`id fields must be String, Int or BigInt Prisma scalars but the id field for the ${listKey} list is a ${field.scalar} scalar`);
  }
  if (field.mode !== 'required') {
    throw new Error(`id fields must be a singular required field but the id field for the ${listKey} list is ${field.mode === 'many' ? 'a many' : 'an optional'} field`);
  }
  if (field.index !== undefined) {
    throw new Error(`id fields must not specify indexes themselves but the id field for the ${listKey} list specifies an index`);
  }
}
function printPrismaSchema(config, lists) {
  var _extendPrismaComplete;
  const {
    prismaClientPath,
    provider,
    extendPrismaSchema: extendPrismaCompleteSchema
  } = config.db;
  const prismaSchema = [`// This file is automatically generated by Keystone, do not modify it manually.`, `// Modify your Keystone config when you want to change this.`, ``, `datasource ${provider} {`, `  url = env("DATABASE_URL")`, `  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")`, `  provider = "${provider}"`, `}`, ``, `generator client {`, `  provider = "prisma-client-js"`, ...(prismaClientPath === '@prisma/client' ? [] : [`  output = "${prismaClientPath}"`]), '}'];
  for (const [listKey, {
    resolvedDbFields,
    prisma: {
      mapping,
      extendPrismaSchema: extendPrismaListSchema
    },
    isSingleton
  }] of Object.entries(lists)) {
    const listPrisma = [`model ${listKey} {`];
    for (const [fieldPath, field] of Object.entries(resolvedDbFields)) {
      if (fieldPath === 'id') {
        assertDbFieldIsValidForIdField(listKey, isSingleton, field);
      }
      if (field.kind !== 'none') {
        let fieldPrisma = printField(fieldPath, field, provider, lists);
        if (fieldPath === 'id') {
          fieldPrisma += ' @id';
        }
        listPrisma.push(field.extendPrismaSchema ? field.extendPrismaSchema(fieldPrisma) : fieldPrisma);
      }
    }
    if (mapping !== undefined) {
      listPrisma.push(`@@map(${JSON.stringify(mapping)})`);
    }
    listPrisma.push('}');
    const listPrismaStr = listPrisma.join('\n');
    prismaSchema.push(extendPrismaListSchema ? extendPrismaListSchema(listPrismaStr) : listPrismaStr);
  }
  prismaSchema.push(collectEnums(lists));
  const prismaSchemaStr = prismaSchema.join('\n');
  return (_extendPrismaComplete = extendPrismaCompleteSchema === null || extendPrismaCompleteSchema === void 0 ? void 0 : extendPrismaCompleteSchema(prismaSchemaStr)) !== null && _extendPrismaComplete !== void 0 ? _extendPrismaComplete : prismaSchemaStr;
}

const introspectionTypesSet = new Set(graphql.introspectionTypes);
const SCALARS = {
  ID: 'string',
  Boolean: 'boolean',
  String: 'string',
  Int: 'number',
  Float: 'number',
  JSON: `import('@keystone-6/core/types').JSONValue`,
  Decimal: `import('@keystone-6/core/types').Decimal | string`
};
function stringify(x) {
  return JSON.stringify(x).slice(1, -1);
}
function printTypeReference(type) {
  if (type instanceof graphql.GraphQLNonNull) return printTypeReferenceWithoutNullable(type.ofType);
  return `${printTypeReferenceWithoutNullable(type)} | null`;
}
function printTypeReferenceWithoutNullable(type) {
  if (type instanceof graphql.GraphQLList) return `ReadonlyArray<${printTypeReference(type.ofType)}> | ${printTypeReference(type.ofType)}`;
  const name = type.name;
  if (type instanceof graphql.GraphQLScalarType) {
    if (name in SCALARS) return SCALARS[name];
    return `any`;
  }
  return name;
}
function printInterimType(prismaClientPath, list, operation) {
  const name = list.prisma.types[`${operation}InputName`];
  const prismaType = `import('${prismaClientPath}').Prisma.${name}`;
  return [`type Resolved${name} = {`, ...Object.entries(list.fields).map(([fieldKey, {
    dbField
  }]) => {
    if (dbField.kind === 'none') return `  ${fieldKey}?: undefined`;

    // TODO: this could be elsewhere, maybe id-field.ts
    if (fieldKey === 'id') {
      // autoincrement doesn't support passing an identifier
      if ('default' in dbField) {
        var _dbField$default;
        if (((_dbField$default = dbField.default) === null || _dbField$default === void 0 ? void 0 : _dbField$default.kind) === 'autoincrement') {
          return `  id?: undefined`;
        }
      }

      // soft-block `id` updates for relationship safety
      if (operation === 'update') return `  id?: undefined`;
    }
    if (dbField.kind === 'multi') {
      return [`  ${fieldKey}: {`, ...Object.entries(dbField.fields).map(([subFieldKey, subDbField]) => {
        // TODO: untrue if a db defaultValue is set
        //              const optional = operation === 'Create' && subDbField.mode === 'required' ? '' : '?'
        const optional = '?';
        return `  ${subFieldKey}${optional}: ${prismaType}['${fieldKey}_${subFieldKey}']`;
      }), `  }`].join('\n');
    }

    // TODO: untrue if a db defaultValue is set
    //        const optional = operation === 'Create' && dbField.mode === 'required' ? '' : '?'
    const optional = '?';
    return `  ${fieldKey}${optional}: ${prismaType}['${fieldKey}']`;
  }), `}`].join('\n');
}
function printGeneratedTypes(prismaClientPath, graphQLSchema, lists) {
  prismaClientPath = stringify(prismaClientPath).replace(/'/g, `\\'`);
  return ['/* eslint-disable */', '', [...function* () {
    for (const type of Object.values(graphQLSchema.getTypeMap())) {
      // We don't want to print TS types for the built-in GraphQL introspection types
      // they won't be used for anything we want to print here.
      if (introspectionTypesSet.has(type)) continue;
      if (type instanceof graphql.GraphQLInputObjectType) {
        yield [`export type ${type.name} = {`, ...function* () {
          for (const {
            name,
            type: type_
          } of Object.values(type.getFields())) {
            const maybe = type_ instanceof graphql.GraphQLNonNull ? '' : '?';
            yield `  readonly ${name}${maybe}: ${printTypeReference(type_)}`;
          }
        }(), '}'].join('\n');
        continue;
      }
      if (type instanceof graphql.GraphQLEnumType) {
        yield [`export type ${type.name} =`, type.getValues().map(x => `  | '${stringify(x.name)}'`).join('\n')].join('\n');
        continue;
      }
      if (type.name === 'Empty') {
        yield `export type Empty = {}`;
        continue;
      }
    }
  }()].join('\n\n'), '',
  // Resolved* types
  ...function* () {
    for (const list of Object.values(lists)) {
      if (list.graphql.isEnabled.create) yield printInterimType(prismaClientPath, list, 'create');
      if (list.graphql.isEnabled.update) yield printInterimType(prismaClientPath, list, 'update');
    }
  }(), '', 'export declare namespace Lists {', ...function* () {
    for (const [listKey, list] of Object.entries(lists)) {
      const {
        whereInputName,
        whereUniqueInputName,
        createInputName,
        updateInputName,
        listOrderName
      } = list.prisma.types;
      const listTypeInfoName = `Lists.${listKey}.TypeInfo`;
      yield [`export type ${listKey}<Session = any> = import('@keystone-6/core').ListConfig<${listTypeInfoName}<Session>>`, `namespace ${listKey} {`, `  export type Item = import('${prismaClientPath}').${listKey}`, `  export type TypeInfo<Session = any> = {`, `    key: '${listKey}'`, `    isSingleton: ${list.isSingleton}`, `    fields: ${Object.keys(list.fields).map(x => `'${x}'`).join(' | ')}`, `    item: Item`, `    inputs: {`, `      where: ${list.graphql.isEnabled.query ? whereInputName : 'never'}`, `      uniqueWhere: ${list.graphql.isEnabled.query ? whereUniqueInputName : 'never'}`, `      create: ${list.graphql.isEnabled.create ? list.graphql.names.createInputName : 'never'}`, `      update: ${list.graphql.isEnabled.update ? list.graphql.names.updateInputName : 'never'}`, `      orderBy: ${list.graphql.isEnabled.query ? listOrderName : 'never'}`, `    }`, `    prisma: {`, `      create: ${list.graphql.isEnabled.create ? `Resolved${createInputName}` : 'never'}`, `      update: ${list.graphql.isEnabled.update ? `Resolved${updateInputName}` : 'never'}`, `    }`, `    all: __TypeInfo<Session>`, `  }`, `}`].map(line => `  ${line}`).join('\n');
    }
  }(), '}', `export type Context<Session = any> = import('@keystone-6/core/types').KeystoneContext<TypeInfo<Session>>`, `export type Config<Session = any> = import('@keystone-6/core/types').KeystoneConfig<TypeInfo<Session>>`, '', 'export type TypeInfo<Session = any> = {', `  lists: {`, ...function* () {
    for (const listKey in lists) {
      yield `    readonly ${listKey}: Lists.${listKey}.TypeInfo<Session>`;
    }
  }(), `  }`, `  prisma: import('${prismaClientPath}').PrismaClient`, `  session: Session`, `}`, ``,
  // we need to reference the `TypeInfo` above in another type that is also called `TypeInfo`
  `type __TypeInfo<Session = any> = TypeInfo<Session>`, ``, `export type Lists<Session = any> = {`, `  [Key in keyof TypeInfo['lists']]?: import('@keystone-6/core').ListConfig<TypeInfo<Session>['lists'][Key]>`, `} & Record<string, import('@keystone-6/core').ListConfig<any>>`, ``, `export {}`, ``].join('\n');
}

function getFormattedGraphQLSchema(schema) {
  return '# This file is automatically generated by Keystone, do not modify it manually.\n' + '# Modify your Keystone config when you want to change this.\n\n' + schema + '\n';
}
async function readFileOrUndefined(path) {
  try {
    return await fs__default["default"].readFile(path, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
}
async function validateArtifacts(cwd, system) {
  const paths = system.getPaths(cwd);
  const artifacts = await getArtifacts(system);
  const [writtenGraphQLSchema, writtenPrismaSchema] = await Promise.all([readFileOrUndefined(paths.schema.graphql), readFileOrUndefined(paths.schema.prisma)]);
  if (writtenGraphQLSchema !== artifacts.graphql && writtenPrismaSchema !== artifacts.prisma) {
    console.error('Your Prisma and GraphQL schemas are not up to date');
    throw new ExitError(1);
  }
  if (writtenGraphQLSchema !== artifacts.graphql) {
    console.error('Your GraphQL schema is not up to date');
    throw new ExitError(1);
  }
  if (writtenPrismaSchema !== artifacts.prisma) {
    console.error('Your Prisma schema is not up to date');
    throw new ExitError(1);
  }
}
async function getArtifacts(system) {
  const lists = createSystem.initialiseLists(system.config);
  const prismaSchema = await internals.formatSchema({
    schemas: [[system.config.db.prismaSchemaPath, printPrismaSchema(system.config, lists)]]
  });
  return {
    graphql: getFormattedGraphQLSchema(graphql.printSchema(system.graphQLSchema)),
    prisma: prismaSchema[0][1]
  };
}
async function generateArtifacts(cwd, system) {
  const paths = createSystem.getSystemPaths(cwd, system.config);
  const artifacts = await getArtifacts(system);
  await fs__default["default"].writeFile(paths.schema.graphql, artifacts.graphql);
  await fs__default["default"].writeFile(paths.schema.prisma, artifacts.prisma);
  return artifacts;
}
async function generateTypes(cwd, system) {
  const paths = createSystem.getSystemPaths(cwd, system.config);
  const schema = printGeneratedTypes(paths.types.relativePrismaPath, system.graphQLSchema, system.lists);
  await fs__default["default"].mkdir(path__default["default"].dirname(paths.schema.types), {
    recursive: true
  });
  await fs__default["default"].writeFile(paths.schema.types, schema);
}
async function generatePrismaClient(cwd, system) {
  const paths = createSystem.getSystemPaths(cwd, system.config);
  const generators = await internals.getGenerators({
    schemaPath: paths.schema.prisma
  });
  await Promise.all(generators.map(async generator => {
    try {
      await generator.generate();
    } finally {
      const closePromise = new Promise(resolve => {
        const child = generator.generatorProcess.child;
        child.once('exit', () => {
          resolve();
        });
      });
      generator.stop();
      await closePromise;
    }
  }));
}

/*
NOTE: This creates the main Keystone express server, including the
GraphQL API, but does NOT add the Admin UI middleware.

The Admin UI takes a while to build for dev, and is created separately
so the CLI can bring up the dev server early to handle GraphQL requests.
*/

function formatError(graphqlConfig) {
  return (formattedError, error) => {
    var _graphqlConfig$apollo;
    let debug = graphqlConfig.debug;
    if (debug === undefined) {
      debug = process.env.NODE_ENV !== 'production';
    }
    if (!debug && formattedError.extensions) {
      // Strip out any `debug` extensions
      delete formattedError.extensions.debug;
      delete formattedError.extensions.exception;
    }
    if ((_graphqlConfig$apollo = graphqlConfig.apolloConfig) !== null && _graphqlConfig$apollo !== void 0 && _graphqlConfig$apollo.formatError) {
      return graphqlConfig.apolloConfig.formatError(formattedError, error);
    }
    return formattedError;
  };
}
async function createExpressServer(config, context) {
  var _apolloConfig$plugins;
  const expressServer = express__default["default"]();
  const httpServer = http.createServer(expressServer);
  if (config.server.cors !== null) {
    expressServer.use(cors__default["default"](config.server.cors));
  }
  await config.server.extendExpressApp(expressServer, context);
  await config.server.extendHttpServer(httpServer, context);
  if (config.storage) {
    for (const val of Object.values(config.storage)) {
      if (val.kind !== 'local' || !val.serverRoute) continue;
      expressServer.use(val.serverRoute.path, express__default["default"].static(val.storagePath, {
        setHeaders(res) {
          if (val.type === 'file') {
            res.setHeader('Content-Type', 'application/octet-stream');
          }
        },
        index: false,
        redirect: false,
        lastModified: false
      }));
    }
  }
  const apolloConfig = config.graphql.apolloConfig;
  const serverConfig = {
    formatError: formatError(config.graphql),
    includeStacktraceInErrorResponses: config.graphql.debug,
    ...apolloConfig,
    schema: context.graphql.schema,
    plugins: config.graphql.playground === 'apollo' ? apolloConfig === null || apolloConfig === void 0 ? void 0 : apolloConfig.plugins : [config.graphql.playground ? _default.ApolloServerPluginLandingPageLocalDefault() : disabled.ApolloServerPluginLandingPageDisabled(), ...((_apolloConfig$plugins = apolloConfig === null || apolloConfig === void 0 ? void 0 : apolloConfig.plugins) !== null && _apolloConfig$plugins !== void 0 ? _apolloConfig$plugins : [])]
  }; // TODO: satisfies

  const apolloServer = new server.ApolloServer({
    ...serverConfig
  });
  const maxFileSize = config.server.maxFileSize;
  expressServer.use(graphqlUploadExpress__default["default"]({
    maxFileSize
  }));
  await apolloServer.start();
  expressServer.use(config.graphql.path, bodyParser.json(config.graphql.bodyParser), express4.expressMiddleware(apolloServer, {
    context: async ({
      req,
      res
    }) => {
      return await context.withRequest(req, res);
    }
  }));
  return {
    expressServer,
    apolloServer,
    httpServer
  };
}

exports.ExitError = ExitError;
exports.createExpressServer = createExpressServer;
exports.generateArtifacts = generateArtifacts;
exports.generatePrismaClient = generatePrismaClient;
exports.generateTypes = generateTypes;
exports.getArtifacts = getArtifacts;
exports.getFormattedGraphQLSchema = getFormattedGraphQLSchema;
exports.importBuiltKeystoneConfiguration = importBuiltKeystoneConfiguration;
exports.printPrismaSchema = printPrismaSchema;
exports.validateArtifacts = validateArtifacts;

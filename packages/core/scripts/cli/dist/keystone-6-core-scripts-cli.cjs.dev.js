'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var meow = require('meow');
var createExpressServer = require('../../../dist/createExpressServer-919d7d76.cjs.dev.js');
var esbuild = require('esbuild');
var nextBuild = require('next/dist/build');
var path = require('node:path');
var node_util = require('node:util');
var fs = require('node:fs/promises');
var fse = require('fs-extra');
var resolve = require('resolve');
var fs_walk = require('@nodelib/fs.walk');
var Path = require('path');
var hashString = require('@emotion/hash');
var graphql = require('graphql');
var adminMetaGraphql = require('../../../dist/admin-meta-graphql-5b647d4a.cjs.dev.js');
var createSystem = require('../../../dist/createSystem-4d58fc1f.cjs.dev.js');
var url$1 = require('node:url');
var node_http = require('node:http');
var chalk = require('chalk');
var express = require('express');
var next = require('next');
var internals = require('@prisma/internals');
var migrations = require('../../../dist/migrations-179f85e7.cjs.dev.js');
var prompts = require('prompts');
var url = require('url');
var node_os = require('node:os');
var https = require('node:https');
var ci = require('ci-info');
var Conf = require('conf');
var node_child_process = require('node:child_process');
require('http');
require('cors');
require('body-parser');
require('@apollo/server/express4');
require('@apollo/server');
require('@apollo/server/plugin/disabled');
require('@apollo/server/plugin/landingPage/default');
require('graphql-upload/graphqlUploadExpress.js');
require('@apollo/client');
require('node:crypto');
require('../../../access/dist/keystone-6-core-access.cjs.dev.js');
require('pluralize');
require('../../../dist/next-fields-c62a31f4.cjs.dev.js');
require('decimal.js');
require('../../../dist/graphql-ts-schema-73069614.cjs.dev.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('../../../dist/create-admin-meta-6e822d97.cjs.dev.js');
require('@apollo/cache-control-types');
require('graphql/execution/values');
require('@babel/runtime/helpers/classPrivateFieldInitSpec');
require('@babel/runtime/helpers/classPrivateFieldGet2');
require('@babel/runtime/helpers/classPrivateFieldSet2');
require('image-size');
require('node:fs');
require('node:stream');
require('@aws-sdk/s3-request-presigner');
require('@aws-sdk/client-s3');
require('@aws-sdk/lib-storage');
require('dataloader');
require('@prisma/migrate');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var meow__default = /*#__PURE__*/_interopDefault(meow);
var esbuild__default = /*#__PURE__*/_interopDefault(esbuild);
var nextBuild__default = /*#__PURE__*/_interopDefault(nextBuild);
var path__default = /*#__PURE__*/_interopDefault(path);
var fs__default = /*#__PURE__*/_interopDefault(fs);
var fse__default = /*#__PURE__*/_interopDefault(fse);
var resolve__default = /*#__PURE__*/_interopDefault(resolve);
var Path__namespace = /*#__PURE__*/_interopNamespace(Path);
var hashString__default = /*#__PURE__*/_interopDefault(hashString);
var url__default$1 = /*#__PURE__*/_interopDefault(url$1);
var chalk__default = /*#__PURE__*/_interopDefault(chalk);
var express__default = /*#__PURE__*/_interopDefault(express);
var next__default = /*#__PURE__*/_interopDefault(next);
var prompts__default = /*#__PURE__*/_interopDefault(prompts);
var url__default = /*#__PURE__*/_interopDefault(url);
var https__default = /*#__PURE__*/_interopDefault(https);
var ci__default = /*#__PURE__*/_interopDefault(ci);
var Conf__default = /*#__PURE__*/_interopDefault(Conf);

function appTemplate(adminMetaRootVal, graphQLSchema, {
  configFileExists
}, apiPath) {
  const result = graphql.executeSync({
    document: adminMetaGraphql.staticAdminMetaQuery,
    schema: graphQLSchema,
    contextValue: {
      isAdminUIBuildProcess: true
    }
  });
  if (result.errors) {
    throw result.errors[0];
  }
  const {
    adminMeta
  } = result.data.keystone;
  const adminMetaQueryResultHash = hashString__default["default"](JSON.stringify(adminMeta));
  const allViews = adminMetaRootVal.views.map(viewRelativeToProject => {
    const isRelativeToFile = viewRelativeToProject.startsWith('./') || viewRelativeToProject.startsWith('../');
    const viewRelativeToAppFile = isRelativeToFile ? '../../../' + viewRelativeToProject : viewRelativeToProject;

    // we're not using serializePathForImport here because we want the thing you write for a view
    // to be exactly what you would put in an import in the project directory.
    // we're still using JSON.stringify to escape anything that might need to be though
    return JSON.stringify(viewRelativeToAppFile);
  });
  // -- TEMPLATE START
  return `import { getApp } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/App';

${allViews.map((views, i) => `import * as view${i} from ${views};`).join('\n')}

${configFileExists ? `import * as adminConfig from "../../../admin/config";` : 'var adminConfig = {};'}

export default getApp({
  lazyMetadataQuery: ${JSON.stringify(getLazyMetadataQuery(graphQLSchema, adminMeta))},
  fieldViews: [${allViews.map((_, i) => `view${i}`)}],
  adminMetaHash: "${adminMetaQueryResultHash}",
  adminConfig: adminConfig,
  apiPath: "${apiPath}",
});
`;
  // -- TEMPLATE END
}
function getLazyMetadataQuery(graphqlSchema, adminMeta) {
  const selections = graphql.parse(`fragment x on y {
    keystone {
      adminMeta {
        lists {
          key
          isHidden
          fields {
            path
            createView {
              fieldMode
            }
          }
        }
      }
    }
  }`).definitions[0].selectionSet.selections;
  const queryType = graphqlSchema.getQueryType();
  if (queryType) {
    const getListByKey = name => adminMeta.lists.find(({
      key
    }) => key === name);
    const fields = queryType.getFields();
    if (fields['authenticatedItem'] !== undefined) {
      const authenticatedItemType = fields['authenticatedItem'].type;
      if (!(authenticatedItemType instanceof graphql.GraphQLUnionType) || authenticatedItemType.name !== 'AuthenticatedItem') {
        throw new Error(`The type of Query.authenticatedItem must be a type named AuthenticatedItem and be a union of types that refer to Keystone lists but it is "${authenticatedItemType.toString()}"`);
      }
      for (const type of authenticatedItemType.getTypes()) {
        const fields = type.getFields();
        const list = getListByKey(type.name);
        if (list === undefined) {
          throw new Error(`All members of the AuthenticatedItem union must refer to Keystone lists but "${type.name}" is in the AuthenticatedItem union but is not a Keystone list`);
        }
        const labelGraphQLField = fields[list.labelField];
        if (labelGraphQLField === undefined) {
          throw new Error(`The labelField for the list "${list.key}" is "${list.labelField}" but the GraphQL type does not have a field named "${list.labelField}"`);
        }
        let labelGraphQLFieldType = labelGraphQLField.type;
        if (labelGraphQLFieldType instanceof graphql.GraphQLNonNull) {
          labelGraphQLFieldType = labelGraphQLFieldType.ofType;
        }
        if (!(labelGraphQLFieldType instanceof graphql.GraphQLScalarType)) {
          throw new Error(`Label fields must be scalar GraphQL types but the labelField "${list.labelField}" on the list "${list.key}" is not a scalar type`);
        }
        const requiredArgs = labelGraphQLField.args.filter(arg => arg.defaultValue === undefined && arg.type instanceof graphql.GraphQLNonNull);
        if (requiredArgs.length) {
          throw new Error(`Label fields must have no required arguments but the labelField "${list.labelField}" on the list "${list.key}" has a required argument "${requiredArgs[0].name}"`);
        }
      }
      selections.push({
        kind: graphql.Kind.FIELD,
        name: {
          kind: graphql.Kind.NAME,
          value: 'authenticatedItem'
        },
        selectionSet: {
          kind: graphql.Kind.SELECTION_SET,
          selections: authenticatedItemType.getTypes().map(({
            name
          }) => ({
            kind: graphql.Kind.INLINE_FRAGMENT,
            typeCondition: {
              kind: graphql.Kind.NAMED_TYPE,
              name: {
                kind: graphql.Kind.NAME,
                value: name
              }
            },
            selectionSet: {
              kind: graphql.Kind.SELECTION_SET,
              selections: [{
                kind: graphql.Kind.FIELD,
                name: {
                  kind: graphql.Kind.NAME,
                  value: 'id'
                }
              }, {
                kind: graphql.Kind.FIELD,
                name: {
                  kind: graphql.Kind.NAME,
                  value: getListByKey(name).labelField
                }
              }]
            }
          }))
        }
      });
    }
  }

  // We're returning the complete query AST here for explicit-ness
  return {
    kind: 'Document',
    definitions: [{
      kind: 'OperationDefinition',
      operation: 'query',
      selectionSet: {
        kind: 'SelectionSet',
        selections
      }
    }]
  };
}

const homeTemplate = `export { HomePage as default } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/HomePage';
`;

const listTemplate = listKey => `import { getListPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ListPage';

export default getListPage(${JSON.stringify({
  listKey
})});
`;

const itemTemplate = listKey => `import { getItemPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ItemPage';

export default getItemPage(${JSON.stringify({
  listKey
})})
`;

const noAccessTemplate = session => `import { getNoAccessPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/NoAccessPage';

export default getNoAccessPage(${JSON.stringify({
  sessionsEnabled: !!session
})})
`;

const createItemTemplate = listKey => `import { getCreateItemPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/CreateItemPage';

export default getCreateItemPage(${JSON.stringify({
  listKey
})})
`;

const nextConfigTemplate = basePath => `const nextConfig = {
    // Experimental ESM Externals
    // https://nextjs.org/docs/messages/import-esm-externals
    // required to fix build admin ui issues related to "react-day-picker" and "date-fn"
    experimental: { esmExternals: 'loose' },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    // We use transpilePackages for the custom admin-ui pages in the ./admin folder
    // as they import ts files into nextjs
    transpilePackages: ['../../admin'],
    ${basePath ? `basePath: '${basePath}',` : ''} 
  }
  
  module.exports = nextConfig`;

const pkgDir$1 = Path__namespace.dirname(require.resolve('@keystone-6/core/package.json'));
function writeAdminFiles(config, graphQLSchema, adminMeta, configFileExists) {
  var _config$ui, _config$graphql;
  return [{
    mode: 'write',
    src: nextConfigTemplate((_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.basePath),
    outputPath: 'next.config.js'
  }, {
    mode: 'copy',
    inputPath: Path__namespace.join(pkgDir$1, 'static', 'favicon.ico'),
    outputPath: 'public/favicon.ico'
  }, {
    mode: 'write',
    src: noAccessTemplate(config.session),
    outputPath: 'pages/no-access.js'
  }, {
    mode: 'write',
    src: appTemplate(adminMeta, graphQLSchema, {
      configFileExists
    }, ((_config$graphql = config.graphql) === null || _config$graphql === void 0 ? void 0 : _config$graphql.path) || '/api/graphql'),
    outputPath: 'pages/_app.js'
  }, {
    mode: 'write',
    src: homeTemplate,
    outputPath: 'pages/index.js'
  }, ...adminMeta.lists.flatMap(({
    path,
    key
  }) => [{
    mode: 'write',
    src: listTemplate(key),
    outputPath: `pages/${path}/index.js`
  }, {
    mode: 'write',
    src: itemTemplate(key),
    outputPath: `pages/${path}/[id].js`
  }, {
    mode: 'write',
    src: createItemTemplate(key),
    outputPath: `pages/${path}/create.js`
  }])];
}

const walk = node_util.promisify(fs_walk.walk);
function serializePathForImport(path) {
  // JSON.stringify is important here because it will escape windows style paths(and any thing else that might potentially be in there)
  return JSON.stringify(path
  // Next is unhappy about imports that include .ts/tsx in them because TypeScript is unhappy with them because when doing a TypeScript compilation with tsc, the imports won't be written so they would be wrong there
  .replace(/\.tsx?$/, '').replace(new RegExp(`\\${path__default["default"].sep}`, 'g'), '/'));
}
function getDoesAdminConfigExist() {
  try {
    const configPath = path__default["default"].join(process.cwd(), 'admin', 'config');
    resolve__default["default"].sync(configPath, {
      extensions: ['.ts', '.tsx', '.js'],
      preserveSymlinks: false
    });
    return true;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return false;
    }
    throw err;
  }
}
async function writeAdminFile(file, projectAdminPath) {
  const outputFilename = path__default["default"].join(projectAdminPath, file.outputPath);
  if (file.mode === 'copy') {
    if (!path__default["default"].isAbsolute(file.inputPath)) {
      throw new Error(`An inputPath of "${file.inputPath}" was provided to copy but inputPaths must be absolute`);
    }
    await fse__default["default"].ensureDir(path__default["default"].dirname(outputFilename));
    // TODO: should we use copyFile or copy?
    await fs__default["default"].copyFile(file.inputPath, outputFilename);
  }
  let content;
  try {
    content = await fs__default["default"].readFile(outputFilename, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  if (file.mode === 'write' && content !== file.src) {
    await fse__default["default"].outputFile(outputFilename, file.src);
  }
  return path__default["default"].normalize(outputFilename);
}
const pageExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
async function generateAdminUI(config, graphQLSchema, adminMeta, projectAdminPath, isLiveReload) {
  var _config$ui$getAdditio, _config$ui;
  // when we're not doing a live reload, we want to clear everything out except the .next directory (not the .next directory because it has caches)
  // so that at least every so often, we'll clear out anything that the deleting we do during live reloads doesn't (should just be directories)
  if (!isLiveReload) {
    const dir = await fs__default["default"].readdir(projectAdminPath).catch(err => {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    });
    await Promise.all(dir.map(x => {
      if (x === '.next') return;
      return fs__default["default"].rm(path__default["default"].join(projectAdminPath, x), {
        recursive: true
      });
    }));
  }

  // Write out the files configured by the user
  const userFiles = (_config$ui$getAdditio = (_config$ui = config.ui) === null || _config$ui === void 0 || (_config$ui = _config$ui.getAdditionalFiles) === null || _config$ui === void 0 ? void 0 : _config$ui.map(x => x())) !== null && _config$ui$getAdditio !== void 0 ? _config$ui$getAdditio : [];
  const userFilesToWrite = (await Promise.all(userFiles)).flat();
  const savedFiles = await Promise.all(userFilesToWrite.map(file => writeAdminFile(file, projectAdminPath)));
  const uniqueFiles = new Set(savedFiles);

  // Write out the built-in admin UI files. Don't overwrite any user-defined pages.
  const configFileExists = getDoesAdminConfigExist();

  // Add files to pages/ which point to any files which exist in admin/pages
  const adminConfigDir = path__default["default"].join(process.cwd(), 'admin');
  const userPagesDir = path__default["default"].join(adminConfigDir, 'pages');
  let userPagesEntries = [];
  try {
    userPagesEntries = await walk(userPagesDir, {
      entryFilter: entry => entry.dirent.isFile() && pageExtensions.has(path__default["default"].extname(entry.name))
    });
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  let adminFiles = writeAdminFiles(config, graphQLSchema, adminMeta, configFileExists);
  for (const {
    path
  } of userPagesEntries) {
    const outputFilename = path__default["default"].relative(adminConfigDir, path);
    const importPath = path__default["default"].relative(path__default["default"].dirname(path__default["default"].join(projectAdminPath, outputFilename)), path);
    const serializedImportPath = serializePathForImport(importPath);
    adminFiles.push({
      mode: 'write',
      outputPath: outputFilename,
      src: `export { default } from ${serializedImportPath}`
    });
  }
  adminFiles = adminFiles.filter(x => !uniqueFiles.has(path__default["default"].normalize(path__default["default"].join(projectAdminPath, x.outputPath))));
  await Promise.all(adminFiles.map(file => writeAdminFile(file, projectAdminPath)));

  // Because Next will re-compile things (or at least check things and log a bunch of stuff)
  // if we delete pages and then re-create them, we want to avoid that when live reloading
  // so we only delete things that shouldn't exist anymore
  // this won't clear out empty directories, this is fine since:
  // - they won't create pages in Admin UI which is really what this deleting is about avoiding
  // - we'll remove them when the user restarts the process
  if (isLiveReload) {
    const ignoredDir = path__default["default"].resolve(projectAdminPath, '.next');
    const ignoredFiles = new Set([...adminFiles.map(x => x.outputPath), ...uniqueFiles, 'next-env.d.ts', 'pages/api/__keystone_api_build.js'].map(x => path__default["default"].resolve(projectAdminPath, x)));
    const entries = await walk(projectAdminPath, {
      deepFilter: entry => entry.path !== ignoredDir,
      entryFilter: entry => entry.dirent.isFile() && !ignoredFiles.has(entry.path)
    });
    await Promise.all(entries.map(entry => fs__default["default"].rm(entry.path, {
      recursive: true
    })));
  }
}

// WARNING: be careful not to import this file within next
function identity(x) {
  return x;
}
async function getEsbuildConfig(cwd) {
  var _esbuildFn;
  let esbuildFn;
  try {
    try {
      await esbuild__default["default"].build({
        entryPoints: ['./esbuild.keystone'],
        absWorkingDir: cwd,
        bundle: true,
        sourcemap: true,
        outfile: '.keystone/esbuild.js',
        format: 'cjs',
        platform: 'node',
        logLevel: 'silent'
      });
    } catch (e) {
      var _e$errors;
      if (!((_e$errors = e.errors) !== null && _e$errors !== void 0 && _e$errors.some(err => err.text.includes('Could not resolve')))) throw e;
    }
    esbuildFn = require(require.resolve(`${cwd}/.keystone/esbuild.js`)).default;
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') throw err;
  }
  (_esbuildFn = esbuildFn) !== null && _esbuildFn !== void 0 ? _esbuildFn : esbuildFn = identity;
  return esbuildFn({
    entryPoints: ['./keystone'],
    absWorkingDir: cwd,
    bundle: true,
    sourcemap: true,
    // TODO: this cannot be changed for now, circular dependency with getSystemPaths, getEsbuildConfig
    outfile: '.keystone/config.js',
    format: 'cjs',
    platform: 'node',
    plugins: [{
      name: 'external-node_modules',
      setup(build) {
        build.onResolve({
          // don't bundle anything that is NOT a relative import
          //   WARNING: we can't use a negative lookahead/lookbehind because esbuild uses Go
          filter: /(?:^[^.])|(?:^\.[^/.])|(?:^\.\.[^/])/
        }, ({
          path
        }) => {
          return {
            external: true,
            path
          };
        });
      }
    }]
  });
}

async function build(cwd, {
  frozen,
  prisma,
  ui
}) {
  var _system$config$ui;
  // TODO: should this happen if frozen?
  await esbuild__default["default"].build(await getEsbuildConfig(cwd));
  const system = createSystem.createSystem(await createExpressServer.importBuiltKeystoneConfiguration(cwd));
  if (prisma) {
    if (frozen) {
      await createExpressServer.validateArtifacts(cwd, system);
      console.log('✨ GraphQL and Prisma schemas are up to date'); // TODO: validating?
    } else {
      await createExpressServer.generateArtifacts(cwd, system);
      console.log('✨ Generated GraphQL and Prisma schemas'); // TODO: generating?
    }
    await createExpressServer.generateTypes(cwd, system);
    await createExpressServer.generatePrismaClient(cwd, system);
  }
  if ((_system$config$ui = system.config.ui) !== null && _system$config$ui !== void 0 && _system$config$ui.isDisabled || !ui) return;
  console.log('✨ Generating Admin UI code');
  const paths = system.getPaths(cwd);
  await generateAdminUI(system.config, system.graphQLSchema, system.adminMeta, paths.admin, false);
  console.log('✨ Building Admin UI');
  await nextBuild__default["default"](paths.admin, undefined, undefined, undefined, undefined, undefined, undefined, 'default');
}

// prompts is badly typed so we have some more specific typed APIs
// prompts also returns an undefined value on SIGINT which we really just want to exit on

async function confirmPrompt(message, initial = true) {
  const {
    value
  } = await prompts__default["default"]({
    name: 'value',
    type: 'confirm',
    message,
    initial
  });
  if (value === undefined) {
    process.exit(1);
  }
  return value;
}
async function textPrompt(message) {
  const {
    value
  } = await prompts__default["default"]({
    name: 'value',
    type: 'text',
    message
  });
  if (value === undefined) {
    process.exit(1);
  }
  return value;
}

const pkgDir = Path__namespace["default"].dirname(__dirname);

const adminErrorHTMLFilepath = Path__namespace["default"].join(pkgDir, 'static', 'admin-error.html');
function createAdminUIMiddlewareWithNextApp(config, commonContext, nextApp) {
  const handle = nextApp.getRequestHandler();
  const {
    ui: {
      isAccessAllowed,
      pageMiddleware,
      publicPages,
      basePath
    }
  } = config;
  if (basePath.endsWith('/')) throw new TypeError('basePath must not end with a trailing slash');
  return async (req, res) => {
    const {
      pathname
    } = url__default["default"].parse(req.url);
    if (pathname !== null && pathname !== void 0 && pathname.startsWith(`${basePath}/_next`) || pathname !== null && pathname !== void 0 && pathname.startsWith(`${basePath}/__next`)) {
      return handle(req, res);
    }
    try {
      // do nothing if this is a public page
      const isPublicPage = publicPages.includes(pathname);
      const context = await commonContext.withRequest(req, res);
      const wasAccessAllowed = isPublicPage ? true : await isAccessAllowed(context);
      const shouldRedirect = await (pageMiddleware === null || pageMiddleware === void 0 ? void 0 : pageMiddleware({
        context,
        wasAccessAllowed,
        basePath
      }));
      if (shouldRedirect) {
        res.header('Cache-Control', 'no-cache, max-age=0');
        res.header('Location', shouldRedirect.to);
        res.status(302);
        res.send();
        return;
      }
      if (!wasAccessAllowed) return nextApp.render(req, res, '/no-access');
      handle(req, res);
    } catch (e) {
      console.error('An error occurred handling a request for the Admin UI:', e);
      res.status(500);
      res.format({
        'text/html': function () {
          res.sendFile(adminErrorHTMLFilepath);
        },
        'application/json': function () {
          res.send({
            error: true
          });
        },
        default: function () {
          res.send('An error occurred handling a request for the Admin UI.');
        }
      });
    }
  };
}

const defaultTelemetryEndpoint = 'https://telemetry.keystonejs.com/3/';
function log(message) {
  if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
    console.log(`${message}`);
  }
}
function getTelemetryConfig() {
  const userConfig = new Conf__default["default"]({
    projectName: 'keystonejs',
    projectSuffix: '',
    projectVersion: '3.0.0',
    migrations: {
      '^2.0.0': store => {
        var _existing$device$last;
        const existing = store.get('telemetry');
        if (!existing) return; // skip non-configured or known opt-outs

        const replacement = {
          informedAt: null,
          // re-inform
          device: {
            lastSentDate: (_existing$device$last = existing.device.lastSentDate) !== null && _existing$device$last !== void 0 ? _existing$device$last : null
          },
          projects: {} // see below
        };

        // copy existing project.lastSentDate's
        for (const [projectPath, project] of Object.entries(existing.projects)) {
          if (projectPath === 'default') continue; // informedAt moved to device.lastSentDate

          // dont copy garbage
          if (typeof project !== 'object') continue;
          if (typeof project.lastSentDate !== 'string') continue;
          if (new Date(project.lastSentDate).toString() === 'Invalid Date') continue;

          // retain lastSentDate
          replacement.projects[projectPath] = {
            lastSentDate: project.lastSentDate
          };
        }
        store.set('telemetry', replacement);
      },
      '^3.0.0': store => {
        const existing = store.get('telemetry');
        if (!existing) return; // skip non-configured or known opt-outs

        store.set('telemetry', {
          ...existing,
          informedAt: null // re-inform
        });
      }
    }
  });
  return {
    telemetry: userConfig.get('telemetry'),
    userConfig
  };
}
function getDefault(telemetry) {
  if (telemetry) return telemetry;
  return {
    informedAt: null,
    device: {
      lastSentDate: null
    },
    projects: {}
  }; // help Typescript infer the type
}
const todaysDate = new Date().toISOString().slice(0, 10);
function collectFieldCount(lists) {
  const fields = {
    unknown: 0
  };
  for (const list of Object.values(lists)) {
    for (const [fieldPath, field] of Object.entries(list.fields)) {
      const fieldType = field.__ksTelemetryFieldTypeName;
      if (!fieldType) {
        // skip id fields
        if (fieldPath.endsWith('id')) continue;
        fields.unknown++;
        continue;
      }
      fields[fieldType] || (fields[fieldType] = 0);
      fields[fieldType] += 1;
    }
  }
  return fields;
}
async function collectPackageVersions() {
  const packages = {
    '@keystone-6/core': '0.0.0' // "unknown"
  };
  for (const packageName of ['@keystone-6/core', '@keystone-6/auth', '@keystone-6/fields-document', '@keystone-6/cloudinary', '@keystone-6/session-store-redis', '@opensaas/keystone-nextjs-auth']) {
    try {
      const packageJson = require(`${packageName}/package.json`);
      // const packageJson = await import(`${packageName}/package.json`, { assert: { type: 'json' } }) // TODO: broken in jest
      packages[packageName] = packageJson.version;
    } catch (err) {
      // do nothing, the package is probably not installed
    }
  }
  return packages;
}
function printNext(telemetry) {
  if (!telemetry) {
    console.log(`Telemetry data will ${chalk.red`not`} be sent by this system user`);
    return;
  }
  console.log(`Telemetry data will be sent the next time you run ${chalk.green`"keystone dev"`}`);
}
function printTelemetryStatus(telemetry, updated = false) {
  const auxverb = updated ? 'has been' : 'is';
  if (telemetry === undefined) {
    console.log(`Keystone telemetry ${auxverb} ${chalk.yellow`uninitialized`}`);
    console.log();
    printNext(telemetry);
    return;
  }
  if (telemetry === false) {
    console.log(`Keystone telemetry ${auxverb} ${chalk.red`disabled`}`);
    console.log();
    printNext(telemetry);
    return;
  }
  console.log(`Keystone telemetry ${auxverb} ${chalk.green`enabled`}`);
  console.log();
  console.log(`  Device telemetry was last sent on ${telemetry.device.lastSentDate}`);
  for (const [projectPath, project] of Object.entries(telemetry.projects)) {
    console.log(`  Project telemetry for "${chalk.yellow(projectPath)}" was last sent on ${project === null || project === void 0 ? void 0 : project.lastSentDate}`);
  }
  console.log();
  printNext(telemetry);
}
function inform(telemetry, userConfig) {
  console.log(); // gap to help visiblity
  console.log(`${chalk.bold('Keystone Telemetry')}`);
  console.log(`${chalk.yellow`Keystone collects anonymous data when you run`} ${chalk.green`"keystone dev"`}`);
  console.log(`You can use ${chalk.green`"keystone telemetry --help"`} to update your preferences at any time`);
  if (telemetry.informedAt === null) {
    console.log();
    console.log(`No telemetry data has been sent as part of this notice`);
  }
  console.log();
  printNext(telemetry);
  console.log(); // gap to help visiblity
  console.log(`For more information, including how to opt-out see ${chalk.grey`https://keystonejs.com/telemetry`} (updated ${chalk.blue`2024-08-20`})`);

  // update the informedAt
  telemetry.informedAt = new Date().toJSON();
  userConfig.set('telemetry', telemetry);
}
async function sendEvent(eventType, eventData) {
  const endpoint = process.env.KEYSTONE_TELEMETRY_ENDPOINT || defaultTelemetryEndpoint;
  await new Promise(resolve => {
    const req = https__default["default"].request(`${endpoint}${eventType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, () => resolve());
    req.once('error', err => {
      var _err$message;
      log((_err$message = err === null || err === void 0 ? void 0 : err.message) !== null && _err$message !== void 0 ? _err$message : err);
      resolve();
    });
    req.end(JSON.stringify(eventData));
  });
  log(`sent ${eventType} report`);
}
async function sendProjectTelemetryEvent(cwd, lists, dbProviderName, telemetry, userConfig) {
  var _telemetry$projects$c;
  const project = (_telemetry$projects$c = telemetry.projects[cwd]) !== null && _telemetry$projects$c !== void 0 ? _telemetry$projects$c : {
    lastSentDate: null
  };
  const {
    lastSentDate
  } = project;
  if (lastSentDate && lastSentDate === todaysDate) {
    log('project telemetry already sent today');
    return;
  }
  await sendEvent('project', {
    lastSentDate,
    packages: await collectPackageVersions(),
    database: dbProviderName,
    lists: Object.keys(lists).length,
    fields: collectFieldCount(lists)
  });

  // update the project lastSentDate
  telemetry.projects[cwd] = {
    lastSentDate: todaysDate
  };
  userConfig.set('telemetry', telemetry);
}
async function sendDeviceTelemetryEvent(telemetry, userConfig) {
  const {
    lastSentDate
  } = telemetry.device;
  if (lastSentDate && lastSentDate === todaysDate) {
    log('device telemetry already sent today');
    return;
  }
  await sendEvent('device', {
    lastSentDate,
    os: node_os.platform(),
    node: process.versions.node.split('.')[0]
  });

  // update the device lastSentDate
  telemetry.device = {
    lastSentDate: todaysDate
  };
  userConfig.set('telemetry', telemetry);
}
async function runTelemetry(cwd, lists, dbProviderName) {
  try {
    if (ci__default["default"].isCI ||
    // don't run in CI
    process.env.NODE_ENV === 'production' ||
    // don't run in production
    process.env.KEYSTONE_TELEMETRY_DISABLED === '1' // don't run if the user has disabled it
    ) {
      return;
    }
    const {
      telemetry,
      userConfig
    } = getTelemetryConfig();

    // don't run if the user has opted out
    //   or if somehow our defaults are problematic, do nothing
    if (telemetry === false) return;

    // don't send telemetry before we inform the user, allowing opt-out
    const telemetryDefaulted = getDefault(telemetry);
    if (!telemetryDefaulted.informedAt) return inform(telemetryDefaulted, userConfig);
    await sendProjectTelemetryEvent(cwd, lists, dbProviderName, telemetryDefaulted, userConfig);
    await sendDeviceTelemetryEvent(telemetryDefaulted, userConfig);
  } catch (err) {
    var _err$message2;
    log((_err$message2 = err === null || err === void 0 ? void 0 : err.message) !== null && _err$message2 !== void 0 ? _err$message2 : err);
  }
}
function statusTelemetry(updated = false) {
  const {
    telemetry
  } = getTelemetryConfig();
  printTelemetryStatus(telemetry, updated);
}
function informTelemetry() {
  const {
    userConfig
  } = getTelemetryConfig();
  inform(getDefault(false), userConfig);
}
function enableTelemetry() {
  const {
    telemetry,
    userConfig
  } = getTelemetryConfig();
  if (!telemetry) {
    userConfig.set('telemetry', getDefault(telemetry));
  }
  statusTelemetry(true);
}
function disableTelemetry() {
  const {
    userConfig
  } = getTelemetryConfig();
  userConfig.set('telemetry', false);
  statusTelemetry(true);
}
function resetTelemetry() {
  const {
    userConfig
  } = getTelemetryConfig();
  userConfig.delete('telemetry');
  statusTelemetry(true);
}

const devLoadingHTMLFilepath = path__default["default"].join(pkgDir, 'static', 'dev-loading.html');
function stripExtendHttpServer(config) {
  const {
    server,
    ...rest
  } = config;
  if (server) {
    const {
      extendHttpServer,
      ...restServer
    } = server;
    return {
      ...rest,
      server: restServer
    };
  }
  return rest;
}
function resolvablePromise() {
  let _resolve;
  const promise = new Promise(resolve => {
    _resolve = resolve;
  });
  promise.resolve = _resolve;
  return promise;
}
async function dev(cwd, {
  dbPush,
  prisma,
  server,
  ui
}) {
  var _esbuildConfig$plugin;
  console.log('✨ Starting Keystone');
  let lastPromise = resolvablePromise();
  const builds = {
    [Symbol.asyncIterator]: () => ({
      next: () => lastPromise
    })
  };
  function addBuildResult(build) {
    const prev = lastPromise;
    lastPromise = resolvablePromise();
    prev.resolve({
      value: build,
      done: false
    });
  }
  const esbuildConfig = await getEsbuildConfig(cwd);
  const esbuildContext = await esbuild__default["default"].context({
    ...esbuildConfig,
    plugins: [...((_esbuildConfig$plugin = esbuildConfig.plugins) !== null && _esbuildConfig$plugin !== void 0 ? _esbuildConfig$plugin : []), {
      name: 'esbuildWatchPlugin',
      setup(build) {
        // TODO: no any
        build.onEnd(addBuildResult);
      }
    }]
  });
  try {
    const firstBuild = await esbuildContext.rebuild();
    addBuildResult(firstBuild);
  } catch (e) {
    // esbuild prints everything we want users to see
  }
  esbuildContext.watch();
  let prismaClient = null;
  async function stop(aHttpServer, exit = false) {
    await esbuildContext.dispose();

    //   WARNING: this is only actually required for tests
    // stop httpServer
    if (aHttpServer) {
      await new Promise((resolve, reject) => {
        aHttpServer.close(async err => {
          if (err) {
            console.error('Error closing the server', err);
            return reject(err);
          }
          resolve(null);
        });
      });
    }

    //   WARNING: this is only required for tests
    // stop Prisma
    try {
      var _prismaClient, _prismaClient$disconn;
      await ((_prismaClient = prismaClient) === null || _prismaClient === void 0 || (_prismaClient$disconn = _prismaClient.disconnect) === null || _prismaClient$disconn === void 0 ? void 0 : _prismaClient$disconn.call(_prismaClient));
    } catch (err) {
      console.error('Error disconnecting from the database', err);
      throw err;
    }
    if (exit) throw new createExpressServer.ExitError(1);
  }
  const app = server ? express__default["default"]() : null;
  const httpServer = app ? node_http.createServer(app) : null;
  let expressServer = null;
  let hasAddedAdminUIMiddleware = false;
  const isReady = () => !server || expressServer !== null && hasAddedAdminUIMiddleware;
  const initKeystone = async () => {
    var _configWithExtendHttp, _system$config$ui;
    const configWithExtendHttp = await createExpressServer.importBuiltKeystoneConfiguration(cwd);
    const {
      system,
      context,
      prismaClientModule,
      apolloServer,
      ...rest
    } = await async function () {
      const system = createSystem.createSystem(stripExtendHttpServer(configWithExtendHttp));

      // mkdir's for local storage
      for (const val of Object.values(system.config.storage)) {
        if (val.kind !== 'local') continue;
        await fs__default["default"].mkdir(val.storagePath, {
          recursive: true
        });
        console.warn(`WARNING: 'mkdir -p ${val.storagePath}' won't happen in production`);
      }

      // Generate the Artifacts
      if (prisma) {
        console.log('✨ Generating GraphQL and Prisma schemas');
        const {
          prisma: generatedPrismaSchema
        } = await createExpressServer.generateArtifacts(cwd, system);
        await createExpressServer.generateTypes(cwd, system);
        await createExpressServer.generatePrismaClient(cwd, system);
        const paths = system.getPaths(cwd);
        if (dbPush) {
          const created = await internals.createDatabase(system.config.db.url, path__default["default"].dirname(paths.schema.prisma));
          if (created) console.log(`✨ Database created`);
          const migration = await migrations.withMigrate(paths.schema.prisma, system, async m => {
            // what does force on migrate.engine.schemaPush mean?
            // - true: ignore warnings, but unexecutable steps will block
            // - false: warnings or unexecutable steps will block
            const migration_ = await m.schema(generatedPrismaSchema, false);

            // if there are unexecutable steps, we need to reset the database [or the user can use migrations]
            if (migration_.unexecutable.length) {
              console.log(`${chalk__default["default"].bold.red('\n⚠️ We found changes that cannot be executed:\n')}`);
              for (const item of migration_.unexecutable) {
                console.log(`  • ${item}`);
              }
              if (migration_.warnings.length) {
                console.warn(chalk__default["default"].bold(`\n⚠️  Warnings:\n`));
                for (const warning of migration_.warnings) {
                  console.warn(`  • ${warning}`);
                }
              }
              console.log('\nTo apply this migration, we need to reset the database');
              if (!(await confirmPrompt(`Do you want to continue? ${chalk__default["default"].red('All data will be lost')}`, false))) {
                console.log('Reset cancelled');
                throw new createExpressServer.ExitError(0);
              }
              await m.reset();
              return m.schema(generatedPrismaSchema, false);
            }
            if (migration_.warnings.length) {
              if (migration_.warnings.length) {
                console.warn(chalk__default["default"].bold(`\n⚠️  Warnings:\n`));
                for (const warning of migration_.warnings) {
                  console.warn(`  • ${warning}`);
                }
              }
              if (!(await confirmPrompt(`Do you want to continue? ${chalk__default["default"].red('Some data will be lost')}`, false))) {
                console.log('Push cancelled');
                throw new createExpressServer.ExitError(0);
              }
              return m.schema(generatedPrismaSchema, true);
            }
            return migration_;
          });
          if (migration.warnings.length === 0 && migration.executedSteps === 0) {
            console.log(`✨ Database unchanged`);
          } else {
            console.log(`✨ Database synchronized with Prisma schema`);
          }
        } else {
          console.warn('⚠️ Skipping database schema push');
        }
        const prismaClientModule = require(paths.prisma);
        const keystone = system.getKeystone(prismaClientModule);
        console.log('✨ Connecting to the database');
        await keystone.connect(); // TODO: remove, replace with server.onStart
        if (!server) {
          return {
            system,
            context: keystone.context,
            prismaClientModule
          };
        }
        console.log('✨ Creating server');
        const {
          apolloServer,
          expressServer
        } = await createExpressServer.createExpressServer(system.config, keystone.context);
        console.log(`✅ GraphQL API ready`);
        return {
          system,
          context: keystone.context,
          expressServer,
          apolloServer,
          prismaClientModule
        };
      }
      return {
        system
      };
    }();
    if (configWithExtendHttp !== null && configWithExtendHttp !== void 0 && (_configWithExtendHttp = configWithExtendHttp.server) !== null && _configWithExtendHttp !== void 0 && _configWithExtendHttp.extendHttpServer && httpServer && context) {
      configWithExtendHttp.server.extendHttpServer(httpServer, context);
    }
    prismaClient = context === null || context === void 0 ? void 0 : context.prisma;
    if (rest.expressServer) {
      ({
        expressServer
      } = rest);
    }
    let nextApp;
    if (!((_system$config$ui = system.config.ui) !== null && _system$config$ui !== void 0 && _system$config$ui.isDisabled) && ui) {
      if (!expressServer || !context) throw new TypeError('Error trying to prepare the Admin UI');
      console.log('✨ Generating Admin UI code');
      const paths = system.getPaths(cwd);
      await fs__default["default"].rm(paths.admin, {
        recursive: true,
        force: true
      });
      await generateAdminUI(system.config, system.graphQLSchema, system.adminMeta, paths.admin, false);
      console.log('✨ Preparing Admin UI');
      nextApp = next__default["default"]({
        dev: true,
        dir: paths.admin
      });
      await nextApp.prepare();
      expressServer.use(createAdminUIMiddlewareWithNextApp(system.config, context, nextApp));
      console.log(`✅ Admin UI ready`);
    }
    hasAddedAdminUIMiddleware = true;
    initKeystonePromiseResolve();
    const originalPrismaSchema = createExpressServer.printPrismaSchema(system.config, system.lists);
    let lastPrintedGraphQLSchema = graphql.printSchema(system.graphQLSchema);
    let lastApolloServer = apolloServer !== null && apolloServer !== void 0 ? apolloServer : null;
    if (system.config.telemetry !== false) {
      runTelemetry(cwd, system.lists, system.config.db.provider);
    }
    for await (const buildResult of builds) {
      if (buildResult.errors.length) continue;
      console.log('compiled successfully');
      try {
        const paths = system.getPaths(cwd);

        // wipe the require cache
        {
          const resolved = require.resolve(paths.config);
          delete require.cache[resolved];
        }
        const newConfigWithHttp = await createExpressServer.importBuiltKeystoneConfiguration(cwd);
        const newSystem = createSystem.createSystem(stripExtendHttpServer(newConfigWithHttp));
        if (prisma) {
          if (!originalPrismaSchema) throw new TypeError('Missing Prisma schema source');
          const newPrismaSchema = createExpressServer.printPrismaSchema(newSystem.config, newSystem.lists);
          if (originalPrismaSchema !== newPrismaSchema) {
            console.error('🔄 Your prisma schema has changed, please restart Keystone');
            return stop(null, true);
          }
          // we only need to test for the things which influence the prisma client creation
          // and aren't written into the prisma schema since we check whether the prisma schema has changed above
          if (JSON.stringify(newSystem.config.db.enableLogging) !== JSON.stringify(system.config.db.enableLogging) || newSystem.config.db.url !== system.config.db.url) {
            console.error('Your database configuration has changed, please restart Keystone');
            return stop(null, true);
          }
        }

        // we're not using generateCommittedArtifacts or any of the similar functions
        // because we will never need to write a new prisma schema here
        // and formatting the prisma schema leaves some listeners on the process
        // which means you get a "there's probably a memory leak" warning from node
        const newPrintedGraphQLSchema = graphql.printSchema(newSystem.graphQLSchema);
        if (newPrintedGraphQLSchema !== lastPrintedGraphQLSchema) {
          await fs__default["default"].writeFile(paths.schema.graphql, createExpressServer.getFormattedGraphQLSchema(newPrintedGraphQLSchema));
          lastPrintedGraphQLSchema = newPrintedGraphQLSchema;
        }
        await createExpressServer.generateTypes(cwd, newSystem);
        await generateAdminUI(newSystem.config, newSystem.graphQLSchema, newSystem.adminMeta, paths.admin, true);
        if (prismaClientModule) {
          if (server && lastApolloServer) {
            const {
              context: newContext
            } = newSystem.getKeystone(prismaClientModule);
            const servers = await createExpressServer.createExpressServer(newSystem.config, newContext);
            if (nextApp) {
              servers.expressServer.use(createAdminUIMiddlewareWithNextApp(newSystem.config, newContext, nextApp));
            }
            expressServer = servers.expressServer;
            const prevApolloServer = lastApolloServer;
            lastApolloServer = servers.apolloServer;
            await prevApolloServer.stop();
          }
        }
      } catch (err) {
        console.error(`Error loading your Keystone config`, err);
      }
    }
  };

  // Serve the dev status page for the Admin UI
  let initKeystonePromiseResolve;
  let initKeystonePromiseReject;
  const initKeystonePromise = new Promise((resolve, reject) => {
    initKeystonePromiseResolve = resolve;
    initKeystonePromiseReject = reject;
  });
  if (app && httpServer) {
    const config = await createExpressServer.importBuiltKeystoneConfiguration(cwd);
    app.use('/__keystone/dev/status', (req, res) => {
      res.status(isReady() ? 200 : 501).end();
    });
    app.use((req, res, next) => {
      var _config$graphql;
      if (expressServer && hasAddedAdminUIMiddleware) {
        return expressServer(req, res, next);
      }
      const {
        pathname
      } = url__default$1["default"].parse(req.url);
      if (expressServer && pathname === (((_config$graphql = config.graphql) === null || _config$graphql === void 0 ? void 0 : _config$graphql.path) || '/api/graphql')) {
        return expressServer(req, res, next);
      }
      res.sendFile(devLoadingHTMLFilepath);
    });
    const httpOptions = {
      port: 3000
    };
    if (config !== null && config !== void 0 && config.server && 'port' in config.server) {
      httpOptions.port = config.server.port;
    }
    if (config !== null && config !== void 0 && config.server && 'options' in config.server && config.server.options) {
      Object.assign(httpOptions, config.server.options);
    }

    // preference env.PORT if supplied
    if ('PORT' in process.env) {
      httpOptions.port = parseInt(process.env.PORT || '');
    }

    // preference env.HOST if supplied
    if ('HOST' in process.env) {
      httpOptions.host = process.env.HOST || '';
    }
    const server = httpServer.listen(httpOptions, err => {
      var _config$graphql2;
      if (err) throw err;
      const easyHost = [undefined, '', '::', '0.0.0.0'].includes(httpOptions.host) ? 'localhost' : httpOptions.host;
      console.log(`⭐️ Server listening on ${httpOptions.host || ''}:${httpOptions.port} (http://${easyHost}:${httpOptions.port}/)`);
      console.log(`⭐️ GraphQL API available at ${((_config$graphql2 = config.graphql) === null || _config$graphql2 === void 0 ? void 0 : _config$graphql2.path) || '/api/graphql'}`);

      // Don't start initialising Keystone until the dev server is ready,
      // otherwise it slows down the first response significantly
      initKeystone().catch(async err => {
        await stop(server);
        initKeystonePromiseReject(err);
      });
    });
    await initKeystonePromise;
    return async () => await stop(server);
  } else {
    await initKeystone();
    return () => Promise.resolve();
  }
}

async function spawnPrisma3(cwd, system, commands) {
  return new Promise((resolve, reject) => {
    const p = node_child_process.spawn('node', [require.resolve('prisma'), ...commands], {
      cwd,
      env: {
        ...process.env,
        DATABASE_URL: system.config.db.url,
        PRISMA_HIDE_UPDATE_MESSAGE: '1'
      },
      stdio: 'inherit'
    });
    p.on('error', err => reject(err));
    p.on('exit', exitCode => resolve({
      exitCode
    }));
  });
}
async function prisma(cwd, args, frozen) {
  // TODO: should build unless --frozen?

  const system = createSystem.createSystem(await createExpressServer.importBuiltKeystoneConfiguration(cwd));
  await createExpressServer.validateArtifacts(cwd, system);
  console.log('✨ GraphQL and Prisma schemas are up to date');
  const {
    exitCode
  } = await spawnPrisma3(cwd, system, args);
  if (typeof exitCode === 'number' && exitCode !== 0) {
    throw new createExpressServer.ExitError(exitCode);
  }
}

async function start(cwd, {
  server,
  ui,
  withMigrations
}) {
  var _system$config$ui;
  console.log('✨ Starting Keystone');
  const system = createSystem.createSystem(await createExpressServer.importBuiltKeystoneConfiguration(cwd));
  const paths = system.getPaths(cwd);
  if (withMigrations) {
    console.log('✨ Applying any database migrations');
    const {
      appliedMigrationNames
    } = await migrations.withMigrate(paths.schema.prisma, system, m => m.apply());
    console.log(appliedMigrationNames.length === 0 ? `✨ No database migrations to apply` : `✨ Database migrated`);
  }
  if (!server) return;
  const prismaClient = require(paths.prisma);
  const keystone = system.getKeystone(prismaClient);
  console.log('✨ Connecting to the database');
  await keystone.connect();
  console.log('✨ Creating server');
  const {
    expressServer,
    httpServer
  } = await createExpressServer.createExpressServer(system.config, keystone.context);
  console.log(`✅ GraphQL API ready`);
  if (!((_system$config$ui = system.config.ui) !== null && _system$config$ui !== void 0 && _system$config$ui.isDisabled) && ui) {
    console.log('✨ Preparing Admin UI');
    const nextApp = next__default["default"]({
      dev: false,
      dir: paths.admin
    });
    await nextApp.prepare();
    expressServer.use(await createAdminUIMiddlewareWithNextApp(system.config, keystone.context, nextApp));
    console.log(`✅ Admin UI ready`);
  }
  const httpOptions = system.config.server.options;

  // prefer env.PORT
  if ('PORT' in process.env) {
    httpOptions.port = parseInt(process.env.PORT || '');
  }

  // prefer env.HOST
  if ('HOST' in process.env) {
    httpOptions.host = process.env.HOST || '';
  }
  httpServer.listen(system.config.server.options, err => {
    if (err) throw err;
    const easyHost = [undefined, '', '::', '0.0.0.0'].includes(httpOptions.host) ? 'localhost' : httpOptions.host;
    console.log(`⭐️ Server listening on ${httpOptions.host || ''}:${httpOptions.port} (http://${easyHost}:${httpOptions.port}/)`);
  });
}

async function spawnPrisma(cwd, system, commands) {
  let output = '';
  return new Promise((resolve, reject) => {
    const p = node_child_process.spawn('node', [require.resolve('prisma'), ...commands], {
      cwd,
      env: {
        ...process.env,
        DATABASE_URL: system.config.db.url,
        PRISMA_HIDE_UPDATE_MESSAGE: '1'
      }
    });
    p.stdout.on('data', data => output += data.toString('utf-8'));
    p.stderr.on('data', data => output += data.toString('utf-8'));
    p.on('error', err => reject(err));
    p.on('exit', exitCode => resolve({
      exitCode,
      output
    }));
  });
}
async function migrateCreate(cwd, {
  frozen
}) {
  await esbuild__default["default"].build(await getEsbuildConfig(cwd));
  const system = createSystem.createSystem(await createExpressServer.importBuiltKeystoneConfiguration(cwd));
  if (frozen) {
    await createExpressServer.validateArtifacts(cwd, system);
    console.log('✨ GraphQL and Prisma schemas are up to date');
  } else {
    await createExpressServer.generateArtifacts(cwd, system);
    console.log('✨ Generated GraphQL and Prisma schemas');
  }
  await createExpressServer.generateTypes(cwd, system);
  await createExpressServer.generatePrismaClient(cwd, system);

  // TODO: remove, should be Prisma
  await fse__default["default"].outputFile(path.join(cwd, 'migrations/migration_lock.toml'), `Please do not edit this file manually
//  # It should be added in your version-control system (i.e. Git)
provider = ${system.config.db.provider}`);
  // TODO: remove, should be Prisma

  const paths = system.getPaths(cwd);
  const {
    output: summary,
    exitCode: prismaExitCode
  } = await spawnPrisma(cwd, system, ['migrate', 'diff', ...(system.config.db.shadowDatabaseUrl ? ['--shadow-database-url', system.config.db.shadowDatabaseUrl] : []), '--from-migrations', 'migrations/', '--to-schema-datamodel', paths.schema.prisma]);
  if (typeof prismaExitCode === 'number' && prismaExitCode !== 0) {
    console.error(summary);
    throw new createExpressServer.ExitError(prismaExitCode);
  }
  if (summary.startsWith('No difference detected')) {
    console.error('🔄 Database unchanged from Prisma schema');
    throw new createExpressServer.ExitError(0);
  }
  console.log(summary);
  const {
    output: sql,
    exitCode: prismaExitCode2
  } = await spawnPrisma(cwd, system, ['migrate', 'diff', ...(system.config.db.shadowDatabaseUrl ? ['--shadow-database-url', system.config.db.shadowDatabaseUrl] : []), '--from-migrations', 'migrations/', '--to-schema-datamodel', paths.schema.prisma, '--script']);
  if (typeof prismaExitCode2 === 'number' && prismaExitCode2 !== 0) {
    console.error(sql);
    throw new createExpressServer.ExitError(prismaExitCode2);
  }
  const prefix = new Date().toLocaleString('sv-SE').replace(/[^0-9]/g, '').slice(0, 14);

  // https://github.com/prisma/prisma/blob/183c14d2aa6059fc3c00c95363887e8941b3d911/packages/migrate/src/utils/promptForMigrationName.ts#L12
  //   Prisma truncates >200 characters
  const name = (await textPrompt('Name of migration')).replace(/[^A-Za-z0-9_]/g, '_').slice(0, 200);
  const path$1 = path.join(`migrations`, `${prefix}_${name}/migration.sql`);
  await fse__default["default"].outputFile(path.join(cwd, path$1), sql);
  console.log(`✨ Generated SQL migration at ${path$1}`);
}
async function migrateApply(cwd, {
  frozen
}) {
  // TODO: should this happen if frozen?
  await esbuild__default["default"].build(await getEsbuildConfig(cwd));
  const system = createSystem.createSystem(await createExpressServer.importBuiltKeystoneConfiguration(cwd));
  if (frozen) {
    await createExpressServer.validateArtifacts(cwd, system);
    console.log('✨ GraphQL and Prisma schemas are up to date');
  } else {
    await createExpressServer.generateArtifacts(cwd, system);
    console.log('✨ Generated GraphQL and Prisma schemas');
  }
  await createExpressServer.generateTypes(cwd, system);
  await createExpressServer.generatePrismaClient(cwd, system);
  console.log('✨ Applying any database migrations');
  const paths = system.getPaths(cwd);
  const {
    appliedMigrationNames
  } = await migrations.withMigrate(paths.schema.prisma, system, async m => {
    const diagnostic = await m.diagnostic();
    if (diagnostic.action.tag === 'reset') {
      console.log(diagnostic.action.reason);
      const consent = await confirmPrompt(`Do you want to continue? ${chalk__default["default"].red('All data will be lost')}`);
      if (!consent) throw new createExpressServer.ExitError(1);
      await m.reset();
    }
    return await m.apply();
  });
  console.log(appliedMigrationNames.length === 0 ? `✨ No database migrations to apply` : `✨ Database migrated`);
}

async function telemetry(cwd, command) {
  const usageText = `
    Usage
      $ keystone telemetry [command]
    Commands
      disable     opt-out of telemetry, disabling telemetry for this system user
      enable      opt-in to telemetry
      reset       resets your telemetry configuration (if any)
      status      show if telemetry is enabled, disabled or uninitialised
      inform      show an informed consent notice

For more details visit: https://keystonejs.com/telemetry
    `;
  if (command === 'disable') return disableTelemetry();
  if (command === 'enable') return enableTelemetry();
  if (command === 'reset') return resetTelemetry();
  if (command === 'status') return statusTelemetry();
  if (command === 'inform') return informTelemetry();
  if (command === '--help') {
    console.log(`${chalk.bold('Keystone Telemetry')}`);
    console.log(usageText);
    return;
  }
  console.error(command ? `Invalid option: ${command}` : '');
  console.error(usageText);
}

function defaultFlags(flags, defaults) {
  flags = {
    ...defaults,
    ...flags
  };
  for (const [key, value] of Object.entries(flags)) {
    if (value !== undefined && !(key in defaults)) {
      // TODO: maybe we should prevent other flags?
      //throw new Error(`Option '${key}' is unsupported for this command`);
      continue;
    }
    const defaultValue = defaults[key];
    // should we default the flag?
    if (value === undefined) {
      flags[key] = defaultValue;
    }
    if (typeof value !== typeof defaultValue) {
      throw new Error(`Option '${key}' should be of type ${typeof defaultValue}`);
    }
  }
  return flags;
}
async function cli(cwd, argv) {
  const {
    input,
    help,
    flags
  } = meow__default["default"](`
    Usage
      $ keystone [command] [options]

    Commands
        dev             start the project in development mode (default)
        migrate create  build the project for development and create a migration from the Prisma diff
        migrate apply   build the project for development and apply any pending migrations
        postinstall     build the project for development
        build           build the project (required by \`keystone start\` and \`keystone prisma\`)
        telemetry       sets telemetry preference (enable/disable/status)

        start           start the project
        prisma          use prisma commands in a Keystone context

    Options
      --fix (postinstall) @deprecated
        do build the graphql or prisma schemas, don't validate them

      --frozen (build, migrate)
        don't build the graphql or prisma schemas, only validate them

      --no-db-push (dev)
        don't push any updates of your Prisma schema to your database

      --no-prisma (build, dev)
        don't build or validate the prisma schema

      --no-server (dev, start)
        don't start the express server

      --no-ui (build, dev, start)
        don't build and serve the AdminUI

      --with-migrations (start)
        trigger prisma to run migrations as part of startup
    `, {
    argv
  });
  const command = input.join(' ') || 'dev';
  if (command === 'dev') {
    return dev(cwd, defaultFlags(flags, {
      dbPush: true,
      prisma: true,
      server: true,
      ui: true
    }));
  }
  if (command === 'migrate create') {
    return migrateCreate(cwd, defaultFlags(flags, {
      ui: false
    }));
  }
  if (command === 'migrate apply') {
    return migrateApply(cwd, defaultFlags(flags, {
      ui: false
    }));
  }
  if (command === 'build') {
    return build(cwd, defaultFlags(flags, {
      frozen: false,
      prisma: true,
      ui: true
    }));
  }
  if (command === 'start') {
    return start(cwd, defaultFlags(flags, {
      server: true,
      ui: true,
      withMigrations: false
    }));
  }
  if (command.startsWith('prisma')) {
    return prisma(cwd, argv.slice(1), Boolean(flags.frozen));
  }
  if (command.startsWith('telemetry')) {
    return telemetry(cwd, argv[1]);
  }

  // WARNING: postinstall is an alias for `build --frozen --no-ui`
  if (command === 'postinstall') {
    return build(cwd, {
      frozen: !defaultFlags(flags, {
        fix: false
      }).fix,
      prisma: true,
      ui: false
    });
  }
  console.log(`${command} is an unknown command`);
  console.log(help);
  throw new createExpressServer.ExitError(1);
}

exports.cli = cli;

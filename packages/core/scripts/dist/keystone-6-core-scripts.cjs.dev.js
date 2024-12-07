'use strict';

var scripts_cli_dist_keystone6CoreScriptsCli = require('../cli/dist/keystone-6-core-scripts-cli.cjs.dev.js');
var createExpressServer = require('../../dist/createExpressServer-919d7d76.cjs.dev.js');
require('meow');
require('esbuild');
require('next/dist/build');
require('node:path');
require('node:util');
require('node:fs/promises');
require('fs-extra');
require('resolve');
require('@nodelib/fs.walk');
require('path');
require('@emotion/hash');
require('graphql');
require('../../dist/admin-meta-graphql-5b647d4a.cjs.dev.js');
require('@apollo/client');
require('../../dist/createSystem-4d58fc1f.cjs.dev.js');
require('node:crypto');
require('../../access/dist/keystone-6-core-access.cjs.dev.js');
require('pluralize');
require('../../dist/next-fields-c62a31f4.cjs.dev.js');
require('decimal.js');
require('../../dist/graphql-ts-schema-73069614.cjs.dev.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('../../dist/create-admin-meta-6e822d97.cjs.dev.js');
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
require('node:url');
require('node:http');
require('chalk');
require('express');
require('next');
require('@prisma/internals');
require('../../dist/migrations-179f85e7.cjs.dev.js');
require('@prisma/migrate');
require('prompts');
require('url');
require('node:os');
require('node:https');
require('ci-info');
require('conf');
require('node:child_process');
require('http');
require('cors');
require('body-parser');
require('@apollo/server/express4');
require('@apollo/server');
require('@apollo/server/plugin/disabled');
require('@apollo/server/plugin/landingPage/default');
require('graphql-upload/graphqlUploadExpress.js');

async function main() {
  const argv = process.argv.slice(2);
  await scripts_cli_dist_keystone6CoreScriptsCli.cli(process.cwd(), argv);

  // WARNING: see https://github.com/keystonejs/keystone/pull/8788
  if (argv[0] === 'build') {
    process.exit(0);
  }
}
main().catch(err => {
  if (err instanceof createExpressServer.ExitError) return process.exit(err.code);
  console.error(err);
  process.exit(1);
});

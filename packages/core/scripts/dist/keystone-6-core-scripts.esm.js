import { cli } from '../cli/dist/keystone-6-core-scripts-cli.esm.js';
import { E as ExitError } from '../../dist/createExpressServer-3684423d.esm.js';
import 'meow';
import 'esbuild';
import 'next/dist/build';
import 'node:path';
import 'node:util';
import 'node:fs/promises';
import 'fs-extra';
import 'resolve';
import '@nodelib/fs.walk';
import 'path';
import '@emotion/hash';
import 'graphql';
import '../../dist/admin-meta-graphql-3524c137.esm.js';
import '@apollo/client';
import '../../dist/createSystem-507004a8.esm.js';
import 'node:crypto';
import '../../access/dist/keystone-6-core-access.esm.js';
import 'pluralize';
import '../../dist/next-fields-2535337e.esm.js';
import 'decimal.js';
import '../../dist/graphql-ts-schema-5ba48382.esm.js';
import '@graphql-ts/schema';
import 'graphql-upload/GraphQLUpload.js';
import '@graphql-ts/schema/api-without-context';
import '@graphql-ts/extend';
import '@graphql-ts/schema/api-with-context';
import '../../dist/create-admin-meta-164cca6b.esm.js';
import '@apollo/cache-control-types';
import 'graphql/execution/values';
import '@babel/runtime/helpers/classPrivateFieldInitSpec';
import '@babel/runtime/helpers/classPrivateFieldGet2';
import '@babel/runtime/helpers/classPrivateFieldSet2';
import 'image-size';
import 'node:fs';
import 'node:stream';
import '@aws-sdk/s3-request-presigner';
import '@aws-sdk/client-s3';
import '@aws-sdk/lib-storage';
import 'dataloader';
import 'node:url';
import 'node:http';
import 'chalk';
import 'express';
import 'next';
import '@prisma/internals';
import '../../dist/migrations-83baf5fd.esm.js';
import '@prisma/migrate';
import 'prompts';
import 'url';
import 'node:os';
import 'node:https';
import 'ci-info';
import 'conf';
import 'node:child_process';
import 'http';
import 'cors';
import 'body-parser';
import '@apollo/server/express4';
import '@apollo/server';
import '@apollo/server/plugin/disabled';
import '@apollo/server/plugin/landingPage/default';
import 'graphql-upload/graphqlUploadExpress.js';

async function main() {
  const argv = process.argv.slice(2);
  await cli(process.cwd(), argv);

  // WARNING: see https://github.com/keystonejs/keystone/pull/8788
  if (argv[0] === 'build') {
    process.exit(0);
  }
}
main().catch(err => {
  if (err instanceof ExitError) return process.exit(err.code);
  console.error(err);
  process.exit(1);
});

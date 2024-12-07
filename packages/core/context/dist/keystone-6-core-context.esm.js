import { c as createSystem } from '../../dist/createSystem-507004a8.esm.js';
import 'node:path';
import 'node:crypto';
import 'graphql';
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
import 'node:fs/promises';
import 'node:fs';
import 'node:stream';
import '@aws-sdk/s3-request-presigner';
import '@aws-sdk/client-s3';
import '@aws-sdk/lib-storage';
import 'dataloader';

function getContext(config, PrismaModule) {
  const system = createSystem(config);
  const {
    context
  } = system.getKeystone(PrismaModule);
  return context;
}

export { getContext };

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createSystem = require('../../dist/createSystem-4d58fc1f.cjs.dev.js');
require('node:path');
require('node:crypto');
require('graphql');
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
require('node:fs/promises');
require('node:fs');
require('node:stream');
require('@aws-sdk/s3-request-presigner');
require('@aws-sdk/client-s3');
require('@aws-sdk/lib-storage');
require('dataloader');

function getContext(config, PrismaModule) {
  const system = createSystem.createSystem(config);
  const {
    context
  } = system.getKeystone(PrismaModule);
  return context;
}

exports.getContext = getContext;

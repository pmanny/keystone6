'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createSystem = require('../../dist/createSystem-7551cc3e.cjs.prod.js');
require('node:path');
require('node:crypto');
require('graphql');
require('../../access/dist/keystone-6-core-access.cjs.prod.js');
require('pluralize');
require('../../dist/next-fields-d22d3935.cjs.prod.js');
require('decimal.js');
require('../../dist/graphql-ts-schema-80f16062.cjs.prod.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('../../dist/create-admin-meta-bc3ac1cf.cjs.prod.js');
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

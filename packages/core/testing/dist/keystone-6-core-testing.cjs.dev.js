'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('node:path');
var internals = require('@prisma/internals');
var migrations = require('../../dist/migrations-179f85e7.cjs.dev.js');
require('@prisma/migrate');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);

async function resetDatabase(url, prismaSchemaPath) {
  await internals.createDatabase(url, path__default["default"].dirname(prismaSchemaPath));
  await migrations.withMigrate(prismaSchemaPath, {
    config: {
      db: {
        url,
        shadowDatabaseUrl: ''
      }
    }
  }, async m => {
    await m.reset();
    await m.push(true);
  });
}

exports.resetDatabase = resetDatabase;

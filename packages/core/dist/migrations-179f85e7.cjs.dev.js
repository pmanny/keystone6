'use strict';

var internals = require('@prisma/internals');
var migrate = require('@prisma/migrate');

function setOrRemoveEnvVariable(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}
async function withMigrate(prismaSchemaPath, system, cb) {
  const migrate$1 = new migrate.Migrate(prismaSchemaPath);
  async function run(f) {
    // only required once - on child process start - but easiest to do this always
    const prevDBURLFromEnv = process.env.DATABASE_URL;
    const prevShadowDBURLFromEnv = process.env.SHADOW_DATABASE_URL;
    const prevHiddenUpdateMessage = process.env.PRISMA_HIDE_UPDATE_MESSAGE;
    try {
      process.env.DATABASE_URL = system.config.db.url;
      setOrRemoveEnvVariable('SHADOW_DATABASE_URL', system.config.db.shadowDatabaseUrl);
      process.env.PRISMA_HIDE_UPDATE_MESSAGE = '1'; // temporarily silence
      return await f();
    } finally {
      setOrRemoveEnvVariable('DATABASE_URL', prevDBURLFromEnv);
      setOrRemoveEnvVariable('SHADOW_DATABASE_URL', prevShadowDBURLFromEnv);
      setOrRemoveEnvVariable('PRISMA_HIDE_UPDATE_MESSAGE', prevHiddenUpdateMessage);
    }
  }
  try {
    return await cb({
      async apply() {
        return run(() => migrate$1.applyMigrations());
      },
      async diagnostic() {
        return run(() => migrate$1.devDiagnostic());
      },
      async push(force) {
        return run(() => migrate$1.push({
          force
        }));
      },
      async reset() {
        return run(() => migrate$1.reset());
      },
      async schema(schema, force) {
        const schemaContainer = internals.toSchemasContainer([[prismaSchemaPath, schema]]);
        return run(() => migrate$1.engine.schemaPush({
          force,
          schema: schemaContainer
        }));
      }
    });
  } finally {
    await migrate$1.engine.initPromise;
    const closePromise = new Promise(resolve => {
      migrate$1.engine.child.once('exit', resolve);
    });
    migrate$1.stop();
    await closePromise;
  }
}

exports.withMigrate = withMigrate;

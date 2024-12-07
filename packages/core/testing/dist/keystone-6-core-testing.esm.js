import path from 'node:path';
import { createDatabase } from '@prisma/internals';
import { w as withMigrate } from '../../dist/migrations-83baf5fd.esm.js';
import '@prisma/migrate';

async function resetDatabase(url, prismaSchemaPath) {
  await createDatabase(url, path.dirname(prismaSchemaPath));
  await withMigrate(prismaSchemaPath, {
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

export { resetDatabase };

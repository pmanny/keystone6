import { type System } from "./createSystem.js";
export declare function withMigrate<T>(prismaSchemaPath: string, system: {
    config: {
        db: Pick<System['config']['db'], 'url' | 'shadowDatabaseUrl'>;
    };
}, cb: (operations: {
    apply: () => Promise<any>;
    diagnostic: () => Promise<any>;
    push: (force: boolean) => Promise<any>;
    reset: () => Promise<any>;
    schema: (_: string, force: boolean) => Promise<any>;
}) => Promise<T>): Promise<T>;
//# sourceMappingURL=migrations.d.ts.map
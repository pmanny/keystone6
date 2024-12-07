import { type KeystoneConfig, type __ResolvedKeystoneConfig } from "../types/index.js";
import { type InitialisedList } from "./core/initialise-lists.js";
export declare function getBuiltKeystoneConfigurationPath(cwd: string): string;
export declare function getSystemPaths(cwd: string, config: KeystoneConfig | __ResolvedKeystoneConfig): {
    config: string;
    admin: string;
    prisma: string;
    types: {
        relativePrismaPath: string;
    };
    schema: {
        types: string;
        prisma: string;
        graphql: string;
    };
};
export declare function createSystem(config_: KeystoneConfig): {
    config: __ResolvedKeystoneConfig<import("../types/index.js").BaseKeystoneTypeInfo>;
    graphQLSchema: any;
    adminMeta: import("./create-admin-meta.js").AdminMetaRootVal;
    lists: Record<string, InitialisedList>;
    getPaths: (cwd: string) => {
        config: string;
        admin: string;
        prisma: string;
        types: {
            relativePrismaPath: string;
        };
        schema: {
            types: string;
            prisma: string;
            graphql: string;
        };
    };
    getKeystone: (PM: any) => {
        connect(): Promise<void>;
        disconnect(): Promise<void>;
        context: import("../types/index.js").KeystoneContext;
    };
};
export type System = ReturnType<typeof createSystem>;
//# sourceMappingURL=createSystem.d.ts.map
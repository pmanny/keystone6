import { type System } from "./lib/createSystem.js";
export declare function getFormattedGraphQLSchema(schema: string): string;
export declare function validateArtifacts(cwd: string, system: System): Promise<void>;
export declare function getArtifacts(system: System): Promise<{
    graphql: string;
    prisma: any;
}>;
export declare function generateArtifacts(cwd: string, system: System): Promise<{
    graphql: string;
    prisma: any;
}>;
export declare function generateTypes(cwd: string, system: System): Promise<void>;
export declare function generatePrismaClient(cwd: string, system: System): Promise<void>;
//# sourceMappingURL=artifacts.d.ts.map
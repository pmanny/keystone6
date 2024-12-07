import { type Server } from 'http';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { type KeystoneContext, type __ResolvedKeystoneConfig } from "../types/index.js";
export declare function createExpressServer(config: Pick<__ResolvedKeystoneConfig, 'graphql' | 'server' | 'storage'>, context: KeystoneContext): Promise<{
    expressServer: express.Express;
    apolloServer: ApolloServer<KeystoneContext>;
    httpServer: Server;
}>;
//# sourceMappingURL=createExpressServer.d.ts.map
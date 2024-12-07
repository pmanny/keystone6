import React from 'react';
import { type AppProps } from 'next/app';
import { type DocumentNode } from 'graphql';
import { type AdminConfig, type FieldViews } from "../../../../types/index.js";
type AppConfig = {
    adminConfig: AdminConfig;
    adminMetaHash: string;
    fieldViews: FieldViews;
    lazyMetadataQuery: DocumentNode;
    apiPath: string;
};
export declare const getApp: (props: AppConfig) => ({ Component, pageProps }: AppProps) => React.JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
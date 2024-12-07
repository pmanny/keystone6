import React, { type ReactNode } from 'react';
import { type AdminConfig, type AdminMeta, type FieldViews } from "../types/index.js";
import { type ApolloError, type DocumentNode } from "./apollo.js";
import { type AuthenticatedItem, type CreateViewFieldModes, type VisibleLists } from "./utils/useLazyMetadata.js";
type KeystoneContextType = {
    adminConfig: AdminConfig;
    adminMeta: {
        state: 'loaded';
        value: AdminMeta;
    } | {
        state: 'error';
        error: ApolloError;
        refetch: () => Promise<void>;
    };
    fieldViews: FieldViews;
    authenticatedItem: AuthenticatedItem;
    visibleLists: VisibleLists;
    createViewFieldModes: CreateViewFieldModes;
    reinitContext: () => Promise<void>;
    apiPath: string;
};
type KeystoneProviderProps = {
    children: ReactNode;
    adminConfig: AdminConfig;
    adminMetaHash: string;
    fieldViews: FieldViews;
    lazyMetadataQuery: DocumentNode;
    apiPath: string;
};
export declare function KeystoneProvider(props: KeystoneProviderProps): React.JSX.Element;
export declare function useKeystone(): {
    adminConfig: AdminConfig;
    adminMeta: AdminMeta;
    authenticatedItem: AuthenticatedItem;
    visibleLists: VisibleLists;
    createViewFieldModes: CreateViewFieldModes;
    apiPath: string;
};
export declare function useReinitContext(): () => Promise<void>;
export declare function useRawKeystone(): KeystoneContextType;
export declare function useList(listKey: string): import("../types/index.js").ListMeta;
export declare function useField(listKey: string, fieldKey: string): import("../types/index.js").FieldMeta;
export {};
//# sourceMappingURL=context.d.ts.map
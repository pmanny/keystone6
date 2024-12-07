import { type BaseFields, type BaseKeystoneTypeInfo, type BaseListTypeInfo, type KeystoneConfig, type ListConfig } from "./types/index.js";
export declare function config<TypeInfo extends BaseKeystoneTypeInfo>(config: KeystoneConfig<TypeInfo>): KeystoneConfig<TypeInfo>;
export declare function group<ListTypeInfo extends BaseListTypeInfo>(config: {
    label: string;
    description?: string;
    fields: BaseFields<ListTypeInfo>;
}): BaseFields<ListTypeInfo>;
export declare function list<ListTypeInfo extends BaseListTypeInfo>(config: ListConfig<ListTypeInfo>): {
    isSingleton?: boolean;
    fields: BaseFields<ListTypeInfo>;
    access: import("./types/index.js").ListAccessControl<ListTypeInfo>;
    ui?: import("./types/config/lists.js").ListAdminUIConfig<ListTypeInfo> | undefined;
    hooks?: import("./types/index.js").ListHooks<ListTypeInfo> | undefined;
    graphql?: import("./types/config/lists.js").ListGraphQLConfig;
    db?: import("./types/config/lists.js").ListDBConfig;
    description?: string;
    defaultIsFilterable?: boolean | ((args: import("./types/config/fields.js").FilterOrderArgs<ListTypeInfo>) => import("./types/index.js").MaybePromise<boolean>) | undefined;
    defaultIsOrderable?: boolean | ((args: import("./types/config/fields.js").FilterOrderArgs<ListTypeInfo>) => import("./types/index.js").MaybePromise<boolean>) | undefined;
};
//# sourceMappingURL=schema.d.ts.map
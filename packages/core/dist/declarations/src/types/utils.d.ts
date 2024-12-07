import { type __ResolvedKeystoneConfig } from "./index.js";
export type JSONValue = string | number | boolean | null | readonly JSONValue[] | {
    [key: string]: JSONValue;
};
export type MaybePromise<T> = T | Promise<T>;
export type GraphQLNames = ReturnType<typeof getGqlNames>;
export declare function getGqlNames({ listKey, pluralGraphQLName, }: {
    listKey: string;
    pluralGraphQLName: string;
}): {
    outputTypeName: string;
    whereInputName: string;
    whereUniqueInputName: string;
    createInputName: string;
    createMutationName: string;
    createManyMutationName: string;
    relateToOneForCreateInputName: string;
    relateToManyForCreateInputName: string;
    itemQueryName: string;
    listQueryName: string;
    listQueryCountName: string;
    listOrderName: string;
    updateInputName: string;
    updateMutationName: string;
    updateManyInputName: string;
    updateManyMutationName: string;
    relateToOneForUpdateInputName: string;
    relateToManyForUpdateInputName: string;
    deleteMutationName: string;
    deleteManyMutationName: string;
};
export declare function __getNames(listKey: string, list: __ResolvedKeystoneConfig['lists'][string]): {
    graphql: {
        names: {
            outputTypeName: string;
            whereInputName: string;
            whereUniqueInputName: string;
            createInputName: string;
            createMutationName: string;
            createManyMutationName: string;
            relateToOneForCreateInputName: string;
            relateToManyForCreateInputName: string;
            itemQueryName: string;
            listQueryName: string;
            listQueryCountName: string;
            listOrderName: string;
            updateInputName: string;
            updateMutationName: string;
            updateManyInputName: string;
            updateManyMutationName: string;
            relateToOneForUpdateInputName: string;
            relateToManyForUpdateInputName: string;
            deleteMutationName: string;
            deleteManyMutationName: string;
        };
        namePlural: string;
    };
    ui: {
        labels: {
            label: any;
            singular: string;
            plural: any;
            path: string;
        };
    };
};
//# sourceMappingURL=utils.d.ts.map
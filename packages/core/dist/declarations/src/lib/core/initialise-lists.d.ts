import { type CacheHint } from '@apollo/cache-control-types';
import { type BaseListTypeInfo, type CacheHintArgs, type GraphQLTypesForList, type __ResolvedKeystoneConfig, type MaybePromise, type NextFieldType } from "../../types/index.js";
import { type GraphQLNames } from "../../types/utils.js";
import { type ResolvedListHooks, type ResolvedFieldHooks } from "../../types/config/hooks.js";
import { type FilterOrderArgs } from "../../types/config/fields.js";
import { type MaybeItemFunction, type MaybeSessionFunction } from "../../types/config/lists.js";
import { type ResolvedFieldAccessControl, type ResolvedListAccessControl } from "./access-control.js";
import { type ResolvedDBField } from "./resolve-relationships.js";
export type InitialisedField = {
    fieldKey: string;
    access: ResolvedFieldAccessControl;
    dbField: ResolvedDBField;
    hooks: ResolvedFieldHooks<BaseListTypeInfo>;
    graphql: {
        isEnabled: {
            read: boolean;
            create: boolean;
            update: boolean;
            filter: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
            orderBy: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
        };
        isNonNull: {
            read: boolean;
            create: boolean;
            update: boolean;
        };
        cacheHint: CacheHint | undefined;
    };
    ui: {
        label: string | null;
        description: string | null;
        views: string | null;
        createView: {
            fieldMode: MaybeSessionFunction<'edit' | 'hidden', any>;
        };
        itemView: {
            fieldMode: MaybeItemFunction<'read' | 'edit' | 'hidden', any>;
            fieldPosition: MaybeItemFunction<'form' | 'sidebar', any>;
        };
        listView: {
            fieldMode: MaybeSessionFunction<'read' | 'hidden', any>;
        };
    };
} & Pick<NextFieldType, 'input' | 'output' | 'getAdminMeta' | 'views' | '__ksTelemetryFieldTypeName' | 'extraOutputFields' | 'unreferencedConcreteInterfaceImplementations'>;
export type InitialisedList = {
    listKey: string;
    access: ResolvedListAccessControl;
    fields: Record<string, InitialisedField>;
    groups: {
        fields: BaseListTypeInfo['fields'][];
        label: string;
        description: string | null;
    }[];
    hooks: ResolvedListHooks<BaseListTypeInfo>;
    /** This will include the opposites to one-sided relationships */
    resolvedDbFields: Record<string, ResolvedDBField>;
    lists: Record<string, InitialisedList>;
    graphql: {
        types: GraphQLTypesForList;
        names: GraphQLNames;
        namePlural: string;
        isEnabled: IsListEnabled;
    };
    prisma: {
        types: GraphQLNames;
        listKey: string;
        mapping: string | undefined;
        extendPrismaSchema: ((schema: string) => string) | undefined;
    };
    ui: {
        labels: {
            label: string;
            singular: string;
            plural: string;
            path: string;
        };
        labelField: string;
        searchFields: Set<string>;
        searchableFields: Map<string, 'default' | 'insensitive' | null>;
    };
    isSingleton: boolean;
    cacheHint: ((args: CacheHintArgs) => CacheHint) | undefined;
};
type IsListEnabled = {
    type: boolean;
    query: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    filter: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
    orderBy: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
};
export declare function initialiseLists(config: __ResolvedKeystoneConfig): Record<string, InitialisedList>;
export {};
//# sourceMappingURL=initialise-lists.d.ts.map
import type { CacheHint } from '@apollo/cache-control-types';
import type { FieldTypeFunc } from "../next-fields.js";
import type { BaseListTypeInfo } from "../type-info.js";
import type { KeystoneContext, MaybePromise } from "../index.js";
import type { MaybeItemFunction, MaybeSessionFunction } from "./lists.js";
import type { FieldHooks } from "./hooks.js";
import type { FieldAccessControl } from "./access-control.js";
export type BaseFields<ListTypeInfo extends BaseListTypeInfo> = {
    [key: string]: FieldTypeFunc<ListTypeInfo>;
};
export type FilterOrderArgs<ListTypeInfo extends BaseListTypeInfo> = {
    context: KeystoneContext<ListTypeInfo['all']>;
    session?: ListTypeInfo['all']['session'];
    listKey: ListTypeInfo['key'];
    fieldKey: ListTypeInfo['fields'];
};
export type CommonFieldConfig<ListTypeInfo extends BaseListTypeInfo> = {
    access?: FieldAccessControl<ListTypeInfo>;
    hooks?: FieldHooks<ListTypeInfo, ListTypeInfo['fields']>;
    label?: string;
    ui?: {
        description?: string;
        views?: string;
        createView?: {
            fieldMode?: MaybeSessionFunction<'edit' | 'hidden', ListTypeInfo>;
        };
        itemView?: {
            fieldMode?: MaybeItemFunction<'edit' | 'read' | 'hidden', ListTypeInfo>;
            fieldPosition?: MaybeItemFunction<'form' | 'sidebar', ListTypeInfo>;
        };
        listView?: {
            fieldMode?: MaybeSessionFunction<'read' | 'hidden', ListTypeInfo>;
        };
    };
    graphql?: {
        cacheHint?: CacheHint;
        isNonNull?: {
            read?: boolean;
            create?: boolean;
            update?: boolean;
        };
        omit?: boolean | {
            read?: boolean;
            create?: boolean;
            update?: boolean;
        };
    };
    isFilterable?: boolean | ((args: FilterOrderArgs<ListTypeInfo>) => MaybePromise<boolean>);
    isOrderable?: boolean | ((args: FilterOrderArgs<ListTypeInfo>) => MaybePromise<boolean>);
};
//# sourceMappingURL=fields.d.ts.map
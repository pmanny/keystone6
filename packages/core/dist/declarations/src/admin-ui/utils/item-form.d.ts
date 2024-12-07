import type { GraphQLError } from 'graphql';
import type { FieldMeta } from "../../types/index.js";
import { type ItemData } from "./serialization.js";
import type { DataGetter } from "./dataGetter.js";
export type Value = Record<string, {
    kind: 'error';
    errors: readonly [GraphQLError, ...GraphQLError[]];
} | {
    kind: 'value';
    value: any;
}>;
export declare function useChangedFieldsAndDataForUpdate(fields: Record<string, FieldMeta>, itemGetter: DataGetter<ItemData>, value: Value): {
    changedFields: ReadonlySet<string>;
    dataForUpdate: Record<string, any>;
};
//# sourceMappingURL=item-form.d.ts.map
import type { GraphQLError } from 'graphql';
import type { JSONValue, FieldMeta } from "../../types/index.js";
import type { DataGetter } from "./dataGetter.js";
export type ItemData = {
    id: string;
    [key: string]: any;
};
export type DeserializedValue = Record<string, {
    kind: 'error';
    errors: readonly [GraphQLError, ...GraphQLError[]];
} | {
    kind: 'value';
    value: any;
}>;
export declare function deserializeValue(fields: Record<string, FieldMeta>, itemGetter: DataGetter<ItemData>): DeserializedValue;
export declare function serializeValueToObjByFieldKey(fields: Record<string, FieldMeta>, value: DeserializedValue): Record<string, Record<string, JSONValue>>;
//# sourceMappingURL=serialization.d.ts.map
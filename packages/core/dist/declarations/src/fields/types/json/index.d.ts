import { type BaseListTypeInfo, type JSONValue, type FieldTypeFunc, type CommonFieldConfig } from "../../../types/index.js";
export type JsonFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    defaultValue?: JSONValue;
    db?: {
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare const json: <ListTypeInfo extends BaseListTypeInfo>({ defaultValue, ...config }?: JsonFieldConfig<ListTypeInfo>) => FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
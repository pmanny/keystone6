import { type BaseListTypeInfo, type FieldTypeFunc, type CommonFieldConfig } from "../../../types/index.js";
export type ImageFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    storage: string;
    db?: {
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function image<ListTypeInfo extends BaseListTypeInfo>(config: ImageFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
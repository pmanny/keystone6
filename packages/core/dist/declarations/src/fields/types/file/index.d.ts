import { type FieldTypeFunc, type CommonFieldConfig, type BaseListTypeInfo } from "../../../types/index.js";
export type FileFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    storage: string;
    db?: {
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function file<ListTypeInfo extends BaseListTypeInfo>(config: FileFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
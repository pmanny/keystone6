import { type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc } from "../../../types/index.js";
export type CheckboxFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    defaultValue?: boolean;
    db?: {
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function checkbox<ListTypeInfo extends BaseListTypeInfo>(config?: CheckboxFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
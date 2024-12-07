import { type BaseListTypeInfo, type FieldTypeFunc, type CommonFieldConfig } from "../../../types/index.js";
export type FloatFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    defaultValue?: number;
    isIndexed?: boolean | 'unique';
    validation?: {
        min?: number;
        max?: number;
        isRequired?: boolean;
    };
    db?: {
        isNullable?: boolean;
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function float<ListTypeInfo extends BaseListTypeInfo>(config?: FloatFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
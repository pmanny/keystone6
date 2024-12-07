import { type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc } from "../../../types/index.js";
export type IntegerFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    isIndexed?: boolean | 'unique';
    defaultValue?: number | {
        kind: 'autoincrement';
    };
    validation?: {
        isRequired?: boolean;
        min?: number;
        max?: number;
    };
    db?: {
        isNullable?: boolean;
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function integer<ListTypeInfo extends BaseListTypeInfo>(config?: IntegerFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
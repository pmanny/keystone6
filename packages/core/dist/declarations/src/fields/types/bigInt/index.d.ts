import { type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc } from "../../../types/index.js";
export type BigIntFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    isIndexed?: boolean | 'unique';
    defaultValue?: bigint | {
        kind: 'autoincrement';
    };
    validation?: {
        isRequired?: boolean;
        min?: bigint;
        max?: bigint;
    };
    db?: {
        isNullable?: boolean;
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function bigInt<ListTypeInfo extends BaseListTypeInfo>(config?: BigIntFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
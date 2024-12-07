import { type BaseListTypeInfo, type FieldTypeFunc, type CommonFieldConfig } from "../../../types/index.js";
export type TimestampFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    isIndexed?: boolean | 'unique';
    validation?: {
        isRequired?: boolean;
    };
    defaultValue?: string | {
        kind: 'now';
    };
    db?: {
        updatedAt?: boolean;
        isNullable?: boolean;
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function timestamp<ListTypeInfo extends BaseListTypeInfo>(config?: TimestampFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
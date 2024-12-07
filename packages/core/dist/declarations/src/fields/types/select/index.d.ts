import { type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc } from "../../../types/index.js";
export type SelectFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & ({
    /**
     * When a value is provided as just a string, it will be formatted in the same way
     * as field labels are to create the label.
     */
    options: readonly ({
        label: string;
        value: string;
    } | string)[];
    /**
     * If `enum` is provided on SQLite, it will use an enum in GraphQL but a string in the database.
     */
    type?: 'string' | 'enum';
    defaultValue?: string;
} | {
    options: readonly {
        label: string;
        value: number;
    }[];
    type: 'integer';
    defaultValue?: number;
}) & {
    ui?: {
        displayMode?: 'select' | 'segmented-control' | 'radio';
    };
    validation?: {
        /**
         * @default false
         */
        isRequired?: boolean;
    };
    isIndexed?: boolean | 'unique';
    db?: {
        isNullable?: boolean;
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function select<ListTypeInfo extends BaseListTypeInfo>(config: SelectFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
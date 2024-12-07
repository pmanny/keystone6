import { type BaseListTypeInfo, type FieldTypeFunc, type CommonFieldConfig } from "../../../types/index.js";
export type MultiselectFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & ({
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
    defaultValue?: readonly string[] | null;
} | {
    options: readonly {
        label: string;
        value: number;
    }[];
    type: 'integer';
    defaultValue?: readonly number[] | null;
}) & {
    db?: {
        isNullable?: boolean;
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function multiselect<ListTypeInfo extends BaseListTypeInfo>(config: MultiselectFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
import { type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc } from "../../../types/index.js";
export type CalendarDayFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    isIndexed?: boolean | 'unique';
    validation?: {
        isRequired?: boolean;
    };
    defaultValue?: string;
    db?: {
        isNullable?: boolean;
        extendPrismaSchema?: (field: string) => string;
        map?: string;
    };
};
export declare function calendarDay<ListTypeInfo extends BaseListTypeInfo>(config?: CalendarDayFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
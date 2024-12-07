import bcryptjs from 'bcryptjs';
import { type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc } from "../../../types/index.js";
export type PasswordFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    /**
     * @default 10
     */
    workFactor?: number;
    validation?: {
        isRequired?: boolean;
        rejectCommon?: boolean;
        match?: {
            regex: RegExp;
            explanation?: string;
        };
        length?: {
            /** @default 8 */
            min?: number;
            max?: number;
        };
    };
    db?: {
        isNullable?: boolean;
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
    bcrypt?: Pick<typeof bcryptjs, 'compare' | 'hash'>;
};
export declare function password<ListTypeInfo extends BaseListTypeInfo>(config?: PasswordFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=index.d.ts.map
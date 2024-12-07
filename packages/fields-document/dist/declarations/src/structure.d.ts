import { type BaseListTypeInfo, type FieldTypeFunc, type CommonFieldConfig } from '@keystone-6/core/types';
import { type ComponentSchemaForGraphQL } from "./DocumentEditor/component-blocks/api.js";
export type StructureFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    db?: {
        map?: string;
    };
    schema: ComponentSchemaForGraphQL;
};
export declare const structure: <ListTypeInfo extends BaseListTypeInfo>({ schema, ...config }: StructureFieldConfig<ListTypeInfo>) => FieldTypeFunc<ListTypeInfo>;
//# sourceMappingURL=structure.d.ts.map
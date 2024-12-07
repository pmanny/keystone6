import { type BaseItem, type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc, type KeystoneContext, type ListGraphQLTypes } from "../../../types/index.js";
import { graphql } from "../../../index.js";
type VirtualFieldGraphQLField<Item extends BaseItem, Context extends KeystoneContext> = graphql.Field<Item, any, graphql.OutputType, string, Context>;
export type VirtualFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    field: VirtualFieldGraphQLField<ListTypeInfo['item'], KeystoneContext<ListTypeInfo['all']>> | ((lists: Record<string, ListGraphQLTypes>) => VirtualFieldGraphQLField<ListTypeInfo['item'], KeystoneContext<ListTypeInfo['all']>>);
    unreferencedConcreteInterfaceImplementations?: readonly graphql.ObjectType<any>[];
    ui?: {
        /**
         * Defines what the Admin UI should fetch from this field, it's interpolated into a query like this:
         * ```graphql
         * query {
         *   item(where: { id: "..." }) {
         *     field${ui.query}
         *   }
         * }
         * ```
         *
         * This is only needed when you your field returns a GraphQL type other than a scalar(String and etc.)
         * or an enum or you need to provide arguments to the field.
         */
        query?: string;
    };
};
export declare function virtual<ListTypeInfo extends BaseListTypeInfo>({ field, ...config }: VirtualFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
export {};
//# sourceMappingURL=index.d.ts.map
import { graphql } from "./schema/index.js";
import { type DatabaseProvider, type FieldTypeWithoutDBField, type ScalarDBField } from "./index.js";
export declare function jsonFieldTypePolyfilledForSQLite<CreateArg extends graphql.Arg<graphql.InputType, any>, UpdateArg extends graphql.Arg<graphql.InputType, any>>(provider: DatabaseProvider, config: FieldTypeWithoutDBField<ScalarDBField<'Json', 'optional'>, CreateArg, UpdateArg, graphql.Arg<graphql.NullableInputType, false>, graphql.Arg<graphql.NullableInputType, false>> & {
    input?: {
        uniqueWhere?: undefined;
        orderBy?: undefined;
    };
}, dbFieldConfig?: {
    map?: string;
    mode?: 'required' | 'optional';
    default?: ScalarDBField<'Json', 'optional'>['default'];
    extendPrismaSchema?: (field: string) => string;
}): import("./next-fields.js").NextFieldType<{
    kind: "scalar";
    mode: "required" | "optional";
    scalar: "String";
    default: {
        kind: "literal";
        value: string;
    } | {
        kind: "dbgenerated";
        value: string;
    } | undefined;
    map: string | undefined;
    extendPrismaSchema: ((field: string) => string) | undefined;
}, any, UpdateArg, graphql.Arg<graphql.NullableInputType, false>, graphql.Arg<graphql.NullableInputType, false>, graphql.Arg<graphql.NullableInputType, false>, import("./type-info.js").BaseListTypeInfo> | import("./next-fields.js").NextFieldType<{
    kind: "scalar";
    mode: "optional";
    scalar: "Json";
    default: {
        kind: "literal";
        value: string;
    } | {
        kind: "dbgenerated";
        value: string;
    } | undefined;
    map: string | undefined;
    extendPrismaSchema: ((field: string) => string) | undefined;
}, CreateArg, UpdateArg, graphql.Arg<graphql.NullableInputType, false>, graphql.Arg<graphql.NullableInputType, false>, graphql.Arg<graphql.NullableInputType, false>, import("./type-info.js").BaseListTypeInfo>;
//# sourceMappingURL=json-field-type-polyfill-for-sqlite.d.ts.map
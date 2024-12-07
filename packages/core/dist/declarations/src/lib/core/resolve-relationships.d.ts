import { type DBField, type MultiDBField, type NoDBField, type ScalarishDBField } from "../../types/index.js";
type BaseResolvedRelationDBField = {
    kind: 'relation';
    list: string;
    field: string;
    relationName: string;
    extendPrismaSchema?: (field: string) => string;
};
export type ResolvedRelationDBField = (BaseResolvedRelationDBField & {
    mode: 'many';
}) | (BaseResolvedRelationDBField & {
    mode: 'one';
    foreignIdField: {
        kind: 'none';
    } | {
        kind: 'owned' | 'owned-unique';
        map: string;
    };
});
export type ListsWithResolvedRelations = Record<string, FieldsWithResolvedRelations>;
export type ResolvedDBField = ResolvedRelationDBField | ScalarishDBField | NoDBField | MultiDBField<Record<string, ScalarishDBField>>;
type FieldsWithResolvedRelations = Record<string, ResolvedDBField>;
export declare function resolveRelationships(lists: Record<string, {
    fields: Record<string, {
        dbField: DBField;
    }>;
    isSingleton: boolean;
}>): ListsWithResolvedRelations;
export {};
//# sourceMappingURL=resolve-relationships.d.ts.map
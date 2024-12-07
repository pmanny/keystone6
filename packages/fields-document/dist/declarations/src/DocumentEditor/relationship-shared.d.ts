import { type Editor } from 'slate';
export type Relationships = Record<string, {
    listKey: string;
    /** GraphQL fields to select when querying the field */
    selection: string | null;
    label: string;
}>;
export declare function withRelationship(editor: Editor): Editor;
//# sourceMappingURL=relationship-shared.d.ts.map
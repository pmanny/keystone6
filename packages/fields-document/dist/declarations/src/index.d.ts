import { type BaseListTypeInfo, type CommonFieldConfig, type FieldTypeFunc } from '@keystone-6/core/types';
import { type ComponentBlock } from "./DocumentEditor/component-blocks/api-shared.js";
type RelationshipsConfig = Record<string, {
    listKey: string;
    /** GraphQL fields to select when querying the field */
    selection?: string;
    label: string;
}>;
type FormattingConfig = {
    inlineMarks?: true | {
        bold?: true;
        italic?: true;
        underline?: true;
        strikethrough?: true;
        code?: true;
        superscript?: true;
        subscript?: true;
        keyboard?: true;
    };
    listTypes?: true | {
        ordered?: true;
        unordered?: true;
    };
    alignment?: true | {
        center?: true;
        end?: true;
    };
    headingLevels?: true | readonly (1 | 2 | 3 | 4 | 5 | 6)[];
    blockTypes?: true | {
        blockquote?: true;
        code?: true;
    };
    softBreaks?: true;
};
export type DocumentFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    relationships?: RelationshipsConfig;
    componentBlocks?: Record<string, ComponentBlock>;
    formatting?: true | FormattingConfig;
    links?: true;
    dividers?: true;
    layouts?: readonly (readonly [number, ...number[]])[];
    db?: {
        map?: string;
        extendPrismaSchema?: (field: string) => string;
    };
};
export declare function document<ListTypeInfo extends BaseListTypeInfo>({ componentBlocks, dividers, formatting, layouts, relationships: configRelationships, links, ...config }?: DocumentFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
export { structure } from "./structure.js";
//# sourceMappingURL=index.d.ts.map
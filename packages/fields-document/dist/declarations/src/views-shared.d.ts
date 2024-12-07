import { type FieldController, type FieldControllerConfig } from '@keystone-6/core/types';
import { type Descendant } from 'slate';
import { type ComponentBlock } from "./DocumentEditor/component-blocks/api-shared.js";
import { type Relationships } from "./DocumentEditor/relationship-shared.js";
export type DocumentFeatures = {
    formatting: {
        inlineMarks: {
            bold: boolean;
            italic: boolean;
            underline: boolean;
            strikethrough: boolean;
            code: boolean;
            superscript: boolean;
            subscript: boolean;
            keyboard: boolean;
        };
        listTypes: {
            ordered: boolean;
            unordered: boolean;
        };
        alignment: {
            center: boolean;
            end: boolean;
        };
        headingLevels: (1 | 2 | 3 | 4 | 5 | 6)[];
        blockTypes: {
            blockquote: boolean;
            code: boolean;
        };
        softBreaks: boolean;
    };
    links: boolean;
    dividers: boolean;
    layouts: [number, ...number[]][];
};
export declare function controller(config: FieldControllerConfig<{
    relationships: Relationships;
    documentFeatures: DocumentFeatures;
    componentBlocksPassedOnServer: string[];
}>): FieldController<Descendant[]> & {
    componentBlocks: Record<string, ComponentBlock>;
    relationships: Relationships;
    documentFeatures: DocumentFeatures;
};
//# sourceMappingURL=views-shared.d.ts.map
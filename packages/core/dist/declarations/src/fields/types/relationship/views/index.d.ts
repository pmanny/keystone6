/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
export declare const Field: ({ field, value, itemValue, autoFocus, onChange, forceValidation, }: FieldProps<typeof controller>) => JSX.Element;
export declare const Cell: CellComponent<typeof controller>;
export declare const CardValue: CardValueComponent<typeof controller>;
type SingleRelationshipValue = {
    kind: 'one';
    id: null | string;
    initialValue: {
        label: string;
        id: string;
    } | null;
    value: {
        label: string;
        id: string;
    } | null;
};
type ManyRelationshipValue = {
    kind: 'many';
    id: null | string;
    initialValue: {
        label: string;
        id: string;
    }[];
    value: {
        label: string;
        id: string;
    }[];
};
type CardsRelationshipValue = {
    kind: 'cards-view';
    id: null | string;
    itemsBeingEdited: ReadonlySet<string>;
    itemBeingCreated: boolean;
    initialIds: ReadonlySet<string>;
    currentIds: ReadonlySet<string>;
    displayOptions: CardsDisplayModeOptions;
};
type CountRelationshipValue = {
    kind: 'count';
    id: null | string;
    count: number;
};
type CardsDisplayModeOptions = {
    cardFields: readonly string[];
    linkToItem: boolean;
    removeMode: 'disconnect' | 'none';
    inlineCreate: {
        fields: readonly string[];
    } | null;
    inlineEdit: {
        fields: readonly string[];
    } | null;
    inlineConnect: boolean;
};
type RelationshipController = FieldController<ManyRelationshipValue | SingleRelationshipValue | CardsRelationshipValue | CountRelationshipValue, string> & {
    display: 'count' | 'cards-or-select';
    listKey: string;
    refListKey: string;
    refFieldKey?: string;
    refLabelField: string;
    refSearchFields: string[];
    hideCreate: boolean;
    many: boolean;
};
export declare function controller(config: FieldControllerConfig<{
    refFieldKey?: string;
    refListKey: string;
    many: boolean;
    hideCreate: boolean;
    refLabelField: string;
    refSearchFields: string[];
} & ({
    displayMode: 'select';
} | {
    displayMode: 'cards';
    cardFields: readonly string[];
    linkToItem: boolean;
    removeMode: 'disconnect' | 'none';
    inlineCreate: {
        fields: readonly string[];
    } | null;
    inlineEdit: {
        fields: readonly string[];
    } | null;
    inlineConnect: boolean;
} | {
    displayMode: 'count';
})>): RelationshipController;
export {};
//# sourceMappingURL=index.d.ts.map
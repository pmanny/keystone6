import { type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { type ArrayField, type BlockFormattingConfig, type ChildField, type ComponentBlock, type ComponentSchema, type ConditionalField, type FormField, type FormFieldWithGraphQLField, type GenericPreviewProps, type InlineMarksConfig, type ObjectField, type RelationshipField } from "./api-shared.js";
export * from "./api-shared.js";
export declare const fields: {
    text({ label, defaultValue, }: {
        label: string;
        defaultValue?: string;
    }): FormFieldWithGraphQLField<string, undefined>;
    integer({ label, defaultValue, }: {
        label: string;
        defaultValue?: number;
    }): FormFieldWithGraphQLField<number, undefined>;
    url({ label, defaultValue, }: {
        label: string;
        defaultValue?: string;
    }): FormFieldWithGraphQLField<string, undefined>;
    select<Option extends {
        label: string;
        value: string;
    }>({ label, options, defaultValue, }: {
        label: string;
        options: readonly Option[];
        defaultValue: Option["value"];
    }): FormFieldWithGraphQLField<Option["value"], readonly Option[]>;
    multiselect<Option extends {
        label: string;
        value: string;
    }>({ label, options, defaultValue, }: {
        label: string;
        options: readonly Option[];
        defaultValue: readonly Option["value"][];
    }): FormFieldWithGraphQLField<readonly Option["value"][], readonly Option[]>;
    checkbox({ label, defaultValue, }: {
        label: string;
        defaultValue?: boolean;
    }): FormFieldWithGraphQLField<boolean, undefined>;
    empty(): FormField<null, undefined>;
    child(options: {
        kind: "block";
        placeholder: string;
        formatting?: BlockFormattingConfig | "inherit";
        dividers?: "inherit";
        links?: "inherit";
        relationships?: "inherit";
    } | {
        kind: "inline";
        placeholder: string;
        formatting?: "inherit" | {
            inlineMarks?: InlineMarksConfig;
            softBreaks?: "inherit";
        };
        links?: "inherit";
        relationships?: "inherit";
    }): ChildField;
    object<Fields extends Record<string, ComponentSchema>>(fields: Fields): ObjectField<Fields>;
    conditional<DiscriminantField extends FormField<string | boolean, any>, ConditionalValues extends { [Key in `${DiscriminantField["defaultValue"]}`]: ComponentSchema; }>(discriminant: DiscriminantField, values: ConditionalValues): ConditionalField<DiscriminantField, ConditionalValues>;
    relationship<Many extends boolean | undefined = false>({ listKey, selection, label, many, }: {
        listKey: string;
        label: string;
        selection?: string;
    } & (Many extends undefined | false ? {
        many?: Many;
    } : {
        many: Many;
    })): RelationshipField<Many extends true ? true : false>;
    array<ElementField extends ComponentSchema>(element: ElementField, opts?: {
        itemLabel?: (props: GenericPreviewProps<ElementField, unknown>) => string;
        label?: string;
    }): ArrayField<ElementField>;
};
export type PreviewProps<Schema extends ComponentSchema> = GenericPreviewProps<Schema, ReactNode>;
export type PreviewPropsForToolbar<Schema extends ComponentSchema> = GenericPreviewProps<Schema, undefined>;
export declare function component<Schema extends {
    [Key in any]: ComponentSchema;
}>(options: {
    /** The preview component shown in the editor */
    preview: (props: PreviewProps<ObjectField<Schema>>) => ReactElement | null;
    /** The schema for the props that the preview component, toolbar and rendered component will receive */
    schema: Schema;
    /** The label to show in the insert menu and chrome around the block if chromeless is false */
    label: string;
} & ({
    chromeless: true;
    toolbar?: (props: {
        props: PreviewPropsForToolbar<ObjectField<Schema>>;
        onRemove(): void;
    }) => ReactElement;
} | {
    chromeless?: false;
    toolbar?: (props: {
        props: PreviewPropsForToolbar<ObjectField<Schema>>;
        onShowEditMode(): void;
        onRemove(): void;
    }) => ReactElement;
})): ComponentBlock<Schema>;
export declare const NotEditable: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => JSX.Element;
//# sourceMappingURL=api.d.ts.map
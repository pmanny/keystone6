import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
export declare const Field: ({ field, value, onChange, autoFocus, forceValidation, }: FieldProps<typeof controller>) => JSX.Element;
export declare const Cell: CellComponent<typeof controller>;
export declare const CardValue: CardValueComponent<typeof controller>;
export type AdminSelectFieldMeta = {
    options: readonly {
        label: string;
        value: string | number;
    }[];
    type: 'string' | 'integer' | 'enum';
    displayMode: 'select' | 'segmented-control' | 'radio';
    isRequired: boolean;
    defaultValue: string | number | null;
};
type Config = FieldControllerConfig<AdminSelectFieldMeta>;
type Option = {
    label: string;
    value: string;
};
type Value = {
    value: Option | null;
    kind: 'create';
} | {
    value: Option | null;
    initial: Option | null;
    kind: 'update';
};
export declare const controller: (config: Config) => FieldController<Value, Option[]> & {
    options: Option[];
    type: "string" | "integer" | "enum";
    displayMode: "select" | "segmented-control" | "radio";
    isRequired: boolean;
};
export {};
//# sourceMappingURL=index.d.ts.map
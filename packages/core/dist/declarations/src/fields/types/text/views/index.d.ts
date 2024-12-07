import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
import { type TextFieldMeta } from "../index.js";
export declare function Field({ field, value, onChange, autoFocus, forceValidation, }: FieldProps<typeof controller>): JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
type Config = FieldControllerConfig<TextFieldMeta>;
type Validation = {
    isRequired: boolean;
    match: {
        regex: RegExp;
        explanation: string | null;
    } | null;
    length: {
        min: number | null;
        max: number | null;
    };
};
type InnerTextValue = {
    kind: 'null';
    prev: string;
} | {
    kind: 'value';
    value: string;
};
type TextValue = {
    kind: 'create';
    inner: InnerTextValue;
} | {
    kind: 'update';
    inner: InnerTextValue;
    initial: InnerTextValue;
};
export declare const controller: (config: Config) => FieldController<TextValue, string> & {
    displayMode: "input" | "textarea";
    validation: Validation;
    isNullable: boolean;
};
export {};
//# sourceMappingURL=index.d.ts.map
/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
type Validation = {
    min?: number;
    max?: number;
    isRequired?: boolean;
};
type Value = {
    kind: 'update';
    initial: number | null;
    value: string | number | null;
} | {
    kind: 'create';
    value: string | number | null;
};
export declare const Field: ({ field, value, onChange, autoFocus, forceValidation, }: FieldProps<typeof controller>) => JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
export declare const controller: (config: FieldControllerConfig<{
    validation: Validation;
    defaultValue: number | null;
}>) => FieldController<Value, string> & {
    validation: Validation;
};
export {};
//# sourceMappingURL=index.d.ts.map
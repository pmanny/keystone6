/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
type Validation = {
    isRequired: boolean;
    min: bigint;
    max: bigint;
};
type Value = {
    kind: 'create';
    value: string | bigint | null;
} | {
    kind: 'update';
    value: string | bigint | null;
    initial: unknown | null;
};
export declare const Field: ({ field, value, onChange, autoFocus, forceValidation, }: FieldProps<typeof controller>) => JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
export declare const controller: (config: FieldControllerConfig<{
    validation: {
        isRequired: boolean;
        min: string;
        max: string;
    };
    defaultValue: string | null | {
        kind: "autoincrement";
    };
}>) => FieldController<Value, string> & {
    validation: Validation;
    hasAutoIncrementDefault: boolean;
};
export {};
//# sourceMappingURL=index.d.ts.map
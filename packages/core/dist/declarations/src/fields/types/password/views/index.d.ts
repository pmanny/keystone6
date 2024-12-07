/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
export declare function Field({ field, value, onChange, forceValidation, autoFocus, }: FieldProps<typeof controller>): JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
type Validation = {
    isRequired: boolean;
    rejectCommon: boolean;
    match: {
        regex: RegExp;
        explanation: string;
    } | null;
    length: {
        min: number;
        max: number | null;
    };
};
export type PasswordFieldMeta = {
    isNullable: boolean;
    validation: {
        isRequired: boolean;
        rejectCommon: boolean;
        match: {
            regex: {
                source: string;
                flags: string;
            };
            explanation: string;
        } | null;
        length: {
            min: number;
            max: number | null;
        };
    };
};
type Value = {
    kind: 'initial';
    isSet: boolean | null;
} | {
    kind: 'editing';
    isSet: boolean | null;
    value: string;
    confirm: string;
};
type PasswordController = FieldController<Value, boolean> & {
    validation: Validation;
};
export declare const controller: (config: FieldControllerConfig<PasswordFieldMeta>) => PasswordController;
export {};
//# sourceMappingURL=index.d.ts.map
/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
export declare function Field({ field, value, onChange, autoFocus }: FieldProps<typeof controller>): JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
type CheckboxController = FieldController<boolean, boolean>;
export declare const controller: (config: FieldControllerConfig<{
    defaultValue: boolean;
}>) => CheckboxController;
export {};
//# sourceMappingURL=index.d.ts.map
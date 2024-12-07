/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps, type JSONValue } from "../../../../types/index.js";
export declare const Field: ({ field, forceValidation, value, onChange, autoFocus, }: FieldProps<typeof controller>) => JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
type Config = FieldControllerConfig<{
    defaultValue: JSONValue;
}>;
export declare const controller: (config: Config) => FieldController<string, string>;
export {};
//# sourceMappingURL=index.d.ts.map
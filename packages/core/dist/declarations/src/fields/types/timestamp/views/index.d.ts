import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from "../../../../types/index.js";
import { type Value } from "./utils.js";
export declare const Field: ({ field, value, onChange, forceValidation, }: FieldProps<typeof controller>) => JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
export type TimestampFieldMeta = {
    defaultValue: string | {
        kind: 'now';
    } | null;
    updatedAt: boolean;
    isRequired: boolean;
};
export declare const controller: (config: FieldControllerConfig<TimestampFieldMeta>) => FieldController<Value, string> & {
    fieldMeta: TimestampFieldMeta;
};
//# sourceMappingURL=index.d.ts.map
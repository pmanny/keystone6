import { type FieldProps } from "../../../../types/index.js";
import { type controller } from "./index.js";
export declare function Field({ autoFocus, field, value, onChange, }: FieldProps<typeof controller>): JSX.Element;
export declare function validateFile({ validity }: {
    validity: ValidityState;
}): string | undefined;
//# sourceMappingURL=Field.d.ts.map
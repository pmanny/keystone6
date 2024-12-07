/** @jsxRuntime classic */
/** @jsx jsx */
import { type FieldProps } from '@keystone-6/core/types';
import { type controller } from "./index.js";
export declare function Field({ autoFocus, field, value, onChange, }: FieldProps<typeof controller>): JSX.Element;
export declare function validateImage({ file, validity, }: {
    file: File;
    validity: ValidityState;
}): string | undefined;
//# sourceMappingURL=Field.d.ts.map
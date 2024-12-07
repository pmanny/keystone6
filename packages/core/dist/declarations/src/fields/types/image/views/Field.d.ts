/** @jsxRuntime classic */
/** @jsx jsx */
import { type ReactNode } from 'react';
import { type FieldProps } from "../../../../types/index.js";
import { type controller } from "./index.js";
export declare function Field({ autoFocus, field, value, onChange, }: FieldProps<typeof controller>): JSX.Element;
export declare function validateImage({ file, validity, }: {
    file: File;
    validity: ValidityState;
}): string | undefined;
export declare const ImageMeta: ({ width, height, size, }: {
    width?: number;
    height?: number;
    size: number;
}) => JSX.Element;
export declare const ImageWrapper: ({ children, url }: {
    children: ReactNode;
    url?: string;
}) => JSX.Element;
export declare const Placeholder: () => JSX.Element;
//# sourceMappingURL=Field.d.ts.map
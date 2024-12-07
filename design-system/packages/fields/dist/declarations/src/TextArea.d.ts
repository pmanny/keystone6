/** @jsxRuntime classic */
/** @jsx jsx */
import { type InputHTMLAttributes } from 'react';
import type { SizeType, WidthType } from "./types.js";
type InputProps = InputHTMLAttributes<HTMLTextAreaElement>;
export type TextAreaProps = {
    invalid?: boolean;
    size?: SizeType;
    width?: WidthType;
    onChange?: NonNullable<InputProps['onChange']>;
    value?: NonNullable<InputProps['value']>;
} & Omit<InputProps, 'onChange' | 'size' | 'value'>;
export declare const TextArea: import("react").ForwardRefExoticComponent<{
    invalid?: boolean;
    size?: SizeType;
    width?: WidthType;
    onChange?: NonNullable<InputProps["onChange"]>;
    value?: NonNullable<InputProps["value"]>;
} & Omit<InputProps, "value" | "onChange" | "size"> & import("react").RefAttributes<HTMLTextAreaElement>>;
export {};
//# sourceMappingURL=TextArea.d.ts.map
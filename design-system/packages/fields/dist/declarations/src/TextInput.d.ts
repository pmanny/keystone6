/** @jsxRuntime classic */
/** @jsx jsx */
/**
 * TODO
 *
 * - Support icons in the input (search, etc)
 */
import { type InputHTMLAttributes } from 'react';
import type { ShapeType, SizeType, WidthType } from "./types.js";
declare const validTypes: {
    email: string;
    number: string;
    password: string;
    search: string;
    tel: string;
    text: string;
    url: string;
};
type InputProps = InputHTMLAttributes<HTMLInputElement>;
export type TextInputProps = {
    invalid?: boolean;
    shape?: ShapeType;
    size?: SizeType;
    width?: WidthType;
    type?: keyof typeof validTypes;
    onChange?: NonNullable<InputProps['onChange']>;
    value?: NonNullable<InputProps['value']>;
} & Omit<InputProps, 'onChange' | 'type' | 'size' | 'value'>;
export declare const TextInput: import("react").ForwardRefExoticComponent<{
    invalid?: boolean;
    shape?: ShapeType;
    size?: SizeType;
    width?: WidthType;
    type?: keyof typeof validTypes;
    onChange?: NonNullable<InputProps["onChange"]>;
    value?: NonNullable<InputProps["value"]>;
} & Omit<InputProps, "type" | "value" | "onChange" | "size"> & import("react").RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=TextInput.d.ts.map
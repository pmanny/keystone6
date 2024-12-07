/** @jsxRuntime classic */
/** @jsx jsx */
import { type InputHTMLAttributes, type ReactNode } from 'react';
import type { SizeType } from "./types.js";
export declare const Checkbox: import("react").ForwardRefExoticComponent<{
    /** The checkbox label content. */
    children: ReactNode;
} & {
    /** When true, the checkbox will be checked. */
    checked?: boolean;
    /** When true, the checkbox will be disabled. */
    disabled?: boolean;
    /** The size of the Checkbox */
    size?: SizeType;
    /** The value of the Checkbox. */
    value?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & import("react").RefAttributes<HTMLInputElement>>;
export declare const CheckboxControl: import("react").ForwardRefExoticComponent<{
    /** When true, the checkbox will be checked. */
    checked?: boolean;
    /** When true, the checkbox will be disabled. */
    disabled?: boolean;
    /** The size of the Checkbox */
    size?: SizeType;
    /** The value of the Checkbox. */
    value?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & import("react").RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Checkbox.d.ts.map
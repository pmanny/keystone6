/** @jsxRuntime classic */
/** @jsx jsx */
import { type InputHTMLAttributes, type ReactNode } from 'react';
import type { SizeType } from "./types.js";
export declare const Radio: import("react").ForwardRefExoticComponent<{
    /** The radio label content. */
    children: ReactNode;
} & {
    /** When true, the radio will be checked. */
    checked?: boolean;
    /** When true, the radio will be disabled. */
    disabled?: boolean;
    /** The size of the Radio */
    size?: SizeType;
    /** The value of the Radio. */
    value?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & import("react").RefAttributes<HTMLInputElement>>;
export declare const RadioControl: import("react").ForwardRefExoticComponent<{
    /** When true, the radio will be checked. */
    checked?: boolean;
    /** When true, the radio will be disabled. */
    disabled?: boolean;
    /** The size of the Radio */
    size?: SizeType;
    /** The value of the Radio. */
    value?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & import("react").RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Radio.d.ts.map
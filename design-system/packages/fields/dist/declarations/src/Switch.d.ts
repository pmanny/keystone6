/** @jsxRuntime classic */
/** @jsx jsx */
/**
 * TODO:
 *
 * - This component needs to be brought into line with either buttons (including support for tones)
 *   or better represented in the theme.
 * - Needs proper tokens and styling functions
 * - Needs size support
 * - Needs focus support
 * - Needs disabled support
 * - Needs a label wrapper like radio and checkbox
 * - Should this be stateful like a checkbox? check react-aria
 */
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
export declare const Switch: import("react").ForwardRefExoticComponent<{
    /** The switch label content. */
    children: ReactNode;
} & {
    /** Optionally pass in "On" and "Off" label text for screen readers */
    a11yLabels?: {
        on: string;
        off: string;
    };
    /** The current checked state. */
    checked?: boolean;
    /** Handle change events. */
    onChange?: (checked: boolean) => void;
} & Omit<ButtonProps, "onChange"> & import("react").RefAttributes<HTMLButtonElement>>;
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export declare const SwitchControl: import("react").ForwardRefExoticComponent<{
    /** Optionally pass in "On" and "Off" label text for screen readers */
    a11yLabels?: {
        on: string;
        off: string;
    };
    /** The current checked state. */
    checked?: boolean;
    /** Handle change events. */
    onChange?: (checked: boolean) => void;
} & Omit<ButtonProps, "onChange"> & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Switch.d.ts.map
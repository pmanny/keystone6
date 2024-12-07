/** @jsxRuntime classic */
/** @jsx jsx */
import { type ReactNode } from 'react';
import { type ToastPropsExact } from "./types.js";
export declare function ToastProvider({ children }: {
    children: ReactNode;
}): JSX.Element;
export declare const ToastElement: import("react").ForwardRefExoticComponent<{
    onDismiss: () => void;
} & Omit<ToastPropsExact, "id"> & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Toast.d.ts.map
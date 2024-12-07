/** @jsxRuntime classic */
/** @jsx jsx */
import { type MutableRefObject, type ReactNode } from 'react';
import { type TransitionState } from "./types.js";
export declare const DRAWER_WIDTHS: {
    narrow: number;
    wide: number;
};
export type WidthType = keyof typeof DRAWER_WIDTHS;
export type DrawerBaseProps = {
    children: ReactNode;
    initialFocusRef?: MutableRefObject<any>;
    onClose: () => void;
    transitionState: TransitionState;
    onSubmit?: () => void;
    width?: WidthType;
};
export declare const DrawerBase: ({ children, initialFocusRef, onClose, onSubmit, width, transitionState, ...props }: DrawerBaseProps) => JSX.Element;
//# sourceMappingURL=DrawerBase.d.ts.map
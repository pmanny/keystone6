/** @jsxRuntime classic */
/** @jsx jsx */
import { type MutableRefObject, type ReactNode } from 'react';
import { type WidthType } from "./DrawerBase.js";
import { type ActionsType } from "./types.js";
type DrawerProps = {
    actions: ActionsType;
    children: ReactNode;
    id?: string;
    initialFocusRef?: MutableRefObject<any>;
    title: string;
    width?: WidthType;
};
export declare const Drawer: ({ actions, children, title, id, initialFocusRef, width, }: DrawerProps) => JSX.Element;
export {};
//# sourceMappingURL=Drawer.d.ts.map
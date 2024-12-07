import React, { type ReactNode } from 'react';
import { type TransitionState } from "./types.js";
type DrawerControllerProps = {
    isOpen: boolean;
    children: ReactNode;
};
export declare const DrawerControllerContextProvider: React.Provider<TransitionState | null>;
export declare const useDrawerControllerContext: () => TransitionState;
export declare const DrawerController: ({ isOpen, children }: DrawerControllerProps) => React.JSX.Element;
export {};
//# sourceMappingURL=DrawerController.d.ts.map
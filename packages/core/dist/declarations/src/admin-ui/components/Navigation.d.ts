/** @jsxRuntime classic */
/** @jsx jsx */
import { type ReactNode } from 'react';
import { type NavigationProps, type ListMeta } from "../../types/index.js";
type NavItemProps = {
    href: string;
    children: ReactNode;
    isSelected?: boolean;
};
export declare const NavItem: ({ href, children, isSelected: _isSelected }: NavItemProps) => JSX.Element;
export type NavigationContainerProps = Partial<Pick<NavigationProps, 'authenticatedItem'>> & {
    children: ReactNode;
};
export declare const NavigationContainer: ({ authenticatedItem, children }: NavigationContainerProps) => JSX.Element;
export declare const ListNavItem: ({ list }: {
    list: ListMeta;
}) => JSX.Element;
type NavItemsProps = Pick<NavigationProps, 'lists'> & {
    include?: string[];
};
export declare const ListNavItems: ({ lists, include }: NavItemsProps) => JSX.Element;
export declare function Navigation(): JSX.Element | null;
export {};
//# sourceMappingURL=Navigation.d.ts.map
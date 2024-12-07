/** @jsxRuntime classic */
/** @jsx jsx */
import { type SVGAttributes, type ReactNode } from 'react';
import { type ResponsiveProp } from '@keystone-ui/core';
export type IconProps = SVGAttributes<SVGSVGElement> & {
    /** The color for the SVG fill property. */
    color?: string;
    /** The size key for the icon. */
    size?: ResponsiveProp<keyof typeof sizeMap> | number;
};
declare const sizeMap: {
    small: number;
    smallish: number;
    medium: number;
    largish: number;
    large: number;
};
export declare const createIcon: (children: ReactNode, name: string) => import("react").ForwardRefExoticComponent<SVGAttributes<SVGSVGElement> & {
    /** The color for the SVG fill property. */
    color?: string;
    /** The size key for the icon. */
    size?: ResponsiveProp<keyof typeof sizeMap> | number;
} & import("react").RefAttributes<SVGSVGElement>>;
export {};
//# sourceMappingURL=Icon.d.ts.map
/** @jsxRuntime classic */
/** @jsx jsx */
import { type ResponsiveProp, type Theme } from "../types.js";
import { type MarginProps } from "./Box.js";
type ColorType = ResponsiveProp<keyof Theme['palette']>;
declare const orientationMap: {
    horizontal: string;
    vertical: string;
};
type DividerProps = {
    children?: never;
    color?: ColorType;
    orientation?: keyof typeof orientationMap;
    className?: string;
} & MarginProps;
export declare const Divider: ({ orientation, color, ...props }: DividerProps) => JSX.Element;
export {};
//# sourceMappingURL=Divider.d.ts.map
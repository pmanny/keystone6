/** @jsxRuntime classic */
/** @jsx jsx */
import { type ReactNode } from 'react';
import { type Theme } from "../types.js";
import { type BoxProps } from "./Box.js";
declare const alignment: {
    center: string;
    end: string;
    start: string;
    stretch: string;
};
export type StackProps = {
    /** The value of the "align-items" property. */
    align?: keyof typeof alignment;
    /** Each element in the stack. */
    children: ReactNode;
    /** Causes items in the stack to be oriented horizontally, instead of vertically */
    across?: boolean;
    /** The placement, if any, of the dividing elements. */
    dividers?: 'none' | 'around' | 'between' | 'start' | 'end';
    /** The size of the gap between each element in the stack. */
    gap?: keyof Theme['spacing'];
} & BoxProps;
export declare const Stack: <Comp extends import("react").ElementType = "div">(props: {
    as?: Comp | undefined;
    ref?: import("react").Ref<Comp extends "symbol" | "switch" | "text" | "filter" | "svg" | "animate" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feDropShadow" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "set" | "stop" | "textPath" | "tspan" | "use" | "view" | keyof HTMLElementTagNameMap ? (HTMLElementTagNameMap & Pick<SVGElementTagNameMap, "symbol" | "switch" | "text" | "filter" | "svg" | "animate" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feDropShadow" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "set" | "stop" | "textPath" | "tspan" | "use" | "view">)[Comp] : Comp extends new (...args: any) => any ? InstanceType<Comp> : undefined> | undefined;
} & Omit<import("react").PropsWithoutRef<import("react").ComponentProps<Comp>>, "children" | "as" | "align" | keyof import("./Box.js").ColorProps | keyof import("./Box.js").RadiiProps | keyof import("./Box.js").MarginProps | keyof import("./Box.js").PaddingProps | keyof {
    textAlign?: ("center" | "end" | "justify" | "left" | "right" | "start") | readonly (("center" | "end" | "justify" | "left" | "right" | "start") | null)[];
    height?: import("../types.js").ResponsiveProp<string | number>;
    width?: import("../types.js").ResponsiveProp<string | number>;
} | "gap" | "across" | "dividers"> & {
    /** The value of the "align-items" property. */
    align?: keyof typeof alignment;
    /** Each element in the stack. */
    children: ReactNode;
    /** Causes items in the stack to be oriented horizontally, instead of vertically */
    across?: boolean;
    /** The placement, if any, of the dividing elements. */
    dividers?: "none" | "around" | "between" | "start" | "end";
    /** The size of the gap between each element in the stack. */
    gap?: keyof Theme["spacing"];
} & import("./Box.js").ColorProps & import("./Box.js").RadiiProps & import("./Box.js").MarginProps & import("./Box.js").PaddingProps & {
    textAlign?: ("center" | "end" | "justify" | "left" | "right" | "start") | readonly (("center" | "end" | "justify" | "left" | "right" | "start") | null)[];
    height?: import("../types.js").ResponsiveProp<string | number>;
    width?: import("../types.js").ResponsiveProp<string | number>;
}) => import("react").ReactElement;
export {};
//# sourceMappingURL=Stack.d.ts.map
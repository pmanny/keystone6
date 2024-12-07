/** @jsxRuntime classic */
/** @jsx jsx */
import { type Theme } from "../types.js";
export declare const Text: <Comp extends import("react").ElementType = "div">(props: {
    as?: Comp | undefined;
    ref?: import("react").Ref<Comp extends "symbol" | "switch" | "text" | "filter" | "svg" | "animate" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feDropShadow" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "set" | "stop" | "textPath" | "tspan" | "use" | "view" | keyof HTMLElementTagNameMap ? (HTMLElementTagNameMap & Pick<SVGElementTagNameMap, "symbol" | "switch" | "text" | "filter" | "svg" | "animate" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feDropShadow" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "set" | "stop" | "textPath" | "tspan" | "use" | "view">)[Comp] : Comp extends new (...args: any) => any ? InstanceType<Comp> : undefined> | undefined;
} & Omit<import("react").PropsWithoutRef<import("react").ComponentProps<Comp>>, "weight" | "color" | "as" | "size" | keyof import("./Box.js").ColorProps | keyof import("./Box.js").RadiiProps | keyof import("./Box.js").MarginProps | keyof import("./Box.js").PaddingProps | keyof {
    textAlign?: ("center" | "end" | "justify" | "left" | "right" | "start") | readonly (("center" | "end" | "justify" | "left" | "right" | "start") | null)[];
    height?: import("../types.js").ResponsiveProp<string | number>;
    width?: import("../types.js").ResponsiveProp<string | number>;
} | "leading" | "tracking"> & {
    /** The leading of the text. */
    leading?: keyof Theme["typography"]["leading"];
    /** The size of the text. */
    size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
    /** The tracking of the text. */
    tracking?: keyof Theme["typography"]["tracking"];
    /** The color of the text. */
    color?: keyof Theme["palette"];
    /** The font-weight of the text. */
    weight?: keyof Theme["typography"]["fontWeight"];
} & import("./Box.js").ColorProps & import("./Box.js").RadiiProps & import("./Box.js").MarginProps & import("./Box.js").PaddingProps & {
    textAlign?: ("center" | "end" | "justify" | "left" | "right" | "start") | readonly (("center" | "end" | "justify" | "left" | "right" | "start") | null)[];
    height?: import("../types.js").ResponsiveProp<string | number>;
    width?: import("../types.js").ResponsiveProp<string | number>;
}) => import("react").ReactElement;
//# sourceMappingURL=Text.d.ts.map
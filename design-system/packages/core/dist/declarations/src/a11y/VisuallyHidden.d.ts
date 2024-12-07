import React, { type ReactNode } from 'react';
type Props = {
    children?: ReactNode;
};
export declare const VisuallyHidden: <Comp extends React.ElementType = "span">(props: {
    as?: Comp | undefined;
    ref?: React.Ref<Comp extends "symbol" | "switch" | "text" | "filter" | "svg" | "animate" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feDropShadow" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "set" | "stop" | "textPath" | "tspan" | "use" | "view" | keyof HTMLElementTagNameMap ? (HTMLElementTagNameMap & Pick<SVGElementTagNameMap, "symbol" | "switch" | "text" | "filter" | "svg" | "animate" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feDropShadow" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "set" | "stop" | "textPath" | "tspan" | "use" | "view">)[Comp] : Comp extends new (...args: any) => any ? InstanceType<Comp> : undefined> | undefined;
} & Omit<React.PropsWithoutRef<React.ComponentProps<Comp>>, "children" | "as"> & Props) => React.ReactElement;
export declare const visuallyHiddenStyles: {
    readonly border: 0;
    readonly clip: "rect(0, 0, 0, 0)";
    readonly height: 1;
    readonly overflow: "hidden";
    readonly padding: 0;
    readonly position: "absolute";
    readonly whiteSpace: "nowrap";
    readonly width: 1;
};
export {};
//# sourceMappingURL=VisuallyHidden.d.ts.map
import { type ComponentPropsWithoutRef, type ElementType, type ReactElement, type ReactNode, type Ref, useLayoutEffect } from 'react';
export declare const getChildTag: (parentTag?: ElementType<any>) => "div" | "li";
export declare function identityType<T>(): <U extends T>(u: U) => U;
export declare const devWarning: (condition: boolean, message: string) => void;
type ElementTagNameMap = HTMLElementTagNameMap & Pick<SVGElementTagNameMap, Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>>;
type AsProp<Comp extends ElementType, Props> = {
    as?: Comp;
    ref?: Ref<Comp extends keyof ElementTagNameMap ? ElementTagNameMap[Comp] : Comp extends new (...args: any) => any ? InstanceType<Comp> : undefined>;
} & Omit<ComponentPropsWithoutRef<Comp>, 'as' | keyof Props>;
type CompWithAsProp<Props, DefaultElementType extends ElementType> = <Comp extends ElementType = DefaultElementType>(props: AsProp<Comp, Props> & Props) => ReactElement;
export declare const forwardRefWithAs: <DefaultElementType extends ElementType, BaseProps>(render: (props: BaseProps & {
    as?: ElementType;
}, ref: React.Ref<any>) => Exclude<ReactNode, undefined>) => CompWithAsProp<BaseProps, DefaultElementType>;
export declare function makeId(...args: (string | number | null | undefined)[]): string;
export declare const mapResponsiveProp: <Map extends Record<string, string | number>, Keys extends keyof Map>(value: Keys | readonly (Keys | null)[], valueMap: Map) => any;
export declare const useId: (idFromProps?: string | null) => string | undefined;
export declare const useSafeLayoutEffect: typeof useLayoutEffect;
type Props = {
    children: ReactElement;
};
export declare const Portal: ({ children }: Props) => React.ReactPortal | null;
export {};
//# sourceMappingURL=utils.d.ts.map
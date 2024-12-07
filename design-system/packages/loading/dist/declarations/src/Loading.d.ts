/** @jsxRuntime classic */
/** @jsx jsx */
export declare const loadingSizeValues: readonly ["large", "medium", "small"];
export declare const loadingToneValues: readonly ["active", "passive", "positive", "warning", "negative", "help"];
export type SizeKey = (typeof loadingSizeValues)[number];
export type ToneKey = (typeof loadingToneValues)[number];
type Props = {
    /** The aria-label for screen readers. */
    label: string;
    /** The color of the loading indicator. */
    tone?: ToneKey;
    /** The size of the loading indicator. */
    size?: SizeKey;
};
export declare const LoadingDots: ({ label, tone: toneKey, size: sizeKey, ...props }: Props) => JSX.Element;
export {};
//# sourceMappingURL=Loading.d.ts.map
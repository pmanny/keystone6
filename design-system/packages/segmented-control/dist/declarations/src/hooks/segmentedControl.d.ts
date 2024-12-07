export declare const segmentedControlSizeValues: readonly ["large", "medium", "small"];
export declare const widthMap: {
    small: number;
    medium: number;
    large: number;
    full: string;
};
export type SizeKey = (typeof segmentedControlSizeValues)[number];
export type WidthKey = 'small' | 'medium' | 'large' | 'full';
export type ControlTokensProps = {
    size: SizeKey;
    width: WidthKey;
};
export type ControlTokens = {
    borderRadius: number | string;
    paddingX: number | string;
    paddingY: number | string;
    width: number | string;
};
export declare const useControlTokens: ({ size: sizeKey, width: widthKey, }: ControlTokensProps) => ControlTokens;
export declare const useItemTokens: () => void;
//# sourceMappingURL=segmentedControl.d.ts.map
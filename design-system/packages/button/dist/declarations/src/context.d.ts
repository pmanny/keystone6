import React, { type ReactNode } from 'react';
import { useButtonStyles, useButtonTokens, type SizeKey, type ToneKey, type WeightKey } from "./hooks/button.js";
export declare const ButtonContext: React.Context<{
    defaults: {
        size: SizeKey;
        tone: ToneKey;
        weight: WeightKey;
    };
    useButtonStyles: typeof useButtonStyles;
    useButtonTokens: typeof useButtonTokens;
}>;
type ProviderHooksProp = {
    useButtonStyles?: typeof useButtonStyles;
    useButtonTokens?: typeof useButtonTokens;
};
type ProviderDefaultsProp = {
    size?: SizeKey;
    tone?: ToneKey;
    weight?: WeightKey;
};
export declare const ButtonProvider: ({ defaults, hooks, children, }: {
    defaults?: ProviderDefaultsProp;
    hooks?: ProviderHooksProp;
    children: ReactNode;
}) => React.JSX.Element;
export {};
//# sourceMappingURL=context.d.ts.map
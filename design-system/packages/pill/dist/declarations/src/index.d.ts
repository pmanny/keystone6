import { type HTMLAttributes, type ReactNode } from 'react';
type Tone = 'active' | 'passive' | 'positive' | 'warning' | 'negative' | 'help';
type Weight = 'bold' | 'light';
export declare const Pill: import("react").ForwardRefExoticComponent<{
    children: ReactNode;
    onClick?: () => void;
    onRemove?: () => void;
    tone?: Tone;
    containerProps?: HTMLAttributes<HTMLDivElement>;
    weight?: Weight;
} & HTMLAttributes<HTMLButtonElement> & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=index.d.ts.map
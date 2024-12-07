/** @jsxRuntime classic */
/** @jsx jsx */
import { type ReactNode } from 'react';
import { type MarginProps } from '@keystone-ui/core';
import { type ToneKey } from "./hooks/notice.js";
type Action = {
    onPress: () => void;
    label: string;
};
type NoticeProps = {
    actions?: {
        primary: Action;
        secondary?: Action;
    };
    children: ReactNode;
    tone?: ToneKey;
    title?: string;
    className?: string;
} & MarginProps;
export declare const Notice: ({ actions, children, tone, title, ...otherProps }: NoticeProps) => JSX.Element;
export {};
//# sourceMappingURL=Notice.d.ts.map
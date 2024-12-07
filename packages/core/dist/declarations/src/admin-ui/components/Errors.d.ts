/** @jsxRuntime classic */
/** @jsx jsx */
import { Component, type ReactNode } from 'react';
type ErrorBoundaryProps = {
    children: ReactNode;
};
type ErrorBoundaryState = {
    error?: any;
    hasError: boolean;
    isReloading: boolean;
};
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    static getDerivedStateFromError(error: any): {
        error: any;
        hasError: boolean;
    };
    reloadPage: () => void;
    render(): string | number | boolean | JSX.Element | Iterable<ReactNode> | null | undefined;
}
type ErrorContainerProps = {
    children: ReactNode;
};
export declare const ErrorContainer: ({ children }: ErrorContainerProps) => JSX.Element;
export {};
//# sourceMappingURL=Errors.d.ts.map
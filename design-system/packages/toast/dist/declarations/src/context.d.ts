import { type ToastProps } from "./types.js";
type ContextType = {
    addToast: (props: ToastProps) => void;
    removeToast: (id: string) => void;
};
export declare const ToastContext: import("react").Context<ContextType>;
export declare const useToasts: () => ContextType;
export {};
//# sourceMappingURL=context.d.ts.map
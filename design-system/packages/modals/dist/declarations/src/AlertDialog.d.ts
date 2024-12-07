/** @jsxRuntime classic */
/** @jsx jsx */
type Action = {
    action: () => void;
    label: string;
};
type AlertDialogProps = {
    actions: {
        cancel?: Action;
        confirm: Action & {
            loading?: boolean;
        };
    };
    id?: string;
    isOpen: boolean;
    children: React.ReactNode;
    title: string;
    tone?: 'negative' | 'active';
};
export declare const AlertDialog: ({ actions, isOpen, children, title, id, tone, }: AlertDialogProps) => JSX.Element;
export {};
//# sourceMappingURL=AlertDialog.d.ts.map
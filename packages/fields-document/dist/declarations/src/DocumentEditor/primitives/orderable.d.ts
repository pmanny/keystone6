import { type ReactNode } from 'react';
export declare function OrderableList(props: {
    onChange: (elements: readonly {
        key: string;
    }[]) => void;
    elements: readonly {
        key: string;
    }[];
    children: ReactNode;
}): JSX.Element;
export declare function OrderableItem(props: {
    elementKey: string;
    children: ReactNode;
}): JSX.Element;
export declare function RemoveButton(): JSX.Element;
export declare function DragHandle(): JSX.Element;
export declare const dragIcon: JSX.Element;
//# sourceMappingURL=orderable.d.ts.map
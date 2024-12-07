/** @jsxRuntime classic */
/** @jsx jsx */
import 'intersection-observer';
import { type ListMeta } from "../../../../types/index.js";
export declare function useSearchFilter(value: string, list: ListMeta, searchFields: string[], lists: {
    [list: string]: ListMeta;
}): {
    OR: Record<string, any>[];
};
export declare function RelationshipSelect({ autoFocus, controlShouldRenderValue, isDisabled, isLoading, labelField, searchFields, list, placeholder, portalMenu, state, extraSelection, }: {
    autoFocus?: boolean;
    controlShouldRenderValue: boolean;
    isDisabled: boolean;
    isLoading?: boolean;
    labelField: string;
    searchFields: string[];
    list: ListMeta;
    placeholder?: string;
    portalMenu?: true | undefined;
    state: {
        kind: 'many';
        value: {
            label: string;
            id: string;
            data?: Record<string, any>;
        }[];
        onChange(value: {
            label: string;
            id: string;
            data: Record<string, any>;
        }[]): void;
    } | {
        kind: 'one';
        value: {
            label: string;
            id: string;
            data?: Record<string, any>;
        } | null;
        onChange(value: {
            label: string;
            id: string;
            data: Record<string, any>;
        } | null): void;
    };
    extraSelection?: string;
}): JSX.Element;
//# sourceMappingURL=RelationshipSelect.d.ts.map
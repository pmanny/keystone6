type PaginationProps = {
    pageSize: number;
    total: number;
    currentPage: number;
    singular: string;
    plural: string;
};
export declare function usePaginationParams({ defaultPageSize }: {
    defaultPageSize: number;
}): {
    currentPage: number;
    pageSize: number;
};
export declare function Pagination({ currentPage, total, pageSize, singular, plural }: PaginationProps): JSX.Element | null;
export declare function PaginationLabel({ currentPage, pageSize, plural, singular, total, }: PaginationProps): JSX.Element;
export {};
//# sourceMappingURL=Pagination.d.ts.map
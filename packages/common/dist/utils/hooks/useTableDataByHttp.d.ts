export declare const useTableDataByHttp: (url: string, inactive?: boolean, shouldFetch?: boolean) => {
    pageNumber: string;
    pageSize: string;
    total: any;
    realTotal: any;
    data: any;
    error: any;
    mutate: any;
    nextPage: () => void;
    prevPage: () => void;
    gotoPage: (pageNumber: number) => void;
    setPageSize: (pageSize: number) => void;
};
//# sourceMappingURL=useTableDataByHttp.d.ts.map
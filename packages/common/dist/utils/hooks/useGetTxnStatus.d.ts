interface TxnLoopOptsType {
    callback?: (data: any) => void;
    timeout?: number;
    method?: string;
}
export declare const getTransactionLoop: (hash: string, outOptions: TxnLoopOptsType) => Promise<unknown>;
export declare const useGetTxnStatus: (txnHashs: Array<string>, timeout?: number, method?: any) => {
    status: {};
};
export {};
//# sourceMappingURL=useGetTxnStatus.d.ts.map
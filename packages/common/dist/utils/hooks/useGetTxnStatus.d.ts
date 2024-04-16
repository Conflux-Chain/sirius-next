interface TxnLoopOptsType {
    callback?: (data: any) => void;
    timeout?: number;
    method?: string;
}
declare const getTransactionLoop: (hash: string, outOptions: TxnLoopOptsType) => Promise<unknown>;
declare const useGetTxnStatus: (txnHashs: Array<string>, timeout?: number, method?: any) => {
    status: {};
};

export { getTransactionLoop, useGetTxnStatus };

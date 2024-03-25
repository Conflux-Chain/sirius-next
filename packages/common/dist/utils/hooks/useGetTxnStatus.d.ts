interface TxnLoopOptsType {
    callback?: (data: any) => void;
    timeout?: number;
    method?: string;
}
export declare const getTransactionLoop: (CFX: any, hash: string, outOptions: TxnLoopOptsType) => Promise<unknown>;
export declare const useGetTxnStatus: ({ useEffect, useState, useRef }: any, CFX: any, txnHashs: Array<string>, timeout?: number, method?: any) => {
    status: any;
};
export {};
//# sourceMappingURL=useGetTxnStatus.d.ts.map
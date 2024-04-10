export interface EnvState<T> {
    ENV_CONFIG: T;
    SET_ENV_CONFIG: (env: T) => void;
}
export interface I18nState<T> {
    translations: T;
    setTranslations: (translations: T) => void;
}
export declare const useEnv: import("zustand").UseBoundStore<import("zustand").StoreApi<EnvState<any>>>;
export declare const useI18n: import("zustand").UseBoundStore<import("zustand").StoreApi<I18nState<any>>>;
//# sourceMappingURL=index.d.ts.map
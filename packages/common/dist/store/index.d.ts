import { ConvertedToObjectType, TranslationResource } from '@repo/i18n/types';
export interface EnvState<T> {
    ENV_CONFIG: T;
    SET_ENV_CONFIG: (env: T) => void;
}
export interface I18nState {
    translations: TranslationResource;
    setTranslations: (translations: ConvertedToObjectType<TranslationResource>) => void;
}
export declare const useEnv: import("zustand").UseBoundStore<import("zustand").StoreApi<EnvState<any>>>;
export declare const useI18n: import("zustand").UseBoundStore<import("zustand").StoreApi<I18nState>>;
//# sourceMappingURL=index.d.ts.map
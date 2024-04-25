import * as zustand from 'zustand';
import { TranslationResource, ConvertedToObjectType } from '@repo/i18n/types';

interface EnvState<T> {
    ENV_CONFIG: T;
    SET_ENV_CONFIG: (env: T) => void;
}
interface I18nState {
    translations: TranslationResource;
    setTranslations: (translations: ConvertedToObjectType<TranslationResource>) => void;
}
interface GlobalDataState {
    globalData: any;
    setGlobalData: (data: any) => void;
}
declare const useEnv: zustand.UseBoundStore<zustand.StoreApi<EnvState<any>>>;
declare const useI18n: zustand.UseBoundStore<zustand.StoreApi<I18nState>>;
declare const useGlobalData: zustand.UseBoundStore<zustand.StoreApi<GlobalDataState>>;
declare const getEnvConfig: () => any;
declare const getTranslations: () => TranslationResource;

export { type EnvState, type GlobalDataState, type I18nState, getEnvConfig, getTranslations, useEnv, useGlobalData, useI18n };
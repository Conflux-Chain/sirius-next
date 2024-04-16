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
declare const useEnv: zustand.UseBoundStore<zustand.StoreApi<EnvState<any>>>;
declare const useI18n: zustand.UseBoundStore<zustand.StoreApi<I18nState>>;

export { type EnvState, type I18nState, useEnv, useI18n };

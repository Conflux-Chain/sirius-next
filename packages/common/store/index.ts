import { create } from 'zustand';
import { ConvertedToObjectType, TranslationResource } from '../../i18n/types'

export interface EnvState<T> {
    ENV_CONFIG: T;
    SET_ENV_CONFIG: (env: T) => void;
}
export interface I18nState {
    translations: TranslationResource;
    setTranslations: (translations: ConvertedToObjectType<TranslationResource>) => void;
}

export const useEnv = create<EnvState<any>>((set) => ({
    ENV_CONFIG: {},
    SET_ENV_CONFIG: (env: any) => set({ ENV_CONFIG: env })
}));

export const useI18n = create<I18nState>((set) => ({
    translations: {} as any,
    setTranslations: (translations: TranslationResource) => set({ translations }),
}));

// export const useEnvInit = <T>(initialState: T) => create<EnvState<T>>((set) => ({
//     ENV_CONFIG: initialState,
//     SET_ENV_CONFIG: (env: T) => set({ ENV_CONFIG: env }),
// }));
import { create } from 'zustand';

export interface EnvState<T> {
    ENV_CONFIG: T;
    SET_ENV_CONFIG: (env: T) => void;
}
export interface I18nState<T> {
    translations: T;
    setTranslations: (translations: T) => void;
}

export const useEnv = create<EnvState<any>>((set) => ({
    ENV_CONFIG: {},
    SET_ENV_CONFIG: (env: any) => set({ ENV_CONFIG: env })
}));

export const useI18n = create<I18nState<any>>((set) => ({
    translations: {},
    setTranslations: (translations: any) => set({ translations }),
}));

// export const useEnvInit = <T>(initialState: T) => create<EnvState<T>>((set) => ({
//     ENV_CONFIG: initialState,
//     SET_ENV_CONFIG: (env: T) => set({ ENV_CONFIG: env }),
// }));
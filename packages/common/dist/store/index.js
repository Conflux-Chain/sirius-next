import { create } from 'zustand';
export const useEnv = create(set => ({
    ENV_CONFIG: {},
    SET_ENV_CONFIG: (env) => set({ ENV_CONFIG: env }),
}));
export const useI18n = create(set => ({
    translations: {},
    setTranslations: (translations) => set({ translations }),
}));
// export const useEnvInit = <T>(initialState: T) => create<EnvState<T>>((set) => ({
//     ENV_CONFIG: initialState,
//     SET_ENV_CONFIG: (env: T) => set({ ENV_CONFIG: env }),
// }));

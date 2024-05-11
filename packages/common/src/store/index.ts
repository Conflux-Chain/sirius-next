import { create } from 'zustand';
import { TranslationResource } from '@repo/i18n/types';
import {
  EnvState,
  I18nState,
  GlobalDataType,
  GlobalDataState,
  ENSStore,
} from './types';

export const useEnv = create<EnvState<any>>(set => ({
  ENV_CONFIG: {},
  SET_ENV_CONFIG: (env: any) => set({ ENV_CONFIG: env }),
}));

export const useI18n = create<I18nState>(set => ({
  translations: {} as TranslationResource,
  setTranslations: (translations: TranslationResource) => set({ translations }),
}));

export const useGlobalData = create<GlobalDataState>(set => ({
  globalData: {} as GlobalDataType,
  setGlobalData: (data: GlobalDataType) => set({ globalData: data }),
}));

export const useENSStore = create<ENSStore>(set => ({
  ens: {},
  setENS: newENS =>
    set(state => ({
      ens: {
        ...state.ens,
        ...newENS,
      },
    })),
}));

export const getEnvConfig = () => useEnv.getState().ENV_CONFIG;
export const getTranslations = () => useI18n.getState().translations;

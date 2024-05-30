import { create } from 'zustand';
import { TranslationResource } from '@cfxjs/sirius-next-i18n/types';
import {
  EnvState,
  I18nState,
  GlobalDataType,
  GlobalDataState,
  ENSStore,
  GasPriceDataState,
  GasPriceBundle,
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

export const defaultGasPriceBundle: GasPriceBundle = {
  gasPriceInfo: {
    min: 0,
    tp50: 0,
    max: 0,
  },
  gasPriceMarket: {
    min: 0,
    tp25: 0,
    tp50: 0,
    tp75: 0,
    max: 0,
  },
  maxEpoch: 0,
  minEpoch: 0,
  maxTime: '0',
  minTime: '0',
  blockHeight: 0,
};
export const useGasPrice = create<GasPriceDataState>(set => ({
  gasPriceData: defaultGasPriceBundle,
  setGasPrice: (data: GasPriceBundle) => set({ gasPriceData: data }),
}));

export const getEnvConfig = () => useEnv.getState().ENV_CONFIG;
export const getTranslations = () => useI18n.getState().translations;

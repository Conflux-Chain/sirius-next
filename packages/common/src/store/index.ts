import { create } from 'zustand';
import type { TranslationResource } from '@cfxjs/sirius-next-i18n/types';
import {
  EnvState,
  I18nState,
  GlobalDataType,
  GlobalDataState,
  ENSStore,
  NametagCacheStore,
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

export const useNametagCacheStore = create<NametagCacheStore>(set => ({
  nametagCache: {},
  contractCache: {},
  setNametagCache: e =>
    set(state => ({
      nametagCache: {
        ...state.nametagCache,
        ...e,
      },
    })),
  setContractCache: e =>
    set(state => ({
      contractCache: {
        ...state.contractCache,
        ...e,
      },
    })),
}));

const defaultGasPriceDetail = {
  base: 0,
  priority: 0,
  gasPrice: 0,
};

export const defaultGasPriceBundle: GasPriceBundle = {
  gasPriceInfo: {
    min: defaultGasPriceDetail,
    tp50: defaultGasPriceDetail,
    max: defaultGasPriceDetail,
  },
  gasPriceMarket: {
    min: defaultGasPriceDetail,
    tp25: defaultGasPriceDetail,
    tp50: defaultGasPriceDetail,
    tp75: defaultGasPriceDetail,
    max: defaultGasPriceDetail,
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

export const useHighlightStore = create<{
  highlight: {
    scope?: string;
    value?: unknown;
  };
  setHighlight: (scope?: string, value?: unknown) => void;
}>(set => ({
  highlight: {},
  setHighlight: (scope, value) =>
    set(state => ({
      highlight: {
        ...state.highlight,
        scope,
        value,
      },
    })),
}));

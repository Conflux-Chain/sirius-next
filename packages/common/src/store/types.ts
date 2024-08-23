import type {
  ConvertedToObjectType,
  TranslationResource,
} from '@cfxjs/sirius-next-i18n/types';
import { LOCALSTORAGE_KEYS_MAP } from '../utils/constants';

export interface EnvState<T> {
  ENV_CONFIG: T;
  SET_ENV_CONFIG: (env: T) => void;
}
export interface I18nState {
  translations: TranslationResource;
  setTranslations: (
    translations: ConvertedToObjectType<TranslationResource>,
  ) => void;
}

export interface ContractsType {
  [index: string]: string | undefined;
  announcement?: string;
  faucet?: string;
  faucetLast?: string;
  wcfx?: string;
  governance?: string;
}

export interface NetworksType {
  url: string;
  name: string;
  id: number;
}

export interface NetworksTypeEnv {
  mainnet: NetworksType[];
  testnet: NetworksType[];
  devnet: NetworksType[];
}

export interface ENSType {
  [index: string]: {
    name: string;
    expired: number;
    delayed: number;
  };
}

export interface GlobalDataType {
  networks: any;
  // NetworksType[] // Core
  // { // Evm
  //     mainnet: NetworksType[];
  //     testnet: NetworksType[];
  //     devnet: NetworksType[];
  // };
  networkId: number;
  contracts: ContractsType;
  currency?: string;
  ens?: ENSType;
  random?: number;
  [LOCALSTORAGE_KEYS_MAP.addressLabel]?: Record<string, string>;
  [LOCALSTORAGE_KEYS_MAP.txPrivateNote]?: Record<string, string>;
}

export interface GlobalDataState {
  globalData: GlobalDataType;
  setGlobalData: (data: GlobalDataType) => void;
}

export interface ENSStore {
  ens: ENSType;
  setENS: (newENS: ENSType) => void;
}

export interface NametagCacheStore {
  nametagCache: Record<string, any>;
  contractCache: Record<string, any>;
  setNametagCache: (e: Record<string, any>) => void;
  setContractCache: (e: Record<string, any>) => void;
}

export interface GasPriceDataState {
  gasPriceData: GasPriceBundle;
  setGasPrice: (data: GasPriceBundle) => void;
}

export interface GasPriceDetail {
  base: number;
  priority: number;
  gasPrice: number;
}

export interface GasPriceBundle {
  gasPriceInfo: {
    min: GasPriceDetail;
    tp50: GasPriceDetail;
    max: GasPriceDetail;
  };
  gasPriceMarket: {
    min: GasPriceDetail;
    tp25: GasPriceDetail;
    tp50: GasPriceDetail;
    tp75: GasPriceDetail;
    max: GasPriceDetail;
  };
  maxEpoch: number;
  minEpoch: number;
  maxTime: string;
  minTime: string;
  blockHeight: number;
}

export interface GasPriceDropdownProps {
  unit?: string;
}

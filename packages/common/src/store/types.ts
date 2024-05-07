import { ConvertedToObjectType, TranslationResource } from '@repo/i18n/types';
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
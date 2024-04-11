import eCommonTranslation from '../evm/base/en/translation.json';
import cTranslation from '../cspace/en/translation.json';

export type ConvertedToObjectType<T> = {
  [P in keyof T]: T[P] extends string ? string : ConvertedToObjectType<T[P]>;
};
export type TranslationResource = typeof eCommonTranslation | typeof cTranslation;
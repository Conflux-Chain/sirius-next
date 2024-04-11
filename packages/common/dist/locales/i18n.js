"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = exports.translations = void 0;
const i18next_1 = __importDefault(require("i18next"));
const react_i18next_1 = require("react-i18next");
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const translation_json_1 = __importDefault(require("./en/translation.json"));
const translation_json_2 = __importDefault(require("./zh_cn/translation.json"));
const env_1 = __importDefault(require("../env"));
const lodash_1 = __importDefault(require("lodash"));
const enMerge = lodash_1.default.merge(translation_json_1.default, env_1.default.ENV_LOCALES_EN);
const zhMerge = lodash_1.default.merge(translation_json_2.default, env_1.default.ENV_LOCALES_CN);
const translationsJson = {
    'en-US': {
        translation: enMerge,
    },
    en: {
        translation: enMerge,
    },
    'zh-CN': {
        translation: zhMerge,
    },
    zh: {
        translation: zhMerge,
    }
};
exports.translations = {};
/*
 * Converts the static JSON file into an object where keys are identical
 * but values are strings concatenated according to syntax.
 * This is helpful when using the JSON file keys and still have the intellisense support
 * along with type-safety
 */
const convertLanguageJsonToObject = (obj, dict, current) => {
    Object.keys(obj).forEach(key => {
        const currentLookupKey = current ? `${current}.${key}` : key;
        if (typeof obj[key] === 'object') {
            dict[key] = {};
            convertLanguageJsonToObject(obj[key], dict[key], currentLookupKey);
        }
        else {
            dict[key] = currentLookupKey;
        }
    });
};
exports.i18n = i18next_1.default
    // pass the i18n instance to react-i18next.
    .use(react_i18next_1.initReactI18next)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(i18next_browser_languagedetector_1.default)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
    resources: translationsJson,
    fallbackLng: {
        'en-US': ['en'],
        'zh-CN': ['zh'],
        default: ['en'],
    },
    debug: process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
    interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
    },
}, () => {
    convertLanguageJsonToObject(lodash_1.default.merge(translation_json_1.default, env_1.default.ENV_LOCALES_EN), exports.translations);
});

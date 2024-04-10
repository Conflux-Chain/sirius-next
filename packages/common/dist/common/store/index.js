"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useI18n = exports.useEnv = void 0;
const zustand_1 = require("zustand");
exports.useEnv = (0, zustand_1.create)((set) => ({
    ENV_CONFIG: {},
    SET_ENV_CONFIG: (env) => set({ ENV_CONFIG: env })
}));
exports.useI18n = (0, zustand_1.create)((set) => ({
    translations: {},
    setTranslations: (translations) => set({ translations }),
}));
// export const useEnvInit = <T>(initialState: T) => create<EnvState<T>>((set) => ({
//     ENV_CONFIG: initialState,
//     SET_ENV_CONFIG: (env: T) => set({ ENV_CONFIG: env }),
// }));

// src/store/index.ts
import { create } from "zustand";
var useEnv = create((set) => ({
  ENV_CONFIG: {},
  SET_ENV_CONFIG: (env) => set({ ENV_CONFIG: env })
}));
var useI18n = create((set) => ({
  translations: {},
  setTranslations: (translations) => set({ translations })
}));
var getEnvConfig = () => useEnv.getState().ENV_CONFIG;

export {
  useEnv,
  useI18n,
  getEnvConfig
};
//# sourceMappingURL=chunk-W4ZISPJS.js.map
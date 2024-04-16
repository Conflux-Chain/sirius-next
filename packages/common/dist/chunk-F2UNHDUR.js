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

export {
  useEnv,
  useI18n
};
//# sourceMappingURL=chunk-F2UNHDUR.js.map
import {
  ActionButton
} from "./chunk-6UM5Y3SL.js";
import {
  IconButton
} from "./chunk-27GSITHB.js";
import {
  BaseButton
} from "./chunk-3GGF3ULC.js";

// src/components/Button/index.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var ComponentMap = {
  default: BaseButton,
  icon: IconButton,
  action: ActionButton
};
var Button = forwardRef(
  ({ type = "default", ...props }, ref) => {
    const Component = ComponentMap[type];
    return /* @__PURE__ */ jsx(Component, { ref, ...props });
  }
);
var Button_default = Button;

export {
  Button_default
};
//# sourceMappingURL=chunk-WML236LE.js.map
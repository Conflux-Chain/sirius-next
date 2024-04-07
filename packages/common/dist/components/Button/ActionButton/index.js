"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const clsx_1 = __importDefault(require("clsx"));
const BaseButton_1 = require("../BaseButton");
exports.ActionButton = (0, react_1.forwardRef)(({ className, color = "default", size = "default", disabled, loading, children, ...props }, ref) => {
    return ((0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { ref: ref, className: (0, clsx_1.default)("relative lh-[1.5715] ws-nowrap transition-all-300 select-none min-w-124px rounded-2px text-center font-normal", {
            "bg-[var(--theme-color-gray3)] text-[var(--theme-color-gray2)] hover:bg-[var(--theme-color-gray0)] hover-text-[var(--theme-color-gray2)]": disabled,
            "hover:bg-[var(--theme-color-button-bg)] hover:text-#fff": !disabled,
            "text-#424A71 bg-#0054fe0a": !disabled && color === "default",
            "text-#fff bg-[var(--theme-color-primary-button-bg)]": !disabled && color === "primary",
            "p-x-15px p-y-4px h-32px": size === "default",
            "p-x-7px h-24px": size === "small",
        }, className), disabled: disabled, loading: loading, ...props, children: [loading && (0, jsx_runtime_1.jsx)("span", { className: "i-line-md:loading-loop mr-4px" }), children] }));
});

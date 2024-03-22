"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spin = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const Spin = ({ children, spinning = true, size = "default", ...rest }) => {
    const fontSize = size === "small" ? "text-20px" : "text-40px";
    if (!children) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "opacity-100 inline-block static text-center align-middle", ...rest, children: spinning && ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("relative w-1em h-1em flex-center text-[var(--theme-color-primary)]", fontSize), children: (0, jsx_runtime_1.jsx)("span", { className: "i-line-md:loading-loop" }) })) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", ...rest, children: [spinning && ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("absolute top-0 left-0 z-4 w-full h-full opacity-100 flex-center text-[var(--theme-color-primary)]", fontSize), children: (0, jsx_runtime_1.jsx)("span", { className: "i-line-md:loading-loop" }) })), (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("relative transition-opacity-300", spinning &&
                    "clear-both overflow-hidden opacity-50 pointer-events-none select-none"), children: children })] }));
};
exports.Spin = Spin;

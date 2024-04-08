"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Description = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const Description = ({ title, style, className, children, noBorder, vertical = false, size = "medium", ...others }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { style: style, className: (0, clsx_1.default)("description", "flex min-h-3.2857rem lh-3.2857rem lt-sm:flex-col", !noBorder && "border-b-(1px solid #e8e9ea)", vertical && "flex-col", className, size), ...others, children: [(0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("left", "px-0 lh-[calc(3.2857rem-1.7143rem)] min-w-160px max-w-260px text-#74798c flex-shrink-0", size === "tiny" ? "py-0.5rem" : "py-0.8571rem", size === "small" ? "w-10rem " : vertical ? "w-full" : "w-25%"), children: title }), (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("right", "py-0.8571rem px-0 lh-[calc(3.2857rem-1.7143rem)] text-#282d30 flex-grow-1 lt-sm:pt-0", size === "tiny" ? "py-0.5rem" : "py-0.8571rem", vertical && "pt-0"), children: children })] }));
};
exports.Description = Description;

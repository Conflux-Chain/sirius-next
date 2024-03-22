"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const clsx_1 = __importDefault(require("clsx"));
exports.BaseButton = (0, react_1.forwardRef)(({ children, className, loading, disabled, onClick, ...props }, ref) => {
    const handleClick = (e) => {
        if (loading || disabled)
            return;
        onClick?.(e);
    };
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, className: (0, clsx_1.default)("flex-center cursor-pointer", disabled && "cursor-not-allowed", loading && "pointer-events-none", className), onClick: handleClick, ...props, children: children }));
});

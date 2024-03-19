"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const clsx_1 = __importDefault(require("clsx"));
exports.ActionButton = (0, react_1.forwardRef)(({ children, className, loading, disabled, onClick, ...props }, ref) => {
    const handleClick = () => {
        if (loading || disabled)
            return;
        onClick?.();
    };
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, className: (0, clsx_1.default)("min-w-2.2857rem h-2.2857rem rounded-0.2857rem px-0.4286rem flex-center text-#b1b3b9 font-normal bg-#0054fe0a cursor-pointer hover:bg-#0054fe19", disabled && "cursor-not-allowed", className), onClick: handleClick, ...props, children: children }));
});

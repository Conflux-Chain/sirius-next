"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const clsx_1 = __importDefault(require("clsx"));
const BaseButton_1 = require("../BaseButton");
exports.IconButton = (0, react_1.forwardRef)(({ className, ...props }, ref) => {
    return ((0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { ref: ref, className: (0, clsx_1.default)("min-w-2.2857rem h-2.2857rem rounded-0.2857rem px-0.4286rem text-#b1b3b9 bg-#0054fe0a hover:bg-#0054fe19", className), ...props }));
});

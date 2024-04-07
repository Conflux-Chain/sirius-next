"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const Spin_1 = require("../Spin");
const Card = ({ children, className, loading = false, ...rest }) => {
    return ((0, jsx_runtime_1.jsx)(Spin_1.Spin, { spinning: loading, children: (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("card sirius-card", "px-1.2857rem py-0 m-0 bg-#fff w-full rounded-4px transition-all-200 box-border text-#333 border-2px border-solid border-transparent shadow-card", className), ...rest, children: (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("content", "[&>:first-child]:mt-0! [&>:last-child]:mb-0!", "w-full p-0"), children: children }) }) }));
};
exports.Card = Card;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Title = ({ header }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: 'relative', children: (0, jsx_runtime_1.jsxs)("div", { className: "text-[1.7143rem] text-[#1a1a1a] font-medium leading-[2.2857rem] mb-[1.1429rem] mt-[2.2857rem]", children: [header.title.text, (0, jsx_runtime_1.jsx)("div", { className: "text-[1rem] text-[#74798c] leading-[1.2857rem] mt-[0.8571rem]", children: header.subtitle.text })] }) }));
};
exports.default = Title;

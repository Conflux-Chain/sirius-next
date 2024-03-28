"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = require("../Link");
const Title = ({ header }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: 'flex items-start justify-between pt-4 pr-5 pb-0 pl-5', children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[16px] text-[#26244B] ", children: header.title.text }), (0, jsx_runtime_1.jsx)("div", { className: "text-[14px] text-[#74798C]", children: header.subtitle.text })] }), (0, jsx_runtime_1.jsx)(Link_1.Link, { className: "shrink-0", href: header?.breadcrumb?.[1]?.path || '/', children: "View Details" })] }));
};
exports.default = Title;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = require("../Link");
const BreadcrumbNav = ({ breadcrumb }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: 'absolute right-0 flex z-10', children: breadcrumb.map((e, i, arr) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Link_1.Link, { href: e.path, children: e.name }), i < arr.length - 1 && (0, jsx_runtime_1.jsx)("span", { className: "mx-2", children: "/" })] }, i))) }));
};
exports.default = BreadcrumbNav;

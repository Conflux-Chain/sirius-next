import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { Divider } from "../Divider";
import clsx from "clsx";
export const Footer = memo(({ rightBottom, rightTop, left }) => {
    return (_jsx("div", { className: clsx("bg-[var(--theme-color-foot-bg)] w-100vw max-w-100% flex items-start p-2.2857rem box-border", "lt-sm:py-1.14rem lt-sm:px-0.93rem"), children: _jsxs("div", { className: "flex items-stretch grow-1 mx-auto max-w-1368px box-border", children: [_jsx("div", { className: "mr-2.93rem flex flex-col lt-md:hidden", children: left }, "left"), _jsxs("div", { className: "grow-2 lt-sm:p-0", children: [_jsx("div", { className: "lt-sm:px-0.21rem", children: rightTop }, "right-top"), _jsx(Divider, { className: clsx("footer-bottom-divider", "bg-#d1d5ea! mt-1.07rem mb-0.57rem lt-sm:mt-0.79rem lt-sm:mb-0.29rem") }, "divider"), _jsx("div", { className: "flex lt-sm:px-0.21rem", children: rightBottom }, "right-bottom")] }, "right")] }) }));
});

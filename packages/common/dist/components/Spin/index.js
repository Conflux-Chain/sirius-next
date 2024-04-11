import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
export const Spin = ({ children, spinning = true, size = "default", ...rest }) => {
    const fontSize = size === "small" ? "text-20px" : "text-40px";
    if (!children) {
        return (_jsx("div", { className: "opacity-100 inline-block static text-center align-middle", ...rest, children: spinning && (_jsx("div", { className: clsx("relative w-1em h-1em flex-center text-[var(--theme-color-primary)]", fontSize), children: _jsx("span", { className: "i-line-md:loading-loop" }) })) }));
    }
    return (_jsxs("div", { className: "relative", ...rest, children: [spinning && (_jsx("div", { className: clsx("absolute top-0 left-0 z-4 w-full h-full opacity-100 flex-center text-[var(--theme-color-primary)]", fontSize), children: _jsx("span", { className: "i-line-md:loading-loop" }) })), _jsx("div", { className: clsx("relative transition-opacity-300", spinning &&
                    "clear-both overflow-hidden opacity-50 pointer-events-none select-none"), children: children })] }));
};

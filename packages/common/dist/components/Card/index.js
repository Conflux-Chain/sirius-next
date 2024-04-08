import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
import { Spin } from "../Spin";
export const Card = ({ children, className, loading = false, ...rest }) => {
    return (_jsx(Spin, { spinning: loading, children: _jsx("div", { className: clsx("card sirius-card", "px-1.2857rem py-0 m-0 bg-#fff w-full rounded-4px transition-all-200 box-border text-#333 border-2px border-solid border-transparent shadow-card", className), ...rest, children: _jsx("div", { className: clsx("content", "[&>:first-child]:mt-0! [&>:last-child]:mb-0!", "w-full p-0"), children: children }) }) }));
};

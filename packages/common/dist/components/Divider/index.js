import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export const Divider = ({ className }) => {
    return (_jsx("div", { className: clsx("w-auto max-w-full h-1px my-16px relative bg-#eee", className) }));
};

import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export const Divider = ({ className }) => {
    return (_jsx("div", { className: clsx("w-auto max-w-full h-[calc(1*1px)] my-[calc(1*16px+1px*0)] relative bg-#eee", className) }));
};

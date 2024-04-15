import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, } from 'react';
import clsx from 'clsx';
export const BaseButton = forwardRef(({ children, className, loading, disabled, onClick, ...props }, ref) => {
    const handleClick = e => {
        if (loading || disabled)
            return;
        onClick?.(e);
    };
    return (_jsx("div", { ref: ref, className: clsx('flex-center cursor-pointer', disabled && 'cursor-not-allowed', loading && 'pointer-events-none', className), onClick: handleClick, ...props, children: children }));
});

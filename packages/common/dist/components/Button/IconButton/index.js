import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import clsx from 'clsx';
import { BaseButton } from '../BaseButton';
export const IconButton = forwardRef(({ className, ...props }, ref) => {
    return (_jsx(BaseButton, { ref: ref, className: clsx('min-w-2.2857rem h-2.2857rem rounded-0.2857rem px-0.4286rem text-#b1b3b9 bg-#0054fe0a hover:bg-#0054fe19', className), ...props }));
});

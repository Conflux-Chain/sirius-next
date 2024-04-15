import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { BaseButton } from './BaseButton';
import { IconButton } from './IconButton';
import { ActionButton } from './ActionButton';
const ComponentMap = {
    default: BaseButton,
    icon: IconButton,
    action: ActionButton,
};
const Button = forwardRef(({ type = 'default', ...props }, ref) => {
    const Component = ComponentMap[type];
    return _jsx(Component, { ref: ref, ...props });
});
export default Button;
export { BaseButton } from './BaseButton';
export { IconButton } from './IconButton';
export { ActionButton } from './ActionButton';

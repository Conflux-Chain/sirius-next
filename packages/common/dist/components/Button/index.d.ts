/// <reference types="react" />
import { BaseButtonProps } from './BaseButton';
type ButtonType = 'default' | 'icon' | 'action';
interface ButtonProps extends BaseButtonProps {
    type?: ButtonType;
    color?: 'default' | 'primary';
    size?: 'default' | 'small';
}
declare const Button: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & import("react").RefAttributes<unknown>>;
export default Button;
export { BaseButton } from './BaseButton';
export { IconButton } from './IconButton';
export { ActionButton } from './ActionButton';
//# sourceMappingURL=index.d.ts.map
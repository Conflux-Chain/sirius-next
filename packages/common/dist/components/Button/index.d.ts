import * as react from 'react';
import { BaseButtonProps } from './BaseButton/index.js';
export { BaseButton } from './BaseButton/index.js';
export { IconButton } from './IconButton/index.js';
export { ActionButton } from './ActionButton/index.js';

type ButtonType = 'default' | 'icon' | 'action';
interface ButtonProps extends BaseButtonProps {
    type?: ButtonType;
    color?: 'default' | 'primary';
    size?: 'default' | 'small';
}
declare const Button: react.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & react.RefAttributes<unknown>>;

export { Button as default };

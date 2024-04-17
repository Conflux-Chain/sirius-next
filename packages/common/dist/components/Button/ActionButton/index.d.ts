import * as react from 'react';
import { BaseButtonProps } from '../BaseButton/index.js';

interface ButtonProps extends BaseButtonProps {
    color?: 'default' | 'primary';
    size?: 'default' | 'small';
}
declare const ActionButton: react.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & react.RefAttributes<unknown>>;

export { ActionButton };

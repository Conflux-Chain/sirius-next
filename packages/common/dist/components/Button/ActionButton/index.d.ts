import * as React from 'react';
import { BaseButtonProps } from '../BaseButton/index.js';

interface ButtonProps extends BaseButtonProps {
    color?: 'default' | 'primary';
    size?: 'default' | 'small';
}
declare const ActionButton: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<unknown>>;

export { ActionButton };

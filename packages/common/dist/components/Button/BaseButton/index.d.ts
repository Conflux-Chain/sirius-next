import * as React from 'react';
import { ComponentProps } from 'react';

interface BaseButtonProps extends ComponentProps<'div'> {
    disabled?: boolean;
    loading?: boolean;
}
declare const BaseButton: React.ForwardRefExoticComponent<Omit<BaseButtonProps, "ref"> & React.RefAttributes<unknown>>;

export { BaseButton, type BaseButtonProps };

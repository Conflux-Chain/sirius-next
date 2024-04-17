import * as react from 'react';
import { ComponentProps } from 'react';

interface BaseButtonProps extends ComponentProps<'div'> {
    disabled?: boolean;
    loading?: boolean;
}
declare const BaseButton: react.ForwardRefExoticComponent<Omit<BaseButtonProps, "ref"> & react.RefAttributes<unknown>>;

export { BaseButton, type BaseButtonProps };

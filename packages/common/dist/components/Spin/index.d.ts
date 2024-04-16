import { FC, ComponentProps } from 'react';

interface SpinProps extends ComponentProps<'div'> {
    size?: 'default' | 'small';
    spinning?: boolean;
}
declare const Spin: FC<SpinProps>;

export { Spin };

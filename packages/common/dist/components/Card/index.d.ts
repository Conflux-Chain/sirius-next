import { FC, ComponentProps } from 'react';

interface CardProps extends ComponentProps<'div'> {
    loading?: boolean;
}
declare const Card: FC<CardProps>;

export { Card };

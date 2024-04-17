import * as react from 'react';
import { BaseButtonProps } from '../BaseButton/index.js';

declare const IconButton: react.ForwardRefExoticComponent<Omit<BaseButtonProps, "ref"> & react.RefAttributes<unknown>>;

export { IconButton };

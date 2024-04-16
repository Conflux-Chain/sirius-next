import * as React from 'react';
import { BaseButtonProps } from '../BaseButton/index.js';

declare const IconButton: React.ForwardRefExoticComponent<Omit<BaseButtonProps, "ref"> & React.RefAttributes<unknown>>;

export { IconButton };

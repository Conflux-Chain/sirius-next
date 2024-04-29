import * as React from 'react';
import * as react_i18next from 'react-i18next';
import { WithTranslation } from 'react-i18next';
import { Props } from './types.js';

declare const AddressContainer: React.ComponentType<Omit<react_i18next.Subtract<Props & WithTranslation<"translation", undefined>, react_i18next.WithTranslationProps>, keyof WithTranslation<N, undefined>> & react_i18next.WithTranslationProps>;

export { AddressContainer };

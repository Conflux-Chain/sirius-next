import React from 'react';
import { TabVariant } from './types';
import clsx from 'clsx';

export interface NavCptProps {
  variant: TabVariant;
  disabled: boolean;
  active: boolean;
  label: string | React.ReactNode;
}

const Nav: React.FC<NavCptProps> = ({ label, variant, disabled, active }) => {
  return (
    <div className={clsx('sirius-tabs-nav', 'flex flex-col relative')}>
      <div
        className={clsx(
          'sirius-tabs-nav-label',
          'ws-nowrap lh-22px px-1.1429rem py-0.5714rem rounded-tr-4px rounded-tl-4px text-center text-#444 hover-text-#1e3de4',
          disabled && 'cursor-not-allowed',
          active ? 'font-500' : 'font-400',
        )}
      >
        {label}
      </div>
      {variant === 'line' ? (
        <div
          className={clsx(
            'sirius-tabs-nav-bottom',
            'transition-all duration-200 ease-in-out h-4px w-full bg-[var(--theme-color-link)]',
            active ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
          )}
        ></div>
      ) : null}
    </div>
  );
};

export default Nav;

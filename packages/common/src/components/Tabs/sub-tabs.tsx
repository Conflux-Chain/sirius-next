import React from 'react';
import clsx from 'clsx';
import Button from '../Button';

interface Props {
  tabs: Array<{
    label: string;
    key: string;
  }>;
  activeKey: string;
  onChange: (activeKey?: string, index?: number) => void;
  className?: string;
  extra?: React.ReactNode;
}

export const SubTabs = ({
  tabs,
  activeKey,
  onChange,
  className,
  extra,
}: Props) => {
  return (
    <div
      className={clsx(
        'flex flex-wrap',
        'all-[.sirius-subtabs-item]:bg-#f5f8ff all-[.sirius-subtabs-item]:rounded-1.1429rem all-[.sirius-subtabs-item]:px-1rem all-[.sirius-subtabs-item]:min-w-initial all-[.sirius-subtabs-item]:h-1.8571rem all-[.sirius-subtabs-item]:lh-1.8571rem all-[.sirius-subtabs-item]:border-none all-[.sirius-subtabs-item]:mr-0.2857rem all-[.sirius-subtabs-item]:lt-sm:my-0.3571rem all-[.sirius-subtabs-item]:lt-sm:mx-0',
        'all-[.sirius-subtabs-item:hover]:bg-[var(--theme-color-button-bg)] all-[.sirius-subtabs-item:hover]:text-#fff',
        'all-[.sirius-subtabs-item.active]:bg-[var(--theme-color-button-bg)] all-[.sirius-subtabs-item.active]:text-#fff',
        className,
      )}
    >
      {tabs.map((o, index) => (
        <Button
          type="action"
          key={o.key}
          className={clsx(
            'sirius-subtabs-item',
            o.key === activeKey && 'active',
          )}
          onClick={() => onChange(o.key, index)}
        >
          {o.label}
        </Button>
      ))}
      {extra ? (
        <div
          className={clsx(
            'sirius-subtabs-item-extra',
            'flex-grow-1 flex-shrink-0 flex items-center justify-end',
          )}
        >
          {extra}
        </div>
      ) : null}
    </div>
  );
};

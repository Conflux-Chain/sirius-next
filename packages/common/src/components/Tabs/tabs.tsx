import React, {
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  CSSProperties,
} from 'react';
import {
  TabsItemConfig,
  TabsConfig,
  TabsContext,
  Handles,
} from './tabs-context';
import TabsItem from './tabs-item';

import TabsNav from './tabs-nav';
import { TabVariant } from './types';
import clsx from 'clsx';

export interface Props {
  style?: CSSProperties;
  initialValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
  variant?: TabVariant;
  showDivider?: boolean;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>;
export type TabsProps = React.PropsWithChildren<Props & NativeAttrs>;

const Tabs = forwardRef<Handles, TabsProps>(
  (
    {
      initialValue: userCustomInitialValue,
      value,
      children,
      variant = 'line',
      onChange,
      className = '',
      showDivider,
      ...props
    },
    ref,
  ) => {
    const [currentTab, setCurrentTab] = useState<string | undefined>(
      userCustomInitialValue,
    );
    const [tabs, setTabs] = useState<TabsItemConfig[]>([]);

    useImperativeHandle(
      ref,
      () => ({
        setCurrentTab(v) {
          setCurrentTab(v);
        },
        getCurrentTab() {
          return currentTab;
        },
      }),
      [currentTab],
    );

    const register = useCallback(
      (next: TabsItemConfig | { remove: string }) => {
        setTabs(last => {
          if ('remove' in next) {
            return last.filter(({ value }) => value !== next.remove);
          } else {
            const hasItem = last.find(item => item.value === next.value);
            if (!hasItem) return [...last, next];
            return last.map(item => {
              if (item.value !== next.value) return item;
              return {
                ...item,
                ...next,
              };
            });
          }
        });
      },
      [],
    );

    const ctx = useMemo<TabsConfig>(
      () => ({
        register,
        currentValue: currentTab,
      }),
      [currentTab],
    );

    const clickHandler = (tabValue: string) => {
      if (!value) {
        //uncontrolled
        setCurrentTab(tabValue);
      }
      onChange && onChange(tabValue);
    };

    useEffect(() => {
      //controlled component
      if (value) {
        setCurrentTab(value);
      }
    }, [value]);

    return (
      <TabsContext.Provider value={ctx}>
        <div className={clsx('sirius-tabs', className)} {...props}>
          <header
            className={clsx(
              'sirius-tabs-header flex-vertical-center overflow-x-hidden flex-nowrap',
              showDivider && 'border-1px border-solid border-#eaeaea',
            )}
          >
            {tabs.map(({ value, disabled, ...extra }) => {
              return (
                <div
                  className={clsx(
                    'sirius-tabs-tab',
                    'cursor-pointer outline-0 capitalize text-1rem mx-1px select-none flex-vertical-center lh-1.25rem relative first-of-type-ml-0',
                    currentTab === value && 'active',
                    disabled && 'disabled',
                  )}
                  role="button"
                  key={value}
                  onClick={() => !disabled && clickHandler(value)}
                >
                  <TabsNav
                    variant={variant}
                    disabled={disabled}
                    active={currentTab === value}
                    {...extra}
                  ></TabsNav>
                </div>
              );
            })}
          </header>
          <div className={clsx('sirius-tabs-content pt-0.625rem')}>
            {children}
          </div>
        </div>
      </TabsContext.Provider>
    );
  },
);

export default Tabs as typeof Tabs & {
  Item: typeof TabsItem;
  Tab: typeof TabsItem;
};

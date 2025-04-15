import React, { useEffect, useMemo } from 'react';
import { useTabsContext, TabsConfig } from './tabs-context';

const TabsItem: React.FC<
  React.PropsWithChildren<{
    label: string | React.ReactNode;
    value: string;
    disabled?: boolean;
  }>
> = ({ children, value, label, disabled = false }) => {
  const { register, currentValue } = useTabsContext() as TabsConfig;
  const isActive = useMemo(() => currentValue === value, [currentValue, value]);

  useEffect(() => {
    register && register({ value, label, disabled });
  }, [value, label, disabled]);

  useEffect(() => {
    return () => {
      register && register({ remove: value });
    };
  }, []);

  return isActive ? <>{children}</> : null;
};

export default TabsItem;

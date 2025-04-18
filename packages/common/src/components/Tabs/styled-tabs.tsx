import clsx from 'clsx';
import Tabs, { TabsProps } from './tabs';
import TabsItem from './tabs-item';

export const StyledTabs = ({ className, ...props }: TabsProps) => {
  return (
    <Tabs
      {...props}
      className={clsx(
        'all-[.sirius-tabs-nav-label]:text-1.1429rem all-[.sirius-tabs-nav-label]:text-[rgba(11,19,46,0.6)] all-[.sirius-tabs-nav-label]:lh-1.7143rem all-[.sirius-tabs-nav-label]:font-500 all-[.sirius-tabs-nav-label]:px-0.2857rem all-[.sirius-tabs-nav-label]:py-0.5714rem`',
        'all-[.sirius-tabs-nav]:mx-0.5714rem',
        'all-[.sirius-tabs-nav-bottom]:h-0.4286rem all-[.sirius-tabs-nav-bottom]:rounded-tl-0.5714rem all-[.sirius-tabs-nav-bottom]:rounded-tr-0.5714rem',
        'all-[.sirius-tabs-tab.disabled]:hidden',
        'all-[.sirius-tabs-nav-label]-all-[.sirius-tabs-tab.active]:font-500 all-[.sirius-tabs-nav-label]-all-[.sirius-tabs-tab.active]:text-#0b132e',
        'all-[.sirius-tabs-nav-label]-all-[.sirius-tabs-tab:hover]:font-500 all-[.sirius-tabs-nav-label]-all-[.sirius-tabs-tab:hover]:text-#0b132e',
        'all-[.sirius-tabs-header]:overflow-visible lt-sm:all-[.sirius-tabs-header]:max-w-100vw lt-sm:all-[.sirius-tabs-header]:overflow-x-auto',
        'all-[.sirius-tabs-content]:mt-1.1rem all-[.sirius-tabs-content]:pt-0',
        className,
      )}
    />
  );
};

StyledTabs.Item = TabsItem;

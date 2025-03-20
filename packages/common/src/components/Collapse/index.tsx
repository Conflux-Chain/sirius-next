import clsx from 'clsx';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type ExpandIconPosition = 'left' | 'right' | undefined;
interface PanelProps {
  key: string | number;
  isActive?: boolean;
  header?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  forceRender?: boolean;
  disabled?: boolean;
  extra?: React.ReactNode;
  onClick?: () => void;
  expandIcon?: ((panelProps: PanelProps) => React.ReactNode) | false;
  expandIconPosition: ExpandIconPosition;
  children?: React.ReactNode;
}
interface CollapseProps {
  activeKey?: Array<string | number>;
  defaultActiveKey?: Array<string | number>;
  onChange?: (key: Array<string | number>) => void;
  style?: React.CSSProperties;
  className?: string;
  bordered?: boolean;
  expandIconPosition?: ExpandIconPosition;
  expandIcon?: ((panelProps: PanelProps) => React.ReactNode) | false;
  items: Array<
    | Omit<
        PanelProps,
        'isActive' | 'onClick' | 'expandIcon' | 'expandIconPosition'
      >
    | false
  >;
  ghost?: boolean;
}

const Panel: React.FC<PanelProps> = props => {
  const {
    isActive,
    header,
    className,
    style,
    onClick,
    expandIcon,
    forceRender = false,
    expandIconPosition,
    children,
  } = props;
  return (
    <div className={clsx('collapse-item', className)} style={style}>
      <div
        className={clsx(
          'collapse-header cursor-pointer relative lh-[1.5715] py-12px px-16px flex items-center',
          expandIconPosition === 'right' && 'py-12px pr-40px pl-16px',
        )}
        onClick={onClick}
      >
        {expandIcon && (
          <span
            className={clsx(
              'collapse-arrow inline-block mr-12px text-12px vertical--1px',
              expandIconPosition === 'right' &&
                'absolute right-16px left-auto m-0 top-50% translate-y-[-50%]',
            )}
          >
            {expandIcon(props)}
          </span>
        )}
        {header}
      </div>
      {(forceRender || isActive) && (
        <div
          className={clsx(
            'collapse-content overflow-hidden',
            isActive ? 'collapse-content-active' : 'h-0',
          )}
        >
          <div className="collapse-content-box p-[16px]">{children}</div>
        </div>
      )}
    </div>
  );
};

export const Collapse: React.FC<CollapseProps> = ({
  activeKey: outerActiveKeys,
  defaultActiveKey,
  onChange,
  items,
  style,
  bordered = true,
  className,
  ghost,
  expandIcon = ({ isActive }) => (
    <ChevronDown size={16} className={clsx(!isActive && 'rotate-270')} />
  ),
  expandIconPosition = 'left',
}) => {
  const [activeKeys, setActiveKeys] = useState(defaultActiveKey || []);
  const keys = outerActiveKeys || activeKeys;
  const handleClick = (key: string | number) => {
    const newActiveKeys = keys.includes(key)
      ? keys.filter(k => k !== key)
      : [...keys, key];
    setActiveKeys(newActiveKeys);
    onChange?.(newActiveKeys);
  };
  return (
    <div
      className={clsx(
        'collapse rounded-2px text-[rgba(0,0,0,.85)] text-14px',
        bordered &&
          !ghost &&
          'collapse-border border-1px border-solid border-[#d9d9d9] border-b-0 all-[.collapse-item]:border-b-1px all-[.collapse-item]:border-b-solid all-[.collapse-item]:border-b-[#d9d9d9] all-[.collapse-content]:border-t-1px all-[.collapse-content]:border-t-solid all-[.collapse-content]:border-t-[#d9d9d9]',
        ghost ? 'collapse-ghost bg-transparent border-0' : 'bg-[#fafafa]',
        className,
      )}
      style={style}
    >
      {items?.map(item => {
        if (!item) return null;
        return (
          <Panel
            {...item}
            expandIconPosition={expandIconPosition}
            expandIcon={expandIcon}
            isActive={keys.includes(item.key)}
            onClick={() => handleClick(item.key)}
          />
        );
      })}
    </div>
  );
};

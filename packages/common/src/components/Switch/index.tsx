import clsx from 'clsx';
import { FC, ComponentProps, useState } from 'react';

interface SwitchProps
  extends Omit<ComponentProps<'button'>, 'onChange' | 'children'> {
  size?: 'default' | 'small';
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Switch: FC<SwitchProps> = ({
  size = 'default',
  className,
  style,
  checked: outerChecked,
  onChange,
  disabled,
  ...rest
}) => {
  const isSmallSize = size === 'small';
  const [innerChecked, setInnerChecked] = useState(false);
  const checked = outerChecked ?? innerChecked;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      className={clsx(
        'sirius-switch m-0 p-0 text-#333 text-14px relative inline-block vertical-middle cursor-pointer rounded-100px border-0 transition-all duration-200',
        checked ? 'bg-[var(--theme-color-link)]' : 'bg-[rgba(0,0,0,0.25)]',
        isSmallSize ? 'min-w-28px h-16px lh-16px' : 'min-w-44px h-22px lh-22px',
        className,
      )}
      style={{
        userSelect: 'none',
        ...style,
      }}
      onClick={() => {
        setInnerChecked(!checked);
        onChange?.(!checked);
      }}
      disabled={disabled}
      {...rest}
    >
      <div
        className={clsx(
          'sirius-switch-handle absolute top-2px transition-all duration-200 ease-in-out',
          'before:absolute before:content-empty before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-#fff before:shadow-[0_2px_4px_0_rgba(0,35,11,0.2)] before:rounded-9px before:transition-all before:duration-200 before:ease-in-out',
          {
            'left-2px': !checked,
            'w-18px h-18px': !isSmallSize,
            'left-[calc(100%-18px-2px)]': checked && !isSmallSize,
            'w-12px h-12px': isSmallSize,
            'left-[calc(100%-12px-2px)]': checked && isSmallSize,
          },
        )}
      ></div>
      <span
        className={clsx(
          'sirius-switch-inner block text-#fff text-12px transition-margin duration-200',
          size === 'small' ? 'mr-18px ml-5px my-0' : 'mr-18px ml-5px my-0',
          {
            'my-0 mr-25px ml-7px': checked && !isSmallSize,
            'my-0 mr-7px ml-25px': !checked && !isSmallSize,
            'my-0 mr-18px ml-5px': checked && isSmallSize,
            'my-0 mr-5px ml-18px': !checked && isSmallSize,
          },
        )}
      ></span>
    </button>
  );
};

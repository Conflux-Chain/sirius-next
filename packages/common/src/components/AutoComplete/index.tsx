import React, { useEffect, useState } from 'react';
import { Popover } from '../Popover';
import clsx from 'clsx';

interface AutoCompleteProps {
  onChange: (value: string) => void;
  optionsClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  options: {
    label: React.ReactNode;
    value: string;
  }[];
  prefix?: React.ReactNode;
}

const AutoComplete: React.FC<
  AutoCompleteProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'prefix'>
> = ({
  onChange,
  options,
  disabled,
  optionsClassName,
  popoverClassName,
  className,
  prefix,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      // fix input focus
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);
  return (
    <Popover
      content={
        <div className="flex flex-col gap-8px">
          {options.map(option => (
            <div
              className={clsx(
                'cursor-pointer bg-[#fff] hover:bg-[#f1f3f5] min-w-80px',
                optionsClassName,
              )}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      }
      containerClassName={popoverClassName}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      open={open}
    >
      <div
        className={clsx(
          'inline-flex items-center border-1 border-solid border-[rgb(118,118,118)]',
          className,
        )}
      >
        {prefix}
        <input
          onChange={e => onChange(e.target.value)}
          ref={inputRef}
          className="w-0 flex-1 border-none outline-none"
          {...props}
        />
      </div>
    </Popover>
  );
};

export { AutoComplete };

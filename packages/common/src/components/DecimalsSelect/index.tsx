import React, { useState } from 'react';
import clsx from 'clsx';
import { Popover } from '../Popover';
import { Check, ChevronUp } from 'lucide-react';

const Value: React.FC<{
  value?: number;
  mode: 'decimals' | 'pow';
}> = ({ mode, value }) => {
  if (mode === 'pow')
    return (
      <span>
        10 <sup>{value}</sup>
      </span>
    );
  return value;
};

const CustomOption: React.FC<{
  onChange: (value: string) => void;
  value?: number | string;
  mode: 'decimals' | 'pow';
}> = ({ onChange, mode, ...props }) => {
  return (
    <div className="w-full flex items-center gap-10px">
      {mode === 'pow' && '10^'}
      <input
        className={clsx('w-0 flex-1')}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

const defaultOptions = [18, 8, 6];

type DecimalsSelectProps = {
  value?: number;
  onChange: (value?: number) => void;
  max?: number;
  placeholder?: string;
  className?: string;
  optionsClassName?: string;
  popoverClassName?: string;
  mode?: 'decimals' | 'pow';
  options?: number[];
};

export const DecimalsSelect = ({
  max,
  onChange,
  optionsClassName,
  popoverClassName,
  className,
  placeholder,
  value,
  options = defaultOptions,
  mode = 'decimals',
}: DecimalsSelectProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() =>
    options.find(option => option === value),
  );
  const handleDecimalsChange = (value: string) => {
    if (!value) {
      onChange(undefined);
      return;
    }
    let num = Number(value);
    if (value.includes('-') || value.includes('.') || isNaN(num)) return;
    if (max && num > max) num = max;
    if (num < 0) num = 0;
    setSelected(undefined);
    onChange(num);
  };
  return (
    <Popover
      content={
        <div className="flex flex-col gap-8px w-76px">
          {options.map(option => (
            <div
              className={clsx(
                'cursor-pointer bg-[#fff] hover:bg-[#f1f3f5] w-full flex items-center justify-between',
                optionsClassName,
              )}
              key={option}
              onClick={() => {
                setSelected(option);
                onChange(option);
                setOpen(false);
              }}
            >
              <Value mode={mode} value={option} />
              {option === selected && <Check className="w-16px h-16px" />}
            </div>
          ))}
          <div className={clsx('bg-[#fff] w-full', optionsClassName)}>
            <CustomOption
              onChange={handleDecimalsChange}
              value={selected === undefined && value !== undefined ? value : ''}
              mode={mode}
            />
          </div>
        </div>
      }
      containerClassName={popoverClassName}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      open={open}
      positioning={{
        placement: 'auto',
      }}
    >
      <div
        className={clsx(
          'inline-flex justify-between items-center px-8px h-24px w-100px cursor-pointer',
          'border-1 border-solid border-#E8E9EA rounded-2px',
          className,
        )}
      >
        <span>
          {value === undefined ? (
            placeholder
          ) : (
            <Value mode={mode} value={value} />
          )}
        </span>
        <ChevronUp className={clsx('w-12px h-12px', !open && 'rotate-180')} />
      </div>
    </Popover>
  );
};

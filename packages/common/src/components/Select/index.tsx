import React, { useMemo, useCallback } from 'react';
import {
  Select as RadixUISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from './select';
import { cn } from '../../utils';
import { debounce } from 'lodash';

interface SelectProps {
  className?: string;
  disableMatchWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  value?: string;
  onChange: (value: string) => void;
  width?: string | number;
  children: React.ReactNode;
  lable?: string;
  disabled?: boolean;
}

interface OptionProps {
  className?: string;
  children: React.ReactNode;
  value: string;
}
const Select: React.FC<SelectProps> & { Option: React.FC<OptionProps> } = ({
  className = '',
  disableMatchWidth = true,
  size = 'medium',
  value = '',
  onChange,
  width = 'auto',
  children,
  lable = '',
  ...props
}) => {
  const selectedText = useMemo(() => {
    let text = 'Select an option...';
    React.Children.forEach(children, child => {
      if (React.isValidElement(child) && child.props.value === value) {
        text = child.props.children;
      }
    });
    return text;
  }, [value, children]);

  const handleValueChange = debounce(value => {
    onChange(value);
  }, 300);

  return (
    <RadixUISelect value={value} onValueChange={handleValueChange}>
      <SelectTrigger
        className={cn(
          'bg-blue-04 hover:bg-blue-08 text-[#8890a4]',
          size === 'small' && 'h-8 text-xs',
          size === 'medium' && 'h-10 text-sm',
          size === 'large' && 'h-12 text-lg',
          className,
        )}
        style={{ width }}
        {...props}
      >
        {lable ? lable : <SelectValue>{selectedText}</SelectValue>}
      </SelectTrigger>
      <SelectContent
        className={cn(
          'relative z-50 max-h-96 overflow-hidden rounded-md bg-[#FFF] shadow-md',
          !disableMatchWidth && 'w-full',
        )}
      >
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </RadixUISelect>
  );
};

const Option: React.FC<OptionProps> = ({
  className = '',
  children,
  value,
  ...props
}: OptionProps) => (
  <SelectItem value={value} className={className} {...props}>
    {children}
  </SelectItem>
);
Option.displayName = 'Option';

Select.Option = Option;

export { Select };

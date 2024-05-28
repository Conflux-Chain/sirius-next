import React, { useMemo } from 'react';
import {
  Select as RadixUISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from './select';
import { cn } from '../../utils';

interface SelectProps {
  className?: string;
  disableMatchWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  value: string;
  onChange: (value: string) => void;
  width?: string | number;
  children: React.ReactNode;
}

interface OptionProps {
  className?: string;
  children: React.ReactNode;
  value: string;
}

const Select: React.FC<SelectProps> & { Option: React.FC<OptionProps> } = ({
  className,
  disableMatchWidth,
  size = 'medium',
  value,
  onChange,
  width = 'auto',
  children,
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
  console.log(children);
  return (
    <RadixUISelect value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'bg-[rgba(30, 61, 228, 0.04)] hover:bg-[rgba(30, 61, 228, 0.08)]',
          size === 'small' && 'h-8 text-xs',
          size === 'medium' && 'h-10 text-sm',
          size === 'large' && 'h-12 text-lg',
          className,
        )}
        style={{ width }}
        {...props}
      >
        <SelectValue>{selectedText}</SelectValue>
      </SelectTrigger>
      <SelectContent
        className={cn(
          'relative z-50 max-h-96 overflow-hidden rounded-md bg-[#FFF] shadow-md',
          !disableMatchWidth && 'w-full',
        )}
      >
        <SelectGroup>
          {React.Children.map(children, child => {
            console.log(child);
            if (React.isValidElement(child)) {
              const props = child.props;
              return <Option {...props}>{child}</Option>;
            }
            return null;
          })}
        </SelectGroup>
      </SelectContent>
    </RadixUISelect>
  );
};

const Option: React.FC<OptionProps> = React.forwardRef<
  HTMLDivElement,
  OptionProps
>(({ className, children, value, ...props }, ref) => (
  <SelectItem ref={ref} value={value} className={cn('', className)} {...props}>
    {children}
  </SelectItem>
));

Option.displayName = 'Option';

Select.Option = Option;

export { Select };

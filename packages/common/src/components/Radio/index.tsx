import * as RadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils';

interface RadioOption<T> {
  label: string;
  value: T;
}

interface RadioProps<T extends string> {
  options: RadioOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  name?: string;
  className?: string;
}

interface RadioItemProps<T extends string> {
  value: T;
  label: string;
  className?: string;
}

export const RadioItem = <T extends string>({
  value,
  label,
  className,
}: RadioItemProps<T>) => {
  return (
    <label
      key={value}
      className={cn(
        'flex items-center gap-[4px] cursor-pointer group',
        className,
      )}
    >
      <RadioGroup.Item
        value={value}
        className="w-[16px] h-[16px] rounded-full border-[1px] bg-[#FAFAFF] outline-none cursor-pointer overflow-hidden"
      >
        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full rounded-full bg-[#1E3DE4] relative after:content-[''] after:block after:w-[8px] after:h-[8px] after:rounded-full after:bg-[#fff]" />
      </RadioGroup.Item>
      <span className="text-[16px] lt-sm:text-[14px] font-450 lh-[18px] text-[#777791] group-has-[[data-state=checked]]:text-[#26244B]">
        {label}
      </span>
    </label>
  );
};

export const Radio = <T extends string>({
  options,
  value,
  onChange,
  name,
  className,
}: RadioProps<T>) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      name={name}
      aria-label={name}
      className={cn('flex gap-[16px]', className)}
    >
      {options.map(option => (
        <RadioItem
          key={option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </RadioGroup.Root>
  );
};

import BigNumber from 'bignumber.js';
import { cn, getIncreasePercent } from 'src/utils';

const isValueProps = (props: unknown): props is ValueProps =>
  'value' in (props as ValueProps);

interface BaseProps {
  className?: string;
}

interface ValueProps {
  value: string;
}
interface CalcProps {
  base: string | number | BigNumber;
  prev: string | number | BigNumber;
  precision?: number;
}

type Props = CalcProps | ValueProps;

export const IncreasePercent: React.FC<Props & BaseProps> = ({
  className,
  ...props
}) => {
  const value = isValueProps(props)
    ? props.value
    : getIncreasePercent(props.base, props.prev, props.precision);
  const isNegative = value[0] === '-';
  return (
    <span
      className={cn(
        isNegative ? 'text-[#C65252]' : 'text-[#00CE7D]',
        className,
      )}
    >
      {value}
    </span>
  );
};

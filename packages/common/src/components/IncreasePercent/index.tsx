import BigNumber from 'bignumber.js';
import { cn, getIncreasePercent } from 'src/utils';
import { NegativeArrow, PositiveArrow } from './Icons';

const isValueProps = (props: unknown): props is ValueProps =>
  'value' in (props as ValueProps);

interface BaseProps {
  className?: string;
  /** show + while value is positive */
  showPlus?: boolean;
  showArrow?: boolean;
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
  showPlus,
  showArrow,
  ...props
}) => {
  const value = isValueProps(props)
    ? props.value
    : getIncreasePercent(props.base, props.prev, props.precision).percent;
  const isNegative = value[0] === '-';
  return (
    <span
      className={cn(
        'inline-flex items-center',
        isNegative ? 'text-[#FA5D5D]' : 'text-[#4AC2AB]',
        className,
      )}
    >
      {showArrow &&
        (isNegative ? (
          <NegativeArrow className="mr-4px" />
        ) : (
          <PositiveArrow className="mr-4px" />
        ))}
      {!isNegative && showPlus && '+'}
      {value}
    </span>
  );
};

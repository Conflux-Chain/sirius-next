import { useMemo, useState } from 'react';
import imgArrow from '../../images/two-arrow.png';
import { formatBalance } from '../../utils';
import { DecimalsSelect } from '../DecimalsSelect';

interface IntValueFormatterProps {
  value?: any;
  maxDecimals?: number;
}

export const IntValueFormatter = ({
  value,
  maxDecimals,
}: IntValueFormatterProps) => {
  const [decimals, setDecimals] = useState<number | undefined>(18);
  const floatValue = useMemo(() => {
    if (value === null || value === undefined || value === '') return '';
    const str = value.toString();
    return formatBalance(str, Number(decimals ?? 0), true);
  }, [value, decimals]);
  return (
    <div className="flex items-center pl-7px my-8px gap-8px flex-wrap">
      <span className="inline-block w-110px">Select Decimals</span>
      <DecimalsSelect
        onChange={setDecimals}
        value={decimals}
        max={maxDecimals}
        placeholder="Select"
      />
      <img
        src={imgArrow}
        alt=""
        className="inline-block w-10px mr-3px ml-8px"
      />
      <span className="text-#97a3b4 font-italic">Float value</span>
      <span>{floatValue}</span>
    </div>
  );
};

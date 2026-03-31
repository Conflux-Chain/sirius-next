import { useMemo } from 'react';
import { hex2utf8 } from '../../utils';

interface Props {
  data: string;
}

export const UTF8 = ({ data }: Props) => {
  const str = useMemo(() => {
    try {
      return hex2utf8(data.startsWith('0x') ? data.substr(2) : data);
    } catch (e) {}
  }, [data]);

  return (
    <div className="m-initial h-13.2857rem overflow-y-auto text-#97a3b4 bg-#fafbfc px-0.7143rem font-inherit">
      <p>{str}</p>
    </div>
  );
};

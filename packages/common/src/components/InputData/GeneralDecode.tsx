import { words } from 'lodash';
import { useMemo } from 'react';

export const GeneralDecode = ({
  data = '',
  fullName,
  includeMethodID = true,
}: {
  data: string;
  fullName?: string;
  includeMethodID?: boolean;
}) => {
  const originalDataSlice = useMemo(() => {
    return includeMethodID ? data.slice(10) : data.slice(2);
  }, [data, includeMethodID]);
  const canGeneralDecode = originalDataSlice.length % 64 === 0;
  const sliceWords = useMemo(() => {
    return words(originalDataSlice, /.{64}/g);
  }, [originalDataSlice]);

  const baseWidth = ((originalDataSlice.length - 1).toString().length - 1) * 10;

  return (
    <div className="m-initial h-13.2857rem overflow-y-auto text-#97a3b4 bg-#fafbfc px-0.7143rem font-[var(--theme-monospace-font)]">
      {fullName && (
        <>
          <div>Function: {fullName}</div>
          <br />
        </>
      )}
      {includeMethodID && <div>MethodID: {data.slice(0, 10)}</div>}
      <div>
        {canGeneralDecode
          ? sliceWords.map((o, index) => {
              return (
                <div key={index}>
                  <span
                    className="inline-block"
                    style={{
                      width: `${35 + baseWidth}px`,
                    }}
                  >{`[${index}]: `}</span>
                  {o}
                </div>
              );
            })
          : data}
      </div>
    </div>
  );
};

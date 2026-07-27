/**
 *
 * OutputParams Component
 *
 */
import { Fragment } from 'react';
interface Props {
  outputs?: {
    name?: string;
    type?: string;
  }[];
}

export const OutputParams = ({ outputs }: Props) => {
  const count = outputs ? outputs.length : 0;
  return (
    <div className="my-8px">
      <span className="text-14px text-#002257 lh-22px">Return:</span>
      <span className="inline-block ml-8px text-#97a3b4 lh-22px text-14px">
        {outputs?.map((value, index) => {
          return (
            <Fragment key={index}>
              <span>
                {value.name} <i>({value.type})</i>
              </span>
              {index !== count - 1 && <span>, </span>}
            </Fragment>
          );
        })}
      </span>
    </div>
  );
};

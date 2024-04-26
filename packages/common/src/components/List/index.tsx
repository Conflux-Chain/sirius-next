/**
 *
 * List
 *
 */
import React from 'react';
import { useBreakpoint } from '../../utils/media';
import { Skeleton } from '../Skeleton';
import { Card } from '../Card';
import { Description, DescriptionProps } from '../Description';
import clsx from 'clsx';

interface ListProps {
  list: Array<DescriptionProps | null>;
  className?: string;
}

export const List: React.FC<ListProps> = ({ list, className }) => {
  const bp = useBreakpoint();
  const isS = bp === 's';

  const noBorder = (index: number) => {
    const length = list.length;
    // mobile one column
    if (isS && index === length - 1) {
      return true;
    }
    // pc
    if (index % 2 === 0) {
      if (index === length - 1 || index === length - 2) {
        return true;
      }
    } else {
      if (index === length - 1) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <Card
        className={clsx('sirius-list-card', className)}
        contentClassName="flex flex-wrap justify-between"
      >
        {list.map((item, index) => (
          <Description
            key={`desc_${index}`}
            size="small"
            className={clsx(
              'w-48% lt-sm:w-full',
              item == null && 'lt-sm:hidden',
            )}
            title={item != null ? item.title : ''}
            noBorder={item != null ? noBorder(index) : true}
          >
            {item != null ? item.children || <Skeleton /> : null}
          </Description>
        ))}
      </Card>
    </div>
  );
};

import React from 'react';
import { InfoIcon } from './InfoIcon';
import { Tooltip } from '../Tooltip';
import clsx from 'clsx';

export const InfoIconWithTooltip = ({
  info,
  size = 14,
  children = null,
}: {
  info: React.ReactNode;
  size?: number;
  children?: React.ReactNode;
}) => {
  const title =
    typeof info === 'string'
      ? info.split('\n').map(i => <div key={i}>{i}</div>)
      : info;
  return (
    <span className={clsx('inline-flex items-center')}>
      {children ? <span className="mr-0.2857rem">{children}</span> : null}
      <Tooltip title={title}>
        <span>
          <InfoIcon size={size} />
        </span>
      </Tooltip>
    </span>
  );
};

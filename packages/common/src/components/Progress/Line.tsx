import React from 'react';
import { validProgress } from './utils';
import { BaseProgressProps } from './types';
import clsx from 'clsx';

export interface LineProps extends BaseProgressProps {
  trailColor?: string;
}

const Line: React.FC<LineProps & React.PropsWithChildren> = props => {
  const {
    percent,
    strokeWidth,
    size,
    strokeColor,
    strokeLinecap,
    children,
    trailColor,
  } = props;

  const percentStyle = {
    width: `${validProgress(percent)}%`,
    height: strokeWidth || (size === 'small' ? 6 : 8),
    borderRadius: strokeLinecap === 'square' ? 0 : '',
    background: strokeColor,
  } as React.CSSProperties;

  return (
    <>
      <div className={clsx('sirius-progress-outer', 'inline-block w-full')}>
        <div
          className={clsx(
            'sirius-progress-inner',
            'relative inline-block w-full overflow-hidden vertical-middle bg-#f5f5f5 rounded-100px',
          )}
          style={{
            backgroundColor: trailColor,
          }}
        >
          <div
            className={clsx(
              'sirius-progress-bg',
              'relative bg-#1e3de4 rounded-100px duration-400 transition-property-all transition-ease-in-out',
            )}
            style={percentStyle}
          />
        </div>
      </div>
      {children}
    </>
  );
};

export default Line;

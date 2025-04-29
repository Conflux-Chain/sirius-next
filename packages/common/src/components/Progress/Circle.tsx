import * as React from 'react';
import clsx from 'clsx';
import { getPathStyles, validProgress } from './utils';
import { BaseProgressProps } from './types';

export interface CircleProps extends BaseProgressProps {
  width?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  gapDegree?: number;
  type: 'circle' | 'dashboard';
}

const Circle: React.FC<CircleProps & React.PropsWithChildren> = props => {
  const {
    width,
    strokeWidth = 1,
    trailColor = '#d9d9d9',
    strokeLinecap = 'round',
    gapPosition,
    gapDegree: _gapDegree,
    type,
    percent: _percent = 0,
    strokeColor,
    children,
  } = props;
  const percent = validProgress(_percent);
  const circleSize = width || 120;
  const circleStyle = {
    width: circleSize,
    height: circleSize,
    fontSize: circleSize * 0.15 + 6,
  } as React.CSSProperties;
  const circleWidth = strokeWidth || 6;
  const gapPos = gapPosition || (type === 'dashboard' && 'bottom') || 'top';

  const getGapDegree = () => {
    if (_gapDegree || _gapDegree === 0) {
      return _gapDegree;
    }
    if (type === 'dashboard') {
      return 75;
    }
    return undefined;
  };
  const gapDegree = getGapDegree();
  const { pathString, pathStyle } = getPathStyles(
    0,
    100,
    trailColor,
    circleWidth,
    gapDegree,
    gapPos,
  );
  const pathStyles = getPathStyles(
    0,
    percent,
    strokeColor,
    circleWidth,
    gapDegree,
    gapPos,
  );

  return (
    <div
      className={clsx(
        'sirius-progress-inner',
        'relative inline-block w-full overflow-hidden vertical-middle rounded-100px lh-[1] bg-transparent',
      )}
      style={circleStyle}
    >
      <svg className="sirius-progress-circle" viewBox="0 0 100 100">
        <path
          className={clsx(`sirius-progress-circle-trail`, 'stroke-#f5f5f5')}
          d={pathString}
          stroke={trailColor}
          strokeLinecap={strokeLinecap}
          strokeWidth={circleWidth}
          fillOpacity="0"
          style={pathStyle}
        />
        <path
          className={clsx(`sirius-progress-circle-path`, 'stroke-#1e3de4')}
          d={pathStyles.pathString}
          strokeLinecap={strokeLinecap}
          strokeWidth={circleWidth}
          opacity={percent === 0 ? 0 : 1}
          fillOpacity="0"
          style={pathStyles.pathStyle}
        />
      </svg>
      {children}
    </div>
  );
};

export default Circle;

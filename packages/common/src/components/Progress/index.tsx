import clsx from 'clsx';
import Line, { LineProps } from './Line';
import { validProgress } from './utils';
import Circle, { CircleProps } from './Circle';

type TypeProps =
  | (LineProps & { type?: 'line' })
  | (CircleProps & { type?: 'circle' | 'dashboard' });

export const Progress: React.FC<
  TypeProps & {
    className?: string;
    style?: React.CSSProperties;
    showInfo?: boolean;
    format?: (percent?: number) => React.ReactNode;
  }
> = ({
  type = 'line',
  percent,
  className,
  style,
  showInfo = true,
  format = percentNumber => `${percentNumber}%`,
  ...rest
}) => {
  const renderProcessInfo = () => {
    if (!showInfo) {
      return null;
    }
    const text = format(validProgress(percent));
    return (
      <span
        className={clsx(
          'sirius-progress-text',
          'inline-block text-#333 text-1em lh-[1] vertical-middle wb-normal',
          type === 'circle' || type === 'dashboard'
            ? 'absolute top-50% left-50% -translate-x-1/2 -translate-y-1/2 ws-normal text-center w-full'
            : 'ws-nowrap text-left w-2em ml-8px',
        )}
        title={typeof text === 'string' ? text : undefined}
      >
        {text}
      </span>
    );
  };
  const progressInfo = renderProcessInfo();
  let progress: React.ReactNode;
  if (type === 'line') {
    progress = (
      <Line percent={percent} {...rest}>
        {progressInfo}
      </Line>
    );
  } else if (type === 'circle' || type === 'dashboard') {
    progress = (
      <Circle type={type} percent={percent} {...rest}>
        {progressInfo}
      </Circle>
    );
  }
  return (
    <div
      className={clsx(
        'sirius-progress',
        'text-#333 lh-[1.5715] inline-block',
        type === 'line' && 'relative w-[100%]',
        type === 'line' && rest.size === 'small' ? 'text-12px' : 'text-14px',
        className,
      )}
      style={style}
    >
      {progress}
    </div>
  );
};

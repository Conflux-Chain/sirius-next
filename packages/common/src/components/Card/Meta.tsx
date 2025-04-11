import clsx from 'clsx';
import { FC } from 'react';

interface MetaProps {
  style?: React.CSSProperties;
  className?: string;
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const Meta: FC<MetaProps> = ({
  avatar,
  title,
  description,
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx('sirius-meta flex flex-row-reverse my-[-4px]', className)}
      {...rest}
    >
      {avatar && (
        <div className="sirius-meta-avatar float-left pr-16px">{avatar}</div>
      )}
      {(title || description) && (
        <div className="sirius-meta-detail overflow-hidden">
          {title && (
            <div
              className={clsx(
                'sirius-meta-title text-[rgba(0,0,0,0.85)] font-500 text-16px truncate',
                description && 'mb-8px',
              )}
            >
              {title}
            </div>
          )}
          {description && (
            <div className="sirius-meta-description text-[rgba(0,0,0,0.45)]">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

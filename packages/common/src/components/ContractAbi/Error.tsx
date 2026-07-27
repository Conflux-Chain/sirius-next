/**
 *
 * Error Component
 *
 */
import clsx from 'clsx';

interface ErrorProps {
  message?: string;
}

export const Error = ({ message }: ErrorProps) => {
  return (
    <>
      <div
        className={clsx(
          'my-8px text-12px text-#e64e4e lh-16px',
          `${message ? 'visible' : 'invisible'}`,
        )}
      >
        {message}
      </div>
    </>
  );
};

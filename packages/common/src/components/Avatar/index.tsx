import clsx from 'clsx';
import { FC } from 'react';

export const Avatar: FC<{
  src?: React.ReactNode;
  alt?: string;
  className?: string;
}> = ({ src, alt, className }) => {
  return (
    <span
      className={clsx(
        'sirius-avatar',
        'inline-block bg-transparent text-#fff text-14px relative overflow-hidden ws-nowrap text-center align-middle w-32px h-32px lh-32px rounded-full',
        className,
      )}
    >
      {typeof src === 'string' ? (
        <img className="block w-full h-full object-cover" src={src} alt={alt} />
      ) : (
        src
      )}
    </span>
  );
};

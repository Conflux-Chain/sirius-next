import clsx from 'clsx';

export const Divider: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={clsx(
        'w-auto max-w-full h-1px my-16px relative bg-#eee',
        className,
      )}
    ></div>
  );
};

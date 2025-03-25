import clsx from 'clsx';

export const Divider: React.FC<{
  className?: string;
  children?: React.ReactNode;
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'right' | 'center';
}> = ({ className, children, orientation = 'center', type = 'horizontal' }) => {
  return (
    <div
      className={clsx(
        'divider m-0 p-0 border-0px border-t-[rgba(0,0,0,0.06)] border-t-solid',
        type === 'horizontal'
          ? 'divider-horizontal flex clear-both w-full min-w-full my-24px'
          : 'divider-vertical relative top-[-0.06rm] inline-block h-0.9em mx-8px vertical-middle',
        children
          ? 'my-16px text-[rgba(0,0,0,0.85)] font-500 text-16px text-center ws-nowrap before:content-[""] before:relative before:top-50% before:w-50% before:border-t-1px before:border-t-solid before:border-t-color-inherit before:translate-y-50% after:content-[""] after:relative after:top-50% after:w-50% after:border-t-1px after:border-t-solid after:border-t-color-inherit after:translate-y-50%'
          : 'my-24px text-[#333] text-14px border-t-1px',
        children && orientation === 'left' && '!before:w-5% !after:w-95%',
        children && orientation === 'right' && '!before:w-95% !after:w-5%',
        className,
      )}
      role="separator"
    >
      {children && <span className="inline-block px-1em">{children}</span>}
    </div>
  );
};

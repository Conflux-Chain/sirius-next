import clsx from 'clsx';
import { X } from 'lucide-react';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'green' | 'red' | 'default';
  closable?: boolean;
  onClose?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  children,
  className,
  color,
  closable,
  onClose,
  ...props
}) => {
  return (
    <span
      className={clsx(
        'sirius-tag text-12px lh-20px ws-nowrap border-1px border-solid rounded-2px opacity-100 inline-block h-auto mr-8px px-7px transition-all duration-300',
        (!color || color === 'default') &&
          'bg-#fafafa border-#d9d9d9 text-#333',
        color && `sirius-tag-${color}`,
        color === 'green' && 'bg-#f3fff0 border-#effced text-#5bb05d',
        color === 'red' && 'bg-#fff3f0 border-#ffe1db text-#ba403d',
        className,
      )}
      {...props}
    >
      {children}
      {closable && (
        <span
          className="ml-7px cursor-pointer text-[rgba(0,0,0,0.45)] text-10px transition-all duration-300 inline-block text-center lh-0"
          onClick={onClose}
        >
          <X className="w-1em h-1em inline-block" />
        </span>
      )}
    </span>
  );
};

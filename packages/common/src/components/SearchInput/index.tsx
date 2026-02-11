import { ComponentProps } from 'react';
import { InfoIconWithTooltip } from '../InfoIconWithTooltip';
import clsx from 'clsx';

const Arrow: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    {...props}
  >
    <path
      d="M0.75 0.75L4.78922 4.75L8.82843 0.75"
      stroke="#74798C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Close: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
  >
    <path
      d="M7.91671 2.08331L2.08337 7.91665"
      stroke="#74798C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.08337 2.08331L7.91671 7.91665"
      stroke="#74798C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchInput: React.FC<
  ComponentProps<'input'> & {
    findNext: () => void;
    findPrevious: () => void;
    current: number | null;
    total: number | null;
    wrapperClassName?: string;
    searchTips?: string;
    inSearch?: boolean;
    exit?: () => void;
  }
> = ({
  current,
  total,
  className,
  wrapperClassName,
  inSearch,
  searchTips,
  findNext,
  findPrevious,
  exit,
  onKeyDown,
  ...props
}) => {
  return (
    <div className={clsx('flex items-center w-fit', wrapperClassName)}>
      {!inSearch && searchTips && (
        <div className="flex-center h-full mr-3px shrink-0">
          <InfoIconWithTooltip info={searchTips} size={18} />
        </div>
      )}
      <div
        className={clsx(
          'flex items-center flex-1 bg-#fff border-#BDBDBD border-1px border-solid rounded-4px',
        )}
      >
        <div
          className={clsx(
            'px-5px w-160px h-26px flex items-center gap-5px',
            className,
          )}
        >
          <input
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'ArrowDown') {
                findNext();
                e.preventDefault();
              }
              if (e.key === 'ArrowUp') {
                findPrevious();
                e.preventDefault();
              }
              onKeyDown?.(e);
            }}
            className="outline-none border-none flex-1 w-0"
            {...props}
          />
          {!!current && !!total && (
            <div className="shrink-0">
              {current}/{total}
            </div>
          )}
        </div>
        <div
          onClick={findNext}
          className="border-l-#BDBDBD border-l-1px border-l-solid w-26px h-26px flex-center cursor-pointer"
        >
          <Arrow />
        </div>
        <div
          onClick={findPrevious}
          className="border-l-#BDBDBD border-l-1px border-l-solid w-26px h-26px flex-center cursor-pointer"
        >
          <Arrow className="rotate-180" />
        </div>
        {inSearch && (
          <div
            onClick={exit}
            className="border-l-#BDBDBD border-l-1px border-l-solid w-26px h-26px flex-center cursor-pointer"
          >
            <Close />
          </div>
        )}
      </div>
    </div>
  );
};

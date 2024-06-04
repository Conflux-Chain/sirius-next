import { memo } from 'react';
import { Divider } from '../Divider';
import clsx from 'clsx';

interface Props {
  rightTop: JSX.Element[];
  rightBottom: JSX.Element[];
  left: JSX.Element[];
}

export const Footer = memo(({ rightBottom, rightTop, left }: Props) => {
  return (
    <div
      className={clsx(
        'bg-[var(--theme-color-foot-bg)] w-100vw max-w-100% flex items-start p-2.2857rem box-border',
        'lt-sm:py-1.14rem lt-sm:px-0.93rem',
      )}
    >
      <div className="flex items-stretch grow-1 mx-auto max-w-1368px box-border">
        <div className="mr-2.93rem flex flex-col lt-md:hidden" key="left">
          {left}
        </div>
        <div className="grow-2 lt-sm:p-0" key="right">
          <div className="lt-sm:px-0.21rem" key="right-top">
            {rightTop}
          </div>
          <Divider
            key="divider"
            className={clsx(
              'footer-bottom-divider',
              'bg-#d1d5ea! mt-1.07rem mb-0.57rem lt-sm:mt-0.79rem lt-sm:mb-0.29rem',
            )}
          />
          <div className="flex lt-sm:px-0.21rem" key="right-bottom">
            {rightBottom}
          </div>
        </div>
      </div>
    </div>
  );
});

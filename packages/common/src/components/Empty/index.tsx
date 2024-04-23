import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../store';
import imgTableWhoops from '../../images/table-whoops.png';

interface Props {
  show: boolean;
  type?: 'fixed' | 'fluid';
  title?: string | null;
  noTitle?: boolean;
  description?: string | null;
  className?: string;
  children?: React.ReactNode;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>;
export type EmptyProps = Props & NativeAttrs;

export const Empty = ({
  show,
  type = 'fluid',
  className,
  title,
  noTitle = false,
  description,
  children,
  ...others
}: EmptyProps) => {
  const { t } = useTranslation();
  const { translations } = useI18n();
  return (
    <div
      className={clsx(
        'empty',
        'top-0 left-0 right-0 bottom-0 flex-col justify-center items-center min-h-16.4286rem',
        show ? 'flex' : 'hidden',
        type === 'fluid' ? 'relative' : 'absolute',
        className,
      )}
      {...others}
    >
      <img className="w-6rem h-8.5714rem" src={imgTableWhoops} alt="no data" />
      {noTitle ? (
        <p className="noTitle" />
      ) : (
        <p className="text-1.5714rem font-medium text-#000 lh-2rem">
          {title || t(translations.general.table.whoops)}
        </p>
      )}
      <h1 className="text-1rem font-medium text-#4b4b4b lh-1.2857rem opacity-40">
        {description || t(translations.general.table.noData)}
      </h1>
      {children}
    </div>
  );
};

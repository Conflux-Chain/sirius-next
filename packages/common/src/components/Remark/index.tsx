import React from 'react';
import { useTranslation } from 'react-i18next';
import { useI18n } from 'src/store';

export const Remark = function ({
  title: outerTitle,
  items,
  hideTitle,
  className,
}: {
  title?: React.ReactNode;
  items: Array<React.ReactNode>;
  hideTitle?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const { translations } = useI18n();
  const title = outerTitle || t(translations.general.remark);

  return (
    <div className={className}>
      {hideTitle ? null : (
        <div className="remark-title text-1.1429rem font-bold text-#1a1a1a mb-0.8571rem">
          {title}
        </div>
      )}
      <div className="remark-content text-#7e8598 lh-1.5714rem text-1rem font-normal">
        {items.map((i, index) => (
          <div key={index}>{i}</div>
        ))}
      </div>
    </div>
  );
};

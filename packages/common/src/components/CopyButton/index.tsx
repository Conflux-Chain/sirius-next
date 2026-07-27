import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../Tooltip';
import { useI18n } from '../../store';
import copy from 'copy-to-clipboard';

type Value = string | null | undefined;

interface CopyButtonProps {
  children?: React.ReactNode;
  size?: number;
  copyText?: Value;
  getCopyText?: () => Value | Promise<Value>;
  tooltipText?: string;
  className?: string;
  color?: string;
}

export const CopyButton = React.memo(
  ({
    size,
    copyText,
    getCopyText,
    tooltipText,
    className,
    color,
    children,
  }: CopyButtonProps) => {
    const { translations } = useI18n();
    const { t } = useTranslation();
    const [text, setText] = useState(
      tooltipText || t(translations.general.copyButton.copyToClipboard),
    );
    const handleClick = async () => {
      const text = copyText || (await getCopyText?.());
      if (!text) return;
      const copyResult = copy(text);
      if (copyResult) {
        setText(t(translations.general.copyButton.success));
      } else {
        setText(t(translations.general.copyButton.failed));
      }
    };

    const handleClose = () => {
      setText(
        tooltipText || t(translations.general.copyButton.copyToClipboard),
      );
    };
    return (
      <Tooltip
        title={text}
        onClose={handleClose}
        closeOnPointerDown={false}
        positioning={{ placement: 'top-start' }}
        className="inline-flex items-center"
      >
        <div
          onClick={handleClick}
          className="cursor-pointer flex items-center gap-10px"
        >
          {children}
          <svg
            className={`icon ${className}`}
            viewBox="0 0 1024 1024"
            width={size || 12}
            height={size || 12}
          >
            <defs>
              <style type="text/css" />
            </defs>
            <path
              fill={color || '#4b4b4b'}
              d="M967.552 760.448H304.896a41.472 41.472 0 0 1-41.344-41.344V56.32c0-22.912 18.56-41.344 41.344-41.344H967.68c22.912 0 41.344 18.432 41.344 41.344v662.656a41.472 41.472 0 0 1-41.344 41.344z m-621.184-82.816h579.84V97.792h-579.84v579.84z"
            />
            <path
              fill={color || '#4b4b4b'}
              d="M719.104 1008.896H56.32a41.472 41.472 0 0 1-41.344-41.344V304.896c0-22.784 18.432-41.344 41.344-41.344h124.16v82.816H98.048v579.84h579.84V847.36h82.688v120.064a41.472 41.472 0 0 1-41.344 41.344z"
            />
          </svg>
        </div>
      </Tooltip>
    );
  },
);

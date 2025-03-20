import React, {
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  ComponentProps,
} from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { Spin } from '../Spin';
import clsx from 'clsx';
import { ActionButton } from '../Button';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../store';

export interface ModalProps {
  visible?: boolean;
  confirmLoading?: boolean;
  closeOnEsc?: boolean;
  closable?: boolean;
  preventScroll?: boolean;
  backdropClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  onOpen?: VoidFunction;
  onCancel?: VoidFunction;
  onOk?: VoidFunction;
  children?: React.ReactNode;
  width?: string | number;
  maskClosable?: boolean;
  centered?: boolean;
  loading?: boolean;
  title?: React.ReactNode;
  okText?: string | false;
  cancelText?: string | false;
  footer?:
    | React.ReactNode
    | ((props: {
        onCancel?: VoidFunction;
        onOk?: VoidFunction;
      }) => React.ReactNode);
}

interface ModalContentProps
  extends Pick<
    ModalProps,
    | 'onOk'
    | 'confirmLoading'
    | 'onCancel'
    | 'children'
    | 'loading'
    | 'title'
    | 'okText'
    | 'cancelText'
    | 'footer'
    | 'containerClassName'
    | 'contentClassName'
    | 'headerClassName'
    | 'footerClassName'
    | 'closable'
  > {
  modalStyles: React.CSSProperties;
}

interface BackdropProps {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className: string;
  children?: React.ReactNode;
}

const Backdrop: React.FC<BackdropProps> = ({
  onClick,
  children,
  className,
}) => (
  <div className={className} onClick={onClick}>
    {children}
  </div>
);

const FooterButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof ActionButton>
>((props, ref) => {
  return (
    <ActionButton
      ref={ref}
      {...props}
      className={clsx('min-w-unset px-[0.8571rem]', props.className)}
    />
  );
});

const createFooter = ({
  okText,
  cancelText,
  footer,
  confirmLoading,
  onCancel,
  onOk,
}: Pick<
  ModalContentProps,
  'okText' | 'cancelText' | 'footer' | 'onCancel' | 'onOk' | 'confirmLoading'
>) => {
  if (footer !== undefined) {
    return typeof footer === 'function' ? footer({ onCancel, onOk }) : footer;
  } else if (okText || cancelText) {
    return (
      <>
        {cancelText && (
          <FooterButton size="small" onClick={onCancel}>
            {cancelText}
          </FooterButton>
        )}

        {okText && (
          <FooterButton
            loading={confirmLoading}
            size="small"
            color="primary"
            onClick={onOk}
          >
            {okText}
          </FooterButton>
        )}
      </>
    );
  }
  return null;
};

const ModalContent = ({
  containerClassName,
  contentClassName,
  headerClassName,
  footerClassName,
  closable,
  onCancel,
  onOk,
  children,
  loading,
  modalStyles,
  footer: _footer,
  title,
  okText,
  cancelText,
  confirmLoading,
}: ModalContentProps) => {
  const { translations } = useI18n();
  const { t } = useTranslation();
  const footer = createFooter({
    okText: okText ?? t(translations.general.buttonOk),
    cancelText: cancelText ?? t(translations.general.buttonCancel),
    footer: _footer,
    onCancel,
    onOk,
    confirmLoading,
  });
  return (
    <div
      className={clsx(
        'relative bg-[#FFF] rounded shadow-lg',
        containerClassName,
      )}
      tabIndex={-1}
      style={modalStyles}
    >
      <Spin spinning={loading}>
        {closable && (
          <X
            className="h-4 w-4 absolute right-5 top-5 cursor-pointer"
            onClick={onCancel}
          />
        )}
        {title && (
          <div
            className={clsx(
              'p-4 border-b-1px border-b-solid border-b-[#f0f0f0] flex items-center text-[rgba(0,0,0,0.85)] font-500 text-16px lh-22px m-0',
              headerClassName,
            )}
          >
            {title}
          </div>
        )}
        <div className={clsx('p-4', contentClassName)}>{children}</div>
        {footer && (
          <div
            className={clsx(
              'p-4 border-t-1px border-t-solid border-t-[#f0f0f0] text-right flex justify-end items-center gap-10px',
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </Spin>
    </div>
  );
};

const useEventListener = (
  eventName: string,
  handler: (event: Event) => void,
  active: boolean,
) => {
  useEffect(() => {
    if (active) {
      const eventListener = (event: Event) => handler(event);

      document.addEventListener(eventName, eventListener);
      return () => {
        document.removeEventListener(eventName, eventListener);
      };
    }
  }, [eventName, handler, active]);
};

export const Modal: React.FC<ModalProps> = ({
  visible,
  closeOnEsc = true,
  closable = true,
  preventScroll = true,
  backdropClassName = '',
  containerClassName = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
  onOpen = () => {},
  onCancel,
  width = '600px',
  maskClosable = true,
  centered = true,
  loading = false,
  ...props
}) => {
  useEffect(() => {
    if (visible) {
      onOpen?.();
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (preventScroll) {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (preventScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [visible, onOpen, preventScroll]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc && onCancel) {
        onCancel?.();
      }
    },
    [closeOnEsc, onCancel],
  );

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (maskClosable && event.target === event.currentTarget) {
        onCancel?.();
      }
    },
    [maskClosable, onCancel],
  );

  const modalStyles: React.CSSProperties = useMemo(
    () => ({
      width: typeof width === 'string' ? width : `${width}px`,
      margin: centered ? 'auto' : undefined,
    }),
    [width, centered],
  );

  useEventListener(
    'keydown',
    handleKeyDown as (event: Event) => void,
    !!visible && closeOnEsc,
  );

  if (!visible) return null;

  return ReactDOM.createPortal(
    <Backdrop
      onClick={handleBackdropClick}
      className={clsx(
        'fixed inset-0 bg-[#000] bg-opacity-25 flex items-center justify-center z-1000',
        backdropClassName,
      )}
    >
      <ModalContent
        containerClassName={containerClassName}
        contentClassName={contentClassName}
        headerClassName={headerClassName}
        footerClassName={footerClassName}
        closable={closable}
        onCancel={onCancel}
        loading={loading}
        modalStyles={modalStyles}
        {...props}
      />
    </Backdrop>,
    document.body,
  );
};

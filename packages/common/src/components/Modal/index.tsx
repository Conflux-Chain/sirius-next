import React, { useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { Spin } from '../Spin';
import { cn } from '../../utils';

interface ModalProps {
  open: boolean;
  closeOnEsc?: boolean;
  closable?: boolean;
  preventScroll?: boolean;
  backdropClassName?: string;
  containerClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
  width?: string | number;
  maskClosable?: boolean;
  centered?: boolean;
  loading?: boolean;
}

interface ModalContentProps {
  containerClassName: string;
  closable: boolean;
  onClose?: VoidFunction;
  children?: React.ReactNode;
  loading?: boolean;
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

const ModalContent = ({
  containerClassName,
  closable,
  onClose,
  children,
  loading,
  modalStyles,
}: ModalContentProps) => (
  <div
    className={cn('relative bg-[#FFF] rounded shadow-lg', containerClassName)}
    tabIndex={-1}
    style={modalStyles}
  >
    <Spin spinning={loading}>
      {closable && (
        <X className="h-4 w-4 absolute right-5 top-5" onClick={onClose} />
      )}
      <div className="p-4">{children}</div>
    </Spin>
  </div>
);

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

const Modal: React.FC<ModalProps> = ({
  open,
  closeOnEsc = true,
  closable = true,
  preventScroll = true,
  backdropClassName = '',
  containerClassName = '',
  onOpen = () => {},
  onClose,
  children,
  width = '600px',
  maskClosable = true,
  centered = true,
  loading = false,
}) => {
  useEffect(() => {
    if (open) {
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
  }, [open, onOpen, preventScroll]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc && onClose) {
        onClose?.();
      }
    },
    [closeOnEsc, onClose],
  );

  const handleClickOutside = useCallback(() => {
    if (onClose && maskClosable) {
      onClose?.();
    }
  }, [onClose, maskClosable]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (maskClosable && event.target === event.currentTarget && onClose) {
        onClose?.();
      }
    },
    [maskClosable, onClose],
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
    open && closeOnEsc,
  );
  useEventListener(
    'mousedown',
    handleClickOutside as (event: Event) => void,
    open && maskClosable,
  );

  if (!open) return null;

  return ReactDOM.createPortal(
    <Backdrop
      onClick={handleBackdropClick}
      className={cn(
        'fixed inset-0 bg-[#000] bg-opacity-25 flex items-center justify-center z-10000',
        backdropClassName,
      )}
    >
      <ModalContent
        containerClassName={containerClassName}
        closable={closable}
        onClose={onClose}
        children={children}
        loading={loading}
        modalStyles={modalStyles}
      />
    </Backdrop>,
    document.body,
  );
};

export { Modal };

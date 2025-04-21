import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { useNotificationStore, removeNotification } from 'src/store';
import { NotificationInfo } from './types';

const NotificationItem = ({
  id,
  title,
  content,
  icon,
  closeable = true,
  duration = 3000,
  transitionDuration = 300,
  onClose,
}: NotificationInfo) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
      clearTimeout(timer);
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    let timer: number | undefined;
    if (duration && !hover) {
      timer = window.setTimeout(() => {
        setHide(true);
        clearTimeout(timer);
      }, duration);
    }
    return () => {
      duration && clearTimeout(timer);
    };
  }, [duration, hover]);
  useEffect(() => {
    let timer: number | undefined;
    if (hide) {
      timer = window.setTimeout(() => {
        onClose?.(id);
        removeNotification(id);
        clearTimeout(timer);
      }, transitionDuration);
    }
    return () => clearTimeout(timer);
  }, [hide]);
  const handleClose = () => {
    setHide(true);
  };
  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };
  return (
    <div
      key={id}
      className={clsx(
        'w-28rem bg-#fff border-0 rounded-4px p-1.1429rem mt-[calc(1.1429rem*1.5)] flex grow-0 shrink-0 basis-auto transition-opacity',
        'shadow-normal self-end mr-[calc(1.1429rem*1.25)] [&:first-child]:mt-0',
        visible && !hide ? 'opacity-100' : 'opacity-0',
        visible ? 'translate-x-0' : 'translate-x-100%',
        hide && 'mt-[-3.5714rem] translate-y--100%',
      )}
      style={{
        transition: `transform ${transitionDuration}ms, opacity ${transitionDuration}ms`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-1.4286rem h-1.4286rem flex-center mr-[calc(1.1429rem*0.75)] grow-0 shrink-0 text-#333">
        {icon}
      </div>
      <div>
        <div className="font-500 text-1rem lh-1.4286rem mr-1.1429rem text-#333">
          {title}
        </div>
        {content !== '' && (
          <div className="lh-1.2857rem text-1rem text-#999 mt-[calc(1.1429rem*0.75)]">
            {content}
          </div>
        )}
      </div>
      {closeable && (
        <div
          className="absolute top-1.1429rem right-1.1429rem cursor-pointer"
          onClick={handleClose}
        >
          <X size={16} color="#666" />
        </div>
      )}
    </div>
  );
};

export const Notification: React.FC = () => {
  const { notifications } = useNotificationStore();
  if (!notifications || notifications.length === 0) return null;
  return ReactDOM.createPortal(
    <div>
      <div className="m-0 p-0 fixed top-[calc(1.1429rem*1.25)] left-0 right-0 z-2000 h-0 overflow-visible flex flex-col items-center visible">
        {notifications.map(props => (
          <NotificationItem key={props.id} {...props} />
        ))}
      </div>
    </div>,
    document.body,
  );
};

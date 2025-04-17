import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  CircleCheck,
  CircleX,
  CircleAlert,
  Info,
  LoaderCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { useMessageStore, removeMessage } from 'src/store';
import { MessageInfo, NoticeType } from './types';

const MessageIcon = ({ type }: { type: NoticeType }) => {
  switch (type) {
    case 'success':
      return <CircleCheck fill="#52c41a" color="#fff" />;
    case 'error':
      return <CircleX fill="#ff4d4f" color="#fff" />;
    case 'warning':
      return <CircleAlert fill="#faad14" color="#fff" />;
    case 'info':
      return <Info fill="#1890ff" color="#fff" />;
    case 'loading':
      return <LoaderCircle className="animate-spin" color="#1890ff" />;
  }
};

const MessageItem = ({
  id,
  message,
  type,
  duration = 3000,
  transitionDuration = 300,
  onClose,
}: MessageInfo) => {
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
        removeMessage(id);
        clearTimeout(timer);
      }, transitionDuration);
    }
    return () => clearTimeout(timer);
  }, [hide]);
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
        'p-8px text-center',
        visible && !hide ? 'opacity-100' : 'opacity-0',
        visible ? 'translate-y-0' : 'translate-y-[-100%]',
        hide && 'mt-[-3.5714rem]',
      )}
      style={{
        transition: `transform ${transitionDuration}ms, opacity ${transitionDuration}ms, margin-top ${transitionDuration}ms`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="inline-block px-16px py-10px bg-#fff rounded-2px"
        style={{
          pointerEvents: 'all',
          boxShadow:
            '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex-vertical-center">
          <span className="relative top-1px mr-8px text-16px inline-flex items-center lh-0 text-center vertical--2px">
            <MessageIcon type={type} />
          </span>
          <span className="cursor-auto">{message}</span>
        </div>
      </div>
    </div>
  );
};

export const Message: React.FC = () => {
  const { messages } = useMessageStore();
  return ReactDOM.createPortal(
    <div>
      <div className="m-0 p-0 fixed top-8px left-0 z-1010 w-full pointer-events-none text-14px text-[rgba(0,0,0,0.85)] lh-[1.5715]">
        <div>
          {messages.map(props => (
            <MessageItem key={props.id} {...props} />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

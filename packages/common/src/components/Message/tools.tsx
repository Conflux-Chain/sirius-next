import { render as reactRender } from '../../utils/render';
import { generateId } from '../../utils';
import { addMessage, removeMessage, getMessageInit } from 'src/store';
import { Message } from './Message';
import { MessageInfo } from './types';

export function openMessage(message: Omit<MessageInfo, 'id'>) {
  const container = document.createDocumentFragment();
  const init = getMessageInit();
  const id = generateId();
  addMessage({
    id,
    ...message,
  });
  if (!init) {
    setTimeout(() => {
      reactRender(<Message />, container);
    });
  }

  return () => removeMessage(id);
}

export const message = {
  success: (
    message: string,
    config?: Omit<MessageInfo, 'id' | 'message' | 'type'>,
  ) => {
    openMessage({
      message,
      type: 'success',
      ...config,
    });
  },
  error: (
    message: string,
    config?: Omit<MessageInfo, 'id' | 'message' | 'type'>,
  ) => {
    openMessage({
      message,
      type: 'error',
      ...config,
    });
  },
  warning: (
    message: string,
    config?: Omit<MessageInfo, 'id' | 'message' | 'type'>,
  ) => {
    openMessage({
      message,
      type: 'warning',
      ...config,
    });
  },
  info: (
    message: string,
    config?: Omit<MessageInfo, 'id' | 'message' | 'type'>,
  ) => {
    openMessage({
      message,
      type: 'info',
      ...config,
    });
  },
  loading: (
    message: string,
    config?: Omit<MessageInfo, 'id' | 'message' | 'type'>,
  ) => {
    openMessage({
      message,
      type: 'loading',
      ...config,
    });
  },
};

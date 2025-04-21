import { render as reactRender } from '../../utils/render';
import { generateId } from '../../utils';
import {
  addNotification,
  removeNotification,
  getNotificationInit,
} from 'src/store';
import { Notification } from './Notification';
import { NotificationInfo } from './types';

export function notification(data: Omit<NotificationInfo, 'id'>) {
  const container = document.createDocumentFragment();
  const init = getNotificationInit();
  const id = generateId();
  addNotification({
    id,
    ...data,
  });
  if (!init) {
    setTimeout(() => {
      reactRender(<Notification />, container);
    });
  }

  return () => removeNotification(id);
}

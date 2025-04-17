export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface MessageInfo {
  id: string;
  message: string;
  type: NoticeType;
  duration?: number;
  transitionDuration?: number;
  onClose?: (id: string) => void;
}

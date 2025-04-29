export interface NotificationInfo {
  id: string;
  closeable?: boolean;
  icon?: React.ReactNode;
  title: React.ReactNode;
  content?: React.ReactNode;
  duration?: number;
  transitionDuration?: number;
  onClose?: (id: string) => void;
}

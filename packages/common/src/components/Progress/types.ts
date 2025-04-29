export interface BaseProgressProps {
  percent: number;
  size?: 'small' | 'default' | 'large';
  trailColor?: string;
  strokeWidth?: number;
  strokeColor?: string;
  strokeLinecap?: 'round' | 'butt' | 'square';
}

export type GapPositionType = 'top' | 'right' | 'bottom' | 'left';

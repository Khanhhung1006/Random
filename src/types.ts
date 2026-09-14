export type DrawMode = 'range' | 'custom';

export type SpinDuration = 'fast' | 'normal' | 'suspense';

export interface DrawHistoryItem {
  id: string;
  number: number | string;
  order: number;
  timestamp: Date;
}

export interface LotteryConfig {
  mode: DrawMode;
  min: number;
  max: number;
  customListText: string;
  uniqueOnly: boolean;
  padZero: boolean;
  padLength: number;
  duration: SpinDuration;
  soundEnabled: boolean;
}

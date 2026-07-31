export type PixelType = 'color' | 'letter' | 'number';

export type BoardPreset = '6x22' | '256x256' | '1080x1080';

export interface BoardConfig {
  presetId: BoardPreset;
  width: number;
  height: number;
  label: string;
}

export const BOARD_PRESETS: Record<BoardPreset, BoardConfig> = {
  '1080x1080': {
    presetId: '1080x1080',
    width: 1080,
    height: 1080,
    label: '1080 x 1080 Mega'
  },
  '256x256': {
    presetId: '256x256',
    width: 256,
    height: 256,
    label: '256 x 256 Canvas'
  },
  '6x22': {
    presetId: '6x22',
    width: 22,
    height: 6,
    label: '6 x 22 Micro'
  }
};

export interface Pixel {
  x: number;
  y: number;
  type: PixelType;
  val: string;
  textColor?: string;
  bgColor?: string;
  updatedAt?: number;
  lastAuthor?: string;
  boardId?: BoardPreset;
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  boardWidth: number;
  boardHeight: number;
}

export interface EditPixelPayload {
  x: number;
  y: number;
  pixelType: PixelType;
  val: string;
  textColor?: string;
  bgColor?: string;
  boardId?: BoardPreset;
}

export interface PixelHistoryItem {
  id: number;
  x: number;
  y: number;
  type: PixelType;
  val: string;
  textColor?: string;
  bgColor?: string;
  timestamp: number;
  authorHash: string;
  boardId?: BoardPreset;
}

export interface HistoryTimeline {
  earliest: number;
  latest: number;
  current: number;
  totalEdits: number;
}

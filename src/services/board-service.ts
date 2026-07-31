import type { Pixel, BoardPreset } from '../types/pixel';

export interface IBoardService {
  fetchInitialBoard(preset?: BoardPreset): Promise<Pixel[]>;
  fetchSnapshotAt(timestamp: number, preset?: BoardPreset): Promise<Pixel[]>;
}

export class BoardService implements IBoardService {
  async fetchInitialBoard(preset: BoardPreset = '1080x1080'): Promise<Pixel[]> {
    try {
      const res = await fetch(`/api/board?preset=${preset}`);
      const data = await res.json();
      if (data.success) {
        return data.pixels || [];
      }
      return [];
    } catch (err) {
      console.warn('Fallback: Failed to fetch board via REST API', err);
      return [];
    }
  }

  async fetchSnapshotAt(timestamp: number, preset: BoardPreset = '1080x1080'): Promise<Pixel[]> {
    try {
      const res = await fetch(`/api/board/snapshot?timestamp=${timestamp}&preset=${preset}`);
      const data = await res.json();
      if (data.success) {
        return data.pixels || [];
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch board snapshot', err);
      return [];
    }
  }
}

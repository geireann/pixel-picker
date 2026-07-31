import type { PixelHistoryItem, BoardPreset } from '../types/pixel';

export class HistoryService {
  async fetchPixelHistory(x: number, y: number, preset: BoardPreset = '1080x1080'): Promise<PixelHistoryItem[]> {
    try {
      const res = await fetch(`/api/pixel/history?x=${x}&y=${y}&preset=${preset}`);
      const data = await res.json();
      if (data.success) {
        return data.history || [];
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch pixel history', err);
      return [];
    }
  }

  async fetchHistoryTimeline(preset: BoardPreset = '1080x1080'): Promise<{ earliest: number; latest: number; totalEdits: number }> {
    try {
      const res = await fetch(`/api/history/timeline?preset=${preset}`);
      const data = await res.json();
      if (data.success) {
        return {
          earliest: data.earliest || Date.now(),
          latest: data.latest || Date.now(),
          totalEdits: data.totalEdits || 0
        };
      }
      return { earliest: Date.now(), latest: Date.now(), totalEdits: 0 };
    } catch (err) {
      return { earliest: Date.now(), latest: Date.now(), totalEdits: 0 };
    }
  }
}

import type { PixelHistoryItem } from '../types/pixel';

export type HistoryListener = () => void;

class HistoryStore {
  private pixelHistory: PixelHistoryItem[] = [];
  private earliestTimestamp: number = Date.now();
  private latestTimestamp: number = Date.now();
  private currentScrubberTimestamp: number = Date.now();
  private totalEditsCount: number = 0;
  private listeners: Set<HistoryListener> = new Set();

  public getPixelHistory() {
    return this.pixelHistory;
  }

  public setPixelHistory(history: PixelHistoryItem[]) {
    this.pixelHistory = history;
    this.notify();
  }

  public getTimeline() {
    return {
      earliest: this.earliestTimestamp,
      latest: this.latestTimestamp,
      current: this.currentScrubberTimestamp,
      totalEdits: this.totalEditsCount
    };
  }

  public setTimeline(earliest: number, latest: number, current: number, totalEdits: number) {
    this.earliestTimestamp = earliest;
    this.latestTimestamp = latest;
    this.currentScrubberTimestamp = current;
    this.totalEditsCount = totalEdits;
    this.notify();
  }

  public setCurrentScrubberTimestamp(ts: number) {
    this.currentScrubberTimestamp = ts;
    this.notify();
  }

  public subscribe(fn: HistoryListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const historyStore = new HistoryStore();

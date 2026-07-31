import type { Pixel, ViewportState, BoardPreset } from '../types/pixel';
import { BOARD_PRESETS } from '../types/pixel';
import { getPresetFromPath } from '../utils/router';

export type StoreListener = () => void;

class BoardStore {
  private pixelsMap: Map<string, Pixel> = new Map();
  private activePreset: BoardPreset = getPresetFromPath();
  private viewport: ViewportState = {
    zoom: 3.5,
    panX: 50,
    panY: 50,
    showGrid: true,
    boardWidth: BOARD_PRESETS[getPresetFromPath()].width,
    boardHeight: BOARD_PRESETS[getPresetFromPath()].height
  };
  private activeUsers = 1;
  private isLive = true;
  private listeners: Set<StoreListener> = new Set();

  public getPreset(): BoardPreset {
    return this.activePreset;
  }

  public setPreset(preset: BoardPreset) {
    this.activePreset = preset;
    const config = BOARD_PRESETS[preset];
    this.viewport.boardWidth = config.width;
    this.viewport.boardHeight = config.height;
    this.pixelsMap.clear();
    this.notify();
  }

  public getPixels(): Pixel[] {
    return Array.from(this.pixelsMap.values());
  }

  public getPixel(x: number, y: number): Pixel | null {
    return this.pixelsMap.get(`${x},${y}`) || null;
  }

  public setPixels(pixels: Pixel[]) {
    this.pixelsMap.clear();
    pixels.forEach(p => this.pixelsMap.set(`${p.x},${p.y}`, p));
    this.notify();
  }

  public updatePixel(pixel: Pixel) {
    this.pixelsMap.set(`${pixel.x},${pixel.y}`, pixel);
    this.notify();
  }

  public getViewport(): ViewportState {
    return { ...this.viewport };
  }

  public setViewport(partial: Partial<ViewportState>) {
    this.viewport = { ...this.viewport, ...partial };
    this.notify();
  }

  public getActiveUsers(): number {
    return this.activeUsers;
  }

  public setActiveUsers(count: number) {
    this.activeUsers = count;
    this.notify();
  }

  public getIsLive(): boolean {
    return this.isLive;
  }

  public setIsLive(isLive: boolean) {
    this.isLive = isLive;
    this.notify();
  }

  public subscribe(fn: StoreListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const boardStore = new BoardStore();

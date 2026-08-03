import type { Pixel, ViewportState, BoardPreset } from '../types/pixel';
import { BOARD_PRESETS } from '../types/pixel';
import { getPresetFromPath } from '../utils/router';

export type StoreListener = () => void;
export type PixelUpdateListener = (pixel: Pixel) => void;

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
  private isOnline = false; // OFFLINE BY DEFAULT
  private listeners: Set<StoreListener> = new Set();
  private pixelListeners: Set<PixelUpdateListener> = new Set();

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public setIsOnline(online: boolean) {
    this.isOnline = online;
    this.notify();
  }

  public loadLocalPixels(preset: BoardPreset = this.activePreset): Pixel[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`pixelpicker_local_pixels_${preset}`);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public saveLocalPixel(pixel: Pixel) {
    if (typeof localStorage === 'undefined') return;
    try {
      const preset = pixel.boardId || this.activePreset;
      const key = `pixelpicker_local_pixels_${preset}`;
      const existing = this.loadLocalPixels(preset);
      const filtered = existing.filter(p => !(p.x === pixel.x && p.y === pixel.y));
      filtered.push(pixel);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch {
      // Ignore quota errors
    }
  }

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
    const key = `${pixel.x},${pixel.y}`;
    const existing = this.pixelsMap.get(key);

    // Skip duplicate renders if pixel value and colors haven't changed
    if (
      existing &&
      existing.val === pixel.val &&
      existing.type === pixel.type &&
      existing.textColor === pixel.textColor &&
      existing.bgColor === pixel.bgColor
    ) {
      return;
    }

    this.pixelsMap.set(key, pixel);
    this.pixelListeners.forEach(fn => fn(pixel));
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

  public onSinglePixelUpdated(fn: PixelUpdateListener) {
    this.pixelListeners.add(fn);
    return () => this.pixelListeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const boardStore = new BoardStore();

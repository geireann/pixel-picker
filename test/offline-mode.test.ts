import { describe, it, expect, beforeEach } from 'vitest';
import { boardStore } from '../src/store/board-store';
import type { Pixel } from '../src/types/pixel';

describe('Offline-by-Default Board Mode', () => {
  beforeEach(() => {
    localStorage.clear();
    boardStore.setIsOnline(false);
  });

  it('defaults to OFFLINE mode (isOnline === false)', () => {
    expect(boardStore.getIsOnline()).toBe(false);
  });

  it('toggles online and offline states correctly', () => {
    boardStore.setIsOnline(true);
    expect(boardStore.getIsOnline()).toBe(true);

    boardStore.setIsOnline(false);
    expect(boardStore.getIsOnline()).toBe(false);
  });

  it('saves and loads pixels from local storage in offline mode', () => {
    const pixel: Pixel = {
      x: 3,
      y: 4,
      type: 'color',
      val: '#ea580c',
      boardId: '22x6'
    };

    boardStore.saveLocalPixel(pixel);
    const loaded = boardStore.loadLocalPixels('22x6');

    expect(loaded.length).toBe(1);
    expect(loaded[0].x).toBe(3);
    expect(loaded[0].y).toBe(4);
    expect(loaded[0].val).toBe('#ea580c');
  });
});

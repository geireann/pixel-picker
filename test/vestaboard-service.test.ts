import { describe, it, expect } from 'vitest';
import {
  findClosestVestaboardColorCode,
  convertPixelToVestaboardCode,
  convertBoardToVestaboardMatrix,
  VESTABOARD_ROWS,
  VESTABOARD_COLS
} from '../src/services/vestaboard-service';
import type { Pixel } from '../src/types/pixel';

describe('VestaboardService', () => {
  describe('findClosestVestaboardColorCode', () => {
    it('maps pure red hex to Vestaboard red flap (63)', () => {
      expect(findClosestVestaboardColorCode('#ff0000')).toBe(63);
      expect(findClosestVestaboardColorCode('#e11d48')).toBe(63);
    });

    it('maps pure blue hex to Vestaboard blue flap (67)', () => {
      expect(findClosestVestaboardColorCode('#0000ff')).toBe(67);
      expect(findClosestVestaboardColorCode('#2563eb')).toBe(67);
    });

    it('maps pure white to Vestaboard white flap (69)', () => {
      expect(findClosestVestaboardColorCode('#ffffff')).toBe(69);
    });

    it('maps dark black hex to Vestaboard black flap (70)', () => {
      expect(findClosestVestaboardColorCode('#09090b')).toBe(70);
      expect(findClosestVestaboardColorCode('#000000')).toBe(70);
    });
  });

  describe('convertPixelToVestaboardCode', () => {
    it('converts character letter A to code 1', () => {
      const p: Pixel = { x: 0, y: 0, type: 'letter', val: 'A' };
      expect(convertPixelToVestaboardCode(p)).toBe(1);
    });

    it('converts character digit 7 to code 33', () => {
      const p: Pixel = { x: 0, y: 0, type: 'number', val: '7' };
      expect(convertPixelToVestaboardCode(p)).toBe(33);
    });

    it('converts color pixel to closest color flap code', () => {
      const p: Pixel = { x: 0, y: 0, type: 'color', val: '#16a34a' };
      expect(convertPixelToVestaboardCode(p)).toBe(66); // Green
    });
  });

  describe('convertBoardToVestaboardMatrix', () => {
    it('creates 6x22 matrix populated with correct Vestaboard character codes', () => {
      const pixels: Pixel[] = [
        { x: 0, y: 0, type: 'letter', val: 'H' },
        { x: 1, y: 0, type: 'letter', val: 'I' },
        { x: 5, y: 3, type: 'color', val: '#ea580c' } // Orange -> 64
      ];

      const matrix = convertBoardToVestaboardMatrix(pixels);

      expect(matrix.length).toBe(VESTABOARD_ROWS);
      expect(matrix[0].length).toBe(VESTABOARD_COLS);
      expect(matrix[0][0]).toBe(8); // 'H' -> 8
      expect(matrix[0][1]).toBe(9); // 'I' -> 9
      expect(matrix[3][5]).toBe(64); // Orange -> 64
    });
  });

  describe('Rate Limiter (15s cooldown)', () => {
    it('enforces 15 second rate limit between consecutive API requests', async () => {
      const matrix = Array.from({ length: VESTABOARD_ROWS }, () => Array(VESTABOARD_COLS).fill(0));
      const { resetVestaboardCooldownForTesting, sendToVestaboard } = await import('../src/services/vestaboard-service');

      resetVestaboardCooldownForTesting();

      // First request passes rate-limiter check
      const p1 = sendToVestaboard(matrix, 'test-token');
      // Second immediate request is rate limited
      const p2 = await sendToVestaboard(matrix, 'test-token');

      expect(p2.success).toBe(false);
      expect(p2.message).toContain('Rate limit: Please try again in');
    });
  });
});

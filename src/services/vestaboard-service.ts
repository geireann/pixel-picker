import type { Pixel } from '../types/pixel';

export const VESTABOARD_TOKEN_KEY = 'pixelpicker_vestaboard_token';

export const VESTABOARD_ROWS = 6;
export const VESTABOARD_COLS = 22;

export const VESTABOARD_NAMED_CODES: Record<string, number> = {
  blank: 0,
  red: 63,
  orange: 64,
  yellow: 65,
  green: 66,
  blue: 67,
  violet: 68,
  purple: 68,
  white: 69,
  black: 70,
  filled: 71,
};

export const VESTABOARD_COLOR_FLAPS = [
  { code: 63, name: 'red', hex: '#e11d48', rgb: [225, 29, 72] },
  { code: 64, name: 'orange', hex: '#ea580c', rgb: [234, 88, 12] },
  { code: 65, name: 'yellow', hex: '#ca8a04', rgb: [202, 138, 4] },
  { code: 66, name: 'green', hex: '#16a34a', rgb: [22, 163, 74] },
  { code: 67, name: 'blue', hex: '#2563eb', rgb: [37, 99, 235] },
  { code: 68, name: 'violet', hex: '#7c3aed', rgb: [124, 58, 237] },
  { code: 69, name: 'white', hex: '#ffffff', rgb: [255, 255, 255] },
  { code: 70, name: 'black', hex: '#09090b', rgb: [9, 9, 11] },
];

export const VESTABOARD_CHARACTER_CODES: Record<string, number> = {
  ' ': 0,
  '1': 27, '2': 28, '3': 29, '4': 30, '5': 31,
  '6': 32, '7': 33, '8': 34, '9': 35, '0': 36,
  '!': 37, '@': 38, '#': 39, '$': 40, '(': 41,
  ')': 42, '-': 44, '+': 46, '&': 47, '=': 48,
  ';': 49, ':': 50, "'": 52, '"': 53, '%': 54,
  ',': 55, '.': 56, '/': 59, '?': 60, '°': 62
};

// Add A-Z (1..26)
for (let i = 0; i < 26; i++) {
  const char = String.fromCharCode(65 + i);
  VESTABOARD_CHARACTER_CODES[char] = i + 1;
}

export function hexToRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function findClosestVestaboardColorCode(hex: string): number {
  const [r1, g1, b1] = hexToRgb(hex);

  let closestCode = 70; // Default to black
  let minDistance = Infinity;

  VESTABOARD_COLOR_FLAPS.forEach(flap => {
    const [r2, g2, b2] = flap.rgb;
    // Euclidean distance in 3D RGB color space
    const dist = Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestCode = flap.code;
    }
  });

  return closestCode;
}

export function convertPixelToVestaboardCode(pixel: Pixel): number {
  if (!pixel) return 0;

  if (pixel.type === 'letter' || pixel.type === 'number') {
    const char = (pixel.val || ' ').toUpperCase();
    if (VESTABOARD_CHARACTER_CODES[char] !== undefined) {
      return VESTABOARD_CHARACTER_CODES[char];
    }
  }

  // Color pixel or unmapped char -> map hex color to closest Vestaboard color flap code
  const targetHex = pixel.type === 'color' ? pixel.val : (pixel.bgColor || '#ffffff');
  return findClosestVestaboardColorCode(targetHex);
}

export function convertBoardToVestaboardMatrix(pixels: Pixel[]): number[][] {
  const matrix: number[][] = Array.from({ length: VESTABOARD_ROWS }, () =>
    Array(VESTABOARD_COLS).fill(0)
  );

  const pixelMap = new Map<string, Pixel>();
  pixels.forEach(p => {
    pixelMap.set(`${p.x},${p.y}`, p);
  });

  for (let r = 0; r < VESTABOARD_ROWS; r++) {
    for (let c = 0; c < VESTABOARD_COLS; c++) {
      const p = pixelMap.get(`${c},${r}`);
      if (p) {
        matrix[r][c] = convertPixelToVestaboardCode(p);
      }
    }
  }

  return matrix;
}

export function getStoredVestaboardToken(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(VESTABOARD_TOKEN_KEY) || '';
}

export function setStoredVestaboardToken(token: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VESTABOARD_TOKEN_KEY, token.trim());
  }
}

export function clearStoredVestaboardToken(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(VESTABOARD_TOKEN_KEY);
  }
}

export async function sendToVestaboard(
  matrix: number[][],
  token: string = getStoredVestaboardToken()
): Promise<{ success: boolean; message: string }> {
  if (!token) {
    return { success: false, message: 'No Vestaboard API token configured.' };
  }

  try {
    const res = await fetch('https://cloud.vestaboard.com/', {
      method: 'POST',
      headers: {
        'X-Vestaboard-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ characters: matrix })
    });

    if (res.ok) {
      return { success: true, message: 'Successfully sent design to Vestaboard!' };
    }

    const errorText = await res.text();
    return {
      success: false,
      message: `Vestaboard API error (${res.status}): ${errorText || res.statusText}`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Vestaboard API: ${err?.message || 'Network request failed'}`
    };
  }
}

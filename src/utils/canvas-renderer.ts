import type { Pixel, ViewportState } from '../types/pixel';

interface FlipAnimation {
  startTime: number;
  duration: number;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private pixelsMap: Map<string, Pixel> = new Map();
  private activeFlips: Map<string, FlipAnimation> = new Map();
  private width = 256;
  private height = 256;

  private isAnimLoopRunning = false;
  private lastViewport: ViewportState | null = null;
  private lastSelectedCoord: { x: number; y: number } | null = null;
  private lastHoverCoord: { x: number; y: number } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.width;
    this.offscreenCanvas.height = this.height;
    const offCtx = this.offscreenCanvas.getContext('2d');
    if (!offCtx) throw new Error('Failed to get offscreen 2D context');
    this.offscreenCtx = offCtx;

    this.initOffscreenBackground();
  }

  public setDimensions(width: number, height: number) {
    if (this.width !== width || this.height !== height) {
      this.width = width;
      this.height = height;
      this.offscreenCanvas.width = width;
      this.offscreenCanvas.height = height;
      this.initOffscreenBackground();
    }
  }

  private initOffscreenBackground() {
    this.offscreenCtx.fillStyle = '#ffffff';
    this.offscreenCtx.fillRect(0, 0, this.width, this.height);
  }

  public triggerPixelFlip(x: number, y: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.activeFlips.set(`${x},${y}`, {
        startTime: performance.now(),
        duration: 280
      });
      this.startAnimationLoop();
    }
  }

  /**
   * O(1) Single Pixel Render Update
   * Re-renders ONLY the specified pixel on the offscreen canvas and plays the 280ms Solari mechanical flip flicker animation.
   */
  public updateSinglePixel(pixel: Pixel) {
    const now = performance.now();
    this.pixelsMap.set(`${pixel.x},${pixel.y}`, pixel);
    this.drawSinglePixelToOffscreen(pixel);
    this.activeFlips.set(`${pixel.x},${pixel.y}`, { startTime: now, duration: 280 });
    this.startAnimationLoop();
  }

  public updatePixels(pixels: Pixel[]) {
    const now = performance.now();
    pixels.forEach(p => {
      this.pixelsMap.set(`${p.x},${p.y}`, p);
      this.drawSinglePixelToOffscreen(p);
      this.activeFlips.set(`${p.x},${p.y}`, { startTime: now, duration: 280 });
    });
    this.startAnimationLoop();
  }

  public setAllPixels(pixels: Pixel[]) {
    this.pixelsMap.clear();
    this.initOffscreenBackground();
    pixels.forEach(p => {
      this.pixelsMap.set(`${p.x},${p.y}`, p);
      this.drawSinglePixelToOffscreen(p);
    });
  }

  private drawSinglePixelToOffscreen(p: Pixel) {
    const { x, y, type, val, bgColor = '#ffffff' } = p;
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

    if (type === 'color') {
      this.offscreenCtx.fillStyle = val || '#ffffff';
      this.offscreenCtx.fillRect(x, y, 1, 1);
    } else {
      this.offscreenCtx.fillStyle = bgColor || '#ffffff';
      this.offscreenCtx.fillRect(x, y, 1, 1);
    }

    // Subtle 1px split seam line across flap module
    this.offscreenCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    this.offscreenCtx.fillRect(x, y + 0.48, 1, 0.04);
  }

  private startAnimationLoop() {
    if (this.isAnimLoopRunning) return;
    this.isAnimLoopRunning = true;

    const step = () => {
      if (this.activeFlips.size === 0) {
        this.isAnimLoopRunning = false;
        return;
      }

      if (this.lastViewport) {
        this.render(this.lastViewport, this.lastSelectedCoord, this.lastHoverCoord);
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  public render(viewport: ViewportState, selectedCoord: { x: number; y: number } | null, hoverCoord: { x: number; y: number } | null) {
    this.lastViewport = viewport;
    this.lastSelectedCoord = selectedCoord;
    this.lastHoverCoord = hoverCoord;

    const screenW = this.canvas.width;
    const screenH = this.canvas.height;
    const now = performance.now();

    const boardW = viewport.boardWidth || this.width;
    const boardH = viewport.boardHeight || this.height;
    this.setDimensions(boardW, boardH);

    // Light Mode Viewport Background
    this.ctx.fillStyle = '#e4e4e7';
    this.ctx.fillRect(0, 0, screenW, screenH);

    this.ctx.save();

    // Pan & Zoom Transform Matrix
    this.ctx.translate(viewport.panX, viewport.panY);
    this.ctx.scale(viewport.zoom, viewport.zoom);
    this.ctx.imageSmoothingEnabled = false;

    // Draw offscreen Solari split-flap tile grid
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);

    // Grid Overlay
    if (viewport.showGrid && viewport.zoom >= 4) {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      this.ctx.lineWidth = 0.03;

      for (let i = 0; i <= boardW; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, boardH);
        this.ctx.stroke();
      }
      for (let j = 0; j <= boardH; j++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, j);
        this.ctx.lineTo(boardW, j);
        this.ctx.stroke();
      }
    }

    // Board Frame Border (Solid 1px Black)
    this.ctx.strokeStyle = '#09090b';
    this.ctx.lineWidth = 0.25;
    this.ctx.strokeRect(0, 0, boardW, boardH);

    // Hover Highlight Box
    if (hoverCoord && hoverCoord.x >= 0 && hoverCoord.x < boardW && hoverCoord.y >= 0 && hoverCoord.y < boardH) {
      this.ctx.strokeStyle = 'rgba(9, 9, 11, 0.6)';
      this.ctx.lineWidth = 0.15;
      this.ctx.strokeRect(hoverCoord.x, hoverCoord.y, 1, 1);
    }

    // Selected Pixel Box (Solid Black Selection)
    if (selectedCoord && selectedCoord.x >= 0 && selectedCoord.x < boardW && selectedCoord.y >= 0 && selectedCoord.y < boardH) {
      this.ctx.strokeStyle = '#09090b';
      this.ctx.lineWidth = 0.3;
      this.ctx.strokeRect(selectedCoord.x, selectedCoord.y, 1, 1);

      this.ctx.fillStyle = 'rgba(9, 9, 11, 0.12)';
      this.ctx.fillRect(selectedCoord.x, selectedCoord.y, 1, 1);
    }

    this.ctx.restore();

    // Character Rendering & Spatial View Frustum Culling
    const fontSize = Math.floor(viewport.zoom * 0.78);

    // Fast Frustum Culling Bounds in Grid Units
    const minGridX = Math.max(0, Math.floor(-viewport.panX / viewport.zoom));
    const maxGridX = Math.min(boardW - 1, Math.ceil((screenW - viewport.panX) / viewport.zoom));
    const minGridY = Math.max(0, Math.floor(-viewport.panY / viewport.zoom));
    const maxGridY = Math.min(boardH - 1, Math.ceil((screenH - viewport.panY) / viewport.zoom));

    this.pixelsMap.forEach((pixel) => {
      // Spatial Frustum Check
      if (pixel.x < minGridX || pixel.x > maxGridX || pixel.y < minGridY || pixel.y > maxGridY) {
        return;
      }

      const coordKey = `${pixel.x},${pixel.y}`;
      const flipAnim = this.activeFlips.get(coordKey);
      let isFlipping = false;
      let flipProgress = 0;

      if (flipAnim) {
        const elapsed = now - flipAnim.startTime;
        if (elapsed < flipAnim.duration) {
          isFlipping = true;
          flipProgress = elapsed / flipAnim.duration;
        } else {
          this.activeFlips.delete(coordKey);
        }
      }

      const screenCenterX = (pixel.x + 0.5) * viewport.zoom + viewport.panX;
      const screenCenterY = (pixel.y + 0.54) * viewport.zoom + viewport.panY;
      const pixelWidth = viewport.zoom;
      const pixelHeight = viewport.zoom;
      const screenLeft = pixel.x * viewport.zoom + viewport.panX;
      const screenTop = pixel.y * viewport.zoom + viewport.panY;

      // Draw Characters (Letters & Numbers)
      if (fontSize >= 4 && (pixel.type === 'letter' || pixel.type === 'number')) {
        this.ctx.save();
        this.ctx.font = `700 ${fontSize}px 'Space Mono', monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillStyle = pixel.textColor || '#09090b';
        this.ctx.fillText(String(pixel.val).charAt(0), screenCenterX, screenCenterY);

        this.ctx.restore();
      }

      // Render Dynamic Solari Split-Flap Mechanical Flicker Overlay
      if (isFlipping) {
        this.ctx.save();
        this.ctx.translate(screenLeft, screenTop);

        if (flipProgress < 0.35) {
          // Phase 1: Top flap drops down with mechanical shadow
          const flapHeight = pixelHeight * 0.5 * (1 - flipProgress / 0.35);
          this.ctx.fillStyle = 'rgba(9, 9, 11, 0.4)';
          this.ctx.fillRect(0, 0, pixelWidth, Math.max(1, flapHeight));
        } else if (flipProgress < 0.65) {
          // Phase 2: Mechanical split seam click across horizontal axis
          this.ctx.fillStyle = '#09090b';
          this.ctx.fillRect(0, pixelHeight * 0.44, pixelWidth, Math.max(2, pixelHeight * 0.12));
        } else {
          // Phase 3: Bottom flap settles with subtle settling shadow
          const shadowProgress = (1 - (flipProgress - 0.65) / 0.35);
          this.ctx.fillStyle = `rgba(9, 9, 11, ${0.3 * shadowProgress})`;
          this.ctx.fillRect(0, pixelHeight * 0.5, pixelWidth, pixelHeight * 0.5);
        }

        this.ctx.restore();
      }
    });
  }

  public screenToBoardCoord(screenX: number, screenY: number, viewport: ViewportState): { x: number; y: number } | null {
    const boardW = viewport.boardWidth || this.width;
    const boardH = viewport.boardHeight || this.height;

    const boardX = Math.floor((screenX - viewport.panX) / viewport.zoom);
    const boardY = Math.floor((screenY - viewport.panY) / viewport.zoom);

    if (boardX >= 0 && boardX < boardW && boardY >= 0 && boardY < boardH) {
      return { x: boardX, y: boardY };
    }
    return null;
  }
}

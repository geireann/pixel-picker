import { LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { canvasBoardStyles } from './canvas-board.css';
import { renderCanvasBoardPresentation } from './canvas-board-presentation';
import { CanvasRenderer } from '../../utils/canvas-renderer';
import { TouchGestureHandler } from '../../utils/touch-gesture';
import { boardStore } from '../../store/board-store';
import { editorStore } from '../../store/editor-store';
import type { PixelType } from '../../types/pixel';

@customElement('app-canvas-board')
export class AppCanvasBoard extends LitElement {
  static styles = [canvasBoardStyles];

  @state() hoverCoord: { x: number; y: number } | null = null;
  @state() isDragging = false;
  @state() isTimeTravelOpen = false;
  private isSpacePressed = false;
  private dragStartX = 0;
  private dragStartY = 0;

  private renderer: CanvasRenderer | null = null;
  private unsubscribeBoardStore: (() => void) | null = null;
  private unsubscribeEditorStore: (() => void) | null = null;
  private boundKeyDownHandler: ((e: KeyboardEvent) => void) | null = null;
  private boundKeyUpHandler: ((e: KeyboardEvent) => void) | null = null;
  private boundTimeTravelClosedHandler: (() => void) | null = null;

  public triggerPixelFlip(x: number, y: number) {
    if (this.renderer) {
      this.renderer.triggerPixelFlip(x, y);
      this.requestRender();
    }
  }

  firstUpdated() {
    const canvas = this.shadowRoot?.querySelector('#board-canvas') as HTMLCanvasElement;
    if (canvas) {
      this.setupCanvasSize(canvas);
      this.renderer = new CanvasRenderer(canvas);

      canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
      canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
      window.addEventListener('mouseup', this.handleMouseUp.bind(this));

      new TouchGestureHandler(canvas, {
        onPan: (dx, dy) => this.panViewport(dx, dy),
        onPinchZoom: (factor, cx, cy) => this.zoomAtPoint(factor, cx, cy),
        onTap: (sx, sy) => this.handleTapAt(sx, sy)
      });

      const resizeObserver = new ResizeObserver(() => {
        this.setupCanvasSize(canvas);
        this.requestRender();
      });
      resizeObserver.observe(this);
    }

    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
    this.boundKeyUpHandler = this.handleKeyUp.bind(this);
    window.addEventListener('keydown', this.boundKeyDownHandler);
    window.addEventListener('keyup', this.boundKeyUpHandler);

    this.boundTimeTravelClosedHandler = () => {
      this.isTimeTravelOpen = false;
    };
    window.addEventListener('time-travel-closed', this.boundTimeTravelClosedHandler);

    this.unsubscribeBoardStore = boardStore.subscribe(() => {
      if (this.renderer) {
        const vp = boardStore.getViewport();
        this.renderer.setDimensions(vp.boardWidth, vp.boardHeight);
        this.renderer.setAllPixels(boardStore.getPixels());
        this.requestRender();
      }
    });

    this.unsubscribeEditorStore = editorStore.subscribe(() => {
      this.requestRender();
    });

    this.centerBoard();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeBoardStore?.();
    this.unsubscribeEditorStore?.();
    if (this.boundKeyDownHandler) {
      window.removeEventListener('keydown', this.boundKeyDownHandler);
    }
    if (this.boundKeyUpHandler) {
      window.removeEventListener('keyup', this.boundKeyUpHandler);
    }
    if (this.boundTimeTravelClosedHandler) {
      window.removeEventListener('time-travel-closed', this.boundTimeTravelClosedHandler);
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.key === ' ') {
      this.isSpacePressed = false;
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    const targetEl = e.target as HTMLElement;
    const isInput = targetEl && (targetEl.tagName === 'INPUT' || targetEl.tagName === 'TEXTAREA');

    if (e.key === ' ' && !isInput) {
      this.isSpacePressed = true;
      e.preventDefault();
      return;
    }

    const selected = editorStore.getSelectedCoord();
    if (!selected) return;

    if (e.key === 'Escape') {
      editorStore.setSelectedCoord(null);
      if (isInput) (targetEl as HTMLElement).blur();
      return;
    }

    if (isInput) return;

    const vp = boardStore.getViewport();

    // Arrow Key Navigation
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      editorStore.setSelectedCoord({ x: Math.max(0, selected.x - 1), y: selected.y });
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      editorStore.setSelectedCoord({ x: Math.min(vp.boardWidth - 1, selected.x + 1), y: selected.y });
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      editorStore.setSelectedCoord({ x: selected.x, y: Math.max(0, selected.y - 1) });
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      editorStore.setSelectedCoord({ x: selected.x, y: Math.min(vp.boardHeight - 1, selected.y + 1) });
      return;
    }

    // Direct Character Typing
    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      e.preventDefault();
      const keyChar = e.key;
      const isDigit = /^[0-9]$/.test(keyChar);
      const pixelType: PixelType = isDigit ? 'number' : 'letter';

      const vals = editorStore.getValues();

      this.triggerPixelFlip(selected.x, selected.y);

      this.dispatchEvent(new CustomEvent('apply-edit', {
        detail: {
          x: selected.x,
          y: selected.y,
          pixelType,
          val: isDigit ? keyChar : keyChar.toUpperCase(),
          textColor: vals.textColor || '#fafafa',
          bgColor: vals.bgColor || '#18181b',
          boardId: boardStore.getPreset()
        },
        bubbles: true,
        composed: true
      }));

      // Auto advance cursor right
      if (selected.x < vp.boardWidth - 1) {
        editorStore.setSelectedCoord({ x: selected.x + 1, y: selected.y });
      }
    }
  }

  private setupCanvasSize(canvas: HTMLCanvasElement) {
    const rect = this.getBoundingClientRect();
    canvas.width = rect.width || window.innerWidth;
    canvas.height = rect.height || window.innerHeight;
  }

  public centerBoard() {
    const canvas = this.shadowRoot?.querySelector('#board-canvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width : window.innerWidth;
    const height = canvas ? canvas.height : window.innerHeight;

    const vp = boardStore.getViewport();
    const zoom = Math.min(width / (vp.boardWidth * 1.1), height / (vp.boardHeight * 1.1));
    const panX = (width - vp.boardWidth * zoom) / 2;
    const panY = (height - vp.boardHeight * zoom) / 2;

    boardStore.setViewport({ zoom, panX, panY });
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = Math.pow(1.005, -e.deltaY);
      this.zoomAtPoint(zoomFactor, e.clientX, e.clientY);
    } else {
      this.panViewport(-e.deltaX, -e.deltaY);
    }
  }

  private zoomAtPoint(factor: number, clientX: number, clientY: number) {
    const rect = this.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const viewport = boardStore.getViewport();
    const newZoom = Math.max(0.2, Math.min(100, viewport.zoom * factor));

    const panX = x - (x - viewport.panX) * (newZoom / viewport.zoom);
    const panY = y - (y - viewport.panY) * (newZoom / viewport.zoom);

    boardStore.setViewport({ zoom: newZoom, panX, panY });
  }

  private panViewport(dx: number, dy: number) {
    const vp = boardStore.getViewport();
    boardStore.setViewport({ panX: vp.panX + dx, panY: vp.panY + dy });
  }

  private handleMouseDown(e: MouseEvent) {
    if (e.button === 0 || e.button === 1 || this.isSpacePressed) {
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
    }
  }

  private handleMouseMove(e: MouseEvent) {
    const rect = this.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const vp = boardStore.getViewport();
    if (this.renderer) {
      this.hoverCoord = this.renderer.screenToBoardCoord(screenX, screenY, vp);
    }

    if (this.isDragging) {
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.panViewport(dx, dy);
    }
  }

  private handleMouseUp(e: MouseEvent) {
    if (this.isDragging) {
      const dist = Math.hypot(e.clientX - this.dragStartX, e.clientY - this.dragStartY);
      if (dist < 5 && !this.isSpacePressed && e.button === 0) {
        this.handleTapAt(e.clientX, e.clientY);
      }
    }
    this.isDragging = false;
  }

  private handleTapAt(clientX: number, clientY: number) {
    const rect = this.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const vp = boardStore.getViewport();

    if (this.renderer) {
      const coord = this.renderer.screenToBoardCoord(screenX, screenY, vp);
      if (coord) {
        editorStore.setSelectedCoord(coord);
        this.dispatchEvent(new CustomEvent('pixel-selected', { detail: coord, bubbles: true, composed: true }));
      }
    }
  }

  public requestRender() {
    if (this.renderer) {
      this.renderer.render(
        boardStore.getViewport(),
        editorStore.getSelectedCoord(),
        this.hoverCoord
      );
    }
  }

  render() {
    const vp = boardStore.getViewport();
    const selected = editorStore.getSelectedCoord();
    const coordText = selected ? `X: ${selected.x}, Y: ${selected.y}` : (this.hoverCoord ? `X: ${this.hoverCoord.x}, Y: ${this.hoverCoord.y}` : 'X: --, Y: --');
    const zoomText = `${Math.round(vp.zoom * 100 / (Math.min(window.innerWidth / vp.boardWidth, window.innerHeight / vp.boardHeight)))}%`;

    return renderCanvasBoardPresentation({
      coordText,
      zoomText,
      isTimeTravelOpen: this.isTimeTravelOpen,
      onZoomIn: () => this.zoomAtPoint(1.25, window.innerWidth / 2, window.innerHeight / 2),
      onZoomOut: () => this.zoomAtPoint(0.8, window.innerWidth / 2, window.innerHeight / 2),
      onResetView: () => this.centerBoard(),
      onToggleTimeTravel: () => {
        this.isTimeTravelOpen = !this.isTimeTravelOpen;
        this.dispatchEvent(new CustomEvent('toggle-time-travel', { detail: { open: this.isTimeTravelOpen }, bubbles: true, composed: true }));
      },
      onOpenHelp: () => this.dispatchEvent(new CustomEvent('open-help', { bubbles: true, composed: true }))
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-canvas-board': AppCanvasBoard;
  }
}

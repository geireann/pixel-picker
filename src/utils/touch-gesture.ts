export interface TouchGestureCallbacks {
  onPan: (deltaX: number, deltaY: number) => void;
  onPinchZoom: (zoomFactor: number, centerX: number, centerY: number) => void;
  onTap: (screenX: number, screenY: number) => void;
}

export class TouchGestureHandler {
  private element: HTMLElement;
  private callbacks: TouchGestureCallbacks;
  private initialPinchDistance = 0;
  private isMultiTouch = false;
  private lastTouchX = 0;
  private lastTouchY = 0;
  private lastTapTime = 0;

  constructor(element: HTMLElement, callbacks: TouchGestureCallbacks) {
    this.element = element;
    this.callbacks = callbacks;
    this.bindEvents();
  }

  private bindEvents() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  private getDistance(t1: Touch, t2: Touch): number {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      this.isMultiTouch = false;
      this.lastTouchX = e.touches[0].clientX;
      this.lastTouchY = e.touches[0].clientY;

      const now = Date.now();
      if (now - this.lastTapTime < 300) {
        // Double tap
        this.callbacks.onTap(this.lastTouchX, this.lastTouchY);
      }
      this.lastTapTime = now;
    } else if (e.touches.length === 2) {
      this.isMultiTouch = true;
      this.initialPinchDistance = this.getDistance(e.touches[0], e.touches[1]);
    }
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault(); // Prevent native mobile page scrolling over canvas

    if (e.touches.length === 1 && !this.isMultiTouch) {
      const deltaX = e.touches[0].clientX - this.lastTouchX;
      const deltaY = e.touches[0].clientY - this.lastTouchY;
      this.lastTouchX = e.touches[0].clientX;
      this.lastTouchY = e.touches[0].clientY;
      this.callbacks.onPan(deltaX, deltaY);
    } else if (e.touches.length === 2) {
      const newDist = this.getDistance(e.touches[0], e.touches[1]);
      if (this.initialPinchDistance > 0) {
        const factor = newDist / this.initialPinchDistance;
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        this.callbacks.onPinchZoom(factor, centerX, centerY);
        this.initialPinchDistance = newDist;
      }
    }
  }

  private handleTouchEnd(e: TouchEvent) {
    if (e.touches.length === 0 && !this.isMultiTouch) {
      // Single tap tap selection
    }
  }
}

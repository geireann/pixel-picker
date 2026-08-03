import { css } from 'lit';

export const canvasBoardStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #e4e4e7;
    user-select: none;
    touch-action: none;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: grab;
  }

  canvas:active {
    cursor: grabbing;
  }

  /* Minimalist Light Mode HUD Overlay */
  .hud-overlay {
    position: absolute;
    top: 14px;
    left: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1px solid #d4d4d8;
    padding: 4px 10px;
    color: #09090b;
    font-size: 0.8rem;
    font-family: 'Space Mono', monospace;
    z-index: 10;
  }

  .hud-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 6px;
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
  }

  .hud-pill span.label {
    color: #71717a;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .hud-pill span.val {
    color: #09090b;
    font-weight: 700;
    font-family: 'Space Mono', monospace;
  }

  button.mode-pill {
    cursor: pointer;
    font-family: 'Space Mono', monospace;
    transition: all 0.15s ease;
  }

  button.mode-pill:hover {
    border-color: #09090b;
  }

  .mode-pill.offline {
    background: #f4f4f5;
    border-color: #d4d4d8;
    color: #71717a;
  }

  .mode-pill.online {
    background: #2563eb;
    border-color: #1d4ed8;
    color: #ffffff;
  }

  .mode-pill.online span.label {
    color: #ffffff;
  }

  .mode-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }

  .mode-pill.offline .mode-dot {
    background: #71717a;
  }

  .mode-pill.online .mode-dot {
    background: #4ade80;
    box-shadow: 0 0 6px #4ade80;
  }

  .controls-bar {
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 10;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    background: #ffffff;
    border: 1px solid #d4d4d8;
    color: #09090b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .icon-btn:hover {
    background: #f4f4f5;
    border-color: #09090b;
  }

  .icon-btn.active {
    background: #09090b;
    color: #ffffff;
    border-color: #09090b;
  }

  svg {
    display: block;
  }
`;

import { css } from 'lit';

export const timeScrubberStyles = css`
  :host {
    display: block;
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 680px;
    z-index: 30;
  }

  .scrubber-card {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    border-top: 3px solid #09090b;
    padding: 12px 18px;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 900;
    padding: 4px 8px;
    font-family: 'Playfair Display', serif;
    letter-spacing: 0.05em;
    font-size: 0.9rem;
  }

  .status-tag.live {
    background: #f4f4f5;
    color: #09090b;
    border: 1px solid #d4d4d8;
  }

  .status-tag.historical {
    background: #09090b;
    color: #ffffff;
    border: 1px solid #09090b;
  }

  .indicator-box {
    width: 6px;
    height: 6px;
    background: currentColor;
  }

  .time-display {
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'Space Mono', monospace;
    color: #09090b;
  }

  .close-scrubber-btn {
    width: 26px;
    height: 26px;
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    color: #71717a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .close-scrubber-btn:hover {
    color: #ffffff;
    background: #09090b;
    border-color: #09090b;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  input[type="range"] {
    flex: 1;
    -webkit-appearance: none;
    background: #f4f4f5;
    height: 6px;
    border: 1px solid #d4d4d8;
    outline: none;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #09090b;
    border: 1px solid #09090b;
    cursor: pointer;
  }

  .return-btn {
    padding: 4px 10px;
    border: 1px solid #09090b;
    background: #09090b;
    color: #ffffff;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: 'Playfair Display', serif;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .return-btn:hover {
    background: #27272a;
  }
`;

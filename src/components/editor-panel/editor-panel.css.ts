import { css } from 'lit';

export const editorPanelStyles = css`
  :host {
    display: block;
  }

  .inspector-card {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 320px;
    background: #ffffff;
    border: 1px solid #d4d4d8;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    padding: 12px;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    z-index: 40;
    animation: fadeIn 0.15s ease;
  }

  @media (max-width: 640px) {
    .inspector-card {
      bottom: 16px;
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 340px;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f4f4f5;
  }

  .coord-tag {
    font-size: 0.78rem;
    font-weight: 700;
    color: #09090b;
    background: #f4f4f5;
    padding: 2px 6px;
    border: 1px solid #e4e4e7;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .icon-action-btn {
    width: 24px;
    height: 24px;
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    color: #71717a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .icon-action-btn:hover {
    color: #09090b;
    background: #e4e4e7;
    border-color: #09090b;
  }

  .tab-bar {
    display: flex;
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    padding: 2px;
    gap: 2px;
    margin-bottom: 10px;
  }

  .tab-btn {
    flex: 1;
    padding: 6px 4px;
    border: none;
    background: none;
    color: #71717a;
    font-size: 0.7rem;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .tab-btn.active {
    background: #ffffff;
    color: #09090b;
    border: 1px solid #09090b;
  }

  .brush-size-bar {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
  }

  .brush-label {
    font-size: 0.65rem;
    color: #71717a;
    font-weight: 700;
    width: 38px;
  }

  .brush-size-group {
    display: flex;
    flex: 1;
    gap: 4px;
  }

  .brush-size-btn {
    flex: 1;
    padding: 3px 0;
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    color: #71717a;
    font-size: 0.65rem;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    cursor: pointer;
  }

  .brush-size-btn.active {
    background: #09090b;
    color: #ffffff;
    border-color: #09090b;
  }

  .input-area {
    margin-bottom: 10px;
  }

  .character-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .char-input {
    width: 46px;
    height: 46px;
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    text-align: center;
    font-family: 'Space Mono', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    color: #09090b;
    box-sizing: border-box;
  }

  .char-input:focus {
    outline: none;
    border-color: #09090b;
    background: #ffffff;
  }

  .color-pickers {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .color-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.65rem;
    color: #71717a;
    cursor: pointer;
  }

  input[type="color"] {
    -webkit-appearance: none;
    border: none;
    width: 22px;
    height: 22px;
    cursor: pointer;
    background: none;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: 1px solid #d4d4d8;
  }

  .color-swatches-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
  }

  .swatch-btn {
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid #d4d4d8;
    cursor: pointer;
  }

  .swatch-btn:hover, .swatch-btn.selected {
    border-color: #09090b;
    transform: scale(1.05);
  }

  .custom-color-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    cursor: pointer;
  }

  .apply-btn {
    width: 100%;
    padding: 8px;
    border: 1px solid #09090b;
    background: #09090b;
    color: #ffffff;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .apply-btn:hover {
    background: #27272a;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

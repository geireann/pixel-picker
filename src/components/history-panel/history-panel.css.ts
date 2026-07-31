import { css } from 'lit';

export const historyPanelStyles = css`
  :host {
    display: block;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(9, 9, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
  }

  .panel {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    border-top: 3px solid #09090b;
    width: 100%;
    max-width: 480px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .header {
    padding: 14px 18px;
    border-bottom: 1px solid #e4e4e7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f4f4f5;
  }

  .title {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 1.3rem;
    letter-spacing: 0.05em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .coord-subtitle {
    font-family: 'Space Mono', monospace;
    color: #52525b;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .close-btn {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    color: #71717a;
    cursor: pointer;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #ffffff;
    background: #09090b;
    border-color: #09090b;
  }

  .history-list {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .history-item {
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .item-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .preview-box {
    width: 36px;
    height: 36px;
    border: 1.5px solid #09090b;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 1rem;
    position: relative;
    box-sizing: border-box;
  }

  .preview-box::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.15);
  }

  .meta-author {
    font-size: 0.78rem;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }

  .meta-time {
    font-size: 0.72rem;
    color: #71717a;
  }

  .empty-state {
    text-align: center;
    padding: 32px;
    color: #71717a;
    font-size: 0.85rem;
  }
`;

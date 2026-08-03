import { css } from 'lit';

export const vestaboardModalStyles = css`
  :host {
    display: block;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(9, 9, 11, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.15s ease-out;
  }

  .modal-card {
    background: #ffffff;
    border: 1px solid #09090b;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
    width: 90%;
    max-width: 440px;
    padding: 20px;
    font-family: 'Space Mono', monospace;
    color: #09090b;
    position: relative;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e4e7;
  }

  .modal-title {
    font-size: 0.9rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vesta-badge {
    background: #09090b;
    color: #ffffff;
    font-size: 0.65rem;
    padding: 2px 6px;
    font-weight: 700;
  }

  .close-btn {
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    color: #71717a;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .close-btn:hover {
    color: #09090b;
    border-color: #09090b;
    background: #e4e4e7;
  }

  .security-box {
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    border-left: 3px solid #16a34a;
    padding: 10px;
    margin-bottom: 16px;
    font-size: 0.7rem;
    line-height: 1.4;
    color: #27272a;
  }

  .security-box strong {
    color: #16a34a;
    display: block;
    margin-bottom: 2px;
  }

  .field-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .token-input {
    width: 100%;
    padding: 10px;
    font-family: 'Space Mono', monospace;
    font-size: 0.8rem;
    border: 1px solid #d4d4d8;
    background: #fafafa;
    color: #09090b;
    box-sizing: border-box;
    margin-bottom: 16px;
  }

  .token-input:focus {
    outline: none;
    border-color: #09090b;
    background: #ffffff;
  }

  .modal-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .save-btn {
    flex: 1;
    padding: 10px;
    background: #09090b;
    color: #ffffff;
    border: 1px solid #09090b;
    font-family: 'Space Mono', monospace;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .save-btn:hover {
    background: #27272a;
  }

  .clear-btn {
    padding: 10px;
    background: #f4f4f5;
    color: #e11d48;
    border: 1px solid #e4e4e7;
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

  .clear-btn:hover {
    border-color: #e11d48;
    background: #fff1f2;
  }

  .shortcut-tip {
    margin-top: 14px;
    font-size: 0.68rem;
    color: #71717a;
    text-align: center;
  }

  .shortcut-tip kbd {
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    padding: 1px 4px;
    color: #09090b;
    font-weight: 700;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

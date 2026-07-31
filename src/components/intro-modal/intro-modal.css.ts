import { css } from 'lit';

export const introModalStyles = css`
  :host {
    display: block;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(9, 9, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .modal {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    border-top: 3px solid #09090b;
    max-width: 380px;
    width: 100%;
    padding: 24px;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    position: relative;
    box-sizing: border-box;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .title {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 1.6rem;
    letter-spacing: 0.04em;
    margin: 0 0 12px 0;
    color: #09090b;
  }

  .description {
    font-size: 0.88rem;
    line-height: 1.6;
    color: #52525b;
    margin-bottom: 20px;
  }

  .action-btn {
    width: 100%;
    padding: 12px;
    border: 1px solid #09090b;
    background: #09090b;
    color: #ffffff;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .action-btn:hover {
    background: #27272a;
  }
`;

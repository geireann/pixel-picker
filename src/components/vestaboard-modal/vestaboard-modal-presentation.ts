import { html, type TemplateResult } from 'lit';
import { iconClose } from '../../utils/pixel-icons';

export interface VestaboardModalProps {
  open: boolean;
  tokenValue: string;
  isTokenSaved: boolean;
  onTokenInput: (val: string) => void;
  onSaveToken: () => void;
  onClearToken: () => void;
  onClose: () => void;
  onSendNow: () => void;
}

export function renderVestaboardModalPresentation(props: VestaboardModalProps): TemplateResult {
  if (!props.open) return html``;

  return html`
    <div class="modal-overlay" @click=${(e: Event) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) props.onClose();
    }}>
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">
            <span>VESTABOARD SYNC</span>
            <span class="vesta-badge">22x6</span>
          </div>
          <button class="close-btn" title="Close" @click=${props.onClose}>${iconClose}</button>
        </div>

        <div class="security-box">
          <strong>🔒 100% DEVICE-ONLY SECURITY GUARANTEE</strong>
          Your Vestaboard API Key is stored securely ONLY in your browser's local device storage (localStorage). It is never sent to any backend database, telemetry log, or third-party service.
        </div>

        <label class="field-label" for="vesta-token-input">VESTABOARD API TOKEN</label>
        <input
          id="vesta-token-input"
          class="token-input"
          type="password"
          placeholder="Paste Read/Write Vestaboard API Token..."
          .value=${props.tokenValue}
          @input=${(e: Event) => props.onTokenInput((e.target as HTMLInputElement).value)}
        />

        <div class="modal-actions">
          <button class="save-btn" @click=${props.onSaveToken}>
            ${props.isTokenSaved ? 'SAVE & SEND NOW' : 'SAVE TOKEN'}
          </button>
          ${props.isTokenSaved ? html`
            <button class="clear-btn" @click=${props.onClearToken}>CLEAR</button>
          ` : html``}
        </div>

        <div class="shortcut-tip">
          💡 Tip: Press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> (or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>) on the 22x6 board to sync!
        </div>
      </div>
    </div>
  `;
}

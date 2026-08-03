import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { vestaboardModalStyles } from './vestaboard-modal.css';
import { renderVestaboardModalPresentation } from './vestaboard-modal-presentation';
import { getStoredVestaboardToken, setStoredVestaboardToken, clearStoredVestaboardToken } from '../../services/vestaboard-service';

@customElement('app-vestaboard-modal')
export class AppVestaboardModal extends LitElement {
  static styles = [vestaboardModalStyles];

  @property({ type: Boolean }) open = false;
  @state() tokenValue = getStoredVestaboardToken();

  firstUpdated() {
    this.tokenValue = getStoredVestaboardToken();
  }

  private handleSaveToken() {
    setStoredVestaboardToken(this.tokenValue);
    this.dispatchEvent(new CustomEvent('vestaboard-token-saved', {
      detail: { token: this.tokenValue },
      bubbles: true,
      composed: true
    }));
    this.open = false;
  }

  private handleClearToken() {
    clearStoredVestaboardToken();
    this.tokenValue = '';
    this.dispatchEvent(new CustomEvent('vestaboard-token-cleared', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const isTokenSaved = Boolean(getStoredVestaboardToken());

    return renderVestaboardModalPresentation({
      open: this.open,
      tokenValue: this.tokenValue,
      isTokenSaved,
      onTokenInput: (val: string) => { this.tokenValue = val; },
      onSaveToken: () => this.handleSaveToken(),
      onClearToken: () => this.handleClearToken(),
      onClose: () => { this.open = false; },
      onSendNow: () => this.handleSaveToken()
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-vestaboard-modal': AppVestaboardModal;
  }
}

import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { introModalStyles } from './intro-modal.css';
import { renderIntroModalPresentation } from './intro-modal-presentation';

@customElement('app-intro-modal')
export class AppIntroModal extends LitElement {
  static styles = [introModalStyles];

  @property({ type: Boolean }) open = false;

  connectedCallback() {
    super.connectedCallback();
    const seen = localStorage.getItem('pixelpicker_intro_seen');
    if (!seen) {
      this.open = true;
    }
  }

  public dismiss() {
    this.open = false;
    localStorage.setItem('pixelpicker_intro_seen', 'true');
    this.dispatchEvent(new CustomEvent('intro-dismissed', { bubbles: true, composed: true }));
  }

  render() {
    return renderIntroModalPresentation({
      open: this.open,
      onDismiss: () => this.dismiss()
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-intro-modal': AppIntroModal;
  }
}

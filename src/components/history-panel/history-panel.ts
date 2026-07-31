import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { historyPanelStyles } from './history-panel.css';
import { renderHistoryPanelPresentation } from './history-panel-presentation';
import { historyStore } from '../../store/history-store';
import { editorStore } from '../../store/editor-store';

@customElement('app-history-panel')
export class AppHistoryPanel extends LitElement {
  static styles = [historyPanelStyles];

  @property({ type: Boolean }) open = false;

  private unsubscribeHistoryStore: (() => void) | null = null;
  private unsubscribeEditorStore: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeHistoryStore = historyStore.subscribe(() => this.requestUpdate());
    this.unsubscribeEditorStore = editorStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeHistoryStore?.();
    this.unsubscribeEditorStore?.();
  }

  render() {
    const coord = editorStore.getSelectedCoord();
    const history = historyStore.getPixelHistory();

    return renderHistoryPanelPresentation({
      open: this.open,
      coord,
      history,
      onClose: () => {
        this.open = false;
        this.dispatchEvent(new CustomEvent('close-history', { bubbles: true, composed: true }));
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-history-panel': AppHistoryPanel;
  }
}

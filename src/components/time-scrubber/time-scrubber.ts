import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { timeScrubberStyles } from './time-scrubber.css';
import { renderTimeScrubberPresentation } from './time-scrubber-presentation';
import { historyStore } from '../../store/history-store';
import { boardStore } from '../../store/board-store';

@customElement('app-time-scrubber')
export class AppTimeScrubber extends LitElement {
  static styles = [timeScrubberStyles];

  @property({ type: Boolean }) open = false;

  private unsubscribeHistoryStore: (() => void) | null = null;
  private unsubscribeBoardStore: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeHistoryStore = historyStore.subscribe(() => this.requestUpdate());
    this.unsubscribeBoardStore = boardStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeHistoryStore?.();
    this.unsubscribeBoardStore?.();
  }

  private handleScrub(timestamp: number) {
    historyStore.setCurrentScrubberTimestamp(timestamp);
    boardStore.setIsLive(false);
    this.dispatchEvent(new CustomEvent('time-travel-scrub', {
      detail: { timestamp },
      bubbles: true,
      composed: true
    }));
  }

  private handleReturnLive() {
    boardStore.setIsLive(true);
    const { latest } = historyStore.getTimeline();
    historyStore.setCurrentScrubberTimestamp(latest);
    this.dispatchEvent(new CustomEvent('return-live', {
      bubbles: true,
      composed: true
    }));
  }

  private handleClose() {
    this.open = false;
    if (!boardStore.getIsLive()) {
      this.handleReturnLive();
    }
    this.dispatchEvent(new CustomEvent('time-travel-closed', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const isLive = boardStore.getIsLive();
    const timeline = historyStore.getTimeline();

    return renderTimeScrubberPresentation({
      open: this.open,
      isLive,
      ...timeline,
      onScrub: (ts: number) => this.handleScrub(ts),
      onReturnLive: () => this.handleReturnLive(),
      onClose: () => this.handleClose()
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-time-scrubber': AppTimeScrubber;
  }
}

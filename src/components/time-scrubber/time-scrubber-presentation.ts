import { html, type TemplateResult } from 'lit';
import { iconClose } from '../../utils/pixel-icons';

export interface TimeScrubberProps {
  open: boolean;
  isLive: boolean;
  earliest: number;
  latest: number;
  current: number;
  totalEdits: number;
  onScrub: (timestamp: number) => void;
  onReturnLive: () => void;
  onClose: () => void;
}

export function renderTimeScrubberPresentation(props: TimeScrubberProps): TemplateResult {
  if (!props.open) return html``;

  const dateStr = props.isLive ? 'LIVE BOARD' : new Date(props.current).toLocaleString();

  return html`
    <div class="scrubber-card">
      <div class="top-row">
        <div class="status-tag ${props.isLive ? 'live' : 'historical'}">
          <div class="indicator-box"></div>
          <span>${props.isLive ? 'LIVE' : 'HISTORICAL SNAPSHOT'}</span>
        </div>

        <div class="time-display">${dateStr}</div>

        <div style="display: flex; align-items: center; gap: 8px;">
          ${!props.isLive ? html`
            <button class="return-btn" @click=${props.onReturnLive}>
              RETURN LIVE
            </button>
          ` : html`
            <div style="font-size: 0.75rem; color: #71717a;">${props.totalEdits} EDITS</div>
          `}
          <button class="close-scrubber-btn" title="Close Time Travel Mode" @click=${props.onClose}>${iconClose}</button>
        </div>
      </div>

      <div class="slider-row">
        <span style="font-size: 0.7rem; color: #71717a;">PAST</span>
        <input
          type="range"
          .min=${String(props.earliest)}
          .max=${String(props.latest)}
          .value=${String(props.current)}
          @input=${(e: Event) => props.onScrub(Number((e.target as HTMLInputElement).value))}
        />
        <span style="font-size: 0.7rem; color: #71717a;">NOW</span>
      </div>
    </div>
  `;
}

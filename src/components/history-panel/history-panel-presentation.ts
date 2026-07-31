import { html, type TemplateResult } from 'lit';
import type { PixelHistoryItem } from '../../types/pixel';
import { iconClose, iconHistory } from '../../utils/pixel-icons';

export interface HistoryPanelProps {
  open: boolean;
  coord: { x: number; y: number } | null;
  history: PixelHistoryItem[];
  onClose: () => void;
}

export function renderHistoryPanelPresentation(props: HistoryPanelProps): TemplateResult {
  if (!props.open || !props.coord) return html``;

  return html`
    <div class="modal-backdrop" @click=${(e: Event) => e.target === e.currentTarget && props.onClose()}>
      <div class="panel">
        <div class="header">
          <div class="title">
            <span style="display: inline-flex; align-items: center;">${iconHistory}</span>
            <span>HISTORY</span>
            <span class="coord-subtitle">(${props.coord.x}, ${props.coord.y})</span>
          </div>
          <button class="close-btn" @click=${props.onClose}>${iconClose}</button>
        </div>

        <div class="history-list">
          ${props.history.length === 0 ? html`
            <div class="empty-state">NO RECORDED EDITS FOR THIS COORDINATE.</div>
          ` : props.history.map(item => {
            const dateStr = new Date(item.timestamp).toLocaleString();
            let previewStyle = `background: ${item.val};`;
            let content = '';

            if (item.type !== 'color') {
              previewStyle = `background: ${item.bgColor || '#ffffff'}; color: ${item.textColor || '#09090b'};`;
              content = item.val;
            }

            return html`
              <div class="history-item">
                <div class="item-left">
                  <div class="preview-box" style="${previewStyle}">
                    ${content}
                  </div>
                  <div>
                    <div style="font-size: 0.8rem; font-weight: 700; color: #09090b;">TYPE: ${item.type.toUpperCase()}</div>
                    <div class="meta-author">AUTHOR: ${item.authorHash}</div>
                  </div>
                </div>
                <div class="meta-time">${dateStr}</div>
              </div>
            `;
          })}
        </div>
      </div>
    </div>
  `;
}

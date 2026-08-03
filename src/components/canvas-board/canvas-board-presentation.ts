import { html, type TemplateResult } from 'lit';
import { iconZoomIn, iconZoomOut, iconReset, iconHelp, iconHistory } from '../../utils/pixel-icons';

export interface CanvasBoardProps {
  coordText: string;
  zoomText: string;
  isTimeTravelOpen: boolean;
  isOnline: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleTimeTravel: () => void;
  onOpenHelp: () => void;
  onToggleOnline: () => void;
}

export function renderCanvasBoardPresentation(props: CanvasBoardProps): TemplateResult {
  return html`
    <div class="hud-overlay">
      <div class="hud-pill">
        <span class="label">POS</span>
        <span class="val">${props.coordText}</span>
      </div>
      <div class="hud-pill">
        <span class="label">ZOOM</span>
        <span class="val">${props.zoomText}</span>
      </div>
      <button
        class="hud-pill mode-pill ${props.isOnline ? 'online' : 'offline'}"
        title=${props.isOnline ? 'Online (Global Board Connected) — Click to switch to Offline Mode' : 'Offline (Local Board Only) — Click to connect to Online Global Board'}
        @click=${props.onToggleOnline}
      >
        <span class="mode-dot"></span>
        <span class="label">${props.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
      </button>
    </div>

    <div class="controls-bar">
      <button class="icon-btn ${props.isTimeTravelOpen ? 'active' : ''}" title="Toggle Time Travel Timeline" @click=${props.onToggleTimeTravel}>${iconHistory}</button>
      <button class="icon-btn" title="Zoom In" @click=${props.onZoomIn}>${iconZoomIn}</button>
      <button class="icon-btn" title="Zoom Out" @click=${props.onZoomOut}>${iconZoomOut}</button>
      <button class="icon-btn" title="Reset View" @click=${props.onResetView}>${iconReset}</button>
      <button class="icon-btn" title="Help / Info" @click=${props.onOpenHelp}>${iconHelp}</button>
    </div>

    <canvas id="board-canvas"></canvas>
  `;
}

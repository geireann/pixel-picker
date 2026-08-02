import { html, type TemplateResult } from 'lit';
import type { PixelType, BrushSize } from '../../types/pixel';
import { iconPixelLetter, iconPixelColor, iconPixelNumber, iconPixelBrush, iconClose, iconHistory } from '../../utils/pixel-icons';

export interface EditorPanelProps {
  coord: { x: number; y: number } | null;
  activeTab: PixelType;
  brushSize: BrushSize;
  colorVal: string;
  letterVal: string;
  numberVal: string;
  textColor: string;
  bgColor: string;
  onTabChange: (tab: PixelType) => void;
  onBrushSizeChange: (size: BrushSize) => void;
  onColorChange: (val: string) => void;
  onLetterChange: (val: string) => void;
  onNumberChange: (val: string) => void;
  onTextColorChange: (val: string) => void;
  onBgColorChange: (val: string) => void;
  onApply: () => void;
  onViewHistory: () => void;
  onClose: () => void;
  onKeypadTap: (key: string) => void;
}

const QUICK_COLORS = [
  '#09090b', '#ffffff', '#e11d48', '#2563eb', '#16a34a', '#ca8a04', '#7c3aed', '#ea580c'
];

export function renderEditorPanelPresentation(props: EditorPanelProps): TemplateResult {
  if (!props.coord) return html``;

  return html`
    <div class="inspector-card">
      <div class="card-header">
        <div class="coord-tag">X: ${props.coord.x}, Y: ${props.coord.y}</div>
        <div class="header-actions">
          <button class="icon-action-btn" title="View History" @click=${props.onViewHistory}>${iconHistory}</button>
          <button class="icon-action-btn" title="Close Inspector" @click=${props.onClose}>${iconClose}</button>
        </div>
      </div>

      <div class="tab-bar">
        <button
          class="tab-btn ${props.activeTab === 'letter' ? 'active' : ''}"
          @click=${() => props.onTabChange('letter')}
        >${iconPixelLetter} LETTER</button>
        <button
          class="tab-btn ${props.activeTab === 'color' ? 'active' : ''}"
          @click=${() => props.onTabChange('color')}
        >${iconPixelColor} COLOR</button>
        <button
          class="tab-btn ${props.activeTab === 'number' ? 'active' : ''}"
          @click=${() => props.onTabChange('number')}
        >${iconPixelNumber} NUMBER</button>
        <button
          class="tab-btn ${props.activeTab === 'brush' ? 'active' : ''}"
          @click=${() => props.onTabChange('brush')}
        >${iconPixelBrush} BRUSH</button>
      </div>

      <div class="input-area">
        ${props.activeTab === 'brush' ? html`
          <div class="brush-size-bar">
            <span class="brush-label">SIZE</span>
            <div class="brush-size-group">
              <button
                class="brush-size-btn ${props.brushSize === 1 ? 'active' : ''}"
                @click=${() => props.onBrushSizeChange(1)}
              >1x1</button>
              <button
                class="brush-size-btn ${props.brushSize === 3 ? 'active' : ''}"
                @click=${() => props.onBrushSizeChange(3)}
              >3x3</button>
              <button
                class="brush-size-btn ${props.brushSize === 5 ? 'active' : ''}"
                @click=${() => props.onBrushSizeChange(5)}
              >5x5</button>
            </div>
          </div>
          <div class="color-swatches-grid">
            ${QUICK_COLORS.map(hex => html`
              <button
                class="swatch-btn ${props.colorVal === hex ? 'selected' : ''}"
                style="background: ${hex}"
                @click=${() => {
                  props.onColorChange(hex);
                  props.onApply();
                }}
              ></button>
            `)}
            <label class="custom-color-btn" title="Custom Color">
              <input
                type="color"
                .value=${props.colorVal}
                @input=${(e: Event) => props.onColorChange((e.target as HTMLInputElement).value)}
              />
            </label>
          </div>
        ` : props.activeTab === 'letter' || props.activeTab === 'number' ? html`
          <div class="character-input-row">
            <input
              id="pixel-char-input"
              class="char-input"
              type="text"
              maxlength="1"
              placeholder=${props.activeTab === 'letter' ? 'A' : '7'}
              .value=${props.activeTab === 'letter' ? props.letterVal : props.numberVal}
              @input=${(e: Event) => {
                const val = (e.target as HTMLInputElement).value;
                if (props.activeTab === 'letter') props.onLetterChange(val);
                else props.onNumberChange(val);
              }}
            />
            <div class="color-pickers">
              <label class="color-field">
                <span>TEXT</span>
                <input
                  type="color"
                  .value=${props.textColor}
                  @input=${(e: Event) => props.onTextColorChange((e.target as HTMLInputElement).value)}
                />
              </label>
              <label class="color-field">
                <span>BG</span>
                <input
                  type="color"
                  .value=${props.bgColor}
                  @input=${(e: Event) => props.onBgColorChange((e.target as HTMLInputElement).value)}
                />
              </label>
            </div>
          </div>
        ` : html`
          <div class="color-swatches-grid">
            ${QUICK_COLORS.map(hex => html`
              <button
                class="swatch-btn ${props.colorVal === hex ? 'selected' : ''}"
                style="background: ${hex}"
                @click=${() => {
                  props.onColorChange(hex);
                  props.onApply();
                }}
              ></button>
            `)}
            <label class="custom-color-btn" title="Custom Color">
              <input
                type="color"
                .value=${props.colorVal}
                @input=${(e: Event) => props.onColorChange((e.target as HTMLInputElement).value)}
              />
            </label>
          </div>
        `}
      </div>

      <button class="apply-btn" @click=${props.onApply}>
        APPLY EDIT
      </button>
    </div>
  `;
}

import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { editorPanelStyles } from './editor-panel.css';
import { renderEditorPanelPresentation } from './editor-panel-presentation';
import { editorStore } from '../../store/editor-store';
import type { PixelType, BrushSize } from '../../types/pixel';

@customElement('app-editor-panel')
export class AppEditorPanel extends LitElement {
  static styles = [editorPanelStyles];

  private unsubscribeStore: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeStore = editorStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeStore?.();
  }

  private handleKeypadTap(key: string) {
    const vals = editorStore.getValues();
    if (key === 'C') {
      editorStore.setValues({ numberVal: '' });
    } else if (key === '↵') {
      this.handleApply();
    } else {
      const newVal = (vals.numberVal === '0' ? key : (vals.numberVal + key)).substring(0, 2);
      editorStore.setValues({ numberVal: newVal });
      this.handleApply();
    }
  }

  private handleApply() {
    const coord = editorStore.getSelectedCoord();
    if (!coord) return;

    const tab = editorStore.getActiveTab();
    const vals = editorStore.getValues();

    let val = vals.colorVal;
    if (tab === 'letter') val = vals.letterVal || 'A';
    if (tab === 'number') val = vals.numberVal || '0';
    const pixelType: PixelType = tab === 'brush' ? 'color' : tab;

    this.dispatchEvent(new CustomEvent('apply-edit', {
      detail: {
        x: coord.x,
        y: coord.y,
        pixelType,
        val,
        textColor: vals.textColor,
        bgColor: vals.bgColor
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const coord = editorStore.getSelectedCoord();
    const activeTab = editorStore.getActiveTab();
    const vals = editorStore.getValues();

    return renderEditorPanelPresentation({
      coord,
      activeTab,
      ...vals,
      onTabChange: (tab: PixelType) => editorStore.setActiveTab(tab),
      onBrushSizeChange: (size: BrushSize) => editorStore.setBrushSize(size),
      onColorChange: (val: string) => editorStore.setValues({ colorVal: val }),
      onLetterChange: (val: string) => {
        editorStore.setValues({ letterVal: val.toUpperCase() });
        if (val) this.handleApply();
      },
      onNumberChange: (val: string) => editorStore.setValues({ numberVal: val }),
      onTextColorChange: (val: string) => editorStore.setValues({ textColor: val }),
      onBgColorChange: (val: string) => editorStore.setValues({ bgColor: val }),
      onApply: () => this.handleApply(),
      onViewHistory: () => this.dispatchEvent(new CustomEvent('open-pixel-history', { detail: coord, bubbles: true, composed: true })),
      onClose: () => editorStore.setSelectedCoord(null),
      onKeypadTap: (key: string) => this.handleKeypadTap(key)
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-editor-panel': AppEditorPanel;
  }
}

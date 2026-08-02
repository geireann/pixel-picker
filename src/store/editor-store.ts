import type { PixelType, BrushSize } from '../types/pixel';

export type EditorListener = () => void;

class EditorStore {
  private selectedCoord: { x: number; y: number } | null = null;
  private activeTab: PixelType = 'color';
  private brushSize: BrushSize = 1;
  private colorVal = '#38bdf8';
  private letterVal = 'P';
  private numberVal = '7';
  private textColor = '#ffffff';
  private bgColor = '#1e293b';
  private listeners: Set<EditorListener> = new Set();

  public getSelectedCoord() {
    return this.selectedCoord;
  }

  public setSelectedCoord(coord: { x: number; y: number } | null) {
    this.selectedCoord = coord;
    this.notify();
  }

  public getActiveTab() {
    return this.activeTab;
  }

  public setActiveTab(tab: PixelType) {
    this.activeTab = tab;
    this.notify();
  }

  public getBrushSize(): BrushSize {
    return this.brushSize;
  }

  public setBrushSize(size: BrushSize) {
    this.brushSize = size;
    this.notify();
  }

  public getValues() {
    return {
      colorVal: this.colorVal,
      letterVal: this.letterVal,
      numberVal: this.numberVal,
      textColor: this.textColor,
      bgColor: this.bgColor,
      brushSize: this.brushSize
    };
  }

  public setValues(values: Partial<ReturnType<EditorStore['getValues']>>) {
    if (values.colorVal !== undefined) this.colorVal = values.colorVal;
    if (values.letterVal !== undefined) this.letterVal = values.letterVal;
    if (values.numberVal !== undefined) this.numberVal = values.numberVal;
    if (values.textColor !== undefined) this.textColor = values.textColor;
    if (values.bgColor !== undefined) this.bgColor = values.bgColor;
    this.notify();
  }

  public subscribe(fn: EditorListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const editorStore = new EditorStore();

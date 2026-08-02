import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderEditorPanelPresentation, type EditorPanelProps } from './editor-panel-presentation';

describe('renderEditorPanelPresentation', () => {
  function createProps(overrides?: Partial<EditorPanelProps>): EditorPanelProps {
    return {
      coord: { x: 15, y: 30 },
      activeTab: 'color',
      brushSize: 1,
      colorVal: '#38bdf8',
      letterVal: 'A',
      numberVal: '5',
      textColor: '#ffffff',
      bgColor: '#000000',
      onTabChange: vi.fn(),
      onBrushSizeChange: vi.fn(),
      onColorChange: vi.fn(),
      onLetterChange: vi.fn(),
      onNumberChange: vi.fn(),
      onTextColorChange: vi.fn(),
      onBgColorChange: vi.fn(),
      onApply: vi.fn(),
      onViewHistory: vi.fn(),
      onClose: vi.fn(),
      onKeypadTap: vi.fn(),
      ...overrides
    };
  }

  it('renders coordinate tag when coord is non-null', () => {
    const container = document.createElement('div');
    render(renderEditorPanelPresentation(createProps()), container);

    const tag = container.querySelector('.coord-tag');
    expect(tag).not.toBeNull();
    expect(tag?.textContent).toContain('X: 15, Y: 30');
  });

  it('renders char input when number tab is active', () => {
    const props = createProps({ activeTab: 'number' });
    const container = document.createElement('div');
    render(renderEditorPanelPresentation(props), container);

    const input = container.querySelector('.char-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('5');
  });

  it('renders brush size buttons when brush tab is active', () => {
    const props = createProps({ activeTab: 'brush', brushSize: 3 });
    const container = document.createElement('div');
    render(renderEditorPanelPresentation(props), container);

    const sizeBtns = container.querySelectorAll('.brush-size-btn');
    expect(sizeBtns.length).toBe(3);
    const activeBtn = container.querySelector('.brush-size-btn.active');
    expect(activeBtn?.textContent).toBe('3x3');
  });

  it('triggers onApply callback when submit button clicked', () => {
    const props = createProps();
    const container = document.createElement('div');
    render(renderEditorPanelPresentation(props), container);

    const applyBtn = container.querySelector('.apply-btn') as HTMLButtonElement;
    applyBtn?.click();

    expect(props.onApply).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderHistoryPanelPresentation, type HistoryPanelProps } from './history-panel-presentation';

describe('renderHistoryPanelPresentation', () => {
  function createProps(overrides?: Partial<HistoryPanelProps>): HistoryPanelProps {
    return {
      open: true,
      coord: { x: 42, y: 88 },
      history: [
        {
          id: 1,
          x: 42,
          y: 88,
          type: 'color',
          val: '#ff0000',
          textColor: '#ffffff',
          bgColor: '#000000',
          timestamp: 1750000000,
          authorHash: 'user123'
        }
      ],
      onClose: vi.fn(),
      ...overrides
    };
  }

  it('renders history item with author hash', () => {
    const container = document.createElement('div');
    render(renderHistoryPanelPresentation(createProps()), container);

    const authorText = container.textContent;
    expect(authorText).toContain('user123');
    expect(authorText).toContain('(42, 88)');
  });

  it('renders empty state when history is empty', () => {
    const container = document.createElement('div');
    render(renderHistoryPanelPresentation(createProps({ history: [] })), container);

    expect(container.textContent).toContain('NO RECORDED EDITS FOR THIS COORDINATE.');
  });
});

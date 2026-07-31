import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderCanvasBoardPresentation, type CanvasBoardProps } from './canvas-board-presentation';

describe('renderCanvasBoardPresentation', () => {
  function createProps(overrides?: Partial<CanvasBoardProps>): CanvasBoardProps {
    return {
      coordText: 'X: 10, Y: 20',
      zoomText: '100%',
      isTimeTravelOpen: false,
      onZoomIn: vi.fn(),
      onZoomOut: vi.fn(),
      onResetView: vi.fn(),
      onToggleTimeTravel: vi.fn(),
      onOpenHelp: vi.fn(),
      ...overrides
    };
  }

  it('renders coordinate and zoom HUD text', () => {
    const container = document.createElement('div');
    render(renderCanvasBoardPresentation(createProps()), container);

    const hudText = container.textContent;
    expect(hudText).toContain('X: 10, Y: 20');
    expect(hudText).toContain('100%');
  });

  it('triggers onZoomIn when zoom button is clicked', () => {
    const props = createProps();
    const container = document.createElement('div');
    render(renderCanvasBoardPresentation(props), container);

    const btn = container.querySelector('button[title="Zoom In"]') as HTMLButtonElement;
    btn?.click();

    expect(props.onZoomIn).toHaveBeenCalledTimes(1);
  });

  it('triggers onToggleTimeTravel when timeline button is clicked', () => {
    const props = createProps();
    const container = document.createElement('div');
    render(renderCanvasBoardPresentation(props), container);

    const btn = container.querySelector('button[title="Toggle Time Travel Timeline"]') as HTMLButtonElement;
    btn?.click();

    expect(props.onToggleTimeTravel).toHaveBeenCalledTimes(1);
  });
});

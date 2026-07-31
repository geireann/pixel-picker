import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderTimeScrubberPresentation, type TimeScrubberProps } from './time-scrubber-presentation';

describe('renderTimeScrubberPresentation', () => {
  function createProps(overrides?: Partial<TimeScrubberProps>): TimeScrubberProps {
    return {
      open: true,
      isLive: true,
      earliest: 1700000000,
      latest: 1750000000,
      current: 1750000000,
      totalEdits: 150,
      onScrub: vi.fn(),
      onReturnLive: vi.fn(),
      onClose: vi.fn(),
      ...overrides
    };
  }

  it('renders nothing when open is false', () => {
    const container = document.createElement('div');
    render(renderTimeScrubberPresentation(createProps({ open: false })), container);

    expect(container.children.length).toBe(0);
  });

  it('renders LIVE tag when open is true and isLive is true', () => {
    const container = document.createElement('div');
    render(renderTimeScrubberPresentation(createProps()), container);

    expect(container.textContent).toContain('LIVE');
  });

  it('renders HISTORICAL SNAPSHOT and Return to Live button when isLive is false', () => {
    const props = createProps({ isLive: false });
    const container = document.createElement('div');
    render(renderTimeScrubberPresentation(props), container);

    expect(container.textContent).toContain('HISTORICAL SNAPSHOT');
    const returnBtn = container.querySelector('.return-btn') as HTMLButtonElement;
    expect(returnBtn).not.toBeNull();

    returnBtn?.click();
    expect(props.onReturnLive).toHaveBeenCalledTimes(1);
  });
});

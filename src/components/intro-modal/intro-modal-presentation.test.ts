import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderIntroModalPresentation } from './intro-modal-presentation';

describe('renderIntroModalPresentation', () => {
  it('renders nothing when open is false', () => {
    const container = document.createElement('div');
    render(renderIntroModalPresentation({ open: false, onDismiss: () => {} }), container);
    expect(container.children.length).toBe(0);
  });

  it('renders modal content when open is true', () => {
    const container = document.createElement('div');
    render(renderIntroModalPresentation({ open: true, onDismiss: () => {} }), container);

    const title = container.querySelector('#modal-title');
    expect(title).not.toBeNull();
    expect(title?.textContent).toContain('PIXEL PICKER');
  });

  it('triggers onDismiss callback when button clicked', () => {
    const handleDismiss = vi.fn();
    const container = document.createElement('div');
    render(renderIntroModalPresentation({ open: true, onDismiss: handleDismiss }), container);

    const button = container.querySelector('.action-btn') as HTMLButtonElement;
    button?.click();

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});

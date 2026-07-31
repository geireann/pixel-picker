import type { BoardPreset } from '../types/pixel';

export function getPresetFromPath(pathname: string = window.location.pathname): BoardPreset {
  const path = pathname.toLowerCase().replace(/\/$/, '');

  if (path === '/6x22') return '6x22';
  if (path === '/256x256') return '256x256';
  if (path === '/1080x1080') return '1080x1080';

  // Default main root '/' routes to 1080x1080
  return '1080x1080';
}

export function navigateToPreset(preset: BoardPreset) {
  const targetPath = preset === '1080x1080' ? '/' : `/${preset}`;
  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, '', targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

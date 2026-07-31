import './components/intro-modal/intro-modal';
import './components/canvas-board/canvas-board';
import './components/editor-panel/editor-panel';
import './components/history-panel/history-panel';
import './components/time-scrubber/time-scrubber';

import { BoardService } from './services/board-service';
import { WebSocketService } from './services/websocket-service';
import { HistoryService } from './services/history-service';
import { analyticsService } from './services/analytics-service';
import { boardStore } from './store/board-store';
import { editorStore } from './store/editor-store';
import { historyStore } from './store/history-store';
import { getPresetFromPath } from './utils/router';
import type { EditPixelPayload, Pixel } from './types/pixel';

// Initialize Services
const boardService = new BoardService();
const wsService = new WebSocketService();
const historyService = new HistoryService();
let unsubscribeCloudRealtime: (() => void) | null = null;

// Initial Data & Route Fetch
async function initApp() {
  const currentPreset = getPresetFromPath();
  boardStore.setPreset(currentPreset);
  wsService.setPreset(currentPreset);

  analyticsService.trackPageView(window.location.pathname);

  const canvasBoard = document.getElementById('canvas-board') as any;
  if (canvasBoard && canvasBoard.centerBoard) {
    canvasBoard.centerBoard();
  }

  const pixels = await boardService.fetchInitialBoard(currentPreset);
  boardStore.setPixels(pixels);

  const timeline = await historyService.fetchHistoryTimeline(currentPreset);
  historyStore.setTimeline(timeline.earliest, timeline.latest, timeline.latest, timeline.totalEdits);

  // Subscribe to Cloud Realtime Delta Stream across devices
  if (unsubscribeCloudRealtime) unsubscribeCloudRealtime();
  unsubscribeCloudRealtime = boardService.subscribeToCloudRealtime(currentPreset, (pixel: Pixel) => {
    if (boardStore.getIsLive()) {
      boardStore.updatePixel(pixel);
    }
  });
}

initApp();

// Handle Browser Back/Forward Subpath Navigation
window.addEventListener('popstate', () => {
  initApp();
});

// WebSocket Event Listeners (Local & Cloud WS Sync)
wsService.subscribe((event) => {
  if (event.type === 'INIT') {
    const { pixels, activeUsers, preset } = event.data;
    if (preset && preset === boardStore.getPreset()) {
      if (pixels) boardStore.setPixels(pixels);
      if (activeUsers) updateActiveUsersUI(activeUsers);
    }
  } else if (event.type === 'PIXEL_UPDATED') {
    const pixel: Pixel = event.data;
    const currentPreset = boardStore.getPreset();
    const targetBoard = pixel.boardId || currentPreset;

    if (targetBoard === currentPreset && boardStore.getIsLive()) {
      boardStore.updatePixel(pixel);
    }
  } else if (event.type === 'USER_COUNT_UPDATED') {
    updateActiveUsersUI(event.data.activeUsers);
  }
});

function updateActiveUsersUI(count: number) {
  boardStore.setActiveUsers(count);
  const el = document.getElementById('active-users-count');
  if (el) {
    el.textContent = `${count} ${count === 1 ? 'CONNECTED' : 'CONNECTED'}`;
  }
}

// App Level Event Delegation & Controller
window.addEventListener('apply-edit', async (e: Event) => {
  const customEvt = e as CustomEvent<EditPixelPayload>;
  const payload = customEvt.detail;
  const boardId = boardStore.getPreset();

  const pixel: Pixel = {
    x: payload.x,
    y: payload.y,
    type: payload.pixelType,
    val: payload.val,
    textColor: payload.textColor,
    bgColor: payload.bgColor,
    updatedAt: Date.now(),
    lastAuthor: 'client',
    boardId
  };

  // Immediate local O(1) store update & flip animation
  boardStore.updatePixel(pixel);

  // 1. Send via WebSocket if connected
  wsService.sendEdit({ ...payload, boardId });

  // 2. Persist directly to Cloud Firestore
  await boardService.savePixelToFirestore(pixel);

  analyticsService.trackEvent('apply_edit', { boardId, type: payload.pixelType });
});

window.addEventListener('toggle-time-travel', (e: Event) => {
  const customEvt = e as CustomEvent<{ open: boolean }>;
  const timeScrubber = document.getElementById('time-scrubber') as any;
  if (timeScrubber) {
    timeScrubber.open = customEvt.detail.open;
  }
});

window.addEventListener('open-pixel-history', async (e: Event) => {
  const customEvt = e as CustomEvent<{ x: number; y: number }>;
  const { x, y } = customEvt.detail;
  const currentPreset = boardStore.getPreset();
  const history = await historyService.fetchPixelHistory(x, y, currentPreset);
  historyStore.setPixelHistory(history);

  const historyPanel = document.getElementById('history-panel') as any;
  if (historyPanel) historyPanel.open = true;
});

window.addEventListener('time-travel-scrub', async (e: Event) => {
  const customEvt = e as CustomEvent<{ timestamp: number }>;
  const { timestamp } = customEvt.detail;
  const currentPreset = boardStore.getPreset();
  const snapshotPixels = await boardService.fetchSnapshotAt(timestamp, currentPreset);
  boardStore.setPixels(snapshotPixels);
});

window.addEventListener('return-live', async () => {
  const currentPreset = boardStore.getPreset();
  const livePixels = await boardService.fetchInitialBoard(currentPreset);
  boardStore.setPixels(livePixels);
});

window.addEventListener('open-help', () => {
  const introModal = document.getElementById('intro-modal') as any;
  if (introModal) introModal.open = true;
});

import './components/intro-modal/intro-modal';
import './components/canvas-board/canvas-board';
import './components/editor-panel/editor-panel';
import './components/history-panel/history-panel';
import './components/time-scrubber/time-scrubber';
import './components/vestaboard-modal/vestaboard-modal';

import { BoardService } from './services/board-service';
import { WebSocketService } from './services/websocket-service';
import { HistoryService } from './services/history-service';
import { analyticsService } from './services/analytics-service';
import {
  getStoredVestaboardToken,
  convertBoardToVestaboardMatrix,
  sendToVestaboard
} from './services/vestaboard-service';
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

// Initial Data & Route Fetch (OFFLINE BY DEFAULT)
async function initApp() {
  const currentPreset = getPresetFromPath();
  boardStore.setPreset(currentPreset);
  wsService.setPreset(currentPreset);

  analyticsService.trackPageView(window.location.pathname);

  const canvasBoard = document.getElementById('canvas-board') as any;
  if (canvasBoard && canvasBoard.centerBoard) {
    canvasBoard.centerBoard();
  }

  const isOnline = boardStore.getIsOnline();

  if (!isOnline) {
    // OFFLINE MODE: Load 100% locally from device storage, zero network churn!
    if (unsubscribeCloudRealtime) {
      unsubscribeCloudRealtime();
      unsubscribeCloudRealtime = null;
    }
    const localPixels = boardStore.loadLocalPixels(currentPreset);
    boardStore.setPixels(localPixels);
    return;
  }

  // ONLINE MODE: Connect to Cloud Firestore & Realtime Delta Stream
  const pixels = await boardService.fetchInitialBoard(currentPreset);
  boardStore.setPixels(pixels);

  const timeline = await historyService.fetchHistoryTimeline(currentPreset);
  historyStore.setTimeline(timeline.earliest, timeline.latest, timeline.latest, timeline.totalEdits);

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

  // 1. Always save to local device storage & perform $O(1)$ canvas flip
  boardStore.saveLocalPixel(pixel);
  boardStore.updatePixel(pixel);

  // 2. Only dispatch network requests when in ONLINE mode
  if (boardStore.getIsOnline()) {
    wsService.sendEdit({ ...payload, boardId });
    await boardService.savePixelToFirestore(pixel);
    analyticsService.trackEvent('apply_edit', { boardId, type: payload.pixelType });
  }
});

window.addEventListener('toggle-online-mode', () => {
  const nextState = !boardStore.getIsOnline();
  boardStore.setIsOnline(nextState);

  if (nextState) {
    showVestaboardToast('Connected to Global Board (Online Sync)');
  } else {
    showVestaboardToast('Switched to Local Offline Mode (Zero Churn)');
  }

  initApp();
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

// Vestaboard Integration Controller
async function performVestaboardSync() {
  const token = getStoredVestaboardToken();
  if (!token) {
    const vestaModal = document.getElementById('vestaboard-modal') as any;
    if (vestaModal) vestaModal.open = true;
    return;
  }

  const matrix = convertBoardToVestaboardMatrix(boardStore.getPixels());
  showVestaboardToast('Sending design to Vestaboard...');

  const result = await sendToVestaboard(matrix, token);
  showVestaboardToast(result.message, !result.success);
}

function showVestaboardToast(message: string, isError = false) {
  let toast = document.getElementById('vestaboard-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vestaboard-toast';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #09090b;
      color: #ffffff;
      padding: 10px 16px;
      font-family: 'Space Mono', monospace;
      font-size: 0.78rem;
      font-weight: 700;
      border: 1px solid #27272a;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 200;
      transition: opacity 0.2s ease;
    `;
    document.body.appendChild(toast);
  }

  toast.style.borderColor = isError ? '#e11d48' : '#16a34a';
  toast.style.color = isError ? '#fecdd3' : '#ffffff';
  toast.textContent = message;
  toast.style.opacity = '1';

  setTimeout(() => {
    if (toast) toast.style.opacity = '0';
  }, 4000);
}

window.addEventListener('trigger-vestaboard-sync', () => {
  performVestaboardSync();
});

window.addEventListener('vestaboard-token-saved', () => {
  performVestaboardSync();
});

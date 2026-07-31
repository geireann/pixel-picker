import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import http from 'http';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { initDatabase, getAllPixels, savePixelEdit, getPixelHistory, getBoardSnapshotAt } from '../server/db';
import { generateFingerprint, checkRateLimit, RateLimiterConfig } from '../server/fingerprint';
import { boardStore } from '../src/store/board-store';
import { CanvasRenderer } from '../src/utils/canvas-renderer';

describe('Pixel Picker Full Integration & E2E Suite', () => {
  let server: http.Server;
  let wss: WebSocketServer;
  const PORT = 8888;
  const WS_URL = `ws://localhost:${PORT}/ws`;

  beforeAll(async () => {
    // Initialize Database
    await initDatabase();

    // Mock HTMLCanvasElement.prototype.getContext for happy-dom environment
    const createMockCtx = () => ({
      fillRect: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      fillStyle: '#000',
      strokeStyle: '#000',
      font: '',
      textAlign: '',
      textBaseline: '',
      imageSmoothingEnabled: false
    });

    if (!HTMLCanvasElement.prototype.getContext) {
      (HTMLCanvasElement.prototype as any).getContext = function() {
        return createMockCtx();
      };
    }

    // Start Test Server
    const app = express();
    app.use(express.json());
    server = http.createServer(app);
    wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', async (ws) => {
      const pixels = await getAllPixels('1080x1080');
      ws.send(JSON.stringify({
        type: 'INIT',
        data: { preset: '1080x1080', pixels, serverTime: Date.now(), activeUsers: wss.clients.size }
      }));

      ws.on('message', async (raw) => {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'EDIT_PIXEL') {
          const { x, y, pixelType, val, textColor, bgColor, boardId = '1080x1080' } = msg.data;
          const timestamp = Date.now();
          const authorHash = 'e2e_test_author';

          const payload = {
            boardId, x, y, type: pixelType, val,
            textColor: textColor || '#FFFFFF',
            bgColor: bgColor || '#000000',
            timestamp, authorHash, ip: '127.0.0.1', userAgent: 'E2ETest'
          };

          await savePixelEdit(payload);

          const broadcastMsg = JSON.stringify({
            type: 'PIXEL_UPDATED',
            data: { boardId, x, y, type: pixelType, val, textColor: payload.textColor, bgColor: payload.bgColor, updatedAt: timestamp, lastAuthor: authorHash }
          });

          wss.clients.forEach(c => {
            if (c.readyState === WebSocket.OPEN) c.send(broadcastMsg);
          });
        }
      });
    });

    await new Promise<void>((resolve) => server.listen(PORT, () => resolve()));
  });

  afterAll(async () => {
    wss.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('1. Database Integration: Saves and queries multi-mode pixel edits & per-pixel history', async () => {
    const edit = {
      boardId: '1080x1080' as const,
      x: 77,
      y: 88,
      type: 'letter' as const,
      val: 'Q',
      textColor: '#FF0055',
      bgColor: '#110022',
      timestamp: Date.now(),
      authorHash: 'tester_hash',
      ip: '127.0.0.1',
      userAgent: 'VitestIntegration'
    };

    await savePixelEdit(edit);

    const history = await getPixelHistory('1080x1080', 77, 88);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].val).toBe('Q');
    expect(history[0].type).toBe('letter');
    expect(history[0].textColor).toBe('#FF0055');

    const allPixels = await getAllPixels('1080x1080');
    const pixel = allPixels.find(p => p.x === 77 && p.y === 88);
    expect(pixel).toBeDefined();
    expect(pixel?.val).toBe('Q');
  });

  it('2. Time-Travel Snapshot Integration: Queries historical state at specific timestamp', async () => {
    const historicalTime = Date.now() - 5000;
    const snapshot = await getBoardSnapshotAt('1080x1080', historicalTime);
    expect(Array.isArray(snapshot)).toBe(true);
  });

  it('3. Fingerprinting & Rate Limiter Integration: Generates hash & handles config', () => {
    const hash = generateFingerprint('192.168.1.1', 'Mozilla/5.0');
    expect(hash).toHaveLength(16);

    RateLimiterConfig.enabled = false;
    const check1 = checkRateLimit(hash);
    expect(check1.allowed).toBe(true);
  });

  it('4. Realtime WebSockets Integration: Connects, receives INIT, and broadcasts pixel edits', async () => {
    const client = new WebSocket(WS_URL);

    const initReceived = new Promise<any>((resolve) => {
      client.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'INIT') resolve(msg.data);
      });
    });

    const initData = await initReceived;
    expect(initData.pixels).toBeDefined();

    const editReceived = new Promise<any>((resolve) => {
      client.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'PIXEL_UPDATED' && msg.data.x === 105) resolve(msg.data);
      });
    });

    client.send(JSON.stringify({
      type: 'EDIT_PIXEL',
      data: {
        boardId: '1080x1080',
        x: 105,
        y: 105,
        pixelType: 'letter',
        val: 'W',
        textColor: '#00FFFF',
        bgColor: '#001122'
      }
    }));

    const updateData = await editReceived;
    expect(updateData.x).toBe(105);
    expect(updateData.y).toBe(105);
    expect(updateData.type).toBe('letter');
    expect(updateData.val).toBe('W');

    client.close();
  });

  it('5. Frontend Canvas Renderer & Store Integration: Updates store and executes canvas render loop', () => {
    boardStore.setPixels([
      { x: 10, y: 10, type: 'letter', val: 'K', textColor: '#FFFFFF', bgColor: '#000000', updatedAt: Date.now(), lastAuthor: 'test' },
      { x: 11, y: 10, type: 'number', val: '3', textColor: '#FF0000', bgColor: '#111111', updatedAt: Date.now(), lastAuthor: 'test' }
    ]);

    expect(boardStore.getPixels()).toHaveLength(2);

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const renderer = new CanvasRenderer(canvas);
    renderer.setAllPixels(boardStore.getPixels());

    expect(() => {
      renderer.render(
        { zoom: 10, panX: 100, panY: 100, showGrid: true, boardWidth: 256, boardHeight: 256 },
        { x: 10, y: 10 },
        { x: 11, y: 10 }
      );
    }).not.toThrow();
  });
});

import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, getAllPixels, savePixelEdit, getPixelHistory, getBoardSnapshotAt, getHistoryTimeRange, BOARD_BOUNDS } from './db.js';
import { generateFingerprint, checkRateLimit, RateLimiterConfig } from './fingerprint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

let connectedClientsCount = 0;

// REST API Endpoints
app.get('/api/board', async (req, res) => {
  try {
    const preset = req.query.preset || '1080x1080';
    const pixels = await getAllPixels(preset);
    res.json({ success: true, preset, pixels, count: pixels.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/pixel/history', async (req, res) => {
  try {
    const preset = req.query.preset || '1080x1080';
    const x = parseInt(req.query.x, 10);
    const y = parseInt(req.query.y, 10);
    if (isNaN(x) || isNaN(y)) {
      return res.status(400).json({ success: false, error: 'Valid x and y parameters required' });
    }
    const history = await getPixelHistory(preset, x, y);
    res.json({ success: true, preset, x, y, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/board/snapshot', async (req, res) => {
  try {
    const preset = req.query.preset || '1080x1080';
    const timestamp = parseInt(req.query.timestamp, 10);
    if (isNaN(timestamp)) {
      return res.status(400).json({ success: false, error: 'Valid timestamp parameter required' });
    }
    const pixels = await getBoardSnapshotAt(preset, timestamp);
    res.json({ success: true, preset, timestamp, pixels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/history/timeline', async (req, res) => {
  try {
    const preset = req.query.preset || '1080x1080';
    const range = await getHistoryTimeRange(preset);
    res.json({ success: true, preset, ...range });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Configure Rate Limits (Admin/Dev endpoint)
app.post('/api/config/ratelimit', (req, res) => {
  const { enabled, maxEditsPerMinute } = req.body;
  if (typeof enabled === 'boolean') RateLimiterConfig.enabled = enabled;
  if (typeof maxEditsPerMinute === 'number') RateLimiterConfig.maxEditsPerMinute = maxEditsPerMinute;
  res.json({ success: true, config: RateLimiterConfig });
});

// SPA Route Fallback for /6x22, /256x256, /1080x1080, and /
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// WebSocket Realtime Manager
wss.on('connection', async (ws, req) => {
  connectedClientsCount++;
  let currentPreset = '1080x1080';

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || '';
  const authorHash = generateFingerprint(clientIp, userAgent);

  broadcastActiveUserCount();

  // Send initial board state for 1080x1080 default
  try {
    const pixels = await getAllPixels(currentPreset);
    ws.send(JSON.stringify({
      type: 'INIT',
      data: {
        preset: currentPreset,
        pixels,
        serverTime: Date.now(),
        authorHash,
        activeUsers: connectedClientsCount
      }
    }));
  } catch (err) {
    console.error('Failed to send INIT board state:', err);
  }

  ws.on('message', async (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());

      if (message.type === 'JOIN_PRESET') {
        const preset = message.data?.preset || '1080x1080';
        currentPreset = preset;
        const pixels = await getAllPixels(preset);
        ws.send(JSON.stringify({
          type: 'INIT',
          data: {
            preset,
            pixels,
            serverTime: Date.now(),
            authorHash,
            activeUsers: connectedClientsCount
          }
        }));
      } else if (message.type === 'EDIT_PIXEL') {
        const { x, y, pixelType, val, textColor, bgColor, boardId } = message.data;
        const targetBoard = boardId || currentPreset;

        const bounds = BOARD_BOUNDS[targetBoard] || BOARD_BOUNDS['1080x1080'];

        // Validate Coordinates & Types
        if (x < 0 || x >= bounds.width || y < 0 || y >= bounds.height) return;
        if (!['color', 'letter', 'number'].includes(pixelType)) return;

        // Rate Limiter Check
        const limitResult = checkRateLimit(authorHash);
        if (!limitResult.allowed) {
          ws.send(JSON.stringify({
            type: 'RATE_LIMITED',
            data: { retryAfterMs: limitResult.retryAfterMs }
          }));
          return;
        }

        const timestamp = Date.now();
        const editPayload = {
          boardId: targetBoard,
          x,
          y,
          type: pixelType,
          val: String(val).substring(0, 16),
          textColor: textColor || '#FFFFFF',
          bgColor: bgColor || '#000000',
          timestamp,
          authorHash,
          ip: clientIp,
          userAgent
        };

        // Save to Database
        await savePixelEdit(editPayload);

        // Broadcast edit transaction to all clients on matching board
        const broadcastMsg = JSON.stringify({
          type: 'PIXEL_UPDATED',
          data: {
            boardId: targetBoard,
            x,
            y,
            type: pixelType,
            val: editPayload.val,
            textColor: editPayload.textColor,
            bgColor: editPayload.bgColor,
            updatedAt: timestamp,
            lastAuthor: authorHash
          }
        });

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastMsg);
          }
        });
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    connectedClientsCount = Math.max(0, connectedClientsCount - 1);
    broadcastActiveUserCount();
  });
});

function broadcastActiveUserCount() {
  const msg = JSON.stringify({
    type: 'USER_COUNT_UPDATED',
    data: { activeUsers: connectedClientsCount }
  });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

const PORT = process.env.PORT || 8080;

initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Pixel Picker Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize SQLite Database:', err);
});

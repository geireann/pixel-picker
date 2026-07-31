import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, '../data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'pixelpicker.db');
const db = new sqlite3.Database(dbPath);

export const BOARD_BOUNDS = {
  '1080x1080': { width: 1080, height: 1080 },
  '256x256': { width: 256, height: 256 },
  '6x22': { width: 22, height: 6 }
};

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getAllSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function getOneSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export async function initDatabase() {
  const pixelsInfo = await getAllSql("PRAGMA table_info(pixels)");
  if (pixelsInfo && pixelsInfo.length > 0 && !pixelsInfo.some(r => r.name === 'board_id')) {
    await runSql("DROP TABLE IF EXISTS pixels");
  }

  // Create tables if missing
  await runSql(`
    CREATE TABLE IF NOT EXISTS pixels (
      board_id TEXT NOT NULL DEFAULT '1080x1080',
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      type TEXT NOT NULL,
      val TEXT NOT NULL,
      text_color TEXT DEFAULT '#FFFFFF',
      bg_color TEXT DEFAULT '#000000',
      updated_at INTEGER NOT NULL,
      last_author TEXT NOT NULL,
      PRIMARY KEY (board_id, x, y)
    )
  `);

  const historyInfo = await getAllSql("PRAGMA table_info(history)");
  if (historyInfo && historyInfo.length > 0 && !historyInfo.some(r => r.name === 'board_id')) {
    await runSql("ALTER TABLE history ADD COLUMN board_id TEXT NOT NULL DEFAULT '1080x1080'");
  } else if (!historyInfo || historyInfo.length === 0) {
    await runSql(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        board_id TEXT NOT NULL DEFAULT '1080x1080',
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        type TEXT NOT NULL,
        val TEXT NOT NULL,
        text_color TEXT DEFAULT '#FFFFFF',
        bg_color TEXT DEFAULT '#000000',
        timestamp INTEGER NOT NULL,
        author_hash TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT
      )
    `);
  }

  await runSql(`CREATE INDEX IF NOT EXISTS idx_history_board_xy ON history (board_id, x, y)`);
  await runSql(`CREATE INDEX IF NOT EXISTS idx_history_board_ts ON history (board_id, timestamp)`);

  await seedInitialDataIfEmpty();
}

async function seedInitialDataIfEmpty() {
  const row = await getOneSql('SELECT COUNT(*) as count FROM pixels');
  if (row && row.count > 0) return;

  console.log('Seeding initial board states (1080x1080, 256x256, 6x22)...');
  const now = Date.now();

  // Seed 6x22 (Micro Board "PIXEL PICKER")
  const text6x22 = "PIXEL PICKER";
  const startX = Math.floor((22 - text6x22.length) / 2);
  for (let i = 0; i < text6x22.length; i++) {
    await savePixelEdit({
      boardId: '6x22',
      x: startX + i,
      y: 2,
      type: 'letter',
      val: text6x22[i],
      textColor: '#09090b',
      bgColor: '#ffffff',
      timestamp: now,
      authorHash: 'seed_6x22'
    });
  }

  // Seed 256x256
  await savePixelEdit({
    boardId: '256x256',
    x: 128,
    y: 128,
    type: 'letter',
    val: 'P',
    textColor: '#09090b',
    bgColor: '#ffffff',
    timestamp: now,
    authorHash: 'seed_256'
  });

  // Seed 1080x1080
  await savePixelEdit({
    boardId: '1080x1080',
    x: 540,
    y: 540,
    type: 'letter',
    val: 'P',
    textColor: '#09090b',
    bgColor: '#ffffff',
    timestamp: now,
    authorHash: 'seed_1080'
  });
}

export function getAllPixels(boardId = '1080x1080') {
  return getAllSql(`
    SELECT x, y, type, val, text_color as textColor, bg_color as bgColor, updated_at as updatedAt, last_author as lastAuthor, board_id as boardId
    FROM pixels
    WHERE board_id = ?
  `, [boardId]);
}

export async function savePixelEdit(edit) {
  const { boardId = '1080x1080', x, y, type, val, textColor = '#FFFFFF', bgColor = '#000000', timestamp = Date.now(), authorHash = 'anon', ip = '', userAgent = '' } = edit;
  
  const bounds = BOARD_BOUNDS[boardId] || BOARD_BOUNDS['1080x1080'];
  if (x < 0 || x >= bounds.width || y < 0 || y >= bounds.height) {
    throw new Error(`Coordinates out of bounds for ${boardId}`);
  }

  await runSql(`
    INSERT INTO pixels (board_id, x, y, type, val, text_color, bg_color, updated_at, last_author)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(board_id, x, y) DO UPDATE SET
      type = excluded.type,
      val = excluded.val,
      text_color = excluded.text_color,
      bg_color = excluded.bg_color,
      updated_at = excluded.updated_at,
      last_author = excluded.last_author
  `, [boardId, x, y, type, val, textColor, bgColor, timestamp, authorHash]);

  const historyResult = await runSql(`
    INSERT INTO history (board_id, x, y, type, val, text_color, bg_color, timestamp, author_hash, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [boardId, x, y, type, val, textColor, bgColor, timestamp, authorHash, ip, userAgent]);

  return { id: historyResult.lastID, boardId, ...edit };
}

export function getPixelHistory(boardId = '1080x1080', x, y, limit = 50) {
  return getAllSql(`
    SELECT id, board_id as boardId, x, y, type, val, text_color as textColor, bg_color as bgColor, timestamp, author_hash as authorHash
    FROM history
    WHERE board_id = ? AND x = ? AND y = ?
    ORDER BY timestamp DESC
    LIMIT ?
  `, [boardId, x, y, limit]);
}

export function getBoardSnapshotAt(boardId = '1080x1080', timestamp) {
  return getAllSql(`
    SELECT h.x, h.y, h.type, h.val, h.text_color as textColor, h.bg_color as bgColor, h.timestamp as updatedAt, h.author_hash as lastAuthor, h.board_id as boardId
    FROM history h
    INNER JOIN (
      SELECT x, y, MAX(timestamp) as max_ts
      FROM history
      WHERE board_id = ? AND timestamp <= ?
      GROUP BY x, y
    ) latest ON h.x = latest.x AND h.y = latest.y AND h.timestamp = latest.max_ts
    WHERE h.board_id = ?
  `, [boardId, timestamp, boardId]);
}

export function getHistoryTimeRange(boardId = '1080x1080') {
  return getOneSql(`
    SELECT MIN(timestamp) as earliest, MAX(timestamp) as latest, COUNT(*) as totalEdits
    FROM history
    WHERE board_id = ?
  `, [boardId]);
}

# Technical Specification - Pixel Picker

## 1. System Architecture
Pixel Picker combines a lightweight Node.js + Express WebSocket server with SQLite for real-time data streaming and persistent history, and a modern TypeScript + Lit frontend client built with Vite and pnpm.

```
+-------------------------------------------------------+
|                 Browser Frontend                      |
| (Lit Web Components + 2D HTML5 Canvas + WebSockets)   |
+--------------------------+----------------------------+
                           |
            WebSocket JSON Stream / HTTP API
                           |
+--------------------------v----------------------------+
|                Node.js Express Server                 |
| - ws WebSocket Manager                                |
| - IP + User-Agent Fingerprinter                       |
| - Configurable Rate Limiter                           |
+--------------------------+----------------------------+
                           |
                   SQLite Database
        (pixels table & history transaction log)
```

---

## 2. Database Schema (SQLite)

### Table: `pixels`
Stores current state of the 256x256 board.
```sql
CREATE TABLE IF NOT EXISTS pixels (
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  type TEXT NOT NULL,         -- 'color' | 'letter' | 'number'
  val TEXT NOT NULL,          -- Color hex/rgba or char ('A', '7')
  text_color TEXT DEFAULT '#FFFFFF',
  bg_color TEXT DEFAULT '#000000',
  updated_at INTEGER NOT NULL,
  last_author TEXT NOT NULL,
  PRIMARY KEY (x, y)
);
```

### Table: `history`
Append-only log of every single edit.
```sql
CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
);
CREATE INDEX IF NOT EXISTS idx_history_xy ON history (x, y);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history (timestamp);
```

---

## 3. WebSocket Protocol & Payload Structures

### Connection Sync (`INIT`)
Server sends full 256x256 board snapshot to newly connected client.
```json
{
  "type": "INIT",
  "data": {
    "pixels": [
      { "x": 10, "y": 20, "type": "color", "val": "#FF5733", "updated_at": 1750000000 }
    ],
    "serverTime": 1750000010,
    "activeUsers": 42
  }
}
```

### Edit Broadcast (`EDIT_PIXEL`)
Client sends edit; Server broadcasts to all clients.
```json
{
  "type": "EDIT_PIXEL",
  "data": {
    "x": 128,
    "y": 128,
    "pixelType": "letter",
    "val": "P",
    "textColor": "#FFFFFF",
    "bgColor": "#6200EE",
    "timestamp": 1750000050,
    "authorHash": "a1b2c3d4"
  }
}
```

---

## 4. Lit Component Architecture & 4-File Patterns

Each UI element follows the strict 4-file folder pattern:
1. `intro-modal/`: `<app-intro-modal>`, `renderIntroModalPresentation`, `introModalStyles`, `intro-modal-presentation.test.ts`
2. `canvas-board/`: `<app-canvas-board>`, `renderCanvasBoardPresentation`, `canvasBoardStyles`, `canvas-board-presentation.test.ts`
3. `editor-panel/`: `<app-editor-panel>`, `renderEditorPanelPresentation`, `editorPanelStyles`, `editor-panel-presentation.test.ts`
4. `history-panel/`: `<app-history-panel>`, `renderHistoryPanelPresentation`, `historyPanelStyles`, `history-panel-presentation.test.ts`
5. `time-scrubber/`: `<app-time-scrubber>`, `renderTimeScrubberPresentation`, `timeScrubberStyles`, `time-scrubber-presentation.test.ts`

---

## 5. Deployment Architecture: Firebase Hosting Target
Target domain: `pixelpicker.web.app`

`firebase.json` configuration routes static web client bundles directly to Firebase Hosting while proxying `/api` and `/ws` to backend services.

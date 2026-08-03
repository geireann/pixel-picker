# Model Context Protocol (MCP) Integration Guide for Pixel Picker

This guide explains how to interface AI assistants (Google Antigravity, Claude, Gemini, Cursor) directly with **Pixel Picker** using the official Model Context Protocol (MCP) server.

---

## 🎯 Overview

The Pixel Picker MCP Server allows AI agents to:
1. **READ** live pixel states, character values, colors, and layout dimensions across all board presets (`1080x1080`, `256x256`, `22x6`).
2. **WRITE** pixels, render text strings, paint pixel art, and clear boards programmatically.
3. **SYNC** designs directly to physical/cloud Vestaboard split-flap displays (`22x6`).
4. **OPERATE OFFLINE** with 100% local file storage (zero server churn, zero network calls).

---

## ⚙️ Configuration Setup

### Step 1: Locate the MCP Executable
The MCP server entrypoint is:
`/Users/geireann/Documents/projects/pixel-picker/mcp-server/index.js`

### Step 2: Register in AI Tool Config

#### A. Offline Local Mode (Recommended for Local Dev)
In Offline Mode, all reads and writes interact with a local JSON file (`mcp-server/local-pixels.json`). No network requests are sent.

```json
{
  "mcpServers": {
    "pixel-picker": {
      "command": "node",
      "args": ["/Users/geireann/Documents/projects/pixel-picker/mcp-server/index.js"],
      "env": {
        "PIXEL_PICKER_MODE": "offline"
      }
    }
  }
}
```

#### B. Online Global Mode
In Online Mode, edits are written directly to the production Cloud Firestore database at [https://pixel-picker-app.web.app](https://pixel-picker-app.web.app).

```json
{
  "mcpServers": {
    "pixel-picker": {
      "command": "node",
      "args": ["/Users/geireann/Documents/projects/pixel-picker/mcp-server/index.js"],
      "env": {
        "PIXEL_PICKER_MODE": "online",
        "VESTABOARD_TOKEN": "<YOUR_READ_WRITE_TOKEN>"
      }
    }
  }
}
```

---

## 🛠️ MCP Tool Reference & Schemas

### `set_pixels_batch` (Bulk Painting)
Paints multiple pixels in a single tool call.

#### Example Payload:
```json
{
  "preset": "22x6",
  "pixels": [
    { "x": 0, "y": 0, "type": "letter", "val": "H", "textColor": "#FFFFFF", "bgColor": "#09090B" },
    { "x": 1, "y": 0, "type": "letter", "val": "I", "textColor": "#FFFFFF", "bgColor": "#09090B" },
    { "x": 2, "y": 0, "type": "color", "val": "#E11D48" }
  ]
}
```

### `get_board` (Board Inspection)
Fetch full board state or an ASCII art preview.

#### Example Payload:
```json
{
  "preset": "22x6",
  "format": "ascii_preview"
}
```

---

## 🧪 Testing the MCP Server

Run unit tests via pnpm:
```bash
pnpm test
```

Or run the MCP server directly in terminal:
```bash
pnpm mcp
```

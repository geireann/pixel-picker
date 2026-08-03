# 🎨 Pixel Picker MCP Server (Model Context Protocol)

The Pixel Picker MCP Server provides a standard **Model Context Protocol (MCP)** interface for AI assistants (Google Antigravity, Claude, Gemini, Cursor) to **Read**, **Write**, and **Control** Pixel Picker boards programmatically.

It operates seamlessly in both **Offline Local Mode** (zero network activity, local on-device file storage) and **Online Global Mode** (syncing directly with live Cloud Firestore & Vestaboard hardware).

---

## 🚀 Quick Start & Offline Configuration

### 1. Running in Offline Local Mode (Recommended for Local Dev)
Set `PIXEL_PICKER_MODE=offline` in your environment variables. All MCP read/write operations will be saved locally to `mcp-server/local-pixels.json` (or a custom file via `PIXEL_PICKER_LOCAL_FILE`).

#### Example `mcp_config.json` (Google Antigravity / AGY / Claude / Cursor)
```json
{
  "mcpServers": {
    "pixel-picker": {
      "command": "node",
      "args": ["/Users/geireann/Documents/projects/pixel-picker/mcp-server/index.js"],
      "env": {
        "PIXEL_PICKER_MODE": "offline",
        "PIXEL_PICKER_LOCAL_FILE": "/Users/geireann/Documents/projects/pixel-picker/mcp-server/local-pixels.json"
      }
    }
  }
}
```

### 2. Running in Online Global Mode
Omit `PIXEL_PICKER_MODE` or set it to `online`. Reads and writes will interact directly with the live global Cloud Firestore database (`https://pixel-picker-app.web.app`).

```json
{
  "mcpServers": {
    "pixel-picker": {
      "command": "node",
      "args": ["/Users/geireann/Documents/projects/pixel-picker/mcp-server/index.js"],
      "env": {
        "PIXEL_PICKER_MODE": "online",
        "VESTABOARD_TOKEN": "<YOUR_VESTABOARD_TOKEN_OPTIONAL>"
      }
    }
  }
}
```

---

## 🛠️ Complete MCP Tools Reference

| Tool Name | Mode | Arguments | Description |
|---|---|---|---|
| `get_board` | **READ** | `preset` (`1080x1080`, `256x256`, `22x6`), `format` (`json`, `ascii_preview`) | Returns active board pixel array or ASCII art matrix preview. |
| `get_pixel` | **READ** | `x`, `y`, `preset` | Returns single pixel object at coordinate `(x, y)`. |
| `set_pixel` | **WRITE** | `x`, `y`, `type` (`color`/`letter`/`number`), `val`, `textColor`, `bgColor`, `preset` | Paints a single cell on the active board. |
| `set_pixels_batch` | **WRITE** | `preset`, `pixels: [{x, y, type, val, textColor, bgColor}]` | Bulk paints multiple pixels in a single tool call (ideal for rendering text banners, pixel art, or shapes). |
| `clear_board` | **WRITE** | `preset` | Resets all active pixels on a board to blank white. |
| `send_to_vestaboard` | **ACTION** | `token` (optional) | Converts current 22x6 board matrix to Vestaboard character & flap codes and dispatches to hardware. |

---

## 📦 MCP Resources Exposed

| Resource URI | Description |
|---|---|
| `pixelpicker://board/1080x1080` | Live JSON view of 1080x1080 Mega Board |
| `pixelpicker://board/256x256` | Live JSON view of 256x256 Canvas Board |
| `pixelpicker://board/22x6` | Live JSON view of 22x6 Micro Board |
| `pixelpicker://analytics/summary` | Telemetry & active edit count summary |

---

## 💡 AI Prompting Examples

* **Read Board**: *"Can you show me the current ASCII preview of the 22x6 board using `get_board`?"*
* **Paint Pixel Art**: *"Use `set_pixels_batch` to paint a red heart at position (5,2) on the 22x6 board."*
* **Render Text Banner**: *"Write 'HELLO WORLD' in white text on dark blue tiles on the top row of the 22x6 board."*
* **Sync Vestaboard**: *"Send the current 22x6 board design to my Vestaboard using `send_to_vestaboard`."*

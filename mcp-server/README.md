# Pixel Picker MCP Server (Model Context Protocol)

The Pixel Picker MCP Server allows AI assistants (Google Antigravity, Claude, Gemini, Cursor) to **Read**, **Write**, and **Control** Pixel Picker boards programmatically.

---

## 🛠️ Tools Exposed

| Tool Name | Operation | Input Arguments | Description |
|---|---|---|---|
| `get_board` | **READ** | `preset` (`1080x1080`, `256x256`, `22x6`), `format` (`json`, `ascii_preview`) | Fetch active pixels and layout metadata. |
| `get_pixel` | **READ** | `x`, `y`, `preset` | Inspect pixel state at specific coordinate. |
| `set_pixel` | **WRITE** | `x`, `y`, `type`, `val`, `textColor`, `bgColor`, `preset` | Paint single pixel with character or color. |
| `set_pixels_batch` | **WRITE** | `preset`, `pixels: [{x, y, type, val, textColor, bgColor}]` | Bulk paint pixel art, text banners, or designs. |
| `clear_board` | **WRITE** | `preset` | Reset all active pixels on a board to blank white. |
| `send_to_vestaboard` | **ACTION** | `token` (optional if env `VESTABOARD_TOKEN` set) | Convert 22x6 board state to Vestaboard matrix and post to cloud. |

---

## 📦 Resources Exposed

| Resource URI | Description |
|---|---|
| `pixelpicker://board/1080x1080` | Live JSON snapshot of 1080x1080 Mega board |
| `pixelpicker://board/256x256` | Live JSON snapshot of 256x256 Canvas board |
| `pixelpicker://board/22x6` | Live JSON snapshot of 22x6 Micro board |
| `pixelpicker://analytics/summary` | Live telemetry & pageview analytics summary |

---

## 🚀 How to Register in AI Tools

### 1. Google Antigravity / AGY MCP Config (`mcp_config.json`)
```json
{
  "mcpServers": {
    "pixel-picker": {
      "command": "node",
      "args": ["/Users/geireann/Documents/projects/pixel-picker/mcp-server/index.js"],
      "env": {
        "VESTABOARD_TOKEN": "<YOUR_VESTABOARD_TOKEN_OPTIONAL>"
      }
    }
  }
}
```

### 2. Claude Desktop Config (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "pixel-picker": {
      "command": "node",
      "args": ["/Users/geireann/Documents/projects/pixel-picker/mcp-server/index.js"]
    }
  }
}
```

---

## 💻 Manual CLI Execution
```bash
# Launch MCP Server over STDIO
pnpm mcp
```

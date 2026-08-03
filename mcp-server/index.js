#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

const FIRESTORE_BASE_URL = 'https://firestore.googleapis.com/v1/projects/geireann/databases/(default)/documents';

const BOARD_PRESETS = {
  '1080x1080': { width: 1080, height: 1080, label: '1080 x 1080 Mega' },
  '256x256': { width: 256, height: 256, label: '256 x 256 Canvas' },
  '22x6': { width: 22, height: 6, label: '22 x 6 Micro' }
};

const VESTABOARD_CHARACTER_CODES = {
  ' ': 0,
  '1': 27, '2': 28, '3': 29, '4': 30, '5': 31,
  '6': 32, '7': 33, '8': 34, '9': 35, '0': 36,
  '!': 37, '@': 38, '#': 39, '$': 40, '(': 41,
  ')': 42, '-': 44, '+': 46, '&': 47, '=': 48,
  ';': 49, ':': 50, "'": 52, '"': 53, '%': 54,
  ',': 55, '.': 56, '/': 59, '?': 60, '°': 62
};
for (let i = 0; i < 26; i++) {
  VESTABOARD_CHARACTER_CODES[String.fromCharCode(65 + i)] = i + 1;
}

const VESTABOARD_COLOR_FLAPS = [
  { code: 63, rgb: [225, 29, 72] },   // Red
  { code: 64, rgb: [234, 88, 12] },   // Orange
  { code: 65, rgb: [202, 138, 4] },   // Yellow
  { code: 66, rgb: [22, 163, 74] },   // Green
  { code: 67, rgb: [37, 99, 235] },   // Blue
  { code: 68, rgb: [124, 58, 237] },  // Violet
  { code: 69, rgb: [255, 255, 255] }, // White
  { code: 70, rgb: [9, 9, 11] }       // Black
];

function hexToRgb(hex = '') {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [255, 255, 255];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function closestVestaboardColor(hex) {
  const [r1, g1, b1] = hexToRgb(hex);
  let bestCode = 70;
  let minDistance = Infinity;

  VESTABOARD_COLOR_FLAPS.forEach(flap => {
    const [r2, g2, b2] = flap.rgb;
    const dist = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    if (dist < minDistance) {
      minDistance = dist;
      bestCode = flap.code;
    }
  });
  return bestCode;
}

async function fetchFirestorePixels(preset = '1080x1080') {
  try {
    const url = `${FIRESTORE_BASE_URL}/pixels`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];

    return data.documents
      .map(doc => {
        const f = doc.fields || {};
        return {
          boardId: f.boardId?.stringValue || '1080x1080',
          x: parseInt(f.x?.integerValue || f.x?.stringValue || '0', 10),
          y: parseInt(f.y?.integerValue || f.y?.stringValue || '0', 10),
          type: f.type?.stringValue || 'letter',
          val: f.val?.stringValue || '',
          textColor: f.textColor?.stringValue || '#FFFFFF',
          bgColor: f.bgColor?.stringValue || '#000000',
          updatedAt: parseInt(f.updatedAt?.integerValue || '0', 10),
          lastAuthor: f.lastAuthor?.stringValue || 'mcp-agent'
        };
      })
      .filter(p => (p.boardId || '1080x1080') === preset);
  } catch (err) {
    return [];
  }
}

async function saveFirestorePixel(pixel) {
  const docId = `${pixel.boardId || '1080x1080'}_${pixel.x}_${pixel.y}`;
  const url = `${FIRESTORE_BASE_URL}/pixels/${docId}`;

  const payload = {
    fields: {
      boardId: { stringValue: pixel.boardId || '1080x1080' },
      x: { integerValue: pixel.x },
      y: { integerValue: pixel.y },
      type: { stringValue: pixel.type },
      val: { stringValue: pixel.val },
      textColor: { stringValue: pixel.textColor || '#FFFFFF' },
      bgColor: { stringValue: pixel.bgColor || '#000000' },
      updatedAt: { integerValue: pixel.updatedAt || Date.now() },
      lastAuthor: { stringValue: pixel.lastAuthor || 'mcp-agent' }
    }
  };

  try {
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // Silent catch
  }
}

// Server Initialization
const server = new Server(
  {
    name: 'pixel-picker-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// MCP Tool Registrations
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_board',
        description: 'Read all active pixels and board metadata for a Pixel Picker board preset (1080x1080, 256x256, or 22x6).',
        inputSchema: {
          type: 'object',
          properties: {
            preset: {
              type: 'string',
              enum: ['1080x1080', '256x256', '22x6'],
              description: 'Board preset dimension (default 1080x1080)'
            },
            format: {
              type: 'string',
              enum: ['json', 'ascii_preview'],
              description: 'Output format (json array or ascii character matrix preview)'
            }
          }
        }
      },
      {
        name: 'get_pixel',
        description: 'Read single pixel state at (x, y) coordinate on a Pixel Picker board preset.',
        inputSchema: {
          type: 'object',
          properties: {
            x: { type: 'number', description: 'X coordinate' },
            y: { type: 'number', description: 'Y coordinate' },
            preset: {
              type: 'string',
              enum: ['1080x1080', '256x256', '22x6'],
              description: 'Board preset dimension'
            }
          },
          required: ['x', 'y']
        }
      },
      {
        name: 'set_pixel',
        description: 'Paint or write a single pixel at (x, y) on a Pixel Picker board.',
        inputSchema: {
          type: 'object',
          properties: {
            x: { type: 'number', description: 'X coordinate' },
            y: { type: 'number', description: 'Y coordinate' },
            type: {
              type: 'string',
              enum: ['color', 'letter', 'number'],
              description: 'Pixel mode type'
            },
            val: { type: 'string', description: 'Character value or hex color string (e.g. "A", "7", "#e11d48")' },
            textColor: { type: 'string', description: 'Text color hex (optional, e.g. "#ffffff")' },
            bgColor: { type: 'string', description: 'Background color hex (optional, e.g. "#09090b")' },
            preset: {
              type: 'string',
              enum: ['1080x1080', '256x256', '22x6'],
              description: 'Board preset dimension'
            }
          },
          required: ['x', 'y', 'type', 'val']
        }
      },
      {
        name: 'set_pixels_batch',
        description: 'Perform bulk painting of multiple pixels in a single tool invocation (ideal for pixel art, text strings, and shapes).',
        inputSchema: {
          type: 'object',
          properties: {
            preset: {
              type: 'string',
              enum: ['1080x1080', '256x256', '22x6'],
              description: 'Target board preset'
            },
            pixels: {
              type: 'array',
              description: 'Array of pixel objects to paint',
              items: {
                type: 'object',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                  type: { type: 'string', enum: ['color', 'letter', 'number'] },
                  val: { type: 'string' },
                  textColor: { type: 'string' },
                  bgColor: { type: 'string' }
                },
                required: ['x', 'y', 'type', 'val']
              }
            }
          },
          required: ['pixels']
        }
      },
      {
        name: 'clear_board',
        description: 'Reset all active pixels on a board preset to blank white.',
        inputSchema: {
          type: 'object',
          properties: {
            preset: {
              type: 'string',
              enum: ['1080x1080', '256x256', '22x6'],
              description: 'Board preset to clear'
            }
          },
          required: ['preset']
        }
      },
      {
        name: 'send_to_vestaboard',
        description: 'Convert current 22x6 board state to Vestaboard codes and post directly to cloud.vestaboard.com.',
        inputSchema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Vestaboard Read/Write API token (optional if VESTABOARD_TOKEN environment variable is set)'
            }
          }
        }
      }
    ]
  };
});

// MCP Tool Execution Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const preset = args.preset || '1080x1080';

  if (name === 'get_board') {
    const pixels = await fetchFirestorePixels(preset);
    const config = BOARD_PRESETS[preset] || BOARD_PRESETS['1080x1080'];

    if (args.format === 'ascii_preview') {
      const matrix = Array.from({ length: config.height }, () => Array(config.width).fill('.'));
      pixels.forEach(p => {
        if (p.x >= 0 && p.x < config.width && p.y >= 0 && p.y < config.height) {
          matrix[p.y][p.x] = p.val ? p.val.charAt(0) : '#';
        }
      });
      const preview = matrix.slice(0, Math.min(22, config.height)).map(row => row.slice(0, Math.min(60, config.width)).join('')).join('\n');
      return {
        content: [
          {
            type: 'text',
            text: `Board Preset: ${preset} (${config.width}x${config.height})\nTotal Active Pixels: ${pixels.length}\n\nPreview (Top-Left):\n${preview}`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ preset, config, activePixelsCount: pixels.length, pixels }, null, 2)
        }
      ]
    };
  }

  if (name === 'get_pixel') {
    const pixels = await fetchFirestorePixels(preset);
    const target = pixels.find(p => p.x === args.x && p.y === args.y);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(target || { x: args.x, y: args.y, type: 'color', val: '#ffffff', isDefault: true }, null, 2)
        }
      ]
    };
  }

  if (name === 'set_pixel') {
    const pixel = {
      x: args.x,
      y: args.y,
      type: args.type,
      val: args.val,
      textColor: args.textColor || '#ffffff',
      bgColor: args.bgColor || '#09090b',
      updatedAt: Date.now(),
      lastAuthor: 'mcp-agent',
      boardId: preset
    };

    await saveFirestorePixel(pixel);
    return {
      content: [
        {
          type: 'text',
          text: `Successfully painted pixel at (${args.x}, ${args.y}) on preset ${preset}`
        }
      ]
    };
  }

  if (name === 'set_pixels_batch') {
    const items = args.pixels || [];
    const now = Date.now();

    for (const p of items) {
      await saveFirestorePixel({
        x: p.x,
        y: p.y,
        type: p.type || 'color',
        val: p.val,
        textColor: p.textColor || '#ffffff',
        bgColor: p.bgColor || '#09090b',
        updatedAt: now,
        lastAuthor: 'mcp-agent',
        boardId: preset
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: `Successfully batch painted ${items.length} pixels on preset ${preset}`
        }
      ]
    };
  }

  if (name === 'clear_board') {
    const existing = await fetchFirestorePixels(preset);
    const now = Date.now();

    for (const p of existing) {
      await saveFirestorePixel({
        x: p.x,
        y: p.y,
        type: 'color',
        val: '#ffffff',
        textColor: '#09090b',
        bgColor: '#ffffff',
        updatedAt: now,
        lastAuthor: 'mcp-agent',
        boardId: preset
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: `Cleared ${existing.length} active pixels on preset ${preset} to blank white.`
        }
      ]
    };
  }

  if (name === 'send_to_vestaboard') {
    const token = args.token || process.env.VESTABOARD_TOKEN;
    if (!token) {
      throw new Error('Missing Vestaboard token. Pass token argument or set VESTABOARD_TOKEN environment variable.');
    }

    const pixels = await fetchFirestorePixels('22x6');
    const matrix = Array.from({ length: 6 }, () => Array(22).fill(0));
    const pMap = new Map();
    pixels.forEach(p => pMap.set(`${p.x},${p.y}`, p));

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 22; c++) {
        const p = pMap.get(`${c},${r}`);
        if (p) {
          if (p.type === 'letter' || p.type === 'number') {
            const char = (p.val || ' ').toUpperCase();
            matrix[r][c] = VESTABOARD_CHARACTER_CODES[char] !== undefined ? VESTABOARD_CHARACTER_CODES[char] : 0;
          } else {
            matrix[r][c] = closestVestaboardColor(p.val || p.bgColor || '#ffffff');
          }
        }
      }
    }

    const res = await fetch('https://cloud.vestaboard.com/', {
      method: 'POST',
      headers: {
        'X-Vestaboard-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ characters: matrix })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Vestaboard API error (${res.status}): ${errText}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: 'Successfully converted 22x6 board matrix and sent design to Vestaboard!'
        }
      ]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// MCP Resource Registrations
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'pixelpicker://board/1080x1080',
        name: 'Pixel Picker 1080x1080 Mega Board',
        mimeType: 'application/json',
        description: 'Live active pixels on 1080x1080 board'
      },
      {
        uri: 'pixelpicker://board/256x256',
        name: 'Pixel Picker 256x256 Canvas Board',
        mimeType: 'application/json',
        description: 'Live active pixels on 256x256 board'
      },
      {
        uri: 'pixelpicker://board/22x6',
        name: 'Pixel Picker 22x6 Micro Board',
        mimeType: 'application/json',
        description: 'Live active pixels on 22x6 board'
      },
      {
        uri: 'pixelpicker://analytics/summary',
        name: 'Pixel Picker Telemetry Analytics',
        mimeType: 'application/json',
        description: 'Privacy-first telemetry and pageview summary'
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri.startsWith('pixelpicker://board/')) {
    const preset = uri.replace('pixelpicker://board/', '');
    const pixels = await fetchFirestorePixels(preset);
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ preset, pixelsCount: pixels.length, pixels }, null, 2)
        }
      ]
    };
  }

  if (uri === 'pixelpicker://analytics/summary') {
    const res = await fetch(`${FIRESTORE_BASE_URL}/pixelpicker_analytics`);
    let records = [];
    if (res.ok) {
      const data = await res.json();
      if (data.documents) {
        records = data.documents.map(d => d.fields || {});
      }
    }
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ totalPageViews: records.length, records }, null, 2)
        }
      ]
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Run Server via STDIO Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Pixel Picker MCP Server running on STDIO transport');
}

main().catch(err => {
  console.error('Fatal error starting Pixel Picker MCP Server:', err);
  process.exit(1);
});

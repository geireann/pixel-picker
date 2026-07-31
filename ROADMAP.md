# Development Roadmap - Pixel Picker

## Phase 1: Core Setup & Architecture
- [x] Project initiation & standards audit (`init.md`, `COMPETITIVE_ANALYSIS.md`, `PRODUCT_PRD.md`, `TECHNICAL_SPEC.md`)
- [x] Vite + Lit + TypeScript + Vitest + pnpm build environment setup
- [x] SQLite Database schema initialization & server setup (`server.js`, `db.js`)
- [x] Firebase hosting setup (`firebase.json` target `pixelpicker.web.app`)

## Phase 2: Canvas Engine & Lit Component System
- [x] Interactive 256x256 2D Canvas renderer with crisp zoom/pan math and touch gesture support
- [x] Lit Web Component 4-file folder implementations:
  - [x] `intro-modal` (One-time dismissable modal with localStorage memory & help trigger)
  - [x] `canvas-board` (Viewport container, HUD overlay, mini-map, coordinates)
  - [x] `editor-panel` (Color picker, Letter editor, Number editor, apply/clear buttons)
  - [x] `history-panel` (Per-pixel edit log timeline)
  - [x] `time-scrubber` (Global temporal slider control bar)

## Phase 3: Realtime WebSockets & State Engine
- [x] Bi-directional WebSocket stream client & server handler (`ws`)
- [x] IP + User-Agent fingerprinting module
- [x] Rate-limiter architecture middleware (configured to 0/unlimited by default)
- [x] Board & history Sliced State Stores (`board-store`, `editor-store`, `history-store`)

## Phase 4: Per-Pixel History & Global Time-Travel
- [x] Per-pixel change history endpoint and UI timeline view
- [x] Historical board snapshot query engine (`GET /api/board/snapshot?timestamp=...`)
- [x] Time-travel slider integration with live return toggle
- [x] Pre-seeded demo canvas artwork & temporal history generator

## Phase 5: Verification, Testing & Firebase Deployment
- [x] Vitest unit tests for presentation components (100% pass across 12 tests)
- [x] Cross-device responsive design & mobile touch gesture verification
- [x] Production build verification via `pnpm build`
- [x] Firebase Hosting deployment configuration check for `pixelpicker.web.app`

# Project Initialization: Pixel Picker

> **Status**: COMPLETED  
> **Project Owner**: Geireann  
> **Last Updated**: 2026-07-31  
> **Domain Target**: `pixelpicker.web.app` (Firebase Hosting)

---

## 1. Executive Summary & Vision
- **Problem Statement**: Collaborative creative spaces are often restricted to colors only, locked behind sign-in friction, or lack temporal transparency into how work was created.
- **Target Audience**: Web & mobile users seeking zero-friction realtime collaborative pixel creation (art, numbers, letters, maps, and ASCII pixel patterns).

---

## 2. Open Questions & Scope Alignment

### Q1: Problem & Target Audience
- **Status**: [ANSWERED]
- **Question**: What core problem does this application solve, and who are the target users?
- **Project Owner Answer**: A real-time, zero-friction 256x256 pixel grid canvas accessible to web and mobile web users without requiring login, allowing collaborative painting with Colors, Letters, and Numbers.

### Q2: MVP Scope & Non-Negotiables
- **Status**: [ANSWERED]
- **Question**: What are the non-negotiable features for the MVP?
- **Project Owner Answer**: 
  1. 256x256 Pan/Zoom Canvas (Desktop + Mobile touch gestures).
  2. Multi-mode Pixel edits: RGBA Color, Letter (A-Z), Number (0-9).
  3. Shared write realtime WebSockets backend (No sign-in required, IP + UA fingerprinting).
  4. Per-Pixel Audit History + Global Time-Travel Scrubber.
  5. One-time dismissable intro modal (persisted in localStorage, re-openable from UI).
  6. Rate-limiting architecture foundation (set to 0/unlimited per user spec).
  7. Firebase Hosting deployment target (`pixelpicker.web.app`).

### Q3: Target Platforms & Runtimes
- **Status**: [ANSWERED]
- **Question**: What platforms are targeted?
- **Project Owner Answer**: Cross-device Web App + Mobile Web App (responsive layout, touch manipulation, safe-area insets).

### Q4: UI/UX & Design Inspiration
- **Status**: [ANSWERED]
- **Question**: What UI/UX standards & design system should be used?
- **Project Owner Answer**: Modern dark glassmorphism design system using Lit Web Components (`TypeScript + Lit + Vite + Vitest + pnpm`), 4-file component folder pattern, and dynamic canvas rendering.

### Q5: Performance SLAs & Success KPIs
- **Status**: [ANSWERED]
- **Question**: What are the performance targets?
- **Project Owner Answer**: 60 FPS canvas pan/zoom loop, <50ms local edit rendering latency, sub-100ms WebSocket sync broadcast across clients.

---

## 3. Scope & Feature Boundaries
- **MVP Features**:
  - Interactive 256x256 canvas with pan, zoom, grid, coordinates, and minimap.
  - Pixel Inspector with color, letter, and number editors.
  - Per-pixel history panel showing timestamped edits and author fingerprints.
  - Global Time-Travel Scrubber bar for viewing historical board snapshots.
  - One-time dismissable intro modal with key instructions.
  - Live socket connection indicator and active editor stats.
- **Post-MVP Options**:
  - Toggleable active rate limiting rules (edits per minute).
  - Region selection / export to PNG or GIF timelapse.

---

## 4. Technical Architecture & Stack Alignment
- **Frontend**: TypeScript + Lit (`LitElement`) + Vite + Vitest + pnpm
- **Component Pattern**: 4-File Component Pattern (`<name>.ts`, `<name>-presentation.ts`, `<name>.css.ts`, `<name>-presentation.test.ts`)
- **Services**: Abstracted TypeScript services (`IBoardService`, `IWebSocketService`, `IHistoryService`)
- **Backend & Storage**: Node.js + Express + WebSocket server (`ws`) + SQLite (`sqlite3`) persistent database
- **Deployment**: Firebase Hosting (`pixelpicker.web.app`)

---

## 5. Completion Gate Checklist
- [x] `init.md` generated and open questions itemized
- [x] All open questions answered by Project Owner (`[ANSWERED]`)
- [x] `COMPETITIVE_ANALYSIS.md` compiled
- [x] `PRODUCT_PRD.md` compiled
- [x] `ROADMAP.md` compiled
- [x] `TECHNICAL_SPEC.md` compiled

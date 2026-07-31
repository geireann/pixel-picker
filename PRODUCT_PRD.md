# Product Requirements Document (PRD) - Pixel Picker

## 1. Executive Summary & Vision
- **Product Overview**: Pixel Picker is a real-time, globally collaborative 256x256 pixel grid canvas application where users can edit pixels to display an **RGBA Color**, a **Letter**, or a **Number**, view per-pixel change history, and scrub back in time using a **Global Temporal Time-Travel Scrubber**.
- **Target Audience**: Desktop web users and mobile web users.
- **Target Runtimes**: Cross-device Web App + Mobile Web App (Target domain: `pixelpicker.web.app`).

## 2. Goals & Success Metrics
- **User Outcome**: Zero-friction collaborative art, text, and numeric creation with complete temporal history and auditability.
- **Performance Targets**: 60 FPS viewport rendering, <50ms edit-to-canvas response, <100ms multi-client WebSocket synchronization, 100% test coverage for presentation logic via Vitest.

## 3. Tech Stack & Architecture Alignment
- **Frontend Core**: TypeScript + Lit (`LitElement` Web Components)
- **Build Engine & Dev Tooling**: Vite + Vitest + pnpm
- **State Strategy**: Sliced Stores (`src/store/`) + Lit Signals / Reactive Controllers
- **Component Pattern**: 4-File Component Pattern (`<name>.ts`, `<name>-presentation.ts`, `<name>.css.ts`, `<name>-presentation.test.ts`)
- **Backend Service**: Node.js + Express + `ws` WebSocket library + SQLite (`sqlite3`) persistent database
- **Deployment**: Firebase Hosting (`pixelpicker.web.app`)

## 4. System Architecture & Directory Structure
```
pixel-picker/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── intro-modal/
│   │   │   ├── intro-modal.ts
│   │   │   ├── intro-modal-presentation.ts
│   │   │   ├── intro-modal.css.ts
│   │   │   └── intro-modal-presentation.test.ts
│   │   ├── canvas-board/
│   │   │   ├── canvas-board.ts
│   │   │   ├── canvas-board-presentation.ts
│   │   │   ├── canvas-board.css.ts
│   │   │   └── canvas-board-presentation.test.ts
│   │   ├── editor-panel/
│   │   │   ├── editor-panel.ts
│   │   │   ├── editor-panel-presentation.ts
│   │   │   ├── editor-panel.css.ts
│   │   │   └── editor-panel-presentation.test.ts
│   │   ├── history-panel/
│   │   │   ├── history-panel.ts
│   │   │   ├── history-panel-presentation.ts
│   │   │   ├── history-panel.css.ts
│   │   │   └── history-panel-presentation.test.ts
│   │   └── time-scrubber/
│   │       ├── time-scrubber.ts
│   │       ├── time-scrubber-presentation.ts
│   │       ├── time-scrubber.css.ts
│   │       └── time-scrubber-presentation.test.ts
│   ├── services/
│   │   ├── board-service.ts
│   │   ├── websocket-service.ts
│   │   └── history-service.ts
│   ├── store/
│   │   ├── board-store.ts
│   │   ├── editor-store.ts
│   │   └── history-store.ts
│   ├── types/
│   │   └── pixel.ts
│   └── utils/
│       ├── canvas-renderer.ts
│       ├── fingerprint.ts
│       └── touch-gesture.ts
├── server/
│   ├── db.js
│   ├── server.js
│   └── fingerprint.js
├── firebase.json
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## 5. Functional Requirements & Acceptance Criteria

### Feature 1: Interactive 256x256 Canvas Engine
**User Story**: As a user on desktop or mobile, I want to pan and zoom smoothly around the 256x256 pixel grid so that I can view and edit individual pixels easily.
- **Scenario 1 (Pan/Zoom Navigation)**:
  - **Given** the 256x256 pixel grid rendered on screen.
  - **When** the user drags with mouse/touch or uses mouse wheel / pinch gestures.
  - **Then** the canvas pans and zooms smoothly maintaining crisp pixel alignment without blur.
- **Scenario 2 (Coordinate Inspection)**:
  - **Given** mouse cursor hovering or touch target tapping a pixel.
  - **When** hovering over (X: 120, Y: 84).
  - **Then** the UI HUD displays the exact coordinate, current content type, and highlight outline.

### Feature 2: Multi-Mode Pixel Editing (Color, Letter, Number)
**User Story**: As a contributor, I want to edit a selected pixel to be an RGBA Color, a Letter, or a Number so that I can build artwork or text on the canvas.
- **Scenario 1 (RGBA Color Edit)**:
  - **Given** pixel (X: 45, Y: 90) selected.
  - **When** user selects Color tab, picks RGBA `#00FFCC`, and clicks Apply.
  - **Then** the pixel updates immediately locally and broadcasts to all connected WebSocket clients.
- **Scenario 2 (Letter / Symbol Edit)**:
  - **Given** pixel selected.
  - **When** user selects Letter tab, types `K`, selects text color `#FFFFFF` and background color `#330066`.
  - **Then** the pixel renders the character `K` sharply centered on `#330066` background.
- **Scenario 3 (Number Edit)**:
  - **Given** pixel selected.
  - **When** user selects Number tab and inputs `9`.
  - **Then** the pixel renders the number `9`.

### Feature 3: One-Time Dismissable Intro Modal
**User Story**: As a first-time visitor, I want a clear intro modal explaining how the canvas works so that I understand the controls and features.
- **Scenario 1 (First Visit)**:
  - **Given** a user opening `pixelpicker.web.app` for the first time (`localStorage.getItem('pixelpicker_intro_seen')` is null).
  - **When** the app loads.
  - **Then** the Intro Modal appears over a blurred background with a "Get Started" button.
- **Scenario 2 (Dismiss & Re-open)**:
  - **Given** the Intro Modal visible.
  - **When** user clicks "Get Started" or "Close".
  - **Then** modal closes and `pixelpicker_intro_seen` is set to `true`. Clicking the Header Help (`?`) icon re-opens the modal at any time.

### Feature 4: Real-time Collaboration & Anonymous Fingerprinting
**User Story**: As a user, I want my edits to save automatically and sync to everyone else live without needing an account.
- **Scenario 1 (Live Realtime Sync)**:
  - **Given** User A and User B connected to the server.
  - **When** User A edits pixel (X: 10, Y: 20).
  - **Then** User B's screen receives the WebSocket edit message and updates pixel (X: 10, Y: 20) within <100ms.
- **Scenario 2 (Anonymous Fingerprint)**:
  - **Given** server receiving an edit payload.
  - **When** server processes the edit request.
  - **Then** server hashes `IP + User-Agent` to create an anonymous editor signature recorded in history.

### Feature 5: Per-Pixel Audit History & Global Time-Travel Scrubber
**User Story**: As a user, I want to inspect who changed a pixel over time and scrub back through the board's history.
- **Scenario 1 (Pixel History Panel)**:
  - **Given** pixel selected.
  - **When** user clicks "View Pixel History".
  - **Then** a timeline list of all edits to that coordinate appears with timestamps, content diffs, and author fingerprints.
- **Scenario 2 (Global Time Travel)**:
  - **Given** the bottom time-travel slider.
  - **When** user drags the timeline slider back to 2 hours ago.
  - **Then** the canvas renders the exact state of the board 2 hours ago, showing a "HISTORICAL SNAPSHOT" indicator bar with a "Return to Live" button.

## 6. Non-Functional Requirements
- **Responsive Layout**: Full support for desktop screen sizes and mobile touchscreens with touch manipulation tuning.
- **Performance**: 60 FPS viewport animation loop, crisp crisp sub-pixel rendering.
- **Testing**: 100% unit test execution passing across all Lit component presentation tests via Vitest.

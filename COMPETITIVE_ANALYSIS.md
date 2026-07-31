# Competitive Analysis - Pixel Picker

## 1. Executive Summary
Pixel Picker enters the collaborative canvas space with a unique hybrid feature set: combining traditional RGBA color pixels with character-based pixels (**Letters** and **Numbers**), full **per-pixel audit history**, and a **Global Temporal Time-Travel Scrubber** that allows scrubbing back through board evolution over time.

---

## 2. Competitor Benchmark Matrix

| Feature | **Pixel Picker** | **Reddit r/place** | **PixelCanvas.io** | **Drawception / Canvas Games** |
| :--- | :--- | :--- | :--- | :--- |
| **Grid Size** | 256 x 256 (65,536 pixels) | 1000 x 1000 to 2000 x 2000 | Infinite canvas | Fixed small frames |
| **Pixel Types** | **RGBA Color, Letter (A-Z/chars), Number (0-9)** | Color palette only | Color palette only | Freehand drawing |
| **Authentication** | **No sign-in required** (IP + UA fingerprint) | Reddit Account Required | Anonymous / Captcha | Account required |
| **Rate Limiting** | Prepared & configurable (0/unlimited initially) | Strict 5-min cooldown per pixel | Exponential delay (30s-30m) | Turn-based timer |
| **Temporal Time-Travel** | **Global scrubber timeline slider** | Post-event time-lapse video | None (Static view) | Archive view |
| **Pixel Audit Log** | **Full per-pixel change history** | Limited moderator log | None | Game transcript |
| **Platform Target** | **Web + Mobile Web (PWA ready)** | Reddit Mobile App / Web | Web browser | Web browser |
| **Rendering Engine** | **HTML5 2D Canvas + Lit Web Components** | Custom WebGL canvas | Custom WebGL canvas | 2D Canvas |

---

## 3. Key Differentiators & Competitive Advantage

1. **Multi-Content Pixels (Letters & Numbers)**: Existing platforms only allow selecting a color from a fixed palette. Pixel Picker allows users to compose text banners, mathematical patterns, labeled maps, and ASCII art directly on the board alongside rich RGBA colors.
2. **Global Temporal Time-Travel**: Users can scrub back to any historical timestamp to replay how artwork evolved or identify historical edits.
3. **Per-Pixel Audit Log**: Detailed breakdown of every edit made to a specific coordinate, including timestamp, edit type, and editor fingerprint.
4. **Zero-Friction Collaborative Entry**: Instant live connection via WebSockets without requiring account creation or login screens.
5. **Mobile-First Touch & Gestures**: Engineered with Lit web components, Vite, and custom canvas pan/zoom gesture physics for desktop and mobile web viewports.

# ARIA Roles and Labels

This document lists the key interface elements with their associated ARIA attributes.
The markup is annotated so assistive technologies and language models can
understand the purpose of each feature.

## Feature Overview

- **Main Stream Container** (`#main-stream-container`)
  - `role="region"`
  - `aria-label="Live Stream"`
  - Contains the `<spwashi-stream-container>` element (`role="feed"`).
  - Implemented in `src/js/ui/components/stream-container.js`, which opens a WebSocket and dispatches mode handlers from `src/js/modes/stream`.
- **Simulation SVG** (`#simulation`)
  - `aria-label="Simulation"`
  - Wraps dynamic nodes, edges and rectangles.
  - Updated by the modules under `src/js/simulation`, such as `basic.js`, `forces.js`, and `events.js`.
- **Event Log** (`#main-log`)
  - `role="log"`
  - `aria-live="polite"`
  - Displays streamed updates.
  - Entries are pushed through the `logMainEvent()` helper in `src/js/simulation/nodes/ui/circle.js`.
- **Image Container** (`#main-image-container`)
  - `aria-label="Image Viewer"`
  - Filled by `src/js/ui/components/page-image.js` when a base64 image is provided.
- **Focus Toggle** (`#focal-square`)
  - `aria-label="Focus Target"`
  - Controlled by `src/js/ui/components/focal-point.js` and can also be toggled with a hotkey defined in `src/js/ui/hotkeys/handlers/toggle-focal-point.js`.
- **Mode Sections** (`#spw-mode-container`, `#story-mode-container`, etc.)
  - Each section has `aria-label` describing the mode.
  - Corresponding handlers live under `src/js/modes` and are bound when the UI initializes.
- **Keyboard Shortcuts Menu** (`#mainmenu-shortcuts`)
  - `aria-label="Keyboard Shortcuts"`
  - Populated by `src/js/ui/components/hotkey-buttons.js`.
- **Hotkey Menu Toggle** (`#hotkey-menu-toggle`)
  - `aria-label="Toggle Hotkey Menu"`
  - Toggles interface depth via `src/js/ui/hotkeys/handlers/toggle-hotkey-menu.js`.
- **Hotkey Options** (`#hotkey-container`)
  - `aria-label="Hotkey Options"`
  - Contains configurable shortcut buttons rendered by `hotkey-buttons`.
- **Query Parameter Documentation** (`#query-param-docs`)
  - `aria-label="Query Parameter Documentation"`
  - Populated at runtime by `src/js/ui/components/query-param-docs.js`.

These attributes clarify the purpose of the markup and show where each feature's interactive logic originates.

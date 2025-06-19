# Application Feature Reference

This document maps major features of the Factshift web client to the modules implementing them. The `AppFeatures` object exported from `src/js/app/features.js` exposes the same information programmatically. Individual constants such as `INIT_PHASES` and `STREAM_MODES` can also be imported from that module for finer-grained dependencies.

- **Initialization & Startup**
  - Pipeline phases are defined in `src/js/bootstrap/init-pipeline.js` and enumerated by the `INIT_PHASES` constant.
  - Routing and query helpers live under `src/js/services`.
- **Real-time Streaming**
  - Individual stream mode handlers are in `src/js/modes/stream` and listed in the `STREAM_MODES` array.
  - `DataManager` in `src/js/services/data-manager.js` manages static or live sources.
- **Simulation & Forces**
  - Core D3 setup is located in `src/js/simulation/basic.js`.
  - The force registry is implemented in `src/js/simulation/force-registry.js`.
- **Input & Hotkeys**
  - Keyboard mappings live in `src/js/config/hotkeys.js` with handlers under `src/js/ui/hotkeys`.
- **UI & Accessibility**
  - Responsive styles are in `src/styles/scss` and accessibility notes in `docs/aria.md`.
- **PWA Features**
  - The service worker script is distributed under `public/v0.0.2-alpha/service-worker.js`.
  - PWA metadata is declared in `public/manifest.json`.
- **Quality Assurance**
  - QA notes and checklists live under `docs/qa`.

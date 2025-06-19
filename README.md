# Factshift Web Client

This repository contains the front‑end code for **app.factshift.com**. The project is built with [Vite](https://vitejs.dev/) and uses a variety of client‑side libraries to power a real‑time stream interface.

## Installation

Use `yarn` to install dependencies:

```bash
yarn install
```

## Development

Start a local development server:

```bash
yarn start
```

## Building

Create a production build:

```bash
yarn build
```

Preview the built files locally:

```bash
yarn serve
```

## Initialization

For details on how the initialization pipeline works, see [docs/init-pipeline.md](docs/init-pipeline.md).
Metadata about registered data slices lives in [docs/api/data-meta.md](docs/api/data-meta.md).

### Routing and Query Parameters

The app exposes a lightweight routing integration service that notifies
listeners when the browser path changes. Query parameter handlers can be
registered via `services/query-params.js` and will be applied during the
initial parameter loading step. A small `QueryState` service surfaces the
current `{mode, phase, slice}` selection for convenience when accessing
registered data slices. Use `getCurrentQuery()` or its alias
`getCurrentStatus()` to retrieve these values. The optional `?slice=<name>` query
parameter now selects a named data slice at startup.

## QA

Quality assurance checklists live under [docs/qa](docs/qa). See the
[Ace Editor Styling QA Checklist](docs/qa/ace-editor-style.md) for
testing the new code editor styles.

## Accessibility

The SCSS includes an optional high‑contrast theme and obeys user
preferences for reduced motion and light or dark color schemes. Set
`data-theme="high-contrast"` or `data-theme="dark"` on the `<body>`
element to override the system preference.

Additional ARIA guidance for the markup is available in
[docs/aria.md](docs/aria.md), which now maps elements to their
corresponding JavaScript modules.

## Responsive Design

Viewport specific overrides live under `styles/scss/form-factors`.
`style.scss` imports separate files for `mobile`, `tablet`, and `desktop`
rules. Additional tweaks in `orientation.scss` adjust layouts when a
device switches between portrait and landscape. These breakpoints keep
the interface usable across a range of devices.
Additional styles respond to modern accessibility APIs. The stylesheet
now recognizes `prefers-contrast` and `prefers-reduced-transparency`
media queries to accommodate users that request extra contrast or minimal
translucency.


## Keyboard Shortcuts

- Press the **backtick** (`\``) to toggle the main menu.
- Press **1** through **9** to switch between the available input modes.
- Stream modes are under development and currently disabled.

Hotkeys for other features can be customized in `src/js/config/hotkeys.js`. The
default configuration maps keys to interface actions and force toggles.


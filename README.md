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

### Routing and Query Parameters

The app exposes a lightweight routing integration service that notifies
listeners when the browser path changes. Query parameter handlers can be
registered via `services/query-params.js` and will be applied during the
initial parameter loading step.

## QA

Quality assurance checklists live under [docs/qa](docs/qa). See the
[Ace Editor Styling QA Checklist](docs/qa/ace-editor-style.md) for
testing the new code editor styles.

## Accessibility

The SCSS includes an optional high‑contrast theme and obeys user
preferences for reduced motion and light or dark color schemes. Set
`data-theme="high-contrast"` or `data-theme="dark"` on the `<body>`
element to override the system preference.

Additional styles respond to modern accessibility APIs. The stylesheet
now recognizes `prefers-contrast` and `prefers-reduced-transparency`
media queries to accommodate users that request extra contrast or minimal
translucency.


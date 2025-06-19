export const INIT_PHASES = {
  BOOT: 'boot',
  UI: 'ui',
  REFRESH: 'refresh',
  DEFERRED: 'deferred',
};

export const STREAM_MODES = [
  'boon',
  'bane',
  'bone',
  'bonk',
  'honk',
  'boof',
  'lore',
  'focal',
  'passive',
];

export const AppFeatures = {
  initialization: {
    pipelinePhases: Object.values(INIT_PHASES),
    router: 'services/router.js',
    queryState: 'services/query-state.js',
  },
  streaming: {
    modes: STREAM_MODES,
    dataManager: 'services/data-manager.js',
  },
  simulation: {
    modules: ['simulation/basic.js'],
    forceRegistry: 'simulation/force-registry.js',
  },
  input: {
    hotkeys: 'ui/hotkeys',
  },
  ui: {
    responsiveScss: 'styles/scss',
    accessibilityDocs: 'docs/aria.md',
  },
  pwa: {
    serviceWorker: 'public/v0.0.2-alpha/service-worker.js',
    manifest: 'public/manifest.json',
  },
  qa: {
    docs: 'docs/qa',
  },
};

export default AppFeatures;

import {hydrateUi} from "./bootstrap/hydrate-ui";
import {initRoot} from "./bootstrap/root";
import {initSvgEvents} from "./simulation/events";
import {simulationElements} from "./simulation/basic";
import {initParameters} from "./bootstrap/parameters/init";
import {loadParameters} from "./bootstrap/parameters/read";
import {initSite} from "./bootstrap/site";
import {initAnalytics} from "./meta/analytics";
import {addInitSteps, runInitPipeline} from "./bootstrap/init-pipeline";

const versions = {
  'v0.0.1': {
    assetPath: 'v0.0.1',
  },
  'v0.0.2': {
    assetPath: 'v0.0.2-alpha'
  }
}

async function registerServiceWorker(version = 'v0.0.2') {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const {assetPath} = versions[version];

  try {
    const registration = await navigator.serviceWorker.register(`/${assetPath}/service-worker.js`);
    console.log('Service Worker registered with scope:', registration.scope);
  } catch (e) {
    console.log('Service Worker registration failed:', e);
  }
}

export async function app() {
  let serviceWorkerRegistered = registerServiceWorker();

  window.spwashi = {};

  addInitSteps([
    ['analytics', initAnalytics],
    ['parameters', initParameters],
    ['root', initRoot],
    ['site', initSite],
    [
      'queryParams',
      () => loadParameters(new URLSearchParams(window.location.search)),
    ],
    ['svg', () => initSvgEvents(simulationElements.svg)],
    ['ui', () => hydrateUi(window.spwashi.initialMode)],
  ]);

  await runInitPipeline();

  return Promise.all([serviceWorkerRegistered])
    .then(() => {
      setTimeout(() => {
        console.log('app is ready');
      }, 1000);
    });
}
import {hydrateUi} from "./bootstrap/hydrate-ui";
import {initRoot} from "./bootstrap/root";
import {initSvgEvents} from "./simulation/events";
import {simulationElements} from "./simulation/basic";
import {initParameters} from "./bootstrap/parameters/init";
import {loadParameters} from "./bootstrap/parameters/read";
import {initSite} from "./bootstrap/site";
import {initAnalytics} from "./meta/analytics";

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

  initAnalytics();
  initParameters();
  initRoot();
  initSite();

  // initialize context-sensitive parameters
  loadParameters(new URLSearchParams(window.location.search));

  // primary interactive elements
  initSvgEvents(simulationElements.svg);

  // progressive enhancement
  hydrateUi(window.spwashi.initialMode);

  return Promise.all([serviceWorkerRegistered])
    .then(() => {
      setTimeout(() => {
        console.log('app is ready');
      }, 1000);
    });
}
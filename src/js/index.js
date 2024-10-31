import {initFocalSquare} from "./ui/focal-point";
import {initH1} from "./ui/h1";
import {initUi} from "./init/ui";
import {initRoot} from "./init/root";
import {initSvgEvents} from "./simulation/events";
import {simulationElements} from "./simulation/basic";
import {initParameters} from "./init/parameters/init";
import {loadParameters} from "./init/parameters/read";
import {initSite} from "./init/site";
import {initAnalytics} from "./meta/analytics";
import {initWebSocketContainer} from "./ui/websocket-container";

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
  initFocalSquare();
  initH1();

  // progressive enhancement
  initUi(window.spwashi.initialMode);
  initWebSocketContainer();

  return Promise.all([serviceWorkerRegistered])
    .then(() => {
      setTimeout(() => {
        console.log('app is ready');
      }, 1000);
    });
}
import { addInitSteps, runInitPipeline } from "./bootstrap/init-pipeline";
import { defaultInitSteps } from "./bootstrap/init-steps";
import { expectEvent } from "./services/events.js";
import { debug } from "./services/logger.js";

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

  addInitSteps(defaultInitSteps);

  await runInitPipeline();

  const readyPromise = expectEvent(document, 'simulation-ready', 5000)
    .catch(() => {});

  return Promise.all([serviceWorkerRegistered, readyPromise])
    .then(() => {
      debug('app is ready');
    });
}

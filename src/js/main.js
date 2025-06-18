import { addInitSteps, runInitPipeline } from "./bootstrap/init-pipeline";
import { defaultInitSteps } from "./bootstrap/init-steps";

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

  return Promise.all([serviceWorkerRegistered])
    .then(() => {
      setTimeout(() => {
        console.log('app is ready');
      }, 1000);
    });
}

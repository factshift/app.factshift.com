import {initFocalSquare} from "./ui/focal-point";
import {initH1} from "./ui/h1";
import {initUi} from "./init/ui";
import {initRoot} from "./init/root";
import {initSvgEvents} from "./simulation/events";
import {simulationElements} from "./simulation/basic";
import {initParameters} from "./init/parameters/init";
import {loadParameters} from "./init/parameters/read";
import {initSite} from "./init/site";
import {initWebsocket} from "./init/websocket";
import {initAnalytics} from "./meta/analytics";
import {filterNodes, setNodeData} from "./simulation/nodes/data/set";
import {NODE_MANAGER} from "./simulation/nodes/nodes";

const versions = {
  'v0.0.1': {
    assetPath: 'v0.0.1',
  }
}

async function registerServiceWorker(version = 'v0.0.1') {
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
  initWebsocket();

  // initialize context-sensitive parameters
  loadParameters(new URLSearchParams(window.location.search));

  // primary interactive elements
  initSvgEvents(simulationElements.svg);
  initFocalSquare();
  initH1();

  // progressive enhancement
  initUi(window.spwashi.initialMode);

  return Promise.all([serviceWorkerRegistered])
    .then(() => {
      setTimeout(() => {
        let pathname = window.location.pathname;
        pathname = pathname.split('/').filter(Boolean).join('/');
        fetch('/api/node_lists/[route]:' + pathname + '/nodes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => response.json())
          .then(data => {
            NODE_MANAGER.initNodes(data.map(node => ({
              id: node.node_id,
              name: node.node_name,
              x: node.x_coordinate,
              y: node.y_coordinate,
              callbacks: {
                click: (e, d) => {
                  // send delete request to server
                  fetch('/api/nodes/' + d.id, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                    .then(data => {
                      filterNodes(dd => dd.id !== d.id);
                      window.spwashi.reinit();
                    })
                    .catch(error => console.error('Error:', error));
                }
              }
            })))
            window.spwashi.reinit();
          })
          .catch(error => console.error('Error:', error));
      }, 1000);
    });
}
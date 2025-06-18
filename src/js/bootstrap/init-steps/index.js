import { initAnalytics } from '../meta/analytics';
import { initParameters } from '../bootstrap/parameters/init';
import { initRoot } from '../bootstrap/root';
import { initSite } from '../bootstrap/site';
import { loadParameters } from '../bootstrap/parameters/read';
import { initSvgEvents } from '../simulation/events';
import { simulationElements } from '../simulation/basic';
import { hydrateUi } from '../bootstrap/hydrate-ui';

export const analyticsStep = { id: 'analytics', init: initAnalytics, priority: 0 };
export const parametersStep = { id: 'parameters', init: initParameters, priority: 1 };
export const rootStep = { id: 'root', init: initRoot, priority: 2 };
export const siteStep = { id: 'site', init: initSite, priority: 3 };
export const queryParamsStep = {
  id: 'queryParams',
  init: () => loadParameters(new URLSearchParams(window.location.search)),
  priority: 4,
  dependsOn: ['parameters'],
};
export const svgStep = {
  id: 'svg',
  init: () => initSvgEvents(simulationElements.svg),
  priority: 5,
  dependsOn: ['root'],
};
export const uiStep = {
  id: 'ui',
  init: () => hydrateUi(window.spwashi.initialMode),
  priority: 6,
  dependsOn: ['svg', 'parameters'],
};

export const defaultInitSteps = [
  analyticsStep,
  parametersStep,
  rootStep,
  siteStep,
  queryParamsStep,
  svgStep,
  uiStep,
];

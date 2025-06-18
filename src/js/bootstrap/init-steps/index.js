import { InitPhase } from '../init-pipeline';
import { initAnalytics } from '../../meta/analytics';
import { initParameters } from '../parameters/init';
import { initRoot } from '../root';
import { initSite } from '../site';
import { loadParameters } from '../parameters/read';
import { initSvgEvents } from '../../simulation/events';
import { getSimulationElements } from '../../simulation/basic';
import { hydrateUi } from '../hydrate-ui';
import { initRouter } from '../../services/router';

export const analyticsStep = {
  id: 'analytics',
  init: initAnalytics,
  priority: 0,
  phase: InitPhase.BOOT,
};
export const parametersStep = {
  id: 'parameters',
  init: initParameters,
  priority: 1,
  phase: InitPhase.BOOT,
};
export const rootStep = {
  id: 'root',
  init: initRoot,
  priority: 2,
  phase: InitPhase.BOOT,
};
export const siteStep = {
  id: 'site',
  init: initSite,
  priority: 3,
  phase: InitPhase.BOOT,
};
export const queryParamsStep = {
  id: 'queryParams',
  init: () => loadParameters(new URLSearchParams(window.location.search)),
  priority: 4,
  phase: InitPhase.BOOT,
  dependsOn: [parametersStep],
};
export const svgStep = {
  id: 'svg',
  init: () => initSvgEvents(getSimulationElements().svg),
  priority: 5,
  phase: InitPhase.UI,
  dependsOn: [rootStep],
};
export const uiStep = {
  id: 'ui',
  init: () => hydrateUi(window.spwashi.initialMode),
  priority: 6,
  phase: InitPhase.UI,
  dependsOn: [svgStep, parametersStep],
};
export const routerStep = {
  id: 'router',
  init: initRouter,
  priority: 7,
  phase: InitPhase.REFRESH,
  dependsOn: [uiStep],
};

export const stepsById = {
  analytics: analyticsStep,
  parameters: parametersStep,
  root: rootStep,
  site: siteStep,
  queryParams: queryParamsStep,
  svg: svgStep,
  ui: uiStep,
  router: routerStep,
};

export const defaultInitSteps = Object.values(stepsById);

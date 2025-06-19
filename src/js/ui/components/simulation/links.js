import { EDGE_MANAGER } from '../../../simulation/edges/edges.js';
import { getSimulationElements } from '../../../simulation/basic.js';
import { registerComponent } from '../../component-registry.js';
import DataManager from '../../../simulation/data/index.js';
import { getCurrentQuery } from '../../../services/query-state.js';

export function updateSimulationLinks(links) {
  const { wrapper } = getSimulationElements();
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  if (DataManager.isDisplayEnabled('links', { mode, phase, sliceName })) {
    EDGE_MANAGER.updateLinks(wrapper, links);
  }
}

export function initSimulationLinks() {
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  const links = DataManager.getData('links', { mode, phase, sliceName }) || [];
  updateSimulationLinks(links);
}

export const simulationLinks = { init: initSimulationLinks, update: updateSimulationLinks };

registerComponent('simulation-links', simulationLinks);

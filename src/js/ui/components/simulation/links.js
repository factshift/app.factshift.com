import { EDGE_MANAGER } from '../../../simulation/edges/edges';
import { getSimulationElements } from '../../../simulation/basic';
import { registerComponent } from '../../component-registry';

export function updateSimulationLinks(links) {
  const { wrapper } = getSimulationElements();
  EDGE_MANAGER.updateLinks(wrapper, links);
}

export function initSimulationLinks() {
  updateSimulationLinks(window.spwashi.links || []);
}

export const simulationLinks = { init: initSimulationLinks, update: updateSimulationLinks };

registerComponent('simulation-links', simulationLinks);

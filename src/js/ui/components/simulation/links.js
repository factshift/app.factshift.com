import { EDGE_MANAGER } from '../../../simulation/edges/edges';
import { getSimulationElements } from '../../../simulation/basic';
import { registerComponent } from '../../component-registry';
import DataManager from '../../../simulation/data';

export function updateSimulationLinks(links) {
  const { wrapper } = getSimulationElements();
  const mode  = window.spwashi.parameters.mode;
  const phase = document.body?.dataset.phase || 'default';
  if (DataManager.isDisplayEnabled('links', { mode, phase })) {
    EDGE_MANAGER.updateLinks(wrapper, links);
  }
}

export function initSimulationLinks() {
  const mode  = window.spwashi.parameters.mode;
  const phase = document.body?.dataset.phase || 'default';
  const links = DataManager.getData('links', { mode, phase }) || [];
  updateSimulationLinks(links);
}

export const simulationLinks = { init: initSimulationLinks, update: updateSimulationLinks };

registerComponent('simulation-links', simulationLinks);

import { NODE_MANAGER } from '../../../simulation/nodes/nodes';
import { getSimulationElements } from '../../../simulation/basic';
import { registerComponent } from '../../component-registry';
import DataManager from '../../../simulation/data';
import { getCurrentQuery } from '../../../services/query-state';

export function updateSimulationNodes(nodes) {
  const { wrapper } = getSimulationElements();
  const { mode, phase } = getCurrentQuery();
  if (DataManager.isDisplayEnabled('nodes', { mode, phase })) {
    NODE_MANAGER.updateNodes(wrapper, nodes);
  }
}

export function initSimulationNodes() {
  const { mode, phase } = getCurrentQuery();
  const nodes = DataManager.getData('nodes', { mode, phase }) || [];
  updateSimulationNodes(nodes);
}

export const simulationNodes = { init: initSimulationNodes, update: updateSimulationNodes };

registerComponent('simulation-nodes', simulationNodes);

import { NODE_MANAGER } from '../../../simulation/nodes/nodes.js';
import { getSimulationElements } from '../../../simulation/basic.js';
import { registerComponent } from '../../component-registry.js';
import DataManager from '../../../simulation/data/index.js';
import { getCurrentQuery } from '../../../services/query-state.js';

export function updateSimulationNodes(nodes) {
  const { wrapper } = getSimulationElements();
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  if (DataManager.isDisplayEnabled('nodes', { mode, phase, sliceName })) {
    NODE_MANAGER.updateNodes(wrapper, nodes);
  }
}

export function initSimulationNodes() {
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  const nodes = DataManager.getData('nodes', { mode, phase, sliceName }) || [];
  updateSimulationNodes(nodes);
}

export const simulationNodes = { init: initSimulationNodes, update: updateSimulationNodes };

registerComponent('simulation-nodes', simulationNodes);

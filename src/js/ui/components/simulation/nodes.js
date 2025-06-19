import { NODE_MANAGER } from '../../../simulation/nodes/nodes.js';
import { getSimulationElements } from '../../../simulation/basic.js';
import { registerComponent } from '../../component-registry.js';
import DataManager from '../../../simulation/data/index.js';
import { getCurrentQuery } from '../../../services/query-state.js';
import { debug } from '../../../services/logger.js';

export function updateSimulationNodes(nodes) {
  const { wrapper } = getSimulationElements();
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  if (DataManager.isDisplayEnabled('nodes', { mode, phase, sliceName })) {
    debug(`[sim-nodes] display enabled, rendering ${nodes.length} nodes`);
    NODE_MANAGER.updateNodes(wrapper, nodes);
    const size = wrapper.select('.nodes').selectAll('g.wrapper').size();
    debug(`[sim-nodes] DOM now has ${size} node wrappers`);
  }
}

export function initSimulationNodes() {
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  const nodes = DataManager.getData('nodes', { mode, phase, sliceName }) || [];
  debug(`[sim-nodes] init with ${nodes.length} nodes`);
  updateSimulationNodes(nodes);
}

export const simulationNodes = { init: initSimulationNodes, update: updateSimulationNodes };

registerComponent('simulation-nodes', simulationNodes);

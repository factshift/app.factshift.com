import { simulationLinks, initSimulationLinks, updateSimulationLinks } from './links.js';
import { simulationNodes, initSimulationNodes, updateSimulationNodes } from './nodes.js';
import { simulationRects, initSimulationRects, updateSimulationRects } from './rects.js';

export { simulationLinks, initSimulationLinks, updateSimulationLinks };
export { simulationNodes, initSimulationNodes, updateSimulationNodes };
export { simulationRects, initSimulationRects, updateSimulationRects };

export const SimulationUI = {
  initLinks: initSimulationLinks,
  initNodes: initSimulationNodes,
  initRects: initSimulationRects,
  updateLinks: updateSimulationLinks,
  updateNodes: updateSimulationNodes,
  updateRects: updateSimulationRects,
};

export default SimulationUI;

export { simulationLinks, initSimulationLinks, updateSimulationLinks } from './links';
export { simulationNodes, initSimulationNodes, updateSimulationNodes } from './nodes';
export { simulationRects, initSimulationRects, updateSimulationRects } from './rects';

export const SimulationUI = {
  initLinks: initSimulationLinks,
  initNodes: initSimulationNodes,
  initRects: initSimulationRects,
  updateLinks: updateSimulationLinks,
  updateNodes: updateSimulationNodes,
  updateRects: updateSimulationRects,
};

export default SimulationUI;

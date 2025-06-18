import { RECT_MANAGER } from '../../../simulation/rects/rects';
import { getSimulationElements } from '../../../simulation/basic';
import { registerComponent } from '../../component-registry';

export function updateSimulationRects(rects) {
  const { wrapper } = getSimulationElements();
  RECT_MANAGER.updateRects(wrapper, rects);
}

export function initSimulationRects() {
  updateSimulationRects(window.spwashi.rects || []);
}

export const simulationRects = { init: initSimulationRects, update: updateSimulationRects };

registerComponent('simulation-rects', simulationRects);

import { RECT_MANAGER } from '../../../simulation/rects/rects.js';
import { getSimulationElements } from '../../../simulation/basic.js';
import { registerComponent } from '../../component-registry.js';
import DataManager from '../../../simulation/data/index.js';
import { getCurrentQuery } from '../../../services/query-state.js';

export function updateSimulationRects(rects) {
  const { wrapper } = getSimulationElements();
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  if (DataManager.isDisplayEnabled('rects', { mode, phase, sliceName })) {
    RECT_MANAGER.updateRects(wrapper, rects);
  }
}

export function initSimulationRects() {
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  const rects = DataManager.getData('rects', { mode, phase, sliceName }) || [];
  updateSimulationRects(rects);
}

export const simulationRects = { init: initSimulationRects, update: updateSimulationRects };

registerComponent('simulation-rects', simulationRects);

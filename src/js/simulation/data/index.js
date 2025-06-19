import * as registry from './registry';
import { createDataSlice, createArraySlice, getAggregator } from './slice';

export const DataManager = {
  registerSlice: registry.registerSlice,
  getSlice: registry.getSlice,
  getData: registry.getData,
  toggleDisplay: registry.toggleDisplay,
  isDisplayEnabled: registry.isDisplayEnabled,
  clearData: registry.clearData,
  getMeta: registry.getMeta,
  createDataSlice,
  createArraySlice,
  getAggregator,
};

export const {
  registerSlice,
  getSlice,
  getData,
  toggleDisplay,
  isDisplayEnabled,
  clearData,
  getMeta,
} = registry;

export { createDataSlice, createArraySlice, getAggregator } from './slice';

export default DataManager;

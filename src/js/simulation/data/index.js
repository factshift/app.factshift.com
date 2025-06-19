import * as registry from './registry.js';
import { createDataSlice, createArraySlice, getAggregator } from './slice.js';

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

export { createDataSlice, createArraySlice, getAggregator } from './slice.js';

export default DataManager;

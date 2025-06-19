import { NODE_MANAGER } from '../../simulation/nodes/nodes';
import { forceSimulation } from 'd3';
import { getNodeImageHref } from '../../simulation/nodes/attr/href';
import { getDefaultRects } from '../../simulation/rects/data/default';
import { initSvgProperties, getSimulationElements } from '../../simulation/basic';
import DataManager from '../../simulation/data';
import { getCurrentQuery } from '../query-state';
import { debug } from '../logger.js';

function initNodes() {
  window.spwashi.clearCachedNodes = () => {
    window.spwashi.setItem('nodes', []);
  };
  window.spwashi.getNodeImageHref = getNodeImageHref;
  window.spwashi.getNode = NODE_MANAGER.getNode;
  window.spwashi.nodes = [];
  debug('[sim] init nodes');
  const { mode, phase } = getCurrentQuery();
  const aggregator = window.spwashi.parameters.dataAggregator || 'array';
  const slice = DataManager.registerSlice('nodes', {
    initialData: window.spwashi.nodes,
    mode,
    phase,
    aggregator,
  });
  window.spwashi.nodesSlice = slice;
}

function initEdges() {
  window.spwashi.links = [];
  debug('[sim] init edges');
  const { mode, phase } = getCurrentQuery();
  const aggregator = window.spwashi.parameters.dataAggregator || 'array';
  const slice = DataManager.registerSlice('links', {
    initialData: window.spwashi.links,
    mode,
    phase,
    aggregator,
  });
  window.spwashi.linksSlice = slice;
}

function initRects() {
  window.spwashi.rects = getDefaultRects();
  debug('[sim] init rects');
  const { mode, phase } = getCurrentQuery();
  const aggregator = window.spwashi.parameters.dataAggregator || 'array';
  const slice = DataManager.registerSlice('rects', {
    initialData: window.spwashi.rects,
    mode,
    phase,
    aggregator,
  });
  window.spwashi.rectsSlice = slice;
}

export function initSimulationRoot() {
  window.spwashi.reinit = () => console.log('reinit not yet defined');

  const { svg } = getSimulationElements();
  initSvgProperties(svg);

  debug('[sim] initializing simulation root');

  initNodes();
  initEdges();
  initRects();

  debug('[sim] registered data slices');

  window.spwashi.simulation = forceSimulation();
  const { mode, phase } = getCurrentQuery();
  DataManager.registerSlice('simulation', {
    initialData: window.spwashi.simulation,
    mode,
    phase,
    aggregator: 'array',
  });

  import('../../simulation/reinit').then(({ reinit }) => {
    window.spwashi.reinit = reinit;
    debug('[sim] calling reinit');
    reinit();
  });
}

export default {
  initSimulationRoot,
};

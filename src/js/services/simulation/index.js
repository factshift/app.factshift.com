import { NODE_MANAGER } from '../../simulation/nodes/nodes.js';
import { forceSimulation } from 'd3';
import { getNodeImageHref } from '../../simulation/nodes/attr/href.js';
import { getDefaultRects } from '../../simulation/rects/data/default.js';
import { initSvgProperties, getSimulationElements } from '../../simulation/basic.js';
import DataManager from '../../simulation/data/index.js';
import { getCurrentQuery } from '../query-state.js';
import { debug } from '../logger.js';

function initNodes() {
  window.spwashi.clearCachedNodes = () => {
    window.spwashi.setItem('nodes', []);
  };
  window.spwashi.getNodeImageHref = getNodeImageHref;
  window.spwashi.getNode = NODE_MANAGER.getNode;
  window.spwashi.nodes = [];
  debug('[sim] init nodes');
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  const aggregator = window.spwashi.parameters.dataAggregator || 'array';
  const slice = DataManager.registerSlice('nodes', {
    initialData: window.spwashi.nodes,
    mode,
    phase,
    sliceName,
    aggregator,
  });
  window.spwashi.nodesSlice = slice;
}

function initEdges() {
  window.spwashi.links = [];
  debug('[sim] init edges');
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  const aggregator = window.spwashi.parameters.dataAggregator || 'array';
  const slice = DataManager.registerSlice('links', {
    initialData: window.spwashi.links,
    mode,
    phase,
    sliceName,
    aggregator,
  });
  window.spwashi.linksSlice = slice;
}

function initRects() {
  window.spwashi.rects = getDefaultRects();
  debug('[sim] init rects');
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  const aggregator = window.spwashi.parameters.dataAggregator || 'array';
  const slice = DataManager.registerSlice('rects', {
    initialData: window.spwashi.rects,
    mode,
    phase,
    sliceName,
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
  const { mode, phase, slice: sliceName } = getCurrentQuery();
  DataManager.registerSlice('simulation', {
    initialData: window.spwashi.simulation,
    mode,
    phase,
    sliceName,
    aggregator: 'array',
  });

  import('../../simulation/reinit.js').then(({ reinit }) => {
    window.spwashi.reinit = reinit;
    debug('[sim] calling reinit');
    reinit().then(() => {
      const count = document.querySelectorAll('g.nodes g.wrapper').length;
      debug(`[sim] svg has ${count} node wrappers after reinit`);
    });
  });
}

export default {
  initSimulationRoot,
};

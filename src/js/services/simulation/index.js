import { NODE_MANAGER } from '../../simulation/nodes/nodes';
import { forceSimulation } from 'd3';
import { getNodeImageHref } from '../../simulation/nodes/attr/href';
import { getDefaultRects } from '../../simulation/rects/data/default';
import { initSvgProperties, getSimulationElements } from '../../simulation/basic';

function initNodes() {
  window.spwashi.clearCachedNodes = () => {
    window.spwashi.setItem('nodes', []);
  };
  window.spwashi.getNodeImageHref = getNodeImageHref;
  window.spwashi.getNode = NODE_MANAGER.getNode;
  window.spwashi.nodes = [];
}

function initEdges() {
  window.spwashi.links = [];
}

function initRects() {
  window.spwashi.rects = getDefaultRects();
}

export function initSimulationRoot() {
  window.spwashi.reinit = () => console.log('reinit not yet defined');

  const { svg } = getSimulationElements();
  initSvgProperties(svg);

  initNodes();
  initEdges();
  initRects();

  window.spwashi.simulation = forceSimulation();

  import('../../simulation/reinit').then(({ reinit }) => {
    window.spwashi.reinit = reinit;
    reinit();
  });
}

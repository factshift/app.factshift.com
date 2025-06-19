import { NODE_MANAGER } from '../../simulation/nodes/nodes';
import { forceSimulation } from 'd3';
import { getNodeImageHref } from '../../simulation/nodes/attr/href';
import { getDefaultRects } from '../../simulation/rects/data/default';
import { initSvgProperties, getSimulationElements } from '../../simulation/basic';
import { registerData } from '../../simulation/data';

function initNodes() {
  window.spwashi.clearCachedNodes = () => {
    window.spwashi.setItem('nodes', []);
  };
  window.spwashi.getNodeImageHref = getNodeImageHref;
  window.spwashi.getNode = NODE_MANAGER.getNode;
  window.spwashi.nodes = [];
  const mode  = window.spwashi.parameters.mode;
  const phase = document.body?.dataset.phase || 'default';
  registerData('nodes', window.spwashi.nodes, { mode, phase });
}

function initEdges() {
  window.spwashi.links = [];
  const mode  = window.spwashi.parameters.mode;
  const phase = document.body?.dataset.phase || 'default';
  registerData('links', window.spwashi.links, { mode, phase });
}

function initRects() {
  window.spwashi.rects = getDefaultRects();
  const mode  = window.spwashi.parameters.mode;
  const phase = document.body?.dataset.phase || 'default';
  registerData('rects', window.spwashi.rects, { mode, phase });
}

export function initSimulationRoot() {
  window.spwashi.reinit = () => console.log('reinit not yet defined');

  const { svg } = getSimulationElements();
  initSvgProperties(svg);

  initNodes();
  initEdges();
  initRects();

  window.spwashi.simulation = forceSimulation();
  registerData('simulation', window.spwashi.simulation, {
    mode:  window.spwashi.parameters.mode,
    phase: document.body?.dataset.phase || 'default',
  });

  import('../../simulation/reinit').then(({ reinit }) => {
    window.spwashi.reinit = reinit;
    reinit();
  });
}

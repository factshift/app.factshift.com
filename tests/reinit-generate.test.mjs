import { JSDOM } from 'jsdom';
import { forceSimulation } from 'd3';
import { initParameters } from '../src/js/bootstrap/parameters/init.js';

const dom = new JSDOM(`<!DOCTYPE html><body><svg id="simulation"><g class="simulation-content"><g class="rects"></g><g class="edges"></g><g class="nodes"></g></g></svg><output id="output"></output></body>`);

// expose globals for D3
global.window = dom.window;
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;
global.navigator = { maxTouchPoints: 0 };

envSetup();

async function envSetup() {
  window.spwashi = {
    parameters: {},
    nodes: [],
    links: [],
    rects: [],
    callbacks: { acknowledgeLonging: () => {} },
    simulation: forceSimulation(),
    parameterKey: 'test'
  };
  initParameters();
  window.spwashi.values = { fx: [], fy: [], r: [], text: { fontSize: [] } };
  window.spwashi.getNodeImageHref = () => null;
  window.spwashi.setItem = () => {};
  window.spwashi.getItem = () => undefined;

  const { initSimulationRoot } = await import('../src/js/services/simulation/index.js');
  initSimulationRoot();
}

// Wait for simulation-ready event
await new Promise(resolve => document.addEventListener('simulation-ready', resolve));

const nodes = document.querySelectorAll('g.nodes g.wrapper');
if (nodes.length === 0) {
  throw new Error('expected nodes to be generated automatically');
}
if (window.spwashi.nodes.length === 0) {
  throw new Error('window.spwashi.nodes not populated');
}
console.log(`generated ${nodes.length} node wrappers in SVG`);

console.log('reinit generated default nodes');

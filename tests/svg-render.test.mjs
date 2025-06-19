import { JSDOM } from 'jsdom';
import { forceSimulation } from 'd3';
import { registerSlice } from '../src/js/simulation/data/registry.js';
import { initParameters } from '../src/js/bootstrap/parameters/init.js';

const dom = new JSDOM(`<!DOCTYPE html><body><svg id="simulation"><g class="simulation-content"><g class="rects"></g><g class="edges"></g><g class="nodes"></g></g></svg><output id="output"></output></body>`);

// expose globals for D3
global.window = dom.window;
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;
global.navigator = { maxTouchPoints: 0 };

window.spwashi = {
  parameters: {
    width: 200,
    height: 100,
    nodes: { radiusMultiplier: 10, count: 2 },
    forces: {},
    startPos: { x: 50, y: 50 },
    slice: ''
  },
  nodes: [ { id: 'n1', r: 5, x: 0, y: 0 }, { id: 'n2', r: 5, x: 10, y: 10 } ],
  links: [ { source: { id: 'n1' }, target: { id: 'n2' }, strength: 1 } ],
  rects: [],
  callbacks: { acknowledgeLonging: () => {} },
  simulation: forceSimulation(),
  parameterKey: 'test'
};

window.spwashi.values = { fx: [], fy: [], r: [], text: { fontSize: [] } };
window.spwashi.getNodeImageHref = () => null;

initParameters();

const storage = {};
window.spwashi.setItem = (k, v) => { storage[k] = v; };
window.spwashi.getItem = k => storage[k];

registerSlice('nodes', { initialData: window.spwashi.nodes });
registerSlice('links', { initialData: window.spwashi.links });
registerSlice('rects', { initialData: window.spwashi.rects });

const { wrapper } = (await import('../src/js/simulation/basic.js')).getSimulationElements();
const { NODE_MANAGER } = await import('../src/js/simulation/nodes/nodes.js');
const nodes = NODE_MANAGER.initNodes(window.spwashi.nodes);
NODE_MANAGER.updateNodes(wrapper, nodes);

const renderedNodes = document.querySelectorAll('g.nodes g.wrapper');
if (renderedNodes.length !== window.spwashi.nodes.length) {
  throw new Error(`expected ${window.spwashi.nodes.length} node wrappers, found ${renderedNodes.length}`);
}

console.log('SVG rendered nodes correctly');


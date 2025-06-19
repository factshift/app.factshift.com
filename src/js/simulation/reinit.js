// Node's ES module resolver requires explicit filenames in tests
import { initializeForces } from "./physics/index.js";
import { initSvgProperties, getSimulationElements } from "./basic.js";
import { debug } from "../services/logger.js";
import {
  updateSimulationLinks,
  updateSimulationNodes,
  updateSimulationRects,
} from "../ui/components/simulation/index.js";

// Dynamically import managers if needed
async function loadManagers() {
  const NODE_MANAGER = (await import('./nodes/nodes.js')).NODE_MANAGER;
  const EDGE_MANAGER = (await import('./edges/edges.js')).EDGE_MANAGER;
  const RECT_MANAGER = (await import('./rects/rects.js')).RECT_MANAGER;

  return { NODE_MANAGER, EDGE_MANAGER, RECT_MANAGER };
}

// Reinitialize the simulation
export async function reinit() {
  try {
    // Initialize SVG properties
    const simulationElements = getSimulationElements();
    initSvgProperties(simulationElements.svg);

    debug('[sim] reinitializing simulation');

    window.spwashi.counter = 0;

    // Dynamically load node, edge, and rect managers
    const { NODE_MANAGER, EDGE_MANAGER, RECT_MANAGER } = await loadManagers();

    // Generate a default set of nodes when none are present
    if (window.spwashi.nodes.length === 0) {
      const { generateNodes } = await import('./nodes/data/generate.js');
      generateNodes(window.spwashi.parameters.nodes.count);
    }

    debug('[sim] managers loaded');

    // Initialize nodes, edges, and rects
    const nodes = NODE_MANAGER.initNodes(window.spwashi.nodes);
    const edges = EDGE_MANAGER.initLinks(nodes);
    const rects = RECT_MANAGER.initRects(window.spwashi.rects);

    debug(`[sim] nodes:${nodes.length} edges:${edges.length} rects:${rects.length}`);

    const simulation = window.spwashi.simulation;
    // Clear any existing tick handlers and stop the previous run
    simulation.on('tick', null);
    simulation.stop();

    // Update simulation nodes
    simulation.nodes(nodes);

    // Initialize forces for the simulation
    initializeForces();

    // Restart the simulation with fresh alpha so forces take effect
    simulation.alpha(1).restart();

    // Define the tick function
    window.spwashi.tick = () => {
      simulation.tick(1);
      window.spwashi.internalTicker();
    };

    // Define the internal ticker
    window.spwashi.internalTicker = () => {
      window.spwashi.counter += 1;
      rects.forEach(d => d.calc(d)); // Update rects

      // Update edges, nodes, and rects via UI components
      updateSimulationLinks(edges);
      updateSimulationNodes(nodes);
      updateSimulationRects(rects);
    };

    // Attach the ticker to the simulation's 'tick' event
    simulation.on('tick', window.spwashi.internalTicker);

    // Kick off the first tick so that the SVG renders immediately
    window.spwashi.tick();

    // Update the output element with current parameters
    const outputElement = document.querySelector('#output');
    if (!outputElement) {
      window.spwashi.callbacks.acknowledgeLonging('wondering about output');
      return;
    }
    outputElement.innerHTML = JSON.stringify(window.spwashi.parameters, null, 2);

    debug('[sim] reinit complete');
    document.dispatchEvent(new CustomEvent('simulation-ready'));

  } catch (error) {
    console.error('Error during reinit:', error);
    window.spwashi.callbacks.acknowledgeLonging('Error during reinit');
  }
}

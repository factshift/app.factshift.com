import { initializeForces } from "./forces";
import { initSvgProperties, simulationElements } from "./basic";

// Dynamically import managers if needed
async function loadManagers() {
  const NODE_MANAGER = (await import('./nodes/nodes')).NODE_MANAGER;
  const EDGE_MANAGER = (await import('./edges/edges')).EDGE_MANAGER;
  const RECT_MANAGER = (await import('./rects/rects')).RECT_MANAGER;

  return { NODE_MANAGER, EDGE_MANAGER, RECT_MANAGER };
}

// Reinitialize the simulation
export async function reinit() {
  try {
    // Initialize SVG properties
    initSvgProperties(simulationElements.svg);

    window.spwashi.counter = 0;

    // Dynamically load node, edge, and rect managers
    const { NODE_MANAGER, EDGE_MANAGER, RECT_MANAGER } = await loadManagers();

    // Initialize nodes, edges, and rects
    const nodes = NODE_MANAGER.initNodes(window.spwashi.nodes);
    const edges = EDGE_MANAGER.initLinks(nodes);
    const rects = RECT_MANAGER.initRects(window.spwashi.rects);

    const simulation = window.spwashi.simulation;
    simulation.nodes(nodes);

    // Initialize forces for the simulation
    initializeForces();

    // Define the tick function
    window.spwashi.tick = () => {
      simulation.tick(1);
      window.spwashi.internalTicker();
    };

    // Define the internal ticker
    window.spwashi.internalTicker = () => {
      window.spwashi.counter += 1;
      rects.forEach(d => d.calc(d)); // Update rects

      // Update edges, nodes, and rects
      EDGE_MANAGER.updateLinks(simulationElements.wrapper, edges);
      NODE_MANAGER.updateNodes(simulationElements.wrapper, nodes);
      RECT_MANAGER.updateRects(simulationElements.wrapper, rects);
    };

    // Attach the ticker to the simulation's 'tick' event
    simulation.on('tick', window.spwashi.internalTicker);

    // Update the output element with current parameters
    const outputElement = document.querySelector('#output');
    if (!outputElement) {
      window.spwashi.callbacks.acknowledgeLonging('wondering about output');
      return;
    }
    outputElement.innerHTML = JSON.stringify(window.spwashi.parameters, null, 2);

  } catch (error) {
    console.error('Error during reinit:', error);
    window.spwashi.callbacks.acknowledgeLonging('Error during reinit');
  }
}

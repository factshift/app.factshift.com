import {NODE_MANAGER}                          from "./nodes/nodes";
import {forceSimulation}                       from "d3";
import {getNodeImageHref}                      from "./nodes/attr/href";
import {getDefaultRects}                       from "./rects/data/default";
import {initSvgProperties, getSimulationElements} from "./basic";

function initNodes() {
  window.spwashi.clearCachedNodes = () => {
    window.spwashi.setItem('nodes', []);
  }
  window.spwashi.getNodeImageHref = getNodeImageHref;
  window.spwashi.getNode          = NODE_MANAGER.getNode;
  window.spwashi.nodes            = [];
}

function initEdges() {
  window.spwashi.links = [];
}

function initRects() {
  window.spwashi.rects = getDefaultRects();
}

export function initSimulationRoot() {
  // default handler for refreshing the simulation
  window.spwashi.reinit = () => console.log('reinit not yet defined')

  // try to prevent FOUC
  const { svg } = getSimulationElements();
  initSvgProperties(svg);

  // initialize base simulation data
  initNodes();
  initEdges();
  initRects();

  // d3 force simulation
  window.spwashi.simulation = forceSimulation();

  // initialize simulation update
  import('./reinit')
    .then(({reinit}) => {
      window.spwashi.reinit = reinit;
      reinit();
    });

}
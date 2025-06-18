import {select} from "d3";
import { setCssVar } from "../services/style-state";

let simulationElements = null;

function initSvg() {
  const svg    = select("svg#simulation");
  const g      = svg.select('g.simulation-content');
  const edges  = g.select('g.edges');
  const nodes  = g.select('g.nodes');

  return {
    svg,
    wrapper:      g,
    edgesWrapper: edges,
    nodesWrapper: nodes,
  };
}

export function getSimulationElements() {
  if (!simulationElements) {
    simulationElements = initSvg();
  }
  return simulationElements;
}

export function initSvgProperties(svg) {
  const width  = window.spwashi.parameters.width;
  const height = window.spwashi.parameters.height;
  svg
    .attr('width', width)
    .attr('height', height)
    .attr("preserveAspectRatio", "xMinYMin meet");
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.documentElement.clientHeight;
  const offsetX = (pageWidth - width) / 2;
  const offsetY = (pageHeight - height) / 2;
  setCssVar('--page-margin-y', offsetY + 'px');
  setCssVar('--page-margin-x', offsetX + 'px');
}


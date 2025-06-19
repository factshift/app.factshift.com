import {drag, extent, zoom} from "d3";
import {forEachNode}        from "./nodes/data/operate.js";
import {logMainEvent}       from "./nodes/ui/circle.js";
import {selectNodesInRect}  from "./nodes/data/selectors/multiple.js";
import {getSimulationElements} from "./basic.js";

const nodeG_offset    = {x: 0, y: 0};
const nodeG_transform = {x: 0, y: 0};

export function initSvgEvents(svg) {
  const simulationElements = getSimulationElements();
  if (window.spwashi.parameters.canzoom) {
    svg
      .call(zoom()
              .on("zoom", (e, d) => {
                const factor                 = (e.transform.k - 1) * 10;
                window.spwashi.zoomTransform = {k: factor};
                if (e.sourceEvent.shiftKey) {
                  window.spwashi.parameters.forces._charge = window.spwashi.parameters.forces._charge || window.spwashi.parameters.forces.charge;
                  window.spwashi.parameters.forces.charge  = window.spwashi.parameters.forces._charge * factor;
                  window.spwashi.reinit();
                } else {
                  forEachNode(node => {
                    node.private._r = node.private._r || node.r
                    node.r          = node.private._r * e.transform.k;
                  })
                }
                svg.node().dispatchEvent(new CustomEvent('simulation-zoomed', {detail: {k: e.transform.k}}));
              })
      )
      .on("dblclick.zoom", null)
  } else if (window.spwashi.parameters.canpan) {
    svg
      .call(drag()
              .on('start', (e) => {
                svg.attr("cursor", "grabbing");
                nodeG_offset.x = e.x;
                nodeG_offset.y = e.y;
              })
              .on('drag', (e) => {
                const dx = nodeG_offset.x - e.x;
                const dy = nodeG_offset.y - e.y;

                nodeG_transform.x += dx / 10;
                nodeG_transform.y += dy / 10;

                simulationElements.nodesWrapper.attr("transform", `translate(${nodeG_transform.x}, ${nodeG_transform.y})`);
                simulationElements.edgesWrapper.attr("transform", `translate(${nodeG_transform.x}, ${nodeG_transform.y})`);
                svg.node().dispatchEvent(new CustomEvent('simulation-panned', {detail: {x: nodeG_transform.x, y: nodeG_transform.y}}));
              })
              .on('end', (e) => {
                svg.attr("cursor", "grab");
                nodeG_offset.x = e.x;
                nodeG_offset.y = e.y;
              })
      )
  } else {
    let rect = null;
    svg
      .on('mousedown', (e) => {
        rect = {x: e.offsetX, y: e.offsetY, calc: d => d, width: 1, height: 1};
        window.spwashi.rects.push(rect);
        logMainEvent('mousedown:' + e.y + ' ' + e.x);
      })
      .on('mousemove', (e) => {
        if (!rect) return 0;
        rect.width  = e.offsetX - rect.x;
        rect.height = e.offsetY - rect.y;
      })
      .on('mouseup', (e) => {
        const nodes      = selectNodesInRect(rect);
        const xRange     = extent(nodes, d => d.x);
        const xIncrement = (xRange[1] - xRange[0]) / nodes.length;
        const yRange     = extent(nodes, d => d.y);
        const yIncrement = (yRange[1] - yRange[0]) / nodes.length;
        logMainEvent(xRange + ' ' + yRange)
        nodes.forEach((node, i) => {
          node.fx     = xRange[0] + (xIncrement * i);
          node.fy     = yRange[0] + (yIncrement * i);
          node.charge = -1000;
        });
        window.spwashi.rects.splice(window.spwashi.rects.indexOf(rect), 1);
        window.spwashi.reinit();
        svg.node().dispatchEvent(new CustomEvent('simulation-selection', {detail: {nodes: nodes.map(n => n.id)}}));
        rect = null;
        logMainEvent('mouseup:' + e.y + ' ' + e.x);
      });
  }
}
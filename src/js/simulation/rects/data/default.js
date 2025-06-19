import { getSlice } from "../../data";
import { getCurrentQuery } from "../../../services/query-state";

export function getDefaultRects() {
  const rects = [
    {
      title: 'Counter',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.counter * 1
    },
    {
      title: 'Alpha',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.simulation.alpha() * (window.spwashi.parameters.width || 0)
    },
    {
      title: 'Alpha Decay',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.simulation.alphaDecay() * (window.spwashi.parameters.width || 0)
    },
    {
      title: 'Charge',
      x:     0,
      width: 0,
      calc:  d => {
        d.title = 'Charge: ' + window.spwashi.parameters.forces.charge;
        d.width = window.spwashi.parameters.forces.charge;
      }
    },
    {
      title: 'Velocity Decay',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.simulation.velocityDecay() * (window.spwashi.parameters.width || 0)
    },
    {
      title: 'Zoom',
      x:     0,
      width: 1,
      calc:  d => d.title = `Zoom: ${window.spwashi.zoomTransform?.k || 1}`
    },
    {
      title: 'Node Quantity',
      x:     0,
      width: 0,
      calc:  d => {
        let nodeCount = window.spwashi.nodes.length;
        d.title       = 'Node Count: ' + nodeCount;

        return d.width = nodeCount;
      }
    },
    {
      title: 'Node Queue Count',
      x:     0,
      width: 0,
      calc:  d => {
        const nodeCount = window.spwashi.parameters.nodes.count;

        d.title = 'Node Queue Count: ' + nodeCount;
        d.width = nodeCount;
      }
    },
  ].map((r, i) => {
    r.height = 20;
    r.y      = i * 20;
    return r;
  });
  const { mode, phase } = getCurrentQuery();
  const slice = getSlice('rects', { mode, phase });
  slice?.set(rects);
  return rects;
}
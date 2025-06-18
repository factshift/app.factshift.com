import {NODE_MANAGER} from "../../../simulation/nodes/nodes";
import {processNode}  from "../../../simulation/nodes/data/process";
import {pushNode}     from "../../../simulation/nodes/data/operate";

export const addHandler = {
  regex:   /^add=(-?\d+)/,
  handler: (sideEffects, value) => {
    const quantity = parseInt(value);
    const nodes    = [...Array(quantity)].map((n, i) => ({
      name: i + '',
      y:   .75 * window.spwashi.parameters.height,
      id:   `(${Date.now()})[${Math.random()}]`,
    }));
    pushNode(...nodes.map(NODE_MANAGER.normalize).map(processNode));
    sideEffects.nodesAdded.push(...nodes);
    sideEffects.physicsChange = true;
  }
};
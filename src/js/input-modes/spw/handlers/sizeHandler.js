import {scaleSequential} from "d3";
import {getAllNodes}     from "../../../simulation/nodes/data/selectors/multiple";

export const sizeHandler = {
  regex:   /^size=(\d+)/,
  handler: (sideEffects, value) => {
    const choice  = parseInt(value);
    const nodes   = getAllNodes();
    const options = [
      scaleSequential([0, nodes.length], t => (t + .2) * 30),
      scaleSequential([0, nodes.length], t => (t + .2) * 60),
      scaleSequential([0, nodes.length], t => (t + .2) * 90),
      scaleSequential([0, nodes.length], t => (t + .2) * 120),
    ];
    const scale   = options[choice % options.length];
    nodes.forEach((node, i) => {
      node.r = scale(i);
    });
    sideEffects.physicsChange = true;
  }
};
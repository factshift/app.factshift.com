import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";

export const fontSizeHandler = {
  regex:   /^fontSize=(\d+)/,
  handler: (sideEffects, value) => {
    const choice = parseInt(value);
    const nodes  = getAllNodes();
    nodes.forEach((node, i) => {
      node.text.fontSize = choice;
    });
    sideEffects.physicsChange = true;
  }
};
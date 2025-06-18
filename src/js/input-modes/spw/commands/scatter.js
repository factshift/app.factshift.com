import {forEachNode} from "../../../simulation/nodes/data/operate";

export function runScatterCommand(sideEffects) {
  forEachNode(node => {
    node.x = Math.random() * 1000;
    node.y = Math.random() * 1000;
  });
  sideEffects.physicsChange = true;
}
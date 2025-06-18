import {forEachNode} from "../../../simulation/nodes/data/operate";

export function runBaneCommand() {
  forEachNode(node => {
    node.stroke = 'grey';
  });
}
import {forEachNode} from "../../../simulation/nodes/data/operate";

export function runUnfreezeCommand() {
  forEachNode(node => {
    node.fx = node.fy = undefined;
  });
}
import {forEachNode} from "../../../simulation/nodes/data/operate";

export function clearFixedPositions() {
  forEachNode(node => {
    node.fx = undefined;
    node.fy = undefined;
  });
}
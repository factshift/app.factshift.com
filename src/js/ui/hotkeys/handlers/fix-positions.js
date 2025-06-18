import {forEachNode} from "../../../simulation/nodes/data/operate";

export function fixPositions() {
  forEachNode(node => {
    node.fx = node.x;
    node.fy = node.y;
  });
}
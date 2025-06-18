import {forEachNode} from "../../../simulation/nodes/data/operate";

export const collisionRadiusHandler = {
  regex:   /^cr=(\d+)/,
  handler: (sideEffects, value) => {
    forEachNode(node => node.collisionRadius = parseInt(value) * node.r);
    sideEffects.physicsChange = true;
  }
};
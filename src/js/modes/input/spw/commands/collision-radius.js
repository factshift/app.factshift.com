import {forEachNode} from "../../../simulation/nodes/data/operate";

export function runCollisionRadiusCommand(sideEffects) {
  const valueString = sideEffects.valueStrings[0];
  forEachNode(node => node.collisionRadius = parseInt(valueString));
  sideEffects.physicsChange = true;
}
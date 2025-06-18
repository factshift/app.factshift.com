import {removeAllLinks} from "../../../simulation/edges/data/set";

export function runUnlinkCommand(sideEffects) {
  removeAllLinks();
  sideEffects.physicsChange = true;
}
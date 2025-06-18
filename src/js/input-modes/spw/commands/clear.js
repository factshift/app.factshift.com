import {removeAllNodes} from "../../../simulation/nodes/data/set";
import {removeAllLinks} from "../../../simulation/edges/data/set";

export function runClearCommand() {
  removeAllNodes();
  removeAllLinks();
  window.spwashi.reinit();
}
import {removeNodeCount} from "../../../simulation/nodes/data/set";

export function lessNodes() {
  const amountToRemove = window.spwashi.parameters.nodes.count;
  removeNodeCount(amountToRemove);
 window.spwashi.reinit();
}
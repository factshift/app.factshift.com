import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";

export function runSortCommand(sideEffects) {
  getAllNodes().sort((a, b) => a.name.localeCompare(b.name));
}
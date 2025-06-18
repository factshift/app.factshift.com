import {filterNodes}      from "../../../simulation/nodes/data/set";
import {getSelectedNodes} from "../../../simulation/nodes/data/selectors/multiple";

export function runPruneCommand(sideEffects) {
  sideEffects.nodesImpacted = getSelectedNodes();
  sideEffects.physicsChange = true;
  sideEffects.handleNode    = node => {
    console.log('prune', node);
    filterNodes(d => d !== node)
  }
}
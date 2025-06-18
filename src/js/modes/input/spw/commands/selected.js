import {getSelectedNodes} from "../../../simulation/nodes/data/selectors/multiple";

export function runSelectedCommand(sideEffects) {
  const selected = getSelectedNodes().map(node => node.id).join('\n');
  sideEffects.valueStrings.push(selected);
  sideEffects.nextDocumentMode = 'spw';
}
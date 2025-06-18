import {mapNodes} from "../../../simulation/nodes/data/operate";

export function runAllCommand(sideEffects) {
  const all = mapNodes(node => node.id).join('\n');
  sideEffects.valueStrings.push(all);
  sideEffects.nextDocumentMode = 'spw';
}
export let CLICKED_NODES = [];

export function runClickedCommand(sideEffects) {
  {
    const clicked                = CLICKED_NODES.map(node => node.id).join('\n');
    sideEffects.nextDocumentMode = 'spw';
    sideEffects.valueStrings.push(clicked);
    CLICKED_NODES = [];
  }
}
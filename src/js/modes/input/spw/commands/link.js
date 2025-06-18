import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";
import {pushLink}    from "../../../simulation/edges/data/pushLink";

export function runLinkCommand(sideEffects) {
  const nodes = getAllNodes();
  nodes.forEach((node, i) => {
    const source = nodes[i];
    const target = nodes[(i + 1) % nodes.length];
    pushLink(window.spwashi.links, {source, target, strength: .1})
  });
  sideEffects.physicsChange = true;
}
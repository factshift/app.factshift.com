import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";

export function runArrangeCommand(sideEffects) {
  const nodes  = getAllNodes();
  const width  = window.spwashi.parameters.width;
  const height = window.spwashi.parameters.height;

  const columns = Math.floor(Math.sqrt(nodes.length));
  const rows    = Math.ceil(nodes.length / columns);

  nodes.forEach((node, i) => {
    node.x = ((i % columns) * width / columns) + (width / columns / 2);
    node.y  = Math.floor(i / columns) * height / rows;
  });
  sideEffects.nodesImpacted = nodes;
  sideEffects.physicsChange = true;
}
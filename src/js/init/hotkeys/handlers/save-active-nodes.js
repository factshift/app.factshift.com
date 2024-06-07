import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";
import {forEachNode} from "../../../simulation/nodes/data/operate";
import {NODE_MANAGER} from "../../../simulation/nodes/nodes";

export function saveActiveNodes() {
  const nodes = getAllNodes();
  forEachNode(NODE_MANAGER.cacheNode);
  window.spwashi.setItem('parameters.nodes-input', nodes);
  window.spwashi.setItem('parameters.nodes-input-map-fn-string', 'data => data');
  window.spwashi.refreshNodeInputs();

  console.log('ws://', {updates: nodes});
  window.spwashi.socket.send(JSON.stringify({
    route_id: window.location.pathname,
    user_id: 'user_id',
    updates: nodes.map(node => ({
      id: node.id,
      name: node.name,
      x: node.x,
      y: node.y,
    }))
  }));
}
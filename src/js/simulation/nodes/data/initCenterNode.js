import {pushNode} from "./operate.js";

const id = 'center';

let centerNode = null;

export function initCenterNode() {
  centerNode = centerNode || {
    identity:        id,
    r:               0,
    collisionRadius: 100,
    x:               window.spwashi.parameters.width / 2,
    y:               window.spwashi.parameters.height / 2,
  };

  pushNode(centerNode);
  return id;
}
import {initCenterNode} from "../../nodes/data/initCenterNode.js";
import {pushLink}       from "./pushLink.js";

export function linkToCenter(nodes) {
  const id = initCenterNode();
  window.spwashi.reinit();
  const links = [];
  for (let node of nodes) {
    const link = {
      source:   node.id,
      target:   window.spwashi.getNode(id).id,
      strength: 0.1
    };
    pushLink(links, link);
  }
  return links;
}
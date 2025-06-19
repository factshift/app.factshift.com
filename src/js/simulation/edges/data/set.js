import { getSlice } from "../../data";
import { getCurrentQuery } from "../../../services/query-state";

export function removeAllLinks() {
  window.spwashi.links.length = 0;
  const { mode, phase } = getCurrentQuery();
  const slice = getSlice('links', { mode, phase });
  slice?.clear();
}

export function removeNodeEdges(d) {
  window.spwashi.links = window.spwashi.links.filter(link => {
    return link.source !== d && link.target !== d;
  });
  const { mode, phase } = getCurrentQuery();
  const slice = getSlice('links', { mode, phase });
  slice?.set(window.spwashi.links);
}

export function removeObsoleteEdges(nodes) {
  window.spwashi.links = window.spwashi.links.filter(link => nodes.includes(link.source) && nodes.includes(link.target));
  const { mode, phase } = getCurrentQuery();
  const slice = getSlice('links', { mode, phase });
  slice?.set(window.spwashi.links);
}
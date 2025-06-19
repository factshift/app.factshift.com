import { registerData } from "../../data/registry";

export function removeAllLinks() {
  window.spwashi.links.length = 0;
  const mode  = window.spwashi?.parameters?.mode || 'default';
  const phase = document.body?.dataset?.phase || 'default';
  registerData('links', window.spwashi.links, { mode, phase });
}

export function removeNodeEdges(d) {
  window.spwashi.links = window.spwashi.links.filter(link => {
    return link.source !== d && link.target !== d;
  });
  const mode  = window.spwashi?.parameters?.mode || 'default';
  const phase = document.body?.dataset?.phase || 'default';
  registerData('links', window.spwashi.links, { mode, phase });
}

export function removeObsoleteEdges(nodes) {
  window.spwashi.links = window.spwashi.links.filter(link => nodes.includes(link.source) && nodes.includes(link.target));
  const mode  = window.spwashi?.parameters?.mode || 'default';
  const phase = document.body?.dataset?.phase || 'default';
  registerData('links', window.spwashi.links, { mode, phase });
}
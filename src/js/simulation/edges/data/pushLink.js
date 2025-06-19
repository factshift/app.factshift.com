import { getSlice } from "../../data";

export function pushLink(links, ...newLinks) {
  links.push(...newLinks);
  const mode  = window.spwashi?.parameters?.mode || 'default';
  const phase = document.body?.dataset?.phase || 'default';
  const slice = getSlice('links', { mode, phase });
  slice?.push(...newLinks);
  return links;
}
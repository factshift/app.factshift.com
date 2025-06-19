import { registerData } from "../../data/registry";

export function pushLink(links, ...newLinks) {
  links.push(...newLinks);
  const mode  = window.spwashi?.parameters?.mode || 'default';
  const phase = document.body?.dataset?.phase || 'default';
  registerData('links', links, { mode, phase });
  return links;
}
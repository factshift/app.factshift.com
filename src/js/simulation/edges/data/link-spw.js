import {pushLink} from "./pushLink.js";

export function linkBySpwParts(nodesFromSpw) {
  const links        = [];
  const linkStrength = window.spwashi.parameters.links.strength;
  let hasError       = false;
  for (let targetNode of nodesFromSpw) {
    if (!(targetNode.identity && targetNode.parts)) continue;

    const {head, body, tail} = targetNode.parts;

    const items = [head, body, tail].flat().map(i => i?.identity).filter(Boolean);
    items.forEach(item => {
      const source     = (typeof item === "string" ? item : item.identity);
      const toggle     = !!window.spwashi.parameters.perspective;
      const sourceNode = window.spwashi.getNode(
        source,
        toggle ? targetNode.colorindex : undefined
      );
      if (!sourceNode) {
        hasError = true;
        return;
      }

      let bondStrength = 1;

      switch (sourceNode.kind.trim()) {
        case 'operator + delimiter + essential.open':
        case 'operator + delimiter + essential.close':
          bondStrength = 5;
          break;
        case 'operator + delimiter + locational.open':
        case 'operator + delimiter + locational.close':
          bondStrength = 5;
          break;
        case 'operator + delimiter + conceptual.open':
        case 'operator + delimiter + conceptual.close':
          bondStrength = 5;
          break;
      }
      switch (targetNode.kind.trim()) {
        case 'phrasal':
          bondStrength = 7;

          break;
      }

      const strength = linkStrength * bondStrength;
      const link     = {
        source:   sourceNode.id,
        target:   targetNode.id,
        strength: strength
      };
      pushLink(links, link);
    })
  }
  if (hasError) {
    console.error(nodesFromSpw);
  }
  return links;
}
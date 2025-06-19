import {linkBySpwParts} from "./data/link-spw.js";
import {pushLink}       from "./data/pushLink.js";

function init(nodes) {
  return pushLink(window.spwashi.links, ...linkBySpwParts(nodes));
}

function update(g, links) {
  const u = g.select('.edges')
             .selectAll('line')
             .data(links)
             .join(
               enter => enter.append('line')
                             .attr('stroke-width', d => (d.strength || 1) * 13)
                             .attr('x1', d => d.source.x)
                             .attr('y1', d => d.source.y)
                             .attr('x2', d => d.target.x)
                             .attr('y2', d => d.target.y),
               update => update
                 .attr('x1', d => d.source.x)
                 .attr('stroke-width', d => (d.strength || 1) * 13)
                 .attr('data-colorindex', d => 'spwashi-stroke-' + d.colorindex)
                 .attr('y1', d => d.source.y)
                 .attr('x2', d => d.target.x)
                 .attr('y2', d => d.target.y),
               exit => exit.remove()
             )

}

export const EDGE_MANAGER = {
  initLinks:   init,
  updateLinks: update,
};
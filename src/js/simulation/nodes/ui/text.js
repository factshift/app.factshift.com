import {getNodeText}  from "../attr/colors";
import {logMainEvent} from "./circle";
import {drag}         from "d3";

export function makeText(g) {
  const a = g.append('a');
  a.attr('href', d => d.url || undefined);
  a.attr('target', d => '_blank');
  const text = a.append('text')
  text
    .attr('x', d => d.x)
    .attr('font-size', d => d.text.fontSize || d.r)
    .call(drag()
            .on('start', (e, d) => {
              d.text.fx = d.text.fx || 0;
              d.text.fy = d.text.fy || 0;
              logMainEvent('clicked: ' + d.id, JSON.stringify(d, null, 3));
            })
            .on('drag', (e, d) => {
              d.fx = e.x;
              d.fy = e.y;
              // d.text.fx += e.dx;
              // d.text.fy += e.dy;
            })
            .on('end', (e, d) => {

            }))

  text.selectAll('tspan')
      .data(d => getNodeText(d)?.split('\n').map((line, i) => ({node: d, i: i, text: line})))
      .join(
        enter => enter
          .append('tspan')
          .attr('text-anchor', 'middle')
          .attr('dy', d => d.node.r * 2).attr('dx', 0),
        update =>
          update
            .selectAll('tspan')
            .text(d => d.text)
        ,
        d => d.selectAll('tspan').remove()
      )
  ;
  return g;
}

export function updateNodeTextSvg(g) {
  const a = g.select('a');
  a.attr('href', d => d.url || undefined);
  const text = a.select('text');
  text
    .attr('x', d => (d.x || 0) + (d.text.fx || 0))
    .attr('y', d => (d.y || 0) + (d.text.fy || 0) - (getNodeText(d)?.split('\n').length * d.r) / 2)
    .attr('font-size', d => d.text.fontSize || d.r)
    .selectAll('tspan')
    .data(d => getNodeText(d)?.split('\n').map((line, i) => ({node: d, i: i, text: line})))
    .text(d => (d.text))
    .attr('fill', d => d.node.text.color || 'var(--text-color)')
    .attr('x', d => (d.node.x || 0) + (d.node.text.fx || 0))
  ;
  return g;
}

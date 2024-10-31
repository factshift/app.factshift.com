import { getNodeText } from "../attr/colors";
import { logMainEvent } from "./circle";
import { drag } from "d3";

// Event handler for dragging text
function onTextDrag(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

// Event handler for starting drag
function onTextDragStart(event, d) {
    d.text.fx = d.text.fx || 0;
    d.text.fy = d.text.fy || 0;
    logMainEvent('clicked: ' + d.id, JSON.stringify(d, null, 3));
}

// Function to create text elements and add drag interactions
export function makeText(g) {
    const a = g.append('a')
        .attr('href', d => d.url || undefined)
        .attr('target', d => '_blank');

    const text = a.append('text')
        .attr('x', d => d.x)
        .attr('font-size', d => d.text.fontSize || d.r)
        .call(drag()
            .on('start', onTextDragStart)
            .on('drag', onTextDrag)
            .on('end', () => {}));

    text.selectAll('tspan')
        .data(d => getNodeText(d)?.split('\n').map((line, i) => ({ node: d, i, text: line })))
        .join(
            enter => enter.append('tspan')
                .attr('text-anchor', 'middle')
                .attr('dy', d => d.node.r * 2)
                .attr('dx', 0)
                .text(d => d.text),
            update => update
                .selectAll('tspan')
                .text(d => d.text),
            exit => exit.remove()
        );

    return g;
}

// Function to update text elements and tspan content
export function updateNodeTextSvg(g) {
    const a = g.select('a')
        .attr('href', d => d.url || undefined);

    const text = a.select('text')
        .attr('x', d => (d.x || 0) + (d.text.fx || 0))
        .attr('y', d => (d.y || 0) + (d.text.fy || 0) - (getNodeText(d)?.split('\n').length * d.r) / 2)
        .attr('font-size', d => d.text.fontSize || d.r);

    text.selectAll('tspan')
        .data(d => getNodeText(d)?.split('\n').map((line, i) => ({ node: d, i, text: line })))
        .join(
            enter => enter.append('tspan')
                .attr('text-anchor', 'middle')
                .attr('dy', d => d.node.r * 2)
                .attr('dx', 0)
                .text(d => d.text),
            update => update.text(d => d.text),
            exit => exit.remove()
        )
        .attr('fill', d => d.node.text.color || 'var(--text-color)')
        .attr('x', d => (d.node.x || 0) + (d.node.text.fx || 0));

    return g;
}

import { cacheNode } from "../data/store";
import { getNodeStrokeColor } from "../attr/colors";
import { drag } from "d3";

// Helper function to handle dragging nodes
function onDrag(event, d) {
  d.image.offsetX += event.dx;
  d.image.offsetY += event.dy;
}

// Helper function to handle the end of drag interactions
function onDragEnd(event, d) {
  cacheNode(d);
}

// Helper function to handle clicks based on the superpower
function onNodeClick(event, d) {
  if (event.defaultPrevented) return;
  let intent = window.spwashi.superpower.intent;
  if (event.shiftKey) {
    intent *= -1;
  }

  switch (window.spwashi.superpower.name) {
    case 'grow':
      d.image.r = d.image.r || d.r;
      d.image.r += intent;
      break;
    case 'shrink':
      d.image.r = d.image.r || d.r;
      d.image.r -= intent;
      break;
    case 'colorindex':
      if (isNaN(d.colorindex)) d.colorindex = 1;
      d.colorindex += intent;
      break;
  }
  cacheNode(d);
}

// Main function to create an image node with interactions
export function makeImage(g) {
  const rect = g.append('rect')
      .attr('width', d => window.spwashi.getNodeImageHref(d) ? d.image.r || d.r : 0)
      .attr('height', d => window.spwashi.getNodeImageHref(d) ? d.image.r || d.r : 0)
      .attr('x', d => d.x + d.image.offsetX - d.image.r / 2)
      .attr('y', d => d.y + d.image.offsetY - d.image.r / 2);

  const image = g.append('image')
      .attr('href', window.spwashi.getNodeImageHref)
      .attr('width', d => d.image.r || d.r)
      .attr('height', d => d.image.r || d.r)
      .attr('preserveAspectRatio', 'xMidYMin slice')
      .attr('x', d => d.x + d.image.offsetX)
      .attr('y', d => d.y + d.image.offsetY)
      .attr('stroke', getNodeStrokeColor)
      .attr('stroke-width', 2)
      .call(drag()
          .on('start', () => {})
          .on('drag', onDrag)
          .on('end', onDragEnd)
      )
      .on('error', (event, d) => {
        d.image.href = null;
        d.image.r = 0;
      })
      .on('click', onNodeClick);

  return g;
}

// Function to update the node's image attributes
export function updateNodeImage(image) {
  image.select('rect')
      .attr('stroke', 'black')
      .attr('x', d => d.x + d.image.offsetX - d.image.r / 2)
      .attr('y', d => d.y + d.image.offsetY - d.image.r / 2)
      .attr('width', d => window.spwashi.getNodeImageHref(d) ? d.image.r : 0)
      .attr('height', d => window.spwashi.getNodeImageHref(d) ? d.image.r : 0);

  image.select('image')
      .attr('href', window.spwashi.getNodeImageHref)
      .attr('width', d => d.image.r)
      .attr('height', d => d.image.r)
      .attr('x', d => d.x + d.image.offsetX - d.image.r / 2)
      .attr('y', d => d.y + d.image.offsetY - d.image.r / 2);
}

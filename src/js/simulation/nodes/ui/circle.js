// simulation/nodes/ui/circle.js

import { cacheNode } from "../data/store";
import { drag } from "d3";
import { CLICKED_NODES } from "../../../modes/spw/commands/clicked";
import { removeNodeEdges } from "../../edges/data/set";
import { sortNodes } from "../data/sort";
import { getAllNodes } from "../data/selectors/multiple";

// Utility function to handle superpower-related actions
function handleSuperpowerAction(d, intent) {
  switch (window.spwashi.superpower.name) {
    case 'hyperlink': {
      const url = d.url || d.getUrl?.();
      d.url = url;
      if (url) logMainEvent('hyperlink: ' + url);
      break;
    }
    case 'prune': {
      window.spwashi.nodes.splice(window.spwashi.nodes.indexOf(d), 1);
      removeNodeEdges(d);
      window.spwashi.reinit();
      break;
    }
    case 'alert': {
      if (!d.md5) return;
      navigator.clipboard.writeText(d.md5).then(() => alert(d.md5));
      break;
    }
    case 'grow': {
      d.r += intent;
      break;
    }
    case 'shrink': {
      d.r -= intent;
      break;
    }
    case 'colorindex': {
      d.color = undefined;
      if (isNaN(d.colorindex)) d.colorindex = 1;
      d.colorindex += intent;
      break;
    }
    case 'z': {
      d.z = d.z || 0;
      d.z += intent;
      sortNodes(getAllNodes());
      break;
    }
  }
}

// Logs events in the UI
export function logMainEvent(event, details) {
  const mainLog = document.querySelector('#main-log');
  const eventsLog = mainLog.querySelector('.events-log');
  if (!eventsLog) return;

  const listItem = document.createElement('li');
  eventsLog.appendChild(listItem);

  const detailsEl = document.createElement('details');
  listItem.appendChild(detailsEl);

  const summary = document.createElement('summary');
  detailsEl.appendChild(summary);
  summary.innerText = event;

  if (details) {
    const pre = document.createElement('pre');
    pre.innerText = details;
    detailsEl.appendChild(pre);
  }
}

// Handles node click and keydown events
function handleNodeInteraction(e, d) {
  CLICKED_NODES.push(d);
  logMainEvent('clicked: ' + d.id, JSON.stringify(d, null, 3));
  d.callbacks?.click?.(e, d);

  if (e.defaultPrevented) return;

  let intent = window.spwashi.superpower.intent;

  if (e.key === 'x') {
    d.fx = isNaN(d.fx) ? d.x : d.fx;
    return;
  }
  if (e.key === 'y') {
    d.fy = isNaN(d.fy) ? d.y : d.fy;
    return;
  }
  if (e.shiftKey) {
    d.fx = d.fy = undefined;
    return;
  }
  if (e.key && e.key !== ' ') return;
  if (e.shiftKey) intent *= -1;

  handleSuperpowerAction(d, intent);
  cacheNode(d);
}

export function makeCircle(g) {
  return g
      .append('circle')
      .attr('data-colorindex', d => 'spwashi-datum-' + d.colorindex)
      .attr('r', d => d.r || 1)
      .attr('fill', d => d.color || undefined)
      .attr('cx', d => d.x || 0)
      .attr('cy', d => d.y || 0)
      .call(
          drag()
              .on('start', (e, node) => {
                node.x = e.x;
                node.y = e.y;
                node.ondrag = node.callbacks.ondrag || (() => {});
              })
              .on('drag', (e, node) => {
                node.fx = e.x;
                node.fy = e.y;
                node.ondrag(e, node);
              })
              .on('end', (e, node) => {
                window.spwashi.tick();
                delete node.ondrag;
                cacheNode(node);
              })
      )
      .on('click', handleNodeInteraction)
      .on('keydown', handleNodeInteraction);
}

export function updateCircle(update) {
  update
      .select('circle')
      .attr('stroke', d => d.stroke)
      .attr('stroke-width', d => d.strokeWidth || 5)
      .attr('fill', d => d.color || undefined)
      .attr('data-colorindex', d => !d.color ? 'spwashi-datum-' + (d.colorindex % 13) : undefined)
      .attr('cx', d => d.x || 0)
      .attr('r', d => d.r || 1)
      .attr('cy', d => d.y || 0);
}

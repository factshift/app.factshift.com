import {cacheNode} from "./store";
import {sortNodes} from "./nodes";

export function logMainEvent(event, details) {
  const eventsElement = document.querySelector('#main-log ul.events-log');
  const listItem      = document.createElement('li');
  eventsElement.appendChild(listItem);
  const detailsEl = document.createElement('details');
  listItem.appendChild(detailsEl)
  const summary = document.createElement('summary');
  detailsEl.appendChild(summary);
  summary.innerText = event;
  if (details) {
    const pre     = document.createElement('pre');
    pre.innerText = details;
    detailsEl.appendChild(pre);
  }
}

export function makeCircle(g) {
  const onclick = (e, d) => {
    logMainEvent('clicked: ' + d.id, JSON.stringify(d, null, 3));
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

    if (e.shiftKey) {
      intent *= -1;
    }

    switch (window.spwashi.superpower.name) {
      case 'hyperlink':
        const url = d.getUrl?.();
        if (!url) break;
        logMainEvent('hyperlink: ' + url)
        window.open(url, '_blank');
        break
      case 'prune':
        window.spwashi.nodes.splice(window.spwashi.nodes.indexOf(d), 1);
        window.spwashi.links = window.spwashi.links.filter(link => {
          return link.source !== d && link.target !== d;
        });
        window.spwashi.reinit();
        break;
      case 'alert':
        if (!d.md5) return;
        navigator.clipboard.writeText(d.md5).then(e => {
          alert(d.md5);
        });
        break;
      case 'grow': {
        d.r += intent;
        break;
      }
      case 'shrink': {
        d.r -= intent;
        break;
      }
      case 'changecolor': {
        if (isNaN(d.colorindex)) d.colorindex = 1;
        d.colorindex += intent;
        break;
      }
      case 'z': {
        d.z = d.z || 0;
        d.z += intent;
        sortNodes(ACTIVE_NODES);
        break;
      }
    }
    cacheNode(d);
  }

  return g
    .append('circle')
    .attr('data-colorindex', d => 'spwashi-datum-' + d.colorindex)
    .attr('r', d => (d.r || 1))
    .attr('cx', d => d.x || 0)
    .attr('cy', d => d.y || 0)
    .call(
      d3
        .drag()
        .on('start', (e, node) => {
          node.x = e.x;
          node.y = e.y;
        })
        .on('drag', (e, node) => {
          node.fx = e.x;
          node.fy = e.y;
        })
        .on('end', (e, node) => {
          window.spwashi.tick();
          cacheNode(node);
        })
    )
    .on('click', onclick)
    .on('keydown', (e, d) => {
      onclick(e, d)
    });
}

export function updateCircle(update) {
  update
    .select('circle')
    .attr('data-colorindex', d => 'spwashi-datum-' + (d.colorindex % 13))
    .attr('cx', d => d.x || 0)
    .attr('r', d => (d.r || 1))
    .attr('cy', d => d.y || 0)
}

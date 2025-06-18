import {NODE_MANAGER}          from "../../simulation/nodes/nodes";
import {setDocumentMode}       from "../index";
import {removeAllNodes}        from "../../simulation/nodes/data/set";
import {forEachNode, pushNode} from "../../simulation/nodes/data/operate";
import {processNode}           from "../../simulation/nodes/data/process";
import {getAllNodes}           from "../../simulation/nodes/data/selectors/multiple";

export function duplicateNode(d) {
  return {
    identity:   d.identity,
    name:       d.name,
    x:          d.x,
    y:          d.y,
    fx:         d.fx,
    fy:         d.fy,
    r:          d.r,
    id:         d.id,
    image:      d.image.href ? d.image : undefined,
    md5:        d.md5,
    colorindex: d.colorindex
  };
}

export function processRawInputAsJson(input) {
  let data;
  try {
    data = JSON.parse(input);
  } catch (e) {
    return null;
  }
  if (!Array.isArray(data)) {
    if (data.nodes && Array.isArray(data.nodes)) {
      return {
        nodes: data.nodes,
        links: data.links || [],
      };
    }
    console.error('not nodes');
    return {
      nodes: [],
      links: []
    };
  }
  return {
    nodes: data || [],
    links: [],
  };
}

export function initializeDirectMode() {
  window.spwashi.refreshNodeInputs = (nodes) => {
    const nodesInputElement = document.querySelector('#nodes-input');
    if (!nodesInputElement) {
      window.spwashi.callbacks.acknowledgeLonging('wondering about nodes input');
      return;
    }
    const nodesInputText    = window.spwashi.getItem('parameters.nodes-input') || [];
    nodesInputElement.value = JSON.stringify(nodesInputText);
  };
  window.spwashi.readNodeInputs    = () => {
    const input = document.querySelector('#nodes-input')?.value;
    if (!input) {
      window.spwashi.setItem('parameters.nodes-input', null);
      console.log('no input')
      return {
        nodes: [],
        links: [],
      };
    }
    const data = processRawInputAsJson(input);
    if (!data) {
      return {nodes: [], links: []};
    }
    return data
  }
  window.spwashi.refreshNodeInputs();
  pushNode(...window.spwashi.readNodeInputs().nodes.filter(NODE_MANAGER.filterNode));
  forEachNode(processNode);
  window.spwashi.reinit();

  const nodesInput = document.querySelector('#nodes-input');
  if (!nodesInput) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about nodes input');
    return;
  }

  // select all on focus
  nodesInput.onfocus = () => nodesInput.select();

  const _readNodeInputs = (append = true) => {
    const nodes = window.spwashi.readNodeInputs().nodes;
    if (!append) {
      removeAllNodes();
      window.spwashi.reinit();
    }
    pushNode(...nodes);
    window.spwashi.reinit();
    setDocumentMode('');
  }

  document.querySelector('#controls button.read-nodes').onclick = () => _readNodeInputs(true);

  document.querySelector('#node-input-container button.add').onclick = () => _readNodeInputs(true);

  document.querySelector('#node-input-container button.replace').onclick = () => _readNodeInputs(false);

  document.querySelector('#controls button.save-nodes').onclick = () => {
    const nodes = getAllNodes();
    nodes.map(NODE_MANAGER.cacheNode)
    window.spwashi.setItem('parameters.nodes-input', nodes);
    window.spwashi.refreshNodeInputs();
  }

  document.querySelector('#controls button.clear-saved-nodes').onclick = () => {
    const nodes = getAllNodes();
    nodes.map(node => {
      const id = node.id;
      for (let prop in node) {
        delete node[prop];
      }
      node.id = id;
      NODE_MANAGER.cacheNode(node);
    });
    nodes.length = 0;
    window.spwashi.reinit();
    setDocumentMode('');
  }
}
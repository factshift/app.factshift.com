import {setDocumentMode} from "../index";
import {removeAllNodes} from "../../../simulation/nodes/data/set";
import {mapNodes, pushNode} from "../../../simulation/nodes/data/operate";
import {selectOppositeNodes} from "../../../simulation/nodes/data/selectors/multiple";
import {removeObsoleteEdges} from "../../../simulation/edges/data/set";

function hardResetNodes(nodes) {
  removeAllNodes();
  pushNode(...nodes);
  removeObsoleteEdges(nodes);
  window.spwashi.reinit();
}

const mapFunctions = {
  random: d => { d.r = (Math.random() * 30) + (Math.random() * 50); return d; },
  increase: d => { d.r += 10; return d; },
  identity: d => d,
};

const filterFunctions = {
  nominal: d => d.kind === 'nominal',
  all: () => true,
};

export function initializeMapFilterMode() {
  const mapKey = 'map-nodes-option';
  const filterKey = 'filter-nodes-option';

  const storedMap = window.spwashi.getItem(mapKey) || 'random';
  const storedFilter = window.spwashi.getItem(filterKey) || 'nominal';

  const mapRadio = document.querySelector(`input[name="map-option"][value="${storedMap}"]`);
  if (mapRadio) mapRadio.checked = true;
  const filterRadio = document.querySelector(`input[name="filter-option"][value="${storedFilter}"]`);
  if (filterRadio) filterRadio.checked = true;

  window.spwashi.callbacks.onMapMode = () => {
    const mapModeContainer = document.querySelector('#map-mode-container');
    mapModeContainer.tabIndex = 0;
    mapModeContainer.focus();
  };

  window.spwashi.callbacks.onFilterMode = () => {
    const filterModeContainer = document.querySelector('#filter-mode-container');
    filterModeContainer.tabIndex = 0;
    filterModeContainer.focus();
  };

  const mapSubmit = document.querySelector('#submit-node-mapper');
  mapSubmit.onclick = () => {
    const selected = document.querySelector('input[name="map-option"]:checked')?.value || 'identity';
    const mapFn = mapFunctions[selected] || mapFunctions.identity;
    const nodes = mapNodes(mapFn);
    hardResetNodes(nodes);
    window.spwashi.setItem(mapKey, selected);
    setDocumentMode('');
  };

  const filterSubmit = document.querySelector('#submit-node-filter');
  filterSubmit.onclick = () => {
    const selected = document.querySelector('input[name="filter-option"]:checked')?.value || 'all';
    const filterFn = filterFunctions[selected] || filterFunctions.all;
    const nodes = selectOppositeNodes(filterFn);
    hardResetNodes(nodes);
    window.spwashi.setItem(filterKey, selected);
    setDocumentMode('');
  };
}

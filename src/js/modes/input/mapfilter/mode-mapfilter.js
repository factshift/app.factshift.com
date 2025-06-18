import ace, {createEditSession} from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import {setDocumentMode}        from "../index";
import {removeAllNodes}         from "../../simulation/nodes/data/set";
import {mapNodes, pushNode}     from "../../simulation/nodes/data/operate";
import {selectOppositeNodes}    from "../../simulation/nodes/data/selectors/multiple";
import {removeObsoleteEdges}    from "../../simulation/edges/data/set";

function hardResetNodes(nodes) {
  removeAllNodes();
  pushNode(...nodes);
  removeObsoleteEdges(nodes);
  window.spwashi.reinit();
}

function initMapEditor() {
  const nodeMapper = document.querySelector('#node-mapper');
  if (!nodeMapper) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about node mapper');
    return;
  }
  return ace.edit('node-mapper');
}

export function initializeMapFilterMode() {
  const mapEditor = initMapEditor();
  if (!mapEditor) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about map editor');
    return;
  }
  const mapKey   = 'map-nodes-fn';
  const mapValue = window.spwashi.getItem(mapKey) || `d => {
  d.r = (Math.random() * 30) + (Math.random() * 50);
  return d;
}`;
  mapEditor.setSession(createEditSession(mapValue, 'ace/mode/javascript'));
  window.spwashi.callbacks.onMapMode = () => {
    const mapModeContainer    = document.querySelector('#map-mode-container');
    mapModeContainer.tabIndex = 0;
    mapModeContainer.focus();
  }

  const filterEditor = ace.edit('node-filter');
  const filterKey    = 'filter-nodes-fn';
  const filterValue  = window.spwashi.getItem(filterKey) || `d => d.kind === 'nominal'`;
  filterEditor.setSession(createEditSession(filterValue, 'ace/mode/javascript'));
  window.spwashi.callbacks.onFilterMode = () => {
    const filterModeContainer    = document.querySelector('#filter-mode-container');
    filterModeContainer.tabIndex = 0;
    filterModeContainer.focus();
  }


  [filterEditor, mapEditor].forEach((editor) => {
    editor.setOptions({useWorker: false})
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/javascript');
    // ignore tab key
    editor.commands.bindKey('Tab', null);
  })

  const mapSubmit   = document.querySelector('#submit-node-mapper');
  mapSubmit.onclick = submitMapper;

  const filterSubmit   = document.querySelector('#submit-node-filter');
  filterSubmit.onclick = submitFilter;

  function submitMapper() {
    const mapFnString = mapEditor.getValue();
    const mapFunction = mapFnString ? eval(mapFnString) : d => d;
    const nodes       = mapNodes(mapFunction);
    hardResetNodes(nodes);
    window.spwashi.setItem(mapKey, mapFnString);
    setDocumentMode('')
  }

  function submitFilter() {
    const filterFnString = filterEditor.getValue();
    const fn             = filterFnString ? eval(filterFnString) : d => true;

    const nodes = selectOppositeNodes(fn);

    hardResetNodes(nodes);
    window.spwashi.setItem(filterKey, filterFnString);
    setDocumentMode('')
  }
}
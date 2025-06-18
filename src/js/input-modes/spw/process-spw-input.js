import {initPageImage, setPageImage} from "../../ui/components/page-image";
import {processLine}                 from "./process-line";
import {processNode}                 from "../../simulation/nodes/data/process";
import {NODE_MANAGER}                from "../../simulation/nodes/nodes";
import {forEachNode}                 from "../../simulation/nodes/data/operate";

export function initSpwParseField() {
  const value    = window.spwashi.getItem('parameters.spw-parse-field') || '';
  const spwInput = document.querySelector('#spw-parse-field');
  if (!spwInput) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about spw input')
    return;
  }
  spwInput.value = value;
  // listen for image paste events
  spwInput.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob     = item.getAsFile();
        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
          const srcData = fileLoadedEvent.target.result; // <--- data: base64
          const img     = setPageImage(srcData);
        };
        fileReader.readAsDataURL(blob);
        initPageImage();
      }
    }
  });
  return spwInput;
}


export function processSpwInput(inputValue) {
  const sideEffects = {
    physicsChange:    false,
    nextDocumentMode: '',

    liveStrings:  [],
    valueStrings: [],

    nodesSelected: [],
    nodesAdded:    [],
    nodesImpacted: [],
    nodesIgnored:  [],

    handleNode: node => {
    }
  }

  const nodeIdCacheObj = {};
  forEachNode(node => {
    node.stroke   = undefined;
    node.selected = false;

    nodeIdCacheObj[node.id] = node;
  });
  const textLines = Array.isArray(inputValue) ? inputValue : inputValue.split('\n');

  textLines.map(line => {
    if (nodeIdCacheObj[line]) {
      sideEffects.nodesIgnored.push(nodeIdCacheObj[line]);
      return;
    }
    processLine(line, sideEffects);
  });

  window.spwashi.selectedNodes = [];
  sideEffects.nodesSelected.forEach(node => {
    node.selected    = true;
    node.stroke      = 'var(--accent-color-main)';
    node.strokeWidth = 10;
    node.r           = 40;
    window.spwashi.selectedNodes.push(node);
  })
  sideEffects.nodesAdded.forEach(node => {
    NODE_MANAGER.normalize(node);
    processNode(node);
  });
  sideEffects.nodesIgnored.forEach(node => {
    node.stroke      = 'gray';
    node.strokeWidth = 5;
  });
  sideEffects.nodesImpacted.forEach(node => {
    sideEffects.handleNode(node);
  });

  if (sideEffects.physicsChange) {
    window.spwashi.reinit();
  }

  return {
    nextDocumentMode: sideEffects.nextDocumentMode,
    liveStrings:      sideEffects.liveStrings,
    valueStrings:     sideEffects.valueStrings,
  };
}
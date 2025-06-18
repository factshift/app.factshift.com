import {initFocalSquare} from "../../ui/components/focal-point";

export function initDocumentMousedown() {
  document.body.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.target.tagName === 'CIRCLE') return;
    if (document.body.dataset.interfaceDepth !== 'standard') return;
    initFocalSquare();
  }, true);
}
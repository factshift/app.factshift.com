import {setDocumentMode}                                                   from "../index";
import {initializeStorySequence}                                           from "../story/mode-story";
import {getDataIndexForNumber, getDocumentDataIndex, setDocumentDataIndex} from "./util";

export function initializeDataindexMode() {
  const colorContainer   = document.querySelector('#colors');
  if (!colorContainer) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about color container');
    return;
  }
  colorContainer.onclick = function (e) {
    const target = e.target;
    const color  = target.dataset.dataindex;
    setDocumentDataIndex(color);
    setDocumentMode(null);
  }
}

export function onColorModeStart() {
  initializeStorySequence(true);
  document.querySelector(`#colors button[data-dataindex=${getDataIndexForNumber(getDocumentDataIndex())}]`).focus();

  const buttons    = document.querySelectorAll('#colors button');
  const buttonsByX = {};
  const buttonsByY = {};
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect();
    const x    = Math.round(rect.x);
    const y    = Math.round(rect.y);
    if (!buttonsByX[x]) {
      buttonsByX[x] = [];
    }
    if (!buttonsByY[y]) {
      buttonsByY[y] = [];
    }
    buttonsByX[x].push(button);
    buttonsByY[y].push(button);
  });

  const sortedButtonsByX = Object.keys(buttonsByX).sort((a, b) => a - b).map((x, i) => {
    const group = buttonsByX[x];
    group.forEach(button => button.dataset.x = i);
    return group;
  });
  const sortedButtonsByY = Object.keys(buttonsByY).sort((a, b) => a - b).map((y, i) => {
    const group = buttonsByY[y];
    group.forEach(button => button.dataset.y = i);
    return group;
  });

  window.spwashi.callbacks.arrowUp    = () => {
    const column    = parseInt(document.activeElement.dataset.x);
    const colGroup  = sortedButtonsByX[column];
    const index     = colGroup.indexOf(document.activeElement);
    const nextIndex = index ? index - 1 : colGroup.length - 1;
    colGroup[nextIndex].focus();
  };
  window.spwashi.callbacks.arrowDown  = () => {
    const column    = parseInt(document.activeElement.dataset.x);
    const colGroup  = sortedButtonsByX[column];
    const index     = colGroup.indexOf(document.activeElement);
    const nextIndex = index === colGroup.length - 1 ? 0 : index + 1;
    colGroup[nextIndex].focus();
  };
  window.spwashi.callbacks.arrowRight = () => {
    const row       = parseInt(document.activeElement.dataset.y);
    const rowGroup  = sortedButtonsByY[row];
    const index     = rowGroup.indexOf(document.activeElement);
    const nextIndex = index === rowGroup.length - 1 ? 0 : index + 1;
    rowGroup[nextIndex].focus();
  };
  window.spwashi.callbacks.arrowLeft  = () => {
    const row       = parseInt(document.activeElement.dataset.y);
    const rowGroup  = sortedButtonsByY[row];
    const index     = rowGroup.indexOf(document.activeElement);
    const nextIndex = index ? index - 1 : rowGroup.length - 1;
    rowGroup[nextIndex].focus();
  };
}
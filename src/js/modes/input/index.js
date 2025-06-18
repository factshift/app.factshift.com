export const getDocumentMode = () => {
  return window.spwashi.parameters.mode;
}
export const setDocumentMode = (mode, doToggle = true, direct = false) => {
  if (doToggle && getDocumentMode() === mode) mode = null;
  window.spwashi.parameters.mode = mode;
  document.body.dataset.mode     = mode;
  window.spwashi.onModeChange(mode, direct);
};

export function initializeModeSelection(starterMode) {
  const menu     = document.querySelector('#mainmenu-shortcuts ol');
  if (!menu) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about menu')
    return;
  }
  menu.innerHTML = '';
  window.spwashi.modeOrder.forEach((mode) => {
    const li                    = document.createElement('li');
    li.dataset.modeAction       = mode;
    li.dataset.interfaceElement = 'main-menu';
    const button                = document.createElement('button');
    button.id                   = `mode-selector--${mode}`;
    button.innerText            = mode;
    li.appendChild(button);
    menu.appendChild(li);
  });

  window.spwashi.modeOrder.forEach((mode) => {
    const button   = document.querySelector(`#mode-selector--${mode}`);
    button.onclick = () => {
      setDocumentMode(getDocumentMode() === mode ? null : mode);
    }
  });

  setDocumentMode(starterMode)
}


export {getDataIndexForNumber} from "./dataindex/util";
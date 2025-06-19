import {setDocumentMode}    from "../../modes/input";
import { initHotkeyButtons } from "../components/hotkey-buttons";
import {processPastedText}  from "./handlers/pasted-text";

function initKeystrokeHandlers(options) {
  window.spwashi.keystrokeOptions = options;
}


export function initKeystrokes() {
  window.spwashi.keystrokeRevealOrder = window.spwashi.keystrokeRevealOrder || 0;
  window.spwashi.keystrokeOptions = window.spwashi.keystrokeOptions || [];

  function plainKeyHandler(key, e) {
    const shortKeyEntries = window.spwashi.modeOrder.map((reflex, i) => [i + 1, () => setDocumentMode(reflex, true, true)]);
    const shortKeys       = Object.fromEntries(shortKeyEntries);

    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (key === '/') {
      e.preventDefault();
      const h1 = document.querySelector('h1');
      h1.click();
      return;
    }
    if (shortKeys[key]) {
      e && e.preventDefault();
      shortKeys[key]();
      return;
    }
    if (key === ' ') {
      // generateNodes(e.shiftKey ? window.spwashi.parameters.nodes.count : 1);
    }
    switch (key) {
      case 'ArrowRight':
        window.spwashi.callbacks.arrowRight();
        break;
      case 'ArrowLeft':
        window.spwashi.callbacks.arrowLeft();
        break;
      case 'ArrowUp':
        window.spwashi.callbacks.arrowUp();
        break;
      case 'ArrowDown':
        window.spwashi.callbacks.arrowDown();
        break;
    }
  }

  document.addEventListener('paste', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.target.tagName === 'TEXTAREA') return;
    const clipboardData = e.clipboardData || window.clipboardData;
    const clipboardText = clipboardData.getData('Text');
    return processPastedText(clipboardText);
  });
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'Escape') {
      const el = document.querySelector('#mode-container :is(:focus)');
      setDocumentMode('');
    }

    if (e.shiftKey) return;

    if (e.metaKey || e.ctrlKey) {
      for (let option of window.spwashi.keystrokeOptions) {
        if (key === option.shortcut) {
          e.preventDefault();
          option.callback();
        }
      }
      return;
    }

    plainKeyHandler(key, e);
  });

  import('./keystrokes')
    .then(({initialKeyStrokeOptions}) => {
      window.spwashi.keystrokeOptions = initialKeyStrokeOptions;
      initHotkeyButtons();
      initKeystrokeHandlers(initialKeyStrokeOptions);
    })
}

import {processSpwInput}        from "../input-modes/spw/process-spw-input";
import {setDocumentMode} from "../input-modes";
import {parse}           from "../vendor/spw/parser/parse.mjs";
import {getIdentityPath} from "../simulation/nodes/data/process";
import md5                      from "md5";
import {processPastedText}      from "../ui/hotkeys/handlers/pasted-text";
import {getNextUrlSearchParams} from "../util/next-url";
import { registerComponent } from "../component-registry";

function getHeaderSideEffects(input, sideEffects = {}) {
  const text                                          = input.value;
  const {liveStrings, nextDocumentMode, valueStrings} = processSpwInput(text);
  if (nextDocumentMode === 'spw') {
    sideEffects.doFocusH1After     = false;
    sideEffects.href               = null;
    window.spwashi.spwEditor.value = (valueStrings.join('\n'));
    setDocumentMode('spw', false, true);
    return;
  }

  const processedInput = valueStrings.join('\n');
  if (!processedInput) return;
  const parsed = JSON.parse(JSON.stringify(parse(processedInput)));
  const params = getNextUrlSearchParams();

  const identity = parsed.identity || text.trim();

  sideEffects.href = getIdentityPath(md5(identity), identity, params);

  return sideEffects;
}

function initMainWonderButton(fillH1) {
  let mainWonderButton = document.querySelector('#main-wonder-button');
  if (!mainWonderButton) {
    const target     = {
      click: () => {
        fillH1()
      }
    };
    const handler    = {
      get: (target, prop) => {
        if (prop === 'onclick') {
          return target.click;
        }
        return target[prop];
      }
    };
    mainWonderButton = new Proxy(target, handler)
  }
  mainWonderButton.onclick = (e) => {
    e.stopPropagation()
    fillH1();
  }

  return mainWonderButton;
}

export function initH1() {
  const h1                 = document.querySelector('h1');
  const currentText        = h1.innerText;
  const md5Element         = document.querySelector('#title-md5');
  const currentLiteralHash = md5(currentText);
  if (!md5Element) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about md5 element')
    return;
  }
  md5Element.innerText = `${currentLiteralHash}`.slice(0, 8);
  md5Element.href      = getIdentityPath(currentLiteralHash, currentText);

  const changeTitleButton = initMainWonderButton(fillH1);

  h1.tabIndex = 0;
  h1.onclick  = (e) => {
    if (e.target !== h1) return;
    e.stopPropagation()
    fillH1()
  }
  h1.onkeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c') {
        navigator.clipboard.writeText(currentText);
      }
      if (e.key === 'v') {
        const input = fillH1();
        input.focus();
        input.select();
      }
      return;
    }
    if (e.key === 'Shift') return;
    if (e.target !== h1) return;
    if (e.key === 'Tab') return;
    if (e.key === ' ') {
      e.preventDefault()
    }
    if (e.key.match(/\d/)) return;
    changeTitleButton.click();
  }

  let temporaryDocumentClickHandler;

  function resetH1(focus = true) {
    document.removeEventListener('click', temporaryDocumentClickHandler);
    h1.innerText = currentText;
    focus && h1.focus();
  }

  function fillH1() {
    const form         = document.createElement('form');
    const input        = document.createElement('input');
    input.onpaste      = (e) => {
      const text   = e.clipboardData.getData('text/plain');
      const result = processPastedText(text);
      if (result) {
        e.preventDefault();
        return
      }
    }
    input.value        = currentText;
    input.id           = 'h1-input';
    input.autocomplete = 'off';
    form.appendChild(input);
    const submit     = document.createElement('button');
    submit.type      = 'submit';
    submit.innerText = 'submit';

    const sideEffects = {
      doFocusH1After: true,
      href:           null
    };

    form.appendChild(submit);
    h1.innerHTML = '';
    h1.appendChild(form);
    input.focus();
    input.setSelectionRange(0, input.value.length);
    submit.onclick = (e) => {
      e.preventDefault();
      getHeaderSideEffects(input, sideEffects);
      if (sideEffects.href) {
        window.location.href = sideEffects.href;
      }
      resetH1(sideEffects.doFocusH1After)
    }

    temporaryDocumentClickHandler = e => {
      const target = e.target;
      if (h1.contains(target)) return;
      resetH1(sideEffects.doFocusH1After);
    };
    submit.onblur                 = () => { resetH1(sideEffects.doFocusH1After); };

    document.addEventListener('click', temporaryDocumentClickHandler)
    return input;
  }
}

registerComponent('h1', { init: initH1 });

import { initSimulationRoot } from "../services/simulation";
import {initCallbacks}      from "./callbacks/initCallbacks";
import {initListeners}      from "./listeners/initListeners";
import {pushHelpTopics}     from "../modes/input/spw/commands/help";
import {setDocumentMode}    from "../modes/input";
import {processSpwInput}    from "../modes/input/spw/process-spw-input";
import { loadCssVars }      from "../services/style-state";

export function initRoot() {
  initSimulationRoot();
  initRootSession();
  loadCssVars(['--page-margin-y','--page-margin-x','--focal-x','--focal-y']);
  initCallbacks();
  initListeners();
  window.spwashi.counter   = 0;
  window.spwashi.modeOrder = [
    'reflex',
    'color',
    'map',
    'filter',
    'node',
    'query',
    'debug',
    'story',
    'spw',
  ];

  window.spwashi.selectedNodes = [];
  window.spwashi.soundsEnabled = false;
  window.spwashi.sounds        = {};
  window.spwashi.playSound     = sound => {
    if (window.spwashi.soundsEnabled) {
      const getSound = window.spwashi.sounds[sound];
      if (!getSound) return;
      const audio = getSound();
      audio.play();
    }
  }

  switch (window.location.pathname) {
    case '/demo':
      setTimeout(() => {
        processSpwInput([
                          'bonk',
                          'add=3',
                          'bonk',
                          'add=50',
                          'bonk',
                          'add=10',
                          'bonk',
                          'unfix',
                          'r=10',
                          'group',
                          'bane',
                          'no center',
                          // 'charge=-100',
                          'vd=.9',
                          // 'this is a thought',
                          'minimalism',
                        ].join('\n')
                         .trim())
      }, 100)
      break;
    case '/help':
      pushHelpTopics();
      window.spwashi.spwEditor.value = window.spwashi.getItem('help', 'focal.root') || '';
      setDocumentMode('spw', false, true);
      break;
  }
}

function initRootSession() {
  window.spwashi.__session = window.spwashi.__session || {i: 0};
  window.spwashi.setItem   = (key, item, category = null) => {
    try {
      window.localStorage.setItem(getItemKey(key, category), JSON.stringify(item || null));
    } catch (e) {
      console.error({e, item});
    }
  }
  window.spwashi.getItem   = (key, category = null) => {
    const out = window.localStorage.getItem(getItemKey(key, category))
    if (out) return JSON.parse(out || '{}')
    return undefined;
  }
}

function getItemKey(key, category = null) {
  if (!category) {
    category = window.spwashi.parameterKey
  }

  return category + '@' + key;
}
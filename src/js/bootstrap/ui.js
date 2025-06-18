import {initializeDirectMode}              from "../modes/direct/mode-direct";
import {initializeQuerystringMode}         from "../modes/querystring/mode-querystring";
import {initializeReflexMode}              from "../modes/reflex/mode-reflex";
import {initializeStoryMode}               from "../modes/story/mode-story";
import {initializeModeSelection}           from "../modes";
import {initializeDataindexMode}           from "../modes/dataindex/mode-dataindex";
import {initKeystrokes}                    from "./hotkeys/_";
import {initializeForceSimulationControls} from "../ui/components/simulation-controls";
import {initializeSpwParseField}           from "../modes/spw/mode-spw";
import {initEnableSoundsButton}            from "../ui/components/enable-sounds-button";


export function initUi(mode) {
  initKeystrokes();

  initializeModeSelection(mode);
  initializeSpwParseField();
  initializeReflexMode();
  initializeDirectMode();

  initializeQuerystringMode();
  initializeDataindexMode();
  initializeForceSimulationControls();
  initializeStoryMode();

  initEnableSoundsButton();


  import("../modes/mapfilter/mode-mapfilter")
    .then(({initializeMapFilterMode}) => {
      initializeMapFilterMode();
    })
}

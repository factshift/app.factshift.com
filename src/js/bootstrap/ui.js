import {initializeDirectMode}              from "../modes/input/direct/mode-direct";
import {initializeQuerystringMode}         from "../modes/input/querystring/mode-querystring";
import {initializeReflexMode}              from "../modes/input/reflex/mode-reflex";
import {initializeStoryMode}               from "../modes/input/story/mode-story";
import {initializeModeSelection}           from "../modes/input";
import {initializeDataindexMode}           from "../modes/input/dataindex/mode-dataindex";
import {initKeystrokes}                    from "../ui/hotkeys/_";
import {initializeSpwParseField}           from "../modes/input/spw/mode-spw";
import '../ui/components/query-param-docs.js';


export function initUi(mode) {
  initKeystrokes();

  initializeModeSelection(mode);
  initializeSpwParseField();
  initializeReflexMode();
  initializeDirectMode();

  initializeQuerystringMode();
  initializeDataindexMode();
  initializeStoryMode();

  import("../modes/input/mapfilter/mode-mapfilter")
    .then(({initializeMapFilterMode}) => {
      initializeMapFilterMode();
    })
}

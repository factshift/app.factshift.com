import {setDocumentMode} from "../../../input-modes";

export function mode(searchParameters) {
  let mode;
  if (searchParameters.has('mode')) {
    mode = searchParameters.get('mode');
    setTimeout(() => setDocumentMode(mode, false), 500)
  }
  window.spwashi.initialMode = mode || window.spwashi.initialMode;
  return ['mode', mode];
}
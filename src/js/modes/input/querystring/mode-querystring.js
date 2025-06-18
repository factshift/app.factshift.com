import {loadParameters} from "../../../bootstrap/parameters/read";

export function initializeQuerystringMode() {
  const element     = document.querySelector('#query-parameters .value');
  if (!element) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about querystring element')
    return;
  }
  const text        = [...new URLSearchParams(window.location.search)].map(entry => entry.join('=')).join('\n');
  element.innerHTML = text;
  element.rows      = text.split('\n').length + 1;
  const button      = document.querySelector('#query-parameters button.go');
  button.onclick    = (e) => {
    const searchParams = new URLSearchParams(element.value.split('\n').map(line => line.split('=')))
    loadParameters(searchParams);
    if (e.shiftKey) {
      window.location = '?' + searchParams;
    }
  }
}
import { registerComponent } from "../component-registry";
import { parameterList } from "../../bootstrap/parameters/_";
import { registeredParamNames } from "../../services/query-params";

export function initQueryParamDocs() {
  const container = document.querySelector('#query-param-docs');
  if (!container) {
    window.spwashi?.callbacks?.acknowledgeLonging?.('wondering about query param docs container');
    return;
  }
  const list = container.querySelector('ul') || container.appendChild(document.createElement('ul'));
  list.innerHTML = '';

  const names = new Set();
  parameterList.forEach(fn => {
    if (typeof fn === 'function' && fn.name) {
      names.add(fn.name);
    }
  });
  registeredParamNames().forEach(name => names.add(name));

  [...names].sort().forEach(name => {
    const li = document.createElement('li');
    li.innerHTML = `<kbd>?${name}</kbd>`;
    list.appendChild(li);
  });
}

registerComponent('query-param-docs', { init: initQueryParamDocs });

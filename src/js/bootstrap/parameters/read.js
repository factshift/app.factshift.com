import {parameterList} from "./_";

export function loadParameters(searchParameters) {
  window.spwashi.featuredIdentity = /\/identity\/([a-zA-Z\d]+)/.exec(window.location.href)?.[1] || searchParameters.get('identity');
  window.spwashi.parameterKey     = `spwashi.parameters#${window.spwashi.featuredIdentity}`;
  parameterList.forEach(fn => fn(searchParameters));
}
import { parameterList } from "./_";
import { applyQueryParams } from "../../services/query-params";

export function loadParameters(searchParameters) {
  window.spwashi.featuredIdentity = /\/identity\/([a-zA-Z\d]+)/.exec(window.location.href)?.[1] || searchParameters.get('identity');
  window.spwashi.parameterKey     = `spwashi.parameters#${window.spwashi.featuredIdentity}`;
  parameterList.forEach(fn => fn(searchParameters));
  applyQueryParams(searchParameters);
}

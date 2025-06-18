import {getNextUrlSearchParams} from "../../../util/next-url";

function getNextHref(nextParams) {
  const href = window.location.href.split('?')[0];
  return `${href}?${nextParams.toString()}`;
}

export function resetInterface() {
  window.localStorage.clear();
  const nextParams     = getNextUrlSearchParams();
  window.location.href = getNextHref(nextParams);
}
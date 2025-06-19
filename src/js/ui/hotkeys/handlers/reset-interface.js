import { getNextUrlSearchParams } from "../../../util/next-url";
import { clearAll } from "../../../services/storage.js";

function getNextHref(nextParams) {
  const href = window.location.href.split('?')[0];
  return `${href}?${nextParams.toString()}`;
}

export function resetInterface() {
  clearAll();
  const nextParams     = getNextUrlSearchParams();
  window.location.href = getNextHref(nextParams);
}
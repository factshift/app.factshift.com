import { getSlice } from "../../data";
import { getCurrentQuery } from "../../../services/query-state";

export function pushLink(links, ...newLinks) {
  links.push(...newLinks);
  const { mode, phase } = getCurrentQuery();
  const slice = getSlice('links', { mode, phase });
  slice?.push(...newLinks);
  return links;
}
import {loadParameters} from "../../../../bootstrap/parameters/read";

export function runDisplayNodesCommand() {
  {
    const urlParams = new URLSearchParams()
    urlParams.set('display', 'nodes');
    loadParameters(urlParams);
  }
}
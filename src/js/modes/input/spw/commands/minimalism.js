import {toggleInterfaceDepthOptions} from "../../../util/toggle-interface-depth";

export function runMinimalismCommand() {
  {
    window.spwashi.minimalism = true;
    toggleInterfaceDepthOptions();
    document.body.dataset.displaymode = 'nodes';
    return;
  }
}
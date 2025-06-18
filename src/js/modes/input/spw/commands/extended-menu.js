import {initKeystrokes} from "../../../ui/hotkeys/_";

export const extendMenu = `extended menu`.trim();

export function runMoreMenuOptionsCommand() {
  {
    window.spwashi.keystrokeRevealOrder = 1;
    initKeystrokes();
  }
}
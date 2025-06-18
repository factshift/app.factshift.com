import {MAIN_MENU_OPTION, MINIMALISM_OPTION, STANDARD_OPTION, toggleInterfaceDepthOptions} from "../../../util/toggle-interface-depth";

export function toggleMainMenu() {
  toggleInterfaceDepthOptions([
                                MAIN_MENU_OPTION,
                                !window.spwashi.minimalism ? STANDARD_OPTION : MINIMALISM_OPTION
                              ]);
}
import {HOTKEY_OPTION, MINIMALISM_OPTION, STANDARD_OPTION, toggleInterfaceDepthOptions} from "../../../util/toggle-interface-depth";

export function toggleHotkeyMenu() {
  toggleInterfaceDepthOptions([
                                HOTKEY_OPTION,
                                !window.spwashi.minimalism ? STANDARD_OPTION : MINIMALISM_OPTION
                              ]);

}

import { runDisableSoundsCommand, runEnableSoundsCommand } from "../input-modes/spw/commands/sounds";
import { registerComponent } from "../component-registry";

export function initEnableSoundsButton() {
  const enableSoundsButton = document.querySelector('.enable-sounds');
  if (!enableSoundsButton) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about enable sounds button');
    return;
  }
  const disableSoundsButton = document.querySelector('.disable-sounds');
  enableSoundsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    runEnableSoundsCommand();
  });
  disableSoundsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    runDisableSoundsCommand();
  });
}

registerComponent('enable-sounds-button', {
  init: initEnableSoundsButton
});


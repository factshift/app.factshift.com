import {toggleHotkeyMenu} from "../ui/hotkeys/handlers/toggle-hotkey-menu";

export function initHotkeyButtons() {
  const keystrokeOptions     = document.querySelector('#keystroke-options');
  if (!keystrokeOptions) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about keystroke options')
    return;
  }
  keystrokeOptions.innerHTML = '';
  const hotkeyMenuToggle     = document.querySelector('#hotkey-menu-toggle');
  hotkeyMenuToggle.onclick   = e => {
    toggleHotkeyMenu();
  }
  const optionList           = keystrokeOptions.appendChild(document.createElement('UL'));
  window.spwashi.keystrokeOptions
        .filter(option => option.revealOrder <= window.spwashi.keystrokeRevealOrder)
        .forEach(({shortcut, categories = [], title, callback, shortcutName}) => {
          const handler = () => {
            callback();
          };
          const li      = optionList.appendChild(document.createElement('LI'));
          if (!title) return;
          const ctg        = li.appendChild(document.createElement('SPAN'));
          ctg.className    = 'ctg';
          ctg.innerHTML    = categories.map(c => `<span>[${c}]</span>`).join('');
          const button     = li.appendChild(document.createElement('BUTTON'));
          button.onclick   = handler;
          button.innerHTML = title;
          const kbd        = li.appendChild(document.createElement('KBD'));
          kbd.innerHTML    = `ctrl + <strong>${shortcutName || shortcut}</strong>`;
        });
}
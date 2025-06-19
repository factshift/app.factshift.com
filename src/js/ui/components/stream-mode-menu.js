import { registerComponent } from "../component-registry";
import { STREAM_MODES } from "../../app/features.js";

export function initStreamModeMenu() {
  const container = document.querySelector('#debug-mode-container');
  if (!container) return;

  const fieldset = document.createElement('fieldset');
  const options = STREAM_MODES.map(m => `<option value="${m}">${m}</option>`).join('');
  fieldset.innerHTML = `
    <legend>Stream Mode</legend>
    <label>
      <select name="stream-mode">${options}</select>
    </label>
  `;
  container.appendChild(fieldset);

  const select = fieldset.querySelector('select[name="stream-mode"]');
  select.value = window.spwashi.streamMode || STREAM_MODES[0];
  select.addEventListener('change', () => {
    window.spwashi.streamMode = select.value;
    document.dispatchEvent(new CustomEvent('stream-mode-change', { detail: { mode: select.value } }));
  });

  window.spwashi.streamMode = select.value;
}

registerComponent('stream-mode-menu', { init: initStreamModeMenu });

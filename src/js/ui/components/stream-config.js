import { registerComponent } from "../component-registry";

export function initStreamConfig() {
  const container = document.querySelector('#debug-mode-container');
  if (!container) return;

  const fieldset = document.createElement('fieldset');
  fieldset.innerHTML = `
    <legend>Stream Config</legend>
    <label><input type="radio" name="stream-strategy" value="static" checked>Static</label>
    <label><input type="radio" name="stream-strategy" value="live">Live</label>
  `;
  container.appendChild(fieldset);

  const radios = fieldset.querySelectorAll('input[name="stream-strategy"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        window.spwashi.streamStrategy = radio.value;
        document.dispatchEvent(new CustomEvent('stream-strategy-change', { detail: { strategy: radio.value } }));
      }
    });
  });

  window.spwashi.streamStrategy = 'static';
}

registerComponent('stream-config', { init: initStreamConfig });


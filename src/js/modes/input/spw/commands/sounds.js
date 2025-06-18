function handleSoundEnabler(e) {
  if (['BUTTON', 'A'].includes(e.target.tagName)) return;
  window.spwashi.playSound('bonk');
}

export function runEnableSoundsCommand() {
  document.body.dataset.sounds = 'on';
  window.spwashi.soundsEnabled = true;
  window.spwashi.sounds        = {
    bonk: () => new Audio(' /assets/sounds/bonk.mp3'),
  };
  document.addEventListener('click', handleSoundEnabler);
}

export function runDisableSoundsCommand() {
  document.body.dataset.sounds = 'off';
  window.spwashi.soundsEnabled = false;
  window.spwashi.sounds        = {}
  document.removeEventListener('click', handleSoundEnabler);
}

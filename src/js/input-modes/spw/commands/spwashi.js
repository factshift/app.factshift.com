export function runSpwashiCommand(sideEffects) {
  window.location.href = '/_spwashi@';
  sideEffects.valueStrings.push(...[
    'https://spwashi.com',
    'https://lore.land',
    'https://boon.land',
    'https://bane.land',
    'https://bone.land',
    'https://bonk.land',
    'https://honk.land',
    'https://boof.land',
    'https://factshift.com',
  ]);
  sideEffects.nextDocumentMode = 'spw';
}
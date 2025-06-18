export function runTitleCommand(sideEffects) {
  const pageHeader             = document.querySelector('title').innerText;
  sideEffects.nextDocumentMode = 'spw';
  sideEffects.valueStrings.push(`${pageHeader}`);
}
export function runDefaultCommand(sideEffects, text) {
  sideEffects.valueStrings.push(text)
  sideEffects.liveStrings.push(text);
}
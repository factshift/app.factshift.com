export function runNoCenterCommand() {
  window.spwashi.parameters.forces.centerStrength = 0;
  window.spwashi.reinit();
}
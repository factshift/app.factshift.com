export function bonkVelocityDecay() {
  window.spwashi.parameters.forces.velocityDecay = window.spwashi.parameters.forces.velocityDecay === 0.1 ? 0.9 : 0.1;
  window.spwashi.reinit();
}
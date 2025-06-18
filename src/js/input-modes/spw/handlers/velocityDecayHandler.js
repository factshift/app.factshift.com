export const velocityDecayHandler = {
  regex:   /^vd=(-?\d*\.?\d+)/,
  handler: (sideEffects, value) => {
    window.spwashi.parameters.forces.velocityDecay = parseFloat(value);
    sideEffects.physicsChange                      = true;
  }
};
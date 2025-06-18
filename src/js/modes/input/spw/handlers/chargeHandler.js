export const chargeHandler = {
  regex:   /^charge=(-?\d+)/,
  handler: (sideEffects, value) => {
    window.spwashi.parameters.forces.charge = parseInt(value);
    sideEffects.physicsChange               = true;
  }
};
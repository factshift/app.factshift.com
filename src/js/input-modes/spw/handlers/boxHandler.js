export const boxHandler = {
  regex:   /^box=(-?\d+)/,
  handler: (sideEffects, value) => {
    window.spwashi.parameters.forces.boundingBox = !!parseInt(value);
    sideEffects.physicsChange                    = true;
  }
};
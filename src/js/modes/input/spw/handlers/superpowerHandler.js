export const superpowerHandler = {
  regex:   /^!(.+)/,
  handler: (sideEffects, value) => {
    window.spwashi.superpower = {name: value, intent: 1};
    sideEffects.physicsChange = true;
  }
};
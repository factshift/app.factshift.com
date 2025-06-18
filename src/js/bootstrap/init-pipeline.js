const initSteps = [];

export function addInitStep(name, fn) {
  initSteps.push({ name, fn });
}

export function addInitSteps(steps) {
  if (!steps) return;
  if (Array.isArray(steps)) {
    steps.forEach(([name, fn]) => addInitStep(name, fn));
  } else {
    Object.entries(steps).forEach(([name, fn]) => addInitStep(name, fn));
  }
}

export async function runInitPipeline() {
  for (const { fn } of initSteps) {
    await fn();
  }
}

export function clearInitPipeline() {
  initSteps.length = 0;
}

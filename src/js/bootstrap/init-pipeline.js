const initSteps = [];

export function addInitStep(step) {
  if (!step) return;
  const { id, init, priority = 0, dependsOn = [] } = step;
  if (!id || typeof init !== 'function') {
    throw new Error('init step requires {id, init}');
  }
  initSteps.push({ id, init, priority, dependsOn });
}

export function addInitSteps(steps) {
  if (!steps) return;
  if (Array.isArray(steps)) {
    steps.forEach(step => {
      if (Array.isArray(step)) {
        const [id, init] = step;
        addInitStep({ id, init });
      } else {
        addInitStep(step);
      }
    });
  } else {
    Object.entries(steps).forEach(([id, init]) => addInitStep({ id, init }));
  }
}

export async function runInitPipeline() {
  const stepsMap = new Map(initSteps.map(s => [s.id, s]));
  const sorted = [...initSteps].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  const ordered = [];
  const added = new Set();

  function addStep(step) {
    if (added.has(step.id)) return;
    (step.dependsOn || []).forEach(dep => {
      const depStep = stepsMap.get(dep);
      if (depStep) addStep(depStep);
    });
    if (!added.has(step.id)) {
      ordered.push(step);
      added.add(step.id);
    }
  }

  sorted.forEach(addStep);

  for (const { init } of ordered) {
    await init();
  }
}

export function clearInitPipeline() {
  initSteps.length = 0;
}

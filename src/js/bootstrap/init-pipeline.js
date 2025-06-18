const initSteps = [];
const map = new Map();

export function addInitStep(step) {
  if (!step) return;
  const { id, init, priority = 0, dependsOn = [] } = step;
  if (!id || typeof init !== 'function') {
    throw new Error('init step requires {id, init}');
  }
  if (map.has(id)) {
    throw new Error(`init step with id "${id}" already exists`);
  }
  const entry = { id, init, priority, dependsOn };
  map.set(id, entry);
  initSteps.push(entry);
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

export function sortSteps(steps) {
  const stepsMap = new Map(steps.map(s => [s.id, s]));
  const ordered = [];
  const visited = new Set();
  const visiting = new Set();
  const path = [];

  function visit(step) {
    if (visited.has(step.id)) return;
    if (visiting.has(step.id)) {
      const cycleStart = path.indexOf(step.id);
      const cyclePath = path.slice(cycleStart).concat(step.id).join(' -> ');
      throw new Error(`circular dependency detected: ${cyclePath}`);
    }
    visiting.add(step.id);
    path.push(step.id);
    (step.dependsOn || []).forEach(dep => {
      const depStep = stepsMap.get(dep);
      if (depStep) visit(depStep);
    });
    visiting.delete(step.id);
    path.pop();
    visited.add(step.id);
    ordered.push(step);
  }

  const sorted = [...steps].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  sorted.forEach(visit);
  return ordered;
}

export async function runInitPipeline() {
  const ordered = sortSteps(initSteps);
  for (const { init } of ordered) {
    await init();
  }
}

export function clearInitPipeline() {
  initSteps.length = 0;
  map.clear();
}

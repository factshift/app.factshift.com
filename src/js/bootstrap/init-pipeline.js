export const InitPhase = {
  BOOT: 'boot',
  UI: 'ui',
  REFRESH: 'refresh',
  DEFERRED: 'deferred',
};

const initSteps = [];
const map = new Map();

export function addInitStep(step) {
  if (!step) return;
  const { id, init, priority = 0, phase, dependsOn = [] } = step;
  if (!id || typeof init !== 'function') {
    throw new Error('init step requires {id, init}');
  }
  if (map.has(id)) {
    throw new Error(`init step with id "${id}" already exists`);
  }
  const entry = { id, init, priority, phase, dependsOn };
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
  const phaseOrder = [InitPhase.BOOT, InitPhase.UI, InitPhase.REFRESH, InitPhase.DEFERRED];
  const phaseRank = phase => {
    const idx = phaseOrder.indexOf(phase);
    return idx === -1 ? phaseOrder.length : idx;
  };
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
      const depId = typeof dep === 'string' ? dep : dep.id;
      const depStep = stepsMap.get(depId);
      if (depStep) visit(depStep);
    });
    visiting.delete(step.id);
    path.pop();
    visited.add(step.id);
    ordered.push(step);
  }

  const sorted = [...steps].sort((a, b) => {
    const phaseDiff = phaseRank(a.phase) - phaseRank(b.phase);
    if (phaseDiff !== 0) return phaseDiff;
    return (a.priority ?? 0) - (b.priority ?? 0);
  });
  sorted.forEach(visit);
  return ordered;
}

export async function runInitPipeline() {
  const ordered = sortSteps(initSteps);
  for (const { init, phase } of ordered) {
    if (phase && document.body) {
      document.body.dataset.phase = phase;
    }
    await init();
  }
  if (document.body) {
    document.body.dataset.phase = 'ready';
  }
}

export function clearInitPipeline() {
  initSteps.length = 0;
  map.clear();
}

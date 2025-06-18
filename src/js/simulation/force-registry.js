// Central registry for D3 forces used by the simulation.
// Each force entry stores a factory function, an enabled flag and
// arbitrary options that may be updated at runtime.

const registry = new Map();

export function registerForce(name, factory, { enabled = true, options = {} } = {}) {
  registry.set(name, { factory, enabled, options });
}

export function enableForce(name) {
  const entry = registry.get(name);
  if (entry) entry.enabled = true;
}

export function disableForce(name) {
  const entry = registry.get(name);
  if (entry) entry.enabled = false;
}

export function isForceEnabled(name) {
  return registry.get(name)?.enabled ?? false;
}

export function updateForceOptions(name, opts) {
  const entry = registry.get(name);
  if (entry) entry.options = { ...entry.options, ...opts };
}

export function forceNames() {
  return [...registry.keys()];
}

export function applyRegisteredForces(simulation) {
  for (const [name, { factory, enabled, options }] of registry.entries()) {
    const force = enabled ? factory(options) : null;
    simulation.force(name, force);
  }
}

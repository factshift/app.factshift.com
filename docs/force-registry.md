# Force Registry

The simulation exposes a small registry for defining and toggling forces at runtime.
Forces are registered with a name and a factory function that returns the D3 force
instance. Each entry also tracks whether the force is enabled.

```javascript
import { registerForce, applyRegisteredForces } from '../src/js/simulation/force-registry';
registerForce('charge', () => forceManyBody().strength(-30));
```

Calling `applyRegisteredForces(simulation)` applies the enabled forces to a given
simulation. Forces can be toggled with `toggleForce(name)` from
`active-forces.js` which delegates to the registry utilities.

The default configuration is created in `src/js/simulation/forces.js` and can be
extended by registering additional custom forces before `initializeForces()`
runs.

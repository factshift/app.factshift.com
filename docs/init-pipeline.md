# Initialization Pipeline

The bootstrap folder exposes a small pipeline utility for organizing startup routines.

```javascript
import { addInitSteps, runInitPipeline, InitPhase } from '../src/js/bootstrap/init-pipeline';
import { stepsById } from '../src/js/bootstrap/init-steps';

addInitSteps([
  { ...stepsById.analytics, phase: InitPhase.BOOT },
  { ...stepsById.parameters, phase: InitPhase.BOOT },
  { ...stepsById.ui, phase: InitPhase.UI, dependsOn: [stepsById.parameters] },
]);

await runInitPipeline();
```

`addInitSteps` accepts either an object mapping step ids to functions or an array of step objects. Each step object has the shape `{id, init, priority?, dependsOn?, phase?}`. The `dependsOn` list may contain step ids or references to other step objects. Steps are sorted before execution first by their phase, then by priority and finally their declared dependencies.

### Example with Priorities and Dependencies

```javascript
addInitSteps([
  { id: 'a', init: initA, priority: 0 },
  { id: 'b', init: initB, priority: 10 },
  { id: 'c', init: initC, dependsOn: ['a', 'b'] },
]);
```

Here `c` runs after `a` and `b` despite not specifying a priority. Lower priority values run earlier.

Duplicate step ids are not allowed and will throw an error when added. The
pipeline also detects circular dependencies between steps and throws an error if
a cycle is found during sorting.

### Phases

Steps can optionally specify a `phase` that groups them into broad buckets of work.
Phases are defined in the exported `InitPhase` enum with the values `BOOT`, `UI` and `DEFERRED`.
The sorter runs all `boot` phase steps before `ui` steps, followed by `deferred` steps.
Any step without a known phase is treated as `deferred`.

Phases are useful for keeping lightweight initialization logic (`boot`) separate
from user interface startup (`ui`) or work that can be postponed (`deferred`).

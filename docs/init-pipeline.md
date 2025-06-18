# Initialization Pipeline

The bootstrap folder exposes a small pipeline utility for organizing startup routines.

```javascript
import { addInitSteps, runInitPipeline } from '../src/js/bootstrap/init-pipeline';

addInitSteps([
  { id: 'analytics', init: initAnalytics, priority: 0 },
  { id: 'parameters', init: initParameters, priority: 1 },
  { id: 'ui', init: hydrateUi, priority: 2, dependsOn: ['parameters'] },
]);

await runInitPipeline();
```

`addInitSteps` accepts either an object mapping step ids to functions or an array of step objects. Each step object has the shape `{id, init, priority?, dependsOn?}`. Steps are sorted before execution by priority and their declared dependencies.

### Example with Priorities and Dependencies

```javascript
addInitSteps([
  { id: 'a', init: initA, priority: 0 },
  { id: 'b', init: initB, priority: 10 },
  { id: 'c', init: initC, dependsOn: ['a', 'b'] },
]);
```

Here `c` runs after `a` and `b` despite not specifying a priority. Lower priority values run earlier.

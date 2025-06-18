# Initialization Pipeline

The bootstrap folder exposes a small pipeline utility for organizing startup routines.

```javascript
import { addInitSteps, runInitPipeline } from '../src/js/bootstrap/init-pipeline';

addInitSteps({
  analytics: initAnalytics,
  parameters: initParameters,
  ui: hydrateUi,
});

await runInitPipeline();
```

`addInitSteps` accepts either an object mapping step names to functions or an array of `[name, fn]` pairs. Internally it delegates to `addInitStep` for each entry so steps may also be registered individually.

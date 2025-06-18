# Initialization Pipeline

The `runInitPipeline` utility executes an array of setup steps. Each item in the
pipeline is called in order. If a step returns a Promise it is awaited before
continuing to the next step, so both synchronous and asynchronous functions can
be mixed freely.

```javascript
import { runInitPipeline } from '../bootstrap/run-init-pipeline';

const steps = [
  () => console.log('sync step'),
  async () => fetch('/some/resource')
];

await runInitPipeline(steps);
```


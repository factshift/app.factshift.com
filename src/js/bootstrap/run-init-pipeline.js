// Run initialization steps sequentially, optionally reporting progress
// through instrumentation callbacks. `instrumentation` can define
// `onStepStart(step)` and `onStepEnd(step)` hooks for integration with
// performance tracking or logging.
export async function runInitPipeline(steps, instrumentation = {}) {
  for (const step of steps) {
    instrumentation.onStepStart?.(step);
    await step();
    instrumentation.onStepEnd?.(step);
  }
}

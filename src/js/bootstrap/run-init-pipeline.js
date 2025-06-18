export async function runInitPipeline(steps) {
  for (const fn of steps) {
    await fn();
  }
}

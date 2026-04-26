import { runBudgetedSteps, METRICS_INTERVAL_MS } from '../../sim/budget';

export function createCanvas2DBackend({ initialWorld, stepWorld, getMetrics }) {
  let world = initialWorld;
  let controls = { timeScale: 1, scenario: 'scarce', options: null, budgetMs: 6 };
  let lastMetricsAt = 0;

  return {
    kind: 'canvas2d',
    init() {},
    resize() {},
    setControls(next) { controls = { ...controls, ...next }; },
    setCamera() {},
    setWorld(nextWorld) { world = nextWorld; },
    stepBudgeted() {
      const { timeScale, budgetMs, options, scenario } = controls;
      const actualSteps = runBudgetedSteps({
        targetSteps: Math.max(1, Number(timeScale) || 1),
        budgetMs: Math.max(2, Number(budgetMs) || 6),
        step: () => {
          world = stepWorld(world, options, scenario);
        },
      });
      const now = Date.now();
      const shouldSampleMetrics = now - lastMetricsAt >= METRICS_INTERVAL_MS;
      const metrics = shouldSampleMetrics ? getMetrics(world) : null;
      if (shouldSampleMetrics) lastMetricsAt = now;
      return { world, actualSteps, metrics };
    },
    render() {},
    readMetrics() { return getMetrics(world); },
    inspectCell() { return null; },
    destroy() {},
  };
}

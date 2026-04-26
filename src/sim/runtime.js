export const METRICS_INTERVAL_MS = 250;

export function chooseBackend() {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) return 'webgpu';
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    if (canvas.getContext('webgl2')) return 'webgl2';
  }
  return 'canvas2d';
}

export function runBudgetedSteps({ targetSteps, budgetMs, step }) {
  const started = typeof performance !== 'undefined' ? performance.now() : Date.now();
  let steps = 0;
  while (steps < targetSteps) {
    step();
    steps += 1;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - started >= budgetMs) break;
  }
  return steps;
}

export class SimulationRuntime {
  constructor({ initialWorld, stepWorld, getMetrics }) {
    this.world = initialWorld;
    this.stepWorld = stepWorld;
    this.getMetrics = getMetrics;
    this.controls = {
      timeScale: 1,
      options: null,
      scenario: 'scarce',
      budgetMs: 6,
    };
    this.lastMetricsAt = 0;
  }

  setWorld(world) {
    this.world = world;
  }

  setControls(nextControls) {
    this.controls = { ...this.controls, ...nextControls };
  }

  tick() {
    const { timeScale, options, scenario, budgetMs } = this.controls;
    const actualSteps = runBudgetedSteps({
      targetSteps: Math.max(1, Number(timeScale) || 1),
      budgetMs: Math.max(2, Number(budgetMs) || 6),
      step: () => {
        this.world = this.stepWorld(this.world, options, scenario);
      },
    });

    const now = Date.now();
    let metrics = null;
    if (now - this.lastMetricsAt >= METRICS_INTERVAL_MS) {
      metrics = this.getMetrics(this.world);
      this.lastMetricsAt = now;
    }

    return {
      world: this.world,
      metrics,
      actualSteps,
    };
  }
}

export const METRICS_INTERVAL_MS = 250;

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

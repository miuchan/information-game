import { createCanvas2DBackend } from '../engine/backends/canvas2dBackend';
import { canUseWebGL2, createWebGL2Backend } from '../engine/backends/webgl2Backend';
import { canUseWebGPU, createWebGPUBackend } from '../engine/backends/webgpuBackend';
export { METRICS_INTERVAL_MS, runBudgetedSteps } from './budget';

export function chooseBackend() {
  if (canUseWebGPU()) return 'webgpu';
  if (canUseWebGL2()) return 'webgl2';
  return 'canvas2d';
}

export function createBackend(kind, params) {
  if (kind === 'auto') return createBackend(chooseBackend(), params);
  if (kind === 'webgpu' && canUseWebGPU()) return createWebGPUBackend(params);
  if (kind === 'webgl2' && canUseWebGL2()) return createWebGL2Backend(params);
  return createCanvas2DBackend(params);
}

export class SimulationRuntime {
  constructor({ initialWorld, stepWorld, getMetrics, backend = 'auto' }) {
    this.backend = createBackend(backend, { initialWorld, stepWorld, getMetrics });
    this.backend.init();
    this.kind = this.backend.kind;
    this.isCpuFallback = this.kind === 'canvas2d';
  }

  setWorld(world) {
    this.backend.setWorld(world);
  }

  setControls(nextControls) {
    this.backend.setControls(nextControls);
  }

  tick() {
    return this.backend.stepBudgeted();
  }
}

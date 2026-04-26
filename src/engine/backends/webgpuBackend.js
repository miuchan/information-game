import { createCanvas2DBackend } from './canvas2dBackend';

export function canUseWebGPU() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

export function createWebGPUBackend(params) {
  // Stage-0 fallback: keep backend contract while delegating sim to CPU path.
  const backend = createCanvas2DBackend(params);
  return { ...backend, kind: 'webgpu' };
}

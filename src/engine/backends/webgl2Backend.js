import { createCanvas2DBackend } from './canvas2dBackend';

export function canUseWebGL2() {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  return !!canvas.getContext('webgl2');
}

export function createWebGL2Backend(params) {
  // Stage-0 fallback: keep backend contract while delegating sim to CPU path.
  const backend = createCanvas2DBackend(params);
  return { ...backend, kind: 'webgl2' };
}

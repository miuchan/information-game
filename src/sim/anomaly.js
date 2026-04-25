import { PHASES } from './constants';

const IDEAL_GAP = 128;
const GAP_WIDTH = 256;

export function productiveAnomalyFromGap(gap) {
  if (gap <= 0) return 0;
  const z = (gap - IDEAL_GAP) / GAP_WIDTH;
  return Math.exp(-0.5 * z * z);
}

export function confusionFromGap(gap) {
  if (gap <= 0) return 0;
  const productive = productiveAnomalyFromGap(gap);
  const tooFar = Math.min(1, gap / (PHASES * 0.35));
  return tooFar * (1 - productive);
}

export const clampByte = (v) => Math.max(0, Math.min(255, Math.floor(v)));

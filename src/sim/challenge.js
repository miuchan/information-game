import { PHASES } from './constants';
import { clampRank } from './rank';

export function sampleChallengeRank(world, localP90, rng) {
  const frontier = world.exposureFrontierRank;
  const r = rng();
  if (r < 0.65) {
    const band = PHASES * 0.18;
    return clampRank(frontier - Math.floor(rng() * band));
  }
  if (r < 0.9) {
    return Math.floor(rng() * Math.max(1, frontier));
  }
  return clampRank(localP90 + Math.floor((rng() - 0.5) * PHASES * 0.4));
}

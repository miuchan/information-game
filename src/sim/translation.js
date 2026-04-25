import { PHASES } from './constants';

export function applyTranslation(i, neighbors, arrays) {
  const { confusion, rank, reputation, translation, confidence, anomaly } = arrays;
  if (confusion[i] < 90) return false;
  let best = -1;
  let bestScore = 0;

  for (const j of neighbors) {
    if (rank[j] <= rank[i]) continue;
    const distance = rank[j] - rank[i];
    if (distance > PHASES * 1.2) continue;
    const score = reputation[j] * 0.45 + translation[j] * 0.35 + confidence[j] * 0.2;
    if (score > bestScore) {
      bestScore = score;
      best = j;
    }
  }

  if (best < 0) return false;

  confusion[i] = Math.floor(confusion[i] * 0.72);
  anomaly[i] = Math.min(255, anomaly[i] + 24);
  translation[i] = Math.min(255, translation[i] + 12);
  return true;
}

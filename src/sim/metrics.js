import { orderOf } from './rank';

export function updateMetrics(world, prevAvgRank, liftEvents, translatedCount, speakingCount) {
  const { rank, anomaly, confusion, translation, messageKind } = world.arrays;
  const { size } = world;
  let sumRank = 0;
  let sumOrder = 0;
  let maxOrder = 0;
  let sumAnomaly = 0;
  let sumConfusion = 0;
  let sumTranslation = 0;
  let claimsNearFrontier = 0;
  let skyline = new Uint32Array(128);

  for (let i = 0; i < size; i += 1) {
    const r = rank[i];
    const order = orderOf(r);
    skyline[order] += 1;
    sumRank += r;
    sumOrder += order;
    if (order > maxOrder) maxOrder = order;
    sumAnomaly += anomaly[i];
    sumConfusion += confusion[i];
    sumTranslation += translation[i];
    if (messageKind[i] > 0 && Math.abs(r - world.exposureFrontierRank) < 1024) claimsNearFrontier += 1;
  }

  const avgRank = sumRank / size;
  const m = world.metrics;
  m.learningVelocity = Math.max(0, (avgRank - prevAvgRank) / 512);
  m.predictionAccuracy = Math.min(1, claimsNearFrontier / size + (1 - sumConfusion / (size * 255)) * 0.3);
  m.activeSpeech = speakingCount / size;
  m.confusionLoad = sumConfusion / (size * 255);
  m.anomalyPressure = sumAnomaly / (size * 255);
  m.translationRate = translatedCount / size;
  m.highestActiveOrder = maxOrder;
  m.averageOrder = sumOrder / size;
  m.frontierGap = world.hiddenFrontierRank - world.socialFrontierRank;
  m.liftEvents = liftEvents;
  m.stagnation = m.activeSpeech > 0.2 && m.learningVelocity < 0.02 && m.predictionAccuracy < 0.25 && m.confusionLoad > 0.45;

  world.skyline = skyline;
}

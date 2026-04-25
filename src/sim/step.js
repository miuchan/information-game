import { EXPOSURE_WINDOW, PARADIGM_STEP, PHASES, TYPE } from './constants';
import { clampByte, confusionFromGap, productiveAnomalyFromGap } from './anomaly';
import { sampleChallengeRank } from './challenge';
import { clampRank } from './rank';
import { applyTranslation } from './translation';
import { generateMessage } from './speech';
import { updateMetrics } from './metrics';
import { indexOfChunk } from './chunks';

function advanceHiddenFrontier(world) {
  world.hiddenFrontierFloat += world.hiddenAdvanceSpeed;
  world.hiddenFrontierRank = clampRank(Math.floor(world.hiddenFrontierFloat));
}

function estimateSocialFrontier(world) {
  const { rank } = world.arrays;
  const sample = 5000;
  const values = new Uint32Array(sample);
  for (let i = 0; i < sample; i += 1) {
    const idx = Math.floor(world.rng() * world.size);
    values[i] = rank[idx];
  }
  values.sort();
  return values[Math.floor(sample * 0.95)];
}

function updateChunkStats(world) {
  const { list, nx } = world.chunks;
  const { rank, anomaly, confusion, translation } = world.arrays;
  for (const c of list) {
    c.avgRank = 0;
    c.avgAnomaly = 0;
    c.avgConfusion = 0;
    c.translationRate = 0;
    c.learningVelocity = 0;
    c.activity = 0;
  }

  const count = new Uint32Array(list.length);
  for (let y = 0; y < world.height; y += 1) {
    for (let x = 0; x < world.width; x += 1) {
      const i = y * world.width + x;
      const ci = indexOfChunk(x, y, world.chunkSize, nx);
      const c = list[ci];
      c.avgRank += rank[i];
      c.avgAnomaly += anomaly[i];
      c.avgConfusion += confusion[i];
      c.translationRate += translation[i];
      count[ci] += 1;
    }
  }

  for (let i = 0; i < list.length; i += 1) {
    const c = list[i];
    const n = Math.max(1, count[i]);
    c.avgRank /= n;
    c.p90Rank = c.avgRank + 512;
    c.avgAnomaly /= n * 255;
    c.avgConfusion /= n * 255;
    c.translationRate /= n * 255;
    c.learningVelocity = c.avgAnomaly * 0.45 + c.translationRate * 0.55;
    c.activity = c.avgAnomaly * 0.35 + c.avgConfusion * 0.25 + c.learningVelocity * 0.25 + 0.15;

    if (c.translationRate > 0.55 && c.avgConfusion < 0.45 && c.learningVelocity > 0.08 && c.avgAnomaly > 0.15) {
      c.archiveStrength = Math.min(1, c.archiveStrength + 0.006);
    } else {
      c.archiveStrength = Math.max(0, c.archiveStrength - 0.002);
    }
  }
}

function neighborsOf(index, width, height) {
  const x = index % width;
  const y = Math.floor(index / width);
  const result = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      result.push(ny * width + nx);
    }
  }
  return result;
}

function socialPull(rank, neighborAvgRank) {
  const diff = neighborAvgRank - rank;
  if (Math.abs(diff) < 32) return 0;
  if (Math.abs(diff) > PHASES * 0.8) return 0;
  return Math.sign(diff) * Math.min(24, Math.floor(Math.abs(diff) * 0.05));
}

function canBreakthrough(i, localFrontierRank, a) {
  const lag = localFrontierRank - a.rank[i];
  const nearFrontier = lag >= 0 && lag <= PHASES * 0.4;
  const enoughAnomaly = a.anomaly[i] > 150;
  const enoughConfidence = a.confidence[i] > 70;
  const translated = a.translation[i] > 60;
  const notOverwhelmed = a.confusion[i] < 190 || translated;
  return nearFrontier && enoughAnomaly && enoughConfidence && notOverwhelmed;
}

function breakthrough(i, localFrontierRank, a) {
  a.rank[i] = clampRank(Math.max(a.rank[i] + PARADIGM_STEP, localFrontierRank + PARADIGM_STEP));
  a.anomaly[i] = Math.floor(a.anomaly[i] * 0.3);
  a.confusion[i] = Math.floor(a.confusion[i] * 0.6);
  a.confidence[i] = Math.min(255, a.confidence[i] + 30);
  a.energy[i] = Math.max(0, a.energy[i] - 12);
}

export function stepWorld(world) {
  const a = world.arrays;
  const prevAvgRank = a.rank.reduce((s, v) => s + v, 0) / world.size;
  let liftEvents = 0;
  let translatedCount = 0;
  let speakingCount = 0;

  advanceHiddenFrontier(world);
  updateChunkStats(world);
  world.socialFrontierRank = estimateSocialFrontier(world);
  world.exposureFrontierRank = Math.min(world.hiddenFrontierRank, world.socialFrontierRank + EXPOSURE_WINDOW);

  if (world.metrics.stagnation) {
    world.exposureFrontierRank = Math.min(world.hiddenFrontierRank, world.socialFrontierRank + PHASES * 0.25);
  }

  for (let i = 0; i < world.size; i += 1) {
    const x = i % world.width;
    const y = Math.floor(i / world.width);
    const ci = indexOfChunk(x, y, world.chunkSize, world.chunks.nx);
    const chunk = world.chunks.list[ci];
    const neighbors = neighborsOf(i, world.width, world.height);
    const localP90 = chunk.p90Rank;

    const challenge = sampleChallengeRank(world, localP90, world.rng);
    const gap = challenge - a.rank[i];
    const productive = productiveAnomalyFromGap(gap);
    const confuse = confusionFromGap(gap);

    a.anomaly[i] = clampByte(a.anomaly[i] * 0.92 + productive * 32);
    a.confusion[i] = clampByte(a.confusion[i] * 0.94 + confuse * 36);

    const archiveSuppression = 1 - chunk.archiveStrength * 0.08;
    a.confusion[i] = clampByte(a.confusion[i] * archiveSuppression);
    a.translation[i] = clampByte(a.translation[i] + chunk.archiveStrength * 4);
    a.confidence[i] = clampByte(a.confidence[i] + chunk.archiveStrength * 2);

    generateMessage(i, a);
    if (a.messageKind[i] !== 0) speakingCount += 1;

    if (applyTranslation(i, neighbors, a)) translatedCount += 1;

    let neighborAvgRank = 0;
    let neighborP90 = 0;
    for (const n of neighbors) {
      neighborAvgRank += a.rank[n];
      neighborP90 = Math.max(neighborP90, a.rank[n]);
    }
    neighborAvgRank /= Math.max(1, neighbors.length);

    if (a.type[i] === TYPE.SOCIAL) {
      a.rank[i] = clampRank(a.rank[i] + socialPull(a.rank[i], neighborAvgRank) * 1.3);
    } else {
      a.rank[i] = clampRank(a.rank[i] + socialPull(a.rank[i], neighborAvgRank));
    }

    const localFrontierRank = Math.max(neighborP90, localP90);
    if (canBreakthrough(i, localFrontierRank, a)) {
      breakthrough(i, localFrontierRank, a);
      liftEvents += 1;
    }

    a.reputation[i] = clampByte(a.reputation[i] * 0.985 + a.translation[i] * 0.03 + a.confidence[i] * 0.01);
    a.energy[i] = clampByte(a.energy[i] + 2 - a.messageStrength[i] * 0.01);
    if (a.type[i] === TYPE.CONSERVE) a.confidence[i] = clampByte(a.confidence[i] + 1);
  }

  updateChunkStats(world);
  updateMetrics(world, prevAvgRank, liftEvents, translatedCount, speakingCount);
  world.tick += 1;
}

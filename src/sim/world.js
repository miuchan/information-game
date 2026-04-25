import { MSG, TYPE, UI_DEFAULTS, WORLD_PRESET } from './constants';
import { createChunks } from './chunks';
import { createRng } from './rng';

export function createWorld(seed = Date.now() % 1_000_000) {
  const { width, height, chunkSize } = WORLD_PRESET;
  const size = width * height;
  const rng = createRng(seed);
  const chunks = createChunks(width, height, chunkSize);

  const rank = new Uint32Array(size);
  const confidence = new Uint8Array(size);
  const anomaly = new Uint8Array(size);
  const confusion = new Uint8Array(size);
  const translation = new Uint8Array(size);
  const reputation = new Uint8Array(size);
  const energy = new Uint8Array(size);
  const type = new Uint8Array(size);
  const messageKind = new Int8Array(size);
  const messageRank = new Uint32Array(size);
  const messageStrength = new Uint8Array(size);

  for (let i = 0; i < size; i += 1) {
    rank[i] = Math.floor(rng() * 512);
    confidence[i] = 80 + Math.floor(rng() * 120);
    anomaly[i] = 12 + Math.floor(rng() * 24);
    confusion[i] = Math.floor(rng() * 36);
    translation[i] = Math.floor(rng() * 40);
    reputation[i] = 70 + Math.floor(rng() * 120);
    energy[i] = 120 + Math.floor(rng() * 120);
    type[i] = Math.floor(rng() * 6);
    messageKind[i] = MSG.NONE;
    messageRank[i] = rank[i];
    messageStrength[i] = 0;
  }

  const world = {
    ...WORLD_PRESET,
    size,
    tick: 0,
    seed,
    hiddenFrontierRank: 1536,
    socialFrontierRank: 0,
    exposureFrontierRank: 0,
    hiddenFrontierFloat: 1536,
    rng,
    speed: UI_DEFAULTS.speed,
    running: UI_DEFAULTS.running,
    hiddenAdvanceSpeed: UI_DEFAULTS.hiddenAdvanceSpeed,
    arrays: {
      rank,
      confidence,
      anomaly,
      confusion,
      translation,
      reputation,
      energy,
      type,
      messageKind,
      messageRank,
      messageStrength,
    },
    chunks,
    metrics: {
      predictionAccuracy: 0,
      learningVelocity: 0,
      activeSpeech: 0,
      confusionLoad: 0,
      anomalyPressure: 0,
      translationRate: 0,
      highestActiveOrder: 0,
      averageOrder: 0,
      frontierGap: 0,
      liftEvents: 0,
      stagnation: false,
    },
    skyline: new Uint32Array(128),
  };

  return world;
}

export const TYPE_LABEL = {
  [TYPE.NORMAL]: 'Normal',
  [TYPE.SEEKER]: 'Seeker',
  [TYPE.SOCIAL]: 'Social',
  [TYPE.ATTENTION]: 'Attention',
  [TYPE.TRANSLATOR]: 'Translator',
  [TYPE.CONSERVE]: 'Conservative',
};

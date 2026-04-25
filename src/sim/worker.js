import { createWorld, TYPE_LABEL } from './world';
import { orderOf, phaseOf } from './rank';
import { stepWorld } from './step';

let world = createWorld();

function inspectCell(index) {
  const x = index % world.width;
  const y = Math.floor(index / world.width);
  const a = world.arrays;
  return {
    index,
    x,
    y,
    rank: a.rank[index],
    order: orderOf(a.rank[index]),
    phase: phaseOf(a.rank[index]),
    confidence: a.confidence[index],
    anomaly: a.anomaly[index],
    confusion: a.confusion[index],
    translation: a.translation[index],
    reputation: a.reputation[index],
    energy: a.energy[index],
    type: TYPE_LABEL[a.type[index]],
    messageKind: a.messageKind[index],
  };
}

function sampleVisible(camera) {
  const { x, y, zoom, viewportWidth, viewportHeight } = camera;
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(world.width, Math.ceil(x + viewportWidth / zoom));
  const y1 = Math.min(world.height, Math.ceil(y + viewportHeight / zoom));

  const cells = [];
  for (let yy = y0; yy < y1; yy += 1) {
    for (let xx = x0; xx < x1; xx += 1) {
      const i = yy * world.width + xx;
      cells.push({
        x: xx,
        y: yy,
        rank: world.arrays.rank[i],
        anomaly: world.arrays.anomaly[i],
        confusion: world.arrays.confusion[i],
        translation: world.arrays.translation[i],
      });
    }
  }
  return { bounds: { x0, y0, x1, y1 }, cells };
}

function snapshot(camera) {
  return {
    tick: world.tick,
    frontiers: {
      hidden: world.hiddenFrontierRank,
      social: world.socialFrontierRank,
      exposure: world.exposureFrontierRank,
    },
    metrics: world.metrics,
    skyline: Array.from(world.skyline),
    world: {
      width: world.width,
      height: world.height,
      chunkSize: world.chunkSize,
      seed: world.seed,
    },
    visible: sampleVisible(camera),
  };
}

self.onmessage = (e) => {
  const { type, payload } = e.data;
  if (type === 'RESET') {
    world = createWorld(payload?.seed);
  }
  if (type === 'CONFIG') {
    if (payload.speed !== undefined) world.speed = payload.speed;
    if (payload.hiddenAdvanceSpeed !== undefined) world.hiddenAdvanceSpeed = payload.hiddenAdvanceSpeed;
    if (payload.running !== undefined) world.running = payload.running;
  }
  if (type === 'STEP') {
    const ticks = Math.max(1, payload?.ticks ?? world.speed);
    if (world.running || payload?.force) {
      for (let i = 0; i < ticks; i += 1) stepWorld(world);
    }
  }
  if (type === 'INSPECT') {
    self.postMessage({ type: 'INSPECT', payload: inspectCell(payload.index) });
    return;
  }
  if (type === 'SNAPSHOT') {
    self.postMessage({ type: 'SNAPSHOT', payload: snapshot(payload.camera) });
  }
};

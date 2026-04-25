export function createChunks(width, height, chunkSize) {
  const nx = Math.ceil(width / chunkSize);
  const ny = Math.ceil(height / chunkSize);
  const chunks = [];
  for (let cy = 0; cy < ny; cy += 1) {
    for (let cx = 0; cx < nx; cx += 1) {
      chunks.push({
        cx,
        cy,
        dirty: true,
        visible: false,
        activity: 0,
        avgRank: 0,
        p90Rank: 0,
        avgAnomaly: 0,
        avgConfusion: 0,
        translationRate: 0,
        learningVelocity: 0,
        archiveStrength: 0,
      });
    }
  }
  return { nx, ny, list: chunks };
}

export function indexOfChunk(x, y, chunkSize, nx) {
  const cx = Math.floor(x / chunkSize);
  const cy = Math.floor(y / chunkSize);
  return cy * nx + cx;
}

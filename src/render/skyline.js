export function buildBands(skyline, bandSize = 4) {
  const bands = [];
  for (let start = 0; start < skyline.length; start += bandSize) {
    let count = 0;
    for (let i = start; i < Math.min(start + bandSize, skyline.length); i += 1) count += skyline[i];
    bands.push({ min: start, max: Math.min(start + bandSize - 1, skyline.length - 1), count });
  }
  return bands;
}

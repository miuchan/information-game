export function lodLevel(cellSize) {
  if (cellSize < 0.5) return 0;
  if (cellSize < 2) return 1;
  if (cellSize < 8) return 2;
  if (cellSize < 16) return 3;
  return 4;
}

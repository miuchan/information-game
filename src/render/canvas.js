import { phaseOf, orderOf } from '../sim/rank';
import { lodLevel } from './lod';

export function renderWorld(ctx, snapshot, camera, colorLut, focusBand) {
  const { visible } = snapshot;
  const cellSize = camera.zoom;
  const lod = lodLevel(cellSize);
  const { width, height } = ctx.canvas;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0d1013';
  ctx.fillRect(0, 0, width, height);

  for (const cell of visible.cells) {
    const sx = (cell.x - camera.x) * camera.zoom;
    const sy = (cell.y - camera.y) * camera.zoom;
    const phase = phaseOf(cell.rank);
    const order = orderOf(cell.rank);

    ctx.fillStyle = colorLut[phase];
    ctx.fillRect(sx, sy, cellSize + 0.5, cellSize + 0.5);

    if (lod >= 3) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.strokeRect(sx + 0.5, sy + 0.5, cellSize - 1, cellSize - 1);
    }

    if (lod >= 4) {
      if (cell.anomaly > 150) {
        ctx.strokeStyle = 'rgba(255,160,80,0.6)';
        ctx.beginPath();
        ctx.moveTo(sx + 2, sy + 2);
        ctx.lineTo(sx + cellSize - 2, sy + cellSize - 2);
        ctx.stroke();
      }
      if (cell.confusion > 120) {
        ctx.fillStyle = 'rgba(20,20,20,0.3)';
        ctx.fillRect(sx + 1, sy + 1, Math.max(1, cellSize - 2), Math.max(1, cellSize - 2));
      }
      if (cell.translation > 120) {
        ctx.strokeStyle = 'rgba(125,200,255,0.5)';
        ctx.beginPath();
        ctx.arc(sx + cellSize * 0.5, sy + cellSize * 0.5, Math.max(2, cellSize * 0.25), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (focusBand) {
      const inBand = order >= focusBand.min && order <= focusBand.max;
      if (inBand) {
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.strokeRect(sx + 1, sy + 1, cellSize - 2, cellSize - 2);
      }
    }
  }
}

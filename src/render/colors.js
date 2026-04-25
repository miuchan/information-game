import { PHASES } from '../sim/constants';

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.floor((r + m) * 255),
    Math.floor((g + m) * 255),
    Math.floor((b + m) * 255),
  ];
}

export function makeColorLut() {
  const lut = new Array(PHASES);
  for (let phase = 0; phase < PHASES; phase += 1) {
    const s = phase / (PHASES - 1);
    const light = 0.14 + 0.72 * Math.pow(s, 0.92);
    const sat = 0.2 + 0.45 * Math.sin(Math.PI * s) ** 2;
    const hue = (260 + 360 * 7 * s) % 360;
    const [r, g, b] = hslToRgb(hue, sat, light);
    lut[phase] = `rgb(${r}, ${g}, ${b})`;
  }
  return lut;
}

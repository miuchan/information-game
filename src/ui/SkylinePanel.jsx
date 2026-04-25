import React from 'react';
import { buildBands } from '../render/skyline';

export default function SkylinePanel({ skyline, onFocusBand, focusBand }) {
  const bands = buildBands(skyline || []);
  const max = Math.max(1, ...bands.map((b) => b.count));
  return (
    <section className="panel">
      <h3>Order Skyline (4-band)</h3>
      <div className="skyline">
        {bands.map((b) => {
          const active = focusBand && focusBand.min === b.min;
          return (
            <button key={b.min} className={`band ${active ? 'active' : ''}`} onClick={() => onFocusBand(active ? null : b)}>
              <span>{b.min}-{b.max}</span>
              <span className="bar" style={{ width: `${(b.count / max) * 100}%` }} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

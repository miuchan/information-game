import React from 'react';

export default function Inspector({ cell }) {
  return (
    <section className="panel">
      <h3>Inspector</h3>
      {!cell ? (
        <div className="muted">Click a cell to inspect rank/order/anomaly/confusion/translation states.</div>
      ) : (
        <div className="metric-grid">
          <div>Position</div><div>({cell.x}, {cell.y})</div>
          <div>Type</div><div>{cell.type}</div>
          <div>Rank</div><div>{cell.rank}</div>
          <div>Order</div><div>{cell.order}</div>
          <div>Phase</div><div>{cell.phase}</div>
          <div>Confidence</div><div>{cell.confidence}</div>
          <div>Anomaly</div><div>{cell.anomaly}</div>
          <div>Confusion</div><div>{cell.confusion}</div>
          <div>Translation</div><div>{cell.translation}</div>
          <div>Reputation</div><div>{cell.reputation}</div>
          <div>Energy</div><div>{cell.energy}</div>
        </div>
      )}
    </section>
  );
}

import React from 'react';
import { orderOf, phaseOf } from '../sim/rank';

const fmt = (v) => (typeof v === 'number' ? v.toFixed(3) : '-');

function rankLabel(rank = 0) {
  return `S^${orderOf(rank)} + ${phaseOf(rank)}`;
}

export default function MetricsPanel({ tick, frontiers, metrics }) {
  return (
    <section className="panel">
      <h3>Metrics</h3>
      <div className="metric-grid">
        <div>Tick</div><div>{tick}</div>
        <div>Prediction Accuracy</div><div>{fmt(metrics.predictionAccuracy)}</div>
        <div>Learning Velocity</div><div>{fmt(metrics.learningVelocity)}</div>
        <div>Active Speech</div><div>{fmt(metrics.activeSpeech)}</div>
        <div>Confusion Load</div><div>{fmt(metrics.confusionLoad)}</div>
        <div>Anomaly Pressure</div><div>{fmt(metrics.anomalyPressure)}</div>
        <div>Translation Rate</div><div>{fmt(metrics.translationRate)}</div>
        <div>Highest Active Order</div><div>{metrics.highestActiveOrder}</div>
        <div>Average Order</div><div>{fmt(metrics.averageOrder)}</div>
        <div>Lift Events</div><div>{metrics.liftEvents}</div>
      </div>
      <div className="subpanel">
        <strong>Frontiers</strong>
        <div>Hidden: {rankLabel(frontiers.hidden)}</div>
        <div>Social: {rankLabel(frontiers.social)}</div>
        <div>Exposure: {rankLabel(frontiers.exposure)}</div>
        <div>Gap: {frontiers.hidden - frontiers.social}</div>
      </div>
      {metrics.stagnation ? <div className="warning">Discursive Stagnation: speech high, learning low.</div> : null}
    </section>
  );
}

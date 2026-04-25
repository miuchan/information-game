import React from 'react';

export default function Controls({ running, speed, hiddenAdvanceSpeed, onToggleRun, onReset, onStep, onSpeed, onHiddenSpeed }) {
  return (
    <section className="panel">
      <h3>Controls</h3>
      <div className="row gap">
        <button onClick={onToggleRun}>{running ? 'Pause' : 'Run'}</button>
        <button onClick={onStep}>Step</button>
        <button onClick={onReset}>Reset</button>
      </div>
      <label>
        Tick speed: {speed}
        <input type="range" min="1" max="8" value={speed} onChange={(e) => onSpeed(Number(e.target.value))} />
      </label>
      <label>
        Hidden frontier speed: {hiddenAdvanceSpeed.toFixed(2)}
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.05"
          value={hiddenAdvanceSpeed}
          onChange={(e) => onHiddenSpeed(Number(e.target.value))}
        />
      </label>
    </section>
  );
}

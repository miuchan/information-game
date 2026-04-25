import React, { useEffect, useMemo, useRef, useState } from 'react';
import Controls from './ui/Controls';
import MetricsPanel from './ui/MetricsPanel';
import SkylinePanel from './ui/SkylinePanel';
import Inspector from './ui/Inspector';
import Sidebar from './ui/Sidebar';
import { makeColorLut } from './render/colors';
import { clampCamera, defaultCamera } from './render/camera';
import { renderWorld } from './render/canvas';

function App() {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const rafRef = useRef(0);

  const colorLut = useMemo(() => makeColorLut(), []);
  const [snapshot, setSnapshot] = useState({
    tick: 0,
    frontiers: { hidden: 0, social: 0, exposure: 0 },
    metrics: {},
    skyline: new Array(128).fill(0),
    world: { width: 512, height: 512 },
    visible: { cells: [] },
  });
  const [camera, setCamera] = useState(defaultCamera);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [hiddenAdvanceSpeed, setHiddenAdvanceSpeed] = useState(0.85);
  const [focusBand, setFocusBand] = useState(null);
  const [inspected, setInspected] = useState(null);

  useEffect(() => {
    const worker = new Worker(new URL('./sim/worker.js', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    worker.onmessage = (e) => {
      if (e.data.type === 'SNAPSHOT') setSnapshot(e.data.payload);
      if (e.data.type === 'INSPECT') setInspected(e.data.payload);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCamera((c) => ({ ...c, viewportWidth: canvas.width, viewportHeight: canvas.height }));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: 'CONFIG', payload: { running, speed, hiddenAdvanceSpeed } });
  }, [running, speed, hiddenAdvanceSpeed]);

  useEffect(() => {
    const loop = () => {
      const worker = workerRef.current;
      if (worker) {
        worker.postMessage({ type: 'STEP', payload: { ticks: speed } });
        worker.postMessage({ type: 'SNAPSHOT', payload: { camera } });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [camera, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderWorld(ctx, snapshot, camera, colorLut, focusBand);
  }, [snapshot, camera, colorLut, focusBand]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const down = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
    };
    const move = (e) => {
      if (!dragging) return;
      const dx = (e.clientX - lastX) / camera.zoom;
      const dy = (e.clientY - lastY) / camera.zoom;
      lastX = e.clientX;
      lastY = e.clientY;
      setCamera((c) => clampCamera({ ...c, x: c.x - dx, y: c.y - dy }, snapshot.world));
    };
    const wheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setCamera((c) => clampCamera({ ...c, zoom: c.zoom * factor }, snapshot.world));
    };
    const click = (e) => {
      const rect = canvas.getBoundingClientRect();
      const wx = Math.floor((e.clientX - rect.left) / camera.zoom + camera.x);
      const wy = Math.floor((e.clientY - rect.top) / camera.zoom + camera.y);
      if (wx < 0 || wy < 0 || wx >= snapshot.world.width || wy >= snapshot.world.height) return;
      const index = wy * snapshot.world.width + wx;
      workerRef.current?.postMessage({ type: 'INSPECT', payload: { index } });
    };

    canvas.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);
    canvas.addEventListener('wheel', wheel, { passive: false });
    canvas.addEventListener('click', click);

    return () => {
      canvas.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mousemove', move);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('click', click);
    };
  }, [camera, snapshot.world]);

  const reset = () => {
    workerRef.current?.postMessage({ type: 'RESET', payload: {} });
    setInspected(null);
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="world" />
      <header className="topbar">
        <div>
          <h1>Cognitive Frontier Automata</h1>
          <p>拖动画布、滚轮缩放、点击节点查看秩序状态</p>
        </div>
      </header>

      <Sidebar side="right">
        <Controls
          running={running}
          speed={speed}
          hiddenAdvanceSpeed={hiddenAdvanceSpeed}
          onToggleRun={() => setRunning((v) => !v)}
          onStep={() => workerRef.current?.postMessage({ type: 'STEP', payload: { ticks: 1, force: true } })}
          onReset={reset}
          onSpeed={setSpeed}
          onHiddenSpeed={setHiddenAdvanceSpeed}
        />
        <MetricsPanel tick={snapshot.tick} frontiers={snapshot.frontiers} metrics={snapshot.metrics} />
      </Sidebar>

      <Sidebar side="left">
        <SkylinePanel skyline={snapshot.skyline} onFocusBand={setFocusBand} focusBand={focusBand} />
        <Inspector cell={inspected} />
      </Sidebar>
    </div>
  );
}

export default App;

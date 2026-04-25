# Cognitive Frontier Automata (React MVP)

A from-scratch redesign of the previous binary truth game into an abstract social cognition cellular automata simulation.

## Implemented MVP scope

- 512×512 world with typed-array agents.
- Rank system: `rank = order * 8192 + phase` (128 orders).
- Three frontiers: hidden / social / exposure.
- Productive anomaly vs confusion split from challenge gap.
- Translation mechanism that converts confusion into learnable anomaly.
- Local breakthrough mechanism near local frontier.
- Chunk statistics and archive-strength feedback.
- Canvas viewport with drag + zoom camera.
- LOD rendering and order-band focus highlighting.
- Worker-driven simulation loop + React UI panels.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Architecture

- `src/sim/*`: simulation model, step loop, worker.
- `src/render/*`: color LUT, camera, LOD, canvas renderer.
- `src/ui/*`: controls, metrics, skyline, inspector.

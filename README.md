# Info Cells

[中文文档](./README.zh-CN.md)

Info Cells is a social cellular automaton game prototype about information diffusion, belief evolution, reputation competition, and adaptive network structure.

## Core Idea

- The map is generated from the current viewport. Each cell is an information agent.
- Each run has a hidden truth: `theta in {0, 1}`.
- Every agent keeps four layers separate: private signals, internal belief, public message, and final action.
- Agents read only local neighborhood messages and update synchronously. There is no central controller.

## Node State

Each node contains:

- `belief`: discrete belief in `-2, -1, 0, 1, 2`
- `message`: public broadcast in `-1, 0, 1`
- `action`: final action in `0, 1`
- `reputation`: reputation in `0..9`
- `type`: truth-seeker, conformist, opportunist, stubborn, fact-checker, bot, or agitator
- `filter`: cognitive filter that changes how neighbor messages are weighted
- `energy`: speech resource; strong broadcasting consumes it, attention or verified accuracy can restore it

## Tick Loop

1. Agents receive sparse private signals about the hidden truth.
2. Each node generates a message from belief, type, energy, and previous neighborhood messages.
3. Neighbor messages are aggregated. Reputation, heat ranking, community bias, and anonymity affect weights.
4. Belief updates from private signal pressure, social pressure, and attention pressure.
5. Action is chosen from belief, but action does not have to equal public speech.
6. Every 5 ticks, partial outcomes are revealed and reputation/energy are updated.

## Player Role

The player acts as a hybrid platform designer and invisible operator:

- Tune mechanisms: reputation visibility, heat ranking, cross-community exposure, anonymous speech, and fact-checking.
- Spend limited interventions: truth seeds, fact-checkers, fake high-reputation nodes, agitators, and bridge edges.
- The goal is not simply to infect the whole map. The game is about trade-offs among truth alignment, polarization, and engagement.

## Scenarios

- Truth scarcity: truthful signals are rare and noise can dominate.
- Polarized blocs: initial community bias is strong; the challenge is to break echo chambers.
- Anonymous flood: false speech has lower reputation cost.
- Viral platform: heat ranking amplifies information cascades.
- Bridge crisis: contaminated bridge nodes can flip large regions.
- Attention market: opportunistic speech is stronger; truth-seekers survive through long-run reputation.

## Run Locally

```bash
npm install
npm run dev
```

This prototype uses Vite, React, and Canvas. The Canvas fills the viewport, and the simulation grid regenerates from the window size. The UI defaults to English and includes a language selector with eight languages. The `Theory` button opens the theoretical foundation and references modal.

Production build:

```bash
npm run build
```

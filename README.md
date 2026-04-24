# Info Cells

[中文文档](./README.zh-CN.md)

Live site: [https://ig.strangeattractor.life/](https://ig.strangeattractor.life/)

Info Cells is a social cellular automaton game about:

> information diffusion + belief evolution + reputation competition + adaptive network structure

The core design choice is not to copy a full economic or Bayesian model directly. Instead, the model is compressed into local, discrete, synchronous update rules. That makes the system feel less like a paper and more like a social automaton that grows opinion clusters, polarization, cascades, rumors, and credibility centers by itself.

## Cellular Automaton Interpretation

Classical cellular automata have three ingredients:

- a discrete space
- finite cell states
- local transition rules

Info Cells maps those ideas into a social information system:

- Cell: an information agent
- Neighborhood: who the agent can observe
- State: belief, message, action, reputation, type, and filter
- Rule: update from private signals and neighbor messages

It is not a physical sandbox. It is a social propagation automaton that mixes local update rules from cellular automata, diffusion dynamics from epidemic models, belief shifts from opinion dynamics, and incentive tension from economic games.

## Formal State Model

Each cell `i` stores a compact state vector:

```text
X_i = (b_i, m_i, a_i, r_i, t_i, f_i, e_i)
```

where:

- `b_i in {-2, -1, 0, 1, 2}` is belief.
- `m_i in {-1, 0, 1}` is the public message.
- `a_i in {0, 1}` is the final action.
- `r_i in {0, ..., 9}` is reputation.
- `t_i` is the agent type.
- `f_i` is the cognitive filter or bias.
- `e_i` is speech energy.

### Belief

```text
b_i = -2  certain that the state is 0
b_i = -1  leans toward 0
b_i =  0  uncertain
b_i =  1  leans toward 1
b_i =  2  certain that the state is 1
```

Discrete belief makes the simulation readable and game-like while still preserving meaningful uncertainty.

### Message

```text
m_i = -1  broadcasts a negative / anti-1 message
m_i =  0  stays silent
m_i =  1  broadcasts a positive / pro-1 message
```

Message is intentionally separated from belief. Agents may believe one thing, say another, or remain silent.

### Action

```text
a_i in {0, 1}
```

Action represents what the agent finally does: vote, join, buy, sell, support, reject, forward, or ignore. Action is the layer used by the truth-alignment score.

### Reputation

```text
r_i in {0, ..., 9}
```

High-reputation agents have more influence over neighbors. Reputation changes over time when partial outcomes are revealed.

### Type

Agent heterogeneity is essential. Current types include:

- Truth-seeker: speaks only when confident.
- Conformist: follows local majority pressure.
- Opportunist: chases attention and influence.
- Stubborn: resists belief changes.
- Fact-checker: receives stronger truth signals.
- Bot: pushes a fixed strategic message.
- Agitator: prefers strong or extreme messaging.

Without heterogeneous types, the system collapses into a simple color-spreading model.

### Filter

The filter `f_i` is a discrete cognitive bias:

- trust high-reputation speakers
- overweight same-community messages
- follow strong or frequent messages
- discount cross-community messages

This is a game-friendly compression of Bayesian updating into a local heuristic.

## Hidden Truth and Private Signals

Each run has a hidden global state:

```text
theta in {0, 1}
```

The hidden truth gives the simulation informational content. Without it, the model would be pure factional politics.

Agents sometimes receive private signals:

```text
s_i in {0, 1}
```

The signal is noisy. Different scenarios and special nodes change the signal rate and accuracy. A supporting signal moves belief by one step:

```text
if s_i = 1: b_i += 1
if s_i = 0: b_i -= 1
b_i is clipped to [-2, 2]
```

## Neighborhood and Network Structure

The visible map is a grid, but the graph is not only a grid.

Each cell has:

- local Moore-neighborhood connections around it
- community membership based on map region
- a small number of cross-community bridge edges

This combines:

- grid locality, which keeps the cellular automaton readable
- small-world shortcuts, which allow long-distance cascades
- community partitions, which create echo chambers and polarization

## Synchronous Tick Rule

Every tick updates all cells synchronously in six stages.

### 1. Private Signal

Each agent receives a noisy private signal with scenario-dependent probability and accuracy.

### 2. Message Generation

Agents encode belief into public speech strategically:

```text
if b_i >= 1: tends to m_i = 1
if b_i <= -1: tends to m_i = -1
if b_i = 0: usually m_i = 0
```

Types modify this base rule:

- Truth-seeker speaks only when `|b_i| >= 2`.
- Conformist leans toward the previous local majority.
- Opportunist amplifies attention-rich messages.
- Agitator speaks strongly even with weak evidence.

### 3. Neighborhood Aggregation

Each node aggregates neighbor messages into a local pressure field:

```text
I_i = sum_{j in N(i)} w_ij * m_j
```

The weight can depend on reputation, community, attention, and platform rules:

```text
w_ij = 1 + alpha * r_j
```

Additional modifiers come from cognitive filters and active mechanisms such as reputation visibility, heat ranking, anonymity, or cross-community exposure.

### 4. Belief Update

Belief changes from three forces:

```text
b_i_new = clip(b_i + P_i + C_i + A_i, -2, 2)
```

where:

- `P_i` is private-signal pressure.
- `C_i` is neighborhood consensus pressure.
- `A_i` is attention or extremity pressure.

Different types use different thresholds. Truth-seekers need stronger evidence; conformists move more easily; stubborn agents resist opposing pressure; opportunists react to attention.

### 5. Action Choice

Action is not identical to speech:

```text
if b_i >= 1: a_i = 1
if b_i <= -1: a_i = 0
if b_i = 0: keep previous action
```

This preserves the four-layer distinction:

```text
truth -> belief -> message -> action
```

If these layers collapse into one color, the game becomes ordinary infection diffusion.

### 6. Reputation and Energy Update

Every few ticks, partial outcomes are revealed:

- true and later-verified speech increases reputation
- false high-impact speech decreases reputation
- sudden reversals can reduce credibility
- attention can restore speech energy
- strong speech consumes more energy

This creates a long-run trade-off: attention-seeking can dominate in the short run, while accuracy can become powerful over repeated verification.

## Player Role

The player should not directly control every cell. The game is strongest when the player controls mechanisms or rare local interventions.

### Platform Designer

The player can tune:

- show or hide reputation
- rank by heat or not
- allow or restrict cross-community exposure
- allow or restrict anonymous speech
- enable fact-checking

This mode is closest to information design and mechanism design.

### Invisible Operator

The player has limited interventions:

- truth seed
- fact-checker
- fake high-reputation node
- agitator
- bridge edge

The pleasure comes from changing a few local conditions and watching the whole network follow a different history.

## Scoring

The game avoids a single infection-style win condition. It uses three axes.

### Truth

Truth alignment measures how many actions match the hidden truth:

```text
T = (1 / n) * sum_i 1[a_i = theta]
```

### Polarization

Polarization measures between-community belief difference:

```text
P = Var_community(mean_b_c)
```

High values mean community-level beliefs are far apart.

### Engagement

Engagement measures message activity:

```text
E = (1 / n) * sum_i 1[m_i != 0]
```

These metrics create real tension:

- truth can rise while engagement falls
- engagement can rise with polarization
- reducing polarization can suppress speech

## Platform Mechanisms

The prototype exposes several mechanism buttons:

- Show reputation: high-reputation nodes become visible centers.
- Rank by heat: accelerates cascades and can increase polarization.
- Cross-community: enables correction and also long-distance rumor spread.
- Anonymous speech: lowers reputation costs and increases noise.
- Fact-checking: introduces high-accuracy, lower-spread corrective nodes.

## Scenarios

- Truth scarcity: truthful signals are rare, so rumor wins easily.
- Polarized blocs: cross-community exposure is limited by initial bias.
- Anonymous flood: reputation penalties are weaker.
- Viral platform: heat ranking makes cascades easier.
- Bridge crisis: contaminated bridge nodes can flip large regions.
- Attention market: opportunistic agents thrive unless accuracy compounds over time.

## Design Principle

The guiding principle is:

> Use discrete local rules to simulate continuous strategic interaction; use visual patterns to reveal abstract information structure; use small player interventions to move large-scale social emergence.

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

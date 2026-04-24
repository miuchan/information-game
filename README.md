# Info Cells

[中文文档](./README.zh-CN.md) · [Live demo](https://ig.strangeattractor.life/)

Info Cells is an interactive social cellular automaton for studying how information, belief, reputation, and network structure co-evolve.

The project implements a deliberately small model: instead of simulating full Bayesian inference or a full economic game, it compresses those ideas into local, discrete, synchronous rules. The result is a playable system that can produce opinion clusters, echo chambers, misinformation cascades, reputation hubs, and polarization boundaries without scripting those patterns in advance.

## Quick Start

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

The app is built with Vite, React, and Canvas. The Canvas fills the viewport; the simulation grid is regenerated from the current window size. The UI ships with eight languages and a `Theory` modal that summarizes the model and its references.

## What This Is

Info Cells treats a society as a graph embedded in a grid.

| Concept | In the game |
| --- | --- |
| Cell | Information agent |
| Neighborhood | Agents whose messages are visible |
| State | Belief, message, action, reputation, type, filter, energy |
| Transition rule | Local update from private signals and neighbor messages |
| Global environment | A hidden binary truth `theta` |

The model is closest to a hybrid of:

- cellular automata: local, discrete, synchronous updates
- social learning: agents update from neighbors
- information design: platform rules change what is observed or amplified
- misinformation models: forceful or strategic agents can distort aggregation
- agent-based modeling: macro patterns emerge from local rules

## Model State

Each agent `i` stores:

```text
X_i = (b_i, m_i, a_i, r_i, t_i, f_i, e_i)
```

| Symbol | Meaning | Domain |
| --- | --- | --- |
| `b_i` | belief | `{-2, -1, 0, 1, 2}` |
| `m_i` | public message | `{-1, 0, 1}` |
| `a_i` | action | `{0, 1}` |
| `r_i` | reputation | `{0, ..., 9}` |
| `t_i` | agent type | truth-seeker, conformist, opportunist, stubborn, fact-checker, bot, agitator |
| `f_i` | cognitive filter | discrete weighting rule |
| `e_i` | speech energy | bounded integer resource |

Belief is discrete:

```text
-2  certain state is 0
-1  leans toward 0
 0  uncertain
 1  leans toward 1
 2  certain state is 1
```

Message and action are intentionally separated. An agent can believe one thing, say another, or stay silent. This keeps the model from collapsing into ordinary color infection.

## Hidden Truth and Signals

Each run has a hidden state:

```text
theta in {0, 1}
```

Agents may receive noisy private signals:

```text
s_i in {0, 1}
```

A signal moves belief by one discrete step:

```text
if s_i = 1: b_i += 1
if s_i = 0: b_i -= 1
b_i = clip(b_i, -2, 2)
```

In the current tuning, private signals are intentionally stronger than before (higher rate and accuracy), and fact-check reveal rounds inject an additional truth push into a subset of nodes. This makes reality feedback persistent enough to challenge pure social herding.

The hidden truth gives the simulation an informational backbone. Without it, the system would only simulate factional alignment.

## Network Structure

The graph combines three layers:

1. **Grid locality**: agents observe nearby cells using a Moore-style neighborhood.
2. **Communities**: the map is partitioned into regions; filters can overweight same-community messages.
3. **Bridge edges**: sparse long-range links create small-world shortcuts.

This follows the intuition of Watts and Strogatz: mostly local networks with a few long-range links can preserve clustering while allowing fast propagation. In this game, those shortcuts can either correct local errors or carry rumors across communities.

## Tick Update

All agents update synchronously.

### 1. Private Signal

Each agent receives a private signal with scenario-dependent probability and accuracy. Fact-checkers receive stronger truth signals.

### 2. Message Generation

The baseline rule is:

```text
if b_i >= 1: m_i tends to 1
if b_i <= -1: m_i tends to -1
if b_i = 0:  m_i tends to 0
```

Agent type modifies this rule:

| Type | Behavior |
| --- | --- |
| Truth-seeker | speaks only when confidence is high |
| Conformist | follows local majority pressure |
| Opportunist | reacts to attention and heat ranking |
| Stubborn | resists opposing pressure |
| Fact-checker | receives stronger truth signals |
| Bot | pushes a fixed strategic message |
| Agitator | favors strong messages |

### 3. Neighborhood Aggregation

Each node aggregates visible neighbor messages:

```text
I_i = sum_{j in N(i)} w_ij * m_j
```

A minimal reputation-weighted influence rule is:

```text
w_ij = 1 + alpha * r_j
```

The implementation also modifies `w_ij` using cognitive filters, same-community bias, heat ranking, anonymity, and reputation visibility.

### 4. Belief Update

Belief changes through three pressures:

```text
b_i' = clip(b_i + P_i + C_i + A_i, -2, 2)
```

| Term | Meaning |
| --- | --- |
| `P_i` | private signal pressure |
| `C_i` | local consensus pressure |
| `A_i` | attention or extremity pressure |

Different agent types use different thresholds before accepting pressure. Nodes also keep a short evidence memory that accumulates private truth pressure. When accumulated evidence is strong enough, nodes temporarily ignore social pressure and follow evidence direction instead.

### 5. Action Choice

Action is derived from belief but is not the same as message:

```text
if b_i >= 1: a_i = 1
if b_i <= -1: a_i = 0
if b_i = 0:  keep previous action
```

The four-layer separation is central:

```text
truth -> belief -> message -> action
```

### 6. Reputation and Energy

Every few ticks, partial outcomes are revealed.

- verified true speech increases reputation
- false high-impact speech decreases reputation
- sharp reversals reduce credibility
- strong speech spends energy
- attention and accuracy can restore energy

This creates a tension between short-term attention and long-run credibility. Reputation visibility now has a lower baseline weight and a steeper dependence on reputation, so repeatedly penalized nodes lose much more practical influence.

A small skepticism/forgetting mechanism is also present: agents at extreme certainty can occasionally step back by one belief level, reducing irreversible lock-in.

## Player Controls

The player does not directly command every cell. The player changes mechanisms and spends scarce interventions.

### Platform Rules

| Rule | Effect |
| --- | --- |
| Show reputation | lets reputation become visible influence |
| Rank by heat | amplifies high-attention messages |
| Cross-community | allows bridge exposure across regions |
| Anonymous speech | weakens reputation penalties |
| Fact-checking | introduces high-accuracy corrective nodes |

### Local Interventions

| Intervention | Effect |
| --- | --- |
| Truth seed | injects a high-confidence truthful signal |
| Fact-checker | creates a high-accuracy corrective node |
| Fake high-reputation node | creates a strategic misinformation source |
| Agitator | creates a strong-message source |
| Bridge edges | adds cross-community links |

## Metrics

The game avoids a single “infect the map” objective. It reports three axes.

### Truth Alignment

```text
T = (1 / n) * sum_i 1[a_i = theta]
```

### Polarization

```text
P = Var_community(mean_b_c)
```

### Engagement

```text
E = (1 / n) * sum_i 1[m_i != 0]
```

These objectives are intentionally not identical. More engagement can increase polarization; suppressing polarization can reduce speech; truth can improve slowly through reputation rather than immediately through popularity.

## Scenarios

| Scenario | Focus |
| --- | --- |
| Truth scarcity | sparse reliable signals |
| Polarized blocs | initial community bias and echo chambers |
| Anonymous flood | weak accountability |
| Viral platform | heat ranking and cascades |
| Bridge crisis | contaminated cross-community connectors |
| Attention market | competition between accuracy and visibility |

## Theoretical Background

The implementation is not a literal reproduction of any one paper. It is a game model that borrows specific mechanisms from several literatures:

- **Bayesian persuasion and information design**: platform interventions change signal structures rather than directly changing truth or utility.
- **Bayes correlated equilibrium**: rules determine what information agents can condition on before choosing messages and actions.
- **Non-Bayesian social learning**: repeated neighbor-based averaging motivates local belief pressure.
- **Misinformation in networks**: forceful or stubborn agents can distort information aggregation.
- **Small-world networks**: sparse long-range links can accelerate diffusion while preserving local clustering.
- **Agent-based polarization**: local convergence rules can still create global fragmentation.
- **Empirical misinformation diffusion**: false or novel information can spread differently from true information, especially under attention-based incentives.

## References

- Kamenica, E., & Gentzkow, M. (2011). [Bayesian Persuasion](https://www.aeaweb.org/articles?id=10.1257%2Faer.101.6.2590). *American Economic Review*.
- Bergemann, D., & Morris, S. (2016). [Bayes Correlated Equilibrium and the Comparison of Information Structures in Games](https://elischolar.library.yale.edu/cowles-discussion-paper-series/2174/). *Theoretical Economics*.
- DeGroot, M. H. (1974). [Reaching a Consensus](https://www.tandfonline.com/doi/abs/10.1080/01621459.1974.10480137). *Journal of the American Statistical Association*.
- Golub, B., & Jackson, M. O. (2010). [Naive Learning in Social Networks and the Wisdom of Crowds](https://web.stanford.edu/~jacksonm/naivelearning.pdf). *American Economic Journal: Microeconomics*.
- Acemoglu, D., Ozdaglar, A., & ParandehGheibi, A. (2010). [Spread of (Mis)information in Social Networks](https://www.sciencedirect.com/science/article/abs/pii/S0899825610000217). *Games and Economic Behavior*.
- Watts, D. J., & Strogatz, S. H. (1998). [Collective dynamics of small-world networks](https://www.nature.com/articles/30918). *Nature*.
- Axelrod, R. (1997). [The Dissemination of Culture: A Model with Local Convergence and Global Polarization](https://journals.sagepub.com/doi/10.1177/0022002797041002001). *Journal of Conflict Resolution*.
- Allcott, H., & Gentzkow, M. (2017). [Social Media and Fake News in the 2016 Election](https://www.aeaweb.org/articles?id=10.1257%2Fjep.31.2.211). *Journal of Economic Perspectives*.
- Vosoughi, S., Roy, D., & Aral, S. (2018). [The Spread of True and False News Online](https://www.science.org/doi/10.1126/science.aap9559). *Science*.
- Papanastasiou, Y. (2020). [Fake News Propagation and Detection: A Sequential Model](https://pubsonline.informs.org/doi/10.1287/mnsc.2019.3295). *Management Science*.

## Design Principle

Use discrete local rules to approximate continuous strategic interaction; use visual patterns to expose abstract information structure; use small interventions to explore large-scale social emergence.

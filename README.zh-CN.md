# 信息元胞

[English README](./README.md) · [在线体验](https://ig.strangeattractor.life/)

信息元胞是一个交互式社会元胞自动机，用来观察信息、信念、声誉和网络结构如何共同演化。

这个项目刻意保持模型很小：它没有完整复刻贝叶斯推断或经济学博弈，而是把这些思想压缩成一组局部、离散、同步更新的规则。系统中的舆论团块、回音室、错误信息瀑布、声誉中心和极化边界都不是脚本写死的，而是从局部规则中涌现出来。

## 快速开始

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

项目使用 Vite、React 和 Canvas。Canvas 铺满视口，模拟网格会根据当前窗口尺寸重新生成。界面支持八门语言，`Theory` 按钮会打开理论基础和参考文献弹窗。

## 这是什么

信息元胞把一个社会表示为嵌入在网格中的图。

| 概念 | 在游戏中 |
| --- | --- |
| 格子 | 信息主体 |
| 邻域 | 主体可见的其他主体 |
| 状态 | 信念、消息、行动、声誉、类型、过滤器、能量 |
| 转移规则 | 根据私有信号和邻居消息局部更新 |
| 全局环境 | 隐藏二元真相 `theta` |

它更接近以下模型的混合：

- 元胞自动机：局部、离散、同步更新
- 社会学习：主体从邻居处更新判断
- 信息设计：平台规则改变什么被观察或放大
- 错误信息模型：强势或策略性主体会扭曲信息聚合
- 主体建模：宏观图样从局部规则中涌现

## 模型状态

每个主体 `i` 存储：

```text
X_i = (b_i, m_i, a_i, r_i, t_i, f_i, e_i)
```

| 符号 | 含义 | 取值 |
| --- | --- | --- |
| `b_i` | 信念 | `{-2, -1, 0, 1, 2}` |
| `m_i` | 公开消息 | `{-1, 0, 1}` |
| `a_i` | 行动 | `{0, 1}` |
| `r_i` | 声誉 | `{0, ..., 9}` |
| `t_i` | 主体类型 | 求真者、从众者、投机者、顽固者、核查者、机器人、煽动者 |
| `f_i` | 认知过滤器 | 离散加权规则 |
| `e_i` | 发言能量 | 有界整数资源 |

信念是离散的：

```text
-2  坚信状态为 0
-1  偏向 0
 0  不确定
 1  偏向 1
 2  坚信状态为 1
```

消息和行动被故意分开。主体可以相信一件事、说另一件事，或者选择沉默。这样模型不会退化成普通颜色感染。

## 隐藏真相与信号

每局都有一个隐藏状态：

```text
theta in {0, 1}
```

主体可能收到有噪声的私有信号：

```text
s_i in {0, 1}
```

信号让信念移动一个离散步长：

```text
if s_i = 1: b_i += 1
if s_i = 0: b_i -= 1
b_i = clip(b_i, -2, 2)
```

隐藏真相给模拟提供信息骨架。没有它，系统只会模拟阵营站队。

## 网络结构

底层图由三层组成：

1. **网格局部性**：主体观察周围 Moore 邻域。
2. **社群分区**：地图被分成区域；过滤器可以提高同社群消息权重。
3. **桥接边**：少量长程连接形成小世界捷径。

这对应 Watts 和 Strogatz 的直觉：大多数连接保持局部聚类，少数长程连接显著加速传播。在游戏中，这些捷径既可能纠正局部错误，也可能把谣言带到其他社群。

## 回合更新

所有主体同步更新。

### 1. 私有信号

每个主体以关卡参数决定的概率和准确率收到私有信号。核查者获得更强的真实信号。

### 2. 生成消息

基础规则是：

```text
if b_i >= 1: m_i 倾向于 1
if b_i <= -1: m_i 倾向于 -1
if b_i = 0:  m_i 倾向于 0
```

主体类型会修改规则：

| 类型 | 行为 |
| --- | --- |
| 求真者 | 只有高置信度时发言 |
| 从众者 | 跟随局部多数压力 |
| 投机者 | 对注意力和热门排序敏感 |
| 顽固者 | 抵抗反向压力 |
| 核查者 | 获得更强真实信号 |
| 机器人 | 推动固定策略性消息 |
| 煽动者 | 偏好强消息 |

### 3. 邻域聚合

每个节点聚合可见邻居消息：

```text
I_i = sum_{j in N(i)} w_ij * m_j
```

一个最小声誉加权规则是：

```text
w_ij = 1 + alpha * r_j
```

实现中还会根据认知过滤器、同社群偏好、热门排序、匿名机制和声誉可见性修改 `w_ij`。

### 4. 更新信念

信念由三类压力推动：

```text
b_i' = clip(b_i + P_i + C_i + A_i, -2, 2)
```

| 项 | 含义 |
| --- | --- |
| `P_i` | 私有信号压力 |
| `C_i` | 局部共识压力 |
| `A_i` | 注意力或极端化压力 |

不同类型有不同接受阈值。

### 5. 选择行动

行动来自信念，但不等于消息：

```text
if b_i >= 1: a_i = 1
if b_i <= -1: a_i = 0
if b_i = 0:  保持上一轮行动
```

四层分离是模型核心：

```text
真相 -> 信念 -> 消息 -> 行动
```

### 6. 更新声誉与能量

每隔若干回合会揭示局部结果：

- 被验证为真的发言提高声誉
- 高影响力错误发言降低声誉
- 剧烈反复横跳降低可信度
- 强发言消耗能量
- 注意力和准确性可以恢复能量

这会形成短期注意力和长期可信度之间的张力。

## 玩家控制

玩家不直接命令每个格子，而是改变机制并使用少量干预。

### 平台规则

| 规则 | 影响 |
| --- | --- |
| 显示声誉 | 让声誉成为可见影响力 |
| 热门优先 | 放大高注意力消息 |
| 跨区传播 | 允许社群之间的桥接曝光 |
| 匿名发言 | 削弱声誉惩罚 |
| 事实核查 | 引入高准确率纠偏节点 |

### 局部干预

| 干预 | 影响 |
| --- | --- |
| 真相种子 | 注入高置信度真实信号 |
| 核查节点 | 创建高准确率纠偏节点 |
| 假高信誉节点 | 创建策略性错误信息源 |
| 煽动者 | 创建强消息源 |
| 桥接边 | 增加跨社群连接 |

## 指标

游戏不使用单一的“感染全图”目标，而报告三条轴。

### 真相收敛

```text
T = (1 / n) * sum_i 1[a_i = theta]
```

### 极化

```text
P = Var_community(mean_b_c)
```

### 活跃度

```text
E = (1 / n) * sum_i 1[m_i != 0]
```

这些目标不等价。更高活跃度可能带来更高极化；压低极化可能减少发言；真相有时依靠声誉慢慢积累，而不是立刻依靠热度获胜。

## 关卡

| 关卡 | 重点 |
| --- | --- |
| 真相稀缺 | 可靠信号稀少 |
| 两极社群 | 初始社群偏见和回音室 |
| 匿名洪水 | 责任约束较弱 |
| 爆款平台 | 热门排序和信息瀑布 |
| 桥节点危机 | 被污染的跨社群连接 |
| 注意力市场 | 准确性和可见度之间的竞争 |

## 理论背景

当前实现不是任何单篇论文的直接复现，而是从多个理论传统中抽取机制并游戏化：

- **贝叶斯劝服与信息设计**：平台干预改变信号结构，而不是直接改变真相或效用。
- **贝叶斯相关均衡**：规则决定主体在发言和行动前能基于什么信息条件化决策。
- **非贝叶斯社会学习**：重复的邻居加权平均对应局部信念压力。
- **网络错误信息**：强势或顽固主体会扭曲信息聚合。
- **小世界网络**：稀疏长程边在保留局部聚类的同时加速扩散。
- **主体极化模型**：局部趋同规则仍然可能产生全局分裂。
- **经验性错误信息扩散**：在注意力激励下，错误或新奇信息可能以不同于真实信息的方式传播。

## 参考文献

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

## 设计原则

用离散局部规则近似连续的策略互动；用可视图样暴露抽象的信息结构；用少量干预探索大规模社会涌现。

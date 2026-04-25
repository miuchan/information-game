import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  FastForward,
  Globe2,
  Info,
  Languages,
  Network,
  Pause,
  Play,
  Radio,
  RefreshCcw,
  SearchCheck,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import './styles.css';

const CELL_SIZE = 18;
const SCENARIOS = ['scarce', 'polarized', 'anonymous', 'viral', 'bridge', 'market'];
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'pt', label: 'Português' },
];

const REFERENCES = [
  {
    title: 'Kamenica & Gentzkow (2011). Bayesian Persuasion',
    url: 'https://www.aeaweb.org/articles?id=10.1257%2Faer.101.6.2590',
  },
  {
    title: 'Bergemann & Morris (2016). Information Design, Bayesian Persuasion, and BCE',
    url: 'https://www.aeaweb.org/articles?id=10.1257%2Faer.p20161046',
  },
  {
    title: 'Bergemann & Morris (2016). Bayes Correlated Equilibrium and Comparison of Information Structures',
    url: 'https://economics.mit.edu/sites/default/files/publications/paper_79_bce.pdf',
  },
  {
    title: 'DeGroot, M. H. (1974). Reaching a Consensus',
    url: 'https://www.tandfonline.com/doi/abs/10.1080/01621459.1974.10480137',
  },
  {
    title: 'Golub & Jackson (2010). Naive Learning in Social Networks and the Wisdom of Crowds',
    url: 'https://bengolub.net/wp-content/uploads/2020/05/naivelearning-1.pdf',
  },
  {
    title: 'Acemoglu, Ozdaglar & ParandehGheibi (2010). Spread of (Mis)information in Social Networks',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0899825610000217',
  },
  {
    title: 'Granovetter, M. S. (1973). The Strength of Weak Ties',
    url: 'https://sociology.stanford.edu/publications/strength-weak-ties',
  },
  {
    title: 'Watts, D. J. & Strogatz, S. H. (1998). Collective dynamics of small-world networks',
    url: 'https://www.nature.com/articles/30918',
  },
  {
    title: 'Axelrod, R. (1997). The Dissemination of Culture',
    url: 'https://journals.sagepub.com/doi/10.1177/0022002797041002001',
  },
  {
    title: 'Bakshy, Messing & Adamic (2015). Exposure to Ideologically Diverse News and Opinion on Facebook',
    url: 'https://doi.org/10.1126/science.aaa1160',
  },
  {
    title: 'Allcott & Gentzkow (2017). Social Media and Fake News in the 2016 Election',
    url: 'https://www.aeaweb.org/articles?id=10.1257%2Fjep.31.2.211',
  },
  {
    title: 'Vosoughi, Roy & Aral (2018). The Spread of True and False News Online',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29590045/',
  },
  {
    title: 'Papanastasiou (2020). Fake News Propagation and Detection: A Sequential Model',
    url: 'https://pubsonline.informs.org/doi/10.1287/mnsc.2019.3295',
  },
  {
    title: 'Epstein, J. M. & Axtell, R. (1996). Growing Artificial Societies',
    url: 'https://mitpress.mit.edu/9780262550253/growing-artificial-societies/',
  },
  {
    title: 'Kahneman, D., Slovic, P. & Tversky, A. (1982). Judgment under Uncertainty',
    url: 'https://books.google.com/books/about/Judgment_Under_Uncertainty.html?id=_0H8gwj4a1MC',
  },
];

const COPY = {
  en: {
    meta: {
      eyebrow: 'Social cellular automaton',
      title: 'Info Cells',
      theory: 'Theory',
      language: 'Language',
      run: 'Run',
      pause: 'Pause',
      step: 'Step one tick',
      reset: 'Reset',
    },
    strip: {
      truth: 'Hidden truth theta =',
      tick: 'Tick',
      score: 'Score',
    },
    legend: ['Certain 0', 'Leans 0', 'Uncertain', 'Leans 1', 'Certain 1', 'High reputation / special node'],
    status: {
      title: 'Situation',
      truth: 'Truth alignment',
      active: 'Engagement',
      polar: 'Polarization pressure',
      support0: 'Supports 0',
      support1: 'Supports 1',
    },
    guide: {
      title: 'How to read the board',
      points: [
        'Cell color is private belief, from certain 0 to certain 1.',
        'A dot means the node is broadcasting a message this tick.',
        'Bright borders mark high reputation, fact-checkers, or bots.',
        'You are tuning platform rules and spending limited interventions.',
      ],
    },
    sections: {
      scenarios: 'Scenarios',
      mechanisms: 'Platform rules',
      interventions: 'Local interventions',
      node: 'Node inspector',
      speed: 'Speed',
    },
    scenarios: {
      scarce: 'Truth scarcity',
      polarized: 'Polarized blocs',
      anonymous: 'Anonymous flood',
      viral: 'Viral platform',
      bridge: 'Bridge crisis',
      market: 'Attention market',
    },
    mechanisms: {
      showReputation: 'Show reputation',
      hotRanking: 'Rank by heat',
      crossCommunity: 'Cross-community',
      anonymous: 'Anonymous speech',
      factCheck: 'Fact-checking',
    },
    interventions: {
      seedTrue: 'Truth seed',
      checker: 'Fact-checker',
      bot: 'Fake high-rep node',
      agitator: 'Agitator',
      bridgeEdge: 'Bridge edges',
    },
    node: {
      hint: 'Click a cell on the board to choose an intervention target.',
      coord: 'Position',
      type: 'Type',
      belief: 'Belief',
      message: 'Message',
      action: 'Action',
      reputation: 'Reputation',
      energy: 'Energy',
    },
    types: {
      truth: 'Truth-seeker',
      social: 'Conformist',
      attention: 'Opportunist',
      stubborn: 'Stubborn',
      agitator: 'Agitator',
      checker: 'Fact-checker',
      bot: 'Bot',
    },
    events: {
      newGame: 'New run: a hidden truth exists, and sparse private signals are scattered through the network.',
      reveal: ({ rewarded, punished }) => `Partial outcomes revealed: ${rewarded} nodes gained reputation; ${punished} were penalized for false high-impact speech.`,
      intervention: ({ x, y, label }) => `Deployed ${label} at (${x}, ${y}).`,
      bridge: 'Added cross-community bridge edges. The boundary is now more permeable.',
    },
    modal: {
      title: 'Theory of the Game',
      subtitle: 'A playable model of information design and information games: signals are scarce, speech is strategic, reputation is endogenous, and networks evolve through local interaction.',
      close: 'Close',
      pillarsTitle: 'Step 1: What this model is fundamentally about',
      pillars: [
        ['Information is not “injected” directly', 'In this model, you cannot overwrite any node’s belief from a god view. What you can control is how signals become visible, ranked, amplified, questioned, or verified. That is the central logic of information design and Bayesian persuasion: interventions act on information structure, not on truth itself. So when you deploy truth seeds, fact-checking, or anonymity rules, you are changing evidence arrival, credibility, and interpretive context, which shifts how different agent types infer from the same underlying state.'],
        ['Nodes can think one way, speak another, and act in a third', 'The literature stresses that information games are about incentive-shaped expression, not just information possession. The model therefore separates objective state, private belief, public message, and final action. A node may suspect content is false yet still share it for attention, in-group signaling, or reputation payoff; another may speak cautiously but act aggressively. This layered architecture generates cheap talk, strategic silence, signaling manipulation, and reputation masking in a natural way.'],
        ['Learning happens inside a network, not in a vacuum', 'Following DeGroot-style social learning, updates are embedded in topology: each node blends private evidence with neighbor messages under local weights. With healthy cross-group links, the system can aggregate dispersed information and approach collective intelligence. With concentrated influence, dense homophily, or biased high-reputation hubs, error can be amplified and stabilized. So the model studies not only information quality, but also how network structure transforms information as it travels.'],
        ['Diffusion rewrites its own future conditions', 'Propagation is a feedback system, not a one-shot event. Who gains attention, who gets checked, and who earns or loses reputation this round directly reshapes who is trusted next round. Misinformation research explains why emotionally salient content can dominate short-term reach first, then convert visibility into influence. It also explains long-run correction: repeated verification, bridge exposure, and reputation penalties can gradually reallocate influence. The core object is a rule-behavior-outcome-rule loop, not a single diffusion curve.'],
      ],
      domainsTitle: 'Step 2: Where each theory appears in gameplay',
      domains: [
        ['Bayesian persuasion (Kamenica & Gentzkow)', 'Truth seeds and fact-checking do not “write conclusions” into minds; they reshape who sees what evidence, when, and with what credibility. That is why hidden truth θ stays fixed while posterior pathways change across interventions, eventually changing action shares and reputation trajectories.'],
        ['Information structures and BCE (Bergemann & Morris)', 'From a BCE lens, platform rules define the conditionable information set before speech or action. If observability, anonymity, history visibility, or ranking changes, feasible correlation patterns and equilibrium distributions change with them. UI toggles are therefore information constraints in game-theoretic form.'],
        ['Social learning (DeGroot; Golub & Jackson)', 'Neighborhood aggregation is local weighted updating under bounded cognition, not globally optimal inference. The same mechanism can average out noise in well-connected networks, yet replicate bias under over-centralized influence or fragmented communities. This is why “good update rules” can still fail in bad structures.'],
        ['Network misinformation (Acemoglu et al.; Allcott & Gentzkow; Vosoughi et al.)', 'Diffusion choices are often reward-driven rather than truth-driven. Under anonymity, heat ranking, and emotional salience, forwarding payoff can exceed accuracy payoff, pushing suspicious content outward even without universal ignorance. Governance must therefore target both content reliability and incentive architecture.'],
        ['Network structure (Watts–Strogatz; Granovetter)', 'Homophily and clustering preserve local coherence but suppress cross-position correction; weak ties and bridge edges, though sparse, carry disproportionate cross-community flow. Adding bridges can reduce global error or spread contamination, depending on signal quality and reputation composition at both ends.'],
        ['Polarization and emergence (Axelrod; ABM tradition)', 'Polarization is not a scripted ending but a macro pattern emerging from iterated local adaptation. Agent-based modeling makes visible the micro-rationality / macro-imbalance tension: set local rules and topology, then observe path dependence, tipping points, and multiple stable regimes.'],
      ],
      loopTitle: 'Step 3: Read one tick as a causal pipeline',
      loop: ['Private signal intake (entry point: noisy but directional evidence)', 'Public message generation (expression layer: trade off truth, identity payoff, and reputation risk)', 'Neighborhood weighted aggregation (social layer: local topology converts messages into pressure)', 'Internal belief update (learning layer: combine private and social inputs into posterior judgment)', 'Action selection (behavior layer: whether to share, which side to support, and how much attention to spend)', 'Reputation and energy settlement (incentive layer: current outcomes update future constraints)'],
      referencesTitle: 'Related papers and books',
    },
  },
  zh: {
    meta: {
      eyebrow: '社会元胞自动机',
      title: '信息元胞',
      theory: '理论',
      language: '语言',
      run: '运行',
      pause: '暂停',
      step: '推进一回合',
      reset: '重开',
    },
    strip: {
      truth: '隐藏真相 theta =',
      tick: '第',
      score: '综合分',
    },
    legend: ['坚信 0', '偏向 0', '不确定', '偏向 1', '坚信 1', '高声誉/特殊节点'],
    status: {
      title: '局势',
      truth: '真相收敛',
      active: '讨论活跃',
      polar: '极化压力',
      support0: '支持 0',
      support1: '支持 1',
    },
    guide: {
      title: '如何读图',
      points: [
        '格子颜色表示内部信念，从坚信 0 到坚信 1。',
        '圆点表示该节点本回合正在对外发消息。',
        '亮边框表示高声誉、事实核查节点或机器人。',
        '你负责调整平台规则，并用有限预算做局部干预。',
      ],
    },
    sections: {
      scenarios: '关卡',
      mechanisms: '平台机制',
      interventions: '局部干预',
      node: '节点',
      speed: '速度',
    },
    scenarios: {
      scarce: '真相稀缺',
      polarized: '两极社群',
      anonymous: '匿名洪水',
      viral: '爆款平台',
      bridge: '桥节点危机',
      market: '注意力市场',
    },
    mechanisms: {
      showReputation: '显示声誉',
      hotRanking: '热门优先',
      crossCommunity: '跨区传播',
      anonymous: '匿名发言',
      factCheck: '事实核查',
    },
    interventions: {
      seedTrue: '真相种子',
      checker: '核查节点',
      bot: '假高信誉节点',
      agitator: '煽动者',
      bridgeEdge: '桥接边',
    },
    node: {
      hint: '点击地图上的格子选择干预点。',
      coord: '坐标',
      type: '类型',
      belief: '信念',
      message: '消息',
      action: '行动',
      reputation: '声誉',
      energy: '能量',
    },
    types: {
      truth: '求真者',
      social: '从众者',
      attention: '投机者',
      stubborn: '顽固者',
      agitator: '煽动者',
      checker: '核查者',
      bot: '机器人',
    },
    events: {
      newGame: '新局开始：隐藏真相已经生成，私有线索稀疏散落在网络中。',
      reveal: ({ rewarded, punished }) => `局部结果揭示：${rewarded} 个节点涨信誉，${punished} 个节点因错误传播受损。`,
      intervention: ({ x, y, label }) => `已在 (${x}, ${y}) 投放：${label}。`,
      bridge: '已新增一批跨社群桥边，边界开始变得更透气。',
    },
    modal: {
      title: '游戏理论基础',
      subtitle: '一个可玩的信息设计与信息博弈模型：信号稀缺、发言具有策略性、声誉内生形成，网络通过局部互动持续演化。',
      close: '关闭',
      pillarsTitle: '第一步：先理解这套模型在研究什么',
      pillars: [
        ['信息不是直接“灌输”的', '在这套模型里，玩家不能像“上帝视角”那样直接把某个观点写进节点脑中；你真正能动的，是信号如何被看见、被排序、被放大、被质疑。这个设定对应信息设计与贝叶斯劝服的核心：政策工具作用在“信息结构”而不是“真相本体”。因此，当你投放真相种子、开启核查或调整匿名机制时，本质是在改写证据到达概率、证据可信度与证据解释环境，进而让不同类型节点在同一事实下得出不同推断。'],
        ['节点会“想一套、说一套、做一套”', '参考文献反复强调，信息博弈的关键不在“人有没有信息”，而在“人如何基于激励去表达信息”。所以模型把真相、私有信念、公开发言与最终行动明确拆分：节点可能知道某件事未必真实，却为了流量、群体认同或声誉收益选择传播；也可能口头中立、行动偏激。这种分层结构使廉价谈话、策略性沉默、信号操纵、声誉伪装等现象自然出现，玩家看到的每条消息都不再等于“客观证据”，而是“证据 + 激励”共同产物。'],
        ['学习发生在网络里，而不是真空里', 'DeGroot 传统告诉我们，个体更新并非独立完成，而是嵌入关系网络中完成。这里每个节点都把私有信号与邻居消息按权重混合：在结构健康、跨群连接充分时，局部学习能逐步聚合分散信息，接近群体智慧；但在影响力高度集中、同温层过厚或高声誉节点偏误时，错误也会被“系统性放大”。也就是说，模型讨论的不只是“信息质量”，还包括“信息如何经由网络拓扑被加工”，这正是社会学习文献的中心议题。'],
        ['传播会反过来改写传播条件', '传播过程不是一次性事件，而是一个带反馈的动态系统：本轮谁获得关注、谁被核查、谁声誉上升，会直接改变下一轮谁更容易被相信、被转发、被模仿。对应到误信息研究，这解释了为什么短期里“情绪强、可传播性高”的内容常占上风——它会先赢得可见度，再赢得影响力；但也解释了为何长期仍可能出现纠偏——持续核查、跨圈桥接和信誉惩罚会逐步重配注意力。换言之，演化传播关注的是“规则—行为—结果—再规则”的闭环，而不只是单次扩散曲线。'],
      ],
      domainsTitle: '第二步：这些理论在游戏里分别落在哪',
      domains: [
        ['贝叶斯劝服（Kamenica & Gentzkow）', '你看到的“真相种子”“事实核查”并不是直接把结论灌输给节点，而是重塑节点接触证据的分布：谁先看到、看到多少、把它当成多可靠。这正是贝叶斯劝服的政策含义——设计信息披露机制以影响后续决策。在游戏里，它体现为：隐藏真相 θ 始终固定，但不同干预会改变节点后验信念形成路径，最终影响行动比例与声誉演化。'],
        ['信息结构与BCE（Bergemann & Morris）', '从 BCE 视角看，平台规则相当于在定义“可条件化的信息集合”：节点在发言或行动前究竟能观察到哪些变量、能否知道对方所处状态、是否能利用历史信誉。规则一变，可实现的策略相关性就会改变，系统可达到的均衡分布也会改变。换句话说，机制按钮并非 UI 装饰，而是在重写博弈的信息约束条件。'],
        ['社会学习（DeGroot；Golub & Jackson）', '每回合的邻域聚合对应局部加权更新：节点并不追求全局最优推断，而是在有限认知下吸收身边可得信息。文献中的“群体智慧”与“群体偏误”在这里都可重现：当网络连接均衡且噪声可控时，误差会被平均化；当中心节点过强、社群割裂严重时，偏误会被稳定复制。玩家因此能直观看到“正确方法在错误结构里也会失灵”。'],
        ['网络误信息（Acemoglu等；Allcott等；Vosoughi等）', '误信息扩散研究指出，传播决策常由社会回报驱动，而非真实性驱动。模型将这一点具体化为激励分离：在匿名、热门排序、情绪放大等机制下，节点可能因“转发收益”高于“准确收益”而倾向传播可疑内容。结果并非因为大家都无知，而是因为回报函数在奖励“被看见”而不是“说得对”。这也是为什么治理必须同时处理内容质量与平台激励。'],
        ['网络结构（Watts & Strogatz；Granovetter）', '网络结构决定信息命运：同温层与高聚类能维持圈内一致，却会削弱跨立场校正；弱连接与桥接边虽数量少，却承担跨社群传输的关键通道。游戏里加桥既可能带来纠偏，也可能把局部污染带到全网，完全取决于桥两端的信号质量与声誉分布。这一“结构中性、结果条件化”的特征，正是复杂网络文献强调的核心。'],
        ['极化与涌现（Axelrod；ABM传统）', '极化并不是预设剧情，而是由微观规则长期迭代后涌现出的宏观形态：个体在局部互动中追求短期适应，系统却可能走向长期分裂。ABM 的价值就在于把这种“微观理性—宏观失衡”的张力可视化：你不需要手动设定结局，只需设定行为规则与连接结构，系统就会自己生成路径依赖、临界转折与多稳态结果。'],
      ],
      loopTitle: '第三步：带着理论看一轮更新',
      loop: ['接收私有信号（信息入口：节点获得噪声化但有方向性的初始证据）', '生成公开消息（表达层：节点在真实性、立场收益与声誉风险之间做策略取舍）', '邻域加权聚合（社会影响：本地网络把邻居表达转成可感知“多数压力”）', '更新内部信念（学习结果：节点将私有证据与社会输入合成后验判断）', '选择行动（行为输出：是否传播、支持哪一侧、是否继续投入注意力）', '结算声誉与能量（长期激励：本轮后果进入信誉与资源账户，塑造下一轮决策边界）'],
      referencesTitle: '相关论文与专著',
    },
  },
};

Object.assign(COPY, {
  es: {
    meta: { eyebrow: 'Autómata celular social', title: 'Celdas de Info', theory: 'Teoría', language: 'Idioma', run: 'Ejecutar', pause: 'Pausa', step: 'Avanzar un turno', reset: 'Reiniciar' },
    strip: { truth: 'Verdad oculta theta =', tick: 'Turno', score: 'Puntuación' },
    legend: ['Certeza 0', 'Inclina a 0', 'Incierto', 'Inclina a 1', 'Certeza 1', 'Alta reputación / nodo especial'],
    status: { title: 'Situación', truth: 'Alineación con la verdad', active: 'Participación', polar: 'Presión de polarización', support0: 'Apoya 0', support1: 'Apoya 1' },
    guide: { title: 'Cómo leer el tablero', points: ['El color de la celda es la creencia privada, de certeza 0 a certeza 1.', 'Un punto significa que el nodo está emitiendo un mensaje en este turno.', 'Los bordes brillantes marcan alta reputación, verificadores o bots.', 'Ajustas reglas de plataforma y gastas intervenciones limitadas.'] },
    sections: { scenarios: 'Escenarios', mechanisms: 'Reglas de plataforma', interventions: 'Intervenciones locales', node: 'Inspector de nodo', speed: 'Velocidad' },
    scenarios: { scarce: 'Escasez de verdad', polarized: 'Bloques polarizados', anonymous: 'Inundación anónima', viral: 'Plataforma viral', bridge: 'Crisis de puentes', market: 'Mercado de atención' },
    mechanisms: { showReputation: 'Mostrar reputación', hotRanking: 'Ordenar por calor', crossCommunity: 'Entre comunidades', anonymous: 'Habla anónima', factCheck: 'Verificación' },
    interventions: { seedTrue: 'Semilla de verdad', checker: 'Verificador', bot: 'Nodo falso de alta reputación', agitator: 'Agitador', bridgeEdge: 'Puentes' },
    node: { hint: 'Haz clic en una celda para elegir un objetivo de intervención.', coord: 'Posición', type: 'Tipo', belief: 'Creencia', message: 'Mensaje', action: 'Acción', reputation: 'Reputación', energy: 'Energía' },
    types: { truth: 'Buscador de verdad', social: 'Conformista', attention: 'Oportunista', stubborn: 'Obstinado', agitator: 'Agitador', checker: 'Verificador', bot: 'Bot' },
    events: { newGame: 'Nueva partida: existe una verdad oculta y señales privadas dispersas en la red.', reveal: ({ rewarded, punished }) => `Resultados parciales revelados: ${rewarded} nodos ganaron reputación; ${punished} fueron penalizados por difundir falsedad.`, intervention: ({ x, y, label }) => `Se desplegó ${label} en (${x}, ${y}).`, bridge: 'Se añadieron puentes entre comunidades. La frontera es más permeable.' },
    modal: { title: 'Teoría del juego', subtitle: 'Un modelo jugable de diseño de información y juegos de información: señales escasas, habla estratégica, reputación endógena y redes que evolucionan por interacción local.', close: 'Cerrar', pillarsTitle: 'Paso 1: qué estudia realmente este modelo', pillars: [['La información no se “inyecta” de forma directa', 'Aquí no puedes reescribir creencias desde arriba: solo puedes cambiar visibilidad, ranking, anonimato y verificación. Eso sigue la lógica de diseño de información y persuasión bayesiana: se interviene sobre la estructura informativa, no sobre la verdad en sí. Por eso una misma verdad oculta puede producir inferencias distintas según cómo circula la evidencia.'], ['Pensar, decir y actuar pueden separarse', 'La literatura de juegos de información subraya que no basta con “tener datos”; importa cómo los incentivos moldean la expresión. El modelo separa estado real, creencia privada, mensaje público y acción final. Así aparecen conversación barata, silencio estratégico, señalización y camuflaje reputacional.'], ['El aprendizaje ocurre en red', 'Siguiendo DeGroot, cada nodo combina señal privada y mensajes de vecinos con pesos locales. Con puentes sanos entre grupos, la red agrega información y corrige ruido; con influencia concentrada o homofilia extrema, amplifica sesgos. El foco no es solo la calidad de la señal, sino cómo la topología la transforma.'], ['La difusión cambia sus propias condiciones', 'No es un evento único sino un sistema con retroalimentación: atención, chequeo y reputación de hoy alteran quién será creíble mañana. Eso explica por qué el contenido emocional puede dominar en el corto plazo y por qué la verificación repetida puede corregir en el largo plazo.']], domainsTitle: 'Paso 2: dónde entra cada teoría en el juego', domains: [['Persuasión bayesiana (Kamenica y Gentzkow)', 'Semillas de verdad y fact-checking no cambian la verdad oculta θ; cambian quién observa qué evidencia, cuándo y con qué credibilidad.'], ['Estructuras de información y BCE (Bergemann y Morris)', 'Las reglas de plataforma definen el conjunto de información condicionable antes de hablar o actuar. Cambiar reglas cambia resultados estratégicos posibles.'], ['Aprendizaje social (DeGroot; Golub y Jackson)', 'La agregación vecinal es actualización ponderada local bajo racionalidad limitada. Puede generar sabiduría colectiva o error persistente según la estructura de red.'], ['Desinformación en red (Acemoglu; Allcott y Gentzkow; Vosoughi)', 'Muchas decisiones de difusión maximizan recompensa social, no veracidad. En anonimato y ranking por calor, la ganancia de compartir puede superar la ganancia de acertar.'], ['Estructura de red (Watts-Strogatz; Granovetter)', 'Homofilia y clústeres reducen corrección cruzada; vínculos débiles y puentes, aunque escasos, cargan gran parte del flujo intercomunitario.'], ['Polarización y emergencia (Axelrod; ABM)', 'La polarización no está guionada: emerge de iteraciones locales. El tablero permite observar dependencia de trayectoria, puntos de inflexión y múltiples estados estables.']], loopTitle: 'Paso 3: leer un turno como canal causal', loop: ['Señal privada (entrada: evidencia ruidosa pero orientada)', 'Mensaje público (expresión: equilibrio entre verdad, identidad y riesgo reputacional)', 'Agregación vecinal (capa social: la red convierte mensajes en presión local)', 'Actualización de creencia (capa de aprendizaje: integrar señal privada y social)', 'Elección de acción (capa conductual: difundir, apoyar y asignar atención)', 'Actualización de reputación/energía (capa de incentivos: este turno condiciona el siguiente)'], referencesTitle: 'Artículos y libros relacionados' },
  },
  fr: {
    meta: { eyebrow: 'Automate cellulaire social', title: 'Cellules Info', theory: 'Théorie', language: 'Langue', run: 'Lancer', pause: 'Pause', step: 'Avancer', reset: 'Réinitialiser' },
    strip: { truth: 'Vérité cachée theta =', tick: 'Tour', score: 'Score' },
    legend: ['Certain 0', 'Penche 0', 'Incertain', 'Penche 1', 'Certain 1', 'Forte réputation / nœud spécial'],
    status: { title: 'Situation', truth: 'Alignement avec la vérité', active: 'Engagement', polar: 'Pression de polarisation', support0: 'Soutient 0', support1: 'Soutient 1' },
    guide: { title: 'Lire le plateau', points: ['La couleur indique la croyance privée.', 'Un point signifie que le nœud diffuse un message ce tour.', 'Les bordures brillantes signalent réputation élevée, vérificateurs ou bots.', 'Vous réglez les règles de plateforme et dépensez des interventions limitées.'] },
    sections: { scenarios: 'Scénarios', mechanisms: 'Règles de plateforme', interventions: 'Interventions locales', node: 'Inspecteur de nœud', speed: 'Vitesse' },
    scenarios: { scarce: 'Vérité rare', polarized: 'Blocs polarisés', anonymous: 'Déluge anonyme', viral: 'Plateforme virale', bridge: 'Crise des ponts', market: 'Marché de l’attention' },
    mechanisms: { showReputation: 'Afficher réputation', hotRanking: 'Classer par chaleur', crossCommunity: 'Intercommunauté', anonymous: 'Parole anonyme', factCheck: 'Vérification' },
    interventions: { seedTrue: 'Graine de vérité', checker: 'Vérificateur', bot: 'Faux nœud réputé', agitator: 'Agitateur', bridgeEdge: 'Ponts' },
    node: { hint: 'Cliquez une cellule pour choisir une cible.', coord: 'Position', type: 'Type', belief: 'Croyance', message: 'Message', action: 'Action', reputation: 'Réputation', energy: 'Énergie' },
    types: { truth: 'Chercheur de vérité', social: 'Conformiste', attention: 'Opportuniste', stubborn: 'Obstiné', agitator: 'Agitateur', checker: 'Vérificateur', bot: 'Bot' },
    events: { newGame: 'Nouvelle partie : une vérité cachée existe et des signaux privés sont dispersés dans le réseau.', reveal: ({ rewarded, punished }) => `Résultats partiels : ${rewarded} nœuds gagnent en réputation ; ${punished} sont pénalisés.`, intervention: ({ x, y, label }) => `${label} déployé en (${x}, ${y}).`, bridge: 'Des ponts intercommunautaires ont été ajoutés.' },
    modal: { title: 'Théorie du jeu', subtitle: 'Un modèle jouable de design de l’information et de jeux d’information : signaux rares, parole stratégique, réputation endogène et réseaux évolutifs.', close: 'Fermer', pillarsTitle: 'Étape 1 : ce que ce modèle étudie réellement', pillars: [['L’information n’est pas injectée directement', 'Le joueur ne réécrit pas les croyances depuis une vue omnisciente : il ajuste visibilité, classement, anonymat et vérification. C’est la logique du design de l’information et de la persuasion bayésienne : agir sur la structure informationnelle plutôt que sur la vérité elle-même.'], ['Penser, dire et agir peuvent diverger', 'Les jeux d’information portent sur l’expression sous incitations, pas seulement sur la possession d’information. Le modèle sépare état réel, croyance privée, message public et action finale, ce qui fait émerger parole stratégique, silence opportuniste, signalement et gestion de réputation.'], ['L’apprentissage est réseauté', 'À la manière de DeGroot, chaque nœud combine signal privé et messages voisins avec des poids locaux. Avec de bons ponts intergroupes, l’erreur se corrige ; avec influence concentrée et forte homophilie, le biais se stabilise.'], ['La diffusion modifie ses propres conditions', 'La dynamique est récursive : attention, contrôle et réputation d’un tour reconfigurent la crédibilité du tour suivant. On obtient ainsi la tension entre domination de la saillance à court terme et correction progressive par vérification répétée.']], domainsTitle: 'Étape 2 : où chaque théorie apparaît dans le jeu', domains: [['Persuasion bayésienne (Kamenica & Gentzkow)', 'Les graines de vérité et le fact-checking changent l’accès, le timing et la crédibilité des preuves, sans toucher à la vérité cachée θ.'], ['Structures d’information et BCE (Bergemann & Morris)', 'Les règles de plateforme définissent l’ensemble d’information conditionnable avant parole et action ; modifier ces règles change les résultats stratégiques atteignables.'], ['Apprentissage social (DeGroot ; Golub & Jackson)', 'L’agrégation locale est une mise à jour pondérée sous rationalité limitée. Selon la structure, elle produit sagesse collective ou mésapprentissage persistant.'], ['Désinformation en réseau (Acemoglu ; Allcott & Gentzkow ; Vosoughi)', 'La diffusion maximise souvent un gain social plutôt qu’un gain de vérité ; anonymat et classement par chaleur renforcent cette dissociation.'], ['Structure de réseau (Watts-Strogatz ; Granovetter)', 'Homophilie et clusters réduisent la correction croisée, alors que liens faibles et ponts portent l’essentiel du flux intercommunautaire.'], ['Polarisation et émergence (Axelrod ; ABM)', 'La polarisation n’est pas scriptée : elle émerge d’interactions locales répétées, avec dépendance de trajectoire et points de bascule.']], loopTitle: 'Étape 3 : lire un tour comme un pipeline causal', loop: ['Signal privé (entrée : preuve bruitée mais orientée)', 'Message public (expression : arbitrage entre vérité, identité et risque réputationnel)', 'Agrégation de voisinage (couche sociale : le réseau transforme les messages en pression locale)', 'Mise à jour de croyance (couche d’apprentissage : fusion des entrées privées et sociales)', 'Choix d’action (couche comportementale : partager, soutenir, allouer l’attention)', 'Mise à jour réputation/énergie (couche d’incitation : le présent contraint le prochain tour)'], referencesTitle: 'Articles et ouvrages liés' },
  },
  de: {
    meta: { eyebrow: 'Sozialer Zellautomat', title: 'Info-Zellen', theory: 'Theorie', language: 'Sprache', run: 'Start', pause: 'Pause', step: 'Ein Schritt', reset: 'Zurücksetzen' },
    strip: { truth: 'Verborgene Wahrheit theta =', tick: 'Runde', score: 'Punktzahl' },
    legend: ['Sicher 0', 'Tendenz 0', 'Unsicher', 'Tendenz 1', 'Sicher 1', 'Hohe Reputation / Spezialknoten'],
    status: { title: 'Lage', truth: 'Wahrheitsabgleich', active: 'Engagement', polar: 'Polarisationsdruck', support0: 'Unterstützt 0', support1: 'Unterstützt 1' },
    guide: { title: 'So liest man das Feld', points: ['Zellfarbe zeigt private Überzeugung.', 'Ein Punkt bedeutet: Der Knoten sendet in dieser Runde.', 'Helle Ränder markieren hohe Reputation, Faktenprüfer oder Bots.', 'Du steuerst Plattformregeln und begrenzte Eingriffe.'] },
    sections: { scenarios: 'Szenarien', mechanisms: 'Plattformregeln', interventions: 'Lokale Eingriffe', node: 'Knoteninspektor', speed: 'Tempo' },
    scenarios: { scarce: 'Wahrheit knapp', polarized: 'Polarisierte Blöcke', anonymous: 'Anonyme Flut', viral: 'Virale Plattform', bridge: 'Brückenkrise', market: 'Aufmerksamkeitsmarkt' },
    mechanisms: { showReputation: 'Reputation zeigen', hotRanking: 'Nach Hitze ranken', crossCommunity: 'Gemeinschaftsübergreifend', anonymous: 'Anonym sprechen', factCheck: 'Faktenprüfung' },
    interventions: { seedTrue: 'Wahrheitssamen', checker: 'Faktenprüfer', bot: 'Falscher Top-Knoten', agitator: 'Agitator', bridgeEdge: 'Brücken' },
    node: { hint: 'Klicke eine Zelle als Eingriffsziel.', coord: 'Position', type: 'Typ', belief: 'Glaube', message: 'Nachricht', action: 'Aktion', reputation: 'Reputation', energy: 'Energie' },
    types: { truth: 'Wahrheitssucher', social: 'Konformist', attention: 'Opportunist', stubborn: 'Stur', agitator: 'Agitator', checker: 'Faktenprüfer', bot: 'Bot' },
    events: { newGame: 'Neuer Lauf: Eine verborgene Wahrheit existiert, private Signale sind im Netzwerk verstreut.', reveal: ({ rewarded, punished }) => `Teilergebnisse: ${rewarded} Knoten gewinnen Reputation; ${punished} werden bestraft.`, intervention: ({ x, y, label }) => `${label} bei (${x}, ${y}) eingesetzt.`, bridge: 'Gemeinschaftsübergreifende Brücken wurden hinzugefügt.' },
    modal: { title: 'Theorie des Spiels', subtitle: 'Ein spielbares Modell von Informationsdesign und Informationsspielen: knappe Signale, strategische Rede, endogene Reputation und lokale Netzwerkentwicklung.', close: 'Schließen', pillarsTitle: 'Schritt 1: Was dieses Modell eigentlich untersucht', pillars: [['Information wird nicht direkt „eingespritzt“', 'Du kannst Überzeugungen nicht von oben überschreiben, sondern nur Sichtbarkeit, Ranking, Anonymität und Verifikation steuern. Genau das ist die Kernidee von Informationsdesign und bayesscher Persuasion: Eingriffe verändern die Informationsstruktur, nicht die Wahrheit selbst.'], ['Denken, Sprechen und Handeln können auseinanderfallen', 'Informationsspiele drehen sich um anreizgesteuerten Ausdruck. Darum trennt das Modell objektiven Zustand, privaten Glauben, öffentliche Botschaft und finale Handlung. So entstehen strategische Kommunikation, Schweigen, Signaling und Reputationsmaskierung.'], ['Lernen findet im Netzwerk statt', 'Im DeGroot-Sinn kombiniert jeder Knoten privates Signal und Nachbarschaftsbotschaften mit lokalen Gewichten. Mit guten Brücken kann die Menge Fehler ausmitteln; mit starker Homophilie oder Einflusskonzentration werden Verzerrungen verstärkt.'], ['Diffusion verändert ihre eigenen Bedingungen', 'Aufmerksamkeit, Prüfung und Reputation einer Runde prägen die Glaubwürdigkeit der nächsten Runde. Dadurch wird die Spannung zwischen kurzfristiger Salienzdominanz und langfristiger Korrektur durch wiederholte Verifikation sichtbar.']], domainsTitle: 'Schritt 2: Wo die Theorien im Spiel auftauchen', domains: [['Bayessche Persuasion (Kamenica & Gentzkow)', 'Wahrheitssaat und Faktenprüfung verändern Zugang, Timing und Glaubwürdigkeit von Evidenz, nicht den verborgenen Zustand θ.'], ['Informationsstrukturen und BCE (Bergemann & Morris)', 'Plattformregeln definieren, welche Information vor Rede und Handlung konditionierbar ist; Regelwechsel verschieben damit den Raum möglicher strategischer Ergebnisse.'], ['Soziales Lernen (DeGroot; Golub & Jackson)', 'Lokale Aggregation ist gewichtetes Updating unter begrenzter Rationalität. Je nach Struktur entsteht kollektive Weisheit oder persistentes Fehllernen.'], ['Netzwerk-Desinformation (Acemoglu u.a.; Allcott & Gentzkow; Vosoughi u.a.)', 'Verbreitungsentscheidungen optimieren oft sozialen Ertrag statt Wahrheitswert; Anonymität und Heat-Ranking verstärken diese Entkopplung.'], ['Netzwerkstruktur (Watts-Strogatz; Granovetter)', 'Homophilie und Cluster schwächen Gegenkorrektur, während schwache Bindungen und Brückenkanten überproportionalen intergruppalen Fluss tragen.'], ['Polarisierung und Emergenz (Axelrod; ABM)', 'Polarisierung ist kein Script-Ende, sondern entsteht aus wiederholten lokalen Interaktionen mit Pfadabhängigkeit und Kipppunkten.']], loopTitle: 'Schritt 3: Eine Runde als kausale Pipeline lesen', loop: ['Privates Signal (Eingang: verrauschte, aber gerichtete Evidenz)', 'Öffentliche Botschaft (Ausdruck: Trade-off zwischen Wahrheit, Identität und Reputationsrisiko)', 'Nachbarschaftsaggregation (soziale Schicht: Netzwerk macht aus Botschaften lokalen Druck)', 'Glaubensupdate (Lernschicht: private und soziale Eingänge werden zusammengeführt)', 'Aktionswahl (Verhaltensschicht: teilen, unterstützen, Aufmerksamkeit einsetzen)', 'Reputations-/Energie-Update (Anreizschicht: Gegenwart begrenzt die nächste Runde)'], referencesTitle: 'Verwandte Arbeiten und Bücher' },
  },
  ja: {
    meta: { eyebrow: '社会セル・オートマトン', title: '情報セル', theory: '理論', language: '言語', run: '実行', pause: '一時停止', step: '1ターン進む', reset: 'リセット' },
    strip: { truth: '隠れた真実 theta =', tick: 'ターン', score: 'スコア' },
    legend: ['確信 0', '0 寄り', '不確実', '1 寄り', '確信 1', '高評判 / 特殊ノード'],
    status: { title: '状況', truth: '真実との一致', active: 'エンゲージメント', polar: '分極圧力', support0: '0 支持', support1: '1 支持' },
    guide: { title: '盤面の読み方', points: ['セルの色は私的信念を表します。', '点はそのノードがこのターン発信していることを示します。', '明るい枠は高評判、ファクトチェッカー、ボットです。', 'あなたは平台ルールと限られた介入を調整します。'] },
    sections: { scenarios: 'シナリオ', mechanisms: 'プラットフォーム規則', interventions: '局所介入', node: 'ノード情報', speed: '速度' },
    scenarios: { scarce: '真実の希少性', polarized: '分極ブロック', anonymous: '匿名洪水', viral: 'バイラル平台', bridge: '橋ノード危機', market: '注意市場' },
    mechanisms: { showReputation: '評判を表示', hotRanking: '熱量で推薦', crossCommunity: 'コミュニティ間', anonymous: '匿名発言', factCheck: 'ファクトチェック' },
    interventions: { seedTrue: '真実の種', checker: '検証ノード', bot: '偽高評判ノード', agitator: '扇動者', bridgeEdge: '橋エッジ' },
    node: { hint: 'セルをクリックして介入先を選びます。', coord: '位置', type: 'タイプ', belief: '信念', message: 'メッセージ', action: '行動', reputation: '評判', energy: 'エネルギー' },
    types: { truth: '真実探求者', social: '同調者', attention: '機会主義者', stubborn: '頑固者', agitator: '扇動者', checker: '検証者', bot: 'ボット' },
    events: { newGame: '新規開始：隠れた真実が存在し、私的信号がネットワークに散在しています。', reveal: ({ rewarded, punished }) => `部分結果：${rewarded} ノードが評判上昇、${punished} ノードが罰を受けました。`, intervention: ({ x, y, label }) => `${label} を (${x}, ${y}) に配置しました。`, bridge: 'コミュニティ間の橋を追加しました。' },
    modal: { title: 'ゲームの理論基盤', subtitle: '情報設計と情報ゲームの遊べるモデル：希少な信号、戦略的発話、内生的評判、局所相互作用で進化するネットワーク。', close: '閉じる', pillarsTitle: '第1段階：このモデルが本当に扱う問い', pillars: [['情報は直接「注入」されない', 'このモデルでは、プレイヤーはノードの信念を直接書き換えません。操作できるのは可視性、ランキング、匿名性、検証強度であり、変える対象は真実そのものではなく情報構造です。これは情報設計とベイズ説得の中核で、同じ隠れた状態でも証拠の到達条件が変われば推論結果が変わることを示します。'], ['考えること・話すこと・行うことは一致しない', '情報ゲーム文献が強調するのは、情報保有よりもインセンティブ下での表現行動です。そこで本モデルは客観状態、私的信念、公開発話、最終行動を分離します。これにより、安価な談話、戦略的沈黙、シグナリング、評判偽装といった現象が自然に生じます。'], ['学習はネットワーク内で起こる', 'DeGroot 型の更新として、各ノードは私的信号と近傍メッセージを局所重みで統合します。橋が機能する構造では誤差が平均化されますが、同質性が強く影響力が集中すると偏りが固定化されます。つまり焦点は信号品質だけでなく、トポロジーが情報をどう加工するかです。'], ['拡散は次の拡散条件を作り替える', '拡散は一回限りではなく、フィードバックを持つ動学です。今ターンの注目、検証、評判が次ターンの信頼分布を再配置します。そのため短期では感情的内容が優位でも、反復検証や橋接触の蓄積で長期的補正が起こり得ます。']], domainsTitle: '第2段階：理論がゲーム内で現れる位置', domains: [['ベイズ説得（Kamenica & Gentzkow）', '真実の種とファクトチェックは、隠れた真実 θ を変えずに、誰がどの証拠をいつどの信頼度で受け取るかを変えます。'], ['情報構造とBCE（Bergemann & Morris）', 'プラットフォーム規則は、発話・行動前に条件化可能な情報集合を定義します。規則変更は到達可能な戦略結果集合を変えます。'], ['社会学習（DeGroot；Golub & Jackson）', '近傍集約は限定合理性下の局所加重更新です。ネットワーク次第で集合知にも持続的誤学習にもなります。'], ['ネットワーク誤情報（Acemoglu ほか；Allcott & Gentzkow；Vosoughi ほか）', '拡散行動は真実利得より社会的利得を最大化しやすく、匿名性と熱量ランキングはその乖離を強めます。'], ['ネットワーク構造（Watts-Strogatz；Granovetter）', '同質性とクラスターは相互修正を弱め、弱い紐帯と橋辺は希少でも大きな越境フローを担います。'], ['分極と創発（Axelrod；ABM）', '分極は脚本的終局ではなく、局所相互作用の反復から創発するマクロ結果です。経路依存と転換点が観察対象になります。']], loopTitle: '第3段階：1ターンを因果パイプラインとして読む', loop: ['私的信号受信（入力層：ノイズを含む方向性証拠）', '公開メッセージ生成（表現層：真実・同一性・評判リスクのトレードオフ）', '近傍加重集約（社会層：ネットワークがメッセージを局所圧力へ変換）', '内部信念更新（学習層：私的入力と社会入力の統合）', '行動選択（行動層：拡散・支持・注意配分）', '評判/エネルギー更新（誘因層：現在結果が次ターン制約を形成）'], referencesTitle: '関連論文・書籍' },
  },
  ko: {
    meta: { eyebrow: '사회 셀룰러 오토마타', title: '정보 셀', theory: '이론', language: '언어', run: '실행', pause: '일시정지', step: '한 턴 진행', reset: '초기화' },
    strip: { truth: '숨은 진실 theta =', tick: '턴', score: '점수' },
    legend: ['확신 0', '0 쪽', '불확실', '1 쪽', '확신 1', '높은 평판 / 특수 노드'],
    status: { title: '상황', truth: '진실 정렬', active: '참여도', polar: '양극화 압력', support0: '0 지지', support1: '1 지지' },
    guide: { title: '보드 읽기', points: ['셀 색은 사적 믿음을 나타냅니다.', '점은 해당 노드가 이번 턴에 메시지를 내보낸다는 뜻입니다.', '밝은 테두리는 높은 평판, 팩트체커, 봇을 표시합니다.', '플랫폼 규칙을 조정하고 제한된 개입을 사용합니다.'] },
    sections: { scenarios: '시나리오', mechanisms: '플랫폼 규칙', interventions: '지역 개입', node: '노드 검사', speed: '속도' },
    scenarios: { scarce: '진실 희소성', polarized: '양극화 블록', anonymous: '익명 홍수', viral: '바이럴 플랫폼', bridge: '브리지 위기', market: '주의 시장' },
    mechanisms: { showReputation: '평판 표시', hotRanking: '열기순 추천', crossCommunity: '커뮤니티 간', anonymous: '익명 발언', factCheck: '팩트체크' },
    interventions: { seedTrue: '진실 씨앗', checker: '팩트체커', bot: '가짜 고평판 노드', agitator: '선동자', bridgeEdge: '브리지' },
    node: { hint: '셀을 클릭해 개입 대상을 선택하세요.', coord: '위치', type: '유형', belief: '믿음', message: '메시지', action: '행동', reputation: '평판', energy: '에너지' },
    types: { truth: '진실 추구자', social: '동조자', attention: '기회주의자', stubborn: '완고함', agitator: '선동자', checker: '팩트체커', bot: '봇' },
    events: { newGame: '새 실행: 숨은 진실이 있고 사적 신호가 네트워크에 흩어져 있습니다.', reveal: ({ rewarded, punished }) => `부분 결과: ${rewarded}개 노드 평판 상승, ${punished}개 노드가 처벌되었습니다.`, intervention: ({ x, y, label }) => `${label}을 (${x}, ${y})에 배치했습니다.`, bridge: '커뮤니티 간 브리지를 추가했습니다.' },
    modal: { title: '게임 이론 기반', subtitle: '정보 설계와 정보 게임의 플레이 가능한 모델: 희소한 신호, 전략적 발화, 내생적 평판, 지역 상호작용으로 진화하는 네트워크.', close: '닫기', pillarsTitle: '1단계: 이 모델이 실제로 다루는 질문', pillars: [['정보는 직접 “주입”되지 않는다', '이 모델에서 플레이어는 노드의 믿음을 직접 덮어쓰지 못합니다. 조절 가능한 것은 가시성, 랭킹, 익명성, 검증 강도이며, 개입 대상은 진실 자체가 아니라 정보 구조입니다. 이는 정보 설계와 베이지안 설득의 핵심으로, 같은 숨은 상태라도 증거 도달 구조가 달라지면 추론 결과가 달라짐을 보여줍니다.'], ['생각·발화·행동은 분리될 수 있다', '정보 게임 문헌은 정보 보유보다 인센티브 하 표현을 중시합니다. 그래서 모델은 객관 상태, 사적 믿음, 공개 메시지, 최종 행동을 분리합니다. 이 분리가 값싼 대화, 전략적 침묵, 신호 조작, 평판 위장 같은 현상을 만들어 냅니다.'], ['학습은 네트워크 속에서 일어난다', 'DeGroot식으로 각 노드는 사적 신호와 이웃 메시지를 지역 가중치로 통합합니다. 집단 간 브리지가 건강하면 잡음이 상쇄되지만, 동질성 과다와 영향력 집중이 있으면 편향이 고착됩니다. 핵심은 신호 품질만이 아니라 구조가 정보를 어떻게 변환하는가입니다.'], ['확산은 다음 확산 조건을 바꾼다', '확산은 일회성 이벤트가 아니라 피드백 시스템입니다. 이번 턴의 주목, 검증, 평판이 다음 턴의 신뢰 지형을 재구성합니다. 그래서 단기적으로는 감정적 콘텐츠가 우세해도, 반복 검증과 교차 노출이 장기 교정을 만들 수 있습니다.']], domainsTitle: '2단계: 각 이론이 게임에서 나타나는 지점', domains: [['베이지안 설득 (Kamenica & Gentzkow)', '진실 씨앗과 팩트체크는 숨은 진실 θ를 바꾸지 않고, 누가 어떤 증거를 언제 어떤 신뢰도로 받는지 바꿉니다.'], ['정보 구조와 BCE (Bergemann & Morris)', '플랫폼 규칙은 발화·행동 전에 조건화 가능한 정보 집합을 정의하며, 규칙 변화는 가능한 전략 결과 집합을 바꿉니다.'], ['사회학습 (DeGroot; Golub & Jackson)', '이웃 집계는 제한 합리성 하의 지역 가중 업데이트입니다. 네트워크에 따라 집단 지성도, 지속적 오학습도 가능합니다.'], ['네트워크 오정보 (Acemoglu 등; Allcott & Gentzkow; Vosoughi 등)', '확산 결정은 진실 보상보다 사회적 보상을 극대화하기 쉽고, 익명성·열기 랭킹은 그 괴리를 확대합니다.'], ['네트워크 구조 (Watts-Strogatz; Granovetter)', '동질성과 클러스터는 교차 교정을 약화시키고, 약한 연결과 브리지는 적어도 집단 간 흐름을 크게 담당합니다.'], ['양극화와 창발 (Axelrod; ABM)', '양극화는 스크립트 결말이 아니라 미시 상호작용 반복에서 창발하는 거시 패턴이며, 경로 의존성과 임계 전환이 핵심 관찰 대상입니다.']], loopTitle: '3단계: 한 턴을 인과 파이프라인으로 읽기', loop: ['사적 신호 수신 (입력층: 잡음이 있지만 방향성 있는 증거)', '공개 메시지 생성 (표현층: 진실·정체성·평판 리스크의 절충)', '이웃 가중 집계 (사회층: 네트워크가 메시지를 지역 압력으로 변환)', '내부 믿음 갱신 (학습층: 사적·사회적 입력 통합)', '행동 선택 (행동층: 확산, 지지, 주의 배분)', '평판/에너지 갱신 (유인층: 현재 결과가 다음 턴 제약 형성)'], referencesTitle: '관련 논문과 저서' },
  },
  pt: {
    meta: { eyebrow: 'Autômato celular social', title: 'Células Info', theory: 'Teoria', language: 'Idioma', run: 'Rodar', pause: 'Pausar', step: 'Avançar turno', reset: 'Reiniciar' },
    strip: { truth: 'Verdade oculta theta =', tick: 'Turno', score: 'Pontuação' },
    legend: ['Certo 0', 'Tende a 0', 'Incerto', 'Tende a 1', 'Certo 1', 'Alta reputação / nó especial'],
    status: { title: 'Situação', truth: 'Alinhamento à verdade', active: 'Engajamento', polar: 'Pressão de polarização', support0: 'Apoia 0', support1: 'Apoia 1' },
    guide: { title: 'Como ler o tabuleiro', points: ['A cor da célula é a crença privada.', 'Um ponto significa que o nó está transmitindo neste turno.', 'Bordas claras indicam alta reputação, verificadores ou bots.', 'Você ajusta regras da plataforma e usa intervenções limitadas.'] },
    sections: { scenarios: 'Cenários', mechanisms: 'Regras da plataforma', interventions: 'Intervenções locais', node: 'Inspetor de nó', speed: 'Velocidade' },
    scenarios: { scarce: 'Escassez de verdade', polarized: 'Blocos polarizados', anonymous: 'Enxurrada anônima', viral: 'Plataforma viral', bridge: 'Crise de pontes', market: 'Mercado de atenção' },
    mechanisms: { showReputation: 'Mostrar reputação', hotRanking: 'Classificar por calor', crossCommunity: 'Entre comunidades', anonymous: 'Fala anônima', factCheck: 'Checagem' },
    interventions: { seedTrue: 'Semente de verdade', checker: 'Verificador', bot: 'Nó falso de alta reputação', agitator: 'Agitador', bridgeEdge: 'Pontes' },
    node: { hint: 'Clique em uma célula para escolher o alvo.', coord: 'Posição', type: 'Tipo', belief: 'Crença', message: 'Mensagem', action: 'Ação', reputation: 'Reputação', energy: 'Energia' },
    types: { truth: 'Buscador da verdade', social: 'Conformista', attention: 'Oportunista', stubborn: 'Teimoso', agitator: 'Agitador', checker: 'Verificador', bot: 'Bot' },
    events: { newGame: 'Nova rodada: há uma verdade oculta e sinais privados espalhados pela rede.', reveal: ({ rewarded, punished }) => `Resultados parciais: ${rewarded} nós ganharam reputação; ${punished} foram penalizados.`, intervention: ({ x, y, label }) => `${label} implantado em (${x}, ${y}).`, bridge: 'Pontes entre comunidades foram adicionadas.' },
    modal: { title: 'Teoria do jogo', subtitle: 'Um modelo jogável de design de informação e jogos de informação: sinais escassos, fala estratégica, reputação endógena e redes que evoluem localmente.', close: 'Fechar', pillarsTitle: 'Passo 1: o que este modelo realmente investiga', pillars: [['Informação não é “injetada” diretamente', 'Neste modelo, você não sobrescreve crenças de cima para baixo. O que pode ajustar é visibilidade, ranking, anonimato e verificação; ou seja, você altera a estrutura informacional, não a verdade em si. Essa é a ideia central de design de informação e persuasão bayesiana.'], ['Pensar, dizer e agir podem divergir', 'A literatura de jogos de informação mostra que o ponto central é expressão sob incentivos. Por isso o modelo separa estado objetivo, crença privada, mensagem pública e ação final. Dessa separação surgem fala estratégica, silêncio oportunista, sinalização e camuflagem reputacional.'], ['Aprendizado ocorre em rede', 'No espírito de DeGroot, cada nó combina sinal privado e mensagens vizinhas com pesos locais. Com pontes saudáveis entre grupos, o erro tende a ser amortecido; com homofilia alta e influência concentrada, vieses se cristalizam.'], ['Difusão altera suas próprias condições futuras', 'A difusão é um sistema com retroalimentação: atenção, checagem e reputação de hoje redefinem quem será confiável amanhã. Isso explica domínio de conteúdo saliente no curto prazo e possíveis correções via verificação repetida no longo prazo.']], domainsTitle: 'Passo 2: onde cada teoria entra no jogo', domains: [['Persuasão bayesiana (Kamenica & Gentzkow)', 'Sementes de verdade e fact-checking não mudam a verdade oculta θ; mudam quem recebe qual evidência, quando e com que credibilidade.'], ['Estruturas de informação e BCE (Bergemann & Morris)', 'As regras da plataforma definem o conjunto de informação condicionável antes de fala e ação. Alterar regras altera o espaço de resultados estratégicos possíveis.'], ['Aprendizado social (DeGroot; Golub & Jackson)', 'A agregação local é atualização ponderada sob racionalidade limitada. Dependendo da rede, pode haver sabedoria coletiva ou erro persistente.'], ['Desinformação em rede (Acemoglu et al.; Allcott & Gentzkow; Vosoughi et al.)', 'A decisão de compartilhar frequentemente maximiza retorno social, não veracidade; anonimato e ranking por calor ampliam essa separação.'], ['Estrutura de rede (Watts-Strogatz; Granovetter)', 'Homofilia e clusters reduzem correção cruzada, enquanto laços fracos e pontes, embora raros, carregam grande fluxo entre comunidades.'], ['Polarização e emergência (Axelrod; tradição ABM)', 'Polarização não é fim roteirizado: emerge de interações locais repetidas, com dependência de trajetória e pontos de virada.']], loopTitle: 'Passo 3: ler um turno como pipeline causal', loop: ['Sinal privado (entrada: evidência ruidosa, mas direcional)', 'Mensagem pública (expressão: trade-off entre verdade, identidade e risco reputacional)', 'Agregação de vizinhança (camada social: a rede converte mensagens em pressão local)', 'Atualização de crença (camada de aprendizado: fusão de entradas privadas e sociais)', 'Escolha de ação (camada comportamental: compartilhar, apoiar, alocar atenção)', 'Atualização de reputação/energia (camada de incentivo: o presente condiciona o próximo turno)'], referencesTitle: 'Artigos e livros relacionados' },
  },
});

function makeRng(seed) {
  let x = seed || 123456789;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const sign = (value) => (value > 0 ? 1 : value < 0 ? -1 : 0);
const actionFromBelief = (belief) => (belief >= 1 ? 1 : belief <= -1 ? 0 : null);
const idx = (x, y, width) => y * width + x;
const coord = (i, width) => [i % width, Math.floor(i / width)];

function viewportGrid() {
  if (typeof window === 'undefined') return { width: 80, height: 45, cellSize: CELL_SIZE };
  return {
    width: Math.max(24, Math.ceil(window.innerWidth / CELL_SIZE)),
    height: Math.max(18, Math.ceil(window.innerHeight / CELL_SIZE)),
    cellSize: CELL_SIZE,
  };
}

function communityOf(x, y, width, height) {
  return (x >= width / 2 ? 1 : 0) + (y >= height / 2 ? 2 : 0);
}

function buildNeighbors(rng, width, height, crossCommunity = true) {
  const total = width * height;
  const neighbors = Array.from({ length: total }, () => []);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const here = idx(x, y, width);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) neighbors[here].push(idx(nx, ny, width));
        }
      }
    }
  }

  if (crossCommunity) {
    for (let i = 0; i < total; i += 1) {
      if (rng() < 0.075) {
        const [x, y] = coord(i, width);
        const c = communityOf(x, y, width, height);
        let target = Math.floor(rng() * total);
        for (let tries = 0; tries < 30; tries += 1) {
          const [tx, ty] = coord(target, width);
          if (communityOf(tx, ty, width, height) !== c) break;
          target = Math.floor(rng() * total);
        }
        neighbors[i].push(target);
      }
    }
  }
  return neighbors;
}

function createWorld(seed = Date.now(), scenarioId = 'scarce', dimensions = viewportGrid()) {
  const rng = makeRng(seed);
  const truth = rng() > 0.5 ? 1 : 0;
  const settings = scenarioSettings(scenarioId);
  const nodes = [];
  const { width, height, cellSize } = dimensions;
  const scenarioBias = {
    scarce: 0,
    polarized: 1,
    anonymous: 0,
    viral: 0,
    bridge: -1,
    market: 0,
  }[scenarioId];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const community = communityOf(x, y, width, height);
      const localBias = scenarioId === 'polarized' || scenarioId === 'bridge'
        ? (community % 2 === 0 ? -1 : 1)
        : scenarioBias;
      const roll = rng();
      const type = roll < 0.22 ? 'truth' : roll < 0.58 ? 'social' : roll < 0.82 ? 'attention' : 'stubborn';
      const privateSignal = rng() < settings.initialSignalRate
        ? (rng() < settings.initialSignalAccuracy ? truth : 1 - truth)
        : null;
      const signalPush = privateSignal === null ? 0 : privateSignal === 1 ? 1 : -1;
      const belief = clamp(localBias + signalPush + (rng() < 0.12 ? (rng() > 0.5 ? 1 : -1) : 0), -2, 2);
      nodes.push({
        id: idx(x, y, width),
        x,
        y,
        community,
        belief,
        prevBelief: belief,
        message: belief > 0 ? 1 : belief < 0 ? -1 : 0,
        action: actionFromBelief(belief),
        reputation: Math.floor(1 + rng() * 4),
        type,
        filter: Math.floor(rng() * 4),
        energy: 3 + Math.floor(rng() * 4),
        lastFlip: 0,
        attention: 0,
        checked: false,
        evidenceMemory: 0,
        accuracyStreak: 0,
      });
    }
  }

  if (scenarioId === 'bridge') {
    const cx = Math.floor(width / 2);
    const y0 = Math.max(0, Math.floor(height * 0.38));
    const y1 = Math.min(height, Math.floor(height * 0.62));
    for (let y = y0; y < y1; y += 1) {
      [cx - 1, cx, cx + 1].forEach((x) => {
        if (x < 0 || x >= width) return;
        const node = nodes[idx(x, y, width)];
        node.belief = truth === 1 ? -2 : 2;
        node.message = truth === 1 ? -1 : 1;
        node.action = actionFromBelief(node.belief);
        node.type = 'attention';
        node.reputation = 5;
      });
    }
  }

  return {
    seed,
    rng,
    width,
    height,
    cellSize,
    truth,
    tick: 0,
    nodes,
    neighbors: buildNeighbors(rng, width, height, true),
    event: { key: 'newGame' },
  };
}

function scenarioSettings(id) {
  return {
    scarce: { initialSignalRate: 0.1, initialSignalAccuracy: 0.62, signalRate: 0.05, signalAccuracy: 0.76, attentionBoost: 1, publicEvidenceRate: 0.2 },
    polarized: { initialSignalRate: 0.36, initialSignalAccuracy: 0.6, signalRate: 0.046, signalAccuracy: 0.74, attentionBoost: 1, publicEvidenceRate: 0.18 },
    anonymous: { initialSignalRate: 0.34, initialSignalAccuracy: 0.59, signalRate: 0.044, signalAccuracy: 0.73, attentionBoost: 1.15, publicEvidenceRate: 0.14 },
    viral: { initialSignalRate: 0.33, initialSignalAccuracy: 0.58, signalRate: 0.04, signalAccuracy: 0.72, attentionBoost: 1.7, publicEvidenceRate: 0.14 },
    bridge: { initialSignalRate: 0.34, initialSignalAccuracy: 0.6, signalRate: 0.045, signalAccuracy: 0.74, attentionBoost: 1.25, publicEvidenceRate: 0.18 },
    market: { initialSignalRate: 0.32, initialSignalAccuracy: 0.58, signalRate: 0.041, signalAccuracy: 0.72, attentionBoost: 1.45, publicEvidenceRate: 0.16 },
  }[id];
}

function generateMessage(node, oldNodes, neighbors, options, rng) {
  if (node.type === 'checker') return node.belief === 0 ? 0 : sign(node.belief);
  if (node.type === 'bot') return node.message || 1;
  const local = neighbors[node.id].reduce((sum, ni) => sum + oldNodes[ni].message, 0);
  let msg = 0;
  if (node.type === 'truth') {
    msg = Math.abs(node.belief) >= 2 ? sign(node.belief) : 0;
  } else if (node.type === 'social') {
    msg = Math.abs(local) >= 2 ? sign(local) : sign(node.belief);
  } else if (node.type === 'attention') {
    msg = Math.abs(node.belief) >= 1 ? sign(node.belief) : (local === 0 ? 0 : sign(local));
    if (options.hotRanking && rng() < 0.18) msg = local >= 0 ? 1 : -1;
  } else if (node.type === 'stubborn') {
    msg = Math.abs(node.belief) >= 1 && rng() > 0.35 ? sign(node.belief) : 0;
  } else if (node.type === 'agitator') {
    msg = node.belief >= 0 ? 1 : -1;
  }
  if (node.energy <= 0 && node.type !== 'checker') return 0;
  return msg;
}

function pressureFor(node, oldNodes, neighbors, options) {
  let pressure = 0;
  let heard = 0;
  neighbors[node.id].forEach((ni) => {
    const other = oldNodes[ni];
    if (other.message === 0) return;
    let weight = options.showReputation ? 0.2 + other.reputation * 0.25 : 1;
    if (options.hotRanking) weight += Math.min(2.4, other.attention * 0.18);
    if (node.filter === 0 && other.reputation >= 4) weight += 0.7;
    if (node.filter === 1 && other.community === node.community) weight += 0.8;
    if (node.filter === 2 && Math.abs(other.message) > 0) weight += 0.25;
    if (node.filter === 3 && other.community !== node.community) weight *= 0.72;
    if (options.anonymous) weight = 1 + (options.hotRanking ? Math.min(1.4, other.attention * 0.15) : 0);
    const evidenceBacked = Math.abs(other.evidenceMemory || 0) >= 3 && sign(other.evidenceMemory || 0) === other.message;
    if (evidenceBacked) weight += 0.9;
    pressure += weight * other.message;
    heard += 1;
  });
  return heard === 0 ? 0 : pressure / Math.max(1, Math.pow(heard, 0.75));
}

function stepWorld(world, options, scenarioId) {
  const rng = world.rng;
  const settings = scenarioSettings(scenarioId);
  const oldNodes = world.nodes;
  let event = null;
  const neighbors = options.crossCommunity ? world.neighbors : world.neighbors.map((list, i) => {
    const own = oldNodes[i].community;
    return list.filter((j) => oldNodes[j].community === own);
  });

  const messaged = oldNodes.map((node) => ({
    ...node,
    prevBelief: node.belief,
    message: generateMessage(node, oldNodes, neighbors, options, rng),
  }));

  const revealTick = (world.tick + 1) % 5 === 0;
  const truthPush = world.truth === 1 ? 1 : -1;

  const nodes = messaged.map((node) => {
    let privatePush = 0;
    const rate = node.type === 'checker' ? settings.signalRate * 8 : settings.signalRate;
    const accuracy = node.type === 'checker' ? 0.92 : settings.signalAccuracy;
    if (rng() < rate) {
      const signal = rng() < accuracy ? world.truth : 1 - world.truth;
      privatePush = signal === 1 ? 1 : -1;
    }

    if (options.factCheck && node.checked) privatePush += truthPush;
    if (options.factCheck && revealTick && (node.checked || rng() < 0.28)) privatePush += truthPush;

    let evidenceMemory = clamp((node.evidenceMemory || 0) + privatePush, -5, 5);
    if (privatePush === 0 && evidenceMemory !== 0 && rng() < 0.08) evidenceMemory -= sign(evidenceMemory);

    const pressure = pressureFor(node, messaged, neighbors, options);
    let threshold = 1.2;
    if (node.type === 'truth') threshold = 2.2;
    if (node.type === 'social') threshold = 0.85;
    if (node.type === 'attention') threshold = 1.05 / settings.attentionBoost;
    if (node.type === 'stubborn') threshold = 2.8;
    if (node.type === 'checker') threshold = 1.9;
    if (node.type === 'bot') threshold = 9;

    let socialPush = Math.abs(pressure) >= threshold ? sign(pressure) : 0;
    if (Math.abs(evidenceMemory) >= 3) {
      socialPush = 0;
      privatePush = sign(evidenceMemory);
    }
    if (node.type === 'stubborn' && socialPush !== sign(node.belief)) socialPush = 0;

    const attentionPush = options.hotRanking && node.type === 'attention' && Math.abs(pressure) > 2.6 ? sign(pressure) : 0;
    let nextBelief = clamp(node.belief + privatePush + socialPush + attentionPush, -2, 2);
    if (Math.abs(nextBelief) === 2 && rng() < 0.005) nextBelief -= sign(nextBelief);

    if (revealTick && rng() < settings.publicEvidenceRate) {
      evidenceMemory = clamp(evidenceMemory + truthPush, -5, 5);
      if (node.type === 'truth' || node.type === 'checker') nextBelief = clamp(nextBelief + truthPush, -2, 2);
    }

    const nextAction = actionFromBelief(nextBelief);
    const spent = node.message === 0 ? 0 : node.type === 'attention' || node.type === 'agitator' ? 2 : 1;
    const attention = Math.max(0, Math.round(Math.abs(pressure) + (node.message !== 0 ? 1 : 0)));
    return {
      ...node,
      belief: nextBelief,
      action: nextAction,
      lastFlip: sign(nextBelief) !== sign(node.prevBelief) ? world.tick + 1 : node.lastFlip,
      energy: clamp(node.energy - spent + (attention >= 3 ? 1 : 0), 0, 9),
      attention,
      evidenceMemory,
    };
  });

  if (revealTick) {
    let rewarded = 0;
    let punished = 0;
    nodes.forEach((node) => {
      const saidTruth = node.message !== 0 && (node.message === 1) === (world.truth === 1);
      const saidFalse = node.message !== 0 && !saidTruth;
      if (saidTruth) {
        node.reputation = clamp(node.reputation + 1, 0, 9);
        node.energy = clamp(node.energy + 1, 0, 9);
        node.accuracyStreak = (node.accuracyStreak || 0) + 1;
        rewarded += 1;
      }
      if (saidFalse) {
        node.accuracyStreak = 0;
        if (!options.anonymous || options.factCheck) {
          node.reputation = clamp(node.reputation - (node.attention >= 3 ? 2 : 1), 0, 9);
          punished += 1;
        }
      }
      if (!saidTruth && !saidFalse && node.message === 0) node.accuracyStreak = 0;
      if ((node.accuracyStreak || 0) >= 3 && node.type !== 'bot') {
        if (node.type === 'attention') node.type = 'truth';
        node.checked = true;
      }
      if (node.belief !== node.prevBelief && Math.abs(node.belief - node.prevBelief) >= 2) {
        node.reputation = clamp(node.reputation - 1, 0, 9);
      }
    });
    event = { key: 'reveal', data: { rewarded, punished } };
  }

  return {
    ...world,
    tick: world.tick + 1,
    nodes,
    event: event || world.event,
  };
}

function getMetrics(world) {
  const total = world.nodes.length || 1;
  const acted = world.nodes.filter((n) => n.action !== null);
  const truthAligned = acted.length ? acted.filter((n) => n.action === world.truth).length / acted.length : 0;
  const active = world.nodes.filter((n) => n.message !== 0).length / total;
  const avgRep = world.nodes.reduce((sum, n) => sum + n.reputation, 0) / total;
  const communityMeans = [0, 1, 2, 3].map((c) => {
    const list = world.nodes.filter((n) => n.community === c);
    return list.length ? list.reduce((sum, n) => sum + n.belief, 0) / list.length : 0;
  });
  const globalMean = communityMeans.reduce((sum, v) => sum + v, 0) / 4;
  const polarization = communityMeans.reduce((sum, v) => sum + (v - globalMean) ** 2, 0) / 4 / 4;
  const positive = world.nodes.filter((n) => n.belief > 0).length / total;
  const negative = world.nodes.filter((n) => n.belief < 0).length / total;
  const undecided = world.nodes.filter((n) => n.action === null).length / total;
  return { truthAligned, active, avgRep, polarization, positive, negative, undecided };
}

function applyIntervention(world, kind, targetId) {
  const nodes = world.nodes.map((n) => ({ ...n }));
  const node = nodes[targetId ?? Math.floor(world.rng() * nodes.length)];
  if (!node) return world;
  if (kind === 'seedTrue') {
    node.belief = world.truth === 1 ? 2 : -2;
    node.message = world.truth === 1 ? 1 : -1;
    node.action = actionFromBelief(node.belief);
    node.energy = 9;
    node.reputation = clamp(node.reputation + 1, 0, 9);
  }
  if (kind === 'checker') {
    node.type = 'checker';
    node.checked = true;
    node.reputation = 7;
    node.belief = world.truth === 1 ? 2 : -2;
    node.message = world.truth === 1 ? 1 : -1;
    node.action = actionFromBelief(node.belief);
  }
  if (kind === 'bot') {
    node.type = 'bot';
    node.reputation = 5;
    node.energy = 9;
    node.belief = world.truth === 1 ? -2 : 2;
    node.message = world.truth === 1 ? -1 : 1;
    node.action = actionFromBelief(node.belief);
  }
  if (kind === 'agitator') {
    node.type = 'agitator';
    node.reputation = 4;
    node.energy = 9;
    node.belief = node.belief >= 0 ? 2 : -2;
    node.message = sign(node.belief);
    node.action = actionFromBelief(node.belief);
  }
  return {
    ...world,
    nodes,
    event: {
      key: 'intervention',
      data: { x: node.x + 1, y: node.y + 1, labelKey: kind },
    },
  };
}

function addBridge(world) {
  const rng = world.rng;
  const neighbors = world.neighbors.map((list) => [...list]);
  const total = world.nodes.length;
  for (let k = 0; k < Math.max(18, Math.round(total * 0.014)); k += 1) {
    const a = Math.floor(rng() * total);
    const [ax, ay] = coord(a, world.width);
    let b = Math.floor(rng() * total);
    for (let tries = 0; tries < 40; tries += 1) {
      const [bx, by] = coord(b, world.width);
      if (communityOf(ax, ay, world.width, world.height) !== communityOf(bx, by, world.width, world.height)) break;
      b = Math.floor(rng() * total);
    }
    neighbors[a].push(b);
    neighbors[b].push(a);
  }
  return { ...world, neighbors, event: { key: 'bridge' } };
}

const INTERVENTIONS = {
  seedTrue: { icon: Sparkles, cost: 1 },
  checker: { icon: SearchCheck, cost: 2 },
  bot: { icon: Bot, cost: 2 },
  agitator: { icon: Radio, cost: 1 },
};

function CellCanvas({ world, selected, onSelect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const widthPx = world.width * world.cellSize;
    const heightPx = world.height * world.cellSize;
    canvas.width = widthPx * dpr;
    canvas.height = heightPx * dpr;
    canvas.style.width = `${widthPx}px`;
    canvas.style.height = `${heightPx}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const cell = world.cellSize;
    ctx.fillStyle = '#101316';
    ctx.fillRect(0, 0, widthPx, heightPx);

    world.nodes.forEach((node) => {
      const palette = {
        '-2': '#b93848',
        '-1': '#df8376',
        0: '#d9d6c8',
        1: '#6ab8a5',
        2: '#178f78',
      };
      ctx.fillStyle = palette[node.belief];
      ctx.fillRect(node.x * cell + 0.5, node.y * cell + 0.5, cell - 1, cell - 1);
      if (node.message !== 0) {
        ctx.fillStyle = node.message > 0 ? '#e9fff7' : '#fff1ef';
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(node.x * cell + cell * 0.5, node.y * cell + cell * 0.5, Math.max(1.2, cell * 0.16), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (node.reputation >= 6 || node.type === 'checker' || node.type === 'bot') {
        ctx.strokeStyle = node.type === 'checker' ? '#f1c84c' : node.type === 'bot' ? '#7b5cf0' : 'rgba(255,255,255,.7)';
        ctx.lineWidth = Math.max(1, cell * 0.12);
        ctx.strokeRect(node.x * cell + 1, node.y * cell + 1, cell - 2, cell - 2);
      }
    });

    if (selected !== null) {
      const node = world.nodes[selected];
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(node.x * cell + 1.5, node.y * cell + 1.5, cell - 3, cell - 3);
    }
  }, [world, selected]);

  function handleClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * world.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * world.height);
    onSelect(idx(clamp(x, 0, world.width - 1), clamp(y, 0, world.height - 1), world.width));
  }

  return <canvas className="world-canvas" ref={canvasRef} onClick={handleClick} aria-label="信息传播元胞地图" />;
}

function Meter({ label, value, tone = 'green' }) {
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <strong>{Math.round(value * 100)}%</strong>
      </div>
      <div className="meter-track">
        <div className={`meter-fill ${tone}`} style={{ width: `${clamp(value * 100, 0, 100)}%` }} />
      </div>
    </div>
  );
}

function ToggleButton({ active, icon: Icon, children, onClick }) {
  return (
    <button className={`toggle ${active ? 'active' : ''}`} onClick={onClick} type="button">
      <Icon size={17} />
      <span>{children}</span>
    </button>
  );
}

function getEventText(event, copy) {
  if (!event) return '';
  const renderer = copy.events[event.key];
  if (!renderer) return '';
  if (typeof renderer === 'string') return renderer;
  const data = { ...(event.data || {}) };
  if (data.labelKey) data.label = copy.interventions[data.labelKey];
  return renderer(data);
}

function TheoryModal({ copy, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="theory-modal" role="dialog" aria-modal="true" aria-labelledby="theory-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div>
            <p className="eyebrow">{copy.meta.theory}</p>
            <h2 id="theory-title">{copy.modal.title}</h2>
            <p>{copy.modal.subtitle}</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button" title={copy.modal.close}>
            <X size={18} />
          </button>
        </header>

        <div className="modal-grid">
          <article className="modal-section">
            <div className="block-title">
              <Info size={18} />
              <h3>{copy.modal.pillarsTitle}</h3>
            </div>
            <div className="pillar-list">
              {copy.modal.pillars.map(([title, body]) => (
                <div key={title}>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="modal-section">
            <div className="block-title">
              <Activity size={18} />
              <h3>{copy.modal.loopTitle}</h3>
            </div>
            <ol className="loop-list">
              {copy.modal.loop.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </article>

          <article className="modal-section wide">
            <div className="block-title">
              <Network size={18} />
              <h3>{copy.modal.domainsTitle}</h3>
            </div>
            <div className="domain-grid">
              {copy.modal.domains.map(([title, body]) => (
                <div key={title}>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="modal-section wide">
            <div className="block-title">
              <BookOpen size={18} />
              <h3>{copy.modal.referencesTitle}</h3>
            </div>
            <div className="reference-list">
              {REFERENCES.map((item) => (
                <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [locale, setLocale] = useState('en');
  const [showTheory, setShowTheory] = useState(false);
  const [hideControls, setHideControls] = useState(false);
  const [scenario, setScenario] = useState('scarce');
  const [dimensions, setDimensions] = useState(() => viewportGrid());
  const [world, setWorld] = useState(() => createWorld(Date.now(), 'scarce', viewportGrid()));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(180);
  const [selected, setSelected] = useState(null);
  const [budget, setBudget] = useState(9);
  const [options, setOptions] = useState({
    showReputation: true,
    hotRanking: false,
    crossCommunity: true,
    anonymous: false,
    factCheck: false,
  });

  const metrics = useMemo(() => getMetrics(world), [world]);
  const selectedNode = selected === null ? null : world.nodes[selected];
  const copy = COPY[locale];
  const eventText = getEventText(world.event, copy);
  const controlsToggleTitle = hideControls ? 'Show controls' : 'Hide controls';

  useEffect(() => {
    let resizeTimer = null;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const next = viewportGrid();
        setDimensions(next);
        setWorld(createWorld(Date.now(), scenario, next));
        setSelected(null);
      }, 180);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [scenario]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setWorld((current) => stepWorld(current, options, scenario));
    }, speed);
    return () => clearInterval(id);
  }, [running, speed, options, scenario]);

  function reset(nextScenario = scenario) {
    setScenario(nextScenario);
    setWorld(createWorld(Date.now(), nextScenario, dimensions));
    setRunning(false);
    setSelected(null);
    setBudget(9);
  }

  function intervene(kind) {
    const item = INTERVENTIONS[kind];
    if (budget < item.cost) return;
    setBudget((b) => b - item.cost);
    setWorld((current) => applyIntervention(current, kind, selected));
  }

  const score = Math.round((metrics.truthAligned * 0.55 + (1 - metrics.polarization) * 0.3 + metrics.active * 0.15) * 100);

  return (
    <main className="app-shell">
      <CellCanvas world={world} selected={selected} onSelect={setSelected} />
      <button
        className="icon-button ui-toggle-button"
        onClick={() => setHideControls((value) => !value)}
        type="button"
        title={controlsToggleTitle}
        aria-label={controlsToggleTitle}
      >
        {hideControls ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>

      {!hideControls ? (
        <>
          <aside className="left-hud-panel">
            <section className="panel-block guide-card">
              <div className="block-title">
                <Globe2 size={18} />
                <h2>{copy.guide.title}</h2>
              </div>
              <ul>
                {copy.guide.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </section>

            <section className="panel-block compact">
              <label htmlFor="speed">{copy.sections.speed}</label>
              <input id="speed" type="range" min="60" max="520" step="20" value={580 - speed} onChange={(e) => setSpeed(580 - Number(e.target.value))} />
            </section>

            <section className="panel-block node-card">
              <div className="block-title">
                <Radio size={18} />
                <h2>{copy.sections.node}</h2>
              </div>
              {selectedNode ? (
                <div className="node-grid">
                  <span>{copy.node.coord}</span><strong>{selectedNode.x + 1}, {selectedNode.y + 1}</strong>
                  <span>{copy.node.type}</span><strong>{copy.types[selectedNode.type]}</strong>
                  <span>{copy.node.belief}</span><strong>{selectedNode.belief}</strong>
                  <span>{copy.node.message}</span><strong>{selectedNode.message}</strong>
                  <span>{copy.node.action}</span><strong>{selectedNode.action ?? 'undecided'}</strong>
                  <span>{copy.node.reputation}</span><strong>{selectedNode.reputation}</strong>
                  <span>{copy.node.energy}</span><strong>{selectedNode.energy}</strong>
                </div>
              ) : (
                <p className="hint">{copy.node.hint}</p>
              )}
            </section>
          </aside>

          <section className="board-panel">
            <header className="topbar">
              <div>
                <p className="eyebrow">{copy.meta.eyebrow}</p>
                <h1>{copy.meta.title}</h1>
              </div>
              <div className="top-actions">
                <button className="text-button" onClick={() => setShowTheory(true)} type="button">
                  <BookOpen size={17} />
                  <span>{copy.meta.theory}</span>
                </button>
                <a className="icon-button" href="https://github.com/miuchan/information-game" target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub repository">
                  <FaGithub size={18} />
                </a>
                <label className="language-select" title={copy.meta.language}>
                  <Languages size={17} />
                  <select value={locale} onChange={(event) => setLocale(event.target.value)} aria-label={copy.meta.language}>
                    {LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="icon-button primary" onClick={() => setRunning((v) => !v)} type="button" title={running ? copy.meta.pause : copy.meta.run}>
                  {running ? <Pause size={19} /> : <Play size={19} />}
                </button>
                <button className="icon-button" onClick={() => setWorld((current) => stepWorld(current, options, scenario))} type="button" title={copy.meta.step}>
                  <FastForward size={18} />
                </button>
                <button className="icon-button" onClick={() => reset()} type="button" title={copy.meta.reset}>
                  <RefreshCcw size={18} />
                </button>
              </div>
            </header>

            <div className="truth-strip">
              <div>
                <Target size={18} />
                <span>{copy.strip.truth} {world.truth}</span>
              </div>
              <div>
                <Activity size={18} />
                <span>{copy.strip.tick} {world.tick}</span>
              </div>
              <div>
                <Zap size={18} />
                <span>{copy.strip.score} {score}</span>
              </div>
            </div>

            <div className="legend">
              <span><i className="c red" />{copy.legend[0]}</span>
              <span><i className="c pink" />{copy.legend[1]}</span>
              <span><i className="c neutral" />{copy.legend[2]}</span>
              <span><i className="c mint" />{copy.legend[3]}</span>
              <span><i className="c green" />{copy.legend[4]}</span>
              <span><i className="ring" />{copy.legend[5]}</span>
            </div>
          </section>

          <aside className="control-panel">
        <section className="panel-block status">
          <div className="block-title">
            <Brain size={18} />
            <h2>{copy.status.title}</h2>
          </div>
          <Meter label={copy.status.truth} value={metrics.truthAligned} />
          <Meter label={copy.status.active} value={metrics.active} tone="yellow" />
          <Meter label={copy.status.polar} value={metrics.polarization} tone="red" />
          <div className="split-stat">
            <span>{copy.status.support0}: {Math.round(metrics.negative * 100)}%</span>
            <span>{copy.status.support1}: {Math.round(metrics.positive * 100)}%</span>
            <span>Undecided: {Math.round(metrics.undecided * 100)}%</span>
          </div>
          <p className="event-line">{eventText}</p>
        </section>

        <section className="panel-block">
          <div className="block-title">
            <Shuffle size={18} />
            <h2>{copy.sections.scenarios}</h2>
          </div>
          <div className="scenario-grid">
            {SCENARIOS.map((id) => (
              <button key={id} className={scenario === id ? 'selected' : ''} onClick={() => reset(id)} type="button">
                {copy.scenarios[id]}
              </button>
            ))}
          </div>
        </section>

        <section className="panel-block">
          <div className="block-title">
            <ShieldCheck size={18} />
            <h2>{copy.sections.mechanisms}</h2>
          </div>
          <div className="toggle-grid">
            <ToggleButton active={options.showReputation} icon={options.showReputation ? Eye : EyeOff} onClick={() => setOptions((o) => ({ ...o, showReputation: !o.showReputation }))}>
              {copy.mechanisms.showReputation}
            </ToggleButton>
            <ToggleButton active={options.hotRanking} icon={Zap} onClick={() => setOptions((o) => ({ ...o, hotRanking: !o.hotRanking }))}>
              {copy.mechanisms.hotRanking}
            </ToggleButton>
            <ToggleButton active={options.crossCommunity} icon={Network} onClick={() => setOptions((o) => ({ ...o, crossCommunity: !o.crossCommunity }))}>
              {copy.mechanisms.crossCommunity}
            </ToggleButton>
            <ToggleButton active={options.anonymous} icon={EyeOff} onClick={() => setOptions((o) => ({ ...o, anonymous: !o.anonymous }))}>
              {copy.mechanisms.anonymous}
            </ToggleButton>
            <ToggleButton active={options.factCheck} icon={CheckCircle2} onClick={() => setOptions((o) => ({ ...o, factCheck: !o.factCheck }))}>
              {copy.mechanisms.factCheck}
            </ToggleButton>
          </div>
        </section>

        <section className="panel-block">
          <div className="block-title">
            <Sparkles size={18} />
            <h2>{copy.sections.interventions}</h2>
            <strong className="budget">{budget}</strong>
          </div>
          <div className="intervention-grid">
            {Object.entries(INTERVENTIONS).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <button key={key} disabled={budget < item.cost} onClick={() => intervene(key)} type="button">
                  <Icon size={17} />
                  <span>{copy.interventions[key]}</span>
                  <small>{item.cost}</small>
                </button>
              );
            })}
            <button disabled={budget < 2} onClick={() => { setBudget((b) => b - 2); setWorld((current) => addBridge(current)); }} type="button">
              <Network size={17} />
              <span>{copy.interventions.bridgeEdge}</span>
              <small>2</small>
            </button>
          </div>
        </section>

          </aside>
        </>
      ) : null}
      {showTheory ? <TheoryModal copy={copy} onClose={() => setShowTheory(false)} /> : null}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

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
      pillarsTitle: 'Step 1: What this model is trying to explain',
      pillars: [
        ['Information design', 'You do not directly rewrite beliefs. You shape visibility, ranking, anonymity, and verification costs, which changes the information structure nodes observe before acting. This is the core idea of Bayesian persuasion in a playable form.'],
        ['Information games', 'Each node keeps four layers separate—what it knows, what it believes, what it says, and what it does. Because those layers do not always align, strategic speech, cheap talk, signaling, and reputation management emerge naturally.'],
        ['Network social learning', 'Beliefs update through local neighborhoods rather than global truth access. Private signals and social messages are blended each tick, so collective accuracy can improve through aggregation or collapse through biased high-influence clusters.'],
        ['Evolutionary diffusion', 'Communication incentives, reputations, bridge links, and moderation filters co-evolve over time. This lets the model capture a realistic tension: attention often dominates in the short run, while repeated verification can reweight influence in the long run.'],
      ],
      domainsTitle: 'Step 2: Where each theory appears in gameplay',
      domains: [
        ['Bayesian persuasion (Kamenica & Gentzkow)', 'Truth seeding and fact-checking interventions shift signal quality, reach, and credibility; they never alter the hidden state itself. You influence inference conditions, not reality.'],
        ['Information structures and BCE (Bergemann & Morris)', 'Platform mechanisms effectively specify what information each population can condition on when selecting messages and actions. Different rule sets implement different feasible equilibrium outcomes.'],
        ['Social learning (DeGroot; Golub & Jackson)', 'Neighborhood aggregation operationalizes local weighted learning under heterogeneous thresholds. Depending on topology and influence concentration, the same update rule can produce wisdom-of-crowds effects or persistent mislearning.'],
        ['Misinformation diffusion games', 'Bots, agitators, anonymity, and heat-based ranking can make social payoff diverge from truth payoff. When virality rewards salience over accuracy, false but engaging content gains a structural advantage.'],
        ['Network structure and echo chambers', 'Homophily and community boundaries limit cross-cutting exposure, while bridge edges increase inter-group transmission. Those bridges can either reduce error through correction or accelerate contamination across clusters.'],
        ['Agent-based emergence', 'Polarization and consensus are not scripted end states. They emerge from repeated micro-level interactions, making the board a laboratory for path dependence and tipping dynamics.'],
      ],
      loopTitle: 'Step 3: Read each tick as a causal pipeline',
      loop: ['Private signal intake (new evidence)', 'Message generation (strategic expression)', 'Neighborhood aggregation (social influence)', 'Belief update (internal learning)', 'Action choice (behavior output)', 'Reputation and energy update (long-run incentives)'],
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
    modal: { title: 'Teoría del juego', subtitle: 'Un modelo jugable de diseño de información y juegos de información: señales escasas, habla estratégica, reputación endógena y redes que evolucionan por interacción local.', close: 'Cerrar', pillarsTitle: 'Paso 1: qué intenta explicar el modelo', pillars: [['Diseño de información', 'No controlas creencias de forma directa: ajustas visibilidad, ranking, anonimato y verificación. Así cambias la estructura informativa que observa cada nodo antes de decidir.'], ['Juegos de información', 'Cada nodo separa lo que sabe, lo que cree, lo que dice y lo que hace. Esa separación crea incentivos para señalización estratégica, reputación y difusión oportunista.'], ['Aprendizaje social en red', 'Las creencias se actualizan en vecindarios locales combinando señales privadas y mensajes sociales. Esto puede producir sabiduría colectiva o sesgos persistentes si la influencia está concentrada.'], ['Difusión evolutiva', 'Mensajes, reputaciones, puentes y filtros cambian juntos con el tiempo. Por eso la atención puede dominar en el corto plazo, mientras la verificación repetida altera la influencia en el largo plazo.']], domainsTitle: 'Paso 2: dónde aparece cada teoría en el juego', domains: [['Persuasión bayesiana (Kamenica y Gentzkow)', 'Semillas de verdad y verificación cambian calidad y alcance de señales, no la verdad oculta. Modificas condiciones de inferencia, no el estado real.'], ['Estructuras de información y BCE (Bergemann y Morris)', 'Las reglas de plataforma definen qué información puede condicionar mensajes y acciones. Cambiar reglas equivale a cambiar el conjunto de resultados estratégicos factibles.'], ['Aprendizaje social (DeGroot; Golub y Jackson)', 'La agregación vecinal implementa aprendizaje ponderado local con umbrales heterogéneos. Según la red, puede surgir convergencia informada o error colectivo estable.'], ['Juegos de desinformación', 'Bots, agitadores, anonimato y ranking por calor separan recompensa social y valor de verdad. Cuando la viralidad premia saliencia, el contenido falso gana ventaja estructural.'], ['Estructura de red y cámaras de eco', 'La homofilia reduce exposición cruzada y los puentes entre comunidades cambian el flujo entre bloques. Esos puentes pueden corregir sesgos o propagar contaminación.'], ['Modelado basado en agentes', 'La polarización y el consenso emergen de reglas micro repetidas, no de un guion global. El tablero funciona como laboratorio de puntos de inflexión y dependencia de trayectoria.']], loopTitle: 'Paso 3: leer cada turno como cadena causal', loop: ['Entrada de señal privada (evidencia nueva)', 'Generación de mensaje (expresión estratégica)', 'Agregación vecinal (influencia social)', 'Actualización de creencia (aprendizaje interno)', 'Elección de acción (salida conductual)', 'Actualización de reputación y energía (incentivos de largo plazo)'], referencesTitle: 'Artículos y libros relacionados' },
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
    modal: { title: 'Théorie du jeu', subtitle: 'Un modèle jouable de design de l’information et de jeux d’information : signaux rares, parole stratégique, réputation endogène et réseaux évolutifs.', close: 'Fermer', pillarsTitle: 'Étape 1 : ce que le modèle cherche à expliquer', pillars: [['Design de l’information', 'Vous ne modifiez pas directement les croyances : vous réglez visibilité, classement, anonymat et vérification. Vous transformez ainsi la structure d’information observée avant l’action.'], ['Jeux d’information', 'Chaque nœud distingue ce qu’il sait, croit, dit et fait. Cette dissociation engendre parole stratégique, signalement, gestion de réputation et diffusion opportuniste.'], ['Apprentissage social en réseau', 'Les mises à jour de croyance sont locales et combinent signaux privés et messages de voisinage. Selon la topologie et la concentration d’influence, cela produit soit agrégation utile, soit erreur durable.'], ['Diffusion évolutive', 'Messages, réputation, liens-ponts et filtres évoluent conjointement. Le modèle capture donc la tension réaliste entre avantage d’attention à court terme et correction progressive par vérification répétée.']], domainsTitle: 'Étape 2 : où chaque théorie apparaît en jeu', domains: [['Persuasion bayésienne (Kamenica & Gentzkow)', 'Les graines de vérité et la vérification modifient la qualité et la portée des signaux, sans changer l’état caché. Vous influencez les conditions d’inférence, pas la vérité.'], ['Structures d’information et BCE (Bergemann & Morris)', 'Les règles de plateforme définissent quelles informations peuvent conditionner messages et actions. Modifier ces règles change l’ensemble des résultats stratégiques possibles.'], ['Apprentissage social (DeGroot ; Golub & Jackson)', 'L’agrégation de voisinage implémente un apprentissage pondéré local avec seuils hétérogènes. Elle peut conduire à la sagesse collective ou à des croyances biaisées persistantes.'], ['Jeux de désinformation', 'Bots, agitateurs, anonymat et classement par chaleur peuvent découpler gain social et véracité. Quand la viralité récompense la saillance, le faux contenu obtient un avantage structurel.'], ['Structure de réseau et chambres d’écho', 'Homophilie et frontières communautaires réduisent l’exposition croisée ; les ponts inter-groupes réouvrent le flux d’information. Ces ponts peuvent corriger l’erreur ou propager la contamination.'], ['Modélisation multi-agents', 'Polarisation et consensus ne sont pas scénarisés : ils émergent d’interactions micro répétées. Le plateau sert de laboratoire pour dépendance de trajectoire et points de bascule.']], loopTitle: 'Étape 3 : lire un tour comme une chaîne causale', loop: ['Signal privé (nouvelle preuve)', 'Production de message (expression stratégique)', 'Agrégation de voisinage (influence sociale)', 'Mise à jour de croyance (apprentissage interne)', 'Choix d’action (sortie comportementale)', 'Mise à jour réputation/énergie (incitations de long terme)'], referencesTitle: 'Articles et ouvrages liés' },
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
    modal: { title: 'Theorie des Spiels', subtitle: 'Ein spielbares Modell von Informationsdesign und Informationsspielen: knappe Signale, strategische Rede, endogene Reputation und lokale Netzwerkentwicklung.', close: 'Schließen', pillarsTitle: 'Schritt 1: Was das Modell erklären soll', pillars: [['Informationsdesign', 'Du überschreibst Überzeugungen nicht direkt, sondern steuerst Sichtbarkeit, Ranking, Anonymität und Prüfkosten. Damit veränderst du die Informationsstruktur, die Akteure vor Entscheidungen beobachten.'], ['Informationsspiele', 'Jeder Knoten trennt Wissen, Glauben, Sagen und Handeln. Diese Trennung erzeugt strategische Kommunikation, Signaling, Reputationsaufbau und opportunistisches Teilen.'], ['Soziales Lernen im Netzwerk', 'Überzeugungen werden lokal aus privaten Signalen und Nachbarschaftsbotschaften aktualisiert. Je nach Topologie kann das zu kollektiver Genauigkeit oder zu stabilen Verzerrungen führen.'], ['Evolutionäre Diffusion', 'Botschaften, Reputation, Brückenkanten und Filter entwickeln sich gemeinsam. So wird die reale Spannung sichtbar: kurzfristig gewinnt oft Aufmerksamkeit, langfristig kann wiederholte Verifikation Einfluss neu gewichten.']], domainsTitle: 'Schritt 2: Wo die Theorien im Spiel landen', domains: [['Bayessche Persuasion (Kamenica & Gentzkow)', 'Wahrheitssaat und Faktenprüfung verändern Signalqualität und Reichweite, nicht den verborgenen Zustand. Du beeinflusst Inferenzbedingungen statt Realität.'], ['Informationsstrukturen und BCE (Bergemann & Morris)', 'Plattformregeln legen fest, auf welche Information Gruppen ihre Botschaften und Aktionen konditionieren können. Regeländerungen verschieben damit die Menge strategisch möglicher Ergebnisse.'], ['Soziales Lernen (DeGroot; Golub & Jackson)', 'Nachbarschaftsaggregation implementiert lokales gewichtetes Lernen mit heterogenen Schwellen. Das kann Weisheit der Vielen erzeugen oder persistentes Fehllernen stabilisieren.'], ['Desinformationsspiele', 'Bots, Agitatoren, Anonymität und Heat-Ranking entkoppeln sozialen Ertrag vom Wahrheitswert. Wenn Viralität Salienz belohnt, erhält falscher Inhalt strukturelle Vorteile.'], ['Netzwerkstruktur und Echokammern', 'Homophilie und Community-Grenzen reduzieren Gegenexposition; Brückenkanten erhöhen den Fluss zwischen Lagern. Diese Brücken können korrigieren oder Verunreinigung verbreiten.'], ['Agentenbasierte Emergenz', 'Polarisierung und Konsens sind keine fest geskripteten Endzustände. Sie entstehen aus wiederholten Mikro-Interaktionen und machen Kipppunkte sowie Pfadabhängigkeit sichtbar.']], loopTitle: 'Schritt 3: Jede Runde als Kausalkette lesen', loop: ['Privates Signal (neue Evidenz)', 'Nachrichtenerzeugung (strategischer Ausdruck)', 'Nachbarschaftsaggregation (sozialer Einfluss)', 'Glaubensupdate (internes Lernen)', 'Aktionswahl (Verhaltensausgabe)', 'Reputations- und Energieupdate (Langfristanreize)'], referencesTitle: 'Verwandte Arbeiten und Bücher' },
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
    modal: { title: 'ゲームの理論基盤', subtitle: '情報設計と情報ゲームの遊べるモデル：希少な信号、戦略的発話、内生的評判、局所相互作用で進化するネットワーク。', close: '閉じる', pillarsTitle: '第1段階：このモデルが説明する対象', pillars: [['情報設計', 'プレイヤーは信念を直接書き換えず、可視性・ランキング・匿名性・検証コストを調整します。つまり真実そのものではなく、意思決定前に観測される情報構造を変えます。'], ['情報ゲーム', '各ノードは「知っていること」「信じていること」「発言すること」「行動すること」を分離します。この非一致が、戦略的発話・シグナリング・評判管理を自然に生みます。'], ['ネットワーク社会学習', '信念更新はグローバルではなく近傍で起こり、私的信号と周辺メッセージを毎ターン統合します。構造によっては集合知にも、影響偏在による誤学習にもなります。'], ['進化的拡散', 'メッセージ、評判、ブリッジ辺、フィルターは同時に変化します。短期では注意が勝ちやすく、長期では反復検証が影響力を組み替えるという緊張関係を表現できます。']], domainsTitle: '第2段階：理論がゲーム内で現れる場所', domains: [['ベイズ説得（Kamenica & Gentzkow）', '真実の種やファクトチェックは、信号の質・到達率・信頼度を変える介入であり、隠れた真実そのものは変えません。'], ['情報構造とBCE（Bergemann & Morris）', 'プラットフォーム規則は、各集団が行動前に何を条件情報として使えるかを定義します。規則変更は、実現可能な戦略結果の集合を変えます。'], ['社会学習（DeGroot；Golub & Jackson）', '近傍集約は異質閾値つきの局所加重学習です。同じ更新式でも、ネットワーク次第で収束精度と偏向持続の両方が起こります。'], ['誤情報拡散ゲーム', 'ボット、扇動者、匿名、熱量ランキングは「社会的利得」と「真実利得」を乖離させます。バズが報われる環境では、偽でも目立つ情報が有利になります。'], ['ネットワーク構造とエコーチェンバー', '同質性と境界は異質接触を減らし、ブリッジ辺は集団間フローを再開させます。橋は誤差修正にも汚染拡大にも働き得ます。'], ['エージェントベース創発', '分極や合意は脚本化された結末ではなく、局所ルールの反復から創発します。盤面は経路依存と転換点を観察する実験場です。']], loopTitle: '第3段階：1ターンを因果パイプラインとして読む', loop: ['私的信号の受信（新規証拠）', '公開メッセージ生成（戦略的表現）', '近傍集約（社会的影響）', '内部信念の更新（学習結果）', '行動選択（行動出力）', '評判・エネルギー更新（長期インセンティブ）'], referencesTitle: '関連論文・書籍' },
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
    modal: { title: '게임 이론 기반', subtitle: '정보 설계와 정보 게임의 플레이 가능한 모델: 희소한 신호, 전략적 발화, 내생적 평판, 지역 상호작용으로 진화하는 네트워크.', close: '닫기', pillarsTitle: '1단계: 이 모델이 설명하려는 것', pillars: [['정보 설계', '플레이어는 믿음을 직접 바꾸지 않고 가시성, 랭킹, 익명성, 검증 강도를 조정합니다. 즉 진실 자체가 아니라 의사결정 전에 관측되는 정보 구조를 바꿉니다.'], ['정보 게임', '각 노드는 아는 것·믿는 것·말하는 것·행동하는 것을 분리합니다. 이 불일치가 전략적 발화, 신호 보내기, 평판 관리 같은 현상을 만들어 냅니다.'], ['네트워크 사회학습', '믿음 갱신은 전역이 아니라 이웃 단위에서 일어나며 사적 신호와 사회적 메시지를 함께 반영합니다. 구조에 따라 집단 지성이 강화되거나 편향이 고착될 수 있습니다.'], ['진화적 확산', '메시지, 평판, 브리지, 필터는 함께 변화합니다. 그래서 단기에는 주목성이 이기고, 장기에는 반복 검증이 영향력을 재배치하는 긴장을 표현할 수 있습니다.']], domainsTitle: '2단계: 이론이 게임에 매핑되는 지점', domains: [['베이지안 설득 (Kamenica & Gentzkow)', '진실 씨앗과 팩트체크는 신호의 품질·도달·신뢰도를 바꾸지만 숨은 진실은 바꾸지 않습니다. 추론 조건을 설계하는 개입입니다.'], ['정보 구조와 BCE (Bergemann & Morris)', '플랫폼 규칙은 집단이 행동 전에 어떤 정보를 조건으로 사용할 수 있는지 정합니다. 규칙 변경은 가능한 전략 결과 집합을 바꿉니다.'], ['사회학습 (DeGroot; Golub & Jackson)', '이웃 집계는 이질적 임계값을 가진 지역 가중 학습입니다. 같은 규칙이라도 네트워크 구조에 따라 정확한 수렴 또는 지속적 오학습이 발생합니다.'], ['오정보 확산 게임', '봇, 선동자, 익명성, 열기 랭킹은 사회적 보상과 진실 보상을 분리합니다. 화제성이 보상되는 환경에서는 거짓이 구조적 이점을 가질 수 있습니다.'], ['네트워크 구조와 에코 체임버', '동질성과 경계는 교차 노출을 줄이고 브리지는 집단 간 흐름을 늘립니다. 브리지는 교정 채널이 될 수도, 오염 확산 경로가 될 수도 있습니다.'], ['행위자 기반 창발', '양극화와 합의는 스크립트된 결말이 아니라 미시 규칙 반복에서 창발합니다. 보드는 경로 의존성과 전환점을 관찰하는 실험장이 됩니다.']], loopTitle: '3단계: 한 턴을 인과 파이프라인으로 읽기', loop: ['사적 신호 수신 (새 증거)', '공개 메시지 생성 (전략적 표현)', '이웃 집계 (사회적 영향)', '내부 믿음 갱신 (학습 결과)', '행동 선택 (행동 출력)', '평판·에너지 갱신 (장기 유인)'], referencesTitle: '관련 논문과 저서' },
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
    modal: { title: 'Teoria do jogo', subtitle: 'Um modelo jogável de design de informação e jogos de informação: sinais escassos, fala estratégica, reputação endógena e redes que evoluem localmente.', close: 'Fechar', pillarsTitle: 'Passo 1: o que este modelo procura explicar', pillars: [['Design de informação', 'Você não altera crenças diretamente: regula visibilidade, ranking, anonimato e intensidade de verificação. Isso muda a estrutura informacional observada pelos nós antes de agir.'], ['Jogos de informação', 'Cada nó separa o que sabe, o que acredita, o que diz e o que faz. Essa separação gera comunicação estratégica, sinalização, gestão de reputação e compartilhamento oportunista.'], ['Aprendizado social em rede', 'As crenças são atualizadas localmente combinando sinais privados e mensagens dos vizinhos. Dependendo da rede, isso pode produzir inteligência coletiva ou erro persistente.'], ['Difusão evolutiva', 'Mensagens, reputações, pontes e filtros mudam em conjunto ao longo do tempo. O modelo captura o conflito entre ganho de atenção no curto prazo e correção por verificação repetida no longo prazo.']], domainsTitle: 'Passo 2: onde cada teoria aparece no jogo', domains: [['Persuasão bayesiana (Kamenica & Gentzkow)', 'Semente de verdade e checagem alteram qualidade, alcance e credibilidade dos sinais, sem mudar a verdade oculta. Você desenha condições de inferência, não o estado real.'], ['Estruturas de informação e BCE (Bergemann & Morris)', 'As regras da plataforma definem quais informações cada grupo pode usar para condicionar mensagens e ações. Mudar regras muda o conjunto de resultados estratégicos possíveis.'], ['Aprendizado social (DeGroot; Golub & Jackson)', 'A agregação de vizinhança implementa aprendizado ponderado local com limiares heterogêneos. A mesma dinâmica pode gerar convergência informada ou desvio coletivo estável.'], ['Jogos de desinformação', 'Bots, agitadores, anonimato e ranking por calor podem separar recompensa social de valor de verdade. Quando a viralidade premia saliência, conteúdo falso ganha vantagem estrutural.'], ['Estrutura de rede e câmaras de eco', 'Homofilia e fronteiras de comunidade reduzem exposição cruzada, enquanto pontes ampliam fluxo entre blocos. Essas pontes podem corrigir viés ou espalhar contaminação.'], ['Modelagem baseada em agentes', 'Polarização e consenso emergem de interações micro repetidas, não de um roteiro global. O tabuleiro funciona como laboratório de pontos de inflexão e dependência de trajetória.']], loopTitle: 'Passo 3: ler cada turno como pipeline causal', loop: ['Entrada de sinal privado (nova evidência)', 'Geração de mensagem (expressão estratégica)', 'Agregação local (influência social)', 'Atualização de crença (aprendizado interno)', 'Escolha de ação (saída comportamental)', 'Atualização de reputação e energia (incentivos de longo prazo)'], referencesTitle: 'Artigos e livros relacionados' },
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
      const privateSignal = rng() < 0.42 ? (rng() < 0.62 ? truth : 1 - truth) : null;
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
        action: belief >= 0 ? 1 : 0,
        reputation: Math.floor(1 + rng() * 4),
        type,
        filter: Math.floor(rng() * 4),
        energy: 3 + Math.floor(rng() * 4),
        lastFlip: 0,
        attention: 0,
        checked: false,
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
    scarce: { signalRate: 0.018, signalAccuracy: 0.68, attentionBoost: 1 },
    polarized: { signalRate: 0.026, signalAccuracy: 0.66, attentionBoost: 1 },
    anonymous: { signalRate: 0.025, signalAccuracy: 0.64, attentionBoost: 1.15 },
    viral: { signalRate: 0.022, signalAccuracy: 0.62, attentionBoost: 1.7 },
    bridge: { signalRate: 0.024, signalAccuracy: 0.65, attentionBoost: 1.25 },
    market: { signalRate: 0.022, signalAccuracy: 0.63, attentionBoost: 1.45 },
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
    let weight = 1;
    if (options.showReputation) weight += other.reputation * 0.22;
    if (options.hotRanking) weight += Math.min(2.4, other.attention * 0.18);
    if (node.filter === 0 && other.reputation >= 4) weight += 0.7;
    if (node.filter === 1 && other.community === node.community) weight += 0.8;
    if (node.filter === 2 && Math.abs(other.message) > 0) weight += 0.25;
    if (node.filter === 3 && other.community !== node.community) weight *= 0.72;
    if (options.anonymous) weight = 1 + (options.hotRanking ? Math.min(1.4, other.attention * 0.15) : 0);
    pressure += weight * other.message;
    heard += Math.abs(weight);
  });
  return heard === 0 ? 0 : pressure / Math.max(1, Math.sqrt(heard));
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

  const nodes = messaged.map((node) => {
    let privatePush = 0;
    const rate = node.type === 'checker' ? settings.signalRate * 8 : settings.signalRate;
    const accuracy = node.type === 'checker' ? 0.92 : settings.signalAccuracy;
    if (rng() < rate) {
      const signal = rng() < accuracy ? world.truth : 1 - world.truth;
      privatePush = signal === 1 ? 1 : -1;
    }

    const pressure = pressureFor(node, messaged, neighbors, options);
    let threshold = 1.2;
    if (node.type === 'truth') threshold = 2.2;
    if (node.type === 'social') threshold = 0.85;
    if (node.type === 'attention') threshold = 1.05 / settings.attentionBoost;
    if (node.type === 'stubborn') threshold = 2.8;
    if (node.type === 'checker') threshold = 1.9;
    if (node.type === 'bot') threshold = 9;

    let socialPush = Math.abs(pressure) >= threshold ? sign(pressure) : 0;
    if (node.type === 'stubborn' && socialPush !== sign(node.belief)) socialPush = 0;
    if (options.factCheck && node.checked) privatePush += world.truth === 1 ? 1 : -1;

    const attentionPush = options.hotRanking && node.type === 'attention' && Math.abs(pressure) > 2.6 ? sign(pressure) : 0;
    const nextBelief = clamp(node.belief + privatePush + socialPush + attentionPush, -2, 2);
    const nextAction = nextBelief >= 1 ? 1 : nextBelief <= -1 ? 0 : node.action;
    const spent = node.message === 0 ? 0 : node.type === 'attention' || node.type === 'agitator' ? 2 : 1;
    const attention = Math.max(0, Math.round(Math.abs(pressure) + (node.message !== 0 ? 1 : 0)));
    return {
      ...node,
      belief: nextBelief,
      action: nextAction,
      lastFlip: sign(nextBelief) !== sign(node.prevBelief) ? world.tick + 1 : node.lastFlip,
      energy: clamp(node.energy - spent + (attention >= 3 ? 1 : 0), 0, 9),
      attention,
    };
  });

  if ((world.tick + 1) % 5 === 0) {
    let rewarded = 0;
    let punished = 0;
    nodes.forEach((node) => {
      const saidTruth = node.message !== 0 && (node.message === 1) === (world.truth === 1);
      const saidFalse = node.message !== 0 && !saidTruth;
      if (saidTruth) {
        node.reputation = clamp(node.reputation + 1, 0, 9);
        node.energy = clamp(node.energy + 1, 0, 9);
        rewarded += 1;
      }
      if (saidFalse && (!options.anonymous || options.factCheck)) {
        node.reputation = clamp(node.reputation - (node.attention >= 3 ? 2 : 1), 0, 9);
        punished += 1;
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
  const truthAligned = world.nodes.filter((n) => n.action === world.truth).length / total;
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
  return { truthAligned, active, avgRep, polarization, positive, negative };
}

function applyIntervention(world, kind, targetId) {
  const nodes = world.nodes.map((n) => ({ ...n }));
  const node = nodes[targetId ?? Math.floor(world.rng() * nodes.length)];
  if (!node) return world;
  if (kind === 'seedTrue') {
    node.belief = world.truth === 1 ? 2 : -2;
    node.message = world.truth === 1 ? 1 : -1;
    node.energy = 9;
    node.reputation = clamp(node.reputation + 1, 0, 9);
  }
  if (kind === 'checker') {
    node.type = 'checker';
    node.checked = true;
    node.reputation = 7;
    node.belief = world.truth === 1 ? 2 : -2;
    node.message = world.truth === 1 ? 1 : -1;
  }
  if (kind === 'bot') {
    node.type = 'bot';
    node.reputation = 5;
    node.energy = 9;
    node.belief = world.truth === 1 ? -2 : 2;
    node.message = world.truth === 1 ? -1 : 1;
  }
  if (kind === 'agitator') {
    node.type = 'agitator';
    node.reputation = 4;
    node.energy = 9;
    node.belief = node.belief >= 0 ? 2 : -2;
    node.message = sign(node.belief);
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
                  <span>{copy.node.action}</span><strong>{selectedNode.action}</strong>
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

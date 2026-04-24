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
      pillarsTitle: 'Model foundations',
      pillars: [
        ['Information design', 'The player cannot command beliefs directly. They choose what becomes visible, amplified, costly, or credible, echoing Bayesian persuasion and information-structure design.'],
        ['Information games', 'Nodes separate what they know, what they believe, what they say, and what they do. This creates strategic communication, cheap talk, signaling, and reputation effects.'],
        ['Network social learning', 'Agents combine private signals with neighbor messages. Local averaging can aggregate information, but stubborn, high-reputation, or biased nodes can distort consensus.'],
        ['Evolutionary diffusion', 'Messages, reputations, bridges, and filters co-evolve. Short-term attention can beat accuracy, while repeated verification can shift long-run influence.'],
      ],
      domainsTitle: 'How the theories map to play',
      domains: [
        ['Bayesian persuasion', 'Truth seeds and fact-checking change the distribution of signals, not the truth itself.'],
        ['Bayes correlated equilibrium', 'Platform rules define what each population can condition on before choosing messages and actions.'],
        ['Opinion dynamics', 'The grid implements DeGroot-style local learning with discrete beliefs and heterogeneous thresholds.'],
        ['Misinformation games', 'Bots, agitators, anonymity, and heat ranking create incentives to share content whose social payoff differs from its truth value.'],
        ['Echo chambers', 'Community boundaries and homophily reduce cross-cutting exposure; bridge edges can correct or contaminate.'],
        ['Agent-based modeling', 'Macro patterns emerge from small local rules rather than from a scripted global narrative.'],
      ],
      loopTitle: 'Tick loop',
      loop: ['Private signal', 'Message generation', 'Neighborhood aggregation', 'Belief update', 'Action choice', 'Reputation update'],
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
      pillarsTitle: '模型基础',
      pillars: [
        ['信息设计', '玩家不能直接命令信念，只能设计什么被看见、被放大、变得有成本或更可信，这对应贝叶斯劝服与信息结构设计。'],
        ['信息博弈', '节点的知识、信念、发言、行动彼此分离，由此产生策略性沟通、廉价谈话、信号传递与声誉效应。'],
        ['网络社会学习', '主体把私有信号和邻居消息混合起来。局部平均可能聚合信息，也可能被顽固者、高声誉者或偏见节点扭曲。'],
        ['演化传播', '消息、声誉、桥边和认知滤镜共同演化。短期注意力可能压过准确性，重复验证则会改变长期影响力。'],
      ],
      domainsTitle: '理论如何映射到玩法',
      domains: [
        ['贝叶斯劝服', '真相种子与事实核查改变信号分布，而不是改变真相本身。'],
        ['贝叶斯相关均衡', '平台规则决定每类主体在发言和行动前能基于什么信息条件化决策。'],
        ['意见动力学', '网格实现了带离散信念和异质阈值的 DeGroot 式局部学习。'],
        ['错误信息博弈', '机器人、煽动者、匿名与热门排序让“分享收益”和“内容为真”发生分离。'],
        ['回音室', '社区边界与同质性减少跨立场曝光；桥接边既可能纠偏，也可能污染。'],
        ['主体建模', '宏观图样来自局部规则，而不是预设好的全局剧情。'],
      ],
      loopTitle: '回合流程',
      loop: ['私有信号', '生成消息', '邻域聚合', '更新信念', '选择行动', '更新声誉'],
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
    modal: { title: 'Teoría del juego', subtitle: 'Un modelo jugable de diseño de información y juegos de información: señales escasas, habla estratégica, reputación endógena y redes que evolucionan por interacción local.', close: 'Cerrar', pillarsTitle: 'Fundamentos del modelo', pillars: [['Diseño de información', 'El jugador no ordena creencias directamente. Decide qué se ve, amplifica, cuesta o resulta creíble.'], ['Juegos de información', 'Los nodos separan lo que saben, creen, dicen y hacen, creando comunicación estratégica y reputación.'], ['Aprendizaje social en red', 'Los agentes mezclan señales privadas con mensajes vecinos; el consenso puede informar o distorsionarse.'], ['Difusión evolutiva', 'Mensajes, reputaciones, puentes y filtros coevolucionan. La atención puede vencer a la precisión a corto plazo.']], domainsTitle: 'Cómo la teoría se traduce en juego', domains: [['Persuasión bayesiana', 'Semillas de verdad y verificadores cambian la distribución de señales, no la verdad.'], ['Equilibrio correlacionado bayesiano', 'Las reglas definen qué información condiciona mensajes y acciones.'], ['Dinámica de opinión', 'La red implementa aprendizaje local tipo DeGroot con creencias discretas.'], ['Juegos de desinformación', 'Bots, anonimato y ranking separan recompensa social y veracidad.'], ['Cámaras de eco', 'Fronteras y homofilia reducen exposición cruzada; los puentes corrigen o contaminan.'], ['Modelado basado en agentes', 'Patrones macro emergen de reglas locales.']], loopTitle: 'Bucle de turno', loop: ['Señal privada', 'Generación de mensaje', 'Agregación vecinal', 'Actualización de creencia', 'Elección de acción', 'Actualización de reputación'], referencesTitle: 'Artículos y libros relacionados' },
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
    modal: { title: 'Théorie du jeu', subtitle: 'Un modèle jouable de design de l’information et de jeux d’information : signaux rares, parole stratégique, réputation endogène et réseaux évolutifs.', close: 'Fermer', pillarsTitle: 'Fondements du modèle', pillars: [['Design de l’information', 'Le joueur choisit ce qui devient visible, amplifié, coûteux ou crédible.'], ['Jeux d’information', 'Savoir, croyance, parole et action restent séparés.'], ['Apprentissage social en réseau', 'Les agents combinent signaux privés et messages voisins.'], ['Diffusion évolutive', 'Messages, réputation, ponts et filtres coévoluent.']], domainsTitle: 'Correspondance théorie-jeu', domains: [['Persuasion bayésienne', 'Les interventions modifient les signaux, pas la vérité.'], ['Équilibre corrélé bayésien', 'Les règles définissent l’information conditionnante.'], ['Dynamique d’opinion', 'Apprentissage local discret de type DeGroot.'], ['Désinformation', 'Les gains sociaux peuvent diverger de la vérité.'], ['Chambres d’écho', 'Les frontières réduisent l’exposition croisée.'], ['Modélisation multi-agents', 'Les motifs globaux émergent de règles locales.']], loopTitle: 'Boucle de tour', loop: ['Signal privé', 'Message', 'Agrégation locale', 'Croyance', 'Action', 'Réputation'], referencesTitle: 'Articles et ouvrages liés' },
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
    modal: { title: 'Theorie des Spiels', subtitle: 'Ein spielbares Modell von Informationsdesign und Informationsspielen: knappe Signale, strategische Rede, endogene Reputation und lokale Netzwerkentwicklung.', close: 'Schließen', pillarsTitle: 'Modellgrundlagen', pillars: [['Informationsdesign', 'Der Spieler bestimmt Sichtbarkeit, Verstärkung, Kosten und Glaubwürdigkeit.'], ['Informationsspiele', 'Wissen, Glaube, Rede und Handlung bleiben getrennt.'], ['Soziales Lernen', 'Agenten mischen private Signale mit Nachbarschaftsnachrichten.'], ['Evolutionäre Diffusion', 'Nachrichten, Reputation, Brücken und Filter entwickeln sich gemeinsam.']], domainsTitle: 'Theorie im Spiel', domains: [['Bayessche Persuasion', 'Eingriffe verändern Signale, nicht die Wahrheit.'], ['Bayes-korreliertes Gleichgewicht', 'Regeln bestimmen konditionierbare Information.'], ['Meinungsdynamik', 'Diskretes lokales DeGroot-Lernen.'], ['Desinformation', 'Sozialer Ertrag kann von Wahrheit abweichen.'], ['Echokammern', 'Grenzen reduzieren Gegenexposition.'], ['Agentenmodellierung', 'Makromuster entstehen aus lokalen Regeln.']], loopTitle: 'Rundenablauf', loop: ['Privates Signal', 'Nachricht', 'Nachbarschaft', 'Glauben', 'Aktion', 'Reputation'], referencesTitle: 'Verwandte Arbeiten und Bücher' },
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
    modal: { title: 'ゲームの理論基盤', subtitle: '情報設計と情報ゲームの遊べるモデル：希少な信号、戦略的発話、内生的評判、局所相互作用で進化するネットワーク。', close: '閉じる', pillarsTitle: 'モデル基盤', pillars: [['情報設計', '何が見え、拡散され、コストを持ち、信頼されるかを設計します。'], ['情報ゲーム', '知識、信念、発話、行動を分離します。'], ['ネットワーク社会学習', '私的信号と近傍メッセージを組み合わせます。'], ['進化的拡散', 'メッセージ、評判、橋、フィルターが共進化します。']], domainsTitle: '理論と玩法の対応', domains: [['ベイズ説得', '介入は真実ではなく信号分布を変えます。'], ['ベイズ相関均衡', '規則が条件化できる情報を定義します。'], ['意見ダイナミクス', '離散的な局所 DeGroot 学習です。'], ['誤情報ゲーム', '社会的報酬と真実性が分離します。'], ['エコーチェンバー', '境界が異質な露出を減らします。'], ['エージェントモデル', '大域パターンは局所規則から創発します。']], loopTitle: 'ターン処理', loop: ['私的信号', 'メッセージ生成', '近傍集約', '信念更新', '行動選択', '評判更新'], referencesTitle: '関連論文・書籍' },
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
    modal: { title: '게임 이론 기반', subtitle: '정보 설계와 정보 게임의 플레이 가능한 모델: 희소한 신호, 전략적 발화, 내생적 평판, 지역 상호작용으로 진화하는 네트워크.', close: '닫기', pillarsTitle: '모델 기반', pillars: [['정보 설계', '무엇이 보이고 증폭되며 비용과 신뢰를 갖는지 설계합니다.'], ['정보 게임', '지식, 믿음, 발화, 행동을 분리합니다.'], ['네트워크 사회학습', '사적 신호와 이웃 메시지를 결합합니다.'], ['진화적 확산', '메시지, 평판, 브리지, 필터가 함께 진화합니다.']], domainsTitle: '이론과 플레이의 대응', domains: [['베이지안 설득', '개입은 진실이 아니라 신호 분포를 바꿉니다.'], ['베이즈 상관균형', '규칙은 조건화 가능한 정보를 정합니다.'], ['의견 동역학', '이산적 DeGroot식 지역 학습입니다.'], ['오정보 게임', '사회적 보상과 진실성이 분리됩니다.'], ['에코 체임버', '경계가 교차 노출을 줄입니다.'], ['행위자 기반 모델', '거시 패턴은 지역 규칙에서 나타납니다.']], loopTitle: '턴 루프', loop: ['사적 신호', '메시지 생성', '이웃 집계', '믿음 갱신', '행동 선택', '평판 갱신'], referencesTitle: '관련 논문과 저서' },
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
    modal: { title: 'Teoria do jogo', subtitle: 'Um modelo jogável de design de informação e jogos de informação: sinais escassos, fala estratégica, reputação endógena e redes que evoluem localmente.', close: 'Fechar', pillarsTitle: 'Fundamentos do modelo', pillars: [['Design de informação', 'O jogador escolhe o que fica visível, amplificado, custoso ou crível.'], ['Jogos de informação', 'Conhecimento, crença, fala e ação ficam separados.'], ['Aprendizado social em rede', 'Agentes combinam sinais privados e mensagens vizinhas.'], ['Difusão evolutiva', 'Mensagens, reputações, pontes e filtros coevoluem.']], domainsTitle: 'Como a teoria vira jogo', domains: [['Persuasão bayesiana', 'Intervenções mudam sinais, não a verdade.'], ['Equilíbrio correlacionado bayesiano', 'Regras definem a informação condicionante.'], ['Dinâmica de opinião', 'Aprendizado local discreto estilo DeGroot.'], ['Jogos de desinformação', 'Recompensa social pode divergir da verdade.'], ['Câmaras de eco', 'Fronteiras reduzem exposição cruzada.'], ['Modelagem baseada em agentes', 'Padrões macro emergem de regras locais.']], loopTitle: 'Ciclo do turno', loop: ['Sinal privado', 'Mensagem', 'Agregação local', 'Crença', 'Ação', 'Reputação'], referencesTitle: 'Artigos e livros relacionados' },
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

    ctx.strokeStyle = 'rgba(16,19,22,.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(widthPx / 2, 0);
    ctx.lineTo(widthPx / 2, heightPx);
    ctx.moveTo(0, heightPx / 2);
    ctx.lineTo(widthPx, heightPx / 2);
    ctx.stroke();

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

        <section className="panel-block guide-card">
          <div className="block-title">
            <Globe2 size={18} />
            <h2>{copy.guide.title}</h2>
          </div>
          <ul>
            {copy.guide.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
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

        <section className="panel-block compact">
          <label htmlFor="speed">{copy.sections.speed}</label>
          <input id="speed" type="range" min="60" max="520" step="20" value={580 - speed} onChange={(e) => setSpeed(580 - Number(e.target.value))} />
        </section>
      </aside>
      {showTheory ? <TheoryModal copy={copy} onClose={() => setShowTheory(false)} /> : null}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

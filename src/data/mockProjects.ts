// 模拟项目数据库 - 用于随机抽取毒舌分析
// 后续可以接入真实 API 获取链上项目

export interface CryptoProject {
  id: string
  name: string
  ticker: string
  chain: string
  tags: string[]
  description_cn: string
  description_en: string
  // 庞氏指数五维度评分 (0-100 每项)
  ponziMetrics: {
    narrativeDependency: number    // 叙事依赖度 (0-25)
    cashFlowSelfSufficiency: number // 现金流自给率 (0-25)
    tokenDependency: number         // Token依赖度 (0-20)
    lateComerRisk: number           // 后来者接盘风险 (0-20)
    exitDependency: number          // 退出依赖性 (0-10)
  }
  // 毒舌分析
  roast_cn: string[]
  roast_en: string[]
  // 盈利模式
  revenueModel_cn: string
  revenueModel_en: string
}

export const MOCK_PROJECTS: CryptoProject[] = [
  {
    id: 'pump-fun',
    name: 'Pump.fun',
    ticker: 'N/A',
    chain: 'Solana',
    tags: ['Meme', 'Launchpad', 'Degen'],
    description_cn: '一键发币平台，让每个人都能成为庄家（或韭菜）',
    description_en: 'One-click token launcher, everyone can be a whale (or exit liquidity)',
    ponziMetrics: {
      narrativeDependency: 15,
      cashFlowSelfSufficiency: 5,
      tokenDependency: 10,
      lateComerRisk: 18,
      exitDependency: 7,
    },
    roast_cn: [
      '平台赚手续费，你赚个寂寞',
      '发币门槛低到让你怀疑人生',
      '每天几千个新币，你能跑赢概率吗？',
    ],
    roast_en: [
      'Platform takes fees, you take losses',
      'Launch barrier so low it questions your life choices',
      'Thousands of new tokens daily, can you beat the odds?',
    ],
    revenueModel_cn: '交易手续费 + 毕业费用，稳赚不赔的是平台',
    revenueModel_en: 'Trading fees + graduation fees, the house always wins',
  },
  {
    id: 'bonk',
    name: 'Bonk',
    ticker: 'BONK',
    chain: 'Solana',
    tags: ['Meme', 'Dog', 'Community'],
    description_cn: 'Solana 上的狗币，靠社区和空投起家',
    description_en: 'Solana\'s dog coin, built on community and airdrops',
    ponziMetrics: {
      narrativeDependency: 20,
      cashFlowSelfSufficiency: 22,
      tokenDependency: 18,
      lateComerRisk: 15,
      exitDependency: 8,
    },
    roast_cn: [
      '没有技术，全靠信仰',
      '空投完了，叙事还剩多少？',
      '社区很热闹，但热闹不等于价值',
    ],
    roast_en: [
      'No tech, pure faith',
      'Airdrops done, how much narrative left?',
      'Community is loud, but loud ≠ value',
    ],
    revenueModel_cn: '没有收入模式，纯粹的 Meme 经济',
    revenueModel_en: 'No revenue model, pure meme economics',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    ticker: 'JUP',
    chain: 'Solana',
    tags: ['DEX', 'Aggregator', 'DeFi'],
    description_cn: 'Solana 最大的 DEX 聚合器，真的有人在用',
    description_en: 'Solana\'s largest DEX aggregator, people actually use it',
    ponziMetrics: {
      narrativeDependency: 8,
      cashFlowSelfSufficiency: 5,
      tokenDependency: 12,
      lateComerRisk: 10,
      exitDependency: 5,
    },
    roast_cn: [
      '产品不错，但估值已经不错了',
      '空投预期透支了多少热情？',
      'Solana 生态绑定，一荣俱荣一损俱损',
    ],
    roast_en: [
      'Product is good, but so is the valuation',
      'How much hype did airdrop expectations burn?',
      'Tied to Solana ecosystem, sink or swim together',
    ],
    revenueModel_cn: '交易手续费，真实收入',
    revenueModel_en: 'Trading fees, actual revenue',
  },
  {
    id: 'wif',
    name: 'dogwifhat',
    ticker: 'WIF',
    chain: 'Solana',
    tags: ['Meme', 'Dog', 'Hat'],
    description_cn: '戴帽子的狗，就这？就这。',
    description_en: 'A dog with a hat. That\'s it. That\'s the project.',
    ponziMetrics: {
      narrativeDependency: 24,
      cashFlowSelfSufficiency: 25,
      tokenDependency: 20,
      lateComerRisk: 18,
      exitDependency: 9,
    },
    roast_cn: [
      '一张图片撑起百亿市值',
      '你买的不是币，是一种生活态度',
      '帽子很可爱，但可爱能当饭吃吗？',
    ],
    roast_en: [
      'One picture supports billions in market cap',
      'You\'re not buying a coin, you\'re buying a lifestyle',
      'Hat is cute, but can cute pay bills?',
    ],
    revenueModel_cn: '没有。纯粹的情绪价值。',
    revenueModel_en: 'None. Pure emotional value.',
  },
  {
    id: 'pepe',
    name: 'Pepe',
    ticker: 'PEPE',
    chain: 'Ethereum',
    tags: ['Meme', 'Frog', 'OG'],
    description_cn: '青蛙 Meme 的代币化，互联网文化遗产',
    description_en: 'Tokenized frog meme, internet cultural heritage',
    ponziMetrics: {
      narrativeDependency: 22,
      cashFlowSelfSufficiency: 24,
      tokenDependency: 19,
      lateComerRisk: 16,
      exitDependency: 8,
    },
    roast_cn: [
      '青蛙很火，但火多久是个问题',
      '文化符号变现，但文化会过时',
      '你是在投资还是在收藏表情包？',
    ],
    roast_en: [
      'Frog is hot, but for how long?',
      'Culture monetized, but culture expires',
      'Are you investing or collecting memes?',
    ],
    revenueModel_cn: '没有收入，靠新韭菜续命',
    revenueModel_en: 'No revenue, sustained by new believers',
  },
  {
    id: 'ai-agent-token',
    name: 'AI Agent Token',
    ticker: 'AGENT',
    chain: 'Various',
    tags: ['AI', 'Agent', 'Hype'],
    description_cn: 'AI 代理概念币，蹭热点的艺术',
    description_en: 'AI agent concept token, the art of riding hype',
    ponziMetrics: {
      narrativeDependency: 25,
      cashFlowSelfSufficiency: 23,
      tokenDependency: 18,
      lateComerRisk: 19,
      exitDependency: 9,
    },
    roast_cn: [
      'AI 是真的，但这个币和 AI 有什么关系？',
      '白皮书里 AI 出现了 50 次，代码里 0 次',
      '蹭热点的速度比 AI 学习还快',
    ],
    roast_en: [
      'AI is real, but what does this token have to do with AI?',
      'AI mentioned 50 times in whitepaper, 0 times in code',
      'Riding hype faster than AI can learn',
    ],
    revenueModel_cn: '卖概念，卖预期，卖梦想',
    revenueModel_en: 'Selling concepts, expectations, and dreams',
  },
  {
    id: 'restaking',
    name: 'ReStaking Protocol',
    ticker: 'RSTAK',
    chain: 'Ethereum',
    tags: ['DeFi', 'Staking', 'Yield'],
    description_cn: '质押套娃，把你的 ETH 反复利用',
    description_en: 'Staking matryoshka, recycling your ETH infinitely',
    ponziMetrics: {
      narrativeDependency: 18,
      cashFlowSelfSufficiency: 15,
      tokenDependency: 16,
      lateComerRisk: 17,
      exitDependency: 8,
    },
    roast_cn: [
      '套娃套到最后，谁是最后一个？',
      '收益从哪来？从后来的人那里来',
      '复杂到连审计都看不懂',
    ],
    roast_en: [
      'Nesting dolls all the way down, who\'s last?',
      'Where does yield come from? From latecomers.',
      'So complex even auditors are confused',
    ],
    revenueModel_cn: '协议费用 + 代币激励，可持续性存疑',
    revenueModel_en: 'Protocol fees + token incentives, sustainability questionable',
  },
  {
    id: 'rwa-token',
    name: 'RWA Protocol',
    ticker: 'RWA',
    chain: 'Ethereum',
    tags: ['RWA', 'TradFi', 'Tokenization'],
    description_cn: '现实资产上链，听起来很美好',
    description_en: 'Real world assets on-chain, sounds beautiful',
    ponziMetrics: {
      narrativeDependency: 15,
      cashFlowSelfSufficiency: 12,
      tokenDependency: 14,
      lateComerRisk: 12,
      exitDependency: 6,
    },
    roast_cn: [
      '现实资产是真的，但你买的是代币',
      '监管来了怎么办？先跑为敬',
      '传统金融看不上，币圈又嫌不够刺激',
    ],
    roast_en: [
      'Real assets are real, but you\'re buying tokens',
      'What happens when regulators come? Run first.',
      'TradFi ignores it, crypto finds it boring',
    ],
    revenueModel_cn: '资产管理费 + 交易费，如果有人用的话',
    revenueModel_en: 'Asset management + trading fees, if anyone uses it',
  },
  {
    id: 'gamefi-project',
    name: 'Play2Earn Game',
    ticker: 'P2E',
    chain: 'Various',
    tags: ['GameFi', 'P2E', 'NFT'],
    description_cn: '边玩边赚，但谁在付钱？',
    description_en: 'Play to earn, but who\'s paying?',
    ponziMetrics: {
      narrativeDependency: 22,
      cashFlowSelfSufficiency: 22,
      tokenDependency: 19,
      lateComerRisk: 20,
      exitDependency: 9,
    },
    roast_cn: [
      '游戏不好玩，全靠赚钱撑着',
      '新玩家的钱付给老玩家，这不就是...',
      '代币一跌，玩家全跑',
    ],
    roast_en: [
      'Game sucks, only money keeps people playing',
      'New players pay old players, sounds like...',
      'Token dumps, players vanish',
    ],
    revenueModel_cn: 'NFT 销售 + 代币通胀，死亡螺旋预定',
    revenueModel_en: 'NFT sales + token inflation, death spiral incoming',
  },
  {
    id: 'l2-chain',
    name: 'New L2 Chain',
    ticker: 'L2X',
    chain: 'Ethereum L2',
    tags: ['L2', 'Infrastructure', 'Scaling'],
    description_cn: '又一个 L2，市场真的需要这么多吗？',
    description_en: 'Another L2, does the market really need this many?',
    ponziMetrics: {
      narrativeDependency: 16,
      cashFlowSelfSufficiency: 18,
      tokenDependency: 15,
      lateComerRisk: 14,
      exitDependency: 7,
    },
    roast_cn: [
      'L2 太多，用户不够分',
      '技术差不多，全靠空投拉人',
      '等空投结束，TVL 还剩多少？',
    ],
    roast_en: [
      'Too many L2s, not enough users',
      'Tech is similar, airdrops do the heavy lifting',
      'After airdrop, how much TVL remains?',
    ],
    revenueModel_cn: 'Gas 费分成，但用户都在薅空投',
    revenueModel_en: 'Gas fee sharing, but users are just farming airdrops',
  },
]

export const getRandomProject = (): CryptoProject => {
  return MOCK_PROJECTS[Math.floor(Math.random() * MOCK_PROJECTS.length)]
}

export const calculatePonziScore = (project: CryptoProject): number => {
  const { ponziMetrics } = project
  return (
    ponziMetrics.narrativeDependency +
    ponziMetrics.cashFlowSelfSufficiency +
    ponziMetrics.tokenDependency +
    ponziMetrics.lateComerRisk +
    ponziMetrics.exitDependency
  )
}

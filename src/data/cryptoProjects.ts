// 稀有度定义 - Gas Temple 专属
export type Rarity = 'trash' | 'plate' | 'schrodinger' | 'high-risk'

export const RARITY_CONFIG: Record<Rarity, {
  label: string
  labelEn: string
  color: string
  bgGradient: string
  probability: number
  ponziRange: [number, number]
}> = {
  trash: {
    label: '电子垃圾',
    labelEn: 'E-Waste',
    color: '#6b7280',
    bgGradient: 'from-gray-800 to-gray-900',
    probability: 0.50,
    ponziRange: [70, 100],
  },
  plate: {
    label: '精装盘子',
    labelEn: 'Premium Ponzi',
    color: '#3b82f6',
    bgGradient: 'from-blue-800 to-blue-900',
    probability: 0.30,
    ponziRange: [40, 70],
  },
  schrodinger: {
    label: '薛定谔的价值',
    labelEn: "Schrödinger's Value",
    color: '#8b5cf6',
    bgGradient: 'from-purple-800 to-purple-900',
    probability: 0.15,
    ponziRange: [20, 50],
  },
  'high-risk': {
    label: '高风险庄家',
    labelEn: 'High-Risk Boss',
    color: '#f59e0b',
    bgGradient: 'from-amber-700 to-orange-900',
    probability: 0.05,
    ponziRange: [0, 30],
  },
}

// 加密项目数据
export interface CryptoProject {
  id: string
  name: string
  symbol: string
  logo: string // emoji或图标
  category: string
  price: string
  change24h: number
  
  // 研报内容
  oneLiner: string // 一句话描述
  profitModel: string // 盈利模式
  risk: string // 风险提示
  whitePaperBS: string // 白皮书黑话翻译
  
  ponziIndex: number // 庞氏指数 0-100
  rarity: Rarity
}

// 模拟项目数据库
export const CRYPTO_PROJECTS: CryptoProject[] = [
  // 电子垃圾级别
  {
    id: 'safemoon',
    name: 'SafeMoon',
    symbol: 'SAFEMOON',
    logo: '🌙',
    category: 'Meme',
    price: '$0.0000001',
    change24h: -42.5,
    oneLiner: '安全到月球，钱包归零更安全',
    profitModel: '你买他卖，完美闭环',
    risk: '代币名里带Safe的，通常都不Safe',
    whitePaperBS: '"创新型通缩机制" = 项目方收10%税',
    ponziIndex: 95,
    rarity: 'trash',
  },
  {
    id: 'shibainu',
    name: 'Shiba Inu',
    symbol: 'SHIB',
    logo: '🐕',
    category: 'Meme',
    price: '$0.00001',
    change24h: -15.3,
    oneLiner: 'Doge杀手，杀的是你的钱包',
    profitModel: '比谁跑得快',
    risk: '狗狗对决，你是骨头',
    whitePaperBS: '"去中心化社区驱动" = 散户抬轿',
    ponziIndex: 85,
    rarity: 'trash',
  },
  {
    id: 'babydoge',
    name: 'Baby Doge',
    symbol: 'BABYDOGE',
    logo: '🐶',
    category: 'Meme',
    price: '$0.000000001',
    change24h: -28.7,
    oneLiner: '小狗币，小亏怡情大亏伤身',
    profitModel: '发推特等V神回复',
    risk: '零太多，数学老师都哭了',
    whitePaperBS: '"超级通缩" = 归零的高级说法',
    ponziIndex: 92,
    rarity: 'trash',
  },

  // 精装盘子级别
  {
    id: 'stepn',
    name: 'STEPN',
    symbol: 'GMT',
    logo: '👟',
    category: 'Move2Earn',
    price: '$0.15',
    change24h: -8.2,
    oneLiner: '跑步赚钱，跑得越快亏得越快',
    profitModel: '卖鞋给新韭菜',
    risk: '鞋子比你的腿值钱',
    whitePaperBS: '"可持续经济模型" = 新人接盘',
    ponziIndex: 65,
    rarity: 'plate',
  },
  {
    id: 'axs',
    name: 'Axie Infinity',
    symbol: 'AXS',
    logo: '🎮',
    category: 'GameFi',
    price: '$5.50',
    change24h: -12.4,
    oneLiner: '菲律宾打工人的梦想与现实',
    profitModel: '东南亚人力成本套利',
    risk: '宠物比你挣得多',
    whitePaperBS: '"玩赚经济" = 996换币',
    ponziIndex: 58,
    rarity: 'plate',
  },
  {
    id: 'sand',
    name: 'The Sandbox',
    symbol: 'SAND',
    logo: '🏖️',
    category: 'Metaverse',
    price: '$0.35',
    change24h: -5.6,
    oneLiner: '元宇宙地产，现实买不起虚拟也买不起',
    profitModel: '卖像素地给有钱的傻子',
    risk: '虚拟地产比真房子跌得还快',
    whitePaperBS: '"数字资产所有权" = 你拥有一堆像素',
    ponziIndex: 52,
    rarity: 'plate',
  },

  // 薛定谔的价值
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    logo: '☀️',
    category: 'L1',
    price: '$95',
    change24h: 3.2,
    oneLiner: '以太坊杀手，自己先宕机',
    profitModel: 'VC解锁后你来接盘',
    risk: '网络稳定性存疑',
    whitePaperBS: '"高性能区块链" = 中心化服务器集群',
    ponziIndex: 35,
    rarity: 'schrodinger',
  },
  {
    id: 'apt',
    name: 'Aptos',
    symbol: 'APT',
    logo: '🌀',
    category: 'L1',
    price: '$8.50',
    change24h: -2.1,
    oneLiner: 'Meta前员工的新故事',
    profitModel: '靠脸融资，靠你接盘',
    risk: '估值虚高，空投砸盘',
    whitePaperBS: '"Move语言革新" = 换个马甲继续讲',
    ponziIndex: 42,
    rarity: 'schrodinger',
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    symbol: 'ARB',
    logo: '🔵',
    category: 'L2',
    price: '$0.85',
    change24h: 1.5,
    oneLiner: 'L2扩容方案，扩容你的亏损',
    profitModel: '手续费分成',
    risk: '竞争激烈，护城河不深',
    whitePaperBS: '"Optimistic Rollup" = 乐观地等解锁',
    ponziIndex: 28,
    rarity: 'schrodinger',
  },

  // 高风险庄家级别
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: '₿',
    category: 'Store of Value',
    price: '$43,000',
    change24h: 2.1,
    oneLiner: '数字黄金，or数字郁金香',
    profitModel: '你信就有价值',
    risk: '能源消耗、监管风险',
    whitePaperBS: '"去中心化货币" = 矿池说了算',
    ponziIndex: 15,
    rarity: 'high-risk',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: '⟠',
    category: 'Smart Contract',
    price: '$2,300',
    change24h: 1.8,
    oneLiner: '世界计算机，Gas费贵过AWS',
    profitModel: 'DeFi、NFT、各种Fi',
    risk: '扩容永远在路上',
    whitePaperBS: '"可编程货币" = 智能合约漏洞提款机',
    ponziIndex: 20,
    rarity: 'high-risk',
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    logo: '🟡',
    category: 'Exchange Token',
    price: '$310',
    change24h: 0.5,
    oneLiner: '币安印钞机，CZ的提款卡',
    profitModel: '交易所生态闭环',
    risk: '中心化风险、监管压力',
    whitePaperBS: '"BNB Chain生态" = 币安全家桶',
    ponziIndex: 25,
    rarity: 'high-risk',
  },
]

// 抽卡结果
export interface GachaResult {
  id: string
  project: CryptoProject
  rarity: Rarity
  timestamp: Date
  fortune: string // 今日运势
  advice: string // 建议操作
}

// 运势文案
const FORTUNES = [
  '大凶 - 钱包清零倒计时',
  '凶 - 建议删除App',
  '小凶 - 回本遥遥无期',
  '平 - 横盘是最好的结果',
  '小吉 - 可能少亏点',
  '吉 - 偶尔也能绿',
  '大吉 - 庄家今天放假',
]

const ADVICES = [
  '删除App，出门左转买彩票',
  'HODL到死，反正已经归零',
  '抄底？你就是底',
  '逢跌必买，越买越跌',
  '装死不动，等牛市',
  '割肉跑路，保住本金',
  '加大杠杆，赌一把大的',
  '分批建仓，分批被埋',
  '学习技术分析，亏得更有道理',
  '躺平等空投，免费的最贵',
]

// 生成抽卡结果
export function generateGachaResult(): GachaResult {
  // 根据概率选择稀有度
  const rand = Math.random()
  let cumulative = 0
  let selectedRarity: Rarity = 'trash'
  
  for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
    cumulative += config.probability
    if (rand <= cumulative) {
      selectedRarity = rarity as Rarity
      break
    }
  }
  
  // 从对应稀有度的项目中随机选择
  const projectsOfRarity = CRYPTO_PROJECTS.filter(p => p.rarity === selectedRarity)
  const randomProject = projectsOfRarity[Math.floor(Math.random() * projectsOfRarity.length)]
  
  // 随机运势和建议
  const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
  const advice = ADVICES[Math.floor(Math.random() * ADVICES.length)]
  
  return {
    id: `gacha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    project: randomProject,
    rarity: selectedRarity,
    timestamp: new Date(),
    fortune,
    advice,
  }
}

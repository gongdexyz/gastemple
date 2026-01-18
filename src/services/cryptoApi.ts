// Crypto API Service for Gacha Fortune System
// 抓取 Solana 链上的小币种
const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_API_KEY

export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  market_cap_rank: number
}

export interface TrendingCoin {
  id: string
  name: string
  symbol: string
  thumb: string
  market_cap_rank: number
  price_btc: number
}

// 支持的链类别
const CHAIN_CATEGORIES = [
  'solana-ecosystem',      // Solana 生态
  'solana-meme-coins',     // Solana Meme
  'binance-smart-chain',   // BNB Chain
  'arbitrum-ecosystem',    // Arbitrum
  'base-ecosystem',        // Base
  'polygon-ecosystem',     // Polygon
  'avalanche-ecosystem',   // Avalanche
  'meme-token',            // 通用 Meme
]

// 抓取指定链的小币种
export async function fetchChainCoins(category: string, page = 2, limit = 50): Promise<CoinData[]> {
  try {
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&category=${category}&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false`
    const headers: HeadersInit = COINGECKO_KEY ? { 'x-cg-demo-api-key': COINGECKO_KEY } : {}
    
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`Failed to fetch ${category} coins`)
    return await res.json()
  } catch (error) {
    console.error(`fetchChainCoins ${category} error:`, error)
    return []
  }
}

// 抓取多链小币种
export async function fetchMultiChainCoins(): Promise<CoinData[]> {
  // 随机选择 2-3 个链类别抓取，避免 API 限制
  const shuffled = [...CHAIN_CATEGORIES].sort(() => Math.random() - 0.5)
  const selectedCategories = shuffled.slice(0, 3)
  
  try {
    const results = await Promise.all(
      selectedCategories.map(cat => fetchChainCoins(cat, 2, 30))
    )
    return results.flat()
  } catch (error) {
    console.error('fetchMultiChainCoins error:', error)
    return []
  }
}

// 抓取 Solana 生态小币种 (兼容旧代码)
export async function fetchSolanaCoins(limit = 100): Promise<CoinData[]> {
  return fetchChainCoins('solana-ecosystem', 2, limit)
}

// 抓取 Solana meme 币 (兼容旧代码)
export async function fetchSolanaMemeCoins(): Promise<CoinData[]> {
  return fetchChainCoins('solana-meme-coins', 1, 50)
}

// Fortune categories based on market sentiment
export type FortuneLevel = 'SSR' | 'SR' | 'R' | 'N'

export interface FortuneResult {
  level: FortuneLevel
  title: string
  titleEN: string
  message: string
  messageEN: string
  coin?: CoinData | TrendingCoin
  advice: string
  adviceEN: string
  color: string
  emoji: string
}

// 毒舌辣评文案库 - AI冷血分析风格（去掉"施主"，冷酷科技感）
const ROAST_TEMPLATES = {
  // 横盘专用 (变化 < 5%)
  sideways: {
    cn: [
      "监测到横盘信号。这走势比你奶奶的心电图都平。庄家是死了还是把你忘了？",
      "数据分析：此币已临床死亡。但你还舍不得拔管，对吧？",
      "横盘检测：建议改名「稳定币」。至少听起来体面点。",
      "K线扫描完成：比心电图还平。建议持有者去医院查查自己。",
      "波动率：0。这币和你的感情生活一样，死水一潭。",
    ],
    en: [
      "Flatline detected. This chart is deader than the dev's promises.",
      "Volatility scan: 0%. This coin moves less than your motivation.",
      "Crab market confirmed. Even crabs are embarrassed.",
    ]
  },
  // 暴跌专用 (变化 < -10%)
  bigDump: {
    cn: [
      "暴跌预警！没事，跌了90%还有90%可以跌，下跌空间充足。",
      "建议：把App颜色反转一下，这样看起来像在涨。",
      "价格已击穿成本线。建议留着当传家宝，传给孙子维权。",
      "抄底成功！恭喜你精准抄在了半山腰。山脚还远着呢。",
      "「价值投资」模式已激活。翻译：套牢了不想割。",
      "跌幅分析：这不是回调，这是跳楼。RIP。",
    ],
    en: [
      "DUMP ALERT. Down bad? At least you can write it off on taxes.",
      "Bottom detected! Just kidding. There's always a lower low.",
      "This isn't a dip. It's a funeral. Press F.",
    ]
  },
  // 暴涨专用 (变化 > 15%)
  bigPump: {
    cn: [
      "拉盘检测！这就拿不住了？注定是送外卖的命。接着奏乐接着舞！",
      "警告：庄家正在给你希望。别傻了，你就是出货对象。",
      "建议立即截图发朋友圈！5分钟后可能就没机会了。",
      "恭喜解锁成就：「纸面富贵」。记得及时落袋为安。",
      "异常拉升！翻译：有人要出货了，猜猜谁是接盘侠？",
    ],
    en: [
      "PUMP DETECTED. Screenshot now. You know what comes next.",
      "Warning: Dev is giving you hope. You ARE the exit liquidity.",
      "WAGMI? More like WAGMI-for-5-minutes-then-NGMI.",
    ]
  },
  // 低市值专用 (< $10M)
  lowMcap: {
    cn: [
      "流动性扫描：池子浅得连蝌蚪都养不活。跑路难度：地狱级。",
      "市值过低警告！庄家打个喷嚏你就归零了。",
      "深度分析：卖1000U就能砸穿。这不是投资，这是慈善。",
      "微型市值检测。翻译：随时可能归零的垃圾。",
    ],
    en: [
      "Liquidity scan: Pool shallower than your research before aping.",
      "Micro-cap alert. One whale sneeze = instant zero.",
    ]
  },
  // 低排名专用 (> 500)
  lowRank: {
    cn: [
      "排名扫描：太后了，CoinGecko都准备把它删了。",
      "数据显示：连山寨中的山寨都看不起这排名。狗都不买。",
      "低排名警告！这种垃圾，狗路过都要撇过头去。",
    ],
    en: [
      "Rank scan: So low even scammers forgot it exists.",
      "Bottom-tier detected. Even rugs have standards.",
    ]
  }
}

// 庞氏等级标签
export const PONZI_LABELS = {
  cn: {
    low: { emoji: '🟢', label: '电子黄金', desc: '相对靠谱，但别梭哈' },
    medium: { emoji: '🟡', label: '赌场筹码', desc: '击鼓传花，还能传两轮' },
    high: { emoji: '🟠', label: '精装盘子', desc: '想跑？门都给你焊死' },
    extreme: { emoji: '🔴', label: '功德扣除器', desc: '建议全职维权' },
  },
  en: {
    low: { emoji: '🟢', label: 'Cyber Gold', desc: 'Relatively safe, still DYOR' },
    medium: { emoji: '🟡', label: 'Casino Chip', desc: 'Musical chairs, 2 rounds left' },
    high: { emoji: '🟠', label: 'Premium Ponzi', desc: 'Exit? Door is welded shut' },
    extreme: { emoji: '🔴', label: 'Merit Destroyer', desc: 'Full-time lawsuit recommended' },
  }
}

// 获取庞氏等级
export function getPonziLabel(level: number, isEN: boolean) {
  const labels = isEN ? PONZI_LABELS.en : PONZI_LABELS.cn
  if (level <= 20) return labels.low
  if (level <= 50) return labels.medium
  if (level <= 80) return labels.high
  return labels.extreme
}

// 基于真实数据生成毒舌辣评
function generateRoast(coin: CoinData, _level: FortuneLevel, isEN: boolean): string {
  const change = coin.price_change_percentage_24h || 0
  const mcap = coin.market_cap || 0
  const rank = coin.market_cap_rank || 9999
  
  const lang = isEN ? 'en' : 'cn'
  let pool: string[] = []
  
  // 根据数据选择辣评池
  if (Math.abs(change) < 5) {
    pool = ROAST_TEMPLATES.sideways[lang]
  } else if (change < -10) {
    pool = ROAST_TEMPLATES.bigDump[lang]
  } else if (change > 15) {
    pool = ROAST_TEMPLATES.bigPump[lang]
  } else if (mcap < 10000000) {
    pool = ROAST_TEMPLATES.lowMcap[lang]
  } else if (rank > 500) {
    pool = ROAST_TEMPLATES.lowRank[lang]
  } else {
    pool = ROAST_TEMPLATES.sideways[lang]
  }
  
  // 随机选一条
  return pool[Math.floor(Math.random() * pool.length)]
}

// Generate fortune based on multi-chain small coins
export async function generateFortune(): Promise<FortuneResult> {
  // 抓取多链小币种
  const allCoins = await fetchMultiChainCoins()

  // Random fortune level with weighted probability
  const rand = Math.random()
  let level: FortuneLevel
  if (rand < 0.05) level = 'SSR'      // 5%
  else if (rand < 0.20) level = 'SR'  // 15%
  else if (rand < 0.50) level = 'R'   // 30%
  else level = 'N'                     // 50%

  // Pick a coin based on fortune level
  let selectedCoin: CoinData
  
  if (allCoins.length === 0) {
    // API 失败时的 fallback
    selectedCoin = {
      id: 'unknown',
      symbol: 'COPE',
      name: 'Copium',
      image: '',
      current_price: 0.001,
      price_change_percentage_24h: -50,
      market_cap: 100000,
      market_cap_rank: 9999
    }
  } else if (level === 'SSR') {
    const gainers = allCoins.filter((c: CoinData) => c.price_change_percentage_24h > 10)
    selectedCoin = gainers.length > 0 
      ? gainers[Math.floor(Math.random() * gainers.length)]
      : allCoins[Math.floor(Math.random() * Math.min(5, allCoins.length))]
  } else if (level === 'SR') {
    selectedCoin = allCoins[Math.floor(Math.random() * Math.min(10, allCoins.length))]
  } else if (level === 'R') {
    const midStart = Math.floor(allCoins.length * 0.3)
    const midEnd = Math.floor(allCoins.length * 0.7)
    selectedCoin = allCoins[midStart + Math.floor(Math.random() * (midEnd - midStart))] || allCoins[0]
  } else {
    const losers = allCoins.filter((c: CoinData) => c.price_change_percentage_24h < -5)
    selectedCoin = losers.length > 0
      ? losers[Math.floor(Math.random() * losers.length)]
      : allCoins[Math.floor(Math.random() * allCoins.length)]
  }

  // 基于真实数据生成辣评
  const roastCN = generateRoast(selectedCoin, level, false)
  const roastEN = generateRoast(selectedCoin, level, true)
  const symbol = selectedCoin.symbol?.toUpperCase() || 'UNKNOWN'
  const change = selectedCoin.price_change_percentage_24h || 0

  // Generate fortune messages with real data insights
  const fortunes: Record<FortuneLevel, FortuneResult> = {
    'SSR': {
      level: 'SSR',
      title: '天选之人',
      titleEN: 'CHOSEN ONE',
      message: `佛祖显灵！${symbol} 24h涨了 ${change.toFixed(1)}%！${roastCN}`,
      messageEN: `Holy shit! ${symbol} pumped ${change.toFixed(1)}% in 24h! ${roastEN}`,
      advice: '今日宜梭哈，不宜犹豫。记住：落袋为安，别当貔貅。',
      adviceEN: 'WAGMI energy detected. Take profits or become a case study.',
      color: 'from-yellow-400 to-orange-500',
      emoji: '🌟'
    },
    'SR': {
      level: 'SR',
      title: '福星高照',
      titleEN: 'BLESSED',
      message: `善哉！${symbol} 有点东西。${roastCN}`,
      messageEN: `${symbol} looking kinda based. ${roastEN}`,
      advice: '小仓位试试，别 FOMO 成接盘侠。',
      adviceEN: 'Ape responsibly. Your wife\'s boyfriend is watching.',
      color: 'from-purple-400 to-pink-500',
      emoji: '✨'
    },
    'R': {
      level: 'R',
      title: '平平安安',
      titleEN: 'MID',
      message: `${symbol} ${change >= 0 ? '涨' : '跌'}了 ${Math.abs(change).toFixed(1)}%，不好不坏。${roastCN}`,
      messageEN: `${symbol} ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}%, mid af. ${roastEN}`,
      advice: '别人恐惧我贪婪，但你先等等。',
      adviceEN: 'Could be worse. Could also be better. Story of your life.',
      color: 'from-blue-400 to-cyan-500',
      emoji: '🙏'
    },
    'N': {
      level: 'N',
      title: '韭零后',
      titleEN: 'NGMI',
      message: `施主，${symbol} 跌了 ${Math.abs(change).toFixed(1)}%。${roastCN}`,
      messageEN: `Ser, ${symbol} dumped ${Math.abs(change).toFixed(1)}%. ${roastEN}`,
      advice: '今日不宜交易。价值投资？那是套牢的借口。',
      adviceEN: 'Do NOT trade today. Diamond hands = Bag holder. Cope harder.',
      color: 'from-gray-400 to-gray-600',
      emoji: '💀'
    }
  }

  return {
    ...fortunes[level],
    coin: selectedCoin
  }
}

// Cache management
let cachedCoins: CoinData[] = []
let lastFetchTime = 0
const CACHE_DURATION = 60000 // 1 minute

export async function getCachedCoins(): Promise<CoinData[]> {
  const now = Date.now()
  if (cachedCoins.length === 0 || now - lastFetchTime > CACHE_DURATION) {
    cachedCoins = await fetchSolanaCoins(100)
    lastFetchTime = now
  }
  return cachedCoins
}

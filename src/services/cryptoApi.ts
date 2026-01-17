// Crypto API Service for Gacha Fortune System
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

// Fetch top coins by market cap
export async function fetchTopCoins(limit = 100): Promise<CoinData[]> {
  try {
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    const headers: HeadersInit = COINGECKO_KEY ? { 'x-cg-demo-api-key': COINGECKO_KEY } : {}
    
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error('Failed to fetch coins')
    return await res.json()
  } catch (error) {
    console.error('fetchTopCoins error:', error)
    return []
  }
}

// Fetch trending coins
export async function fetchTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const url = `${COINGECKO_API}/search/trending`
    const headers: HeadersInit = COINGECKO_KEY ? { 'x-cg-demo-api-key': COINGECKO_KEY } : {}
    
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error('Failed to fetch trending')
    const data = await res.json()
    return data.coins?.map((c: { item: TrendingCoin }) => c.item) || []
  } catch (error) {
    console.error('fetchTrendingCoins error:', error)
    return []
  }
}

// Fetch global market data
export async function fetchGlobalData() {
  try {
    const url = `${COINGECKO_API}/global`
    const headers: HeadersInit = COINGECKO_KEY ? { 'x-cg-demo-api-key': COINGECKO_KEY } : {}
    
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error('Failed to fetch global data')
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('fetchGlobalData error:', error)
    return null
  }
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

// Generate fortune based on real market data
export async function generateFortune(): Promise<FortuneResult> {
  const [coins, trending, global] = await Promise.all([
    fetchTopCoins(50),
    fetchTrendingCoins(),
    fetchGlobalData()
  ])

  // Random fortune level with weighted probability
  const rand = Math.random()
  let level: FortuneLevel
  if (rand < 0.05) level = 'SSR'      // 5%
  else if (rand < 0.20) level = 'SR'  // 15%
  else if (rand < 0.50) level = 'R'   // 30%
  else level = 'N'                     // 50%

  // Market sentiment from global data
  const marketChange = global?.market_cap_change_percentage_24h_usd || 0
  const isBullish = marketChange > 0

  // Pick a coin based on fortune level
  let selectedCoin: CoinData | TrendingCoin | undefined
  
  if (level === 'SSR') {
    // SSR: Pick from trending or top gainers
    const gainers = coins.filter(c => c.price_change_percentage_24h > 10)
    selectedCoin = gainers.length > 0 
      ? gainers[Math.floor(Math.random() * gainers.length)]
      : trending[0]
  } else if (level === 'SR') {
    // SR: Pick from trending
    selectedCoin = trending[Math.floor(Math.random() * Math.min(trending.length, 5))]
  } else if (level === 'R') {
    // R: Random top 20 coin
    selectedCoin = coins[Math.floor(Math.random() * 20)]
  } else {
    // N: Random coin or loser
    const losers = coins.filter(c => c.price_change_percentage_24h < -5)
    selectedCoin = losers.length > 0
      ? losers[Math.floor(Math.random() * losers.length)]
      : coins[Math.floor(Math.random() * coins.length)]
  }

  // Generate fortune messages
  const fortunes: Record<FortuneLevel, FortuneResult> = {
    'SSR': {
      level: 'SSR',
      title: '天选之人',
      titleEN: 'CHOSEN ONE',
      message: `佛祖显灵！${selectedCoin?.symbol?.toUpperCase() || 'BTC'} 正在起飞！格局打开，但别把钱包打空。`,
      messageEN: `Holy shit ser! ${selectedCoin?.symbol?.toUpperCase() || 'BTC'} is pumping! You're actually gonna make it. Screenshot this before it dumps.`,
      advice: '今日宜梭哈，不宜犹豫。记住：落袋为安，别当貔貅。',
      adviceEN: 'WAGMI energy detected. Take profits or become a case study.',
      color: 'from-yellow-400 to-orange-500',
      emoji: '🌟'
    },
    'SR': {
      level: 'SR',
      title: '福星高照',
      titleEN: 'BLESSED',
      message: `善哉！${selectedCoin?.symbol?.toUpperCase() || 'ETH'} 有点东西，但别全是情绪没有价值。`,
      messageEN: `${selectedCoin?.symbol?.toUpperCase() || 'ETH'} looking kinda based. Not financial advice but also not not financial advice.`,
      advice: '小仓位试试，别 FOMO 成接盘侠。',
      adviceEN: 'Ape responsibly. Your wife\'s boyfriend is watching.',
      color: 'from-purple-400 to-pink-500',
      emoji: '✨'
    },
    'R': {
      level: 'R',
      title: '平平安安',
      titleEN: 'MID',
      message: `${selectedCoin?.symbol?.toUpperCase() || 'SOL'} 不好不坏，像极了你的人生。`,
      messageEN: `${selectedCoin?.symbol?.toUpperCase() || 'SOL'} is giving... mid. Just like your portfolio.`,
      advice: isBullish ? '别人恐惧我贪婪，但你先等等。' : '市场不太行，出去碰碰草吧。',
      adviceEN: isBullish ? 'Could be worse. Could also be better. Story of your life.' : 'Market\'s crabbing. Go touch grass ser.',
      color: 'from-blue-400 to-cyan-500',
      emoji: '🙏'
    },
    'N': {
      level: 'N',
      title: '韭零后',
      titleEN: 'NGMI',
      message: `施主，我不是在抄底，我是在垫底。${selectedCoin?.symbol?.toUpperCase() || '某币'} 建议别碰。`,
      messageEN: `Ser you are literally exit liquidity. ${selectedCoin?.symbol?.toUpperCase() || 'This coin'} will humble you. Have fun staying poor.`,
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
    cachedCoins = await fetchTopCoins(100)
    lastFetchTime = now
  }
  return cachedCoins
}

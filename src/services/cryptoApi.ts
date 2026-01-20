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
      "监测到横盘信号。这走势比木乃伊的心电图都平。庄家是死了还是把你忘了？",
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
      "恭喜解锁成就：「纸面富贵」。记得及时落袋为安。",
      "涨疯了！建议立即截图发朋友圈炫耀！",
      "起飞了！但记住：没卖之前都是纸面富贵。",
      "暴涨警报！你是天选之人还是最后的接盘侠？只有时间知道。",
    ],
    en: [
      "PUMP DETECTED. Screenshot now before it disappears!",
      "Moon mission activated! But remember: profit isn't real until you sell.",
      "WAGMI energy! Take some profits, don't be greedy.",
    ]
  },
  // 小涨专用 (变化 5% - 15%)
  smallPump: {
    cn: [
      "小涨不错！佛祖保佑，继续拿稳。",
      "涨了一点，别急着卖，也别急着加仓。稳住。",
      "绿色K线！虽然不多，但至少没亏。阿弥陀佛。",
      "微涨检测。恭喜，你今天不是最惨的那个。",
      "还行，至少比存银行强。继续观望。",
    ],
    en: [
      "Small gains! Buddha blesses your bags.",
      "Green candle detected. Not much, but hey, you're not losing.",
      "Modest pump. At least you're not the biggest loser today.",
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

// 佛系毒舌文案库 - 先夸后阴阳怪气+佛祖金句补刀
const BUDDHA_ROASTS = {
  // 垃圾币小涨专用 (5%-15% 但排名很差) - 诱多陷阱/回光返照风格
  shitcoinPump: {
    cn: [
      "奇迹！监测到心脏复苏信号（+{change}%）。但这走势怎么看都像是「回光返照」。你是信它起死回生，还是信庄家在拔氧气管前最后骗一次保费？",
      "哟，涨了{change}%？这叫「巴甫洛夫的狗」效应。之前跌了90%打你一顿，今天给个甜枣你就摇尾巴了？斯德哥尔摩综合症晚期患者建议立刻就医。",
      "善哉！这只垃圾桶里最靓的仔居然发光了（+{change}%）。虽然本质还是废品，但不得不承认，它今天是一块「可回收垃圾」。建议趁热回收，晚了就馊了。",
      "监测到尸体...哦不，代币生命体征恢复了{change}%。这种走势在医学上叫「回光返照」，在金融学上叫「骗炮」。庄家花点小钱画个门，你就以为牛回速归了？",
      "涨了{change}%？这叫「死刑犯的断头饭」——吃得再好，结局也不会变。上天给你这{change}%是让你逃生的，不是让你加仓的。",
    ],
    en: [
      "Miracle! Heartbeat detected (+{change}%). But this looks like a 'dead cat bounce'. Are you believing in resurrection, or is the market maker pulling the plug after one last scam?",
      "Oh, up {change}%? Classic Pavlov's dog. They beat you down 90%, now a little treat and you're wagging your tail? Stockholm syndrome patient detected.",
      "Blessed! The shiniest turd in the garbage bin is glowing (+{change}%). Still trash, but today it's 'recyclable trash'. Sell it while it's warm, before it rots.",
      "Corpse detected... oh wait, vital signs recovered {change}%. Medically this is called 'rally before death'. Financially it's called 'bull trap'. Don't fall for it.",
    ]
  },
  // 正常币小涨专用 (5%-15%) - 温和阴阳
  smallPump: {
    cn: [
      "善哉善哉！这小币种今日小涨{change}%，像个刚学会走路的娃娃，终于迈出第一步了。庄家轻轻推了一把，它就摇摇晃晃地站起来了，可喜可贺～",
      "阿弥陀佛！涨了{change}%，简直是佛祖今天心情好，随手撒了点功德雨。但佛祖提醒：小鸟飞太高容易被风吹秃毛。",
      "善哉！涨了{change}%，技术面出现罕见的'小阳线'，基本面出现罕见的'有点氧气'。恭喜施主抽到一只'活着的空气币'。",
      "善哉！小涨{change}%，像个乖宝宝终于肯吃饭了，妈妈好感动～但佛祖提醒：乖宝宝长大后也可能叛逆哦。",
    ],
    en: [
      "Blessed be! Up {change}% today, like a baby learning to walk. The market maker gave it a little push, and it wobbled up. How touching~",
      "Amitabha! Up {change}%, Buddha must be in a good mood today. But Buddha reminds: fly too high and you might lose your feathers.",
      "Blessed! Up {change}%, finally showing signs of life. Congrats on finding a coin that's 'not completely dead yet'.",
    ]
  },
  // 垃圾币暴涨专用 (>15% 但排名很差) - 更狠的警告
  shitcoinBigPump: {
    cn: [
      "佛祖显灵！暴涨{change}%！但别嗨，这根绿柱子不过是给你立的墓碑罢了。庄家把镰刀举高了{change}%，是为了砍得更深，不是为了放你走。",
      "阿弥陀佛！{change}%的涨幅！项目方正在游艇上开香槟，这{change}%是他们买香槟剩下的零钱。你是业绩，不是股东。",
      "暴涨{change}%！经典的「杀猪盘」诱饵结构。目前的上涨只是为了让猪肉更紧实一点。趁现在门缝开了一点点，赶紧挤出去。",
      "涨了{change}%？色即是空，涨即是跌。这{change}%是心魔，是庄家施舍的诱饵。你若贪恋这口饵，便是吞下了整个鱼钩。",
    ],
    en: [
      "Buddha's blessing! Up {change}%! But don't celebrate - this green candle is just your tombstone. Market maker raised the scythe {change}% higher to cut deeper, not to let you go.",
      "Amitabha! {change}% pump! The dev team is popping champagne on their yacht. This {change}% is their spare change. You're the product, not the shareholder.",
      "Up {change}%! Classic 'pig butchering' bait structure. This pump is just to fatten you up before slaughter. The door is cracked open - squeeze out NOW.",
    ]
  },
  // 正常币暴涨专用 (>15%) - 先捧后警告
  bigPump: {
    cn: [
      "佛祖显灵！暴涨{change}%！简直是佛祖今天心情大好，随手赏了它一口仙气。但记住：涨得快是佛祖在提醒你——该跑了。",
      "阿弥陀佛！{change}%的涨幅！恭喜施主解锁成就「纸面富贵」。但佛祖提醒：没卖之前都是镜花水月，及时止盈才是正道。",
      "善哉善哉！暴涨{change}%！但佛祖说：涨得慢是修行，涨得快是幻觉。施主莫贪心，及时落袋为安。",
      "佛光普照！{change}%！建议立即截图发朋友圈炫耀，5分钟后可能就没了。就算是坏掉的钟，一天也能准两次。恭喜你撞上了。",
    ],
    en: [
      "Buddha's blessing! Up {change}%! Buddha is in an amazing mood today. But remember: pumping fast means Buddha is reminding you - time to RUN.",
      "Amitabha! {change}% pump! Congrats on unlocking 'Paper Wealth' achievement. But Buddha says: unrealized gains are just illusions. Take profits.",
      "Blessed! Up {change}%! Even a broken clock is right twice a day. Congrats, you hit one of those times. Don't wait for it to turn.",
    ]
  },
  // 横盘专用 - 阴阳怪气
  sideways: {
    cn: [
      "这走势比木乃伊的心电图都平。庄家是死了还是把你忘了？佛祖说：横盘是修行，但修太久会成仙（归零）。",
      "波动率接近0。这币和你的感情生活一样，死水一潭。佛祖提醒：死水里偶尔也会冒泡，但大概率是沼气。",
      "K线扫描完成：比心电图还平。建议持有者去医院查查自己。佛祖说：平静是福，但太平静就是临终关怀了。",
      "横盘检测：建议改名「稳定币」。至少听起来体面点。佛祖说：稳定是好事，但稳定在谷底就是另一回事了。",
    ],
    en: [
      "This chart is flatter than a mummy's heartbeat. Is the market maker dead or did they forget you? Buddha says: sideways is practice, but too long and you'll ascend (to zero).",
      "Volatility near zero. This coin is as dead as your love life. Buddha reminds: still water sometimes bubbles, but it's probably just swamp gas.",
      "Chart scan complete: flatter than an EKG. Holders should get themselves checked. Buddha says: peace is good, but too peaceful means hospice care.",
    ]
  },
  // 小跌专用 (-5% to -10%)
  smallDump: {
    cn: [
      "跌了{change}%，佛祖说：小跌是考验，大跌是劫难。施主莫慌，这只是佛祖在测试你的信仰。但如果明天还跌……那就是真的劫难了。",
      "红色K线！跌了{change}%。佛祖说：别人恐惧我贪婪？先等等，看看是不是真的恐惧还是理性逃跑。",
      "小跌{change}%，庄家今天心情不太好。佛祖提醒：小跌不可怕，可怕的是小跌后面跟着大跌。阿弥陀佛，保重。",
    ],
    en: [
      "Down {change}%. Buddha says: small dips are tests, big dumps are disasters. Don't panic, Buddha is just testing your faith. But if it dumps again tomorrow... that's a real disaster.",
      "Red candle! Down {change}%. Buddha says: be greedy when others are fearful? Wait and see if it's real fear or rational fleeing.",
    ]
  },
  // 暴跌专用 (<-10%)
  bigDump: {
    cn: [
      "暴跌{change}%！这不是回调，这是跳楼。佛祖说：跌了90%还有90%可以跌，下跌空间充足。建议留着当传家宝，传给孙子维权。",
      "阿弥陀佛！暴跌{change}%！佛祖说：把App颜色反转一下，这样看起来像在涨。心理安慰也是一种修行。",
      "善哉！跌了{change}%。佛祖说：「价值投资」模式已激活。翻译：套牢了不想割。施主，放下执念，及时止损才是正道。",
      "暴跌{change}%！佛祖说：抄底成功！恭喜你精准抄在了半山腰。山脚还远着呢，继续加油。",
      "跌了{change}%！我不入地狱谁入地狱？施主大义！功德+1000（以此慰藉受伤的心灵）。",
    ],
    en: [
      "DOWN {change}%! This isn't a dip, it's a cliff dive. Buddha says: down 90% still has 90% more to go. Keep it as a family heirloom for your grandkids to sue over.",
      "Amitabha! Down {change}%! Buddha says: invert your app colors, it'll look like it's pumping. Mental comfort is also a form of practice.",
      "Blessed! Down {change}%. Buddha says: 'Value investing' mode activated. Translation: bagholder in denial. Let go of attachment, cut losses is the way.",
      "Down {change}%! If not me, who enters hell? Noble sacrifice! Merit +1000 (to comfort your wounded soul).",
    ]
  },
  // 低排名补刀
  lowRankRoast: {
    cn: [
      "排名#{rank}...群主正在闲鱼卖二手电瓶车筹集拉盘资金。",
      "排名#{rank}，项目定位：缅北电诈园区VIP中转站。风景很好，进来就别想出去了。",
      "排名#{rank}，CoinGecko都准备把它删了。连山寨中的山寨都看不起这排名。",
    ],
    en: [
      "Rank #{rank}... dev is selling used scooters on eBay to fund the next pump.",
      "Rank #{rank}, project location: Myanmar scam compound VIP lounge. Nice view, but no exit.",
      "Rank #{rank}, CoinGecko is about to delete it. Even shitcoins look down on this.",
    ]
  }
}

// 基于真实数据生成毒舌辣评 - 佛系阴阳怪气风格
function generateRoast(coin: CoinData, _level: FortuneLevel, isEN: boolean): string {
  const change = coin.price_change_percentage_24h || 0
  const mcap = coin.market_cap || 0
  const rank = coin.market_cap_rank || 9999
  
  // 判断基本面是否垃圾（低排名或低市值）- 诱多陷阱/回光返照场景
  const isShitcoin = rank > 500 || mcap < 10000000
  const lang = isEN ? 'en' : 'cn'
  
  let pool: string[]
  let roast: string
  
  // 根据涨跌+是否垃圾币选择文案池
  if (change > 15) {
    // 暴涨：垃圾币用更狠的警告，正常币用温和警告
    pool = isShitcoin ? BUDDHA_ROASTS.shitcoinBigPump[lang] : BUDDHA_ROASTS.bigPump[lang]
  } else if (change > 5) {
    // 小涨：垃圾币用诱多陷阱/回光返照，正常币用温和阴阳
    pool = isShitcoin ? BUDDHA_ROASTS.shitcoinPump[lang] : BUDDHA_ROASTS.smallPump[lang]
  } else if (change < -10) {
    // 暴跌
    pool = BUDDHA_ROASTS.bigDump[lang]
  } else if (change < -5) {
    // 小跌
    pool = BUDDHA_ROASTS.smallDump[lang]
  } else {
    // 横盘
    pool = BUDDHA_ROASTS.sideways[lang]
  }
  
  // 随机选一条并替换变量
  roast = pool[Math.floor(Math.random() * pool.length)]
  roast = roast.replace(/{change}/g, Math.abs(change).toFixed(1))
  roast = roast.replace(/{rank}/g, rank.toString())
  
  // 如果是垃圾币且在涨，追加低排名补刀（概率50%，避免太长）
  if (isShitcoin && change > 0 && Math.random() > 0.5) {
    const rankRoasts = BUDDHA_ROASTS.lowRankRoast[lang]
    const rankRoast = rankRoasts[Math.floor(Math.random() * rankRoasts.length)]
      .replace(/{rank}/g, rank.toString())
    roast += ' ' + rankRoast
  }
  
  return roast
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

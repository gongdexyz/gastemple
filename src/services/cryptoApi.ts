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
  // ATH相关数据
  ath?: number                      // 历史最高价
  ath_change_percentage?: number    // 距ATH跌幅（负数）
  ath_date?: string                 // ATH日期
  atl?: number                      // 历史最低价
  atl_change_percentage?: number    // 距ATL涨幅
  total_volume?: number             // 24h交易量
  circulating_supply?: number       // 流通量
  total_supply?: number             // 总量
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

// 软萌毒舌辣评文案库 - Pepe 佛祖温柔暴击版 🐸✨
// 用最可爱的语气，说最扎心的真话
const ROAST_TEMPLATES = {
  // 横盘专用 (变化 < 5%) - 哄孩子版
  sideways: {
    cn: [
      "这走势比佛祖的心跳还平呢~ 庄家是去度假了，还是忘记你了呀？😴",
      "宝子，这币已经睡着了哦~ 要不要戳一下看看还活着吗？💤",
      "横盘中...建议改名叫「稳定币」，至少听起来体面一点~ 😊",
      "K线好平呀~ 比你的感情生活还平~ 但没关系，佛祖陪你~ 💕",
      "波动率：0。这币和你一样，都在摆烂呢~ 加油哦！🌸",
    ],
    en: [
      "This chart is flatter than Buddha's heartbeat~ Did the market maker go on vacation or forget about you? 😴",
      "Sweetie, this coin fell asleep~ Wanna poke it to see if it's still alive? 💤",
      "Sideways... Suggest renaming it 'stablecoin', at least sounds decent~ 😊",
    ]
  },
  // 暴跌专用 (变化 < -10%) - 温柔安慰版
  bigDump: {
    cn: [
      "哎呀跌了好多呢~ 没事，跌了90%还有90%可以跌，空间很大哦~ 💫",
      "宝子别难过~ 把App颜色反转一下，看起来就像在涨啦！心理安慰也是安慰~ 🌈",
      "价格已经跌破成本线了呢~ 建议留着当传家宝，传给孙子维权~ 📜",
      "抄底成功！恭喜你精准抄在了半山腰~ 山脚还远着呢，继续加油！⛰️",
      "「价值投资」模式已激活~ 翻译：套牢了不想割~ 佛祖懂你~ 💕",
      "跌幅分析：这不是回调哦，这是...跳楼~ 但没关系，佛祖接住你！🤗",
    ],
    en: [
      "Oh no it dumped so much~ Don't worry, down 90% still has 90% to go, plenty of space~ 💫",
      "Sweetie don't be sad~ Invert your app colors, it'll look like it's pumping! Mental comfort counts~ 🌈",
      "Price broke below cost~ Suggest keeping it as family heirloom, pass to grandkids for lawsuit~ 📜",
    ]
  },
  // 暴涨专用 (变化 > 15%) - 温柔提醒版
  bigPump: {
    cn: [
      "哇塞涨了好多！这就拿不住了吗？注定是送外卖的命呢~ 接着奏乐接着舞！🎉",
      "恭喜解锁成就：「纸面富贵」~ 记得及时落袋为安哦，不然就飞走啦~ 🦋",
      "涨疯了！建议立即截图发朋友圈炫耀！（5分钟后可能就没了，嘻嘻）📸",
      "起飞了！但记住：没卖之前都是纸面富贵哦~ 佛祖提醒你~ ✨",
      "暴涨警报！你是天选之人还是最后的接盘侠？只有时间知道呢~ ⏰",
    ],
    en: [
      "Wow pumped so much! Can't hold already? Destined for delivery job~ Keep dancing! 🎉",
      "Congrats unlocked: 'Paper Wealth'~ Remember to take profits, or it'll fly away~ 🦋",
      "Mooning! Quick screenshot for socials! (Might be gone in 5 mins, hehe) 📸",
    ]
  },
  // 小涨专用 (变化 5% - 15%) - 鼓励版
  smallPump: {
    cn: [
      "小涨不错呢！佛祖保佑，继续拿稳~ 加油哦！💪",
      "涨了一点，别急着卖，也别急着加仓~ 稳住就是胜利~ 🌸",
      "绿色K线！虽然不多，但至少没亏呢~ 阿弥陀佛~ 🙏",
      "微涨检测~ 恭喜，你今天不是最惨的那个啦！✨",
      "还行，至少比存银行强~ 继续观望哦~ 😊",
    ],
    en: [
      "Small gains! Buddha blesses your bags~ Keep going! 💪",
      "Green candle! Not much, but hey, you're not losing~ 🌸",
      "Modest pump~ Congrats, you're not the biggest loser today! ✨",
    ]
  },
  // 低市值专用 (< $10M) - 善意警告版
  lowMcap: {
    cn: [
      "流动性扫描：池子浅得连小鱼都养不活呢~ 跑路难度：地狱级~ 🐟",
      "市值过低警告！庄家打个喷嚏你就归零了哦~ 小心点~ 🤧",
      "深度分析：卖1000U就能砸穿~ 这不是投资，这是慈善呢~ 💝",
      "微型市值检测~ 翻译：随时可能归零的小可怜~ 抱抱~ 🤗",
    ],
    en: [
      "Liquidity scan: Pool shallower than a puddle~ Exit difficulty: Hell mode~ 🐟",
      "Micro-cap alert~ One whale sneeze = instant zero~ Be careful~ 🤧",
    ]
  },
  // 低排名专用 (> 500) - 温柔吐槽版
  lowRank: {
    cn: [
      "排名扫描：太后面了，CoinGecko都准备删它了呢~ 😅",
      "数据显示：连山寨中的山寨都看不起这排名~ 但佛祖不嫌弃你~ 💕",
      "低排名警告！这种垃圾，狗路过都要撇过头去呢~ 🐕",
    ],
    en: [
      "Rank scan: So low even CoinGecko forgot it exists~ 😅",
      "Bottom-tier detected~ Even scams have standards~ But Buddha doesn't judge~ 💕",
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

// 【全员恶人·木鱼蛙辣评】- 1.0经典版 + 2.0素质放下版 混合
// 看第一眼想笑，看第二眼想哭，看第三眼觉得"虽然骂得难听但好有道理"
const BUDDHA_ROASTS = {
  // 🟢 诈尸诱多版（涨 5%-15% 且垃圾币）- 断头饭风格
  shitcoinPump: {
    cn: [
      // 2.0 素质放下版
      "🤖 善哉！监测到该币种出现了「医学奇迹」——在长期植物人状态下，手指头突然动了一下（+{change}%）。别激动，这通常不叫苏醒，叫「尸僵反应」。庄家只是想把镰刀举高一点，好砍得更顺手。ATH跌了{athDrop}%你装看不见？",
      "🏛️ 涨了{change}%？代币模型：空气中掺杂了少量兴奋剂。跑路难度：「关门打狗」的前兆。门缝还留了一丝，你猜是给你逃跑用的，还是为了夹你的头？项目定位：📍屠宰场VIP候场区。给猪听音乐，是为了肉质更鲜美。",
      "🪷 这{change}%的涨幅是「心魔」，是给你的一碗「断头饭」。吃饱了就该上路了。ATH跌了{athDrop}%，贪念一起，万劫不复。🔮 今日宜：割肉逃生 | 忌：幻想反转",
      // 1.0 经典版
      "善哉！监测到心脏复苏信号（+{change}%）。但ATH跌了{athDrop}%，这走势怎么看都像是「回光返照」。你是信它起死回生，还是信庄家在拔氧气管前最后骗一次保费？",
      "哟，涨了{change}%？这叫「巴甫洛夫的狗」效应。之前跌了{athDrop}%打你一顿，今天给个甜枣你就摇尾巴了？斯德哥尔摩综合症晚期患者建议立刻就医。",
      "善哉！这只垃圾桶里最靓的仔居然发光了（+{change}%）。虽然距离历史高点还跌了{athDrop}%，但不得不承认，它今天是一块「可回收垃圾」。建议趁热回收，晚了就馊了。",
      "涨了{change}%？历史高点跌了{athDrop}%你怎么不说？这叫「死刑犯的断头饭」——吃得再好，结局也不会变。上天给你这涨幅是让你逃生的，不是让你加仓的。",
      // 3.0 新增扩充版
      "🤖 涨了{change}%？贫僧掐指一算，这是庄家在「钓鱼执法」。鱼饵很香，但钩子更锋利。ATH跌了{athDrop}%，你是鱼，不是渔夫。",
      "🏛️ +{change}%的涨幅！项目方正在群里发红包庆祝——庆祝又有韭菜上钩了。ATH跌了{athDrop}%，这红包是用你的血染红的。",
      "🪷 善哉！这{change}%是「PUA渣男」式的甜头。他偶尔对你好，是为了让你更舍不得离开。ATH跌了{athDrop}%，清醒一点，他不爱你。",
      "涨了{change}%？这叫「温水煮青蛙」的升级版——先给你点甜头，让你放松警惕。ATH跌了{athDrop}%，水已经开了，你还在享受温泉？",
      "🤖 监测到「诱多信号」！涨了{change}%，但ATH跌了{athDrop}%。这就像渣男说「我变了」——信他你就输了。",
      "🏛️ +{change}%！代币模型：经典的「割韭菜前的施肥」。肥料撒得越多，韭菜长得越壮，割起来越爽。ATH跌了{athDrop}%，你就是那颗最壮的韭菜。",
      "🪷 这{change}%的涨幅是「回光返照」，是「落日余晖」。太阳落山前总是最美的，但天黑之后呢？ATH跌了{athDrop}%，天快黑了。",
      "涨了{change}%？佛祖说：「庄家今天心情好，决定让韭菜们开心一下再收割。」ATH跌了{athDrop}%，开心完了该上路了。",
    ],
    en: [
      "🤖 Blessed! Detected a 'medical miracle' - after being brain-dead for months, the finger twitched (+{change}%). Don't get excited, this is called 'corpse spasm', not recovery. Market maker just raised the scythe higher. ATH down {athDrop}% btw.",
      "🏛️ Up {change}%? Token model: air with a hint of stimulant. Exit difficulty: 'trap door closing'. Project location: 📍Slaughterhouse VIP waiting room. They play music for pigs to make the meat more tender.",
      "🪷 This {change}% pump is 'inner demon', your 'last meal before execution'. Eat up, then hit the road. ATH down {athDrop}%. Greed leads to eternal damnation. 🔮 Today: cut losses | Avoid: hopium",
      "Oh, up {change}%? Classic Pavlov's dog. They beat you down {athDrop}% from ATH, now a little treat and you're wagging your tail? Stockholm syndrome patient detected.",
      "Blessed! The shiniest turd is glowing (+{change}%). Still down {athDrop}% from ATH though. Today it's 'recyclable trash'. Sell it while it's warm, before it rots.",
      // 3.0 新增扩充版
      "🤖 Up {change}%? Buddha calculated: this is 'fishing enforcement'. Bait smells good, but the hook is sharper. ATH down {athDrop}%, you're the fish, not the fisherman.",
      "🏛️ +{change}% pump! Team is celebrating in the group chat - celebrating another leek took the bait. ATH down {athDrop}%, that red packet is dyed with your blood.",
      "🪷 This {change}% is 'toxic boyfriend' style sweetness. He's nice sometimes so you won't leave. ATH down {athDrop}%, wake up, he doesn't love you.",
      "Up {change}%? This is 'boiling frog' upgraded - give you sweets first, lower your guard. ATH down {athDrop}%, water's boiling, still enjoying the hot spring?",
      "🤖 'Bull trap signal' detected! Up {change}%, but ATH down {athDrop}%. Like when your ex says 'I've changed' - believe him and you lose.",
      "🏛️ +{change}%! Token model: classic 'fertilizing before harvest'. More fertilizer = fatter leeks = better harvest. ATH down {athDrop}%, you're the fattest leek.",
      "🪷 This {change}% pump is 'dying glow', 'sunset glory'. Sunsets are beautiful, but what about after dark? ATH down {athDrop}%, it's getting dark.",
    ]
  },
  // 🟢 小涨版（涨 5%-15% 正常币）
  smallPump: {
    cn: [
      // 2.0 素质放下版
      "🤖 善哉！监测到该币种出现了「医学奇迹」——手指头动了一下（+{change}%）。别激动，这通常不叫苏醒，叫「尸僵反应」。庄家只是想把镰刀举高一点。",
      "涨了{change}%？代币模型：空气中掺杂了少量兴奋剂。门缝还留了一丝，你猜是给你逃跑用的，还是为了夹你的头？🔮 今日宜：见好就收 | 忌：格局打开",
      "🪷 这{change}%是「心魔」，是给你的一碗「断头饭」。吃饱了就该上路了。贪念一起，万劫不复。趁庄家没醒，拿着这点涨幅赶紧滚！",
      // 1.0 经典版
      "善哉善哉！这小币种今日小涨{change}%，像个刚学会走路的娃娃，终于迈出第一步了。庄家轻轻推了一把，它就摇摇晃晃地站起来了，可喜可贺～",
      "阿弥陀佛！涨了{change}%，简直是佛祖今天心情好，随手撒了点功德雨。但佛祖提醒：小鸟飞太高容易被风吹秃毛。",
      "善哉！涨了{change}%，技术面出现罕见的'小阳线'，基本面出现罕见的'有点氧气'。恭喜施主抽到一只'还在喘气的空气币'。",
      // 3.0 新增扩充版
      "涨了{change}%！佛祖说：这是「小确幸」，不是「大机会」。见好就收，别把小确幸变成大确丧。",
      "🤖 +{change}%的涨幅！贫僧观此币，有点东西但不多。建议：吃完这口饭就走，别等上甜点。",
      "🏛️ 涨了{change}%，项目还算正经。但正经项目也会跌，只是跌得比较体面。建议设好止盈，别贪。",
      "🪷 善哉！{change}%的涨幅，佛祖点头了。但他老人家也说了：涨了别贪，跌了别慌。你能做到吗？",
      "涨了{change}%？恭喜！但佛祖提醒：这可能是「诱多」，也可能是「真涨」。问题是——你分得清吗？",
      "🤖 监测到正向波动（+{change}%）。项目基本面尚可，但你的操作水平...贫僧不敢恭维。建议：让利润奔跑，但别跑太远。",
    ],
    en: [
      "🤖 Blessed! Detected a 'medical miracle' - finger twitched (+{change}%). Don't get excited, this is 'corpse spasm'. Market maker just raised the scythe higher.",
      "Up {change}%? Token model: air with stimulant. Door cracked open - is it for you to escape, or to crush your head? 🔮 Today: take profits | Avoid: diamond hands",
      "🪷 This {change}% is your 'last meal'. Eat up, then hit the road. Greed leads to damnation. Take this pump and RUN!",
      "Blessed be! Up {change}% today, like a baby learning to walk. The market maker gave it a little push, and it wobbled up. How touching~",
      // 3.0 新增扩充版
      "Up {change}%! Buddha says: this is 'small happiness', not 'big opportunity'. Take it and leave, don't turn joy into sorrow.",
      "🤖 +{change}% pump! This coin has something, but not much. Suggestion: finish this meal and leave, don't wait for dessert.",
      "🏛️ Up {change}%, project seems legit. But legit projects dump too, just more gracefully. Set your take-profit, don't be greedy.",
      "🪷 Blessed! {change}% gain, Buddha nods. But he also said: don't be greedy when up, don't panic when down. Can you do it?",
      "Up {change}%? Congrats! But Buddha reminds: could be 'bull trap', could be 'real pump'. Question is - can you tell the difference?",
      "🤖 Positive movement detected (+{change}%). Fundamentals are okay, but your trading skills... Buddha has concerns. Let profits run, but not too far.",
    ]
  },
  // 🚀 狗屎运爆发版（暴涨 >15% 垃圾币）- 疯狂嘲讽
  shitcoinBigPump: {
    cn: [
      // 2.0 素质放下版
      "🤖 阿弥陀佛！系统报错了吗？居然让你这种韭菜撞上了「庄家喝高了乱拉盘」的小概率事件（+{change}%）。看着这根大阳线，你现在是不是心跳加速、觉得自己是巴菲特转世？醒醒，那是你的「幸存者偏差」。ATH还跌着{athDrop}%呢！",
      "🏛️ 暴涨{change}%！代币模型：经典的「击鼓传花」游戏，目前鼓声震天响。跑路难度：此时不跑，更待何时？难道等花在你手里炸开吗？项目定位：📍迪拜诈骗团伙庆功宴。你现在是桌上的一道菜，但你可以选择跳下桌子。",
      "🪷 财不配位，必有灾殃。老天爷给你这{change}%，是因为接下来要拿走你100%。ATH跌了{athDrop}%你忘了？「落袋为安」，方能保住这点可怜的功德。🔮 今日宜：提现删App | 忌：格局打开",
      // 1.0 经典版
      "佛祖显灵！暴涨{change}%！但ATH跌了{athDrop}%你知道吗？这根绿柱子不过是给你立的墓碑罢了。庄家把镰刀举高了，是为了砍得更深。别贪了！这已经是你这辈子运气的巅峰了！",
      "阿弥陀佛！{change}%的涨幅！但历史高点跌了{athDrop}%。项目方正在游艇上开香槟，你是业绩，不是股东。",
      "暴涨{change}%！但距ATH还跌{athDrop}%呢。经典的「杀猪盘」诱饵结构，目前的上涨只是为了让猪肉更紧实一点。趁现在门缝开了一点点，赶紧挤出去。",
      // 3.0 新增扩充版
      "🤖 暴涨{change}%！贫僧掐指一算：这是「最后的晚餐」。庄家请你吃饱，是为了让你死得瞑目。ATH跌了{athDrop}%，你是主菜，不是客人。",
      "🏛️ +{change}%！项目方群里在发「恭喜发财」红包。但你要知道，这红包是用你的本金包的。ATH跌了{athDrop}%，清醒点。",
      "🪷 暴涨{change}%！佛祖说：「天上掉馅饼，地上有陷阱。」ATH跌了{athDrop}%，这馅饼是用你的血肉做的。",
      "涨了{change}%？庄家在群里喊「钻石手」，自己却在偷偷出货。ATH跌了{athDrop}%，你是钻石，他是钻石商。",
      "🤖 监测到「韭菜收割前的施肥」信号！+{change}%的涨幅，ATH跌了{athDrop}%。肥料撒完了，镰刀也磨好了。",
      "🏛️ 暴涨{change}%！这叫「回光返照」，不叫「起死回生」。ATH跌了{athDrop}%，ICU里偶尔也会有奇迹，但大概率是拔管前的最后一搏。",
    ],
    en: [
      "🤖 Amitabha! System error? A noob like you hit the 'drunk market maker random pump' event (+{change}%)? Seeing this green candle, feeling like Buffett reborn? Wake up, that's 'survivorship bias'. Still down {athDrop}% from ATH btw!",
      "🏛️ Up {change}%! Token model: classic 'hot potato' game, drums beating loud. Exit difficulty: if not now, when? Wait for it to explode in your hands? Project: 📍Dubai scam gang celebration. You're a dish on the table, but you can jump off.",
      "🪷 Wealth beyond your worth brings disaster. God gave you this {change}% because he's taking 100% next. ATH down {athDrop}%. 'Secure the bag' to save your pathetic merit. 🔮 Today: withdraw & delete app | Avoid: diamond hands",
      "Buddha's blessing! Up {change}%! But down {athDrop}% from ATH. This green candle is just your tombstone. Market maker raised the scythe to cut deeper.",
      // 3.0 新增扩充版
      "🤖 Up {change}%! Buddha calculated: this is 'The Last Supper'. Market maker feeds you well so you die satisfied. ATH down {athDrop}%, you're the main course, not a guest.",
      "🏛️ +{change}%! Team is sending 'congrats' red packets in the group. But that red packet is wrapped with YOUR money. ATH down {athDrop}%, wake up.",
      "🪷 Up {change}%! Buddha says: 'Pie from the sky, trap on the ground.' ATH down {athDrop}%, this pie is made of your flesh and blood.",
      "Up {change}%? Market maker shouting 'diamond hands' in the group while secretly dumping. ATH down {athDrop}%, you're the diamond, he's the diamond dealer.",
      "🤖 'Pre-harvest fertilizing' signal detected! +{change}% pump, ATH down {athDrop}%. Fertilizer spread, scythe sharpened.",
      "🏛️ Up {change}%! This is 'dying glow', not 'resurrection'. ATH down {athDrop}%, ICU sometimes has miracles, but usually it's the last struggle before pulling the plug.",
    ]
  },
  // 🚀 暴涨版（>15% 正常币）
  bigPump: {
    cn: [
      // 2.0 素质放下版
      "🤖 阿弥陀佛！系统报错了吗？居然让你撞上了「庄家喝高了乱拉盘」的小概率事件（+{change}%）。看着这根大阳线，你是不是觉得自己是巴菲特转世？醒醒，那是「幸存者偏差」。",
      "🏛️ 暴涨{change}%！代币模型：经典的「击鼓传花」，目前鼓声震天响。此时不跑，更待何时？难道等花在你手里炸开吗？项目定位：📍庆功宴。你是桌上的一道菜，但你可以选择跳下桌子。",
      "🪷 财不配位，必有灾殃。老天爷给你这{change}%，是因为接下来要拿走你100%。「落袋为安」，方能保住这点可怜的功德。🔮 今日宜：提现删App | 忌：格局打开",
      // 1.0 经典版
      "佛祖显灵！暴涨{change}%！简直是佛祖今天心情大好，随手赏了它一口仙气。但记住：涨得快是佛祖在提醒你——该跑了。",
      "阿弥陀佛！{change}%的涨幅！恭喜施主解锁成就「纸面富贵」。但佛祖提醒：没卖之前都是镜花水月，及时止盈才是正道。",
      "暴涨{change}%！别贪了！这已经是你这辈子运气的巅峰了！建议立即截图发朋友圈炫耀，5分钟后可能就没了。就算是坏掉的钟，一天也能准两次。恭喜你撞上了。",
      // 3.0 新增扩充版
      "🤖 暴涨{change}%！佛祖说：「会买的是徒弟，会卖的是师父。」你现在是徒弟还是师父，就看你接下来的操作了。",
      "🏛️ +{change}%的涨幅！项目基本面还行，但涨太快容易闪了腰。建议：分批止盈，别一把梭哈。",
      "🪷 暴涨{change}%！佛祖提醒：「涨得越高，摔得越惨。」不是说一定会摔，但你得做好准备。",
      "涨了{change}%？恭喜！但佛祖说：「牛市多暴跌」。这涨幅很香，但别忘了设止损。",
      "🤖 监测到强势上涨（+{change}%）！贫僧建议：至少卖掉一半，让利润奔跑的同时也要落袋为安。",
      "🏛️ 暴涨{change}%！这是「天时地利人和」还是「庄家拉盘出货」？佛祖也看不清，但他建议你：见好就收。",
    ],
    en: [
      "🤖 Amitabha! System error? You hit the 'drunk market maker pump' event (+{change}%)? Feeling like Buffett reborn? Wake up, that's 'survivorship bias'.",
      "🏛️ Up {change}%! Token model: classic 'hot potato', drums beating loud. If not now, when? Wait for it to explode in your hands? You're a dish on the table, but you can jump off.",
      "🪷 Wealth beyond worth brings disaster. God gave you this {change}% to take 100% next. 'Secure the bag'. 🔮 Today: withdraw & delete app | Avoid: diamond hands",
      "Buddha's blessing! Up {change}%! Buddha is in an amazing mood today. But remember: pumping fast means Buddha is reminding you - time to RUN.",
      "Amitabha! {change}% pump! Congrats on unlocking 'Paper Wealth' achievement. But Buddha says: unrealized gains are just illusions. Take profits.",
      // 3.0 新增扩充版
      "🤖 Up {change}%! Buddha says: 'Buying is apprentice level, selling is master level.' Are you apprentice or master? Your next move decides.",
      "🏛️ +{change}% pump! Fundamentals are okay, but pumping too fast can hurt your back. Suggestion: take profits in batches, don't go all-in.",
      "🪷 Up {change}%! Buddha reminds: 'The higher you climb, the harder you fall.' Not saying you will fall, but be prepared.",
      "Up {change}%? Congrats! But Buddha says: 'Bull markets have flash crashes.' This pump is sweet, but don't forget to set stop-loss.",
      "🤖 Strong uptrend detected (+{change}%)! Buddha suggests: sell at least half, let profits run while securing some gains.",
      "🏛️ Up {change}%! Is this 'perfect timing' or 'market maker dumping'? Even Buddha can't tell, but he suggests: take what you can get.",
    ]
  },
  // 🦀 坟头长草版（横盘 ±5%）- 电子僵尸
  sideways: {
    cn: [
      // 2.0 素质放下版
      "🤖 善哉。这走势比我奶奶的心电图都平。庄家是去度假了，还是已经进局子了？这种「电子僵尸」状态，既不让你死心，也不让你开心，纯纯是在消耗你的「阳寿」。",
      "🏛️ 横盘中...代币模型：纯度极高的「时间熔炉」。投入的是钱，烧掉的是青春。跑路难度：没人跑路，因为没人记得这个项目了。项目定位：📍赛博乱葬岗。这里很安静，适合出家。",
      "🪷 不动不摇，是为坐禅。施主拿着这个币，也是一种「修行」。只要你不卖，就不算亏——当然，也不算钱。🔮 今日宜：敲木鱼 | 忌：盯着K线看",
      // 1.0 经典版
      "这走势比木乃伊的心电图都平。庄家是死了还是把你忘了？佛祖说：横盘是修行，但修太久会成仙（归零）。",
      "波动率接近0。这币和你的感情生活一样，死水一潭。死水里偶尔也会冒泡，但大概率是沼气。戳一下庄家，看他死了没？",
      "K线扫描完成：比心电图还平。建议持有者去医院查查自己。佛祖说：平静是福，但太平静就是临终关怀了。",
      "横盘检测：建议改名「稳定币」。至少听起来体面点。佛祖说：稳定是好事，但稳定在谷底就是另一回事了。",
      // 3.0 新增扩充版
      "🤖 监测到「植物人」状态。这币既不涨也不跌，像极了你的人生——毫无波澜，一眼望到头。",
      "🏛️ 横盘中...项目方可能在：A.跑路途中 B.蹲局子 C.换了个马甲重新割韭菜。你猜是哪个？",
      "🪷 佛祖说：「横盘是最高级的折磨。」它不让你死心，也不给你希望。这是一种精神PUA。",
      "这走势像极了我前任——不主动、不拒绝、不负责。你问它涨不涨？它说「再看看」。",
      "🤖 波动率检测：0.01%。这币比你的社交生活还死寂。建议：要么割肉，要么忘了它。",
      "🏛️ 横盘第N天...项目方TG群最后一条消息是三个月前的「soon」。很快，很快就归零了。",
    ],
    en: [
      "🤖 Blessed. This chart is flatter than grandma's EKG. Is the market maker on vacation or in prison? This 'digital zombie' state - won't let you give up, won't let you be happy. Pure lifespan drain.",
      "🏛️ Sideways... Token model: pure 'time furnace'. Input: money. Output: wasted youth. Exit difficulty: nobody's running because nobody remembers this project. Location: 📍Cyber mass grave. Quiet here, good for becoming a monk.",
      "🪷 Stillness is meditation. Holding this coin is also 'practice'. As long as you don't sell, you haven't lost - of course, it's not money either. 🔮 Today: tap wood fish | Avoid: staring at charts",
      "This chart is flatter than a mummy's heartbeat. Is the market maker dead or did they forget you? Buddha says: sideways is practice, but too long and you'll ascend (to zero).",
      // 3.0 新增扩充版
      "🤖 'Vegetative state' detected. This coin neither pumps nor dumps, just like your life - no waves, no hope.",
      "🏛️ Sideways... Team is probably: A. Running away B. In jail C. Rebranded to rug again. Which one?",
      "🪷 Buddha says: 'Sideways is the ultimate torture.' No despair, no hope. This is spiritual PUA.",
      "This chart is like my ex - won't commit, won't leave, won't take responsibility. Ask if it'll pump? 'We'll see.'",
      "🤖 Volatility: 0.01%. This coin is deader than your social life. Suggestion: cut losses or forget it exists.",
      "🏛️ Day N of sideways... Last message in project TG was 'soon' three months ago. Soon to zero, that is.",
    ]
  },
  // 📉 小跌版（-5% to -15%）
  smallDump: {
    cn: [
      // 混合版
      "跌了{change}%，佛祖说：小跌是考验，大跌是劫难。施主莫慌，这只是佛祖在测试你的信仰。但如果明天还跌……那就是真的劫难了。ATH已经跌了{athDrop}%，你还在等什么？",
      "红色K线！跌了{change}%。佛祖说：别人恐惧我贪婪？先等等，看看是不是真的恐惧还是理性逃跑。ATH跌了{athDrop}%，这恐惧看起来挺理性的。",
      "小跌{change}%，庄家今天心情不太好。佛祖提醒：小跌不可怕，可怕的是小跌后面跟着大跌。ATH跌了{athDrop}%，阿弥陀佛，保重。",
      // 3.0 扩充版
      "🤖 跌了{change}%，贫僧观此币，正在进行「战略性回调」。翻译：庄家在出货。ATH跌了{athDrop}%，你是接盘侠，不是抄底王。",
      "🏛️ -{change}%！项目方说「这是健康回调」。佛祖说：「健康个屁，这是慢性死亡。」ATH跌了{athDrop}%，别被PUA了。",
      "🪷 小跌{change}%，佛祖说：「温水煮青蛙，青蛙不知死。」你就是那只青蛙，水温正在上升。ATH跌了{athDrop}%。",
      "跌了{change}%？群里有人喊「加仓抄底」。佛祖说：「他加的是空气，你加的是真金白银。」ATH跌了{athDrop}%，清醒点。",
      "🤖 监测到「阴跌」信号！-{change}%看起来不多，但ATH已经跌了{athDrop}%。这叫「钝刀子割肉」，疼但不致命，直到你发现肉没了。",
      "🏛️ 跌了{change}%，KOL说「逢低买入」。佛祖说：「他逢低卖出，你逢低买入。」ATH跌了{athDrop}%，谁是韭菜一目了然。",
      "🪷 -{change}%的跌幅，佛祖说：「这是给你的警告，不是给你的机会。」ATH跌了{athDrop}%，再不跑就来不及了。",
      "小跌{change}%？佛祖说：「小跌是大跌的预告片。」ATH跌了{athDrop}%，预告片都这么惨，正片你敢看吗？",
    ],
    en: [
      "Down {change}%. Buddha says: small dips are tests, big dumps are disasters. Don't panic, Buddha is testing your faith. But if it dumps tomorrow... that's real disaster. ATH down {athDrop}%.",
      "Red candle! Down {change}%. Buddha says: be greedy when others are fearful? Wait - is this real fear or rational fleeing? ATH down {athDrop}%, this fear looks pretty rational.",
      // 3.0 扩充版
      "🤖 Down {change}%, Buddha sees a 'strategic pullback'. Translation: market maker is dumping. ATH down {athDrop}%, you're the bag holder, not the bottom fisher.",
      "🏛️ -{change}%! Team says 'healthy correction'. Buddha says: 'Healthy my ass, this is slow death.' ATH down {athDrop}%, don't get PUA'd.",
      "🪷 Down {change}%, Buddha says: 'Boiling frog doesn't know it's dying.' You're the frog, water's heating up. ATH down {athDrop}%.",
      "Down {change}%? Someone in the group shouting 'buy the dip'. Buddha says: 'He's buying air, you're buying with real money.' ATH down {athDrop}%, wake up.",
      "🤖 'Slow bleed' signal detected! -{change}% looks small, but ATH down {athDrop}%. This is 'death by a thousand cuts' - doesn't kill you until you're out of flesh.",
      "🏛️ Down {change}%, KOL says 'buy low'. Buddha says: 'He sells low, you buy low.' ATH down {athDrop}%, who's the leek is obvious.",
      "🪷 -{change}% dip, Buddha says: 'This is a warning, not an opportunity.' ATH down {athDrop}%, run before it's too late.",
      "Small dip {change}%? Buddha says: 'Small dips are trailers for big dumps.' ATH down {athDrop}%, trailer's this bad, dare to watch the movie?",
    ]
  },
  // 📉 功德圆满版（暴跌/归零）- 反向夸奖
  bigDump: {
    cn: [
      // 2.0 素质放下版
      "🤖 恭喜施主！贺喜施主！监测到您的资产正在进行「物理因果律消除」（-{change}%）。这一根大红柱子插下来，直接帮您消除了半辈子的业障。钱没了可以再赚，脑子没了就真没办法了。ATH跌了{athDrop}%！",
      "🪷 我不入地狱，谁入地狱？施主以一人之肉，喂饱了庄家全家。大慈大悲，功德无量！ATH跌了{athDrop}%，施主已立地成佛！🔮 今日宜：吃斋念佛 | 忌：上天台",
      // 1.0 经典版
      "暴跌{change}%！ATH跌了{athDrop}%！佛祖说：跌了90%还有90%可以跌，下跌空间充足。没事，换个币接着亏...划掉...接着抽！建议留着当传家宝，传给孙子维权。",
      "阿弥陀佛！暴跌{change}%！ATH跌了{athDrop}%。佛祖说：把App颜色反转一下，这样看起来像在涨。心理安慰也是一种修行。",
      "善哉！跌了{change}%，距ATH跌了{athDrop}%。佛祖说：「价值投资」模式已激活。翻译：套牢了不想割。施主，放下执念吧。",
      "暴跌{change}%！历史高点跌了{athDrop}%。佛祖说：抄底成功！恭喜你精准抄在了半山腰。山脚还远着呢，继续加油。",
      // 3.0 扩充版
      "🤖 暴跌{change}%！贫僧观此币，已入「涅槃」状态。ATH跌了{athDrop}%，建议：点一炷香，送它最后一程。",
      "🏛️ -{change}%！项目方推特已删，TG群已解散，官网显示404。ATH跌了{athDrop}%，这不是跌，这是「物理消失」。",
      "🪷 暴跌{change}%！佛祖说：「钱是身外之物，失去了反而轻松。」ATH跌了{athDrop}%，恭喜你获得了「财务自由」——没钱可亏了。",
      "跌了{change}%？项目方说「我们还在」。翻译：「我们还没跑完」。ATH跌了{athDrop}%，等他们跑完就彻底归零了。",
      "🤖 监测到「自由落体」信号（-{change}%）！ATH跌了{athDrop}%，这不是下跌，这是「跳楼大甩卖」——卖的是你。",
      "🏛️ 暴跌{change}%！佛祖说：「放下执念，方得解脱。」这币已经帮你放下了，你解脱了吗？ATH跌了{athDrop}%。",
      "🪷 -{change}%！恭喜施主解锁成就「归零先锋」！ATH跌了{athDrop}%，你的投资已经完成了它的历史使命——归零。",
      "暴跌{change}%！佛祖说：「这币和你的缘分尽了。」ATH跌了{athDrop}%，缘起缘灭，一切随缘。阿弥陀佛。",
    ],
    en: [
      "🤖 Congrats! Detected your assets undergoing 'physical causality elimination' (-{change}%). This red candle just cleared half your life's karma. Money can be re-earned, brains can't. ATH down {athDrop}%!",
      "🪷 If not me, who enters hell? You fed the market maker's whole family with your flesh. Great mercy, infinite merit! ATH down {athDrop}%, you've achieved Buddhahood! 🔮 Today: pray | Avoid: rooftops",
      "Down {change}%! ATH down {athDrop}%! Buddha says: down 90% still has 90% to go. It's ok, try another coin to lose... I mean... to draw!",
      "Amitabha! Down {change}%! ATH down {athDrop}%. Buddha says: invert your app colors, it'll look like it's pumping. Mental comfort is also a form of practice.",
      // 3.0 扩充版
      "🤖 Down {change}%! This coin has entered 'Nirvana'. ATH down {athDrop}%, suggestion: light some incense, send it off properly.",
      "🏛️ -{change}%! Team Twitter deleted, TG disbanded, website 404. ATH down {athDrop}%, this isn't dumping, this is 'physical disappearance'.",
      "🪷 Down {change}%! Buddha says: 'Money is external, losing it sets you free.' ATH down {athDrop}%, congrats on 'financial freedom' - nothing left to lose.",
      "Down {change}%? Team says 'we're still here'. Translation: 'we haven't finished running yet.' ATH down {athDrop}%, when they're done running, it's zero.",
      "🤖 'Free fall' signal detected (-{change}%)! ATH down {athDrop}%, this isn't dumping, this is 'clearance sale' - and you're the product.",
      "🏛️ Down {change}%! Buddha says: 'Let go of attachment, find liberation.' This coin let go for you. Are you liberated? ATH down {athDrop}%.",
      "🪷 -{change}%! Congrats on unlocking 'Zero Pioneer' achievement! ATH down {athDrop}%, your investment has completed its mission - going to zero.",
      "Down {change}%! Buddha says: 'Your fate with this coin has ended.' ATH down {athDrop}%, karma comes and goes. Amitabha.",
    ]
  },
  // 低排名补刀
  lowRankRoast: {
    cn: [
      "排名#{rank}...群主正在闲鱼卖二手电瓶车筹集拉盘资金。",
      "排名#{rank}，CoinGecko都准备把它删了。连山寨中的山寨都看不起这排名。",
      // 3.0 扩充版
      "排名#{rank}...项目方正在研究如何把「跑路」包装成「战略转型」。",
      "排名#{rank}，市值约等于项目方上个月的外卖开销。",
      "排名#{rank}...连CoinGecko的实习生都懒得更新这个币的信息了。",
      "排名#{rank}...这排名比你的信用评分还低。",
      "排名#{rank}，流动性约等于你奶奶的养老金。卖出请三思，可能砸穿地板。",
      "排名#{rank}...项目方TG群人数比排名还少。",
      "排名#{rank}，佛祖说：「这排名，连我都救不了。」",
      "排名#{rank}...搜索这个币需要翻到CoinGecko第99页。",
      "排名#{rank}，项目方正在考虑改名换姓重新发币。",
      "排名#{rank}...持有这个币的人比项目方的亲戚还少。",
    ],
    en: [
      "Rank #{rank}... dev is selling used scooters on eBay to fund the next pump.",
      "Rank #{rank}, CoinGecko about to delete it. Even shitcoins look down on this.",
      // 3.0 扩充版
      "Rank #{rank}... team is researching how to rebrand 'rug pull' as 'strategic pivot'.",
      "Rank #{rank}, market cap equals team's last month's food delivery expenses.",
      "Rank #{rank}... even CoinGecko interns are too lazy to update this coin's info.",
      "Rank #{rank}... this rank is lower than your credit score.",
      "Rank #{rank}, liquidity equals your grandma's pension. Selling might crash through the floor.",
      "Rank #{rank}... project TG group has fewer members than the rank number.",
      "Rank #{rank}, Buddha says: 'This rank, even I can't save.'",
      "Rank #{rank}... finding this coin requires scrolling to page 99 on CoinGecko.",
      "Rank #{rank}, team is considering rebranding and launching a new token.",
      "Rank #{rank}... fewer people hold this coin than the team's relatives.",
    ]
  }
}

// 基于真实数据生成毒舌辣评 - 佛系阴阳怪气风格
function generateRoast(coin: CoinData, _level: FortuneLevel, isEN: boolean): string {
  const change = coin.price_change_percentage_24h || 0
  const mcap = coin.market_cap || 0
  const rank = coin.market_cap_rank || 9999
  const athDrop = coin.ath_change_percentage || 0  // 负数，如 -95.5
  const ath = coin.ath || 0
  
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
  
  // 随机选一条并替换变量（包括ATH数据）
  roast = pool[Math.floor(Math.random() * pool.length)]
  roast = roast.replace(/{change}/g, Math.abs(change).toFixed(1))
  roast = roast.replace(/{rank}/g, rank.toString())
  roast = roast.replace(/{athDrop}/g, Math.abs(athDrop).toFixed(1))
  roast = roast.replace(/{ath}/g, ath > 1 ? ath.toFixed(2) : ath.toFixed(6))
  
  // 低排名补刀：垃圾币且在涨（概率30%）
  if (isShitcoin && change > 0 && Math.random() < 0.3) {
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

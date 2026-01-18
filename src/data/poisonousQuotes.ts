// 佛祖毒舌判词 - 用于结果页顶部 & 截图传播
// GPT 版本：币圈人看了会流泪的毒舌签文
export const BUDDHA_QUOTES_CN = [
  // 上签 · 虚假繁荣
  "今日诸事顺利，唯一不顺的是你买的那几个。市场没骗你，是你选择性失明。",
  // 中签 · 重复犯错
  "你不是没见过这种走势，你只是每次都觉得「这次不一样」。",
  // 下签 · 情绪上头
  "今日不宜交易，因为你并不是真的看懂了，你只是想把亏损赢回来。",
  // 上签 · 错觉之喜
  "币价上涨与你无关，只是庄家今天心情不错。别急着截图，回调还在路上。",
  // 中下签 · 社群幻觉
  "项目群很热闹，说明大家都没跑掉。至于为什么没跑，你心里有数。",
  // 下签 · 认知税
  "你今天学到的不是新知识，而是又交了一次学费。恭喜，你离「老韭菜」更近了一步。",
  // 中签 · 信仰测试
  "当你开始用「长期价值」安慰自己的时候，说明你已经被短期走势打服了。",
  // 上签 · 幸存者偏差
  "你看到的都是暴富故事，看不到的是已经删推的人。",
  // 下下签 · 心魔
  "你不是输在判断，是输在「我再加一把」。",
  // 特别签 · 因果循环
  "你今天抽到这签，并不是因为算法。而是因为你确实该停一停了。",
  // 原有签文
  "你不是没信仰，你是没止损。",
  "技术无罪，故事有毒。",
  "此项目专治不服现实。",
  "看似创新，实则轮回。",
  "佛不度梭哈之人。",
  "你敲的是木鱼，不是 Alpha。",
  "故事讲完了，你还没走。",
  "白皮书很厚，用户很薄。",
  "此乃信仰测试项目。",
  "你抽到的不是机会，是教训。",
  "叙事新，钱包旧。",
  "庄家未明，信徒已满。",
  "代码写得不错，可惜没人用。",
  "这是给市场交学费用的。",
  "佛祖看了都选择观望。",
  "再看一眼，你就信了。",
  "项目还在，你已轮回。",
  "理性告诉你别碰，手已经点了。",
  "这是情绪价值，不是价值投资。",
  "你以为是早期，其实是第七波。",
  "全是情绪没有价值。",
  "别人恐惧我贪婪，别人贪婪我破产。",
  "格局打开，钱包打空。",
  "我不是在抄底，我是在垫底。",
]

export const BUDDHA_QUOTES_EN = [
  // GPT's killer quotes
  "Today everything's fine, except the coins you bought. Market didn't lie, you chose to be blind.",
  "You've seen this chart before. You just thought 'this time is different'.",
  "Don't trade today. You don't understand it, you just want to win back your losses.",
  "Price pumped? Not for you. Whale's just in a good mood. Don't screenshot yet, pullback incoming.",
  "Group chat's active? Means nobody escaped yet. You know why they're still there.",
  "Today you didn't learn anything new. You just paid another tuition fee. Congrats, you're closer to being an 'OG leek'.",
  "When you start saying 'long-term value', it means short-term already broke you.",
  "You only see the 10x stories. You don't see the deleted tweets.",
  "You didn't lose on judgment. You lost on 'just one more'.",
  "You drew this fortune not by algorithm. But because you really need to stop.",
  // Original quotes
  "You don't lack faith, you lack a stop-loss.",
  "Tech is innocent, narratives are toxic.",
  "This project cures reality denial.",
  "Looks innovative, actually reincarnation.",
  "Buddha doesn't save all-in degens.",
  "You're tapping a fish, not finding Alpha.",
  "Story's over, you're still here.",
  "Whitepaper thick, users thin.",
  "This is a faith stress-test.",
  "You didn't draw opportunity, you drew a lesson.",
  "New narrative, old bags.",
  "Whales unknown, believers full.",
  "Code's decent, shame no one uses it.",
  "This is tuition for the market.",
  "Even Buddha chose to watch from sidelines.",
  "One more look and you'll believe.",
  "Project lives, you've reincarnated.",
  "Brain says no, finger already clicked.",
  "This is emotional value, not value investing.",
  "You think you're early, you're wave seven.",
  "All emotion, no value.",
  "Be greedy when others fear, go broke when others greed.",
  "Open your mind, empty your wallet.",
  "I'm not buying the dip, I AM the dip.",
]

// 迷途羔羊类型
export const LOST_SOUL_TYPES = {
  gambler: {
    cn: '赌徒',
    en: 'Gambler',
    desc_cn: '你不是在投资，你是在买彩票',
    desc_en: 'You\'re not investing, you\'re buying lottery tickets',
  },
  builder: {
    cn: 'Builder',
    en: 'Builder',
    desc_cn: '你相信技术，但技术不一定相信市场',
    desc_en: 'You believe in tech, but tech doesn\'t believe in markets',
  },
  spectator: {
    cn: '吃瓜群众',
    en: 'Spectator',
    desc_cn: '看热闹不嫌事大，但别不小心成了热闹',
    desc_en: 'Watching the drama, careful not to become the drama',
  },
  runner: {
    cn: '快跑型',
    en: 'Runner',
    desc_cn: '你的直觉是对的，听它的',
    desc_en: 'Your instinct is right, listen to it',
  },
}

// 庞氏指数区间对应的毒舌文案
export const PONZI_LEVELS = {
  healthy: {
    range: [0, 30],
    cn: '结构相对健康',
    en: 'Relatively Healthy',
    desc_cn: '主要靠产品活着，信仰只是加分项。',
    desc_en: 'Lives on product, faith is just a bonus.',
    color: 'text-green-400',
    emoji: '🟢',
  },
  narrative: {
    range: [31, 60],
    cn: '叙事驱动型',
    en: 'Narrative-Driven',
    desc_cn: '项目能跑，但需要不断讲新故事。',
    desc_en: 'Project runs, but needs constant new stories.',
    color: 'text-yellow-400',
    emoji: '🟡',
  },
  faith: {
    range: [61, 80],
    cn: '信仰依赖型',
    en: 'Faith-Dependent',
    desc_cn: '如果热度消失，问题会很快出现。',
    desc_en: 'If hype dies, problems emerge fast.',
    color: 'text-orange-400',
    emoji: '🟠',
  },
  ponzi: {
    range: [81, 100],
    cn: '后来者供养型',
    en: 'Late-Comer Funded',
    desc_cn: '这个结构非常需要新朋友。',
    desc_en: 'This structure really needs new friends.',
    color: 'text-red-400',
    emoji: '🔴',
  },
}

export const getRandomQuote = (isEN: boolean) => {
  const quotes = isEN ? BUDDHA_QUOTES_EN : BUDDHA_QUOTES_CN
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export const getRandomSoulType = () => {
  const types = Object.keys(LOST_SOUL_TYPES) as (keyof typeof LOST_SOUL_TYPES)[]
  return types[Math.floor(Math.random() * types.length)]
}

export const getPonziLevel = (score: number) => {
  if (score <= 30) return PONZI_LEVELS.healthy
  if (score <= 60) return PONZI_LEVELS.narrative
  if (score <= 80) return PONZI_LEVELS.faith
  return PONZI_LEVELS.ponzi
}

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

// 🏛️ 庞氏结构分析文案库 - 更丰富的毒舌解读
export const PONZI_ANALYSIS = {
  // 代币模型分析
  tokenModel: {
    high: {
      cn: [
        "代币模型：纯度极高的空气币。从空气中来，回空气中去。",
        "代币模型：经典的「击鼓传花」结构，目前鼓声震天响。",
        "代币模型：空气中掺杂了少量兴奋剂，让你产生「这次不一样」的幻觉。",
        "代币模型：100%情绪价值，0%实际价值。但情绪价值也是价值嘛...吗？",
        "代币模型：白皮书写了50页，核心逻辑一句话——「你买我就涨」。",
        "代币模型：环保降解型代币，半衰期约3个月。",
        "代币模型：经典的「庞氏套娃」结构，一层套一层，层层都是坑。",
        "代币模型：项目方持币90%，你持有的是「流动性出口」。",
      ],
      en: [
        "Token model: Pure air coin. From air it came, to air it returns.",
        "Token model: Classic 'hot potato' structure, drums beating loud.",
        "Token model: Air with stimulants, making you think 'this time is different'.",
        "Token model: 100% emotional value, 0% real value. But emotional value counts... right?",
        "Token model: 50-page whitepaper, one core logic - 'you buy, I pump'.",
        "Token model: Eco-degradable token, half-life about 3 months.",
        "Token model: Classic 'Ponzi nesting doll', layer after layer of traps.",
        "Token model: Team holds 90%, you hold the 'liquidity exit'.",
      ]
    },
    medium: {
      cn: [
        "代币模型：有点东西，但不多。主要靠信仰充值。",
        "代币模型：叙事驱动型，故事讲完就得换新的。",
        "代币模型：半空气半实体，像薛定谔的猫，不打开钱包不知道死活。",
        "代币模型：有产品有用户，但用户主要是来挖矿的。",
        "代币模型：技术不错，可惜没人用。代币价值全靠「未来可期」。",
        "代币模型：介于「正经项目」和「高级骗局」之间的灰色地带。",
      ],
      en: [
        "Token model: Has something, but not much. Mainly faith-powered.",
        "Token model: Narrative-driven, needs new stories constantly.",
        "Token model: Half air half substance, like Schrödinger's cat.",
        "Token model: Has product and users, but users are mainly farming.",
        "Token model: Good tech, shame no one uses it. Value based on 'future potential'.",
        "Token model: Gray area between 'legit project' and 'sophisticated scam'.",
      ]
    },
    low: {
      cn: [
        "代币模型：居然有点靠谱？贫僧揉揉眼睛再看一遍。",
        "代币模型：有实际收入支撑，在币圈算是稀有物种了。",
        "代币模型：结构相对健康，但别忘了这是币圈，健康是相对的。",
        "代币模型：难得一见的正经项目。但你的手可能会毁掉一切。",
      ],
      en: [
        "Token model: Actually decent? Let me rub my eyes and check again.",
        "Token model: Has real revenue, a rare species in crypto.",
        "Token model: Relatively healthy, but remember this is crypto, 'healthy' is relative.",
        "Token model: Rare legit project. But your hands might ruin everything.",
      ]
    }
  },
  // 跑路难度分析
  exitDifficulty: {
    high: {
      cn: [
        "跑路难度：「关门打狗」的前兆。门缝还留了一丝，你猜是给你逃跑用的，还是为了夹你的头？",
        "跑路难度：池子浅得能看见底，你一卖就砸穿地板。",
        "跑路难度：跑什么？链上池子都干了，这就是「终点」。",
        "跑路难度：理论上可以跑，实际上滑点50%起步。",
        "跑路难度：项目方已经在机场了，你还在研究K线。",
        "跑路难度：门已经焊死了，窗户也钉上了。你现在是「长期投资者」了。",
        "跑路难度：此时不跑，更待何时？难道等花在你手里炸开吗？",
        "跑路难度：DEX流动性约等于你奶奶的养老金，卖出请三思。",
      ],
      en: [
        "Exit difficulty: 'Trap door closing'. Is that crack for you to escape, or to crush your head?",
        "Exit difficulty: Pool so shallow you can see the bottom. One sell and you break the floor.",
        "Exit difficulty: Exit what? Pool's dry, this IS the end.",
        "Exit difficulty: Theoretically possible, practically 50% slippage minimum.",
        "Exit difficulty: Team's at the airport, you're still studying charts.",
        "Exit difficulty: Door welded shut, windows nailed. You're a 'long-term investor' now.",
        "Exit difficulty: If not now, when? Wait for it to explode in your hands?",
        "Exit difficulty: DEX liquidity equals your grandma's pension. Think twice before selling.",
      ]
    },
    medium: {
      cn: [
        "跑路难度：能跑，但得排队。前面还有100个人等着出货。",
        "跑路难度：中等难度，建议分批出货，别一把梭。",
        "跑路难度：流动性还行，但大单会砸出坑。",
        "跑路难度：CEX有深度，DEX是摆设。想跑去中心化交易所。",
        "跑路难度：现在跑还来得及，再等等可能就来不及了。",
        "跑路难度：门开着，但门口有保安。跑的时候别太张扬。",
      ],
      en: [
        "Exit difficulty: Can run, but queue up. 100 people ahead waiting to dump.",
        "Exit difficulty: Medium difficulty, suggest selling in batches.",
        "Exit difficulty: Liquidity okay, but big orders will crater the price.",
        "Exit difficulty: CEX has depth, DEX is decoration. Run to centralized exchange.",
        "Exit difficulty: Can still escape now, wait longer and maybe not.",
        "Exit difficulty: Door's open, but there's security. Don't be too obvious when running.",
      ]
    },
    low: {
      cn: [
        "跑路难度：流动性充足，想跑随时能跑。问题是你舍得跑吗？",
        "跑路难度：大门敞开，但你可能会因为贪心而错过最佳逃跑时机。",
        "跑路难度：低。但贫僧担心的不是你能不能跑，是你愿不愿意跑。",
        "跑路难度：没人拦你，但你的心魔会。",
      ],
      en: [
        "Exit difficulty: Plenty of liquidity, can run anytime. Question is, will you?",
        "Exit difficulty: Door wide open, but greed might make you miss the exit.",
        "Exit difficulty: Low. But I worry not about if you CAN run, but if you WILL.",
        "Exit difficulty: No one's stopping you, but your inner demons will.",
      ]
    }
  },
  // 项目定位分析
  projectPosition: {
    high: {
      cn: [
        "项目定位：📍屠宰场VIP候场区。给猪听音乐，是为了肉质更鲜美。",
        "项目定位：📍迪拜诈骗团伙庆功宴。你是桌上的一道菜。",
        "项目定位：📍缅北电诈园区VIP中转站。风景很好，进来就别想出去了。",
        "项目定位：📍赛博乱葬岗。这里很安静，适合出家。",
        "项目定位：📍由于经费不足，该项目定位已无法显示。",
        "项目定位：📍韭菜收割机4.0版本测试场地。",
        "项目定位：📍Web3版「杀猪盘」实验基地。",
        "项目定位：📍庄家的提款机，散户的碎钞机。",
      ],
      en: [
        "Project location: 📍Slaughterhouse VIP waiting room. Music for pigs makes meat tender.",
        "Project location: 📍Dubai scam gang celebration. You're a dish on the table.",
        "Project location: 📍Myanmar scam compound VIP lounge. Nice view, no exit.",
        "Project location: 📍Cyber mass grave. Quiet here, good for becoming a monk.",
        "Project location: 📍Due to budget cuts, location unavailable.",
        "Project location: 📍Leek harvester 4.0 testing ground.",
        "Project location: 📍Web3 'pig butchering' experiment base.",
        "Project location: 📍Whale's ATM, retail's shredder.",
      ]
    },
    medium: {
      cn: [
        "项目定位：📍币圈「灰色地带」。不算骗局，但也别太认真。",
        "项目定位：📍叙事工厂流水线。故事讲完换下一个。",
        "项目定位：📍信仰充值站。充多少看你的虔诚程度。",
        "项目定位：📍击鼓传花游戏厅。目前鼓声还在响。",
        "项目定位：📍薛定谔的项目。不打开钱包不知道死活。",
        "项目定位：📍「下一个以太坊」候选名单第9527位。",
      ],
      en: [
        "Project location: 📍Crypto 'gray area'. Not a scam, but don't take it too seriously.",
        "Project location: 📍Narrative factory assembly line. Story done, next one please.",
        "Project location: 📍Faith recharge station. Amount depends on your devotion.",
        "Project location: 📍Hot potato arcade. Drums still beating.",
        "Project location: 📍Schrödinger's project. Don't know if dead until you check wallet.",
        "Project location: 📍'Next Ethereum' candidate list #9527.",
      ]
    },
    low: {
      cn: [
        "项目定位：📍难得一见的正经项目。但在币圈，正经也是相对的。",
        "项目定位：📍有实际产品的稀有物种。请珍惜，可能是最后一个了。",
        "项目定位：📍相对靠谱区。但别忘了，这是币圈。",
        "项目定位：📍佛祖点头区。但他老人家也说了，别梭哈。",
      ],
      en: [
        "Project location: 📍Rare legit project. But in crypto, 'legit' is relative.",
        "Project location: 📍Rare species with actual product. Cherish it, might be the last.",
        "Project location: 📍Relatively safe zone. But remember, this is crypto.",
        "Project location: 📍Buddha-approved zone. But he also said, don't go all-in.",
      ]
    }
  }
}

// 随机获取庞氏分析文案
export const getRandomPonziAnalysis = (score: number, isEN: boolean) => {
  const level = score > 70 ? 'high' : score > 40 ? 'medium' : 'low'
  const lang = isEN ? 'en' : 'cn'
  
  const tokenModels = PONZI_ANALYSIS.tokenModel[level][lang]
  const exitDifficulties = PONZI_ANALYSIS.exitDifficulty[level][lang]
  const projectPositions = PONZI_ANALYSIS.projectPosition[level][lang]
  
  return {
    tokenModel: tokenModels[Math.floor(Math.random() * tokenModels.length)],
    exitDifficulty: exitDifficulties[Math.floor(Math.random() * exitDifficulties.length)],
    projectPosition: projectPositions[Math.floor(Math.random() * projectPositions.length)],
  }
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

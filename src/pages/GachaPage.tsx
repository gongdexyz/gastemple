import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, Flame, Trophy, Info } from 'lucide-react'
import { useGachaStore, GachaResult } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'
import { useSoundStore } from '../stores/soundStore'
import { ReceiptModal } from '../components/ReceiptModal'
import { InactivityToast } from '../components/InactivityToast'
import { PaymentConfirmDialog } from '../components/PaymentConfirmDialog'
import { InviteFriendsModal } from '../components/InviteFriendsModal'
import { MusicToggle } from '../components/MusicToggle'
import { getRandomPonziAnalysis } from '../data/poisonousQuotes'

const QUIZ_QUESTIONS_CN = [
  {
    question: '检测到市场剧烈波动。你看中的土狗币正在暴跌 50%。你的操作是？',
    options: [
      { text: 'A. 相信技术指标，这是回调，梭哈！', id: 'A' },
      { text: 'B. 只要我不卖，就不算亏。', id: 'B' },
      { text: 'C. 哪怕归零也要冲，为了信仰！', id: 'C' },
    ],
  },
  {
    question: 'KOL 推荐了一个新项目，你的第一反应是？',
    options: [
      { text: 'A. 研究白皮书和团队背景', id: 'A' },
      { text: 'B. 先冲了再说，错过就是罪过', id: 'B' },
      { text: 'C. 这肯定是广告，反向操作！', id: 'C' },
    ],
  },
  {
    question: '你的持仓涨了 300%，这时候你会？',
    options: [
      { text: 'A. 落袋为安，保住利润', id: 'A' },
      { text: 'B. 继续持有，翻倍还在后头', id: 'B' },
      { text: 'C. 加仓！牛市无顶！', id: 'C' },
    ],
  },
]

const QUIZ_QUESTIONS_EN = [
  {
    question: 'Market crash detected. Your shitcoin is dumping 50%. What do you do?',
    options: [
      { text: 'A. Trust the technicals, this is a dip. ALL IN!', id: 'A' },
      { text: "B. If I don't sell, I don't lose.", id: 'B' },
      { text: 'C. HODL to zero for the culture!', id: 'C' },
    ],
  },
  {
    question: 'A KOL just shilled a new project. Your first reaction?',
    options: [
      { text: 'A. DYOR - check the whitepaper', id: 'A' },
      { text: 'B. APE first, research never', id: 'B' },
      { text: 'C. Fade the call, inverse Cramer!', id: 'C' },
    ],
  },
  {
    question: 'Your bag is up 300%. What now?',
    options: [
      { text: 'A. Take profits, secure the bag', id: 'A' },
      { text: 'B. Diamond hands, we going higher', id: 'B' },
      { text: 'C. Leverage up! Bull market forever!', id: 'C' },
    ],
  },
]

const RESPONSES_CN: Record<string, string> = {
  'A': "你选了'相信指标'？RSI 都钝化成直线了你还看。这是典型的被套妄想症。恭喜你，喜提'长期股东'称号。",
  'B': "你选了'装死'？很明智。只要不看账户，钱就不算亏。这个币完美配合你的策略，因为它再也不会涨回来了。",
  'C': "你选择了'为了信仰'？很有精神。全是情绪价值。建议买入后卸载行情软件。",
}

const RESPONSES_EN: Record<string, string> = {
  'A': "You trust the technicals? The RSI has been oversold for 6 months straight. Welcome to 'Long-term Investor' status. Copium is on aisle 3.",
  'B': "You chose to HODL? Galaxy brain move. Can't lose if you don't sell. This coin will perfectly match your strategy - it's never coming back.",
  'C': "For the culture? Based. No utility, no roadmap, just vibes. Delete the app after buying, you won't need it.",
}

const HALL_OF_SHAME = [
  { address: 'User_996', draws: 1024, title: 'Gas 费燃烧机', titleEN: 'GAS BURNER MAXI' },
  { address: 'LUNA_Victim', draws: 88, title: '山顶瞭望员', titleEN: 'MOUNTAIN TOP HOLDER' },
  { address: 'Degen_420x', draws: 69, title: '赛博乞丐', titleEN: 'CYBER BEGGAR' },
]

// 🪷 佛祖判词文案库
const BUDDHA_VERDICTS = {
  // 高风险 (ponziLevel > 70)
  high: {
    cn: [
      "施主，此币与你八字不合。强扭的瓜不仅不甜，还要倒贴手续费。",
      "贫僧观你印堂发黑，此币乃破财之相。速速远离，否则钱包归零。",
      "此币业障深重，持有者皆入轮回。施主若执意，贫僧只能为你超度钱包。",
      "佛祖曰：色即是空，币即是零。施主悟了吗？",
      "贫僧掐指一算，此币命犯天煞。买入者轻则套牢，重则归零。善哉善哉。",
      "施主，你与此币有三世孽缘。上辈子你欠它的，这辈子它来收债了。",
      "此币气场与你相冲，买入必遭反噬。贫僧劝你回头是岸。",
      "佛祖托梦告诉贫僧：这币的白皮书是用ChatGPT写的，团队照片是AI生成的。",
    ],
    en: [
      "This coin and your wallet have incompatible zodiac signs. Forcing it will cost you gas fees AND dignity.",
      "I see darkness in your aura. This coin is a wealth-destroyer. Run before your wallet hits zero.",
      "This coin carries heavy karma. All holders enter the cycle of suffering. Buy it and I'll prepare your wallet's funeral.",
      "Buddha says: Form is emptiness, coin is zero. Do you understand now?",
      "I calculated your fate: this coin is cursed. Buyers face either bags or bankruptcy. Amitabha.",
      "You and this coin have karmic debt from three lifetimes. You owed it before, now it's collecting.",
      "This coin's energy clashes with yours. Buying will bring retribution. Turn back while you can.",
      "Buddha told me in a dream: the whitepaper was written by ChatGPT, team photos are AI-generated.",
    ]
  },
  // 中风险 (ponziLevel > 40)
  medium: {
    cn: [
      "贫僧掐指一算，你五行缺金，但这币五行缺德。不配。",
      "此币尚有一线生机，但施主你的运势...贫僧不敢说。",
      "佛祖说：这币不是不能买，但买了你就是在给庄家积功德。",
      "贫僧观此币，有涨有跌，但跌的概率...阿弥陀佛，贫僧不能妄语。",
      "施主，此币如同渣男。偶尔给你甜头，但最终会让你血本无归。",
      "贫僧算过了，这币的命格是「先甜后苦」。甜的时候你舍不得卖，苦的时候你卖不掉。",
      "佛祖曰：贪嗔痴三毒，此币占了俩。施主自己品。",
      "此币有佛缘，但不是好的那种。是让你看破红尘、四大皆空的那种。",
    ],
    en: [
      "I calculated your fate: You lack gold in your five elements, but this coin lacks morals. Not a match.",
      "This coin has a slim chance, but your luck... I dare not speak.",
      "Buddha says: you CAN buy this, but you'd be donating merit to the market makers.",
      "I see ups and downs for this coin, but the probability of downs... Amitabha, I cannot lie.",
      "This coin is like a toxic ex. Gives you hope sometimes, but will drain you eventually.",
      "I calculated: this coin's fate is 'sweet then bitter'. Sweet when you won't sell, bitter when you can't.",
      "Buddha says: greed, anger, ignorance - this coin has two of three. Figure out which.",
      "This coin has Buddha's blessing, but not the good kind. The 'see through worldly attachments' kind.",
    ]
  },
  // 低风险 (ponziLevel <= 40)
  low: {
    cn: [
      "放下执念，立地成佛。",
      "此币尚可，但贫僧提醒：见好就收，莫要贪心。",
      "佛祖说：这币还行，但你的手...贫僧担心你拿不住。",
      "难得一见的正经币。但施主，你确定你配得上它吗？",
      "此币气场尚可，但贫僧观你面相，怕是会在最高点加仓。",
      "佛祖点头了。但他老人家也说了：涨了别贪，跌了别慌。你能做到吗？",
      "贫僧破例说句好话：这币不错。但你的操作水平...阿弥陀佛。",
      "此币有佛光护体，但施主你自带霉运光环，能不能抵消贫僧也不知道。",
    ],
    en: [
      "Let go of attachment, achieve enlightenment.",
      "This coin is decent, but remember: take profits, don't be greedy.",
      "Buddha says: coin's fine, but your hands... I worry you can't hold.",
      "A rare legitimate coin. But are you worthy of it?",
      "This coin's energy is okay, but looking at your face, you'll probably buy the top.",
      "Buddha approves. But he also said: don't be greedy when up, don't panic when down. Can you do that?",
      "I'll say something nice for once: good coin. But your trading skills... Amitabha.",
      "This coin has Buddha's protection, but you have a bad luck aura. Whether they cancel out, I don't know.",
    ]
  }
}

// 🚨 逃跑建议文案库
const EXIT_ADVICES = {
  // 高风险 (ponziLevel > 70)
  high: {
    cn: [
      "快跑！鞋都不要了！赶紧去送两单外卖对冲一下亏损！",
      "建议立刻清仓，然后删除所有交易App，假装这一切没发生过。",
      "逃跑路线：先卖币→再卸载App→最后换个手机号重新做人。",
      "现在跑还来得及。等庄家砸盘的时候，你连哭的机会都没有。",
      "贫僧给你指条明路：止损→提现→去庙里上柱香谢罪。",
      "跑！往没有WiFi的地方跑！只要看不到行情，就不算亏！",
      "建议操作：全部卖出，然后对着镜子说三遍「我再也不冲土狗了」。",
      "逃生指南：1.卖掉 2.删App 3.告诉自己这是学费 4.下次还敢",
    ],
    en: [
      "RUN! Leave your shoes behind! Go deliver food to hedge your losses!",
      "Sell everything NOW, delete all trading apps, pretend this never happened.",
      "Escape route: Sell → Uninstall app → Get a new phone number and start over.",
      "Run while you can. When the dump comes, you won't even have time to cry.",
      "Buddha's advice: Stop loss → Withdraw → Light incense at the temple to repent.",
      "Run to somewhere with no WiFi! If you can't see the charts, you're not losing!",
      "Recommended action: Sell all, then say 'I'll never ape into shitcoins again' three times in the mirror.",
      "Escape guide: 1.Sell 2.Delete app 3.Call it tuition 4.Do it again next week",
    ]
  },
  // 中风险 (ponziLevel > 40)
  medium: {
    cn: [
      "赶紧截图发朋友圈！5分钟后可能就只剩回忆了。",
      "建议设好止盈止损，然后去敲木鱼冷静一下。",
      "现在是逃跑的好时机。当然，你也可以等跌了再后悔。",
      "贫僧建议：先卖一半落袋为安，剩下的...随缘吧。",
      "趁现在还有利润，赶紧跑。等你想跑的时候，可能已经是负的了。",
      "逃跑窗口期：现在。错过这个村，就没这个店了。",
      "建议操作：获利了结，然后假装自己是投资大师发个朋友圈。",
      "贫僧掐指一算，你还有3分钟的逃跑时间。抓紧。",
    ],
    en: [
      "Screenshot your gains NOW. In 5 minutes it might just be a memory.",
      "Set your stop-loss, then go tap the wooden fish to calm down.",
      "Good time to exit. Or you can wait and regret later, your choice.",
      "Buddha suggests: sell half to secure profits, the rest... leave it to fate.",
      "Run while you're still green. By the time you want to run, you might be deep red.",
      "Exit window: NOW. Miss this chance and there won't be another.",
      "Recommended: Take profits, then post on social media pretending you're a trading genius.",
      "I calculated: you have 3 minutes left to escape. Hurry.",
    ]
  },
  // 低风险 (ponziLevel <= 40)
  low: {
    cn: [
      "居然还行？但记住：就算是坏掉的钟，一天也能对两次。",
      "可以拿着，但别贪。涨了记得跑，跌了...贫僧帮你念经。",
      "难得遇到个正经的。但贫僧提醒：你的手可能会毁掉一切。",
      "暂时不用跑，但随时准备好跑路的姿势。",
      "佛祖说可以持有。但他也说了，你大概率会在最高点加仓然后套牢。",
      "不急着跑，但也别太放松。这个圈子，今天的蓝筹明天可能就是空气。",
      "贫僧破例不催你跑。但设个止盈，别到时候坐过山车。",
      "可以观望，但记住：币圈一天，人间一年。随时准备撤退。",
    ],
    en: [
      "Surprisingly decent. But remember: even a broken clock is right twice a day.",
      "Hold if you want, but don't be greedy. Take profits when up, I'll pray for you when down.",
      "Rare to see a legit one. But your hands might ruin everything.",
      "No need to run yet, but stay ready to sprint.",
      "Buddha says hold. But he also says you'll probably buy more at the top and get rekt.",
      "Don't rush to exit, but don't relax either. Today's blue chip could be tomorrow's rugpull.",
      "I won't tell you to run this time. But set a take-profit, don't ride the rollercoaster.",
      "Watch and wait, but remember: one day in crypto is one year in real life. Stay ready to retreat.",
    ]
  }
}

// 随机选择文案的辅助函数
const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const GachaPage: React.FC = () => {
  const { lang } = useLangStore()
  const { draw, dailyDraws, gdBalance, history } = useGachaStore()
  const { playSound, speakText } = useSoundStore()
  const [stage, setStage] = useState<'idle' | 'choice' | 'loading' | 'result'>('idle')
  const [selectedChoice, setSelectedChoice] = useState<string>('')
  const [currentResult, setCurrentResult] = useState<GachaResult | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [drawCount, setDrawCount] = useState(0)
  const [showFullRoastModal, setShowFullRoastModal] = useState(false)
  const [currentVerdict, setCurrentVerdict] = useState('')
  const [currentExitAdvice, setCurrentExitAdvice] = useState('')
  const [currentPonziAnalysis, setCurrentPonziAnalysis] = useState<{tokenModel: string, exitDifficulty: string, projectPosition: string} | null>(null)
  
  const isEN = lang === 'en'
  const QUIZ_QUESTIONS = isEN ? QUIZ_QUESTIONS_EN : QUIZ_QUESTIONS_CN
  const RESPONSES = isEN ? RESPONSES_EN : RESPONSES_CN
  const freeDrawsLeft = Math.max(0, 1 - dailyDraws)
  const randomQuiz = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]

  const handleStart = () => {
    if (freeDrawsLeft === 0 && gdBalance < 100) {
      // 余额不足 → 弹出邀请好友（裂变优先）
      setShowInviteModal(true)
      return
    }
    // 只在第 3, 5, 7, 9... 次显示付费确认弹窗
    const nextDraw = drawCount + 1
    const shouldShowDialog = nextDraw >= 3 && nextDraw % 2 === 1
    
    if (shouldShowDialog) {
      setShowPaymentDialog(true)
    } else {
      // 直接进入抽签
      setDrawCount(prev => prev + 1)
      setStage('choice')
    }
  }

  const handlePaymentConfirm = () => {
    setShowPaymentDialog(false)
    setDrawCount(prev => prev + 1)
    setStage('choice')
  }

  const handlePaymentCancel = () => {
    setShowPaymentDialog(false)
  }

  const handleChoice = async (choice: string) => {
    setSelectedChoice(choice)
    playSound('choose') // 选择音效
    setStage('loading')
    playSound('roll') // 滚动音效
    
    const result = await draw()
    if (result) {
      setCurrentResult(result)
      setTimeout(() => {
        setStage('result')
        playSound('text') // 结果出现时打字音效
        
        // TTS朗读 - 使用与完整报告一致的内容
        const fortune = result.fortune
        const ponziLevel = (() => {
          const level = fortune.level
          if (level === 'N') return 95
          if (level === 'R') return 70
          if (level === 'SR') return 40
          return 15
        })()
        
        // AI分析
        const aiRoast = isEN ? fortune.messageEN : fortune.message
        
        // 佛祖判词 - 从文案库随机选择并保存
        const verdictLevel = ponziLevel > 70 ? 'high' : ponziLevel > 40 ? 'medium' : 'low'
        const verdictPool = BUDDHA_VERDICTS[verdictLevel][isEN ? 'en' : 'cn']
        const buddhaVerdict = pickRandom(verdictPool)
        setCurrentVerdict(buddhaVerdict)
        
        // 逃跑建议 - 从文案库随机选择并保存
        const advicePool = EXIT_ADVICES[verdictLevel][isEN ? 'en' : 'cn']
        const exitAdvice = pickRandom(advicePool)
        setCurrentExitAdvice(exitAdvice)
        
        // 庞氏结构分析 - 从文案库随机选择并保存
        const ponziAnalysis = getRandomPonziAnalysis(ponziLevel, isEN)
        setCurrentPonziAnalysis(ponziAnalysis)
        
        const ttsText = isEN 
          ? `${aiRoast}. Buddha's Verdict: ${buddhaVerdict}. Exit Strategy: ${exitAdvice}`
          : `${aiRoast}。佛祖判词：${buddhaVerdict}。逃跑建议：${exitAdvice}`
        speakText(ttsText, isEN ? 'en' : 'zh')
      }, 1500)
    }
  }

  const handleReset = () => {
    setStage('idle')
    setSelectedChoice('')
    setCurrentResult(null)
  }

  const getPonziLevel = () => {
    if (!currentResult) return 50
    const level = currentResult.fortune.level
    if (level === 'N') return 95
    if (level === 'R') return 70
    if (level === 'SR') return 40
    return 15
  }

  return (
    <div className="min-h-screen retro-bg font-retro text-[#00ff41] flex flex-col relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Warning Marquee */}
      <div className="w-full bg-yellow-400 text-black font-bold py-1.5 overflow-hidden border-b-4 border-black">
        <div className="whitespace-nowrap marquee-track">
          <span className="inline-block px-4">
            ⚠️ {isEN ? 'WARNING: For entertainment only' : '警告：本工具仅供娱乐'} • 
            {isEN ? 'Inverse this advice for villa by the sea' : '这里的建议反着买，别墅靠大海'} • 
            {isEN ? 'Investing is risky, going to zero is normal' : '投资有风险，归零是常态'} • 
            ⚠️ NFA (Not Financial Advice) •
            ⚠️ {isEN ? 'WARNING: For entertainment only' : '警告：本工具仅供娱乐'} • 
            {isEN ? 'Inverse this advice for villa by the sea' : '这里的建议反着买，别墅靠大海'} • 
            {isEN ? 'Investing is risky, going to zero is normal' : '投资有风险，归零是常态'} • 
            ⚠️ NFA (Not Financial Advice) •
          </span>
        </div>
      </div>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-6 z-10">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center">
          <div className="flex gap-2">
            {[
              { to: '/temple', icon: Flame, label: isEN ? 'TEMPLE' : '功德殿' },
              { to: '/leaderboard', icon: Trophy, label: isEN ? 'LEEKS' : '韭菜榜' },
              { to: '/about', icon: Info, label: isEN ? 'WTF' : '关于' },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-700 rounded hover:border-[#00ff41] hover:text-[#00ff41] transition-colors text-gray-400"
              >
                <Icon className="w-3 h-3" />
                {label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <MusicToggle />
            <button
              onClick={() => useLangStore.getState().toggleLang()}
              className="px-2 py-1 text-xs border border-gray-700 rounded hover:border-yellow-400 hover:text-yellow-400 transition-colors"
            >
              {isEN ? '🇺🇸 EN' : '🇨🇳 中文'}
            </button>
          </div>
        </nav>

        {/* LOGO */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-pixel text-yellow-400 drop-shadow-[2px_2px_0_rgba(255,0,85,1)]">
            GAS TEMPLE
          </h1>
          <p className="text-gray-400 text-sm">
            {isEN ? 'Cyber Monastery • Degen Sanctuary' : '赛博修道院 • 韭菜庇护所'}
          </p>
        </div>

        {/* Main Machine */}
        <div className="terminal-box bg-black p-4 rounded-lg min-h-[420px] flex flex-col relative">
          
          <AnimatePresence mode="wait">
            {/* Stage: Idle */}
            {stage === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-6 py-8"
              >
                <motion.div 
                  className="relative"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Q版古钱币 - 圆形方孔 */}
                  <div className="w-20 h-20 relative">
                    {/* 钱币主体 - 保持原来的金黄色Q版风格 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 border-4 border-yellow-300 shadow-lg">
                      {/* 外圈 */}
                      <div className="absolute inset-2 rounded-full border-2 border-yellow-300/50" />
                      {/* 方孔 - 中间的正方形孔 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-black/90 border-2 border-yellow-600 shadow-inner" />
                      </div>
                      {/* 高光 */}
                      <div className="absolute top-1 left-2 w-3 h-3 rounded-full bg-yellow-200/60 blur-[1px]" />
                    </div>
                    {/* 故障效果 */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-white mix-blend-overlay opacity-0"
                      animate={{ opacity: [0, 0.6, 0], x: [-2, 2, 0] }}
                      transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                    />
                    {/* 光晕 */}
                    <div className="absolute -inset-2 rounded-full bg-yellow-400/20 blur-lg animate-pulse" />
                  </div>
                  {/* Mystery particles */}
                  <motion.div
                    className="absolute -top-2 left-1/2 text-xl text-white"
                    animate={{ y: [-5, -15], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✦
                  </motion.div>
                </motion.div>
                <p className="text-center text-lg">
                  {isEN ? "Today's Fortune • Test Your Luck" : '今日运势 • 测测你的财运'}
                </p>
                <button 
                  onClick={handleStart}
                  className="w-full py-4 text-lg font-bold border-2 border-red-500 uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 text-yellow-300 rounded-lg shadow-lg hover:from-red-500 hover:to-red-700 transition-all hover:scale-105 active:scale-95"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                >
                  🧧 {isEN ? 'DRAW FORTUNE CODE' : '抽取今日财富密码'} 🧧
                  <div className="text-xs font-normal mt-1 text-yellow-200/80">
                    ({isEN ? `${freeDrawsLeft} free draw left` : `消耗 1 点信仰值`})
                  </div>
                </button>
                
                {/* Stats */}
                <div className="flex justify-between w-full text-xs text-gray-500 mt-4">
                  <span>{isEN ? 'Faith:' : '信仰余额:'} {gdBalance.toLocaleString()}</span>
                  <span>{isEN ? 'Deaths:' : '作死次数:'} {history.length}</span>
                </div>
              </motion.div>
            )}

            {/* Stage: Choice (RPG Box) */}
            {stage === 'choice' && (
              <motion.div 
                key="choice"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 z-20 flex items-center justify-center p-3"
              >
                <div className="rpg-box w-full p-4 text-white font-mono">
                  <p className="mb-4 text-base leading-relaxed">
                    {'> '}{randomQuiz.question}
                  </p>
                  <div className="space-y-2">
                    {randomQuiz.options.map((option) => (
                      <button 
                        key={option.id}
                        onClick={() => handleChoice(option.id)}
                        className="w-full text-left hover:bg-yellow-400 hover:text-black p-2 border border-transparent hover:border-white cursor-pointer transition-colors text-sm"
                      >
                        ▶ {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage: Loading */}
            {stage === 'loading' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full items-center justify-center text-[#00ff41] text-center gap-2"
              >
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-lg"
                >
                  {isEN ? 'Querying on-chain data...' : '正在查询链上数据...'}
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  className="text-lg"
                >
                  {isEN ? 'Calculating Ponzi coefficient...' : '正在计算庞氏系数...'}
                </motion.div>
              </motion.div>
            )}

            {/* Stage: Result */}
            {stage === 'result' && currentResult && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                {/* Top labels */}
                <div className="flex justify-between items-start mb-4">
                  <div className="danger-tag text-white px-2 py-1 text-xs font-bold">
                    {isEN ? 'HIGH RISK • DYOR' : '高风险 • 慎入'}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-pixel text-white">
                      {currentResult.fortune.coin?.symbol?.toUpperCase() || 'UNKNOWN'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentResult.fortune.level} Tier
                    </div>
                  </div>
                </div>

                {/* Toxic Analysis */}
                <div className="bg-gray-900 border border-gray-700 p-3 mb-4 rounded relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-20">
                    {currentResult.fortune.emoji}
                  </div>
                  <h3 className="text-yellow-400 font-bold mb-1 text-sm">
                    [ {isEN ? 'AI ROAST' : 'AI 毒舌点评'} ]
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    "{isEN ? currentResult.fortune.messageEN : currentResult.fortune.message}"
                  </p>
                  {/* 查看完整辣评按钮 */}
                  <button
                    onClick={() => setShowFullRoastModal(true)}
                    className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
                  >
                    🔍 {isEN ? 'View Full Roast' : '查看完整辣评'}
                  </button>
                </div>

                {/* Ponzi Meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{isEN ? 'Real Value' : '真实收益'}</span>
                    <span className="text-red-500 font-bold">
                      {isEN ? 'PONZI LEVEL' : '含庞量'}: {getPonziLevel()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-gray-600">
                    <motion.div 
                      className="ponzi-gradient h-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${getPonziLevel()}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    >
                      {getPonziLevel() > 80 && (
                        <span className="absolute right-1 top-0 text-[10px] text-black font-bold">RUN!</span>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* GD Earned - 待领取 $GONGDE */}
                <div className="text-center mb-4">
                  <div className="text-yellow-400 font-bold text-lg">
                    +{currentResult.gdEarned} <span className="text-green-400">$GONGDE</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {isEN ? '🔒 Pending claim at TGE' : '🔒 待 TGE 时领取'}
                  </div>
                </div>

                {/* Bad Luck Warning - Link to Temple */}
                {currentResult.fortune.level === 'N' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-900/30 border border-red-500/50 rounded p-3 mb-4 text-center"
                  >
                    <p className="text-red-400 text-sm mb-2">
                      ⚠️ {isEN ? 'CRITICAL: Bad karma detected!' : '警告：检测到严重业障！'}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      {isEN 
                        ? 'Your aura is contaminated. Go cleanse at the Cyber Temple.' 
                        : '你的气场已被污染，建议前往功德殿敲木鱼消业障'}
                    </p>
                    <Link 
                      to="/temple"
                      className="inline-block bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-xs font-bold rounded transition-colors"
                    >
                      🪬 {isEN ? 'GO CLEANSE KARMA' : '去消业障'}
                    </Link>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => setShowReceipt(true)}
                    className="w-full bg-white text-black hover:bg-gray-200 py-3 font-bold border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    {isEN ? '🖨️ Print Victim Receipt' : '🖨️ 打印"受害者"小票'}
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full border border-gray-600 text-gray-400 py-2 text-sm hover:text-white transition-colors"
                  >
                    {isEN ? `Draw Again (${freeDrawsLeft} free)` : `再抽一次 (剩余信仰: ${freeDrawsLeft})`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hall of Shame */}
        <div className="w-full border border-gray-800 bg-gray-900/50 p-4 rounded">
          <h2 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
            🏆 {isEN ? 'HALL OF SHAME' : '耻辱名人堂'}
          </h2>
          <div className="space-y-3">
            {HALL_OF_SHAME.map((user, i) => (
              <div 
                key={user.address}
                className={`flex items-center gap-3 p-2 bg-black/40 rounded ${i === 0 ? 'shame-border' : 'border border-gray-800'}`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 bg-gray-800 rounded-full overflow-hidden ${i === 0 ? 'border-2 border-yellow-600' : 'grayscale'}`}>
                    <img 
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.address}`} 
                      alt="avatar"
                      className="w-full h-full"
                    />
                  </div>
                  {i === 0 && <div className="absolute -top-2 -right-2 text-xs">🔥</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`${i === 0 ? 'text-yellow-500' : 'text-gray-300'} font-bold text-sm truncate`}>
                      {user.address}
                    </p>
                    <span className="text-xs text-gray-500">
                      {isEN ? `${user.draws} draws` : `已抽 ${user.draws} 次`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {isEN ? `Title: ${user.titleEN}` : `获得头衔：${user.title}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-center">
            <a href="/leaderboard" className="text-xs text-green-700 hover:text-green-500 underline">
              {isEN ? 'View full victim list >>' : '查看完整受害者名单 >>'}
            </a>
          </div>
        </div>

      </main>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        result={currentResult}
      />

      {/* Payment Confirmation Dialog - 付费确认弹窗 */}
      <PaymentConfirmDialog
        isOpen={showPaymentDialog}
        onConfirm={handlePaymentConfirm}
        onCancel={handlePaymentCancel}
        drawCount={drawCount}
        cost="0.01"
      />

      {/* Invite Friends Modal - 邀请好友（裂变优先） */}
      <InviteFriendsModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      {/* Inactivity Toast - Windows 95 style */}
      {stage === 'idle' && <InactivityToast timeoutSeconds={30} />}

      {/* Full Roast Modal - 完整辣评报告 */}
      <AnimatePresence>
        {showFullRoastModal && currentResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowFullRoastModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-5 max-w-md w-full my-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{currentResult.fortune.emoji}</div>
                <h3 className="text-lg font-bold text-cyan-400">
                  {currentResult.fortune.coin?.symbol?.toUpperCase() || 'UNKNOWN'} {isEN ? 'Full Analysis' : '完整辣评报告'}
                </h3>
                <p className="text-xs text-gray-500">{currentResult.fortune.coin?.name}</p>
              </div>

              {/* 真实数据区 */}
              <div className="bg-black/50 rounded p-3 mb-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">{isEN ? 'Market Cap' : '市值'}</p>
                  <p className="text-white font-bold">
                    ${((currentResult.fortune.coin as any)?.market_cap / 1000000)?.toFixed(1) || '?'}M
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">{isEN ? '24h Change' : '24h涨跌'}</p>
                  <p className={`font-bold ${(currentResult.fortune.coin as any)?.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(currentResult.fortune.coin as any)?.price_change_percentage_24h?.toFixed(1) || '?'}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">{isEN ? 'Rank' : '排名'}</p>
                  <p className="text-white font-bold">#{(currentResult.fortune.coin as any)?.market_cap_rank || '?'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">{isEN ? 'Ponzi Level' : '含庞量'}</p>
                  <p className={`font-bold ${getPonziLevel() > 70 ? 'text-red-400' : getPonziLevel() > 40 ? 'text-orange-400' : 'text-yellow-400'}`}>
                    {getPonziLevel() > 70 ? '🔴' : getPonziLevel() > 40 ? '🟠' : '🟡'} {getPonziLevel()}%
                  </p>
                  <p className="text-xs mt-0.5">
                    {isEN 
                      ? (getPonziLevel() > 70 ? 'Merit Destroyer' : getPonziLevel() > 40 ? 'Premium Ponzi' : 'Casino Chip')
                      : (getPonziLevel() > 70 ? '功德扣除器' : getPonziLevel() > 40 ? '精装盘子' : '赌场筹码')
                    }
                  </p>
                </div>
              </div>

              {/* AI 辣评 - 冷酷科技感 */}
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-3 mb-4">
                <p className="text-yellow-400 text-xs font-bold mb-1">🤖 {isEN ? 'AI ANALYSIS' : 'AI 冷血分析'}</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  "{isEN ? currentResult.fortune.messageEN : currentResult.fortune.message}"
                </p>
              </div>

              {/* 庞氏结构分析 - 从文案库随机选择 */}
              <div className="bg-gray-800/50 rounded p-3 mb-4 text-sm">
                <p className="text-cyan-400 text-xs font-bold mb-2">📊 {isEN ? 'Ponzi Structure' : '庞氏结构分析'}</p>
                <div className="space-y-2 text-gray-400 text-xs">
                  <p>• {currentPonziAnalysis?.tokenModel || '-'}</p>
                  <p>• {currentPonziAnalysis?.exitDifficulty || '-'}</p>
                  <p>• {currentPonziAnalysis?.projectPosition || '-'}</p>
                </div>
              </div>

              {/* 佛祖判词 - 从文案库随机选择 */}
              <div className="bg-purple-900/20 border border-purple-600/30 rounded p-3 mb-4">
                <p className="text-purple-400 text-xs font-bold mb-1">🪷 {isEN ? "Buddha's Verdict" : '佛祖判词'}</p>
                <p className="text-sm text-gray-300">
                  "{currentVerdict}"
                </p>
                <p className="text-xs text-purple-400/60 mt-2">
                  {isEN ? '🔮 Today: Uninstall App ✓ | Buy dip ✗' : '🔮 今日宜：卸载App | 忌：抄底'}
                </p>
              </div>

              {/* 逃跑建议 - 从文案库随机选择 */}
              <div className="bg-red-900/20 border border-red-600/30 rounded p-3 mb-4">
                <p className="text-red-400 text-xs font-bold mb-1">🏃 {isEN ? 'Exit Strategy' : '逃跑建议'}</p>
                <p className="text-xs text-gray-400">
                  {currentExitAdvice}
                </p>
              </div>

              {/* 分享按钮 - 挑衅化 */}
              <button
                onClick={() => {
                  const text = isEN 
                    ? `� SCAM ALERT: ${currentResult?.fortune.coin?.symbol?.toUpperCase() || 'SHITCOIN'}\n\n📊 Mcap: $${((currentResult.fortune.coin as any)?.market_cap / 1000000)?.toFixed(1)}M\n� 24h: ${(currentResult.fortune.coin as any)?.price_change_percentage_24h?.toFixed(1)}%\n🔴 Ponzi Level: ${getPonziLevel()}%\n\n"${currentResult.fortune.messageEN?.slice(0, 50)}..."\n\nGet roasted: gongde.xyz\n\n$GONGDE #GasTemple`
                    : `� 垃圾盘子预警: $${currentResult?.fortune.coin?.symbol?.toUpperCase() || '空气币'}\n\n📊 市值: $${((currentResult.fortune.coin as any)?.market_cap / 1000000)?.toFixed(1)}M\n� 24h: ${(currentResult.fortune.coin as any)?.price_change_percentage_24h?.toFixed(1)}%\n🔴 含庞量: ${getPonziLevel()}%\n\n"${currentResult.fortune.message?.slice(0, 30)}..."\n\n来挨骂: gongde.xyz\n\n$GONGDE #GasTemple`
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
                  window.open(url, '_blank')
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-bold rounded border border-red-400 transition-colors flex items-center justify-center gap-2 mb-2"
              >
                🚨 {isEN ? 'EXPOSE THIS SCAM' : '曝光这个垃圾盘子'}
              </button>
              <button
                onClick={() => setShowFullRoastModal(false)}
                className="w-full text-gray-500 text-xs hover:text-gray-400 py-2"
              >
                {isEN ? 'Close' : '关闭'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GachaPage

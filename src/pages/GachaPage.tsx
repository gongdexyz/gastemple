import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, Flame, Trophy, Info } from 'lucide-react'
import { useGachaStore, GachaResult } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'
import { ReceiptModal } from '../components/ReceiptModal'
import { InactivityToast } from '../components/InactivityToast'
import { PaymentConfirmDialog } from '../components/PaymentConfirmDialog'
import { InviteFriendsModal } from '../components/InviteFriendsModal'

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

export const GachaPage: React.FC = () => {
  const { lang } = useLangStore()
  const { draw, dailyDraws, gdBalance, history } = useGachaStore()
  const [stage, setStage] = useState<'idle' | 'choice' | 'loading' | 'result'>('idle')
  const [selectedChoice, setSelectedChoice] = useState<string>('')
  const [currentResult, setCurrentResult] = useState<GachaResult | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [drawCount, setDrawCount] = useState(0)
  
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
    setStage('loading')
    
    const result = await draw()
    if (result) {
      setCurrentResult(result)
      setTimeout(() => setStage('result'), 1500)
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
          <button
            onClick={() => useLangStore.getState().toggleLang()}
            className="px-2 py-1 text-xs border border-gray-700 rounded hover:border-yellow-400 hover:text-yellow-400 transition-colors"
          >
            {isEN ? '🇺🇸 EN' : '🇨🇳 中文'}
          </button>
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
                  {/* Pixel Coin */}
                  <div className="w-20 h-20 relative">
                    {/* Coin body */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 border-4 border-yellow-300 shadow-lg">
                      {/* Inner ring */}
                      <div className="absolute inset-2 rounded-full border-2 border-yellow-300/50" />
                      {/* Center symbol */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-900 font-pixel" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.3)' }}>$</span>
                      </div>
                      {/* Shine effect */}
                      <div className="absolute top-1 left-2 w-3 h-3 rounded-full bg-yellow-200/60 blur-[1px]" />
                    </div>
                    {/* Glitch effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-white mix-blend-overlay opacity-0"
                      animate={{ opacity: [0, 0.6, 0], x: [-2, 2, 0] }}
                      transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                    />
                    {/* Glow */}
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
                  className="glitch-btn w-full py-4 text-lg font-bold border-2 border-[#00ff41] uppercase tracking-wider bg-transparent"
                >
                  {isEN ? 'DRAW FORTUNE CODE' : '抽取今日财富密码'}
                  <div className="text-xs font-normal mt-1 text-gray-500">
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
                    "{RESPONSES[selectedChoice] || (isEN ? currentResult.fortune.messageEN : currentResult.fortune.message)}"
                  </p>
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

                {/* GD Earned */}
                <div className="text-center mb-4 text-yellow-400 font-bold">
                  +{currentResult.gdEarned} $GD {isEN ? 'EARNED' : '功德到账'}
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
    </div>
  )
}

export default GachaPage

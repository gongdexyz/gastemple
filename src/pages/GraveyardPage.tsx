import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skull, Trophy, Lock, Calculator, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { useGachaStore } from '../stores/gachaStore'

// Famous dead/rugged coins for collection
const GRAVEYARD_COINS = [
  { id: 'luna', symbol: 'LUNA', name: 'Terra Luna', deathDate: '2022-05-12', epitaph: 'Do Kwon说稳定，结果稳定归零', epitaphEN: '"Stable" they said. Stable at $0.', peak: '$119.18', rip: '-99.99%' },
  { id: 'ftx', symbol: 'FTT', name: 'FTX Token', deathDate: '2022-11-08', epitaph: '资金是安全的（并不）', epitaphEN: 'Funds are SAFU (they weren\'t)', peak: '$84.18', rip: '-99.9%' },
  { id: 'ust', symbol: 'UST', name: 'TerraUSD', deathDate: '2022-05-09', epitaph: '算法稳定币，稳定了个寂寞', epitaphEN: 'Algorithmic stability... lol', peak: '$1.00', rip: '-99.99%' },
  { id: 'squid', symbol: 'SQUID', name: 'Squid Game', deathDate: '2021-11-01', epitaph: '鱿鱼游戏结束，你输了', epitaphEN: 'Game over. You lost.', peak: '$2,861', rip: '-100%' },
  { id: 'bitconnect', symbol: 'BCC', name: 'BitConnect', deathDate: '2018-01-16', epitaph: 'BITCONEEEEEECT!', epitaphEN: 'BITCONEEEEEECT!', peak: '$463', rip: '-100%' },
  { id: 'safemoon', symbol: 'SFM', name: 'SafeMoon', deathDate: '2023-12-01', epitaph: '去月球？只去了地狱', epitaphEN: 'To the moon? More like to the ground.', peak: '$0.00001', rip: '-99.9%' },
  { id: 'celsius', symbol: 'CEL', name: 'Celsius', deathDate: '2022-07-13', epitaph: '你的币还在，只是你取不出来', epitaphEN: 'Your coins are still there. Just... inaccessible.', peak: '$8.02', rip: '-99.9%' },
  { id: 'voyager', symbol: 'VGX', name: 'Voyager', deathDate: '2022-07-05', epitaph: '航海家号，沉了', epitaphEN: 'The voyage has ended.', peak: '$13.69', rip: '-99.9%' },
  { id: 'iron', symbol: 'IRON', name: 'Iron Finance', deathDate: '2021-06-16', epitaph: 'Mark Cuban也被割了', epitaphEN: 'Even Mark Cuban got rekt', peak: '$64', rip: '-100%' },
]

// Achievement badges
const ACHIEVEMENTS = [
  { id: 'first_blood', name: '初次割肉', nameEN: 'First Blood', desc: '收集第1个归零币', descEN: 'Collect 1 dead coin', icon: '🩸', required: 1 },
  { id: 'collector', name: '收藏家', nameEN: 'Collector', desc: '收集5个归零币', descEN: 'Collect 5 dead coins', icon: '📦', required: 5 },
  { id: 'gravekeeper', name: '守墓人', nameEN: 'Gravekeeper', desc: '收集全部归零币', descEN: 'Collect all dead coins', icon: '⚰️', required: 9 },
  { id: 'luna_holder', name: '山顶站岗', nameEN: 'Mountain Watcher', desc: '收集LUNA', descEN: 'Collect LUNA', icon: '🏔️', special: 'luna' },
  { id: 'ponzi_master', name: '庞氏大师', nameEN: 'Ponzi Master', desc: '收集BitConnect', descEN: 'Collect BitConnect', icon: '🎭', special: 'bitconnect' },
]

// Historical price data for regret calculation
const HISTORICAL_COINS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', prices: { '2015': 300, '2017': 1000, '2019': 3500, '2021': 29000, '2024': 42000, now: 95000 } },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', prices: { '2016': 10, '2017': 50, '2019': 130, '2021': 730, '2024': 2200, now: 3400 } },
  { id: 'sol', symbol: 'SOL', name: 'Solana', prices: { '2020': 0.5, '2021': 1.5, '2022': 25, '2024': 100, now: 190 } },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', prices: { '2017': 0.0002, '2019': 0.002, '2021': 0.05, '2024': 0.08, now: 0.32 } },
  { id: 'luna', symbol: 'LUNA', name: 'Terra Luna', prices: { '2021': 5, '2022-jan': 80, '2022-apr': 119, now: 0.0001 } },
  { id: 'shib', symbol: 'SHIB', name: 'Shiba Inu', prices: { '2021-jan': 0.000000001, '2021-oct': 0.00008, now: 0.000022 } },
]

interface RegretResult {
  coin: typeof HISTORICAL_COINS[0]
  year: string
  invested: number
  wouldBeWorth: number
  multiplier: number
  isProfit: boolean
}

type TabType = 'graveyard' | 'regret'

export const GraveyardPage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const { history } = useGachaStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('graveyard')

  // Graveyard state
  const collectedIds = new Set(history.map(h => h.fortune.coin?.id).filter(Boolean))
  const demoCollected = new Set<string>()
  if (history.length >= 1) demoCollected.add('luna')
  if (history.length >= 3) demoCollected.add('ftx')
  if (history.length >= 5) demoCollected.add('squid')
  if (history.length >= 7) demoCollected.add('bitconnect')
  const allCollected = new Set([...collectedIds, ...demoCollected])
  const collectedCount = allCollected.size
  const earnedAchievements = ACHIEVEMENTS.filter(a => {
    if (a.special) return allCollected.has(a.special)
    return collectedCount >= (a.required || 0)
  })

  // Regret calculator state
  const [selectedCoin, setSelectedCoin] = useState<string>('btc')
  const [selectedYear, setSelectedYear] = useState<string>('2017')
  const [investAmount, setInvestAmount] = useState<string>('1000')
  const [result, setResult] = useState<RegretResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculate = () => {
    const coin = HISTORICAL_COINS.find(c => c.id === selectedCoin)
    if (!coin) return
    const pastPrice = coin.prices[selectedYear as keyof typeof coin.prices]
    const currentPrice = coin.prices.now
    if (!pastPrice || !currentPrice) return
    setIsCalculating(true)
    setTimeout(() => {
      const invested = parseFloat(investAmount) || 0
      const coinsOwned = invested / pastPrice
      const wouldBeWorth = coinsOwned * currentPrice
      const multiplier = wouldBeWorth / invested
      setResult({ coin, year: selectedYear, invested, wouldBeWorth, multiplier, isProfit: wouldBeWorth > invested })
      setIsCalculating(false)
    }, 1500)
  }

  const getAvailableYears = () => {
    const coin = HISTORICAL_COINS.find(c => c.id === selectedCoin)
    if (!coin) return []
    return Object.keys(coin.prices).filter(k => k !== 'now')
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const getEmotionalMessage = () => {
    if (!result) return ''
    const mult = result.multiplier
    if (isEN) {
      if (mult > 1000) return "You'd be retired on a yacht right now. Instead, you bought ramen."
      if (mult > 100) return "Congrats, you missed out on a house down payment."
      if (mult > 10) return "That vacation you skipped? This would've paid for 10."
      if (mult > 2) return "Not life-changing, but still hurts, doesn't it?"
      if (mult < 1) return "Actually... you dodged a bullet. Lucky you."
      return "Meh. You'd have a nice dinner at least."
    } else {
      if (mult > 1000) return "你现在应该在游艇上退休了。但你选择了吃泡面。"
      if (mult > 100) return "恭喜，你错过了一套房子的首付。"
      if (mult > 10) return "你省下的那顿火锅钱？本可以请全公司吃100顿。"
      if (mult > 2) return "不算改变人生，但还是肉疼吧？"
      if (mult < 1) return "其实...你躲过了一劫。算你运气好。"
      return "emmm，至少够请女朋友吃顿好的。"
    }
  }

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-2xl font-bold flex items-center justify-center gap-2 ${isDegen ? 'text-degen-green font-pixel text-xl neon-text' : 'text-goldman-gold'}`}>
              <Skull className="w-6 h-6" />
              {isEN ? 'CRYPTO GRAVEYARD' : '电子骨灰盒'}
            </h1>
            <p className={`text-sm mt-2 ${isDegen ? 'text-gray-400' : 'text-gray-500'}`}>
              {isEN ? 'Memorial & Regret Calculator' : '纪念堂 & 后悔计算器'}
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('graveyard')}
              className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                activeTab === 'graveyard'
                  ? isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
                  : isDegen ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Skull className="w-4 h-4" />
              {isEN ? 'Graveyard' : '骨灰盒'}
            </button>
            <button
              onClick={() => setActiveTab('regret')}
              className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                activeTab === 'regret'
                  ? isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
                  : isDegen ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Calculator className="w-4 h-4" />
              {isEN ? 'If Only...' : '如果当初'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Graveyard Tab */}
            {activeTab === 'graveyard' && (
              <motion.div
                key="graveyard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Achievements */}
                <div className={`mb-6 p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-purple/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className={`w-4 h-4 ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`} />
                    <h2 className={`font-bold ${isDegen ? 'text-degen-yellow font-pixel text-sm' : 'text-goldman-gold'}`}>
                      {isEN ? 'ACHIEVEMENTS' : '成就'} ({collectedCount}/{GRAVEYARD_COINS.length})
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ACHIEVEMENTS.map(achievement => {
                      const earned = earnedAchievements.includes(achievement)
                      return (
                        <div
                          key={achievement.id}
                          className={`px-3 py-2 rounded-lg text-center transition-all ${
                            earned 
                              ? isDegen ? 'bg-degen-green/20 border border-degen-green' : 'bg-goldman-gold/20 border border-goldman-gold'
                              : 'bg-gray-800/50 border border-gray-700 opacity-40'
                          }`}
                          title={isEN ? achievement.descEN : achievement.desc}
                        >
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className={`text-xs mt-1 ${earned ? isDegen ? 'text-degen-green' : 'text-goldman-gold' : 'text-gray-500'}`}>
                            {isEN ? achievement.nameEN : achievement.name}
                          </div>
                          {!earned && <Lock className="w-3 h-3 mx-auto mt-1 text-gray-600" />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Graveyard Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {GRAVEYARD_COINS.map((coin, i) => {
                    const collected = allCollected.has(coin.id)
                    return (
                      <motion.div
                        key={coin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className={`relative p-4 rounded-lg text-center ${
                          collected
                            ? isDegen ? 'bg-gray-900 border-2 border-degen-green/50' : 'bg-gray-800 border border-goldman-gold/50'
                            : 'bg-gray-900/30 border border-gray-800 opacity-50'
                        }`}
                      >
                        {/* Tombstone */}
                        <div className={`relative mx-auto w-20 h-24 ${collected ? '' : 'grayscale'}`}>
                          <div className={`absolute inset-0 rounded-t-full ${isDegen ? 'bg-gradient-to-b from-gray-600 to-gray-800' : 'bg-gradient-to-b from-gray-500 to-gray-700'}`}>
                            <div className="pt-3 text-center">
                              <span className="text-gray-400 text-xs font-bold">R.I.P.</span>
                            </div>
                            <div className={`mt-1 text-lg font-bold ${collected ? 'text-white' : 'text-gray-500'}`}>
                              {coin.symbol}
                            </div>
                            <div className="mt-1 text-[8px] text-gray-400">{coin.deathDate}</div>
                          </div>
                          <div className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-t from-green-900/50 to-transparent rounded" />
                        </div>

                        <div className={`mt-3 text-xs font-bold ${collected ? isDegen ? 'text-degen-green' : 'text-white' : 'text-gray-600'}`}>
                          {coin.name}
                        </div>

                        {collected && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-gray-500">{isEN ? 'Peak:' : '巅峰:'}</span>
                              <span className="text-green-400">{coin.peak}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-gray-500">{isEN ? 'Now:' : '现在:'}</span>
                              <span className="text-red-400">{coin.rip}</span>
                            </div>
                          </div>
                        )}

                        {collected && (
                          <div className={`mt-2 text-[10px] italic ${isDegen ? 'text-gray-400' : 'text-gray-500'}`}>
                            "{isEN ? coin.epitaphEN : coin.epitaph}"
                          </div>
                        )}

                        {!collected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-gray-600" />
                          </div>
                        )}

                        {collected && (
                          <motion.div
                            className="absolute -top-2 right-2 text-lg"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🕯️
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {collectedCount === 0 && (
                  <div className="text-center mt-8 p-6">
                    <p className={`text-lg ${isDegen ? 'text-degen-green' : 'text-gray-400'}`}>
                      {isEN ? 'No fallen comrades yet...' : '还没有阵亡的战友...'}
                    </p>
                    <Link
                      to="/gacha"
                      className={`inline-block mt-4 px-6 py-2 rounded font-bold ${
                        isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
                      }`}
                    >
                      {isEN ? 'GO DRAW' : '去抽签'}
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Regret Calculator Tab */}
            {activeTab === 'regret' && (
              <motion.div
                key="regret"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={`p-6 rounded-xl mb-6 ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
                  <p className={`text-xs mb-4 ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>
                    {isEN ? '⚠️ WARNING: May cause emotional damage' : '⚠️ 警告：可能造成情绪伤害'}
                  </p>

                  <div className="space-y-4">
                    {/* Coin Selection */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                        {isEN ? 'If I had bought...' : '如果我当初买了...'}
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {HISTORICAL_COINS.map(coin => (
                          <button
                            key={coin.id}
                            onClick={() => {
                              setSelectedCoin(coin.id)
                              setResult(null)
                              if (!coin.prices[selectedYear as keyof typeof coin.prices]) {
                                const years = Object.keys(coin.prices).filter(k => k !== 'now')
                                setSelectedYear(years[0] || '2021')
                              }
                            }}
                            className={`p-2 rounded text-center text-xs font-bold transition-all ${
                              selectedCoin === coin.id
                                ? isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
                                : isDegen ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {coin.symbol}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Year Selection */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold'}`}>
                        <Clock className="w-4 h-4 inline mr-1" />
                        {isEN ? 'Back in...' : '在...年'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableYears().map(year => (
                          <button
                            key={year}
                            onClick={() => { setSelectedYear(year); setResult(null) }}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                              selectedYear === year
                                ? isDegen ? 'bg-degen-cyan text-black' : 'bg-goldman-gold text-black'
                                : isDegen ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        {isEN ? 'With just...' : '只需投入...'}
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {['100', '1000', '5000', '10000'].map(amount => (
                          <button
                            key={amount}
                            onClick={() => { setInvestAmount(amount); setResult(null) }}
                            className={`px-3 py-2 rounded text-xs font-bold transition-all ${
                              investAmount === amount
                                ? isDegen ? 'bg-degen-yellow text-black' : 'bg-goldman-gold text-black'
                                : isDegen ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            ${parseInt(amount).toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                      onClick={calculate}
                      disabled={isCalculating}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                        isDegen 
                          ? 'bg-gradient-to-r from-degen-green to-degen-cyan text-black hover:opacity-90' 
                          : 'bg-gradient-to-r from-goldman-gold to-amber-500 text-black hover:opacity-90'
                      } ${isCalculating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isCalculating 
                        ? (isEN ? '⏳ CALCULATING REGRET...' : '⏳ 正在计算后悔程度...')
                        : (isEN ? '💔 CALCULATE MY PAIN' : '💔 算算我有多惨')
                      }
                    </button>
                  </div>
                </div>

                {/* Result */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-6 rounded-xl ${
                        result.isProfit 
                          ? isDegen ? 'bg-red-900/30 border-2 border-red-500' : 'bg-red-900/20 border border-red-500/50'
                          : isDegen ? 'bg-green-900/30 border-2 border-green-500' : 'bg-green-900/20 border border-green-500/50'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">
                          {result.isProfit ? (result.multiplier > 100 ? '💀' : '😭') : '😅'}
                        </div>
                        <h3 className={`text-lg font-bold ${isDegen ? 'font-pixel' : ''} ${result.isProfit ? 'text-red-400' : 'text-green-400'}`}>
                          {isEN 
                            ? (result.isProfit ? 'YOU MISSED OUT' : 'YOU DODGED A BULLET')
                            : (result.isProfit ? '你错过了' : '你躲过了一劫')
                          }
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${isDegen ? 'bg-black/30' : 'bg-gray-800/50'}`}>
                          <p className="text-xs text-gray-500">{isEN ? 'You invested' : '你投入了'}</p>
                          <p className={`text-xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>
                            {formatNumber(result.invested)}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${isDegen ? 'bg-black/30' : 'bg-gray-800/50'}`}>
                          <p className="text-xs text-gray-500">{isEN ? 'Would be worth' : '现在价值'}</p>
                          <p className={`text-xl font-bold ${result.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {formatNumber(result.wouldBeWorth)}
                          </p>
                        </div>
                      </div>

                      <div className={`text-center p-4 rounded-lg mb-4 ${isDegen ? 'bg-black/50' : 'bg-gray-900/50'}`}>
                        <p className="text-sm text-gray-400">{isEN ? 'Multiplier' : '翻倍数'}</p>
                        <div className="flex items-center justify-center gap-2">
                          {result.isProfit ? (
                            <TrendingUp className="w-8 h-8 text-green-400" />
                          ) : (
                            <TrendingDown className="w-8 h-8 text-red-400" />
                          )}
                          <span className={`text-4xl font-bold ${isDegen ? 'font-pixel text-3xl' : ''} ${result.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {result.multiplier > 1 ? '+' : ''}{result.multiplier.toFixed(1)}x
                          </span>
                        </div>
                      </div>

                      <div className={`text-center p-3 rounded-lg ${isDegen ? 'bg-degen-purple/20' : 'bg-gray-800/50'}`}>
                        <p className={`text-sm italic ${isDegen ? 'text-degen-pink' : 'text-gray-400'}`}>
                          "{getEmotionalMessage()}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-xs text-gray-600 italic"
          >
            {isEN 
              ? '"Those who cannot remember the past are condemned to repeat it."'
              : '"忘记历史的人注定重蹈覆辙。"'
            }
          </motion.p>
        </div>
      </main>
    </div>
  )
}

export default GraveyardPage

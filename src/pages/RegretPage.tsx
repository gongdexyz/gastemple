import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'

// Historical price data for regret calculation
const HISTORICAL_COINS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', prices: { '2015': 300, '2017': 1000, '2019': 3500, '2021': 29000, '2024': 42000, now: 95000 } },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', prices: { '2016': 10, '2017': 50, '2019': 130, '2021': 730, '2024': 2200, now: 3400 } },
  { id: 'sol', symbol: 'SOL', name: 'Solana', prices: { '2020': 0.5, '2021': 1.5, '2022': 25, '2024': 100, now: 190 } },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', prices: { '2017': 0.0002, '2019': 0.002, '2021': 0.05, '2024': 0.08, now: 0.32 } },
  { id: 'luna', symbol: 'LUNA', name: 'Terra Luna', prices: { '2021': 5, '2022-jan': 80, '2022-apr': 119, now: 0.0001 } },
  { id: 'shib', symbol: 'SHIB', name: 'Shiba Inu', prices: { '2021-jan': 0.000000001, '2021-oct': 0.00008, now: 0.000022 } },
]

const YEARS = ['2015', '2016', '2017', '2019', '2020', '2021', '2022', '2024']

interface RegretResult {
  coin: typeof HISTORICAL_COINS[0]
  year: string
  invested: number
  wouldBeWorth: number
  multiplier: number
  isProfit: boolean
}

export const RegretPage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'

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
    
    // Dramatic calculation animation
    setTimeout(() => {
      const invested = parseFloat(investAmount) || 0
      const coinsOwned = invested / pastPrice
      const wouldBeWorth = coinsOwned * currentPrice
      const multiplier = wouldBeWorth / invested
      
      setResult({
        coin,
        year: selectedYear,
        invested,
        wouldBeWorth,
        multiplier,
        isProfit: wouldBeWorth > invested
      })
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-2xl font-bold flex items-center justify-center gap-2 ${isDegen ? 'text-degen-green font-pixel text-xl neon-text' : 'text-goldman-gold'}`}>
              <Calculator className="w-6 h-6" />
              {isEN ? 'REGRET MACHINE' : '如果当初...'}
            </h1>
            <p className={`text-sm mt-2 ${isDegen ? 'text-gray-400' : 'text-gray-500'}`}>
              {isEN ? 'Calculate how rich you COULD have been' : '算算你本可以有多富'}
            </p>
            <p className={`text-xs mt-1 ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>
              {isEN ? '⚠️ WARNING: May cause emotional damage' : '⚠️ 警告：可能造成情绪伤害'}
            </p>
          </motion.div>

          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl mb-6 ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
          >
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
                        // Reset year if not available for this coin
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
                <div className="flex gap-2">
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
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => { setInvestAmount(e.target.value); setResult(null) }}
                    className={`flex-1 px-3 py-2 rounded text-sm bg-gray-800 border ${
                      isDegen ? 'border-degen-green/30 text-white' : 'border-gray-600 text-white'
                    } focus:outline-none focus:ring-1 ${isDegen ? 'focus:ring-degen-green' : 'focus:ring-goldman-gold'}`}
                    placeholder={isEN ? 'Custom' : '自定义'}
                  />
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
          </motion.div>

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
                {/* Header */}
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

                {/* Stats */}
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

                {/* Multiplier */}
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

                {/* Emotional Message */}
                <div className={`text-center p-3 rounded-lg ${isDegen ? 'bg-degen-purple/20' : 'bg-gray-800/50'}`}>
                  <p className={`text-sm italic ${isDegen ? 'text-degen-pink' : 'text-gray-400'}`}>
                    "{getEmotionalMessage()}"
                  </p>
                </div>

                {/* Share Button */}
                <button
                  className={`w-full mt-4 py-2 rounded font-bold text-sm ${
                    isDegen 
                      ? 'bg-degen-green/20 text-degen-green border border-degen-green/50 hover:bg-degen-green/30'
                      : 'bg-goldman-gold/20 text-goldman-gold border border-goldman-gold/50 hover:bg-goldman-gold/30'
                  }`}
                >
                  {isEN ? '📢 SHARE MY REGRET' : '📢 分享我的后悔'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-xs text-gray-600 italic"
          >
            {isEN 
              ? '"The best time to invest was yesterday. The second best time is to stop looking at this calculator."'
              : '"最好的投资时机是昨天。第二好的时机是关掉这个计算器。"'
            }
          </motion.p>
        </div>
      </main>
    </div>
  )
}

export default RegretPage

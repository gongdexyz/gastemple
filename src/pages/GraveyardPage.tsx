import React from 'react'
import { motion } from 'framer-motion'
import { Skull, Trophy, Lock } from 'lucide-react'
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

// Achievement badges for collecting dead coins
const ACHIEVEMENTS = [
  { id: 'first_blood', name: '初次割肉', nameEN: 'First Blood', desc: '收集第1个归零币', descEN: 'Collect 1 dead coin', icon: '🩸', required: 1 },
  { id: 'collector', name: '收藏家', nameEN: 'Collector', desc: '收集5个归零币', descEN: 'Collect 5 dead coins', icon: '📦', required: 5 },
  { id: 'gravekeeper', name: '守墓人', nameEN: 'Gravekeeper', desc: '收集全部归零币', descEN: 'Collect all dead coins', icon: '⚰️', required: 9 },
  { id: 'luna_holder', name: '山顶站岗', nameEN: 'Mountain Watcher', desc: '收集LUNA', descEN: 'Collect LUNA', icon: '🏔️', special: 'luna' },
  { id: 'ponzi_master', name: '庞氏大师', nameEN: 'Ponzi Master', desc: '收集BitConnect', descEN: 'Collect BitConnect', icon: '🎭', special: 'bitconnect' },
]

export const GraveyardPage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const { history } = useGachaStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'

  // Get unique coins from history (simulated collection)
  const collectedIds = new Set(history.map(h => h.fortune.coin?.id).filter(Boolean))
  
  // For demo, also add some random collected ones based on history length
  const demoCollected = new Set<string>()
  if (history.length >= 1) demoCollected.add('luna')
  if (history.length >= 3) demoCollected.add('ftx')
  if (history.length >= 5) demoCollected.add('squid')
  if (history.length >= 7) demoCollected.add('bitconnect')

  const allCollected = new Set([...collectedIds, ...demoCollected])
  const collectedCount = allCollected.size

  // Check achievements
  const earnedAchievements = ACHIEVEMENTS.filter(a => {
    if (a.special) return allCollected.has(a.special)
    return collectedCount >= (a.required || 0)
  })

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-2xl font-bold flex items-center justify-center gap-2 ${isDegen ? 'text-degen-green font-pixel text-xl neon-text' : 'text-goldman-gold'}`}>
              <Skull className="w-6 h-6" />
              {isEN ? 'CRYPTO GRAVEYARD' : '电子骨灰盒'}
            </h1>
            <p className={`text-sm mt-2 ${isDegen ? 'text-gray-400' : 'text-gray-500'}`}>
              {isEN ? 'A memorial to your fallen investments' : '纪念那些陪你亏过钱的老朋友'}
            </p>
            <p className={`text-xs mt-1 ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>
              {isEN ? `Collected: ${collectedCount}/${GRAVEYARD_COINS.length}` : `已收集: ${collectedCount}/${GRAVEYARD_COINS.length}`}
            </p>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mb-8 p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-purple/30' : 'bg-gray-900/50 border border-goldman-border'}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy className={`w-4 h-4 ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`} />
              <h2 className={`font-bold ${isDegen ? 'text-degen-yellow font-pixel text-sm' : 'text-goldman-gold'}`}>
                {isEN ? 'ACHIEVEMENTS' : '成就'}
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
          </motion.div>

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
                  className={`tombstone relative p-4 rounded-lg text-center ${
                    collected
                      ? isDegen ? 'bg-gray-900 border-2 border-degen-green/50' : 'bg-gray-800 border border-goldman-gold/50'
                      : 'bg-gray-900/30 border border-gray-800 opacity-50'
                  }`}
                >
                  {/* Tombstone */}
                  <div className={`relative mx-auto w-20 h-24 ${collected ? '' : 'grayscale'}`}>
                    {/* Tombstone shape */}
                    <div className={`absolute inset-0 rounded-t-full ${
                      isDegen ? 'bg-gradient-to-b from-gray-600 to-gray-800' : 'bg-gradient-to-b from-gray-500 to-gray-700'
                    }`}>
                      {/* Cross or RIP */}
                      <div className="pt-3 text-center">
                        <span className="text-gray-400 text-xs font-bold">R.I.P.</span>
                      </div>
                      {/* Symbol */}
                      <div className={`mt-1 text-lg font-bold ${collected ? 'text-white' : 'text-gray-500'}`}>
                        {coin.symbol}
                      </div>
                      {/* Death date */}
                      <div className="mt-1 text-[8px] text-gray-400">
                        {coin.deathDate}
                      </div>
                    </div>
                    {/* Ground */}
                    <div className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-t from-green-900/50 to-transparent rounded" />
                  </div>

                  {/* Coin name */}
                  <div className={`mt-3 text-xs font-bold ${collected ? isDegen ? 'text-degen-green' : 'text-white' : 'text-gray-600'}`}>
                    {coin.name}
                  </div>

                  {/* Stats */}
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

                  {/* Epitaph (on hover/collected) */}
                  {collected && (
                    <div className={`mt-2 text-[10px] italic ${isDegen ? 'text-gray-400' : 'text-gray-500'}`}>
                      "{isEN ? coin.epitaphEN : coin.epitaph}"
                    </div>
                  )}

                  {/* Lock icon for uncollected */}
                  {!collected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-600" />
                    </div>
                  )}

                  {/* Candle animation for collected */}
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

          {/* Empty state */}
          {collectedCount === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8 p-6"
            >
              <p className={`text-lg ${isDegen ? 'text-degen-green' : 'text-gray-400'}`}>
                {isEN ? 'No fallen comrades yet...' : '还没有阵亡的战友...'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {isEN ? 'Draw more fortunes to collect dead coins!' : '多抽几签，收集更多归零币！'}
              </p>
              <Link
                to="/"
                className={`inline-block mt-4 px-6 py-2 rounded font-bold ${
                  isDegen ? 'bg-degen-green text-black hover:bg-degen-green/80' : 'bg-goldman-gold text-black hover:bg-goldman-gold/80'
                }`}
              >
                {isEN ? 'GO DRAW' : '去抽签'}
              </Link>
            </motion.div>
          )}

          {/* Footer quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className={`text-xs italic ${isDegen ? 'text-gray-500' : 'text-gray-600'}`}>
              {isEN 
                ? '"Those who cannot remember the past are condemned to repeat it." - Your portfolio, probably'
                : '"忘记历史的人注定重蹈覆辙。" —— 你的钱包'
              }
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default GraveyardPage

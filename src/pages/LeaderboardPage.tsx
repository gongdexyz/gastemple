import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame, Award, Zap, Lock, CheckCircle } from 'lucide-react'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'

// Badges data
const BADGES_CN = [
  { id: 'liquidity_provider', name: '流动性贡献者', description: '连抽3个电子垃圾', icon: '💧', rarity: 'rare' },
  { id: 'gas_burner', name: 'Gas费燃烧机', description: '抽签超过50次', icon: '🔥', rarity: 'epic' },
  { id: 'midnight_emo', name: '深夜EMO党', description: '凌晨0-5点抽签', icon: '🌙', rarity: 'rare' },
  { id: 'mountain_watcher', name: '山顶瞭望员', description: '持仓跌幅>95%', icon: '⛰️', rarity: 'legendary' },
  { id: 'industry_lamp', name: '行业冥灯', description: '抽谁谁跌', icon: '💀', rarity: 'legendary' },
]

const BADGES_EN = [
  { id: 'liquidity_provider', name: 'Liquidity Provider', description: '3 trash draws in a row', icon: '💧', rarity: 'rare' },
  { id: 'gas_burner', name: 'Gas Burner', description: 'Draw 50+ times', icon: '🔥', rarity: 'epic' },
  { id: 'midnight_emo', name: 'Midnight EMO', description: 'Draw at 0-5 AM', icon: '🌙', rarity: 'rare' },
  { id: 'mountain_watcher', name: 'Bagholder Elite', description: 'Portfolio -95%', icon: '⛰️', rarity: 'legendary' },
  { id: 'industry_lamp', name: 'Death Touch', description: 'Everything you buy dumps', icon: '💀', rarity: 'legendary' },
]

const MOCK_LEADERBOARD_CN = [
  { rank: 1, name: '0x1234...5678', title: 'Gas费燃烧机', draws: 128, badge: '🔥' },
  { rank: 2, name: '0xabcd...efgh', title: '命不由天·逆行者', draws: 95, badge: '💀' },
  { rank: 3, name: '0x9876...5432', title: '深夜EMO党', draws: 72, badge: '🌙' },
  { rank: 4, name: '0xdead...beef', title: '流动性贡献者', draws: 58, badge: '💧' },
  { rank: 5, name: '0xcafe...babe', title: '山顶瞭望员', draws: 45, badge: '⛰️' },
]

const MOCK_LEADERBOARD_EN = [
  { rank: 1, name: '0x1234...5678', title: 'Gas Burner', draws: 128, badge: '🔥' },
  { rank: 2, name: '0xabcd...efgh', title: 'Fate Defier', draws: 95, badge: '💀' },
  { rank: 3, name: '0x9876...5432', title: 'Midnight EMO', draws: 72, badge: '🌙' },
  { rank: 4, name: '0xdead...beef', title: 'Liquidity Provider', draws: 58, badge: '💧' },
  { rank: 5, name: '0xcafe...babe', title: 'Bagholder Elite', draws: 45, badge: '⛰️' },
]

// NFT Relics
const RELICS = [
  {
    id: 'leek-id',
    tier: 1,
    nameCN: '认证韭菜身份证',
    nameEN: 'Verified Leek ID',
    descCN: '灵魂绑定代币 (SBT) - 证明你是合格的韭菜',
    descEN: 'Soulbound Token (SBT) - Proof of being a certified leek',
    cost: 0,
    costType: 'free',
    icon: '🪪',
    effectCN: '门票资格',
    effectEN: 'Entry ticket',
  },
  {
    id: 'cyber-relic',
    tier: 2,
    nameCN: '赛博舍利子',
    nameEN: 'Cyber Relic',
    descCN: '功德金身 - 修行有成的证明',
    descEN: 'Golden Body - Proof of spiritual cultivation',
    cost: 10000,
    costType: 'merit',
    icon: '💎',
    effectCN: '空投权重 +20%',
    effectEN: '+20% airdrop weight',
  },
  {
    id: 'rug-insurance',
    tier: 3,
    nameCN: '免死金牌',
    nameEN: 'Rug Pull Insurance',
    descCN: '赎罪券 - 可直接兑换空投',
    descEN: 'Indulgence - Directly redeemable for airdrop',
    cost: 50000,
    costType: 'merit',
    icon: '🔥',
    effectCN: 'TGE 时销毁换取大额代币',
    effectEN: 'Burn at TGE for massive token allocation',
  },
]

type TabType = 'leaderboard' | 'relics'

export const LeaderboardPage: React.FC = () => {
  const { mode } = useThemeStore()
  const { badges, totalDraws, history, gdBalance: merit } = useGachaStore()
  const { lang } = useLangStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const BADGES = isEN ? BADGES_EN : BADGES_CN
  const MOCK_LEADERBOARD = isEN ? MOCK_LEADERBOARD_EN : MOCK_LEADERBOARD_CN

  const [activeTab, setActiveTab] = useState<TabType>('leaderboard')
  const [mintedRelics, setMintedRelics] = useState<string[]>(['leek-id'])
  const [mintingRelic, setMintingRelic] = useState<string | null>(null)

  const trashCount = history.filter(h => h.fortune.level === 'N').length
  const casinoCount = history.filter(h => h.fortune.level === 'SSR').length

  const canMint = (relic: typeof RELICS[0]) => {
    if (mintedRelics.includes(relic.id)) return false
    if (relic.costType === 'free') return true
    if (relic.costType === 'merit') return merit >= relic.cost
    return false
  }

  const handleMint = async (relic: typeof RELICS[0]) => {
    if (!canMint(relic) || mintingRelic) return
    setMintingRelic(relic.id)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setMintedRelics(prev => [...prev, relic.id])
    setMintingRelic(null)
  }

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className={`text-2xl font-bold mb-2 flex items-center justify-center gap-2 ${isDegen ? 'text-degen-green font-pixel text-lg' : 'text-goldman-gold'}`}>
              <Trophy className="w-6 h-6" />
              {isEN ? 'LEEK HALL' : '韭菜堂'}
            </h1>
            <p className={`text-sm ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}>
              {isEN ? 'Rankings & Sacred Relics' : '排行榜 & 赛博法器'}
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                activeTab === 'leaderboard'
                  ? isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
                  : isDegen ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Flame className="w-4 h-4" />
              {isEN ? 'Rankings' : '排行榜'}
            </button>
            <button
              onClick={() => setActiveTab('relics')}
              className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                activeTab === 'relics'
                  ? isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
                  : isDegen ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Zap className="w-4 h-4" />
              {isEN ? 'Relics' : '法器'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* My Stats */}
                <div className={`p-4 rounded-xl mb-6 ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
                  <h2 className={`text-lg font-bold mb-4 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                    {isEN ? 'MY STATS' : '我的战绩'}
                  </h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>
                        {totalDraws === 0 ? '—' : totalDraws}
                      </div>
                      <div className="text-xs text-gray-500">
                        {totalDraws === 0 ? (isEN ? 'Pure wallet' : '纯洁钱包') : (isEN ? 'Total Draws' : '总抽签')}
                      </div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${isDegen ? 'text-degen-pink' : 'text-white'}`}>
                        {trashCount === 0 ? '—' : trashCount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {trashCount === 0 ? (isEN ? 'Never rugged' : '没被割过') : (isEN ? 'Rugged' : '归零藏品')}
                      </div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${isDegen ? 'text-degen-cyan' : 'text-white'}`}>
                        {casinoCount === 0 ? '—' : casinoCount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {casinoCount === 0 ? (isEN ? 'No SSR' : '没中过') : (isEN ? 'SSR Wins' : 'SSR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className={`p-4 rounded-xl mb-6 ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className={`w-5 h-5 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
                    <h2 className={`text-lg font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                      {isEN ? 'BADGES (SBT)' : '勋章 (SBT)'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BADGES.map((badge) => {
                      const owned = badges.includes(badge.id)
                      return (
                        <div key={badge.id} className={`p-3 rounded-lg text-center transition-all ${
                          owned 
                            ? isDegen ? 'bg-degen-green/20 border border-degen-green' : 'bg-goldman-gold/20 border border-goldman-gold'
                            : 'bg-gray-800/50 border border-gray-700 opacity-50'
                        }`}>
                          <div className="text-2xl mb-1">{badge.icon}</div>
                          <div className={`text-xs font-medium ${owned ? isDegen ? 'text-degen-green' : 'text-goldman-gold' : 'text-gray-500'}`}>
                            {badge.name}
                          </div>
                          <div className="text-[10px] text-gray-600 mt-1">{badge.description}</div>
                          {owned && (
                            <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 inline-block">
                              ✓ {isEN ? 'OWNED' : '已获得'}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Leaderboard */}
                <div className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className={`w-5 h-5 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
                    <h2 className={`text-lg font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                      {isEN ? 'WEEKLY BURN RANKING' : '本周燃烧榜'}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {MOCK_LEADERBOARD.map((item, index) => (
                      <motion.div 
                        key={item.rank} 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.1 * index }}
                        className={`flex items-center justify-between p-3 rounded-lg ${isDegen ? 'bg-black/20' : 'bg-black/10'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            item.rank <= 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-gray-700 text-gray-400'
                          }`}>
                            {item.rank}
                          </span>
                          <div>
                            <p className="text-sm text-white font-mono">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.badge}</span>
                          <span className={`text-sm font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                            {item.draws}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Relics Tab */}
            {activeTab === 'relics' && (
              <motion.div
                key="relics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Merit Display */}
                <div className={`text-center mb-6 p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-yellow/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
                  <p className="text-sm text-gray-500 mb-1">{isEN ? 'Your Merit' : '你的功德'}</p>
                  <p className={`text-3xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                    {merit.toLocaleString()}
                  </p>
                </div>

                {/* Relics Grid */}
                <div className="grid gap-4">
                  {RELICS.map((relic, i) => {
                    const owned = mintedRelics.includes(relic.id)
                    const minting = mintingRelic === relic.id
                    const affordable = canMint(relic)

                    return (
                      <motion.div
                        key={relic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className={`p-4 rounded-xl ${
                          isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="text-4xl">{relic.icon}</div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold ${
                                relic.tier === 3 ? 'text-orange-400' :
                                relic.tier === 2 ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {isEN ? relic.nameEN : relic.nameCN}
                              </h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded ${
                                relic.tier === 1 ? 'bg-gray-600 text-gray-200' :
                                relic.tier === 2 ? 'bg-yellow-600 text-yellow-100' :
                                'bg-orange-600 text-orange-100'
                              }`}>
                                {relic.tier === 1 ? 'SBT' : relic.tier === 2 ? 'RARE' : 'LEGENDARY'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                              {isEN ? relic.descEN : relic.descCN}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Zap className="w-3 h-3" />
                              {isEN ? relic.effectEN : relic.effectCN}
                            </div>
                          </div>

                          {/* Button */}
                          <div className="flex-shrink-0">
                            {owned ? (
                              <div className="flex items-center gap-1 px-3 py-2 rounded bg-green-900/30 border border-green-500/50 text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                {isEN ? 'OWNED' : '已有'}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleMint(relic)}
                                disabled={!affordable || minting}
                                className={`px-4 py-2 rounded font-bold text-sm transition-all ${
                                  minting 
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 animate-pulse'
                                    : affordable
                                      ? isDegen 
                                        ? 'bg-degen-green/20 text-degen-green border border-degen-green hover:bg-degen-green/30'
                                        : 'bg-goldman-gold/20 text-goldman-gold border border-goldman-gold hover:bg-goldman-gold/30'
                                      : 'bg-gray-700/50 text-gray-500 border border-gray-600 cursor-not-allowed'
                                }`}
                              >
                                {minting ? (
                                  <span>⚡ {isEN ? 'MINTING...' : '开光中...'}</span>
                                ) : relic.costType === 'free' ? (
                                  isEN ? 'CLAIM' : '领取'
                                ) : !affordable ? (
                                  <span className="flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    {relic.cost.toLocaleString()}
                                  </span>
                                ) : (
                                  `🔥 ${relic.cost.toLocaleString()}`
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default LeaderboardPage

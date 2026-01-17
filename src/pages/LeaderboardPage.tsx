import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Award } from 'lucide-react'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'

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

export const LeaderboardPage: React.FC = () => {
  const { mode } = useThemeStore()
  const { badges, totalDraws, history } = useGachaStore()
  const { lang } = useLangStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const BADGES = isEN ? BADGES_EN : BADGES_CN
  const MOCK_LEADERBOARD = isEN ? MOCK_LEADERBOARD_EN : MOCK_LEADERBOARD_CN

  const trashCount = history.filter(h => h.fortune.level === 'N').length
  const casinoCount = history.filter(h => h.fortune.level === 'SSR').length

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className={`text-2xl font-bold mb-2 flex items-center justify-center gap-2 ${isDegen ? 'text-degen-green font-pixel text-lg' : 'text-goldman-gold'}`}>
              <Trophy className="w-6 h-6" />
              {isEN ? 'LEEK HALL OF FAME' : '韭菜名人堂'}
            </h1>
            <p className={`text-sm ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}>{isEN ? 'Honoring every brave Gas contributor' : '记录每一位勇敢的Gas贡献者'}</p>
          </motion.div>

          {/* 个人统计 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`p-4 rounded-xl mb-6 ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
            <h2 className={`text-lg font-bold mb-4 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>{isEN ? 'MY STATS' : '我的战绩'}</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>
                  {totalDraws === 0 ? '—' : totalDraws}
                </div>
                <div className="text-xs text-gray-500">
                  {totalDraws === 0 ? (isEN ? 'Pure as a fresh wallet' : '你纯洁得像个新钱包') : (isEN ? 'Total Draws' : '总抽签次数')}
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDegen ? 'text-degen-pink' : 'text-white'}`}>
                  {trashCount === 0 ? '—' : trashCount}
                </div>
                <div className="text-xs text-gray-500">
                  {trashCount === 0 ? (isEN ? 'Never rugged? Alien?' : '还没被割过？外星人吧') : (isEN ? 'Rugged NFTs' : '归零藏品')}
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDegen ? 'text-degen-cyan' : 'text-white'}`}>
                  {casinoCount === 0 ? '—' : casinoCount}
                </div>
                <div className="text-xs text-gray-500">
                  {casinoCount === 0 ? (isEN ? 'Casino hasn\'t noticed you' : '庄家还没看上你') : (isEN ? 'SSR Wins' : '赌场庄家')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 勋章 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`p-4 rounded-xl mb-6 ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Award className={`w-5 h-5 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
              <h2 className={`text-lg font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>{isEN ? 'SOULBOUND BADGES (SBT)' : '灵魂绑定勋章 (SBT)'}</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">{isEN ? 'Non-transferable on-chain badges of shame' : '不可转移、不可销毁的链上"耻辱勋章"'}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BADGES.map((badge) => {
                const owned = badges.includes(badge.id)
                return (
                  <div key={badge.id} className={`p-3 rounded-lg text-center transition-all ${owned ? isDegen ? 'bg-degen-green/20 border border-degen-green' : 'bg-goldman-gold/20 border border-goldman-gold' : 'bg-gray-800/50 border border-gray-700 opacity-50'}`}>
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className={`text-xs font-medium ${owned ? isDegen ? 'text-degen-green' : 'text-goldman-gold' : 'text-gray-500'}`}>{badge.name}</div>
                    <div className="text-[10px] text-gray-600 mt-1">{badge.description}</div>
                    {owned && <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 inline-block">✓ {isEN ? 'OWNED' : '已获得'}</div>}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* 排行榜 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Flame className={`w-5 h-5 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
              <h2 className={`text-lg font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>{isEN ? 'WEEKLY GAS BURN LEADERBOARD' : '本周Gas燃烧榜'}</h2>
            </div>
            <div className="space-y-2">
              {MOCK_LEADERBOARD.map((item, index) => (
                <motion.div key={item.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }}
                  className={`flex items-center justify-between p-3 rounded-lg ${isDegen ? 'bg-black/20' : 'bg-black/10'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.rank <= 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{item.rank}</span>
                    <div>
                      <p className="text-sm text-white font-mono">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.badge}</span>
                    <span className={`text-sm font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>{item.draws}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default LeaderboardPage

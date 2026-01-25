import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, TrendingUp, Users, Globe, Trophy } from 'lucide-react'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { WoodenFish } from '../components/WoodenFish'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'

const TOP_BURNERS_CN = [
  { rank: 1, address: '7xKXt...4mNq', merits: 88888, title: '赛博活佛' },
  { rank: 2, address: '3pYw2...9kLm', merits: 66666, title: '功德圆满' },
  { rank: 3, address: 'Degen...420x', merits: 42069, title: '虔诚信徒' },
  { rank: 4, address: '9aZx1...7pQr', merits: 31337, title: '善良韭菜' },
  { rank: 5, address: 'Cope...ngMi', merits: 12345, title: '迷途羔羊' },
]

const TOP_BURNERS_EN = [
  { rank: 1, address: '7xKXt...4mNq', merits: 88888, title: 'CYBER BUDDHA' },
  { rank: 2, address: '3pYw2...9kLm', merits: 66666, title: 'KARMA MAXXER' },
  { rank: 3, address: 'Degen...420x', merits: 42069, title: 'BASED BELIEVER' },
  { rank: 4, address: '9aZx1...7pQr', merits: 31337, title: 'REPENTING DEGEN' },
  { rank: 5, address: 'Cope...ngMi', merits: 12345, title: 'LOST SOUL' },
]

export const TemplePage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const TOP_BURNERS = isEN ? TOP_BURNERS_EN : TOP_BURNERS_CN
  const [activeTab, setActiveTab] = useState<'global' | 'players'>('global')

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-3xl font-bold flex items-center justify-center gap-2 ${isDegen ? 'text-degen-green font-pixel text-2xl neon-text' : 'text-goldman-gold'}`}>
              <Flame className="w-7 h-7" />
              {isEN ? 'BURN TEMPLE 🔥' : '功德殿'}
            </h1>
            <p className={`text-base mt-1 ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}>
              {isEN ? 'BURN $GONGDE TO STACK KARMA' : '燃烧 $GONGDE，积累功德'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 左侧：统计 - 手机端隐藏 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`hidden md:block p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className={`w-4 h-4 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
                <h3 className={`font-bold ${isDegen ? 'text-degen-green font-pixel text-xs' : 'text-goldman-gold text-sm'}`}>
                  {isEN ? 'BURN STATS' : '燃烧统计'}
                </h3>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded ${isDegen ? 'bg-degen-yellow/20 text-degen-yellow' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {isEN ? 'DEMO DATA' : '测试数据'}
                </span>
              </div>
              
              <div className="space-y-3">
                {/* 1. 核心区：全网已燃烧（大卡片） */}
                <div className={`p-4 rounded-lg ${isDegen ? 'bg-degen-green/10' : 'bg-goldman-gold/10'}`}>
                  <p className="text-xs text-gray-500">{isEN ? 'TOTAL BURNT' : '全网已燃烧'}</p>
                  <p className={`text-2xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>
                    1,234,567 <span className="text-sm">$GONGDE</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ≈ $15,432 {isEN ? 'USD' : '美元'}
                  </p>
                </div>

                {/* 2. 视觉区：流通量剩余 + 进度条 */}
                <div className={`p-3 rounded-lg ${isDegen ? 'bg-degen-purple/10' : 'bg-blue-900/10'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-500">{isEN ? 'SUPPLY REMAINING' : '流通量剩余'}</p>
                    <p className={`text-lg font-bold ${isDegen ? 'text-degen-cyan' : 'text-blue-400'}`}>
                      87.66%
                    </p>
                  </div>
                  {/* 进度条 */}
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isDegen ? 'bg-gradient-to-r from-degen-green to-degen-cyan' : 'bg-gradient-to-r from-goldman-gold to-yellow-500'}`}
                      style={{ width: '12.34%' }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {isEN ? '12.34% burnt forever 🔥' : '已永久销毁 12.34% 🔥'}
                  </p>
                </div>

                {/* 3. 次要数据区：2x2 网格 */}
                <div className="grid grid-cols-2 gap-2">
                  {/* 左上：今日燃烧 */}
                  <div className={`p-2.5 rounded-lg ${isDegen ? 'bg-degen-pink/10' : 'bg-red-900/10'}`}>
                    <p className="text-[10px] text-gray-500">{isEN ? 'TODAY' : '今日燃烧'}</p>
                    <p className={`text-lg font-bold ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>
                      88,888
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      🔥 <span className="text-green-400">+15%</span>
                    </p>
                  </div>

                  {/* 右上：全网点击 */}
                  <div className={`p-2.5 rounded-lg ${isDegen ? 'bg-degen-yellow/10' : 'bg-orange-900/10'}`}>
                    <p className="text-[10px] text-gray-500">{isEN ? 'TOTAL TAPS' : '全网点击'}</p>
                    <p className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-orange-400'}`}>
                      98.7M
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      🙏 {isEN ? 'Strikes' : '敲击'}
                    </p>
                  </div>

                  {/* 左下：参与人数 */}
                  <div className={`p-2.5 rounded-lg ${isDegen ? 'bg-degen-green/10' : 'bg-green-900/10'}`}>
                    <p className="text-[10px] text-gray-500">{isEN ? 'BURNERS' : '参与人数'}</p>
                    <p className={`text-lg font-bold ${isDegen ? 'text-degen-cyan' : 'text-green-400'}`}>
                      4,269
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span>128 {isEN ? 'online' : '在线'}</span>
                    </p>
                  </div>

                  {/* 右下：单笔燃烧王 */}
                  <div className={`p-2.5 rounded-lg ${isDegen ? 'bg-degen-yellow/10' : 'bg-yellow-900/10'}`}>
                    <p className="text-[10px] text-gray-500 flex items-center gap-0.5">
                      <span>👑</span>
                      <span>{isEN ? 'TOP BURN' : '燃烧王'}</span>
                    </p>
                    <p className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                      10,000
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      0x7a3f...9b2c
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 中间：木鱼 - 手机端全宽 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`md:col-span-1 p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              <WoodenFish />
            </motion.div>

            {/* 右侧：排行榜 - 手机端隐藏 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`hidden md:block p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              {/* 标签切换 */}
              <div className="flex mb-4 border-b ${isDegen ? 'border-degen-green/20' : 'border-gray-700'}">
                <button
                  onClick={() => setActiveTab('global')}
                  className={`flex-1 py-2 text-center text-sm font-bold flex items-center justify-center gap-1 ${
                    activeTab === 'global'
                      ? isDegen ? 'text-degen-green border-b-2 border-degen-green' : 'text-goldman-gold border-b-2 border-goldman-gold'
                      : isDegen ? 'text-gray-500 hover:text-degen-cyan' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  {isEN ? '🌍 GLOBAL' : '🌍 全球'}
                </button>
                <button
                  onClick={() => setActiveTab('players')}
                  className={`flex-1 py-2 text-center text-sm font-bold flex items-center justify-center gap-1 ${
                    activeTab === 'players'
                      ? isDegen ? 'text-degen-yellow border-b-2 border-degen-yellow' : 'text-yellow-500 border-b-2 border-yellow-500'
                      : isDegen ? 'text-gray-500 hover:text-degen-yellow' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Trophy className="w-3 h-3" />
                  {isEN ? '🔥 PLAYERS' : '🔥 玩家'}
                </button>
              </div>
              
              {/* 全球排名内容 */}
              {activeTab === 'global' && (
                <div className="space-y-2">
                  {[
                    { rank: 1, country: '🇨🇳 CN', merits: 1234567, title: isEN ? 'KARMA KING' : '功德之王' },
                    { rank: 2, country: '🇺🇸 US', merits: 987654, title: isEN ? 'BURN MASTER' : '燃烧大师' },
                    { rank: 3, country: '🇯🇵 JP', merits: 765432, title: isEN ? 'ZEN MASTER' : '禅宗大师' },
                    { rank: 4, country: '🇰🇷 KR', merits: 543210, title: isEN ? 'SPEED DEMON' : '速度恶魔' },
                    { rank: 5, country: '🇩🇪 DE', merits: 432109, title: isEN ? 'PRECISION BURN' : '精准燃烧' },
                  ].map((country, i) => (
                    <motion.div
                      key={country.rank}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className={`flex items-center justify-between p-2 rounded-lg ${isDegen ? 'bg-black/20' : 'bg-black/10'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          country.rank === 1 ? 'bg-yellow-500 text-black' :
                          country.rank === 2 ? 'bg-gray-400 text-black' :
                          country.rank === 3 ? 'bg-amber-600 text-black' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {country.rank}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-base">{country.country.split(' ')[0]}</span>
                          <div>
                            <p className={`text-xs font-bold ${isDegen ? 'text-degen-green' : 'text-white'}`}>
                              {country.country.split(' ')[1]}
                            </p>
                            <p className="text-[10px] text-gray-500">{country.title}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                        {country.merits.toLocaleString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* 玩家排名内容 */}
              {activeTab === 'players' && (
                <div className="space-y-2">
                  {TOP_BURNERS.map((burner, i) => (
                    <motion.div
                      key={burner.rank}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className={`flex items-center justify-between p-2 rounded-lg ${isDegen ? 'bg-black/20' : 'bg-black/10'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          burner.rank === 1 ? 'bg-yellow-500 text-black' :
                          burner.rank === 2 ? 'bg-gray-400 text-black' :
                          burner.rank === 3 ? 'bg-amber-600 text-black' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {burner.rank}
                        </span>
                        <div>
                          <p className={`text-xs font-mono ${isDegen ? 'text-degen-green' : 'text-white'}`}>
                            {burner.address}
                          </p>
                          <p className="text-[10px] text-gray-500">{burner.title}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                        {burner.merits.toLocaleString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className={`mt-4 pt-3 border-t ${isDegen ? 'border-degen-green/20' : 'border-gray-700'}`}>
                <p className={`text-xs text-center ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}>
                  {isEN ? '"V me 50 for Buddha bless"' : '"V我50，佛祖保佑"'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* 手机端：折叠的统计和排行榜 */}
          <div className="md:hidden mt-6 space-y-4">
            {/* 简化统计 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500">{isEN ? 'TOTAL' : '全网'}</p>
                  <p className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>1.2M</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{isEN ? 'TODAY' : '今日'}</p>
                  <p className={`text-lg font-bold ${isDegen ? 'text-degen-pink' : 'text-white'}`}>88K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{isEN ? 'USERS' : '人数'}</p>
                  <p className={`text-lg font-bold ${isDegen ? 'text-degen-cyan' : 'text-white'}`}>4.2K</p>
                </div>
              </div>
            </motion.div>

            {/* 移动端排行榜 - 带标签切换 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              {/* 移动端标签切换 */}
              <div className="flex mb-3 border-b ${isDegen ? 'border-degen-green/20' : 'border-gray-700'}">
                <button
                  onClick={() => setActiveTab('global')}
                  className={`flex-1 py-1 text-center text-xs font-bold flex items-center justify-center gap-1 ${
                    activeTab === 'global'
                      ? isDegen ? 'text-degen-green border-b-2 border-degen-green' : 'text-goldman-gold border-b-2 border-goldman-gold'
                      : isDegen ? 'text-gray-500 hover:text-degen-cyan' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  {isEN ? '🌍 GLOBAL' : '🌍 全球'}
                </button>
                <button
                  onClick={() => setActiveTab('players')}
                  className={`flex-1 py-1 text-center text-xs font-bold flex items-center justify-center gap-1 ${
                    activeTab === 'players'
                      ? isDegen ? 'text-degen-yellow border-b-2 border-degen-yellow' : 'text-yellow-500 border-b-2 border-yellow-500'
                      : isDegen ? 'text-gray-500 hover:text-degen-yellow' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Trophy className="w-3 h-3" />
                  {isEN ? '🔥 PLAYERS' : '🔥 玩家'}
                </button>
              </div>
              
              {/* 全球排名内容 */}
              {activeTab === 'global' && (
                <div className="space-y-2">
                  {[
                    { rank: 1, country: '🇨🇳 CN', merits: 1234567 },
                    { rank: 2, country: '🇺🇸 US', merits: 987654 },
                    { rank: 3, country: '🇯🇵 JP', merits: 765432 },
                  ].map((country) => (
                    <div
                      key={country.rank}
                      className={`flex items-center justify-between p-2 rounded-lg ${isDegen ? 'bg-black/20' : 'bg-black/10'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          country.rank === 1 ? 'bg-yellow-500 text-black' :
                          country.rank === 2 ? 'bg-gray-400 text-black' :
                          'bg-amber-600 text-black'
                        }`}>
                          {country.rank}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-base">{country.country.split(' ')[0]}</span>
                          <p className={`text-xs font-bold ${isDegen ? 'text-degen-green' : 'text-white'}`}>
                            {country.country.split(' ')[1]}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                        {(country.merits / 1000).toFixed(0)}K
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 玩家排名内容 */}
              {activeTab === 'players' && (
                <div className="space-y-2">
                  {TOP_BURNERS.slice(0, 3).map((burner) => (
                    <div
                      key={burner.rank}
                      className={`flex items-center justify-between p-2 rounded-lg ${isDegen ? 'bg-black/20' : 'bg-black/10'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          burner.rank === 1 ? 'bg-yellow-500 text-black' :
                          burner.rank === 2 ? 'bg-gray-400 text-black' :
                          'bg-amber-600 text-black'
                        }`}>
                          {burner.rank}
                        </span>
                        <div>
                          <p className={`text-xs font-mono ${isDegen ? 'text-degen-green' : 'text-white'}`}>
                            {burner.address}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                        {(burner.merits / 1000).toFixed(0)}K
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* 底部提示 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-8 text-center p-4 rounded-xl ${isDegen ? 'bg-degen-purple/10 border border-degen-purple/30' : 'bg-gray-800/50 border border-gray-700'}`}
          >
            <p className={`text-sm ${isDegen ? 'text-degen-purple' : 'text-gray-400'}`}>
              💡 {isEN 
                ? 'PRO TIP: HOLD DOWN FOR MAX BURN SPEED. FIRST TO 100K KARMA GETS "CYBER BUDDHA" TITLE!' 
                : '提示：长按木鱼可连续积德。率先达到10万功德者将获得"赛博活佛"称号！'
              }
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default TemplePage

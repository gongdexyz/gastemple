import React from 'react'
import { motion } from 'framer-motion'
import { Flame, TrendingUp, Users } from 'lucide-react'
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
            <h1 className={`text-2xl font-bold flex items-center justify-center gap-2 ${isDegen ? 'text-degen-green font-pixel text-xl neon-text' : 'text-goldman-gold'}`}>
              <Flame className="w-6 h-6" />
              {isEN ? 'BURN TEMPLE 🔥' : '功德殿'}
            </h1>
            <p className={`text-sm mt-1 ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}>
              {isEN ? 'BURN $GD TO STACK KARMA' : '燃烧 $GD，积累功德'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 左侧：统计 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className={`w-4 h-4 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
                <h3 className={`font-bold ${isDegen ? 'text-degen-green font-pixel text-xs' : 'text-goldman-gold text-sm'}`}>
                  {isEN ? 'BURN STATS' : '燃烧统计'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${isDegen ? 'bg-degen-green/10' : 'bg-goldman-gold/10'}`}>
                  <p className="text-xs text-gray-500">{isEN ? 'TOTAL BURNT' : '全网已燃烧'}</p>
                  <p className={`text-xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>
                    1,234,567 <span className="text-xs">$GD</span>
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDegen ? 'bg-degen-green/10' : 'bg-goldman-gold/10'}`}>
                  <p className="text-xs text-gray-500">{isEN ? 'TODAY' : '今日燃烧'}</p>
                  <p className={`text-xl font-bold ${isDegen ? 'text-degen-pink' : 'text-white'}`}>
                    88,888 <span className="text-xs">$GD</span>
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDegen ? 'bg-degen-green/10' : 'bg-goldman-gold/10'}`}>
                  <p className="text-xs text-gray-500">{isEN ? 'BURNERS' : '参与人数'}</p>
                  <p className={`text-xl font-bold ${isDegen ? 'text-degen-cyan' : 'text-white'}`}>
                    4,269
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 中间：木鱼 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              <WoodenFish />
            </motion.div>

            {/* 右侧：排行榜 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className={`w-4 h-4 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
                <h3 className={`font-bold ${isDegen ? 'text-degen-green font-pixel text-xs' : 'text-goldman-gold text-sm'}`}>
                  {isEN ? 'TOP BURNERS 🔥' : '大善人榜'}
                </h3>
              </div>
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

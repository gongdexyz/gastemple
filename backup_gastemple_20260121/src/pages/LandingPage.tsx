import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, TrendingUp, Users, Zap, ChevronRight, Globe } from 'lucide-react'
import { useLangStore } from '../stores/langStore'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { lang, toggleLang } = useLangStore()
  const isEN = lang === 'en'
  const [isHovering, setIsHovering] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)

  // 0.8秒后自动进入真正页面
  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnter()
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    setGlitchActive(true)
    setTimeout(() => {
      navigate('/gacha')
    }, 800)
  }

  const features = isEN ? [
    { icon: Shield, title: 'Institutional Grade', desc: 'Battle-tested smart contracts' },
    { icon: TrendingUp, title: 'Sustainable Yields', desc: 'Algorithmic reward distribution' },
    { icon: Users, title: '100K+ Users', desc: 'Growing community of believers' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Sub-second transaction finality' },
  ] : [
    { icon: Shield, title: '机构级安全', desc: '经过实战检验的智能合约' },
    { icon: TrendingUp, title: '可持续收益', desc: '算法化收益分配机制' },
    { icon: Users, title: '10万+用户', desc: '不断壮大的信仰者社区' },
    { icon: Zap, title: '闪电速度', desc: '亚秒级交易确认' },
  ]

  const partners = ['a]6z', 'Paradigm', 'Sequoia', 'Binance Labs', 'Coinbase Ventures']

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden ${glitchActive ? 'animate-pulse' : ''}`}>
      {/* Glitch overlay - 赛博故障特效 */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black overflow-hidden"
          >
            {/* 故障条纹 - 横向 */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-4 bg-[#00ff41]"
                style={{ top: `${10 + i * 12}%` }}
                initial={{ scaleX: 0, x: '-100%' }}
                animate={{ 
                  scaleX: [0, 1, 1, 0],
                  x: ['-100%', '0%', '0%', '100%'],
                  opacity: [0, 0.8, 0.6, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: 'easeInOut'
                }}
              />
            ))}
            {/* RGB 色差效果 */}
            <motion.div 
              className="absolute inset-0 bg-red-500/30"
              animate={{ x: [-5, 5, -3, 0], opacity: [0, 0.5, 0.3, 0] }}
              transition={{ duration: 0.4 }}
            />
            <motion.div 
              className="absolute inset-0 bg-cyan-500/30"
              animate={{ x: [5, -5, 3, 0], opacity: [0, 0.5, 0.3, 0] }}
              transition={{ duration: 0.4, delay: 0.05 }}
            />
            {/* 绿色闪烁 */}
            <motion.div 
              className="absolute inset-0 bg-[#00ff41]/30"
              animate={{ opacity: [0, 1, 0, 0.5, 0, 0.8, 0] }}
              transition={{ duration: 0.8 }}
            />
            {/* 中心图标 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1.5, 0],
                  rotate: [0, -10, 10, 360],
                  opacity: [1, 1, 1, 0],
                  filter: ['blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(10px)']
                }}
                transition={{ duration: 0.8 }}
                className="text-8xl drop-shadow-[0_0_30px_#00ff41]"
              >
                ⛩️
              </motion.div>
            </div>
            {/* 扫描线 */}
            <div className="absolute inset-0 scanlines opacity-70" />
            {/* 黑屏闪烁 */}
            <motion.div
              className="absolute inset-0 bg-black"
              animate={{ opacity: [0, 1, 0, 1, 0, 0] }}
              transition={{ duration: 0.8, times: [0, 0.1, 0.15, 0.2, 0.25, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛩️</span>
            <span className="font-semibold text-lg tracking-tight">Gas Temple</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              LIVE
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">{isEN ? 'Products' : '产品'}</a>
            <a href="#" className="hover:text-white transition-colors">{isEN ? 'Docs' : '文档'}</a>
            <a href="#" className="hover:text-white transition-colors">{isEN ? 'Community' : '社区'}</a>
            <a href="#" className="hover:text-white transition-colors">{isEN ? 'Careers' : '招聘'}</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              {isEN ? 'EN' : '中文'}
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-slate-200 transition-colors">
              {isEN ? 'Launch App' : '启动应用'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">
                {isEN ? 'Now live on Solana' : '现已上线 Solana'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            {isEN ? (
              <>
                <span className="text-slate-300">The Future of</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Decentralized Finance
                </span>
              </>
            ) : (
              <>
                <span className="text-slate-300">去中心化金融的</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  未来已来
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-xl text-slate-400 max-w-2xl mx-auto mb-12"
          >
            {isEN 
              ? 'Unlock unprecedented yield opportunities through our revolutionary karma-based staking protocol. Backed by top-tier investors.'
              : '通过我们革命性的功德质押协议，解锁前所未有的收益机会。顶级投资机构背书。'
            }
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-20"
          >
            <motion.button
              onClick={handleEnter}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isEN ? 'Enter Temple' : '进入道场'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500"
                initial={{ x: '100%' }}
                animate={{ x: isHovering ? '0%' : '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <button className="px-8 py-4 text-lg font-medium border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
              {isEN ? 'Read Whitepaper' : '阅读白皮书'}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-20"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">$2.4B</div>
              <div className="text-sm text-slate-500">{isEN ? 'Total Value Locked' : '总锁仓价值'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">847%</div>
              <div className="text-sm text-slate-500">{isEN ? 'Max APY' : '最高年化'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">0</div>
              <div className="text-sm text-slate-500">{isEN ? 'Exploits' : '安全事故'}</div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-slate-500 mb-6">{isEN ? 'BACKED BY' : '投资机构'}</p>
            <div className="flex flex-wrap justify-center gap-8">
              {partners.map((partner, i) => (
                <div
                  key={i}
                  className="text-xl font-semibold text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
                >
                  {partner}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>⛩️</span>
            <span>© 2024 Gas Temple. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Mirror</a>
          </div>
        </div>
      </footer>

      {/* Subtle disclaimer that hints at the joke */}
      <div className="fixed bottom-4 left-4 text-[10px] text-slate-700 max-w-xs leading-relaxed">
        {isEN 
          ? '* Past performance does not guarantee future results. This is not financial advice. DYOR. NFA. WAGMI (maybe).'
          : '* 过往业绩不代表未来收益。本站不构成投资建议。DYOR。NFA。WAGMI（也许吧）。'
        }
      </div>
    </div>
  )
}

export default LandingPage

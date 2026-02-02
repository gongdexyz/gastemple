import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Users, Globe, Trophy, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { WoodenFish } from '../components/WoodenFish'
import { VisualEffectsOverlay } from '../components/VisualEffectsOverlay'
import { NewbieRewards } from '../components/NewbieRewards'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { useEffectsStore } from '../stores/effectsStore'
import { useGachaStore } from '../stores/gachaStore'
import { priceService } from '../services/priceService'

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

// SKR 通缩模拟器状态接口
interface SimulatorState {
  totalSkrBuyback: number
  dailySkrBuyback: number
  believers: number
  deflationProgress: number
  lastInteractionBoost: number
}

interface TokenPrices {
  skr: number
  gongde: number
  loading: boolean
  error: string | null
}

export const TemplePage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const { targetFlash, criticalFlash } = useEffectsStore()
  const { gdBalance } = useGachaStore()
  const navigate = useNavigate()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const TOP_BURNERS = isEN ? TOP_BURNERS_EN : TOP_BURNERS_CN
  const [activeTab, setActiveTab] = useState<'global' | 'players'>('global')
  
  // SKR 通缩模拟器状态
  const [simulator, setSimulator] = useState<SimulatorState>({
    totalSkrBuyback: 10240.56,
    dailySkrBuyback: 888.23,
    believers: 4269,
    deflationProgress: 87.66,
    lastInteractionBoost: 0
  })
  
  const [flashBoost, setFlashBoost] = useState(false)
  const [prices, setPrices] = useState<TokenPrices>({
    skr: 0,
    gongde: 0,
    loading: true,
    error: null,
  })
  
  // 追踪上一次的余额，用于计算收入
  const [lastGdBalance, setLastGdBalance] = useState(gdBalance)
  
  // 心跳增长：每秒自动增加
  useEffect(() => {
    const heartbeat = setInterval(() => {
      setSimulator(prev => ({
        ...prev,
        totalSkrBuyback: prev.totalSkrBuyback + 0.01,
        dailySkrBuyback: prev.dailySkrBuyback + 0.005,
        believers: prev.believers + (Math.random() < 0.1 ? 1 : 0),
        deflationProgress: Math.min(99.99, prev.deflationProgress + 0.001)
      }))
    }, 1000)
    
    return () => clearInterval(heartbeat)
  }, [])
  
  // 监听 GD 余额变化 - 追踪 24h 收入（玩家获得的 GONGDE，换算成 SKR）
  useEffect(() => {
    // 当余额增加时，说明玩家获得了奖励
    if (gdBalance > lastGdBalance) {
      const earnedGongde = gdBalance - lastGdBalance
      
      // 将 GONGDE 换算成 SKR（用于显示通缩增加量）
      const gongdePrice = prices.gongde || 0.00029600
      const skrPrice = prices.skr || 0.029600
      const usdValue = earnedGongde * gongdePrice
      const earnedSkr = usdValue / skrPrice
      
      setSimulator(prev => ({
        ...prev,
        dailySkrBuyback: prev.dailySkrBuyback + earnedGongde, // 累计获得的 GONGDE（用于24h收入显示）
        lastInteractionBoost: earnedSkr // 换算成 SKR 后的数量（用于通缩增加显示）
      }))
      
      setFlashBoost(true)
      setTimeout(() => setFlashBoost(false), 500)
    }
    
    setLastGdBalance(gdBalance)
  }, [gdBalance, lastGdBalance, prices])
  
  // 监听能量传输特效 - 计算 SKR 回购（基于消耗）
  useEffect(() => {
    let isCalculating = false
    
    // 订阅 effectsStore 的粒子变化
    const unsubscribe = useEffectsStore.subscribe((state, prevState) => {
      // 当有新粒子产生时，说明有消耗发生
      if (state.particles.length > prevState.particles.length && !isCalculating) {
        isCalculating = true
        
        const gongdePrice = prices.gongde || 0.00029600
        const skrPrice = prices.skr || 0.029600
        const burnCost = 100 // 每次消耗 100 GONGDE
        
        // 计算 SKR 回购量（用于预计 SKR 回购）
        const usdValue = burnCost * gongdePrice
        const skrBuyback = usdValue / skrPrice
        
        setSimulator(prev => ({
          ...prev,
          totalSkrBuyback: prev.totalSkrBuyback + skrBuyback,
          deflationProgress: Math.min(99.99, prev.deflationProgress + 0.01)
        }))
        
        // 200ms 后允许下一次计算（防止暴击的 5 个粒子重复计算）
        setTimeout(() => {
          isCalculating = false
        }, 200)
      }
    })
    
    return () => unsubscribe()
  }, [prices])
  
  // 获取价格
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setPrices(prev => ({ ...prev, loading: true, error: null }))
        const tokenPrices = await priceService.getBothPrices()
        
        setPrices({
          skr: tokenPrices.skr,
          gongde: tokenPrices.gongde,
          loading: false,
          error: null,
        })
      } catch (error) {
        setPrices(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '获取价格失败',
        }))
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      <VisualEffectsOverlay />
      <NewbieRewards onClose={() => {}} />
      
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
            {/* 左侧：SKR 通缩统计 - 手机端隐藏 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              data-skr-panel
              className={`hidden md:block p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              {/* 标题 */}
              <div className="mb-3">
                <h3 className={`text-sm font-bold ${isDegen ? 'text-degen-green font-pixel' : 'text-green-400'}`}>
                  {isEN ? '🔥 SKR DEFLATION' : '🔥 SKR 通缩'}
                </h3>
                <div className={`text-[10px] mt-1 ${isDegen ? 'text-degen-cyan' : 'text-gray-400'}`}>
                  {isEN ? '🧪 Hackathon Sim' : '🧪 黑客松模拟'}
                </div>
              </div>

              {/* 核心指标：预计 SKR 回购量 */}
              <motion.div 
                className={`mb-3 p-3 rounded-lg relative ${isDegen ? 'bg-degen-green/10 border border-degen-green/30' : 'bg-green-900/40 border border-green-500/30'}`}
              >
                <h4 className="text-[10px] font-bold text-gray-400 mb-1">
                  {isEN ? '💰 Est. SKR Buyback' : '💰 预计 SKR 回购'}
                </h4>
                <div className="flex items-baseline gap-1 relative">
                  <motion.div 
                    className={`text-xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-green-400'}`}
                  >
                    {simulator.totalSkrBuyback.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </motion.div>
                  <div className="text-xs text-gray-400">SKR</div>
                  
                  {/* 增加数值显示在右边 - 使用绝对定位避免影响布局 */}
                  <AnimatePresence>
                    {flashBoost && simulator.lastInteractionBoost > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`absolute right-0 top-0 text-sm font-bold ${isDegen ? 'text-degen-green' : 'text-green-300'}`}
                        style={{ pointerEvents: 'none' }}
                      >
                        +{simulator.lastInteractionBoost.toFixed(2)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  ≈ ${(simulator.totalSkrBuyback * prices.skr).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
              </motion.div>

              {/* 国库通缩进度 */}
              <div className={`mb-3 p-2.5 rounded-lg ${isDegen ? 'bg-degen-cyan/10' : 'bg-gray-800'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`text-[10px] font-bold ${isDegen ? 'text-degen-cyan' : 'text-cyan-400'}`}>
                    {isEN ? '📊 Deflation' : '📊 通缩进度'}
                  </h4>
                  <span className={`text-sm font-bold ${isDegen ? 'text-degen-cyan' : 'text-cyan-400'}`}>
                    {simulator.deflationProgress.toFixed(2)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isDegen ? 'bg-gradient-to-r from-degen-cyan to-degen-green' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${simulator.deflationProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="text-[9px] text-gray-400 mt-1">
                  {isEN 
                    ? `${(100 - simulator.deflationProgress).toFixed(2)}% to halving`
                    : `距减产 ${(100 - simulator.deflationProgress).toFixed(2)}%`
                  }
                </div>
              </div>

              {/* 24h 协议收入 */}
              <motion.div 
                data-revenue-target
                className={`mb-3 p-2.5 rounded-lg ${isDegen ? 'bg-degen-yellow/10' : 'bg-gray-800'} relative overflow-hidden`}
                animate={flashBoost ? { backgroundColor: isDegen ? ['rgba(250, 204, 21, 0.1)', 'rgba(250, 204, 21, 0.2)', 'rgba(250, 204, 21, 0.1)'] : ['#1f2937', '#374151', '#1f2937'] } : {}}
              >
                {/* 金色透明遮罩 - 普通受击效果 */}
                <AnimatePresence>
                  {targetFlash && !criticalFlash && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0.4, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, times: [0, 0.2, 0.5, 1] }}
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400/60 via-amber-500/40 to-yellow-300/60 pointer-events-none z-10"
                      style={{
                        boxShadow: 'inset 0 0 30px rgba(255, 215, 0, 0.8)',
                        backdropFilter: 'blur(2px)'
                      }}
                    />
                  )}
                </AnimatePresence>
                
                {/* 暴击遮罩 - 更强烈更持久 */}
                <AnimatePresence>
                  {criticalFlash && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.9, 0.7, 0.5, 0.3, 0],
                        scale: [1, 1.05, 1.02, 1]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 2,
                        times: [0, 0.1, 0.3, 0.6, 0.8, 1],
                        scale: {
                          duration: 0.5,
                          times: [0, 0.3, 0.6, 1]
                        }
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 via-amber-400/60 to-yellow-200/80 pointer-events-none z-10"
                      style={{
                        boxShadow: 'inset 0 0 50px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 215, 0, 0.8)',
                        backdropFilter: 'blur(3px)'
                      }}
                    >
                      {/* 暴击粒子效果 */}
                      <motion.div
                        animate={{
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 2,
                          ease: "linear"
                        }}
                        className="absolute inset-0"
                      >
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                              x: [0, Math.cos(i * Math.PI / 4) * 40],
                              y: [0, Math.sin(i * Math.PI / 4) * 40]
                            }}
                            transition={{
                              duration: 1,
                              delay: i * 0.1,
                              repeat: 1
                            }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <h4 className={`text-[10px] font-bold mb-1 ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'} relative z-20`}>
                  {isEN ? '⚡ 24h Revenue' : '⚡ 24h 收入'}
                </h4>
                <div className="flex justify-between items-center relative z-20">
                  <div>
                    <div className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                      +{simulator.dailySkrBuyback.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[9px] text-gray-400">
                      ≈ ${(simulator.dailySkrBuyback * prices.gongde).toFixed(2)}
                    </div>
                  </div>
                  <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isDegen ? 'bg-degen-green/20 text-degen-green' : 'bg-green-900/30 text-green-400'}`}>
                    🔥 {isEN ? 'Burned' : '已燃烧'}
                  </div>
                </div>
              </motion.div>

              {/* 信徒数量 */}
              <div className={`mb-3 p-2.5 rounded-lg ${isDegen ? 'bg-degen-purple/10' : 'bg-gray-800'}`}>
                <h4 className={`text-[10px] font-bold mb-1 ${isDegen ? 'text-degen-purple' : 'text-purple-400'}`}>
                  {isEN ? '👥 Believers' : '👥 信徒'}
                </h4>
                <div className="flex justify-between items-center">
                  <div className={`text-lg font-bold ${isDegen ? 'text-degen-purple' : 'text-purple-400'}`}>
                    {simulator.believers.toLocaleString()}
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDegen ? 'bg-degen-green' : 'bg-green-400'}`}></span>
                    {isEN ? 'Mining' : '祈福中'}
                  </div>
                </div>
              </div>

              {/* 实时价格 */}
              <div className={`p-2.5 rounded-lg ${isDegen ? 'bg-black/20' : 'bg-gray-800'}`}>
                <h4 className="text-[10px] font-bold text-gray-400 mb-2">
                  {isEN ? '💰 Live Prices' : '💰 实时价格'}
                </h4>
                {prices.loading ? (
                  <div className="text-gray-500 text-[10px]">{isEN ? 'Loading...' : '加载中...'}</div>
                ) : prices.error ? (
                  <div className="text-red-400 text-[10px]">{prices.error}</div>
                ) : (
                  <div className="space-y-1.5 text-[10px]">
                    <div className={`flex justify-between items-center p-1.5 rounded ${isDegen ? 'bg-black/30' : 'bg-gray-900/50'}`}>
                      <span className="text-gray-300">🔍 SKR</span>
                      <span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                        ${prices.skr.toFixed(6)}
                      </span>
                    </div>
                    
                    <div className={`flex justify-between items-center p-1.5 rounded ${isDegen ? 'bg-black/30' : 'bg-gray-900/50'}`}>
                      <span className="text-gray-300">🙏 GD</span>
                      <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                        ${prices.gongde.toFixed(8)}
                      </span>
                    </div>
                  </div>
                )}
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
            {/* SKR 通缩统计 - 移动端 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-4 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}
            >
              <h3 className={`text-sm font-bold mb-3 ${isDegen ? 'text-degen-green font-pixel' : 'text-green-400'}`}>
                {isEN ? '🔥 SKR DEFLATION' : '🔥 SKR 通缩'}
              </h3>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500">{isEN ? 'BUYBACK' : '回购'}</p>
                  <p className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-green-400'}`}>
                    {(simulator.totalSkrBuyback / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{isEN ? '24H' : '24小时'}</p>
                  <p className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                    {simulator.dailySkrBuyback.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{isEN ? 'USERS' : '信徒'}</p>
                  <p className={`text-lg font-bold ${isDegen ? 'text-degen-purple' : 'text-purple-400'}`}>
                    {(simulator.believers / 1000).toFixed(1)}K
                  </p>
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

      {/* 浮动按钮 - 算一卦 */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/gacha')}
        className={`
          fixed bottom-8 right-8 z-50
          w-16 h-16 md:w-20 md:h-20
          rounded-full shadow-2xl
          flex flex-col items-center justify-center
          font-bold text-sm md:text-base
          transition-all duration-300
          ${isDegen 
            ? 'bg-gradient-to-br from-degen-purple via-degen-pink to-degen-purple text-white border-2 border-degen-cyan shadow-degen-purple/50' 
            : 'bg-gradient-to-br from-goldman-gold via-yellow-500 to-goldman-gold text-black border-2 border-yellow-300 shadow-goldman-gold/50'
          }
          hover:shadow-xl
          animate-pulse
        `}
      >
        <Sparkles className="w-6 h-6 md:w-7 md:h-7 mb-0.5" />
        <span className="text-xs md:text-sm whitespace-nowrap">
          {isEN ? 'Draw' : '算一卦'}
        </span>
      </motion.button>
    </div>
  )
}

export default TemplePage

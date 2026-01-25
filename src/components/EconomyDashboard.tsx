import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { priceService } from '../services/priceService'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'

interface TokenPrices {
  skr: number
  gongde: number
  sol: number
  loading: boolean
  error: string | null
}

interface EconomyStats {
  // 冥想模式
  meditationManualRate: number
  meditationManualMin: number
  meditationManualMax: number
  meditationManualAvg: number
  meditationManualHourly: number
  
  // 代敲模式
  autoClickRate: number
  autoClickMin: number
  autoClickMax: number
  autoClickAvg: number
  autoClickHourly: number
  
  // 功德模式
  meritBurnCost: number
  meritCritRate: number
  
  // 兑换比例
  gdToSkrRate: number
  skrToGdRate: number
  
  // 代敲价格
  autoClickPrices: {
    meditation: number[]
    merit: number[]
  }
}

// SKR 通缩模拟器状态
interface SimulatorState {
  totalSkrBuyback: number // 累计回购 SKR
  dailySkrBuyback: number // 24h 回购
  believers: number // 信徒数量
  deflationProgress: number // 通缩进度
  lastInteractionBoost: number // 上次互动增量
}

export const EconomyDashboard: React.FC = () => {
  const { gdBalance } = useGachaStore()
  const { lang } = useLangStore()
  const isEN = lang === 'en'
  
  const [showDashboard, setShowDashboard] = useState(false)
  const [prices, setPrices] = useState<TokenPrices>({
    skr: 0,
    gongde: 0,
    sol: 0,
    loading: true,
    error: null,
  })
  
  // SKR 通缩模拟器状态
  const [simulator, setSimulator] = useState<SimulatorState>({
    totalSkrBuyback: 10240.56, // 基数：看起来已经有一些测试用户
    dailySkrBuyback: 888.23,
    believers: 4269,
    deflationProgress: 87.66,
    lastInteractionBoost: 0
  })
  
  const [flashBoost, setFlashBoost] = useState(false) // 互动暴击闪烁效果

  // 从环境变量读取经济参数
  const stats: EconomyStats = {
    meditationManualRate: parseFloat(import.meta.env.VITE_MEDITATION_MANUAL_RATE || '0.20'),
    meditationManualMin: parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MIN || '5'),
    meditationManualMax: parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MAX || '15'),
    meditationManualAvg: (parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MIN || '5') + parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MAX || '15')) / 2,
    meditationManualHourly: 0, // 计算后填充
    
    autoClickRate: parseFloat(import.meta.env.VITE_AUTO_CLICK_REWARD_RATE || '0.02'),
    autoClickMin: parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MIN || '1'),
    autoClickMax: parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MAX || '5'),
    autoClickAvg: (parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MIN || '1') + parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MAX || '5')) / 2,
    autoClickHourly: 0, // 计算后填充
    
    meritBurnCost: 100,
    meritCritRate: 0.04,
    
    gdToSkrRate: parseFloat(import.meta.env.VITE_GD_TO_SKR_RATE || '100'),
    skrToGdRate: parseFloat(import.meta.env.VITE_SKR_TO_GD_RATE || '50'),
    
    autoClickPrices: {
      meditation: [33, 58, 108],
      merit: [165, 290, 540]
    }
  }

  // 计算每小时产出
  stats.meditationManualHourly = Math.floor(300 * stats.meditationManualRate * stats.meditationManualAvg)
  stats.autoClickHourly = Math.floor(3600 * stats.autoClickRate * stats.autoClickAvg)
  
  // 心跳增长：每秒自动增加（模拟其他玩家）
  useEffect(() => {
    const heartbeat = setInterval(() => {
      setSimulator(prev => ({
        ...prev,
        totalSkrBuyback: prev.totalSkrBuyback + 0.01,
        dailySkrBuyback: prev.dailySkrBuyback + 0.005,
        believers: prev.believers + (Math.random() < 0.1 ? 1 : 0), // 10% 概率增加信徒
        deflationProgress: Math.min(99.99, prev.deflationProgress + 0.001)
      }))
    }, 1000)
    
    return () => clearInterval(heartbeat)
  }, [])
  
  // 监听用户互动（点击木鱼或购买代敲）
  useEffect(() => {
    const handleUserInteraction = () => {
      // 互动暴击：数字猛增
      const boost = Math.random() * 50 + 50 // 50-100 SKR
      setSimulator(prev => ({
        ...prev,
        totalSkrBuyback: prev.totalSkrBuyback + boost,
        dailySkrBuyback: prev.dailySkrBuyback + boost * 0.5,
        deflationProgress: Math.min(99.99, prev.deflationProgress + 0.5),
        lastInteractionBoost: boost
      }))
      
      // 触发闪烁效果
      setFlashBoost(true)
      setTimeout(() => setFlashBoost(false), 500)
    }
    
    // 监听点击事件（简化版，实际应该监听木鱼组件的事件）
    window.addEventListener('click', handleUserInteraction)
    return () => window.removeEventListener('click', handleUserInteraction)
  }, [])

  // 获取价格
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setPrices(prev => ({ ...prev, loading: true, error: null }))
        
        // 获取 SKR 和 GONGDE 价格
        const tokenPrices = await priceService.getBothPrices()
        
        // 获取 SOL 价格（先尝试 CoinGecko，失败则用币安）
        let solPrice = 0
        try {
          // 尝试 CoinGecko
          const solResponse = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
            {
              headers: {
                'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY || ''
              }
            }
          )
          if (solResponse.ok) {
            const solData = await solResponse.json()
            solPrice = solData.solana?.usd || 0
          }
        } catch (error) {
          console.log('CoinGecko failed for SOL, trying Binance')
        }

        // 如果 CoinGecko 失败，尝试币安
        if (solPrice === 0) {
          try {
            const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT')
            const binanceData = await binanceResponse.json()
            solPrice = parseFloat(binanceData.price)
          } catch (error) {
            console.error('Failed to fetch SOL price from Binance:', error)
            // 使用默认价格
            solPrice = 150.0
          }
        }
        
        setPrices({
          skr: tokenPrices.skr,
          gongde: tokenPrices.gongde,
          sol: solPrice,
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
    const interval = setInterval(fetchPrices, 60000) // 每分钟更新
    return () => clearInterval(interval)
  }, [])

  // 计算 USD 价值
  const calculateUSD = (gdAmount: number) => {
    return (gdAmount * prices.gongde).toFixed(4)
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* 折叠按钮 */}
      <motion.button
        onClick={() => setShowDashboard(!showDashboard)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-sm"
      >
        {showDashboard ? (isEN ? '📊 Hide' : '📊 隐藏') : (isEN ? '🔥 SKR Deflation' : '🔥 SKR 通缩')}
      </motion.button>

      {/* 面板 */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 left-0 w-[420px] bg-gray-900 border-2 border-green-500 rounded-lg shadow-2xl p-4 max-h-[600px] overflow-y-auto"
          >
            {/* 标题 */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-green-400">
                {isEN ? '🔥 SKR Deflation Engine' : '🔥 SKR 通缩引擎'}
              </h3>
              <div className="text-xs text-gray-400 mt-1">
                {isEN ? '🧪 Hackathon Simulation Network' : '🧪 黑客松模拟网'}
              </div>
            </div>

            {/* 核心指标：预计 SKR 回购量 */}
            <motion.div 
              className="mb-4 p-4 bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-500 rounded-lg"
              animate={flashBoost ? { scale: [1, 1.02, 1], borderColor: ['#10b981', '#22c55e', '#10b981'] } : {}}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xs font-bold text-gray-400 mb-2">
                {isEN ? '💰 Est. SKR Buyback' : '💰 预计 SKR 回购量'}
              </h4>
              <div className="flex items-baseline gap-2">
                <motion.div 
                  className="text-3xl font-bold text-green-400"
                  animate={flashBoost ? { scale: [1, 1.1, 1] } : {}}
                >
                  {simulator.totalSkrBuyback.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>
                <div className="text-sm text-gray-400">SKR</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ≈ ${(simulator.totalSkrBuyback * prices.skr).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                <span className="text-gray-600 ml-1">
                  ({isEN ? 'Based on Current Price' : '基于当前价格'})
                </span>
              </div>
              
              {/* 互动反馈提示 */}
              {flashBoost && simulator.lastInteractionBoost > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-xs text-green-300 font-bold"
                >
                  +{simulator.lastInteractionBoost.toFixed(2)} SKR {isEN ? 'from your action!' : '来自你的操作！'}
                </motion.div>
              )}
            </motion.div>

            {/* 国库通缩进度 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-cyan-400">
                  {isEN ? '📊 Deflation Progress' : '📊 国库通缩进度'}
                </h4>
                <span className="text-lg font-bold text-cyan-400">
                  {simulator.deflationProgress.toFixed(2)}%
                </span>
              </div>
              
              {/* 进度条 */}
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${simulator.deflationProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                {isEN 
                  ? `${(100 - simulator.deflationProgress).toFixed(2)}% until next halving`
                  : `距离下一轮减产还有 ${(100 - simulator.deflationProgress).toFixed(2)}%`
                }
              </div>
            </div>

            {/* 24h 协议收入 */}
            <motion.div 
              className="mb-4 p-3 bg-gray-800 rounded-lg"
              animate={flashBoost ? { backgroundColor: ['#1f2937', '#374151', '#1f2937'] } : {}}
            >
              <h4 className="text-xs font-bold text-yellow-400 mb-2">
                {isEN ? '⚡ 24h Protocol Revenue' : '⚡ 24h 协议收入'}
              </h4>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    +{simulator.dailySkrBuyback.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SKR
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ≈ ${(simulator.dailySkrBuyback * prices.skr).toFixed(2)} USD
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-400 font-bold px-2 py-1 bg-green-900/30 rounded">
                    🔥 {isEN ? 'All for Buyback' : '全部用于回购'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 信徒数量 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-xs font-bold text-purple-400 mb-2">
                {isEN ? '👥 Believers' : '👥 信徒数量'}
              </h4>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-purple-400">
                  {simulator.believers.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {isEN ? 'Mining for SKR' : '正在为 SKR 祈福'}
                </div>
              </div>
            </div>

            {/* 实时价格 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-bold text-gray-400 mb-2">
                {isEN ? '💰 Live Prices' : '💰 实时市价'}
              </h4>
              {prices.loading ? (
                <div className="text-gray-500 text-sm">{isEN ? 'Loading...' : '加载中...'}</div>
              ) : prices.error ? (
                <div className="text-red-400 text-sm">{prices.error}</div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      <span className="text-gray-300 font-bold">SKR</span>
                    </div>
                    <span className="text-green-400 font-bold text-lg">
                      ${prices.skr.toFixed(6)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🙏</span>
                      <span className="text-gray-300 font-bold">GONGDE</span>
                    </div>
                    <span className="text-yellow-400 font-bold text-lg">
                      ${prices.gongde.toFixed(8)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{isEN ? 'Exchange Rate:' : '汇率:'}</span>
                      <span className="text-cyan-400 font-bold">
                        1 SKR = {prices.gongde > 0 ? (prices.skr / prices.gongde).toFixed(0) : '0'} GD
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 生态贡献说明 */}
            <div className="p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg">
              <h4 className="text-sm font-bold text-green-400 mb-2">
                {isEN ? '💡 Ecological Impact' : '💡 生态贡献预览'}
              </h4>
              <div className="space-y-1 text-xs text-gray-300">
                <div>
                  {isEN 
                    ? '• With 1000 daily active users'
                    : '• 仅需 1000 名日活用户'
                  }
                </div>
                <div>
                  {isEN
                    ? '• Protocol can buyback 500-1000 SKR daily'
                    : '• 每天可从市场回购 500-1000 SKR'
                  }
                </div>
                <div className="text-green-400 font-bold">
                  {isEN
                    ? '• Creating a liquidity black hole for SKR'
                    : '• 成为 SKR 的流动性黑洞'
                  }
                </div>
                <div className="text-xs text-gray-500 mt-2 italic">
                  {isEN
                    ? '* All buybacks are executed on-chain in real-time'
                    : '* 所有回购均实时上链执行'
                  }
                </div>
              </div>
            </div>

            {/* 刷新按钮 */}
            <button
              onClick={() => {
                priceService.clearCache()
                window.location.reload()
              }}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
            >
              🔄 {isEN ? 'Refresh Data' : '刷新数据'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EconomyDashboard

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
        {showDashboard ? '📊 隐藏' : '💎 经济面板'}
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
            <h3 className="text-xl font-bold text-green-400 mb-4">💎 经济数据面板</h3>

            {/* 实时价格 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-bold text-gray-400 mb-2">💰 实时市价</h4>
              {prices.loading ? (
                <div className="text-gray-500 text-sm">加载中...</div>
              ) : prices.error ? (
                <div className="text-red-400 text-sm">{prices.error}</div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">◎</span>
                      <span className="text-gray-300 font-bold">SOL</span>
                    </div>
                    <span className="text-blue-400 font-bold text-lg">
                      ${prices.sol.toFixed(2)}
                    </span>
                  </div>
                  
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
                      <span>汇率:</span>
                      <span className="text-cyan-400 font-bold">
                        1 SKR = {prices.gongde > 0 ? (prices.skr / prices.gongde).toFixed(0) : '0'} GD
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 你的余额 */}
            <div className="mb-4 p-3 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-lg">
              <h4 className="text-sm font-bold text-yellow-400 mb-2">💼 你的余额</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">$GONGDE:</span>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold text-lg">
                    {gdBalance.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    ≈ ${calculateUSD(gdBalance)} USD
                  </div>
                </div>
              </div>
            </div>

            {/* 冥想模式产出 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-bold text-green-400 mb-2">🧘 冥想模式（免费）</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">手动点击奖励:</span>
                  <span className="text-green-400 font-bold">
                    {(stats.meditationManualRate * 100).toFixed(0)}% × {stats.meditationManualMin}-{stats.meditationManualMax} GD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">平均每次:</span>
                  <span className="text-green-400 font-bold">
                    {stats.meditationManualAvg.toFixed(1)} GD
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-2">
                  <span className="text-gray-300 font-bold">手动玩1小时:</span>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      ~{stats.meditationManualHourly} GD
                    </div>
                    <div className="text-gray-400">
                      ≈ ${calculateUSD(stats.meditationManualHourly)} USD
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">代敲奖励:</span>
                    <span className="text-yellow-400 font-bold">
                      {(stats.autoClickRate * 100).toFixed(0)}% × {stats.autoClickMin}-{stats.autoClickMax} GD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">代敲1小时:</span>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">
                        ~{stats.autoClickHourly} GD
                      </div>
                      <div className="text-gray-400">
                        ≈ ${calculateUSD(stats.autoClickHourly)} USD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 功德模式消耗 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-bold text-yellow-400 mb-2">🔥 功德模式（消耗）</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">每次消耗:</span>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">
                      {stats.meritBurnCost} GD
                    </div>
                    <div className="text-gray-400">
                      ≈ ${calculateUSD(stats.meritBurnCost)} USD
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">基础暴击率:</span>
                  <span className="text-yellow-400 font-bold">
                    {(stats.meritCritRate * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <div className="text-gray-400 mb-1">暴击奖励:</div>
                  <div className="space-y-1 pl-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">因果级 (72%):</span>
                      <span className="text-yellow-400">1200 GD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-400">福报级 (22%):</span>
                      <span className="text-cyan-400">2000 GD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">天启级 (6%):</span>
                      <span className="text-purple-400">5000 GD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 代敲价格 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-bold text-purple-400 mb-2">🤖 代敲价格（3小时）</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-gray-400 mb-1">冥想模式:</div>
                  <div className="flex gap-2">
                    {stats.autoClickPrices.meditation.map((price, i) => (
                      <div key={i} className="flex-1 p-2 bg-gray-900/50 rounded text-center">
                        <div className="text-green-400 font-bold">{price} SKR</div>
                        <div className="text-gray-400 text-[10px]">×{[1,3,5][i]}</div>
                        <div className="text-gray-500 text-[10px]">
                          ${(price * prices.skr).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-2">
                  <div className="text-gray-400 mb-1">功德模式:</div>
                  <div className="flex gap-2">
                    {stats.autoClickPrices.merit.map((price, i) => (
                      <div key={i} className="flex-1 p-2 bg-gray-900/50 rounded text-center">
                        <div className="text-yellow-400 font-bold">{price} SKR</div>
                        <div className="text-gray-400 text-[10px]">×{[1,3,5][i]}</div>
                        <div className="text-gray-500 text-[10px]">
                          ${(price * prices.skr).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 兑换比例 */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-bold text-cyan-400 mb-2">💱 兑换比例</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                  <span className="text-gray-400">GD → SKR:</span>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">
                      {stats.gdToSkrRate} GD = 1 SKR
                    </div>
                    <div className="text-gray-500 text-[10px]">
                      1 GD = ${(prices.skr / stats.gdToSkrRate).toFixed(8)}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                  <span className="text-gray-400">SKR → GD:</span>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">
                      1 SKR = {stats.skrToGdRate} GD
                    </div>
                    <div className="text-gray-500 text-[10px]">
                      1 SKR = ${(stats.skrToGdRate * prices.gongde).toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 盈利路径 */}
            <div className="p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg">
              <h4 className="text-sm font-bold text-green-400 mb-2">💡 盈利路径</h4>
              <div className="space-y-1 text-xs text-gray-300">
                <div>• 手动玩1小时 → ~{stats.meditationManualHourly} GD</div>
                <div>• 每天玩3小时 → ~{stats.meditationManualHourly * 3} GD</div>
                <div>• 一个月 → ~{stats.meditationManualHourly * 3 * 30} GD</div>
                <div className="text-green-400 font-bold">
                  • 可兑换 ~{Math.floor(stats.meditationManualHourly * 3 * 30 / stats.gdToSkrRate)} SKR
                  ≈ ${((stats.meditationManualHourly * 3 * 30 / stats.gdToSkrRate) * prices.skr).toFixed(2)} USD
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
              🔄 刷新数据
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EconomyDashboard

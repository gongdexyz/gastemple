import React, { useState, useEffect } from 'react'
import { priceService } from '../services/priceService'

interface EconomicData {
  skrPrice: number
  gongdePrice: number
  exchangeRate: number
  loading: boolean
  error: string | null
}

interface ProfitAnalysis {
  tier: number
  skrCost: number
  skrValueUSD: number
  gdOutput: number
  gdCostUSD: number
  profitUSD: number
  profitRate: number
}

export const EconomicCalculator: React.FC = () => {
  const [data, setData] = useState<EconomicData>({
    skrPrice: 0,
    gongdePrice: 0,
    exchangeRate: 0,
    loading: true,
    error: null,
  })

  const [showCalculator, setShowCalculator] = useState(false)

  // 代敲配置
  const AUTO_CLICK_CONFIG = [
    { tier: 1, skrCost: 33, multiplier: 1, hours: 3 },
    { tier: 2, skrCost: 58, multiplier: 3, hours: 3 },
    { tier: 3, skrCost: 108, multiplier: 5, hours: 3 },
  ]

  // 产出参数（自动挂机）
  const AUTO_REWARD_RATE = parseFloat(import.meta.env.VITE_AUTO_CLICK_REWARD_RATE || '0.02')
  const AUTO_REWARD_MIN = parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MIN || '1')
  const AUTO_REWARD_MAX = parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MAX || '5')
  const AUTO_REWARD_AVG = (AUTO_REWARD_MIN + AUTO_REWARD_MAX) / 2
  
  // 手动点击参数
  const MANUAL_REWARD_RATE = parseFloat(import.meta.env.VITE_MEDITATION_MANUAL_RATE || '0.20')
  const MANUAL_REWARD_MIN = parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MIN || '5')
  const MANUAL_REWARD_MAX = parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MAX || '15')
  const MANUAL_REWARD_AVG = (MANUAL_REWARD_MIN + MANUAL_REWARD_MAX) / 2

  // 获取价格
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))
        const prices = await priceService.getBothPrices()
        setData({
          skrPrice: prices.skr,
          gongdePrice: prices.gongde,
          exchangeRate: prices.rate,
          loading: false,
          error: null,
        })
      } catch (error) {
        setData(prev => ({
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

  // 计算利润
  const calculateProfit = (config: typeof AUTO_CLICK_CONFIG[0]): ProfitAnalysis => {
    const clicksPerHour = 3600 // 每小时3600次
    const totalClicks = clicksPerHour * config.hours * config.multiplier
    const gdOutput = totalClicks * AUTO_REWARD_RATE * AUTO_REWARD_AVG

    const skrValueUSD = config.skrCost * data.skrPrice
    const gdCostUSD = gdOutput * data.gongdePrice
    const profitUSD = skrValueUSD - gdCostUSD
    const profitRate = skrValueUSD > 0 ? (profitUSD / skrValueUSD) * 100 : 0

    return {
      tier: config.tier,
      skrCost: config.skrCost,
      skrValueUSD,
      gdOutput,
      gdCostUSD,
      profitUSD,
      profitRate,
    }
  }

  const analyses = AUTO_CLICK_CONFIG.map(calculateProfit)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 折叠按钮 */}
      <button
        onClick={() => setShowCalculator(!showCalculator)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-sm"
      >
        {showCalculator ? '📊 隐藏' : '💰 经济分析'}
      </button>

      {/* 计算器面板 */}
      {showCalculator && (
        <div className="absolute bottom-12 right-0 w-96 bg-gray-900 border-2 border-purple-500 rounded-lg shadow-2xl p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-xl font-bold text-purple-400 mb-4">💰 实时经济分析</h3>

          {/* 价格信息 */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-bold text-gray-400 mb-2">实时价格</h4>
            {data.loading ? (
              <div className="text-gray-500 text-sm">加载中...</div>
            ) : data.error ? (
              <div className="text-red-400 text-sm">{data.error}</div>
            ) : (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">SKR:</span>
                  <span className="text-green-400 font-bold">
                    ${data.skrPrice.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GONGDE:</span>
                  <span className="text-blue-400 font-bold">
                    ${data.gongdePrice.toFixed(6)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
                  <span className="text-gray-400">汇率:</span>
                  <span className="text-yellow-400 font-bold">
                    1 SKR = {data.exchangeRate.toFixed(0)} GD
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 利润分析 */}
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div
                key={analysis.tier}
                className={`p-3 rounded-lg border-2 ${
                  analysis.profitUSD > 0
                    ? 'bg-green-900/20 border-green-500'
                    : 'bg-red-900/20 border-red-500'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white">
                    档位 {analysis.tier} ({analysis.skrCost} SKR)
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      analysis.profitUSD > 0
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {analysis.profitRate > 0 ? '+' : ''}
                    {analysis.profitRate.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>收入:</span>
                    <span className="text-green-400">
                      ${analysis.skrValueUSD.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>成本:</span>
                    <span className="text-red-400">
                      ${analysis.gdCostUSD.toFixed(2)} ({analysis.gdOutput.toFixed(0)} GD)
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
                    <span className="text-white font-bold">利润:</span>
                    <span
                      className={`font-bold ${
                        analysis.profitUSD > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      ${analysis.profitUSD.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 配置信息 */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400 space-y-2">
            <div className="font-bold text-gray-300 mb-1">当前配置:</div>
            
            <div className="border-t border-gray-700 pt-2">
              <div className="text-gray-300 font-semibold mb-1">🤖 自动挂机:</div>
              <div>奖励概率: {(AUTO_REWARD_RATE * 100).toFixed(1)}%</div>
              <div>奖励范围: {AUTO_REWARD_MIN}-{AUTO_REWARD_MAX} GD</div>
              <div>平均奖励: {AUTO_REWARD_AVG.toFixed(1)} GD</div>
            </div>
            
            <div className="border-t border-gray-700 pt-2">
              <div className="text-gray-300 font-semibold mb-1">👆 手动点击:</div>
              <div>奖励概率: {(MANUAL_REWARD_RATE * 100).toFixed(1)}%</div>
              <div>奖励范围: {MANUAL_REWARD_MIN}-{MANUAL_REWARD_MAX} GD</div>
              <div>平均奖励: {MANUAL_REWARD_AVG.toFixed(1)} GD</div>
            </div>
            
            <div className="border-t border-gray-700 pt-2">
              <div className="text-green-400 font-semibold">💡 手动玩1小时预期:</div>
              <div>约 {Math.floor(300 * MANUAL_REWARD_RATE * MANUAL_REWARD_AVG)} GD</div>
            </div>
          </div>

          {/* 刷新按钮 */}
          <button
            onClick={() => priceService.clearCache()}
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
          >
            🔄 刷新价格
          </button>
        </div>
      )}
    </div>
  )
}

export default EconomicCalculator

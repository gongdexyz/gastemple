import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'
import { useThemeStore } from '../stores/themeStore'

interface TokenExchangeProps {
  onClose: () => void
}

export const TokenExchange: React.FC<TokenExchangeProps> = ({ onClose }) => {
  const { gdBalance, spendGD, addGD } = useGachaStore()
  const { lang } = useLangStore()
  const { mode } = useThemeStore()
  const isEN = lang === 'en'
  const isDegen = mode === 'degen'

  const [exchangeType, setExchangeType] = useState<'GD_TO_SKR' | 'SKR_TO_GD'>('GD_TO_SKR')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 兑换比例（从环境变量读取）
  const GD_TO_SKR_RATE = parseFloat(import.meta.env.VITE_GD_TO_SKR_RATE || '2000')
  const SKR_TO_GD_RATE = parseFloat(import.meta.env.VITE_SKR_TO_GD_RATE || '1500')

  const handleExchange = () => {
    const numAmount = parseFloat(amount)
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(isEN ? 'Please enter a valid amount' : '请输入有效金额')
      return
    }

    if (exchangeType === 'GD_TO_SKR') {
      // GD 换 SKR
      const gdCost = numAmount * GD_TO_SKR_RATE
      
      if (gdBalance < gdCost) {
        setError(isEN ? `Need ${gdCost} $GONGDE` : `需要 ${gdCost} $GONGDE`)
        return
      }

      spendGD(gdCost)
      setSuccess(true)
      setError(null)
      
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } else {
      // SKR 换 GD（需要链上操作）
      setError(isEN ? 'SKR to GD exchange coming soon' : 'SKR 兑换 GD 功能即将推出')
    }
  }

  const calculateOutput = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return '0'

    if (exchangeType === 'GD_TO_SKR') {
      return numAmount.toFixed(2)
    } else {
      return (numAmount * SKR_TO_GD_RATE).toFixed(0)
    }
  }

  const calculateInput = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return '0'

    if (exchangeType === 'GD_TO_SKR') {
      return (numAmount * GD_TO_SKR_RATE).toFixed(0)
    } else {
      return numAmount.toFixed(2)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-md rounded-2xl p-6 shadow-2xl
          ${isDegen 
            ? 'bg-gradient-to-br from-gray-900 to-black border-2 border-degen-green' 
            : 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-goldman-gold'
          }
        `}
      >
        {/* 标题 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
            {isEN ? '💱 Token Exchange' : '💱 代币兑换'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* 兑换类型切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setExchangeType('GD_TO_SKR')}
            className={`
              flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all
              ${exchangeType === 'GD_TO_SKR'
                ? (isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black')
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }
            `}
          >
            GD → SKR
          </button>
          <button
            onClick={() => setExchangeType('SKR_TO_GD')}
            className={`
              flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all
              ${exchangeType === 'SKR_TO_GD'
                ? (isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black')
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }
            `}
          >
            SKR → GD
          </button>
        </div>

        {/* 输入框 */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {exchangeType === 'GD_TO_SKR' 
                ? (isEN ? 'SKR Amount' : 'SKR 数量')
                : (isEN ? 'SKR Amount' : 'SKR 数量')
              }
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-goldman-gold"
            />
          </div>

          {/* 汇率显示 */}
          <div className="text-center text-sm text-gray-400">
            {exchangeType === 'GD_TO_SKR' 
              ? `1 SKR = ${GD_TO_SKR_RATE} GD`
              : `1 SKR = ${SKR_TO_GD_RATE} GD`
            }
          </div>

          {/* 输出显示 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">
              {exchangeType === 'GD_TO_SKR'
                ? (isEN ? 'You Pay' : '你支付')
                : (isEN ? 'You Receive' : '你获得')
              }
            </div>
            <div className={`text-2xl font-bold ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold'}`}>
              {calculateInput()} {exchangeType === 'GD_TO_SKR' ? '$GONGDE' : '$GONGDE'}
            </div>
          </div>

          <div className="text-center text-gray-500">↓</div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">
              {exchangeType === 'GD_TO_SKR'
                ? (isEN ? 'You Receive' : '你获得')
                : (isEN ? 'You Pay' : '你支付')
              }
            </div>
            <div className={`text-2xl font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
              {calculateOutput()} {exchangeType === 'GD_TO_SKR' ? 'SKR' : 'SKR'}
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-400 text-sm">
            {isEN ? '✅ Exchange successful!' : '✅ 兑换成功！'}
          </div>
        )}

        {/* 余额显示 */}
        <div className="mb-4 text-sm text-gray-400">
          {isEN ? 'Your Balance:' : '你的余额:'} {gdBalance.toLocaleString()} $GONGDE
        </div>

        {/* 兑换按钮 */}
        <button
          onClick={handleExchange}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`
            w-full py-3 rounded-lg font-bold text-lg transition-all
            ${!amount || parseFloat(amount) <= 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : (isDegen
                ? 'bg-degen-green text-black hover:bg-degen-green/80'
                : 'bg-goldman-gold text-black hover:bg-goldman-gold/80'
              )
            }
          `}
        >
          {isEN ? '💱 Exchange' : '💱 立即兑换'}
        </button>

        {/* 说明 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {isEN 
            ? 'Exchange fee included in rate'
            : '兑换手续费已包含在汇率中'
          }
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TokenExchange

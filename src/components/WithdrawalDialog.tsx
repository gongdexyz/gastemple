import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, TrendingUp, ExternalLink } from 'lucide-react'
import { useWalletStore } from '../stores/walletStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'
import { useThemeStore } from '../stores/themeStore'
import { 
  getUserSKRBalance, 
  getUserTier, 
  calculateWithdrawalAmount,
  getNextTier,
  calculateUpgradeSavings,
  STAKING_TIERS,
  type StakingTier
} from '../services/stakingVerification'

interface WithdrawalDialogProps {
  onClose: () => void
}

export const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({ onClose }) => {
  const { solanaAddress } = useWalletStore()
  const { gdBalance } = useGachaStore()
  const { lang } = useLangStore()
  const { mode } = useThemeStore()
  const isEN = lang === 'en'
  const isDegen = mode === 'degen'
  
  const [amount, setAmount] = useState<string>('')
  const [skrBalance, setSkrBalance] = useState<number>(0)
  const [userTier, setUserTier] = useState<StakingTier>(STAKING_TIERS[0])
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  
  // 获取用户 SKR 余额和等级
  useEffect(() => {
    if (solanaAddress) {
      setChecking(true)
      getUserSKRBalance(solanaAddress)
        .then(balance => {
          setSkrBalance(balance)
          setUserTier(getUserTier(balance))
        })
        .finally(() => setChecking(false))
    }
  }, [solanaAddress])
  
  const withdrawalAmount = parseFloat(amount) || 0
  const calculation = calculateWithdrawalAmount(withdrawalAmount, userTier)
  const nextTier = getNextTier(userTier)
  const savings = nextTier ? calculateUpgradeSavings(withdrawalAmount, userTier, nextTier) : 0
  
  const handleWithdraw = async () => {
    if (!solanaAddress || withdrawalAmount <= 0 || withdrawalAmount > gdBalance) return
    
    setLoading(true)
    // TODO: 实现实际的提现逻辑
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 2000)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-md rounded-2xl p-6 relative
          ${isDegen ? 'bg-black border-2 border-degen-green' : 'bg-gray-900 border border-goldman-border'}
        `}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            isDegen ? 'hover:bg-degen-green/20 text-degen-green' : 'hover:bg-gray-800 text-gray-400'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* 标题 */}
        <h2 className={`text-2xl font-bold mb-6 ${isDegen ? 'text-degen-green font-pixel' : 'text-goldman-gold'}`}>
          {isEN ? '💰 Withdrawal' : '💰 提现'}
        </h2>
        
        {/* 用户等级显示 */}
        <div className={`mb-6 p-4 rounded-xl ${isDegen ? 'bg-degen-purple/10 border border-degen-purple/30' : 'bg-gray-800 border border-gray-700'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">
                {isEN ? 'Your Status' : '您的身份'}
              </div>
              <div className={`text-xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                {userTier.emoji} {isEN ? userTier.nameEN : userTier.name}
              </div>
            </div>
            <button
              onClick={() => {
                if (solanaAddress) {
                  setChecking(true)
                  getUserSKRBalance(solanaAddress)
                    .then(balance => {
                      setSkrBalance(balance)
                      setUserTier(getUserTier(balance))
                    })
                    .finally(() => setChecking(false))
                }
              }}
              disabled={checking}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                isDegen 
                  ? 'bg-degen-cyan/20 text-degen-cyan hover:bg-degen-cyan/30' 
                  : 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
              }`}
            >
              {checking ? '...' : (isEN ? 'Refresh' : '刷新')}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-gray-400">{isEN ? 'SKR Balance' : 'SKR 持仓'}</div>
              <div className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                {skrBalance.toLocaleString()} SKR
              </div>
            </div>
            <div>
              <div className="text-gray-400">{isEN ? 'Fee Rate' : '税率'}</div>
              <div className={`font-bold ${
                userTier.withdrawalFee < 0 
                  ? (isDegen ? 'text-degen-green' : 'text-green-400')
                  : userTier.withdrawalFee === 0
                    ? (isDegen ? 'text-degen-cyan' : 'text-cyan-400')
                    : 'text-red-400'
              }`}>
                {userTier.withdrawalFee < 0 ? '+' : ''}{Math.abs(userTier.withdrawalFee * 100)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* 提现金额输入 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            {isEN ? 'Withdrawal Amount' : '提现金额'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={`
                w-full px-4 py-3 rounded-lg text-lg font-bold
                bg-black/30 border-2 outline-none transition-colors
                ${isDegen 
                  ? 'border-degen-green/30 focus:border-degen-green text-degen-green' 
                  : 'border-gray-700 focus:border-goldman-gold text-goldman-gold'
                }
              `}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              $GONGDE
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>{isEN ? 'Available' : '可用'}: {gdBalance.toLocaleString()} $GONGDE</span>
            <button
              onClick={() => setAmount(gdBalance.toString())}
              className={`font-bold ${isDegen ? 'text-degen-cyan hover:text-degen-green' : 'text-blue-400 hover:text-blue-300'}`}
            >
              {isEN ? 'MAX' : '最大'}
            </button>
          </div>
        </div>
        
        {/* 计算结果 */}
        {withdrawalAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-4 rounded-xl ${
              userTier.withdrawalFee > 0.2
                ? 'bg-red-900/20 border border-red-500/30'
                : isDegen ? 'bg-degen-green/10 border border-degen-green/30' : 'bg-gray-800 border border-gray-700'
            }`}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{isEN ? 'Gross Amount' : '提现金额'}</span>
                <span className="font-bold text-white">{calculation.grossAmount.toLocaleString()} $GONGDE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {calculation.feeRate < 0 ? (isEN ? 'Bonus' : '补贴') : (isEN ? 'Fee' : '税费')}
                  ({Math.abs(calculation.feeRate * 100)}%)
                </span>
                <span className={`font-bold ${calculation.feeRate < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calculation.feeRate < 0 ? '+' : '-'}{Math.abs(calculation.fee).toLocaleString()} $GONGDE
                </span>
              </div>
              <div className="pt-2 border-t border-gray-700 flex justify-between">
                <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                  {isEN ? 'Net Amount' : '实际到账'}
                </span>
                <span className={`text-xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                  {calculation.netAmount.toLocaleString()} $GONGDE
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 升级提示 - 省钱计算器 */}
        {nextTier && withdrawalAmount > 0 && savings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-4 rounded-xl ${isDegen ? 'bg-degen-yellow/10 border-2 border-degen-yellow' : 'bg-yellow-900/20 border-2 border-yellow-500'}`}
          >
            <div className="flex items-start gap-3">
              <TrendingUp className={`w-5 h-5 mt-0.5 ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`} />
              <div className="flex-1">
                <div className={`font-bold mb-2 ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                  💡 {isEN ? 'Save Money!' : '省钱提示！'}
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {isEN 
                    ? `Hold ${nextTier.minStake.toLocaleString()} SKR to reduce fee to ${Math.abs(nextTier.withdrawalFee * 100)}%`
                    : `持有 ${nextTier.minStake.toLocaleString()} SKR 可降低税率至 ${Math.abs(nextTier.withdrawalFee * 100)}%`
                  }
                </div>
                <div className={`text-lg font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                  {isEN ? 'Save' : '立省'} {savings.toLocaleString()} $GONGDE!
                </div>
                <a
                  href="https://raydium.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm
                    transition-colors
                    ${isDegen 
                      ? 'bg-degen-yellow/20 text-degen-yellow hover:bg-degen-yellow/30' 
                      : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    }
                  `}
                >
                  {isEN ? 'Buy SKR on Raydium' : '去 Raydium 买 SKR'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Seeker 官方质押提示 */}
        {skrBalance < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-4 rounded-xl ${isDegen ? 'bg-degen-cyan/10 border border-degen-cyan/30' : 'bg-blue-900/20 border border-blue-500/30'}`}
          >
            <div className="text-sm text-gray-300 mb-2">
              {isEN 
                ? '💎 Stake SKR on Seeker Official to enjoy double rewards!'
                : '💎 去 Seeker 官方质押 SKR，享受双重收益！'
              }
            </div>
            <div className="text-xs text-gray-400">
              {isEN 
                ? '1. Official APY + 2. Tax-free withdrawal here'
                : '1. 官方 APY 收益 + 2. 本站免税提现'
              }
            </div>
          </motion.div>
        )}
        
        {/* 提现按钮 */}
        <button
          onClick={handleWithdraw}
          disabled={loading || !solanaAddress || withdrawalAmount <= 0 || withdrawalAmount > gdBalance}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all
            ${loading || !solanaAddress || withdrawalAmount <= 0 || withdrawalAmount > gdBalance
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : isDegen
                ? 'bg-degen-green text-black hover:bg-degen-green/80'
                : 'bg-goldman-gold text-black hover:bg-goldman-gold/80'
            }
          `}
        >
          {loading 
            ? (isEN ? 'Processing...' : '处理中...')
            : !solanaAddress
              ? (isEN ? 'Connect Wallet' : '连接钱包')
              : withdrawalAmount > gdBalance
                ? (isEN ? 'Insufficient Balance' : '余额不足')
                : (isEN ? 'Confirm Withdrawal' : '确认提现')
          }
        </button>
        
        {/* 等级表格 */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-3">
            {isEN ? '📊 All Tiers' : '📊 全部等级'}
          </div>
          <div className="space-y-2">
            {STAKING_TIERS.map((tier, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-2 rounded-lg text-xs
                  ${tier.name === userTier.name
                    ? isDegen ? 'bg-degen-green/20 border border-degen-green' : 'bg-goldman-gold/20 border border-goldman-gold'
                    : 'bg-gray-800/50'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span>{tier.emoji}</span>
                  <span className="font-bold">{isEN ? tier.nameEN : tier.name}</span>
                  <span className="text-gray-500">({tier.minStake.toLocaleString()} SKR)</span>
                </div>
                <div className={`font-bold ${
                  tier.withdrawalFee < 0 
                    ? 'text-green-400'
                    : tier.withdrawalFee === 0
                      ? 'text-cyan-400'
                      : 'text-red-400'
                }`}>
                  {tier.withdrawalFee < 0 ? '+' : ''}{Math.abs(tier.withdrawalFee * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

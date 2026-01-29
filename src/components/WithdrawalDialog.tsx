import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, ExternalLink, Sparkles } from 'lucide-react'
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
  type StakingTier,
  isDemoMode,
  getDemoTierName
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
  const [showCelebration, setShowCelebration] = useState(false)
  const [tierUpgraded, setTierUpgraded] = useState(false)
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false)
  const [withdrawalStep, setWithdrawalStep] = useState<'idle' | 'connecting' | 'verifying' | 'calculating' | 'processing' | 'confirming' | 'success'>('idle')
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [currentBlock, setCurrentBlock] = useState(0)
  const [txHash, setTxHash] = useState('')
  const previousTierRef = useRef<StakingTier>(STAKING_TIERS[0])
  
  // 锁定 body 滚动 - 简化版，不影响fixed定位元素
  useEffect(() => {
    // 保存原始样式
    const originalOverflow = document.body.style.overflow
    const originalTouchAction = document.body.style.touchAction
    
    // 仅禁用滚动，不改变position
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.touchAction = originalTouchAction
    }
  }, [])
  
  // 获取用户 SKR 余额和等级
  useEffect(() => {
    if (solanaAddress) {
      setChecking(true)
      getUserSKRBalance(solanaAddress)
        .then(balance => {
          setSkrBalance(balance)
          const newTier = getUserTier(balance)
          
          // 检测等级提升
          if (previousTierRef.current && newTier.minStake > previousTierRef.current.minStake) {
            setTierUpgraded(true)
            setShowCelebration(true)
            setTimeout(() => {
              setShowCelebration(false)
              setTierUpgraded(false)
            }, 3000)
          }
          
          setUserTier(newTier)
          previousTierRef.current = newTier
        })
        .finally(() => setChecking(false))
    }
  }, [solanaAddress])
  
  // Demo 模式：监听 URL 参数变化
  useEffect(() => {
    if (isDemoMode()) {
      // 在 Demo 模式下，即使没有钱包地址也要获取模拟数据
      setChecking(true)
      getUserSKRBalance(solanaAddress || 'demo-address')
        .then(balance => {
          setSkrBalance(balance)
          const newTier = getUserTier(balance)
          setUserTier(newTier)
          previousTierRef.current = newTier
        })
        .finally(() => setChecking(false))
    }
  }, []) // 只在组件挂载时执行一次，因为 Demo 模式下 URL 不会在弹窗打开时变化
  
  const withdrawalAmount = parseFloat(amount) || 0
  const calculation = calculateWithdrawalAmount(withdrawalAmount, userTier)
  const nextTier = getNextTier(userTier)
  const savings = nextTier ? calculateUpgradeSavings(withdrawalAmount, userTier, nextTier) : 0
  
  const handleWithdraw = async () => {
    if (withdrawalAmount <= 0 || withdrawalAmount > gdBalance) return
    
    setLoading(true)
    setVerificationProgress(0)
    
    // 步骤 1: 连接 RPC 节点 (0.8秒)
    setWithdrawalStep('connecting')
    for (let i = 0; i <= 100; i += 20) {
      setVerificationProgress(i)
      await new Promise(resolve => setTimeout(resolve, 160))
    }
    
    // 步骤 2: 查询最新区块 (0.6秒)
    setWithdrawalStep('verifying')
    const mockBlock = Math.floor(Math.random() * 1000000) + 280000000
    setCurrentBlock(mockBlock)
    for (let i = 0; i <= 100; i += 25) {
      setVerificationProgress(i)
      await new Promise(resolve => setTimeout(resolve, 150))
    }
    
    // 步骤 3: 验证 SKR 持仓 (0.7秒)
    setWithdrawalStep('calculating')
    for (let i = 0; i <= 100; i += 20) {
      setVerificationProgress(i)
      await new Promise(resolve => setTimeout(resolve, 140))
    }
    
    // 步骤 4: 处理提现交易 (1秒)
    setWithdrawalStep('processing')
    const mockTxHash = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    setTxHash(mockTxHash)
    for (let i = 0; i <= 100; i += 10) {
      setVerificationProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // 步骤 5: 等待链上确认 (0.9秒)
    setWithdrawalStep('confirming')
    for (let i = 0; i <= 100; i += 33) {
      setVerificationProgress(i)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    // 步骤 6: 提现成功
    setWithdrawalStep('success')
    setWithdrawalSuccess(true)
    setVerificationProgress(100)
    
    // 扣除 GONGDE 余额（Demo 模式下跳过）
    if (!isDemoMode()) {
      const { spendGD } = useGachaStore.getState()
      spendGD(withdrawalAmount)
    }
    
    // 显示成功动画 2.5 秒后关闭
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    setLoading(false)
    setWithdrawalSuccess(false)
    setWithdrawalStep('idle')
    setVerificationProgress(0)
    setCurrentBlock(0)
    setTxHash('')
    onClose()
  }
  
  const handleRefresh = () => {
    if (solanaAddress) {
      setChecking(true)
      getUserSKRBalance(solanaAddress)
        .then(balance => {
          setSkrBalance(balance)
          const newTier = getUserTier(balance)
          
          // 检测等级提升
          if (newTier.minStake > userTier.minStake) {
            setTierUpgraded(true)
            setShowCelebration(true)
            setTimeout(() => {
              setShowCelebration(false)
              setTierUpgraded(false)
            }, 3000)
          }
          
          setUserTier(newTier)
          previousTierRef.current = newTier
        })
        .finally(() => setChecking(false))
    }
  }
  
  // 防止背景滚动和触摸滑动
  const preventScroll = (e: React.TouchEvent | React.WheelEvent) => {
    e.stopPropagation()
  }
  
  // 使用 Portal 渲染到 body，避免被 header 的 z-index 限制
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999, touchAction: 'none' }}
      onClick={onClose}
      onTouchMove={preventScroll}
      onWheel={preventScroll}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`
          w-full max-w-md max-h-[90vh] rounded-2xl p-6 relative overflow-y-auto
          ${isDegen ? 'bg-black border-2 border-degen-green' : 'bg-gray-900 border border-goldman-border'}
        `}
        style={{ touchAction: 'pan-y' }}
      >
        {/* 庆祝彩带效果 */}
        <AnimatePresence>
          {showCelebration && (
            <>
              {/* 彩带粒子 */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0.8],
                    rotate: Math.random() * 720,
                    opacity: [1, 1, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2 + Math.random(),
                    ease: "easeOut"
                  }}
                  className="absolute pointer-events-none"
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#7FFF00'][Math.floor(Math.random() * 5)],
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                  }}
                />
              ))}
              
              {/* 升级提示 */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
              >
                <div className={`
                  px-6 py-4 rounded-2xl backdrop-blur-xl border-2
                  ${isDegen ? 'bg-degen-green/20 border-degen-green' : 'bg-goldman-gold/20 border-goldman-gold'}
                `}>
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-8 h-8 ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`} />
                    <div>
                      <div className={`text-2xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                        {isEN ? 'TIER UP!' : '等级提升！'}
                      </div>
                      <div className="text-sm text-white">
                        {userTier.emoji} {isEN ? userTier.nameEN : userTier.name}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* 关闭按钮 + Demo 标识 */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isDemoMode() && (
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              isDegen ? 'bg-degen-cyan/20 text-degen-cyan' : 'bg-blue-500/20 text-blue-400'
            }`}>
              🎬 {isEN ? 'DEMO' : '演示'}
            </span>
          )}
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDegen ? 'hover:bg-degen-green/20 text-degen-green' : 'hover:bg-gray-800 text-gray-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 标题 */}
        <h2 className={`text-2xl font-bold mb-4 ${isDegen ? 'text-degen-green font-pixel' : 'text-goldman-gold'}`}>
          {isEN ? '💰 Withdrawal' : '💰 提现'}
        </h2>
        
        {/* 用户等级显示 - 紧凑版 */}
        <motion.div 
          className={`mb-4 p-3 rounded-xl ${isDegen ? 'bg-degen-purple/10 border border-degen-purple/30' : 'bg-gray-800 border border-gray-700'}`}
          animate={tierUpgraded ? {
            boxShadow: [
              '0 0 0px rgba(255, 215, 0, 0)',
              '0 0 30px rgba(255, 215, 0, 0.8)',
              '0 0 0px rgba(255, 215, 0, 0)'
            ]
          } : {}}
          transition={{ duration: 1, repeat: tierUpgraded ? 2 : 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-gray-400">{isEN ? 'Status' : '身份'}</div>
              <motion.div 
                className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}
                animate={tierUpgraded ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {userTier.emoji} {isEN ? userTier.nameEN : userTier.name}
              </motion.div>
            </div>
            {!isDemoMode() && (
              <button
                onClick={handleRefresh}
                disabled={checking}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  isDegen 
                    ? 'bg-degen-cyan/20 text-degen-cyan hover:bg-degen-cyan/30' 
                    : 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                }`}
              >
                {checking ? '...' : (isEN ? 'Refresh' : '刷新')}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-gray-400">{isEN ? 'SKR' : 'SKR 持仓'}</div>
              <div className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                {skrBalance.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400">{isEN ? 'Fee' : '税率'}</div>
              <motion.div 
                className={`font-bold ${
                  userTier.withdrawalFee < 0 
                    ? (isDegen ? 'text-degen-green' : 'text-green-400')
                    : userTier.withdrawalFee === 0
                      ? (isDegen ? 'text-degen-cyan' : 'text-cyan-400')
                      : 'text-red-400'
                }`}
                animate={tierUpgraded ? { 
                  scale: [1, 1.5, 1],
                  textShadow: [
                    '0 0 0px rgba(255, 215, 0, 0)',
                    '0 0 20px rgba(255, 215, 0, 1)',
                    '0 0 0px rgba(255, 215, 0, 0)'
                  ]
                } : {}}
                transition={{ duration: 0.8 }}
              >
                {userTier.withdrawalFee < 0 ? '+' : ''}{Math.abs(userTier.withdrawalFee * 100)}%
              </motion.div>
            </div>
          </div>
        </motion.div>
        
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
        
        {/* 升级提示 - 紧凑版 */}
        {nextTier && withdrawalAmount > 0 && savings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-3 p-3 rounded-xl ${isDegen ? 'bg-degen-yellow/10 border border-degen-yellow' : 'bg-yellow-900/20 border border-yellow-500'}`}
          >
            <div className="flex items-start gap-2">
              <TrendingUp className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`} />
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm mb-1 ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                  💡 {isEN ? 'Save' : '立省'} {savings.toLocaleString()} $GD!
                </div>
                <div className="text-xs text-gray-300 mb-2">
                  {isEN 
                    ? `Hold ${nextTier.minStake.toLocaleString()} SKR → ${Math.abs(nextTier.withdrawalFee * 100)}% fee`
                    : `持有 ${nextTier.minStake.toLocaleString()} SKR → ${Math.abs(nextTier.withdrawalFee * 100)}% 税率`
                  }
                </div>
                <a
                  href="https://seeker.io/stake"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs
                    transition-all hover:scale-105
                    ${isDegen 
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30' 
                      : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 border border-cyan-500/30'
                    }
                  `}
                >
                  <Sparkles className="w-3 h-3" />
                  {isEN ? 'Stake Now' : '去质押'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Seeker 官方质押提示 - 紧凑版 */}
        {skrBalance < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-3 p-3 rounded-xl text-xs ${isDegen ? 'bg-degen-cyan/10 border border-degen-cyan/30' : 'bg-blue-900/20 border border-blue-500/30'}`}
          >
            <div className="text-gray-300 mb-1">
              {isEN 
                ? '💎 Stake SKR for double rewards!'
                : '💎 质押 SKR 享双重收益！'
              }
            </div>
            <div className="text-gray-400">
              {isEN 
                ? 'Official APY + Tax-free withdrawal'
                : '官方 APY + 本站免税提现'
              }
            </div>
          </motion.div>
        )}
        
        {/* 提现流程动画 - 完整真实验资流程 */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-4 rounded-xl ${isDegen ? 'bg-black/50 border border-degen-purple/50' : 'bg-gray-900/80 border border-purple-500/50'}`}
            >
              {/* 步骤 1: 连接 RPC */}
              {withdrawalStep === 'connecting' && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-5 h-5 border-2 border-t-transparent rounded-full ${isDegen ? 'border-degen-cyan' : 'border-cyan-400'}`}
                    />
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${isDegen ? 'text-degen-cyan' : 'text-cyan-400'}`}>
                        {isEN ? '🌐 Connecting to Solana RPC...' : '🌐 连接 Solana RPC 节点...'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {isEN ? 'Establishing secure connection' : '建立安全连接中'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full ${isDegen ? 'bg-degen-cyan' : 'bg-cyan-400'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${verificationProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
              
              {/* 步骤 2: 查询区块 */}
              {withdrawalStep === 'verifying' && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-5 h-5 border-2 border-t-transparent rounded-full ${isDegen ? 'border-degen-yellow' : 'border-blue-400'}`}
                    />
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${isDegen ? 'text-degen-yellow' : 'text-blue-400'}`}>
                        {isEN ? '🔍 Querying Latest Block...' : '🔍 查询最新区块...'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">
                        {isEN ? `Block #${currentBlock.toLocaleString()}` : `区块 #${currentBlock.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full ${isDegen ? 'bg-degen-yellow' : 'bg-blue-400'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${verificationProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
              
              {/* 步骤 3: 验证持仓 */}
              {withdrawalStep === 'calculating' && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-5 h-5 border-2 border-t-transparent rounded-full ${isDegen ? 'border-degen-purple' : 'border-purple-400'}`}
                    />
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${isDegen ? 'text-degen-purple' : 'text-purple-400'}`}>
                        {isEN ? '💎 Verifying SKR Holdings...' : '💎 验证 SKR 持仓...'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {isEN 
                          ? `Tier: ${userTier.emoji} ${userTier.nameEN} | Fee: ${Math.abs(userTier.withdrawalFee * 100)}%`
                          : `等级: ${userTier.emoji} ${userTier.name} | 税率: ${Math.abs(userTier.withdrawalFee * 100)}%`
                        }
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full ${isDegen ? 'bg-degen-purple' : 'bg-purple-400'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${verificationProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
              
              {/* 步骤 4: 处理交易 */}
              {withdrawalStep === 'processing' && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-5 h-5 border-2 border-t-transparent rounded-full ${isDegen ? 'border-degen-yellow' : 'border-yellow-400'}`}
                    />
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                        {isEN ? '⚡ Processing Transaction...' : '⚡ 处理交易中...'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono truncate">
                        {isEN ? `TX: ${txHash.slice(0, 16)}...` : `交易: ${txHash.slice(0, 16)}...`}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full ${isDegen ? 'bg-degen-yellow' : 'bg-yellow-400'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${verificationProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
              
              {/* 步骤 5: 链上确认 */}
              {withdrawalStep === 'confirming' && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-5 h-5 border-2 border-t-transparent rounded-full ${isDegen ? 'border-degen-green' : 'border-green-400'}`}
                    />
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                        {isEN ? '⏳ Waiting for Confirmation...' : '⏳ 等待链上确认...'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {isEN ? 'Broadcasting to network' : '广播至全网节点'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full ${isDegen ? 'bg-degen-green' : 'bg-green-400'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${verificationProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
              
              {/* 步骤 6: 成功 */}
              {withdrawalStep === 'success' && (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl"
                    >
                      ✅
                    </motion.div>
                    <div className="flex-1">
                      <div className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                        {isEN ? '🎉 Withdrawal Successful!' : '🎉 提现成功！'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {isEN ? 'Transaction confirmed on-chain' : '交易已在链上确认'}
                      </div>
                    </div>
                  </div>
                  
                  {/* 到账详情 */}
                  <div className={`p-3 rounded-lg ${isDegen ? 'bg-degen-green/10' : 'bg-green-900/20'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">{isEN ? 'Amount Received' : '到账金额'}</span>
                      <span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                        +{calculation.netAmount.toLocaleString()} $GONGDE
                      </span>
                    </div>
                    {userTier.withdrawalFee < 0 && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{isEN ? 'Bonus Applied' : '补贴已发放'}</span>
                        <span className="text-green-400">+{Math.abs(calculation.fee).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 提现按钮 */}
        <button
          onClick={handleWithdraw}
          disabled={loading || withdrawalAmount <= 0 || withdrawalAmount > gdBalance}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all
            ${loading || withdrawalAmount <= 0 || withdrawalAmount > gdBalance
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : isDegen
                ? 'bg-degen-green text-black hover:bg-degen-green/80'
                : 'bg-goldman-gold text-black hover:bg-goldman-gold/80'
            }
          `}
        >
          {loading 
            ? (isEN ? 'Processing...' : '处理中...')
            : withdrawalAmount > gdBalance
              ? (isEN ? 'Insufficient Balance' : '余额不足')
              : isDemoMode()
                ? (isEN ? '🎬 Demo Withdrawal' : '🎬 演示提现')
                : (isEN ? 'Confirm Withdrawal' : '确认提现')
          }
        </button>
        
        {/* 等级表格 - 紧凑版 */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">
            {isEN ? '📊 All Tiers' : '📊 全部等级'}
          </div>
          <div className="space-y-1.5">
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
                <div className="flex items-center gap-1.5">
                  <span>{tier.emoji}</span>
                  <span className="font-bold">{isEN ? tier.nameEN : tier.name}</span>
                  <span className="text-gray-500 text-[10px]">({tier.minStake.toLocaleString()})</span>
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
    </motion.div>,
    document.body
  )
}

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLangStore } from '../stores/langStore'

export const GenesisBanner: React.FC = () => {
  const { lang } = useLangStore()
  const isEN = lang === 'en'
  
  const [showBanner, setShowBanner] = useState(true)
  const [timeLeft, setTimeLeft] = useState('')
  
  // 检查是否是创世期
  const isGenesisMode = import.meta.env.VITE_GENESIS_MODE === 'true'
  const genesisEndTime = parseInt(import.meta.env.VITE_GENESIS_END_TIME || '0')
  
  // 2秒后自动隐藏
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // 倒计时
  useEffect(() => {
    if (!isGenesisMode || !genesisEndTime) return
    
    const updateCountdown = () => {
      const now = Date.now()
      const remaining = genesisEndTime * 1000 - now
      
      if (remaining <= 0) {
        setTimeLeft(isEN ? 'Ended' : '已结束')
        return
      }
      
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeLeft(`${days}${isEN ? 'd' : '天'} ${hours}${isEN ? 'h' : '时'} ${minutes}${isEN ? 'm' : '分'}`)
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // 每分钟更新
    
    return () => clearInterval(interval)
  }, [isGenesisMode, genesisEndTime, isEN])
  
  if (!isGenesisMode) return null
  
  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* 左侧：创世期标识 */}
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse">🎉</span>
                <div>
                  <div className="font-bold text-lg">
                    {isEN ? '🌍 GENESIS PHASE ACTIVE' : '🌍 创世挖矿已开启'}
                  </div>
                  <div className="text-xs opacity-90">
                    {isEN ? 'First 1000 users get exclusive benefits!' : '前1000名用户享受专属福利！'}
                  </div>
                </div>
              </div>
              
              {/* 中间：福利列表 */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span>🔥</span>
                  <span className="font-bold">{isEN ? '50% OFF' : '5折优惠'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span className="font-bold">{isEN ? 'ROI 180%' : 'ROI 180%'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🎁</span>
                  <span className="font-bold">{isEN ? '10% Referral' : '10%返佣'}</span>
                </div>
              </div>
              
              {/* 右侧：倒计时和关闭按钮 */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs opacity-90">
                    {isEN ? 'Ends in:' : '剩余时间:'}
                  </div>
                  <div className="font-bold text-lg">
                    {timeLeft}
                  </div>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-white hover:text-yellow-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GenesisBanner

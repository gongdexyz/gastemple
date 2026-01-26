import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { useGachaStore } from '../stores/gachaStore'

interface NewbieRewardsProps {
  onClose: () => void
}

export const NewbieRewards: React.FC<NewbieRewardsProps> = ({ onClose }) => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const { addGD } = useGachaStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  
  const [showWelcome, setShowWelcome] = useState(false)
  const [showDailyReward, setShowDailyReward] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneAmount, setMilestoneAmount] = useState(0)
  
  // 检查是否是首次访问
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setShowWelcome(true)
      localStorage.setItem('hasVisited', 'true')
      localStorage.setItem('firstVisitDate', new Date().toDateString())
    }
  }, [])
  
  // 检查每日奖励 - 添加标志防止重复触发
  useEffect(() => {
    const today = new Date().toDateString()
    const lastRewardDate = localStorage.getItem('lastDailyReward')
    const dailyRewardShown = sessionStorage.getItem('dailyRewardShown')
    
    // 如果今天还没领取过，且本次会话还没显示过
    if (lastRewardDate !== today && !dailyRewardShown) {
      // 标记本次会话已显示
      sessionStorage.setItem('dailyRewardShown', 'true')
      
      // 延迟显示每日奖励（避免和欢迎弹窗冲突）
      setTimeout(() => {
        setShowDailyReward(true)
        localStorage.setItem('lastDailyReward', today)
      }, showWelcome ? 3000 : 1000)
    }
  }, [showWelcome])
  
  // 处理欢迎弹窗关闭
  const handleWelcomeClose = () => {
    setShowWelcome(false)
    // 给新手 100 $GONGDE 作为见面礼
    addGD(100)
  }
  
  // 处理每日奖励领取
  const handleDailyRewardClaim = () => {
    setShowDailyReward(false)
    // 给 50 $GONGDE 作为每日奖励
    addGD(50)
  }
  
  // 检查功德里程碑
  const checkMilestone = (totalMerits: number) => {
    const milestones = [1000, 5000, 10000, 50000, 100000]
    const lastMilestone = parseInt(localStorage.getItem('lastMilestone') || '0')
    
    for (const milestone of milestones) {
      if (totalMerits >= milestone && lastMilestone < milestone) {
        setMilestoneAmount(milestone)
        setShowMilestone(true)
        localStorage.setItem('lastMilestone', milestone.toString())
        
        // 里程碑奖励
        const reward = milestone / 10 // 1000 功德 = 100 GD
        addGD(reward)
        break
      }
    }
  }
  
  // 暴露给父组件调用
  useEffect(() => {
    // @ts-ignore
    window.checkMilestone = checkMilestone
  }, [])
  
  return (
    <>
      {/* 欢迎弹窗 - 首次访问 */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
              className={`
                relative max-w-lg w-full mx-4 p-8 rounded-3xl border-4
                ${isDegen
                  ? 'bg-black border-degen-purple'
                  : 'bg-gray-900 border-yellow-500'
                }
              `}
            >
              {/* 佛光特效 */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-500/10 to-yellow-400/20 animate-glow-slow"></div>
              </div>
              
              {/* 内容 */}
              <div className="relative z-10">
                {/* 标题 */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-7xl mb-4"
                  >
                    🙏
                  </motion.div>
                  <h2 className={`text-3xl font-bold mb-2 ${isDegen ? 'text-degen-purple' : 'text-yellow-400'}`}>
                    {isEN ? 'Welcome to Merit Temple!' : '欢迎来到功德殿！'}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {isEN ? 'Your journey to enlightenment begins here' : '您的修行之旅从这里开始'}
                  </p>
                </div>

                {/* 说明 */}
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-bold text-white mb-1">
                        {isEN ? 'Click the Fish' : '点击木鱼'}
                      </p>
                      <p className="text-gray-400">
                        {isEN 
                          ? 'Tap the wooden fish to earn merit and $GONGDE tokens'
                          : '敲击木鱼积累功德，获得 $GONGDE 代币'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <span className="text-2xl">💥</span>
                    <div>
                      <p className="font-bold text-white mb-1">
                        {isEN ? 'Critical Hits!' : '暴击系统'}
                      </p>
                      <p className="text-gray-400">
                        {isEN 
                          ? '10% chance for massive rewards - Buddha blesses the worthy!'
                          : '10% 概率触发暴击，获得海量奖励！'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <p className="font-bold text-white mb-1">
                        {isEN ? 'Newbie Gift' : '新手礼包'}
                      </p>
                      <p className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                        {isEN 
                          ? '+100 $GONGDE to get you started!'
                          : '赠送 100 $GONGDE 助你起步！'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* 按钮 */}
                <button
                  onClick={handleWelcomeClose}
                  className={`
                    w-full px-6 py-4 rounded-xl font-bold text-lg transition-all
                    ${isDegen
                      ? 'bg-degen-purple text-white hover:bg-degen-purple/80'
                      : 'bg-yellow-500 text-black hover:bg-yellow-400'
                    }
                  `}
                >
                  {isEN ? '🙏 Start My Journey' : '🙏 开始修行'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 每日奖励弹窗 */}
      <AnimatePresence>
        {showDailyReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", duration: 0.6 }}
              className={`
                relative max-w-md w-full mx-4 p-6 rounded-2xl border-2
                ${isDegen
                  ? 'bg-black/95 border-degen-green'
                  : 'bg-gray-900/95 border-green-500'
                }
              `}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  🎁
                </motion.div>
                <h2 className={`text-2xl font-bold mb-2 ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                  {isEN ? 'Daily Blessing!' : '每日福报！'}
                </h2>
                <p className="text-gray-400 mb-4">
                  {isEN 
                    ? 'Buddha is pleased with your devotion'
                    : '佛祖今天心情很好'
                  }
                </p>
                <div className={`text-4xl font-bold mb-6 ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>
                  +50 $GONGDE
                </div>
                <button
                  onClick={handleDailyRewardClaim}
                  className={`
                    w-full px-6 py-3 rounded-lg font-bold transition-all
                    ${isDegen
                      ? 'bg-degen-green text-black hover:bg-degen-green/80'
                      : 'bg-green-500 text-white hover:bg-green-400'
                    }
                  `}
                >
                  {isEN ? '✨ Claim Reward' : '✨ 领取奖励'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 功德里程碑弹窗 */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className={`
                relative max-w-lg w-full mx-4 p-8 rounded-3xl border-4
                ${isDegen
                  ? 'bg-black border-degen-yellow'
                  : 'bg-gray-900 border-yellow-400'
                }
              `}
            >
              {/* 烟花特效 */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <motion.div
                  animate={{ 
                    background: [
                      'radial-gradient(circle at 20% 30%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 70%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                />
              </div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className={`text-3xl font-bold mb-2 ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                  {isEN ? 'Milestone Achieved!' : '功德里程碑！'}
                </h2>
                <p className="text-gray-400 mb-4">
                  {isEN 
                    ? `You've reached ${milestoneAmount.toLocaleString()} merit!`
                    : `您已达成 ${milestoneAmount.toLocaleString()} 功德！`
                  }
                </p>
                <div className={`text-5xl font-bold mb-6 ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>
                  +{(milestoneAmount / 10).toLocaleString()} $GONGDE
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  {isEN 
                    ? 'Buddha is very pleased with your progress!'
                    : '佛祖对你的进步非常满意！'
                  }
                </p>
                <button
                  onClick={() => setShowMilestone(false)}
                  className={`
                    w-full px-6 py-4 rounded-xl font-bold text-lg transition-all
                    ${isDegen
                      ? 'bg-degen-yellow text-black hover:bg-degen-yellow/80'
                      : 'bg-yellow-500 text-black hover:bg-yellow-400'
                    }
                  `}
                >
                  {isEN ? '🙏 Continue Journey' : '🙏 继续修行'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

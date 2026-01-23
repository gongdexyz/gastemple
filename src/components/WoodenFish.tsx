import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'

interface MeritPopup {
  id: number
  x: number
  y: number
  text: string
  color: string
}

interface ClickTarget {
  id: number
  x: number
  y: number
  timestamp: number
}

// 正常模式文案 - 中文
const NORMAL_TEXTS_CN = [
  { text: '功德 +1', color: 'text-green-400' },
  { text: '心平气和 ☯️', color: 'text-cyan-400' },
  { text: '岁月静好 🌸', color: 'text-pink-400' },
  { text: '业障 -1', color: 'text-purple-400' },
  { text: '智慧 +1', color: 'text-blue-400' },
  { text: '佛光普照 ✨', color: 'text-yellow-400' },
]

// 正常模式文案 - 英文
const NORMAL_TEXTS_EN = [
  { text: 'Merit +1', color: 'text-green-400' },
  { text: 'Inner Peace ☯️', color: 'text-cyan-400' },
  { text: 'Zen Mode 🌸', color: 'text-pink-400' },
  { text: 'Karma -1', color: 'text-purple-400' },
  { text: 'Wisdom +1', color: 'text-blue-400' },
  { text: 'Blessed ✨', color: 'text-yellow-400' },
]

// 暴走模式文案 - 中文 (combo > 5)
const RAGE_TEXTS_CN = [
  { text: '暴击！💥', color: 'text-red-500' },
  { text: '怨气 +10086', color: 'text-red-400' },
  { text: '功德已溢出！', color: 'text-yellow-400' },
  { text: '佛祖已离线 🏃', color: 'text-orange-400' },
  { text: '杀气过重！', color: 'text-red-500' },
  { text: '木鱼霸凌！🔨', color: 'text-pink-400' },
  { text: '物理超度！', color: 'text-purple-400' },
  { text: '赛博加特林！', color: 'text-cyan-400' },
  { text: '心率180 💓', color: 'text-red-400' },
  { text: '钮祖禄·施主', color: 'text-yellow-300' },
]

// 暴走模式文案 - 英文 (combo > 5)
const RAGE_TEXTS_EN = [
  { text: 'CRIT HIT! 💥', color: 'text-red-500' },
  { text: 'Rage +10086', color: 'text-red-400' },
  { text: 'Merit Overflow!', color: 'text-yellow-400' },
  { text: 'Buddha Left Chat 🏃', color: 'text-orange-400' },
  { text: 'Too Much Violence!', color: 'text-red-500' },
  { text: 'Fish Abuse! 🔨', color: 'text-pink-400' },
  { text: 'Physical Salvation!', color: 'text-purple-400' },
  { text: 'Cyber Gatling!', color: 'text-cyan-400' },
  { text: 'Heart Rate 180 💓', color: 'text-red-400' },
  { text: 'Degen Unlocked', color: 'text-yellow-300' },
]

// Miss吐槽文案 - 中文
const MISS_TEXTS_CN = [
  '佛祖：这届信徒太难带了 🏃',
  '木鱼：我是来渡你的，不是让你练APM的！',
  '检测到杀气过重，功德 -100',
  '菩萨还没听清愿望就被你敲晕了',
  '别人是诚心礼佛，你是物理超度',
  '求求了，再打我要吐舍利子了',
  '这是积功德？这是积怨气吧！',
  '佛只渡有缘人 🙏',
]

// Miss吐槽文案 - 英文
const MISS_TEXTS_EN = [
  'Buddha: This generation is hopeless 🏃',
  "Fish: I'm here to save you, not for APM training!",
  'Violence detected, Merit -100',
  'Buddha fainted before hearing your wish',
  'Others pray sincerely, you assault physically',
  'Please stop, I\'m about to cough up relics',
  'Is this earning merit? This is earning karma!',
  'Buddha only saves the worthy 🙏',
]

export const WoodenFish: React.FC = () => {
  const { mode } = useThemeStore()
  const { gdBalance, spendGD, addGD } = useGachaStore()
  const { lang } = useLangStore()
  const [merits, setMerits] = useState<MeritPopup[]>([])
  const [totalMerits, setTotalMerits] = useState(0)
  const [combo, setCombo] = useState(0)
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const idRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [clickTargets, setClickTargets] = useState<ClickTarget[]>([])
  const targetIdRef = useRef(0)
  const [missText, setMissText] = useState<string | null>(null)
  const [isFishPressed, setIsFishPressed] = useState(false)
  // gifKey removed - no longer needed
  const [isAnimating, setIsAnimating] = useState(false)
  const [gameMode, setGameMode] = useState<'meditation' | 'merit'>('meditation') // 默认冥想模式
  const [criticalReward, setCriticalReward] = useState<{ amount: number; text: string } | null>(null) // 暴击奖励显示
  const rewardAudioRef = useRef<HTMLAudioElement | null>(null) // 奖励音效
  
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const burnCost = 100

  useEffect(() => {
    audioRef.current = new Audio('/muyu.mp3')
    audioRef.current.volume = 0.5
    
    // 奖励音效 - 使用roll.mp3作为金币滚动音效
    rewardAudioRef.current = new Audio('/sounds/roll.mp3')
    rewardAudioRef.current.volume = 0.7
    
    // 预加载图片避免闪烁
    const preloadGif = new Image()
    preloadGif.src = '/muyu.gif'
    const preloadStatic = new Image()
    preloadStatic.src = '/muyu-static.gif'
  }, [])

  // 根据combo获取表情状态
  const getFishMood = () => {
    if (combo >= 20) return { emoji: '😵', status: 'HP -9999' }
    if (combo >= 10) return { emoji: '😱', status: isEN ? 'HELP!' : '救命！' }
    if (combo >= 5) return { emoji: '😳', status: isEN ? 'Too fast!' : '太快了！' }
    return { emoji: '🙂', status: '' }
  }

  // 根据语言获取文案
  const NORMAL_TEXTS = isEN ? NORMAL_TEXTS_EN : NORMAL_TEXTS_CN
  const RAGE_TEXTS = isEN ? RAGE_TEXTS_EN : RAGE_TEXTS_CN

  // 震动反馈
  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      const intensity = Math.min(combo * 5, 100)
      navigator.vibrate(intensity)
    }
  }

  const spawnNewTarget = useCallback(() => {
    // 在面板范围内生成目标（320x320容器，圈大小64px，需要留边距）
    const maxOffset = 110 // 最大偏移量，确保圈不会超出容器
    const x = (Math.random() - 0.5) * maxOffset * 2
    const y = (Math.random() - 0.5) * maxOffset * 2
    
    const newTarget: ClickTarget = {
      id: targetIdRef.current++,
      x,
      y,
      timestamp: Date.now()
    }
    
    // 只保留一个圈，替换而不是添加
    setClickTargets([newTarget])
    
    // 2秒后自动消失并显示Miss
    setTimeout(() => {
      setClickTargets(prev => {
        const stillExists = prev.find(t => t.id === newTarget.id)
        if (stillExists) {
          // 显示Miss吐槽 - 根据当前语言选择
          const missTexts = lang === 'en' ? MISS_TEXTS_EN : MISS_TEXTS_CN
          const randomMiss = missTexts[Math.floor(Math.random() * missTexts.length)]
          setMissText(randomMiss)
          setTimeout(() => setMissText(null), 2500)
          return prev.filter(t => t.id !== newTarget.id)
        }
        return prev
      })
    }, 2000)
  }, [lang])

  const addMerit = useCallback((shouldSpawnTarget: boolean = true) => {
    // 冥想模式：免费游玩，不消耗代币，有小几率获得GD奖励
    if (gameMode === 'meditation') {
      setTotalMerits(prev => {
        const newTotal = prev + 1
        // 第二次点击后才开始生成随机圈，且只有在点击中心木鱼时才生成
        if (newTotal > 1 && shouldSpawnTarget) {
          spawnNewTarget()
        }
        return newTotal
      })
      setCombo(prev => prev + 1)
      
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current)
      comboTimeoutRef.current = setTimeout(() => setCombo(0), 1500)

      // Play sound with pitch variation based on combo
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        // 根据combo调整播放速度（变调效果）
        if (combo >= 20) {
          audioRef.current.playbackRate = 2.5 // 疯魔模式
        } else if (combo >= 10) {
          audioRef.current.playbackRate = 1.8 // 暴走前奏
        } else if (combo >= 5) {
          audioRef.current.playbackRate = 1.3 // 加速
        } else {
          audioRef.current.playbackRate = 1.0 // 正常
        }
        audioRef.current.play().catch(() => {})
      }
      
      // 触发震动
      triggerVibration()
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 800)

      // 冥想模式：10%几率获得小额GD奖励（1-10 GD）
      let gdReward = 0
      let gdRewardText = ''
      const randomValue = Math.random()
      
      if (randomValue < 0.1) {
        gdReward = Math.floor(Math.random() * 10) + 1 // 1-10 GD
        addGD(gdReward)
        gdRewardText = isEN ? `💰 +${gdReward} $GD!` : `💰 +${gdReward} $GD！`
      }
      
      const isGDReward = gdReward > 0
      
      // 根据combo选择文案：combo > 5 进入暴走模式
      const textPool = combo > 5 ? RAGE_TEXTS : NORMAL_TEXTS
      const randomItem = textPool[Math.floor(Math.random() * textPool.length)]
      
      // 决定显示哪个文案（优先级：GD奖励 > 普通）
      let displayText = randomItem.text
      let displayColor = randomItem.color
      
      if (isGDReward) {
        displayText = gdRewardText
        displayColor = 'text-green-400'
      }
      
      const newMerit: MeritPopup = {
        id: idRef.current++,
        x: Math.random() * 120 - 60,
        y: Math.random() * 40 - 60,
        text: displayText,
        color: displayColor,
      }
      setMerits(prev => [...prev.slice(-15), newMerit])
      setTimeout(() => setMerits(prev => prev.filter(m => m.id !== newMerit.id)), 1000)
      
      return true
    }
    // 功德模式：消耗代币，有概率暴击和获得GD
    else if (gameMode === 'merit') {
      if (gdBalance < burnCost) return false
      
      spendGD(burnCost)
      
      // 20%概率触发暴击（佛祖显灵）- 增加暴击几率
      const isCriticalHit = Math.random() < 0.2
      let meritBonus = 1
      let criticalText = ''
      
      if (isCriticalHit) {
        meritBonus = 10 // 暴击获得10倍功德
        criticalText = isEN ? '✨ BUDDHA BLESS! 10x MERIT! ✨' : '✨ 佛祖显灵！功德x10！ ✨'
      }
      
      // GD奖励逻辑 - 增加100 GD以上暴击几率
      let gdReward = 0
      let gdRewardText = ''
      const randomValue = Math.random()
      
      // 微小概率：10000 GD (0.5%) - 增加
      if (randomValue < 0.005) {
        gdReward = 10000
        addGD(gdReward)
        gdRewardText = isEN ? `💰💰💰 MEGA JACKPOT! +${gdReward} $GD! 💰💰💰` : `💰💰💰 功德无量！+${gdReward} $GD！ 💰💰💰`
        
        // 触发暴击奖励特别放大显示
        setCriticalReward({
          amount: gdReward,
          text: gdRewardText
        })
        
        // 播放奖励音效
        if (rewardAudioRef.current) {
          rewardAudioRef.current.currentTime = 0
          rewardAudioRef.current.playbackRate = 1.0
          rewardAudioRef.current.play().catch(() => {})
        }
        
        setTimeout(() => setCriticalReward(null), 3000) // 3秒后消失
      }
      // 微小概率：5000 GD (1%) - 增加
      else if (randomValue < 0.015) {
        gdReward = 5000
        addGD(gdReward)
        gdRewardText = isEN ? `💰💰💰 SUPER JACKPOT! +${gdReward} $GD! 💰💰💰` : `💰💰💰 功德圆满！+${gdReward} $GD！ 💰💰💰`
        
        // 触发暴击奖励特别放大显示
        setCriticalReward({
          amount: gdReward,
          text: gdRewardText
        })
        
        // 播放奖励音效
        if (rewardAudioRef.current) {
          rewardAudioRef.current.currentTime = 0
          rewardAudioRef.current.playbackRate = 1.0
          rewardAudioRef.current.play().catch(() => {})
        }
        
        setTimeout(() => setCriticalReward(null), 3000) // 3秒后消失
      }
      // 概率：1000 GD (3%) - 增加
      else if (randomValue < 0.045) {
        gdReward = 1000
        addGD(gdReward)
        gdRewardText = isEN ? `💰💰💰 JACKPOT! +${gdReward} $GD! 💰💰💰` : `💰💰💰 功德暴击！+${gdReward} $GD！ 💰💰💰`
        
        // 触发暴击奖励特别放大显示
        setCriticalReward({
          amount: gdReward,
          text: gdRewardText
        })
        
        // 播放奖励音效
        if (rewardAudioRef.current) {
          rewardAudioRef.current.currentTime = 0
          rewardAudioRef.current.playbackRate = 1.0
          rewardAudioRef.current.play().catch(() => {})
        }
        
        setTimeout(() => setCriticalReward(null), 3000) // 3秒后消失
      }
      // 概率：200 GD (10%) - 新增中等奖励
      else if (randomValue < 0.145) {
        gdReward = 200
        addGD(gdReward)
        gdRewardText = isEN ? `💰💰 NICE! +${gdReward} $GD! 💰💰` : `💰💰 不错！+${gdReward} $GD！ 💰💰`
      }
      // 最大概率：50 GD (50%)
      else if (randomValue < 0.645) {
        gdReward = 50 // 固定50 GD
        addGD(gdReward)
        gdRewardText = isEN ? `💰 +${gdReward} $GD!` : `💰 +${gdReward} $GD！`
      }
      // 小概率不给：35.5% (randomValue >= 0.645)
      
      const isGDReward = gdReward > 0
      
      setTotalMerits(prev => {
        const newTotal = prev + meritBonus
        // 第二次点击后才开始生成随机圈，且只有在点击中心木鱼时才生成
        if (newTotal > 1 && shouldSpawnTarget) {
          spawnNewTarget()
        }
        return newTotal
      })
      setCombo(prev => prev + 1)
      
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current)
      comboTimeoutRef.current = setTimeout(() => setCombo(0), 1500)

      // Play sound with pitch variation based on combo
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        // 暴击时使用特殊音效
        if (isCriticalHit) {
          audioRef.current.playbackRate = 1.5 // 暴击音效更高亢
        } else if (combo >= 20) {
          audioRef.current.playbackRate = 2.5 // 疯魔模式
        } else if (combo >= 10) {
          audioRef.current.playbackRate = 1.8 // 暴走前奏
        } else if (combo >= 5) {
          audioRef.current.playbackRate = 1.3 // 加速
        } else {
          audioRef.current.playbackRate = 1.0 // 正常
        }
        audioRef.current.play().catch(() => {})
      }
      
      // 触发震动 - 暴击时震动更强
      if ('vibrate' in navigator) {
        const intensity = isCriticalHit ? 200 : Math.min(combo * 5, 100)
        navigator.vibrate(intensity)
      }
      
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), isCriticalHit ? 1200 : 800)

      // 根据combo选择文案：combo > 5 进入暴走模式
      const textPool = combo > 5 ? RAGE_TEXTS : NORMAL_TEXTS
      const randomItem = textPool[Math.floor(Math.random() * textPool.length)]
      
      // 决定显示哪个文案（优先级：GD奖励 > 暴击 > 普通）
      let displayText = randomItem.text
      let displayColor = randomItem.color
      
      if (isGDReward) {
        displayText = gdRewardText
        displayColor = 'text-green-400'
      } else if (isCriticalHit) {
        displayText = criticalText
        displayColor = 'text-yellow-400'
      }
      
      const newMerit: MeritPopup = {
        id: idRef.current++,
        x: Math.random() * 120 - 60,
        y: Math.random() * 40 - 60,
        text: displayText,
        color: displayColor,
      }
      setMerits(prev => [...prev.slice(-15), newMerit])
      setTimeout(() => setMerits(prev => prev.filter(m => m.id !== newMerit.id)), isCriticalHit ? 2000 : 1000)
      
      return true
    }
    
    return false
  }, [gdBalance, spendGD, addGD, spawnNewTarget, combo, gameMode, isEN])

  const handleTargetClick = useCallback((targetId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    // 移除目标
    setClickTargets(prev => prev.filter(t => t.id !== targetId))
    // 触发功德并生成新圈
    addMerit(true)
  }, [addMerit])

  const handleCenterClick = () => {
    // 只有在没有随机圈时才响应中心点击（第一次点击）
    if (clickTargets.length === 0) {
      setIsFishPressed(true)
      setTimeout(() => setIsFishPressed(false), 150)
      addMerit()
    }
  }

  // 不在初始时生成目标，等第一次点击后才开始


  const getTitle = () => {
    if (totalMerits >= 10000) return '赛博活佛 Cyber Buddha'
    if (totalMerits >= 5000) return '功德圆满 Merit Master'
    if (totalMerits >= 1000) return '虔诚信徒 Devoted One'
    if (totalMerits >= 100) return '善良韭菜 Kind Leek'
    return '迷途羔羊 Lost Soul'
  }

  return (
    <div className="flex flex-col items-center justify-center -mt-4">
      {/* 模式切换开关 */}
      <div className={`mb-6 flex flex-col items-center ${isDegen ? 'font-pixel' : ''}`}>
        <div className={`text-lg font-bold mb-2 ${isDegen ? 'text-degen-cyan' : 'text-gray-400'}`}>
          {isEN ? 'Game Mode' : '游戏模式'}
        </div>
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${gameMode === 'meditation' ? (isDegen ? 'text-degen-green font-bold' : 'text-green-500 font-bold') : 'text-gray-500'}`}>
            {isEN ? '🧘 Meditation' : '🧘 冥想模式'}
          </span>
          <button
            onClick={() => setGameMode(gameMode === 'meditation' ? 'merit' : 'meditation')}
            className={`
              relative inline-flex h-8 w-16 items-center rounded-full
              transition-colors duration-300 focus:outline-none
              ${gameMode === 'merit'
                ? (isDegen ? 'bg-degen-purple' : 'bg-goldman-gold')
                : (isDegen ? 'bg-degen-green' : 'bg-gray-600')
              }
            `}
          >
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white
                transition-transform duration-300
                ${gameMode === 'merit' ? 'translate-x-9' : 'translate-x-1'}
                ${gameMode === 'merit' ? (isDegen ? 'shadow-degen-glow' : 'shadow-gold-glow') : ''}
              `}
            />
          </button>
          <span className={`text-sm ${gameMode === 'merit' ? (isDegen ? 'text-degen-yellow font-bold' : 'text-yellow-500 font-bold') : 'text-gray-500'}`}>
            {isEN ? '🔥 Merit Burn' : '🔥 功德模式'}
          </span>
        </div>
        <div className={`mt-2 text-xs ${isDegen ? 'text-degen-pink' : 'text-gray-500'}`}>
          {gameMode === 'meditation'
            ? (isEN ? 'Free play, no token consumption' : '免费游玩，不消耗代币')
            : (isEN ? 'Burns $GD tokens, earns real merit' : '消耗$GD代币，积累真实功德')
          }
        </div>
      </div>

      {/* 功德计数器 */}
      <div className={`text-center mb-6 ${isDegen ? 'font-pixel' : ''}`}>
        <div className={`text-5xl font-bold mb-2 ${isDegen ? 'text-degen-yellow neon-text' : 'text-goldman-gold'}`}>
          {totalMerits.toLocaleString()}
        </div>
        <div className={`text-lg ${isDegen ? 'text-degen-green' : 'text-gray-400'}`}>
          {isEN ? 'Merit' : '功德 Merit'}
        </div>
        <div className={`text-base mt-1 ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold/70'}`}>
          {getTitle()}
        </div>
        <div className={`text-lg font-bold mt-2 h-7 ${isDegen ? 'text-degen-pink' : 'text-orange-400'}`}>
          {combo > 3 ? `🔥 COMBO x${combo}` : ''}
        </div>
      </div>

      {/* 木鱼容器 - 包含随机圈 */}
      <div className="relative" style={{ width: '320px', height: '320px' }}>
        {/* 木鱼按钮 - 居中 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '192px',
            height: '192px'
          }}
        >
          <button
            onClick={handleCenterClick}
            disabled={gameMode === 'merit' && gdBalance < burnCost}
            style={{
              width: '100%',
              height: '100%',
              boxShadow: isFishPressed
                ? (gameMode === 'merit'
                   ? (isDegen ? '0 0 80px #ffd700' : '0 0 80px #ffd700')
                   : (isDegen ? '0 0 60px #39ff14' : '0 0 60px #c9a962'))
                : (gameMode === 'merit'
                   ? (isDegen ? '0 0 40px rgba(255,215,0,0.5)' : '0 0 40px rgba(255,215,0,0.5)')
                   : (isDegen ? '0 0 30px rgba(57,255,20,0.25)' : '0 0 30px rgba(201,169,98,0.25)'))
            }}
            className={`
              rounded-full flex items-center justify-center
              cursor-pointer select-none
              ${gameMode === 'merit' && gdBalance < burnCost ? 'cursor-default opacity-50' : ''}
              ${gameMode === 'merit'
                ? (isDegen
                   ? 'bg-gradient-to-br from-yellow-400/40 to-amber-600/40 border-4 border-yellow-400'
                   : 'bg-gradient-to-br from-yellow-300/40 to-amber-700/40 border-4 border-yellow-400')
                : (isDegen
                   ? 'bg-gradient-to-br from-degen-green/30 to-degen-purple/30 border-4 border-degen-green'
                   : 'bg-gradient-to-br from-goldman-gold/20 to-amber-900/30 border-4 border-goldman-gold')
              }
              ${gameMode === 'merit' ? 'animate-pulse-slow' : ''}
            `}
          >
          {/* 静态图 - 始终存在，点击时隐藏 */}
          <img
            src="/muyu-static.gif"
            alt={isEN ? "Wooden Fish" : "木鱼"}
            className={`w-44 h-44 object-cover rounded-full select-none absolute inset-0 m-auto transition-opacity duration-75 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            draggable={false}
          />
          {/* 动态GIF - 始终存在，点击时显示 */}
          <img
            src="/muyu.gif"
            alt={isEN ? "Wooden Fish Animation" : "木鱼动画"}
            className={`w-44 h-44 object-cover rounded-full select-none transition-opacity duration-75 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            draggable={false}
          />
          
          {/* 功德模式光晕效果 */}
          {gameMode === 'merit' && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-500/10 to-yellow-400/20 animate-glow-slow"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-amber-600/10 animate-spin-slow"></div>
            </div>
          )}
          
        </button>
        </div>
        
        {/* 表情状态气泡 - 居中显示在木鱼上方 */}
        <AnimatePresence>
          {combo >= 5 && (
            <motion.div
              key="mood"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute text-4xl z-20 left-1/2 -translate-x-1/2"
              style={{ 
                top: '10%',
                filter: combo >= 20 ? 'hue-rotate(180deg)' : 'none' 
              }}
            >
              {getFishMood().emoji}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* HP状态 - 居中显示在木鱼下方 */}
        <AnimatePresence>
          {combo >= 10 && (
            <motion.div
              key="hp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`absolute text-sm font-bold z-20 pointer-events-none left-1/2 -translate-x-1/2 ${combo >= 20 ? 'text-red-500' : 'text-orange-400'}`}
              style={{ bottom: '15%' }}
            >
              {getFishMood().status}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 随机圈 - 围绕木鱼 */}
        <AnimatePresence>
          {clickTargets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={(e) => handleTargetClick(target.id, e)}
              disabled={gameMode === 'merit' && gdBalance < burnCost}
              style={{
                position: 'absolute',
                left: `calc(50% + ${target.x}px)`,
                top: `calc(50% + ${target.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                cursor-pointer select-none pointer-events-auto
                ${gameMode === 'merit' && gdBalance < burnCost ? 'opacity-50 cursor-not-allowed' : ''}
                border-2 border-dashed
                ${isDegen ? 'border-gray-400 bg-gray-800/30' : 'border-gray-500 bg-gray-700/20'}
              `}
            >
              {/* 倒计时圈 */}
              <motion.div
                initial={{ scale: 1.5, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 2, ease: 'linear' }}
                className={`absolute inset-0 rounded-full border-2 ${isDegen ? 'border-gray-500' : 'border-gray-400'}`}
              />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* 功德+1 弹出 - 完全居中 */}
        <AnimatePresence>
          {merits.map((merit) => (
            <motion.div
              key={merit.id}
              initial={{ opacity: 1, scale: 0.8 }}
              animate={{ opacity: 0, y: -60, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div 
                className={`
                  font-bold text-xl text-center
                  w-[280px] px-2
                  ${isDegen ? `font-pixel text-lg ${merit.color}` : 'text-goldman-gold'}
                `}
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {merit.text} ✨
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Miss 吐槽 - 完全居中 */}
        <AnimatePresence>
          {missText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              className={`
                absolute inset-0 flex items-center justify-center
                pointer-events-none z-20
              `}
            >
              <div 
                className={`
                  font-bold text-xl text-center
                  w-[280px] px-3 py-2 rounded-lg
                  ${isDegen ? 'font-pixel text-degen-pink bg-black/50' : 'text-red-400 bg-black/40'}
                `}
                style={{ textShadow: '0 0 15px currentColor' }}
              >
                {missText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 暴击奖励特别放大显示 - 透明背景版 */}
      <AnimatePresence>
        {criticalReward && (
          <motion.div
            key="critical-reward"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            {/* 半透明遮罩 */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* 中心奖励卡片 - 透明背景无描边 */}
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{
                scale: 1,
                y: 0
              }}
              transition={{
                duration: 0.4,
                type: 'spring',
                stiffness: 200
              }}
              className="relative z-10 text-center px-8 py-10 rounded-2xl bg-black/70 backdrop-blur-sm max-w-lg w-full mx-4"
            >
              {/* 标题 - 金色字 */}
              <div className="text-4xl font-bold mb-4 text-yellow-400">
                {isEN ? '🎯 JACKPOT! 🎯' : '🎯 功德暴击！ 🎯'}
              </div>
              
              {/* 奖励金额 - 金色字 */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.8,
                  times: [0, 0.5, 1],
                  repeat: 1
                }}
                className="text-6xl font-bold mb-6 text-yellow-300"
              >
                +{criticalReward.amount} $GD
              </motion.div>
              
              {/* 奖励描述 - 白色字 */}
              <div className="text-2xl mb-6 text-white">
                {criticalReward.text}
              </div>
              
              {/* 庆祝文字 - 红色字 */}
              <motion.div
                animate={{
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity
                }}
                className="text-xl text-red-400 font-bold"
              >
                {isEN ? '🎉 Congratulations! 🎉' : '🎉 恭喜发财！ 🎉'}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 操作提示 - 紧跟木鱼下方 */}
      <div className={`text-center ${isDegen ? 'font-pixel text-base' : 'text-lg'}`}>
        <p className={isDegen ? 'text-degen-green' : 'text-gray-400'}>
          {clickTargets.length > 0
            ? (isEN ? 'CATCH THE CIRCLE! ⭕' : '快点圈圈！')
            : (isEN ? 'CLICK THE FROG TO START 🐸' : '点击蛙蛙开始')
          }
        </p>
        <p className={`mt-1 text-lg ${isDegen ? 'text-degen-pink' : 'text-gray-500'}`}>
          {isEN ? `Cost: ${burnCost} $GD each` : `每次消耗 ${burnCost} $GD`}
        </p>
      </div>

      {/* 余额不足提示 */}
      {gdBalance < burnCost && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 px-4 py-2 rounded-lg ${isDegen ? 'bg-red-900/50 text-degen-pink' : 'bg-red-900/30 text-red-400'}`}
        >
          {isEN ? '💸 Insufficient $GD, go earn more!' : '💸 $GD不足，请先充值功德'}
        </motion.div>
      )}

      {/* Slogan */}
      <motion.p 
        className={`mt-6 text-center italic ${isDegen ? 'text-degen-cyan font-pixel text-xl' : 'text-gray-500 text-xl'}`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {isDegen 
          ? (isEN ? '"V ME 50, BUDDHA BLESS U"' : '"V我50，佛祖保佑"')
          : (isEN ? '"Burn $GD, Fix Karma"' : '"燃烧$GD，消除业障"')
        }
      </motion.p>
    </div>
  )
}

export default WoodenFish

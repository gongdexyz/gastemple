import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'
import { useWalletStore } from '../stores/walletStore'
import { useEffectsStore } from '../stores/effectsStore'
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { createTransferInstruction, getAssociatedTokenAddress, getAccount } from '@solana/spl-token'
import { WithdrawalDialog } from './WithdrawalDialog'

// 扩展全局窗口接口以包含Phantom钱包的完整类型
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean
        connect: () => Promise<{ publicKey: { toString: () => string } }>
        signTransaction: (transaction: Transaction) => Promise<Transaction>
        signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>
      }
    }
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      signTransaction: (transaction: Transaction) => Promise<Transaction>
      signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>
    }
  }
}

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
  const { triggerBurnEffect } = useEffectsStore()
  const [merits, setMerits] = useState<MeritPopup[]>([])
  const [totalMerits, setTotalMerits] = useState(0) // 本次修行功德
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
  const fishButtonRef = useRef<HTMLButtonElement | null>(null) // 木鱼按钮引用
  
  // 伪随机保底系统
  const [currentCritRate, setCurrentCritRate] = useState(0.03) // 当前暴击率（3%基础）
  const [critStreak, setCritStreak] = useState(0) // 连续未暴击次数
  const [hiddenCombo, setHiddenCombo] = useState(0) // 隐藏连击值（用于手感加权）
  
  // 三重暴击等级系统
  const [lastCritTime, setLastCritTime] = useState<number | null>(null) // 上次暴击时间
  const [todayFirstHit, setTodayFirstHit] = useState(true) // 今日第一次必爽
  
  
  // 屏幕停顿效果
  const [isScreenPaused, setIsScreenPaused] = useState(false)
  
  // 暴击等级反馈
  const [critLevel, setCritLevel] = useState<'normal' | 'rare' | 'epic' | null>(null)
  
  // 自动挂机相关状态
  const [isAutoClicking, setIsAutoClicking] = useState(false)
  const [autoClickInterval, setAutoClickInterval] = useState<NodeJS.Timeout | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showWithdrawal, setShowWithdrawal] = useState(false) // 提现弹窗
  
  // 收款地址和SKR合约地址（从环境变量读取）
  const RECIPIENT_ADDRESS = import.meta.env.VITE_RECIPIENT_ADDRESS || '这里填你自己的Solana钱包地址'
  const SKR_TOKEN_ADDRESS = import.meta.env.VITE_SKR_TOKEN_ADDRESS || '这里填 SKR 的 Token Address'
  
  // 检查是否为 SKR 测试模式 - URL带 ?test=skr 或 ?test=demo 或 ?test=all 即可免费使用自动挂机
  const isSKRTestMode = () => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    const testParam = params.get('test')
    return testParam === 'skr' || testParam === 'demo' || testParam === 'all'
  }
  
  // 检查是否为 GONGDE 测试模式 - URL带 ?test=gongde 或 ?test=demo 或 ?test=all 即可无限余额
  const isGongdeTestMode = () => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    const testParam = params.get('test')
    return testParam === 'gongde' || testParam === 'demo' || testParam === 'all'
  }
  
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const burnCost = 100
  const { solanaAddress } = useWalletStore()
  
  // 自动挂机系统状态
  const [autoClickMultiplier, setAutoClickMultiplier] = useState(0) // 0=无, 1=33 SKR, 3=66 SKR, 5=108 SKR
  const [autoClickEndTime, setAutoClickEndTime] = useState<number | null>(null) // 结束时间戳
  const [showAutoClickOptions, setShowAutoClickOptions] = useState(false) // 是否显示选项
  
  // 自动挂机价格选项（根据游戏模式不同）
  const getAutoClickOptions = () => {
    if (gameMode === 'merit') {
      // 功德模式：价格 5 倍（因为有暴击奖励）
      return [
        { price: 100, multiplier: 1, label: '自动代敲', description: '小沙弥为你代劳', emoji: '🤖' },
        { price: 250, multiplier: 3, label: '功德加持', description: '功德×3，效率提升', emoji: '✨' },
        { price: 400, multiplier: 5, label: '方丈加持', description: '法力无边，功德×5', emoji: '👨‍🦲' }
      ]
    } else {
      // 冥想模式：新定价策略（让玩家觉得能回本）
      return [
        { price: 20, multiplier: 1, label: '自动代敲', description: '小沙弥为你代劳', emoji: '🤖' },
        { price: 50, multiplier: 3, label: '功德加持', description: '功德×3，效率提升', emoji: '✨' },
        { price: 80, multiplier: 5, label: '方丈加持', description: '法力无边，功德×5', emoji: '👨‍🦲' }
      ]
    }
  }
  
  const AUTO_CLICK_OPTIONS = getAutoClickOptions()
  
  // GD ↔ SKR 兑换比例（从环境变量读取）
  const EXCHANGE_RATE = {
    GD_TO_SKR: parseFloat(import.meta.env.VITE_GD_TO_SKR_RATE || '2000'),  // 2000 GD = 1 SKR
    SKR_TO_GD: parseFloat(import.meta.env.VITE_SKR_TO_GD_RATE || '1500'),  // 1 SKR = 1500 GD
    // 你的利润：每次兑换抽成 25%
  }
  
  // 检查自动挂机是否有效
  const isAutoClickActive = autoClickMultiplier > 0 && autoClickEndTime && Date.now() < autoClickEndTime
  
  // 剩余时间格式化
  const getRemainingTime = () => {
    if (!autoClickEndTime) return '0:00'
    const remaining = Math.max(0, autoClickEndTime - Date.now())
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }
  
  // 检查是否是今天第一次
  useEffect(() => {
    const today = new Date().toDateString()
    const lastPlayDate = localStorage.getItem('lastPlayDate')
    if (lastPlayDate !== today) {
      setTodayFirstHit(true)
      localStorage.setItem('lastPlayDate', today)
    } else {
      setTodayFirstHit(false)
    }
  }, [])
  

  useEffect(() => {
    audioRef.current = new Audio('/muyu.mp3')
    audioRef.current.volume = 0.5
    
    // 暴击音效 - 使用getcoin.mp3作为暴击金币音效
    rewardAudioRef.current = new Audio('/sounds/getcoin.mp3')
    rewardAudioRef.current.volume = 0.8
    
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
          
          // Miss时清零隐藏连击值
          setHiddenCombo(0)
          
          return prev.filter(t => t.id !== newTarget.id)
        }
        return prev
      })
    }, 2000)
  }, [lang])

  const addMerit = useCallback((shouldSpawnTarget: boolean = true): boolean => {
    // 冥想模式：免费游玩，不消耗代币，有小几率获得GD奖励
    if (gameMode === 'meditation') {
      setTotalMerits(prev => {
        const newTotal = prev + 1
        // 只有在手动点击且点击次数>1时才生成随机圈
        // 自动挂机时不生成随机圈（shouldSpawnTarget === false）
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

      // 冥想模式：GD奖励（根据是否自动挂机调整）
      let gdReward = 0
      let gdRewardText = ''
      const randomValue = Math.random()
      
      // 自动挂机时大幅降低奖励，避免产出过高
      const isAutoMode = !shouldSpawnTarget
      
      // 从环境变量读取参数（创世期配置）
      const globalMultiplier = parseFloat(import.meta.env.VITE_GLOBAL_OUTPUT_MULTIPLIER || '1.2')
      const manualRate = parseFloat(import.meta.env.VITE_MEDITATION_MANUAL_RATE || '0.20')
      const manualMin = parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MIN || '6')
      const manualMax = parseInt(import.meta.env.VITE_MEDITATION_MANUAL_MAX || '18')
      const autoRate = parseFloat(import.meta.env.VITE_AUTO_CLICK_REWARD_RATE || '0.15')
      const autoMin = parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MIN || '1')
      const autoMax = parseInt(import.meta.env.VITE_AUTO_CLICK_REWARD_MAX || '12')
      
      if (isAutoMode) {
        // 自动挂机：15%几率获得 1-10 GD（提高波动性）
        if (randomValue < autoRate) {
          gdReward = Math.floor(Math.random() * (autoMax - autoMin + 1)) + autoMin
          
          // 随机福报：10% 概率双倍奖励
          if (Math.random() < 0.10) {
            gdReward *= 2
            gdRewardText = isEN ? `💰 🎉 BLESSED! +${gdReward} $GONGDE!` : `💰 🎉 福报加持！+${gdReward} $GONGDE！`
          } else {
            gdRewardText = isEN ? `💰 +${gdReward} $GONGDE!` : `💰 +${gdReward} $GONGDE！`
          }
          
          addGD(gdReward)
        }
      } else {
        // 手动点击：20%几率获得 5-15 GD
        if (randomValue < manualRate) {
          gdReward = Math.floor(Math.random() * (manualMax - manualMin + 1)) + manualMin
          addGD(gdReward)
          gdRewardText = isEN ? `💰 +${gdReward} $GONGDE!` : `💰 +${gdReward} $GONGDE！`
        }
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
      
      // 返回是否产生了收益
      return isGDReward
    }
    // 功德模式：消耗代币，有概率暴击和获得GD
    else if (gameMode === 'merit') {
      // 测试模式跳过余额检查
      if (!isGongdeTestMode() && gdBalance < burnCost) return false
      
      if (!isGongdeTestMode()) {
        spendGD(burnCost)
      }
      
      // 伪随机保底系统 + 连击手感加权 + 三重暴击等级
      // 【创世期·拉新配置】基础暴击率 10%，让新用户体验更爽
      const baseCritRate = parseFloat(import.meta.env.VITE_GONGDE_CRIT_RATE || '0.10')
      const streakBonus = critStreak * 0.007 // 未暴击次数加成
      const comboBonus = hiddenCombo * 0.008 // 连击手感加成
      
      // 今日第一次必爽：暴击概率翻倍
      const firstHitBonus = todayFirstHit ? baseCritRate : 0
      
      // 计算实际暴击率（上限不超过 35%）
      let actualCritRate = Math.min(baseCritRate + streakBonus + comboBonus + firstHitBonus, 0.35)
      
      // 节奏心理保底：连续12次未暴击且成功率≥70%时强制暴击
      const shouldForceCrit = critStreak >= 12 && actualCritRate >= 0.7
      
      // 判断是否暴击
      const isCriticalHit = shouldForceCrit || Math.random() < actualCritRate
      let meritBonus = 1
      let gdRewardMultiplier = 1
      let criticalText = ''
      let critType: 'normal' | 'rare' | 'epic' = 'normal'
      
      if (isCriticalHit) {
        // 触发能量传输特效 - 暴击模式（只在功德模式下触发）
        if (gameMode === 'merit' && fishButtonRef.current && shouldSpawnTarget) {
          const rect = fishButtonRef.current.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          triggerBurnEffect({ x: centerX, y: centerY }, true) // 传递 true 表示暴击
        }
        
        // 确定暴击等级
        const critRoll = Math.random()
        let gdReward = 0
        
        // 三重暴击等级概率
        // 三重暴击等级概率（创世期配置）
        const maxReward = parseInt(import.meta.env.VITE_GONGDE_MAX_REWARD || '10000')
        const bigWinMultiplier = parseInt(import.meta.env.VITE_GONGDE_BIG_WIN_MULTIPLIER || '10')
        
        if (hiddenCombo >= 5 && critRoll < 0.06) {
          // 天启级暴击 (6%) - 需要combo≥5
          critType = 'epic'
          gdRewardMultiplier = bigWinMultiplier
          gdReward = maxReward
          criticalText = isEN ? `✨ HEAVENLY REVELATION! ${maxReward} $GONGDE! ✨` : `✨ 天启降临！${maxReward} $GONGDE！ ✨`
        } else if (hiddenCombo >= 3 && critRoll < 0.28) {
          // 福报级暴击 (22%) - 需要combo≥3
          critType = 'rare'
          gdRewardMultiplier = 3
          gdReward = Math.floor(maxReward * 0.3) // 30% of max
          criticalText = isEN ? `✨ KARMIC BLESSING! ${gdReward} $GONGDE! ✨` : `✨ 福报加持！${gdReward} $GONGDE！ ✨`
        } else {
          // 因果级暴击 (72%)
          critType = 'normal'
          gdRewardMultiplier = 1.5
          gdReward = Math.floor(maxReward * 0.15) // 15% of max
          criticalText = isEN ? `✨ BUDDHA BLESS! ${gdReward} $GONGDE! ✨` : `✨ 佛祖显灵！${gdReward} $GONGDE！ ✨`
        }
        
        // 自动挂机时降低奖励 70%
        if (!shouldSpawnTarget) {
          gdReward = Math.floor(gdReward * 0.7)
        }
        
        // 设置暴击等级反馈
        setCritLevel(critType)
        setTimeout(() => setCritLevel(null), 6000) // 延长到6秒，让玩家看清
        
        meritBonus = 10 // 暴击获得10倍功德
        
        // 屏幕停顿效果（延长到1000ms）
        setIsScreenPaused(true)
        setTimeout(() => setIsScreenPaused(false), 1000)
        
        // 添加GD奖励
        addGD(gdReward)
        
        // 设置暴击奖励显示（用于UI展示）
        setCriticalReward({
          amount: gdReward,
          text: criticalText
        })
        setTimeout(() => setCriticalReward(null), 6000) // 延长到6秒
        
        // 播放奖励音效
        if (rewardAudioRef.current) {
          rewardAudioRef.current.currentTime = 0
          rewardAudioRef.current.playbackRate = 1.0
          rewardAudioRef.current.play().catch(() => {})
        }
        
        // 暴击后重置保底计数和今日第一次标记
        setCritStreak(0)
        setCurrentCritRate(baseCritRate)
        if (todayFirstHit) {
          setTodayFirstHit(false)
        }
        
        // 记录暴击时间
        setLastCritTime(Date.now())
      } else {
        // 未暴击时增加保底计数
        setCritStreak(prev => prev + 1)
        setCurrentCritRate(actualCritRate)
      }
      
      // 更新隐藏连击值（点击质量判断）
      // 这里简化：每次点击都增加连击值，但miss时会清零
      setHiddenCombo(prev => {
        // 如果有随机圈且点击准确，增加更多
        if (clickTargets.length > 0) {
          return prev + 1.5 // Perfect点击
        }
        return prev + 1 // Good点击
      })
      
      // 非暴击时的小额GD奖励（按照 0.85 期望值设计）
      if (!isCriticalHit) {
        const randomValue = Math.random()
        let smallGdReward = 0
        
        // 奖池分布（期望值 0.85）
        // 50% 概率：0 GD（销毁）
        // 30% 概率：80 GD（微损）
        // 15% 概率：150 GD（小赚）
        // 4% 概率：500 GD（大赚）
        // 1% 概率：2000 GD（天选）
        
        if (randomValue < 0.50) {
          smallGdReward = 0 // 50% 什么都没有
        } else if (randomValue < 0.80) {
          smallGdReward = 80 // 30% 回本
        } else if (randomValue < 0.95) {
          smallGdReward = 150 // 15% 小赚
        } else if (randomValue < 0.99) {
          smallGdReward = 500 // 4% 大赚
        } else {
          smallGdReward = 2000 // 1% 天选
        }
        
        // 自动挂机时降低奖励 70%
        if (!shouldSpawnTarget && smallGdReward > 0) {
          smallGdReward = Math.floor(smallGdReward * 0.7)
        }
        
        if (smallGdReward > 0) {
          addGD(smallGdReward)
        }
      }
      
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
      
      // 决定显示哪个文案（暴击优先显示暴击文案）
      let displayText = randomItem.text
      let displayColor = randomItem.color
      
      if (isCriticalHit) {
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
    
    // 触发功德并生成新圈，获取是否有收益
    const hasReward = addMerit(true)
    
    // 只有在有收益时才触发能量传输效果
    if (hasReward) {
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      triggerBurnEffect({ x: centerX, y: centerY })
    }
  }, [addMerit, triggerBurnEffect])

  const handleCenterClick = (e: React.MouseEvent) => {
    // 只有在没有随机圈时才响应中心点击（第一次点击）
    if (clickTargets.length === 0) {
      setIsFishPressed(true)
      setTimeout(() => setIsFishPressed(false), 150)
      
      // 触发功德，获取是否有收益
      const hasReward = addMerit()
      
      // 只有在有收益时才触发能量传输效果
      if (hasReward && fishButtonRef.current) {
        const rect = fishButtonRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        triggerBurnEffect({ x: centerX, y: centerY })
      }
    }
  }

  // 不在初始时生成目标，等第一次点击后才开始

  // 检查自动挂机是否过期
  useEffect(() => {
    const checkExpiry = () => {
      if (autoClickEndTime && Date.now() >= autoClickEndTime) {
        // 自动挂机已过期
        setIsAutoClicking(false)
        setAutoClickMultiplier(0)
        setAutoClickEndTime(null)
      }
    }
    
    // 立即检查一次
    checkExpiry()
    
    // 每30秒检查一次
    const expiryInterval = setInterval(checkExpiry, 30000)
    
    return () => clearInterval(expiryInterval)
  }, [autoClickEndTime])
  
  // 自动挂机定时器 - 考虑倍率
  useEffect(() => {
    if (isAutoClicking && !autoClickInterval) {
      const interval = setInterval(() => {
        // 根据倍率多次调用addMerit
        const multiplier = autoClickMultiplier || 1
        for (let i = 0; i < multiplier; i++) {
          addMerit(false) // 自动挂机时不生成随机圈
        }
      }, 1000) // 每1秒自动点击一次
      setAutoClickInterval(interval)
    } else if (!isAutoClicking && autoClickInterval) {
      clearInterval(autoClickInterval)
      setAutoClickInterval(null)
    }
    
    return () => {
      if (autoClickInterval) {
        clearInterval(autoClickInterval)
      }
    }
  }, [isAutoClicking, autoClickInterval, addMerit, autoClickMultiplier])
  
  // 支付成功后自动开始挂机
  useEffect(() => {
    if (paymentSuccess) {
      setIsAutoClicking(true)
      // 3秒后隐藏成功提示
      const timer = setTimeout(() => {
        setPaymentSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [paymentSuccess])
  
  // 处理雇佣赛博方丈支付
  const handleHireMonk = async () => {
    if (!solanaAddress) {
      setPaymentError(isEN ? 'Please connect Phantom wallet first' : '请先连接Phantom钱包')
      return
    }
    
    if (RECIPIENT_ADDRESS === '这里填你自己的Solana钱包地址' || SKR_TOKEN_ADDRESS === '这里填 SKR 的 Token Address') {
      setPaymentError(isEN ? 'Please configure recipient address and SKR token address' : '请配置收款地址和SKR代币地址')
      return
    }
    
    setIsPaying(true)
    setPaymentError(null)
    
    try {
      // 获取Phantom钱包提供者
      const provider = window.phantom?.solana || window.solana
      if (!provider?.isPhantom) {
        throw new Error(isEN ? 'Phantom wallet not found' : '未找到Phantom钱包')
      }
      
      // 连接到Solana网络
      const connection = new Connection('https://api.mainnet-beta.solana.com')
      
      // 获取代币账户地址
      const tokenMint = new PublicKey(SKR_TOKEN_ADDRESS)
      const fromTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        new PublicKey(solanaAddress)
      )
      const toTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        new PublicKey(RECIPIENT_ADDRESS)
      )
      
      // 注意：这里需要从选项中选择价格，但现在我们先使用第一个选项的价格
      // 稍后我们会修改为从选择的选项获取价格
      const selectedOption = AUTO_CLICK_OPTIONS[0] // 临时使用第一个选项
      const price = selectedOption.price
      
      // 创建转账指令
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        new PublicKey(solanaAddress),
        price * (10 ** 9) // 根据选项确定SKR数量 (假设9位小数)
      )
      
      // 创建交易
      const transaction = new Transaction().add(transferInstruction)
      
      // 获取最新区块哈希
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = new PublicKey(solanaAddress)
      
      // 签名并发送交易
      const signedTransaction = await provider.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      
      // 确认交易
      await connection.confirmTransaction(signature)
      
      // 支付成功
      setPaymentSuccess(true)
      
    } catch (error: any) {
      console.error('Payment error:', error)
      setPaymentError(error.message || (isEN ? 'Payment failed' : '支付失败'))
    } finally {
      setIsPaying(false)
    }
  }
  
  // 停止自动挂机
  const stopAutoClicking = () => {
    setIsAutoClicking(false)
    setAutoClickMultiplier(0)
    setAutoClickEndTime(null)
  }
  
  // GD 兑换 SKR（用户用 GD 购买 SKR）
  const exchangeGDtoSKR = (skrAmount: number) => {
    const gdCost = skrAmount * EXCHANGE_RATE.GD_TO_SKR
    
    if (gdBalance < gdCost) {
      setPaymentError(isEN ? `Need ${gdCost} $GONGDE` : `需要 ${gdCost} $GONGDE`)
      setTimeout(() => setPaymentError(null), 3000)
      return false
    }
    
    // 扣除 GD
    spendGD(gdCost)
    
    // 这里应该给用户发送 SKR，但由于是链上操作，需要后端支持
    // 暂时只显示成功消息
    setPaymentSuccess(true)
    setTimeout(() => setPaymentSuccess(false), 3000)
    
    return true
  }
  
  // SKR 兑换 GD（用户用 SKR 购买 GD）
  const exchangeSKRtoGD = async (skrAmount: number) => {
    // 这需要用户从钱包转 SKR 给你
    // 然后你给用户发 GD
    const gdReward = skrAmount * EXCHANGE_RATE.SKR_TO_GD
    
    // TODO: 实现 SKR 转账逻辑（类似代敲支付）
    // 成功后给用户发 GD
    addGD(gdReward)
    
    return true
  }
  
  // 处理选择选项
  const handleSelectOption = async (option: typeof AUTO_CLICK_OPTIONS[0]) => {
    // SKR 测试模式：直接启用自动挂机，无需支付
    if (isSKRTestMode()) {
      setAutoClickMultiplier(option.multiplier)
      setAutoClickEndTime(Date.now() + 3 * 60 * 60 * 1000) // 3小时
      setIsAutoClicking(true)
      setPaymentSuccess(true)
      setShowAutoClickOptions(false)
      
      // 3秒后隐藏成功提示
      setTimeout(() => setPaymentSuccess(false), 3000)
      return
    }
    
    // 正常模式：需要钱包和配置
    if (!solanaAddress) {
      setPaymentError(isEN ? 'Please connect Phantom wallet first' : '请先连接Phantom钱包')
      return
    }
    
    if (RECIPIENT_ADDRESS === '这里填你自己的Solana钱包地址' || SKR_TOKEN_ADDRESS === '这里填 SKR 的 Token Address') {
      setPaymentError(isEN ? 'Please configure recipient address and SKR token address' : '请配置收款地址和SKR代币地址')
      return
    }
    
    setIsPaying(true)
    setPaymentError(null)
    
    try {
      // 获取Phantom钱包提供者
      const provider = window.phantom?.solana || window.solana
      if (!provider?.isPhantom) {
        throw new Error(isEN ? 'Phantom wallet not found' : '未找到Phantom钱包')
      }
      
      // 连接到Solana网络
      const connection = new Connection('https://api.mainnet-beta.solana.com')
      
      // 获取代币账户地址
      const tokenMint = new PublicKey(SKR_TOKEN_ADDRESS)
      const fromTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        new PublicKey(solanaAddress)
      )
      const toTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        new PublicKey(RECIPIENT_ADDRESS)
      )
      
      // 创建转账指令
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        new PublicKey(solanaAddress),
        option.price * (10 ** 9) // 根据选项确定SKR数量 (假设9位小数)
      )
      
      // 创建交易
      const transaction = new Transaction().add(transferInstruction)
      
      // 获取最新区块哈希
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = new PublicKey(solanaAddress)
      
      // 签名并发送交易
      const signedTransaction = await provider.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      
      // 确认交易
      await connection.confirmTransaction(signature)
      
      // 支付成功，设置自动挂机状态
      setAutoClickMultiplier(option.multiplier)
      setAutoClickEndTime(Date.now() + 3 * 60 * 60 * 1000) // 3小时
      setIsAutoClicking(true)
      setPaymentSuccess(true)
      setShowAutoClickOptions(false)
      
      // 3秒后隐藏成功提示
      setTimeout(() => setPaymentSuccess(false), 3000)
      
    } catch (error: any) {
      console.error('Payment error:', error)
      setPaymentError(error.message || (isEN ? 'Payment failed' : '支付失败'))
    } finally {
      setIsPaying(false)
    }
  }

  const getTitle = () => {
    if (totalMerits >= 10000) return '赛博活佛 Cyber Buddha'
    if (totalMerits >= 5000) return '功德圆满 Merit Master'
    if (totalMerits >= 1000) return '虔诚信徒 Devoted One'
    if (totalMerits >= 100) return '善良韭菜 Kind Leek'
    return '迷途羔羊 Lost Soul'
  }

  return (
    <div className={`flex flex-col items-center justify-center -mt-2 ${isScreenPaused ? 'screen-paused' : ''}`}>
      {/* 暴击闪光效果 + 文字 - 融合版（包含GD奖励）*/}
      <AnimatePresence>
        {isScreenPaused && critLevel && (
          <>
            {/* 满屏颜色闪光 */}
            <motion.div
              key={`critical-flash-${critLevel}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.4,
                ease: "easeInOut"
              }}
              className={`critical-flash ${critLevel === 'rare' ? 'rare' : ''} ${critLevel === 'epic' ? 'epic' : ''}`}
            />
            
            {/* 居中文字 - 延迟放大 */}
            <motion.div
              key={`crit-text-${critLevel}`}
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ 
                opacity: 1, 
                scale: [0.5, 1.15, 1],
                y: 0
              }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: 1.0,
                delay: 0.2,
                ease: "easeOut",
                scale: {
                  times: [0, 0.7, 1],
                  duration: 1.0,
                  ease: "easeOut"
                }
              }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]"
            >
              <div className="flex flex-col items-center gap-4">
                {/* 暴击等级文字 */}
                <div className={`
                  px-8 py-4 rounded-2xl font-bold text-3xl shadow-2xl backdrop-blur-sm
                  ${critLevel === 'normal' ? 'bg-yellow-500/40 text-yellow-100 border-2 border-yellow-300 shadow-yellow-500/50' : ''}
                  ${critLevel === 'rare' ? 'bg-cyan-500/40 text-cyan-100 border-2 border-cyan-300 shadow-cyan-500/50' : ''}
                  ${critLevel === 'epic' ? 'bg-purple-500/40 text-purple-100 border-2 border-purple-300 shadow-purple-500/50' : ''}
                `}
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.8)' }}
                >
                  {critLevel === 'normal' ? (isEN ? '✨ CAUSAL BLESSING ✨' : '✨ 因果加持 ✨') : ''}
                  {critLevel === 'rare' ? (isEN ? '✨ KARMIC FORTUNE ✨' : '✨ 福报降临 ✨') : ''}
                  {critLevel === 'epic' ? (isEN ? '✨ HEAVENLY REVELATION ✨' : '✨ 天启显现 ✨') : ''}
                </div>
                
                {/* GD奖励金额 - 如果有的话 */}
                {criticalReward && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: 1
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      delay: 0.5,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    className="px-6 py-3 rounded-xl bg-yellow-500/30 border-2 border-yellow-400 backdrop-blur-sm"
                  >
                    <div className="text-4xl font-bold text-yellow-200" style={{ textShadow: '0 0 15px rgba(255,255,0,0.8)' }}>
                      +{criticalReward.amount} $GONGDE
                    </div>
                    <div className="text-sm text-yellow-100 mt-1">
                      {criticalReward.text}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* 模式切换开关 */}
      <div className={`mb-4 flex flex-col items-center ${isDegen ? 'font-pixel' : ''}`}>
        <div className={`text-base font-bold mb-0.5 ${isDegen ? 'text-degen-cyan' : 'text-gray-400'}`}>
          {isEN ? 'Game Mode' : '游戏模式'}
        </div>
        <div className="flex items-center space-x-3">
          <span className={`text-xs ${gameMode === 'meditation' ? (isDegen ? 'text-degen-green font-bold' : 'text-green-500 font-bold') : 'text-gray-500'}`}>
            {isEN ? '🧘 Meditation' : '🧘 冥想模式'}
          </span>
          <button
            onClick={() => setGameMode(gameMode === 'meditation' ? 'merit' : 'meditation')}
            className={`
              relative inline-flex h-7 w-14 items-center rounded-full
              transition-colors duration-300 focus:outline-none
              ${gameMode === 'merit'
                ? (isDegen ? 'bg-degen-purple' : 'bg-goldman-gold')
                : (isDegen ? 'bg-degen-green' : 'bg-gray-600')
              }
            `}
          >
            <span
              className={`
                inline-block h-5 w-5 transform rounded-full bg-white
                transition-transform duration-300
                ${gameMode === 'merit' ? 'translate-x-7' : 'translate-x-1'}
                ${gameMode === 'merit' ? (isDegen ? 'shadow-degen-glow' : 'shadow-gold-glow') : ''}
              `}
            />
          </button>
          <span className={`text-xs ${gameMode === 'merit' ? (isDegen ? 'text-degen-yellow font-bold' : 'text-yellow-500 font-bold') : 'text-gray-500'}`}>
            {isEN ? '🔥 Merit Burn' : '🔥 功德模式'}
          </span>
        </div>
        <div className={`mt-0.5 text-xs ${isDegen ? 'text-degen-pink' : 'text-gray-500'}`}>
          {gameMode === 'meditation'
            ? (isEN ? 'Free play, no token consumption' : '免费游玩，不消耗代币')
            : (isEN ? 'Burns $GONGDE tokens, earns real merit' : '消耗$GONGDE代币，积累真实功德')
          }
        </div>
        
        {/* 世界观轮换文案 - 移动到模式描述和本次修行之间 */}
        <motion.div
          key={Date.now() % 3}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={`mt-1 text-xs italic ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}
        >
          {(() => {
            const wisdomTexts = isEN ? [
              'Causality has its course, fortune has its time',
              'Deep merit calls forth heaven\'s response',
              'Not sought but gained, that is true gain'
            ] : [
              '因果有常，福报有时',
              '功深者，天自应之',
              '非求而得，方为真得'
            ]
            const index = Math.floor(Date.now() / 10000) % wisdomTexts.length // 每10秒轮换
            return wisdomTexts[index]
          })()}
        </motion.div>
      </div>

      {/* 功德计数器 - 只显示本次修行 */}
      <div className={`text-center mb-4 ${isDegen ? 'font-pixel' : ''}`}>
        {/* 本次修行 */}
        <div className="mb-1">
          <div className={`text-xs ${isDegen ? 'text-degen-green' : 'text-gray-400'} mb-0.5`}>
            {isEN ? '🧘 This Session' : '🧘 本次修行'}
          </div>
          <div className={`text-3xl font-bold ${isDegen ? 'text-degen-green' : 'text-green-500'}`}>
            {totalMerits.toLocaleString()}
          </div>
          <div className={`text-xs mt-0.5 ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}>
            {isEN ? 'Your clicks this session' : '您本次的敲击数'}
          </div>
        </div>
        
        {/* 称号和COMBO */}
        <div className={`text-sm mt-0.5 ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold/70'}`}>
          {getTitle()}
        </div>
        <div className={`text-base font-bold mt-0.5 h-5 ${isDegen ? 'text-degen-pink' : 'text-orange-400'}`}>
          {combo > 3 ? `🔥 COMBO x${combo}` : ''}
        </div>
      </div>

      {/* 木鱼容器 - 包含随机圈 */}
      <div className="relative mt-0" style={{ width: '320px', height: '320px' }}>
        
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
            ref={fishButtonRef}
            onClick={handleCenterClick}
            disabled={gameMode === 'merit' && !isGongdeTestMode() && gdBalance < burnCost}
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
              ${gameMode === 'merit' && !isGongdeTestMode() && gdBalance < burnCost ? 'cursor-default opacity-50' : ''}
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
              disabled={gameMode === 'merit' && !isGongdeTestMode() && gdBalance < burnCost}
              style={{
                position: 'absolute',
                left: `calc(50% + ${target.x}px)`,
                top: `calc(50% + ${target.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                cursor-pointer select-none pointer-events-auto
                ${gameMode === 'merit' && !isGongdeTestMode() && gdBalance < burnCost ? 'opacity-50 cursor-not-allowed' : ''}
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

      {/* 操作提示 - 紧跟木鱼下方 */}
      <div className={`text-center ${isDegen ? 'font-pixel text-base' : 'text-lg'}`}>
        <p className={isDegen ? 'text-degen-green' : 'text-gray-400'}>
          {clickTargets.length > 0
            ? (isEN ? 'CATCH THE CIRCLE! ⭕' : '快点圈圈！')
            : (isEN ? 'CLICK THE FROG TO START 🐸' : '点击蛙蛙开始')
          }
        </p>
        <p className={`mt-1 text-lg ${isDegen ? 'text-degen-pink' : 'text-gray-500'}`}>
          {gameMode === 'meditation'
            ? (isEN ? 'Cost: 0 $GONGDE (Free)' : '每次消耗 0 $GONGDE (免费)')
            : (isEN ? `Cost: ${burnCost} $GONGDE each` : `每次消耗 ${burnCost} $GONGDE`)
          }
        </p>
      </div>

      {/* 自动挂机系统 - 折叠式设计 */}
      <div className="mt-6 flex flex-col items-center w-full max-w-md">
        {/* 测试模式提示 */}
        {isSKRTestMode() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs"
          >
            🧪 {isEN ? 'Demo Mode: Free Auto-Click' : '演示模式：免费自动代敲'}
          </motion.div>
        )}
        
        {/* 主折叠按钮 - 精简版 */}
        <motion.button
          onClick={() => setShowAutoClickOptions(!showAutoClickOptions)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            flex items-center justify-between w-full px-4 py-2.5 rounded-lg font-bold text-sm
            transition-all duration-200 border-2
            ${isAutoClicking
              ? (isDegen
                ? 'bg-degen-purple/20 text-degen-purple border-degen-purple'
                : 'bg-green-900/20 text-green-400 border-green-500')
              : (isDegen
                ? 'bg-degen-green/20 text-degen-green border-degen-green hover:bg-degen-green/30'
                : 'bg-yellow-900/20 text-yellow-400 border-yellow-500 hover:bg-yellow-900/30')
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{isAutoClicking ? '🤖' : '⚡'}</span>
            <span>
              {isAutoClicking
                ? (isEN ? 'Monk Working' : '方丈工作中')
                : (isEN ? 'Hire Monk' : '雇佣方丈')
              }
            </span>
            {isAutoClicking && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-black/30">
                ×{autoClickMultiplier}
              </span>
            )}
          </div>
          <motion.span
            animate={{ rotate: showAutoClickOptions ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs"
          >
            ▼
          </motion.span>
        </motion.button>
        
        {/* 折叠内容 - 精简版 */}
        <AnimatePresence>
          {showAutoClickOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full overflow-hidden"
            >
              {/* 模式提示 */}
              {gameMode === 'merit' && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-xs">
                  ⚠️ {isEN ? 'Merit mode: Higher price, higher rewards' : '功德模式：价格更高，奖励更多'}
                </div>
              )}
              
              <div className="mt-2 space-y-1.5">
                {AUTO_CLICK_OPTIONS.map((option, index) => {
                  const isDisabled = isPaying || (!solanaAddress && !isSKRTestMode());
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleSelectOption(option)}
                      disabled={isDisabled}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      className={`
                        flex items-center justify-between w-full px-3 py-2 rounded-lg
                        transition-all duration-150 text-xs border
                        ${isDisabled
                          ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed border-gray-700'
                          : isDegen
                            ? 'bg-black/30 hover:bg-black/50 text-white border-degen-green/30 hover:border-degen-green'
                            : 'bg-gray-900/30 hover:bg-gray-900/50 text-white border-gray-700 hover:border-yellow-500'
                        }
                      `}
                    >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{option.emoji}</span>
                      <div className="text-left">
                        <div className="font-bold">{option.label}</div>
                        <div className="text-[10px] text-gray-400">{option.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">{option.price} SKR</div>
                      <div className="text-[10px] text-gray-400">×{option.multiplier} · 3h</div>
                    </div>
                  </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 当前激活状态 - 精简版 */}
        {isAutoClickActive && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 w-full"
          >
            <div className={`
              flex items-center justify-between px-3 py-2 rounded-lg text-xs border
              ${isDegen
                ? 'bg-degen-purple/10 border-degen-purple/30 text-degen-purple'
                : 'bg-green-900/10 border-green-500/30 text-green-400'
              }
            `}>
              <div className="flex items-center gap-2">
                <span>⏳</span>
                <span className="font-bold">×{autoClickMultiplier} {isEN ? 'Active' : '生效中'}</span>
              </div>
              <div className="font-bold">{getRemainingTime()}</div>
            </div>
          </motion.div>
        )}
        
        {/* 支付状态提示 */}
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 px-4 py-2 rounded-lg ${isDegen ? 'bg-red-900/50 text-degen-pink' : 'bg-red-900/30 text-red-400'}`}
          >
            {paymentError}
          </motion.div>
        )}
        
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-3 px-4 py-2 rounded-lg ${isDegen ? 'bg-green-900/50 text-degen-green' : 'bg-green-900/30 text-green-400'}`}
          >
            {isEN ? '✅ Payment successful!' : '✅ 支付成功！'}
          </motion.div>
        )}
      </div>

      {/* 余额不足提示 - 只在功德模式下显示，测试模式不显示 */}
      {gameMode === 'merit' && !isGongdeTestMode() && gdBalance < burnCost && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 px-4 py-2 rounded-lg ${isDegen ? 'bg-red-900/50 text-degen-pink' : 'bg-red-900/30 text-red-400'}`}
        >
          {isEN ? '💸 Insufficient $GONGDE, go earn more!' : '💸 $GONGDE不足，请先充值功德'}
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
          : (isEN ? '"Burn $GONGDE, Fix Karma"' : '"燃烧$GONGDE，消除业障"')
        }
      </motion.p>

      {/* 提现入口按钮 */}
      <button
        onClick={() => setShowWithdrawal(true)}
        className={`
          mt-4 px-6 py-2 rounded-lg font-bold text-sm transition-all
          ${isDegen
            ? 'bg-degen-purple/20 text-degen-purple border-2 border-degen-purple hover:bg-degen-purple/30'
            : 'bg-purple-900/20 text-purple-400 border-2 border-purple-500 hover:bg-purple-900/30'
          }
        `}
      >
        💰 {isEN ? 'Withdraw $GONGDE' : '提现 $GONGDE'}
      </button>

      {/* 提现弹窗 */}
      <AnimatePresence>
        {showWithdrawal && (
          <WithdrawalDialog onClose={() => setShowWithdrawal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WoodenFish

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

const RANDOM_TEXTS = [
  { text: '功德 +1', color: 'text-yellow-400' },
  { text: '功德 +1', color: 'text-yellow-400' },
  { text: '功德 +1', color: 'text-yellow-400' },
  { text: 'FOMO -1', color: 'text-green-400' },
  { text: '智商 +1', color: 'text-cyan-400' },
  { text: '被割概率 -0.01%', color: 'text-pink-400' },
  { text: '业障 -1', color: 'text-purple-400' },
  { text: 'Diamond Hands +1', color: 'text-blue-400' },
  { text: 'Paper Hands -1', color: 'text-red-400' },
  { text: '韭菜根 +1', color: 'text-green-500' },
  { text: '接盘力 -1', color: 'text-orange-400' },
]

export const WoodenFish: React.FC = () => {
  const { mode } = useThemeStore()
  const { gdBalance, spendGD } = useGachaStore()
  const { lang } = useLangStore()
  const [merits, setMerits] = useState<MeritPopup[]>([])
  const [totalMerits, setTotalMerits] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const [combo, setCombo] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const idRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const burnCost = 100

  useEffect(() => {
    audioRef.current = new Audio('/muyu.mp3')
    audioRef.current.volume = 0.5
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const addMerit = useCallback(() => {
    if (gdBalance < burnCost) return false
    
    spendGD(burnCost)
    setTotalMerits(prev => prev + 1)
    setCombo(prev => prev + 1)
    
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current)
    comboTimeoutRef.current = setTimeout(() => setCombo(0), 1500)

    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }

    const randomItem = RANDOM_TEXTS[Math.floor(Math.random() * RANDOM_TEXTS.length)]
    const newMerit: MeritPopup = {
      id: idRef.current++,
      x: Math.random() * 120 - 60,
      y: Math.random() * 40 - 60,
      text: randomItem.text,
      color: randomItem.color,
    }
    setMerits(prev => [...prev.slice(-15), newMerit])
    setTimeout(() => setMerits(prev => prev.filter(m => m.id !== newMerit.id)), 1000)
    
    return true
  }, [gdBalance, spendGD])

  const handleClick = () => {
    addMerit()
  }

  const handleMouseDown = () => {
    setIsPressed(true)
    addMerit()
    intervalRef.current = setInterval(() => {
      if (!addMerit()) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 80)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
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
    <div className="flex flex-col items-center justify-center py-8">
      {/* 功德计数器 */}
      <motion.div 
        className={`text-center mb-6 ${isDegen ? 'font-pixel' : ''}`}
        animate={{ scale: combo > 5 ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`text-5xl font-bold mb-2 ${isDegen ? 'text-degen-yellow neon-text' : 'text-goldman-gold'}`}>
          {totalMerits.toLocaleString()}
        </div>
        <div className={`text-sm ${isDegen ? 'text-degen-green' : 'text-gray-400'}`}>
          功德 Merit
        </div>
        <div className={`text-xs mt-1 ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold/70'}`}>
          {getTitle()}
        </div>
        {combo > 3 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-lg font-bold mt-2 ${isDegen ? 'text-degen-pink' : 'text-orange-400'}`}
          >
            🔥 COMBO x{combo}
          </motion.div>
        )}
      </motion.div>

      {/* 电子木鱼 */}
      <div className="relative">
        <motion.button
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          disabled={gdBalance < burnCost}
          whileTap={{ scale: 0.92 }}
          animate={{ 
            scale: isPressed ? 0.95 : 1,
            boxShadow: isPressed 
              ? isDegen ? '0 0 60px #39ff14' : '0 0 60px #c9a962'
              : isDegen ? '0 0 30px #39ff1440' : '0 0 30px #c9a96240'
          }}
          className={`
            relative w-48 h-48 rounded-full flex items-center justify-center
            cursor-pointer select-none transition-all
            ${gdBalance < burnCost ? 'opacity-50 cursor-not-allowed' : ''}
            ${isDegen 
              ? 'bg-gradient-to-br from-degen-green/30 to-degen-purple/30 border-4 border-degen-green' 
              : 'bg-gradient-to-br from-goldman-gold/20 to-amber-900/30 border-4 border-goldman-gold'
            }
          `}
        >
          {/* 木鱼图案 */}
          <img 
            src="/muyu.gif" 
            alt="木鱼" 
            className="w-44 h-44 object-cover rounded-full select-none"
            draggable={false}
          />
          
          {/* 涟漪效果 */}
          {isPressed && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className={`absolute inset-0 rounded-full border-2 ${isDegen ? 'border-degen-green' : 'border-goldman-gold'}`}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                className={`absolute inset-0 rounded-full border-2 ${isDegen ? 'border-degen-cyan' : 'border-amber-400'}`}
              />
            </>
          )}
        </motion.button>

        {/* 功德+1 弹出 */}
        <AnimatePresence>
          {merits.map((merit) => (
            <motion.div
              key={merit.id}
              initial={{ opacity: 1, y: 0, x: merit.x, scale: 0.5 }}
              animate={{ opacity: 0, y: merit.y - 80, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pointer-events-none font-bold text-xl whitespace-nowrap
                ${isDegen ? `font-pixel text-lg ${merit.color}` : 'text-goldman-gold'}
              `}
              style={{ textShadow: '0 0 10px currentColor' }}
            >
              {merit.text} ✨
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 操作提示 */}
      <div className={`mt-8 text-center ${isDegen ? 'font-pixel text-xs' : 'text-sm'}`}>
        <p className={isDegen ? 'text-degen-green' : 'text-gray-400'}>
          {isEN ? 'HOLD TO BURN FASTER 🔥' : '长按连续积德'}
        </p>
        <p className={`mt-2 ${isDegen ? 'text-degen-pink' : 'text-gray-500'}`}>
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
        className={`mt-8 text-center italic ${isDegen ? 'text-degen-cyan font-pixel text-xs' : 'text-gray-500 text-sm'}`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {isDegen 
          ? '"V ME 50, BUDDHA BLESS U"' 
          : '"Burn $GD, Fix Karma"'
        }
      </motion.p>
    </div>
  )
}

export default WoodenFish

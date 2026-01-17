import React from 'react'
import { motion } from 'framer-motion'
import { GachaResult } from '../stores/gachaStore'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'

interface FortuneCardProps {
  result: GachaResult
  onReveal: () => void
}

export const FortuneCard: React.FC<FortuneCardProps> = ({ result, onReveal }) => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const { fortune, gdEarned } = result

  const levelColors = {
    'SSR': 'from-yellow-400 via-orange-500 to-red-500',
    'SR': 'from-purple-400 via-pink-500 to-purple-600',
    'R': 'from-blue-400 via-cyan-500 to-blue-600',
    'N': 'from-gray-400 via-gray-500 to-gray-600'
  }

  const levelBg = {
    'SSR': 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500',
    'SR': 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500',
    'R': 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500',
    'N': 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-500'
  }

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="perspective-1000"
    >
      <div className={`
        relative p-6 rounded-2xl border-2
        ${levelBg[fortune.level]}
        ${isDegen ? 'shadow-[0_0_30px_rgba(0,255,0,0.3)]' : 'shadow-2xl'}
      `}>
        {/* Level Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className={`
            absolute -top-3 -right-3 px-4 py-1 rounded-full font-bold text-sm
            bg-gradient-to-r ${levelColors[fortune.level]} text-black
            ${fortune.level === 'SSR' ? 'animate-pulse' : ''}
          `}
        >
          {fortune.level}
        </motion.div>

        {/* Emoji */}
        <motion.div
          className="text-6xl text-center mb-4"
          animate={fortune.level === 'SSR' ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {fortune.emoji}
        </motion.div>

        {/* Title */}
        <h2 className={`
          text-2xl font-bold text-center mb-2
          bg-gradient-to-r ${levelColors[fortune.level]} bg-clip-text text-transparent
          ${isDegen ? 'font-pixel text-xl' : ''}
        `}>
          {isEN ? fortune.titleEN : fortune.title}
        </h2>

        {/* Coin Info */}
        {fortune.coin && (
          <div className={`
            text-center mb-4 p-2 rounded-lg
            ${isDegen ? 'bg-black/30' : 'bg-black/20'}
          `}>
            <span className={`text-lg font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>
              {fortune.coin.symbol?.toUpperCase() || fortune.coin.name}
            </span>
            {'current_price' in fortune.coin && fortune.coin.current_price && (
              <span className="text-sm text-gray-400 ml-2">
                ${fortune.coin.current_price.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Message */}
        <p className={`text-center mb-4 ${isDegen ? 'text-gray-300' : 'text-gray-300'}`}>
          {isEN ? fortune.messageEN : fortune.message}
        </p>

        {/* Advice */}
        <div className={`
          p-3 rounded-lg text-sm text-center
          ${isDegen ? 'bg-degen-green/10 text-degen-green' : 'bg-goldman-gold/10 text-goldman-gold'}
        `}>
          💡 {isEN ? fortune.adviceEN : fortune.advice}
        </div>

        {/* GD Earned */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <span className={`
            text-lg font-bold
            ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}
          `}>
            +{gdEarned} $GD {isEN ? 'EARNED' : '功德'}
          </span>
        </motion.div>

        {/* Close Button */}
        <motion.button
          onClick={onReveal}
          className={`
            mt-4 w-full py-3 rounded-xl font-bold transition-all
            ${isDegen 
              ? 'bg-degen-green text-black hover:bg-degen-yellow' 
              : 'bg-goldman-gold text-black hover:bg-amber-400'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isEN ? 'CLOSE' : '收下'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default FortuneCard

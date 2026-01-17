import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Loader2 } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

interface DrawButtonProps {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  freeDrawsLeft?: number
  gdCost?: number
}

export const DrawButton: React.FC<DrawButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  freeDrawsLeft = 0,
  gdCost = 100,
}) => {
  const { mode } = useThemeStore()
  const isDegen = mode === 'degen'

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative w-full max-w-xs px-8 py-4 rounded-xl font-bold text-lg
        transition-all duration-300 overflow-hidden
        ${isDegen 
          ? 'bg-gradient-to-r from-degen-green via-degen-cyan to-degen-green text-black shadow-neon-green' 
          : 'bg-gradient-to-r from-goldman-gold via-amber-400 to-goldman-gold text-black shadow-neon-gold'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {/* 动态背景光效 */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, white, transparent)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}

      <span className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>上香中...</span>
          </>
        ) : (
          <>
            <Flame className="w-5 h-5" />
            <span>{isDegen ? '🎰 抽!' : '抽取今日财富密码'}</span>
          </>
        )}
      </span>

      {/* 免费次数或价格提示 */}
      {!isLoading && (
        <div className="absolute -bottom-0.5 left-0 right-0 text-center">
          <span className="text-xs opacity-70">
            {freeDrawsLeft > 0 
              ? `免费次数: ${freeDrawsLeft}` 
              : `消耗 ${gdCost} $GD`
            }
          </span>
        </div>
      )}
    </motion.button>
  )
}

export default DrawButton

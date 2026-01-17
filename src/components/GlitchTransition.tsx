import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../stores/themeStore'

export const GlitchTransition: React.FC = () => {
  const { isTransitioning, mode } = useThemeStore()
  const [glitchLines, setGlitchLines] = useState<number[]>([])

  useEffect(() => {
    if (isTransitioning) {
      // 生成随机故障线条
      const lines = Array.from({ length: 20 }, () => Math.random() * 100)
      setGlitchLines(lines)
    }
  }, [isTransitioning])

  if (!isTransitioning) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        {/* 屏幕闪烁 */}
        <motion.div
          className="absolute inset-0 bg-white"
          animate={{ 
            opacity: [0, 1, 0, 0.5, 0, 0.8, 0],
          }}
          transition={{ duration: 0.3 }}
        />

        {/* 水平故障线条 */}
        {glitchLines.map((top, i) => (
          <motion.div
            key={i}
            className={`absolute left-0 right-0 h-1 ${
              mode === 'degen' ? 'bg-degen-green' : 'bg-goldman-gold'
            }`}
            style={{ top: `${top}%` }}
            animate={{
              opacity: [0, 1, 0],
              x: [-20, 20, -10, 15, 0],
            }}
            transition={{
              duration: 0.2,
              delay: i * 0.01,
            }}
          />
        ))}

        {/* RGB色差效果 */}
        <motion.div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background: 'linear-gradient(90deg, rgba(255,0,0,0.3), transparent, rgba(0,255,255,0.3))',
          }}
          animate={{
            x: [-10, 10, -5, 5, 0],
          }}
          transition={{ duration: 0.3 }}
        />

        {/* 扫描线 */}
        <motion.div
          className="absolute inset-0 scanlines opacity-50"
        />

        {/* 模式切换文字 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
        >
          <span className={`text-4xl font-bold ${
            mode === 'degen' 
              ? 'text-degen-green font-pixel neon-text' 
              : 'text-goldman-gold'
          }`}>
            {mode === 'degen' ? 'DEGEN MODE' : 'PREMIUM MODE'}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default GlitchTransition

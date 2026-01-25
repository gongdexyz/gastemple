import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffectsStore } from '../stores/effectsStore'

export const VisualEffectsOverlay: React.FC = () => {
  const { particles, targetFlash } = useEffectsStore()
  const targetRef = useRef<HTMLDivElement | null>(null)
  
  // 动态计算左侧面板位置
  useEffect(() => {
    const updateTargetPosition = () => {
      // 尝试找到左侧 SKR 通缩面板
      const skrPanel = document.querySelector('[data-skr-panel]')
      if (skrPanel && targetRef.current) {
        const rect = skrPanel.getBoundingClientRect()
        targetRef.current.style.left = `${rect.left + rect.width / 2}px`
        targetRef.current.style.top = `${rect.top + rect.height / 2}px`
      }
    }
    
    updateTargetPosition()
    window.addEventListener('resize', updateTargetPosition)
    
    return () => window.removeEventListener('resize', updateTargetPosition)
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" style={{ overflow: 'hidden' }}>
      {/* 目标位置标记（隐藏，仅用于定位） */}
      <div 
        ref={targetRef}
        className="absolute"
        style={{ 
          width: '10px', 
          height: '10px',
          left: '200px', // 默认位置
          top: '300px'
        }}
      />
      
      {/* 飞行粒子 */}
      <AnimatePresence>
        {particles.map((particle) => {
          const targetPos = targetRef.current 
            ? {
                x: parseInt(targetRef.current.style.left) || 200,
                y: parseInt(targetRef.current.style.top) || 300
              }
            : particle.endPos
          
          return (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.startPos.x,
                y: particle.startPos.y,
                scale: 0.5,
                opacity: 0
              }}
              animate={{
                x: targetPos.x,
                y: targetPos.y,
                scale: [0.5, 1.2, 0.8],
                opacity: [0, 1, 1, 0]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1], // 弹性曲线
                scale: {
                  times: [0, 0.5, 1],
                  duration: 0.6
                }
              }}
              className="absolute"
              style={{
                width: '40px',
                height: '40px',
                marginLeft: '-20px',
                marginTop: '-20px'
              }}
            >
              {/* 火球图标 */}
              <div className="relative w-full h-full">
                {/* 外层光晕 */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 0.3, 0.6]
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-yellow-400/40 blur-md"
                />
                
                {/* 火球核心 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                    🔥
                  </div>
                </div>
                
                {/* 拖尾效果 */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.6 }}
                  className="absolute right-full top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-l from-yellow-400 to-transparent rounded-full"
                />
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
      
      {/* 目标闪光效果（用于标记左侧面板被击中） */}
      <AnimatePresence>
        {targetFlash && targetRef.current && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
            style={{
              left: targetRef.current.style.left,
              top: targetRef.current.style.top,
              width: '200px',
              height: '200px',
              marginLeft: '-100px',
              marginTop: '-100px'
            }}
          >
            <div className="w-full h-full rounded-full bg-yellow-400/30 blur-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

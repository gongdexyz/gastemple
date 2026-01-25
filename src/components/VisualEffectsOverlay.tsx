import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffectsStore } from '../stores/effectsStore'

export const VisualEffectsOverlay: React.FC = () => {
  const { particles, targetFlash, criticalFlash } = useEffectsStore()
  const targetRef = useRef<HTMLDivElement | null>(null)
  
  // 动态计算"24h 收入"区域位置
  useEffect(() => {
    const updateTargetPosition = () => {
      // 优先找到 24h 收入区域
      const revenueTarget = document.querySelector('[data-revenue-target]')
      if (revenueTarget && targetRef.current) {
        const rect = revenueTarget.getBoundingClientRect()
        targetRef.current.style.left = `${rect.left + rect.width / 2}px`
        targetRef.current.style.top = `${rect.top + rect.height / 2}px`
      } else {
        // 降级：找 SKR 面板
        const skrPanel = document.querySelector('[data-skr-panel]')
        if (skrPanel && targetRef.current) {
          const rect = skrPanel.getBoundingClientRect()
          targetRef.current.style.left = `${rect.left + rect.width / 2}px`
          targetRef.current.style.top = `${rect.top + rect.height / 2}px`
        }
      }
    }
    
    updateTargetPosition()
    window.addEventListener('resize', updateTargetPosition)
    
    // 延迟更新，确保 DOM 已渲染
    const timer = setTimeout(updateTargetPosition, 100)
    
    return () => {
      window.removeEventListener('resize', updateTargetPosition)
      clearTimeout(timer)
    }
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
                {/* 外层光晕 - 暴击时更大更亮 */}
                <motion.div
                  animate={{
                    scale: particle.isCritical ? [1, 2, 1] : [1, 1.5, 1],
                    opacity: particle.isCritical ? [0.8, 0.5, 0.8] : [0.6, 0.3, 0.6]
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute inset-0 rounded-full blur-md ${
                    particle.isCritical ? 'bg-yellow-300/60' : 'bg-yellow-400/40'
                  }`}
                />
                
                {/* 火球核心 - 暴击时更大 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className={particle.isCritical ? 'text-4xl' : 'text-3xl'}
                    animate={particle.isCritical ? { rotate: [0, 360] } : {}}
                    transition={{ duration: 0.6, ease: "linear" }}
                    style={{ 
                      filter: particle.isCritical 
                        ? 'drop-shadow(0 0 15px rgba(255,215,0,1))' 
                        : 'drop-shadow(0 0 10px rgba(255,215,0,0.8))'
                    }}
                  >
                    {particle.isCritical ? '💰' : '🔥'}
                  </motion.div>
                </div>
                
                {/* 拖尾效果 - 暴击时更长 */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.6 }}
                  className={`absolute right-full top-1/2 -translate-y-1/2 h-1 bg-gradient-to-l from-yellow-400 to-transparent rounded-full ${
                    particle.isCritical ? 'w-20' : 'w-12'
                  }`}
                />
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

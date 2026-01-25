import { create } from 'zustand'

export interface ParticleEffect {
  id: string
  startPos: { x: number; y: number }
  endPos: { x: number; y: number }
  timestamp: number
  isCritical?: boolean // 是否暴击
}

interface EffectsState {
  particles: ParticleEffect[]
  targetFlash: boolean
  criticalFlash: boolean // 暴击闪光
  
  // Actions
  triggerBurnEffect: (startPos: { x: number; y: number }, isCritical?: boolean) => void
  removeParticle: (id: string) => void
  flashTarget: () => void
  clearFlash: () => void
}

export const useEffectsStore = create<EffectsState>((set, get) => ({
  particles: [],
  targetFlash: false,
  criticalFlash: false,
  
  triggerBurnEffect: (startPos, isCritical = false) => {
    // 动态获取目标位置（钱袋子或默认位置）
    const getTargetPosition = () => {
      const balanceIndicator = document.getElementById('gd-balance-indicator')
      if (balanceIndicator) {
        const rect = balanceIndicator.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        }
      }
      // 默认位置（如果找不到钱袋子）
      return { x: 200, y: 300 }
    }
    
    const targetPos = getTargetPosition()
    
    // 暴击时发射多个粒子
    const particleCount = isCritical ? 5 : 1
    const newParticles: ParticleEffect[] = []
    
    for (let i = 0; i < particleCount; i++) {
      const particle: ParticleEffect = {
        id: `particle-${Date.now()}-${Math.random()}`,
        startPos,
        endPos: targetPos,
        timestamp: Date.now(),
        isCritical
      }
      newParticles.push(particle)
      
      // 暴击时粒子间隔发射
      const delay = isCritical ? i * 100 : 0
      
      setTimeout(() => {
        set((state) => ({
          particles: [...state.particles, particle]
        }))
        
        // 每个粒子到达后触发闪光
        setTimeout(() => {
          if (isCritical) {
            set({ criticalFlash: true })
          } else {
            get().flashTarget()
          }
        }, 600)
        
        // 移除粒子
        setTimeout(() => {
          get().removeParticle(particle.id)
        }, 800)
      }, delay)
    }
    
    // 暴击闪光持续更久
    if (isCritical) {
      setTimeout(() => {
        set({ criticalFlash: false })
      }, 2000) // 2秒
    }
  },
  
  removeParticle: (id) => {
    set((state) => ({
      particles: state.particles.filter(p => p.id !== id)
    }))
  },
  
  flashTarget: () => {
    set({ targetFlash: true })
    setTimeout(() => {
      set({ targetFlash: false })
    }, 800)
  },
  
  clearFlash: () => {
    set({ targetFlash: false, criticalFlash: false })
  }
}))

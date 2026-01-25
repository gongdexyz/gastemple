import { create } from 'zustand'

export interface ParticleEffect {
  id: string
  startPos: { x: number; y: number }
  endPos: { x: number; y: number }
  timestamp: number
}

interface EffectsState {
  particles: ParticleEffect[]
  targetFlash: boolean
  
  // Actions
  triggerBurnEffect: (startPos: { x: number; y: number }) => void
  removeParticle: (id: string) => void
  flashTarget: () => void
  clearFlash: () => void
}

export const useEffectsStore = create<EffectsState>((set, get) => ({
  particles: [],
  targetFlash: false,
  
  triggerBurnEffect: (startPos) => {
    const particle: ParticleEffect = {
      id: `particle-${Date.now()}-${Math.random()}`,
      startPos,
      endPos: { x: 200, y: 300 }, // 左侧面板大致位置（会在组件中动态计算）
      timestamp: Date.now()
    }
    
    set((state) => ({
      particles: [...state.particles, particle]
    }))
    
    // 600ms 后触发目标闪光
    setTimeout(() => {
      get().flashTarget()
    }, 600)
    
    // 800ms 后移除粒子
    setTimeout(() => {
      get().removeParticle(particle.id)
    }, 800)
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
    }, 200)
  },
  
  clearFlash: () => {
    set({ targetFlash: false })
  }
}))

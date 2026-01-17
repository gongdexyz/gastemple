import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'goldman' | 'degen'

interface ThemeState {
  mode: ThemeMode
  isTransitioning: boolean
  toggleMode: () => void
  setMode: (mode: ThemeMode) => void
  triggerGlitch: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'goldman',
      isTransitioning: false,
      toggleMode: () => set((state) => ({ 
        mode: state.mode === 'goldman' ? 'degen' : 'goldman',
        isTransitioning: true 
      })),
      setMode: (mode) => set({ mode }),
      triggerGlitch: () => {
        set({ isTransitioning: true })
        setTimeout(() => set({ isTransitioning: false }), 500)
      },
    }),
    {
      name: 'gas-temple-theme',
    }
  )
)

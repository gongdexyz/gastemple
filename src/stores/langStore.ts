import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'cn' | 'en'

interface LangState {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'cn',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ 
        lang: state.lang === 'cn' ? 'en' : 'cn' 
      })),
    }),
    { name: 'gas-temple-lang' }
  )
)

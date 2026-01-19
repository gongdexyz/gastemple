import { create } from 'zustand'

interface SoundStore {
  bgmAudio: HTMLAudioElement | null
  isBgmPlaying: boolean
  isMuted: boolean
  isInitialized: boolean
  hasUserInteracted: boolean
  initBgm: () => void
  playBgm: () => void
  pauseBgm: () => void
  toggleMute: () => void
  playSound: (type: 'roll' | 'text' | 'choose') => void
  setupAutoPlay: () => void
}

// 全局标志，防止多个组件重复设置事件监听
let autoPlaySetup = false

export const useSoundStore = create<SoundStore>((set, get) => ({
  bgmAudio: null,
  isBgmPlaying: false,
  isMuted: false,
  isInitialized: false,
  hasUserInteracted: false,

  initBgm: () => {
    const { isInitialized, bgmAudio } = get()
    // 防止重复初始化
    if (isInitialized && bgmAudio) return
    
    if (typeof window === 'undefined') return
    const audio = new Audio('/sounds/background.mp3')
    audio.loop = true
    audio.volume = 0.3 // 30% 音量
    set({ bgmAudio: audio, isInitialized: true })
  },

  playBgm: () => {
    const { bgmAudio, isMuted, isBgmPlaying } = get()
    // 防止重复播放
    if (isBgmPlaying) return
    if (bgmAudio && !isMuted) {
      bgmAudio.play().catch(() => {})
      set({ isBgmPlaying: true })
    }
  },

  pauseBgm: () => {
    const { bgmAudio } = get()
    if (bgmAudio) {
      bgmAudio.pause()
      set({ isBgmPlaying: false })
    }
  },

  toggleMute: () => {
    const { isMuted, bgmAudio, isBgmPlaying } = get()
    const newMuted = !isMuted
    set({ isMuted: newMuted })
    
    if (bgmAudio) {
      if (newMuted) {
        bgmAudio.pause()
      } else if (isBgmPlaying) {
        bgmAudio.play().catch(() => {})
      }
    }
  },

  playSound: (type: 'roll' | 'text' | 'choose') => {
    const { isMuted } = get()
    if (isMuted) return

    const soundMap = {
      roll: '/sounds/roll.mp3',
      text: '/sounds/text.mp3',
      choose: '/sounds/choose.wav',
    }

    const audio = new Audio(soundMap[type])
    audio.volume = 0.5
    audio.play().catch(() => {})
  },

  setupAutoPlay: () => {
    // 防止多个组件重复设置事件监听
    if (autoPlaySetup) return
    autoPlaySetup = true

    const handleFirstInteraction = () => {
      const { hasUserInteracted } = get()
      if (hasUserInteracted) return
      
      set({ hasUserInteracted: true })
      get().playBgm()
      
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
    
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)
  },
}))

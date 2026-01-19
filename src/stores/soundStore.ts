import { create } from 'zustand'

interface SoundStore {
  isBgmPlaying: boolean
  isMuted: boolean
  hasUserInteracted: boolean
  initBgm: () => void
  playBgm: () => void
  pauseBgm: () => void
  toggleMute: () => void
  playSound: (type: 'roll' | 'text' | 'choose') => void
  setupAutoPlay: () => void
  speakText: (text: string, lang?: 'zh' | 'en') => void
}

// 全局单例 - 确保只有一个背景音乐实例
let bgmAudio: HTMLAudioElement | null = null
let bgmInitialized = false
let autoPlaySetup = false

export const useSoundStore = create<SoundStore>((set, get) => ({
  isBgmPlaying: false,
  isMuted: false,
  hasUserInteracted: false,

  initBgm: () => {
    // 使用全局单例，防止重复创建
    if (bgmInitialized) return
    bgmInitialized = true
    
    if (typeof window === 'undefined') return
    bgmAudio = new Audio('/sounds/background.mp3')
    bgmAudio.loop = true
    bgmAudio.volume = 0.3 // 30% 音量
  },

  playBgm: () => {
    const { isMuted } = get()
    // 防止重复播放 - 检查audio是否真的在播放
    if (bgmAudio && !bgmAudio.paused) return
    if (bgmAudio && !isMuted) {
      bgmAudio.play().catch((e) => console.log('BGM play error:', e))
      set({ isBgmPlaying: true })
    }
  },

  pauseBgm: () => {
    if (bgmAudio) {
      bgmAudio.pause()
      set({ isBgmPlaying: false })
    }
  },

  toggleMute: () => {
    const { isMuted, isBgmPlaying } = get()
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

  speakText: (text: string, lang: 'zh' | 'en' = 'zh') => {
    const { isMuted } = get()
    if (isMuted) return
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    // 取消之前的朗读
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 0.8

    window.speechSynthesis.speak(utterance)
  },
}))

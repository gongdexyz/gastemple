import { create } from 'zustand'

interface SoundStore {
  isBgmPlaying: boolean
  isMuted: boolean
  isBgmMuted: boolean // 新增：单独控制背景音乐
  hasUserInteracted: boolean
  initBgm: () => void
  playBgm: () => void
  pauseBgm: () => void
  toggleMute: () => void
  toggleBgmMute: () => void // 新增：单独切换背景音乐
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
  isBgmMuted: false, // 新增：默认不静音背景音乐
  hasUserInteracted: false,

  initBgm: () => {
    // 使用全局单例，防止重复创建
    if (bgmInitialized) return
    bgmInitialized = true
    
    if (typeof window === 'undefined') return
    bgmAudio = new Audio('/sounds/background.mp3')
    bgmAudio.loop = true
    bgmAudio.volume = 0.15 // 降低到15%音量，更轻柔
  },

  playBgm: () => {
    const { isMuted, isBgmMuted } = get()
    // 防止重复播放 - 检查audio是否真的在播放
    if (bgmAudio && !bgmAudio.paused) return
    if (bgmAudio && !isMuted && !isBgmMuted) {
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

  // 新增：单独控制背景音乐
  toggleBgmMute: () => {
    const { isBgmMuted } = get()
    const newBgmMuted = !isBgmMuted
    set({ isBgmMuted: newBgmMuted })
    
    if (bgmAudio) {
      if (newBgmMuted) {
        bgmAudio.pause()
        set({ isBgmPlaying: false })
      } else {
        bgmAudio.play().catch(() => {})
        set({ isBgmPlaying: true })
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
    utterance.rate = 1.2 // 快一点
    utterance.pitch = 0.7 // 更低的音调，强制男声效果
    utterance.volume = 0.8

    // 获取所有可用语音并打印（调试用）
    const voices = window.speechSynthesis.getVoices()
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`))
    
    if (voices.length > 0) {
      // 更激进的男声筛选策略
      let maleVoice = null
      
      if (lang === 'zh') {
        // 中文男声：按优先级查找
        maleVoice = voices.find(v => v.name.includes('Kangkang')) ||
                    voices.find(v => v.name.includes('Yunyang')) ||
                    voices.find(v => v.name.includes('Yun-Jhe')) ||
                    voices.find(v => v.lang.includes('zh') && v.name.toLowerCase().includes('male')) ||
                    voices.find(v => v.lang.includes('zh') && !v.name.includes('Huihui') && !v.name.includes('Yaoyao'))
      } else {
        // 英文男声：按优先级查找
        maleVoice = voices.find(v => v.name.includes('David')) ||
                    voices.find(v => v.name.includes('Mark')) ||
                    voices.find(v => v.name.includes('George')) ||
                    voices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('male'))
      }
      
      if (maleVoice) {
        utterance.voice = maleVoice
        console.log('Selected voice:', maleVoice.name)
      } else {
        console.log('No male voice found, using default')
      }
    }

    window.speechSynthesis.speak(utterance)
  },
}))

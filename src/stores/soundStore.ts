import { create } from 'zustand'

interface SoundStore {
  bgmAudio: HTMLAudioElement | null
  isBgmPlaying: boolean
  isMuted: boolean
  initBgm: () => void
  playBgm: () => void
  pauseBgm: () => void
  toggleMute: () => void
  playSound: (type: 'roll' | 'text' | 'choose') => void
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  bgmAudio: null,
  isBgmPlaying: false,
  isMuted: false,

  initBgm: () => {
    if (typeof window === 'undefined') return
    const audio = new Audio('/sounds/background.mp3')
    audio.loop = true
    audio.volume = 0.3 // 30% 音量
    set({ bgmAudio: audio })
  },

  playBgm: () => {
    const { bgmAudio, isMuted } = get()
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
}))

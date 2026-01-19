import React, { useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSoundStore } from '../stores/soundStore'

export const MusicToggle: React.FC = () => {
  const { initBgm, playBgm, isMuted, toggleMute, isInitialized } = useSoundStore()

  // 初始化背景音乐（只执行一次）
  useEffect(() => {
    initBgm()
  }, [initBgm])

  // 用户首次交互后播放背景音乐
  useEffect(() => {
    if (!isInitialized) return
    
    const handleFirstInteraction = () => {
      playBgm()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
    
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [playBgm, isInitialized])

  return (
    <button
      onClick={toggleMute}
      className="px-2 py-1 text-xs border border-gray-700 rounded hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  )
}

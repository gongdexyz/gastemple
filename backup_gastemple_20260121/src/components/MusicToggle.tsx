import React, { useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSoundStore } from '../stores/soundStore'

export const MusicToggle: React.FC = () => {
  const { initBgm, isMuted, toggleMute, setupAutoPlay } = useSoundStore()

  // 初始化背景音乐和自动播放（全局只执行一次）
  useEffect(() => {
    initBgm()
    setupAutoPlay()
  }, [initBgm, setupAutoPlay])

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

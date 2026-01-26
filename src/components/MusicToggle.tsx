import React, { useEffect } from 'react'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { useSoundStore } from '../stores/soundStore'

export const MusicToggle: React.FC = () => {
  const { initBgm, isMuted, isBgmMuted, toggleMute, toggleBgmMute, setupAutoPlay } = useSoundStore()

  // 初始化背景音乐和自动播放（全局只执行一次）
  useEffect(() => {
    initBgm()
    setupAutoPlay()
  }, [initBgm, setupAutoPlay])

  return (
    <div className="flex gap-0.5 sm:gap-1">
      {/* 音效开关（左边）- 控制游戏音效 */}
      <button
        onClick={toggleMute}
        className="px-1.5 sm:px-2 py-1.5 text-xs border border-gray-700 rounded hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
        title={isMuted ? '开启音效' : '关闭音效'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      
      {/* 背景音乐开关（右边）- 单独控制BGM */}
      <button
        onClick={toggleBgmMute}
        className={`px-1.5 sm:px-2 py-1.5 text-xs border rounded transition-colors ${
          isBgmMuted 
            ? 'border-gray-700 text-gray-500 hover:border-red-500 hover:text-red-500' 
            : 'border-gray-700 hover:border-[#00ff41] hover:text-[#00ff41]'
        }`}
        title={isBgmMuted ? '开启背景音乐' : '关闭背景音乐'}
      >
        <Music className={`w-4 h-4 ${isBgmMuted ? 'opacity-50' : ''}`} />
      </button>
    </div>
  )
}

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useLangStore } from '../stores/langStore'

interface SacrificePitProps {
  isActive: boolean
  onSacrifice: () => void
  nftName?: string
  tokenReward?: number
}

export const SacrificePit: React.FC<SacrificePitProps> = ({
  isActive,
  onSacrifice,
  nftName = 'NFT',
  tokenReward = 888
}) => {
  const { lang } = useLangStore()
  const isEN = lang === 'en'
  const [isBurning, setIsBurning] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [tokenRain, setTokenRain] = useState<{ id: number; left: number; delay: number }[]>([])

  const handleSacrifice = async () => {
    if (!isActive || isBurning) return
    
    setIsBurning(true)
    
    // Screen shake
    document.body.classList.add('minting-shake')
    
    // Wait for burning animation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    document.body.classList.remove('minting-shake')
    
    // Show reward with token rain
    setShowReward(true)
    
    // Generate token rain particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5
    }))
    setTokenRain(particles)
    
    // Callback
    onSacrifice()
    
    // Reset after animation
    setTimeout(() => {
      setIsBurning(false)
      setShowReward(false)
      setTokenRain([])
    }, 3000)
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Token Rain Effect */}
      {tokenRain.map(particle => (
        <div
          key={particle.id}
          className="token-rain-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`
          }}
        >
          🪙
        </div>
      ))}

      {/* Reward Popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🔥</div>
              <h2 className="text-3xl font-bold text-orange-400 font-pixel mb-2">
                {isEN ? 'SACRIFICED!' : '献祭成功！'}
              </h2>
              <p className="text-gray-400 mb-4">
                {isEN ? `${nftName} has been burned` : `${nftName} 已化为灰烬`}
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-5xl font-bold text-yellow-400"
              >
                + {tokenReward.toLocaleString()} $GD
              </motion.div>
              <p className="text-xs text-gray-500 mt-4">
                {isEN ? 'Airdrop allocation saved to your wallet' : '空投份额已记录至钱包'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Sacrifice Pit */}
      <div 
        className={`sacrifice-pit ${isActive ? 'active' : ''} ${isBurning ? 'sacrifice-explode' : ''} cursor-pointer`}
        onClick={handleSacrifice}
      >
        {/* Flames */}
        <div className="sacrifice-flames">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flame"
              style={{
                left: `${10 + i * 12}%`,
                height: `${40 + Math.random() * 40}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Flame className={`w-16 h-16 ${isActive ? 'text-green-400' : 'text-orange-500'} ${isBurning ? 'animate-pulse' : ''}`} />
        </div>
      </div>

      {/* Label */}
      <div className="mt-4 text-center">
        <p className={`text-sm font-bold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
          {isEN ? 'SACRIFICE PIT' : '献祭火盆'}
        </p>
        <p className="text-xs text-gray-600">
          {isActive 
            ? (isEN ? 'Click to burn NFT for airdrop' : '点击献祭 NFT 换取空投')
            : (isEN ? 'Drag NFT here to activate' : '拖拽 NFT 至此激活')
          }
        </p>
      </div>
    </div>
  )
}

export default SacrificePit

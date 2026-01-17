import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skull, Gem, HelpCircle, Crown, Share2, RotateCcw } from 'lucide-react'
import { GachaResult, RARITY_CONFIG, Rarity } from '../data/cryptoProjects'

interface CryptoCardProps {
  result: GachaResult
  isRevealing?: boolean
  onReveal?: () => void
}

const RarityIcon: Record<Rarity, React.ReactNode> = {
  trash: <Skull className="w-5 h-5" />,
  plate: <Gem className="w-5 h-5" />,
  schrodinger: <HelpCircle className="w-5 h-5" />,
  casino: <Crown className="w-5 h-5" />,
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ 
  result, 
  isRevealing = false,
  onReveal 
}) => {
  const [isFlipped, setIsFlipped] = useState(!isRevealing)
  const config = RARITY_CONFIG[result.rarity]
  const { project } = result

  const handleFlip = () => {
    if (isRevealing && !isFlipped) {
      setIsFlipped(true)
      onReveal?.()
    }
  }

  return (
    <div 
      className="card-flip w-full max-w-sm mx-auto cursor-pointer"
      onClick={handleFlip}
    >
      <motion.div
        className={`card-flip-inner relative w-full aspect-[3/4] ${isFlipped ? 'flipped' : ''}`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 卡牌背面 - 抽卡前 */}
        <div 
          className="card-front absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center p-6 border-2 border-gray-700">
            <div className="text-6xl mb-4 animate-float">⛩️</div>
            <h3 className="text-xl font-bold text-goldman-gold mb-2">Gas Temple</h3>
            <p className="text-sm text-gray-400 text-center">点击翻转揭示命运</p>
            <div className="mt-4 w-16 h-1 bg-gradient-to-r from-transparent via-goldman-gold to-transparent animate-pulse" />
          </div>
        </div>

        {/* 卡牌正面 - 项目信息 */}
        <div 
          className={`card-back absolute inset-0 rounded-2xl overflow-hidden ${
            result.rarity === 'casino' ? 'casino-glow' : ''
          }`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className={`w-full h-full bg-gradient-to-br ${config.bgGradient} border-2 flex flex-col`}
            style={{ borderColor: config.color }}
          >
            {/* 稀有度标签 */}
            <div 
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
              style={{ backgroundColor: config.color }}
            >
              {RarityIcon[result.rarity]}
              <span>{config.label}</span>
            </div>

            {/* 项目Logo和基本信息 */}
            <div className="flex-1 p-4 flex flex-col">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{project.logo}</div>
                <h2 className="text-xl font-bold text-white">{project.name}</h2>
                <p className="text-sm text-gray-400">${project.symbol}</p>
              </div>

              {/* 价格和涨跌 */}
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-lg font-mono text-white">{project.price}</span>
                <span className={`text-sm font-bold ${
                  project.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {project.change24h >= 0 ? '+' : ''}{project.change24h}%
                </span>
              </div>

              {/* 庞氏指数 */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>庞氏指数 (Ponzi Index)</span>
                  <span>{project.ponziIndex}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full ponzi-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.ponziIndex}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* 一句话研报 */}
              <div className="bg-black/30 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-300 italic">"{project.oneLiner}"</p>
              </div>

              {/* 白皮书黑话翻译 */}
              <div className="bg-black/30 rounded-lg p-3 text-xs">
                <p className="text-gray-500 mb-1">📄 白皮书翻译机:</p>
                <p className="text-gray-300">{project.whitePaperBS}</p>
              </div>
            </div>

            {/* 底部运势和建议 */}
            <div className="border-t border-gray-700/50 p-3 bg-black/20">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">🔮 {result.fortune}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">💡 {result.advice}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CryptoCard

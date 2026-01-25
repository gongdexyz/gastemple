import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Copy, Check, Send, Gift, Coins } from 'lucide-react'
import { useLangStore } from '../stores/langStore'
import { useGachaStore } from '../stores/gachaStore'

interface InviteFriendsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLangStore()
  const { addGD } = useGachaStore()
  const isEN = lang === 'en'
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const referralLink = 'https://gongde.xyz/?ref=YOUR_ID'
  const shareText = isEN 
    ? '🔮 I just burned 888 $GD at Gas Temple and got roasted by an AI fortune teller. Your turn to get rekt 👉'
    : '🔮 我刚在 Gas Temple 烧了 888 功德币，被 AI 算命先生毒舌了一顿。轮到你来挨骂了 👉'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: 'twitter' | 'telegram') => {
    const encodedText = encodeURIComponent(shareText + ' ' + referralLink)
    
    if (platform === 'twitter') {
      window.open(`https://x.com/intent/tweet?text=${encodedText}`, '_blank')
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`, '_blank')
    }
    
    // 模拟分享奖励
    setShared(true)
    addGD(88)
  }

  const handleWatchAd = () => {
    // 模拟看广告获得奖励
    addGD(50)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full"
          >
            {/* 终端风格边框 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41] to-[#00ff41] opacity-50 blur-sm" />
            <div className="relative bg-black border-2 border-[#00ff41] p-6 font-mono">
              <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
              
              {/* 标题 */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#00ff41]/30">
                <Gift className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-[#00ff41] font-bold text-lg">
                    {isEN ? '💸 BROKE ALREADY?' : '💸 功德不足？'}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {isEN ? 'No problem, we got options' : '没关系，有办法'}
                  </p>
                </div>
              </div>

              {/* 方案1：邀请好友 - 主推 */}
              <div className="mb-4 p-4 bg-[#00ff41]/10 border border-[#00ff41]/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-5 h-5 text-[#00ff41]" />
                  <span className="text-[#00ff41] font-bold">
                    {isEN ? 'OPTION 1: SPREAD THE CURSE' : '方案一：传播诅咒'}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-yellow-500 text-black rounded-full font-bold">
                    {isEN ? 'RECOMMENDED' : '推荐'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {isEN 
                    ? 'Share your misery with friends. Each share = 88 $GD. Misery loves company.'
                    : '把你的痛苦分享给朋友。每次分享 = 88 $GD。独乐乐不如众乐乐。'
                  }
                </p>
                
                {/* 分享按钮 */}
                <div className="flex gap-2 mb-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('twitter')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-black hover:bg-gray-900 text-white rounded font-bold text-sm border border-gray-700"
                  >
                    <span className="font-bold text-lg">𝕏</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('telegram')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded font-bold text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Telegram
                  </motion.button>
                </div>

                {/* 复制链接 */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-black border border-gray-700 rounded px-2 py-1 text-xs text-gray-400"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>

                {shared && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-400 text-sm mt-2 text-center"
                  >
                    🎉 +88 $GD {isEN ? 'earned!' : '到账！'}
                  </motion.p>
                )}
              </div>

              {/* 方案2：充值 - 次要 */}
              <div className="mb-4 p-3 bg-gray-900/50 border border-gray-700 rounded-lg opacity-70">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400 text-sm">
                    {isEN ? 'OPTION 2: BUY MORE $GD' : '方案二：充值 $GD'}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-2">
                  {isEN 
                    ? 'For the impatient whales. Buy $GD on Raydium.'
                    : '给急着送钱的大户。去 Raydium 买 $GD。'
                  }
                </p>
                <button 
                  className="w-full py-2 text-sm text-gray-500 border border-gray-700 rounded hover:border-gray-500 transition-colors"
                  onClick={() => window.open('https://raydium.io', '_blank')}
                >
                  {isEN ? '[ GO TO RAYDIUM ]' : '[ 前往 RAYDIUM ]'}
                </button>
              </div>

              {/* 方案3：看广告 */}
              <div className="p-3 bg-gray-900/30 border border-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">
                    {isEN ? 'OPTION 3: Watch ad for 50 $GD' : '方案三：看广告得 50 $GD'}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWatchAd}
                    className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded"
                  >
                    {isEN ? '[ WATCH ]' : '[ 观看 ]'}
                  </motion.button>
                </div>
              </div>

              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="mt-4 w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                {isEN ? '[ CLOSE ]' : '[ 关闭 ]'}
              </button>

              {/* 底部小字 */}
              <p className="mt-3 text-[10px] text-gray-600 text-center">
                {isEN 
                  ? '* Sharing is caring. And also free $GD.'
                  : '* 分享即关爱。还能白嫖功德币。'
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InviteFriendsModal

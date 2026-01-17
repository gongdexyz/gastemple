import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import { GachaResult } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  result: GachaResult | null
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, result }) => {
  const { lang } = useLangStore()
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const isEN = lang === 'en'

  if (!result) return null

  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  const timeStr = now.toTimeString().split(' ')[0]
  const txId = `#${Math.random().toString(36).slice(2, 6).toUpperCase()}...FAIL`

  const getPonziLevel = () => {
    const level = result.fortune.level
    if (level === 'N') return 99
    if (level === 'R') return 75
    if (level === 'SR') return 45
    return 20
  }

  const memeNotesCN = [
    "全是情绪没有价值。但情绪也是价值。等等，这不对。",
    "别人恐惧我贪婪，别人贪婪我破产。",
    "这不是亏损，这是学费。学费已交十万。",
    "长期主义者 = 还没割肉。",
    "价值投资就是套牢的借口。",
    "流动性去哪了？我也想知道。",
    "格局打开，钱包打空。"
  ]
  const memeNotesEN = [
    "SER YOU ARE THE EXIT LIQUIDITY. HAVE FUN STAYING POOR.",
    "DIAMOND HANDS? MORE LIKE BAG HOLDER HANDS.",
    "THIS IS NOT A LOSS, IT'S A LEARNING EXPERIENCE. EXPENSIVE ONE.",
    "WAGMI? MORE LIKE WAGBI (WE'RE ALL GONNA BE INSOLVENT).",
    "DEV DID SOMETHING. THAT SOMETHING WAS BUYING A LAMBO.",
    "NOT FINANCIAL ADVICE. ALSO NOT NOT FINANCIAL ADVICE.",
    "TOUCH GRASS? IN THIS ECONOMY?"
  ]

  const getAnalystNote = () => {
    const ponzi = getPonziLevel()
    if (ponzi > 90) {
      return isEN 
        ? memeNotesEN[Math.floor(Math.random() * memeNotesEN.length)]
        : memeNotesCN[Math.floor(Math.random() * memeNotesCN.length)]
    }
    if (ponzi > 60) {
      return isEN
        ? "MODERATE PONZI DETECTED. WHITEPAPER IS AI-GENERATED. TEAM ANON FOR A REASON."
        : "中等含庞量。白皮书AI写的。团队匿名是有原因的。"
    }
    if (ponzi > 30) {
      return isEN
        ? "LOW PONZI SCORE. BUT THAT DOESN'T MEAN IT WON'T RUG. JUST A CLASSIER RUG."
        : "含庞量较低。但这不代表不会跑路。只是跑得更有格调。"
    }
    return isEN
      ? "SURPRISINGLY LOW PONZI. EITHER LEGIT OR THE BIGGEST SCAM OF ALL TIME."
      : "含庞量出奇地低。要么是真项目，要么是史上最大骗局。"
  }

  const handleDownload = async () => {
    if (!receiptRef.current) return
    setIsGenerating(true)
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: null,
        scale: 2,
      })
      
      const link = document.createElement('a')
      link.download = `gas-temple-receipt-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Failed to generate receipt:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 text-center"
          >
            <h3 className="text-xl font-pixel text-yellow-400 mb-2">
              {isEN ? 'RECEIPT GENERATED' : '小票已生成'}
            </h3>
            <p className="text-xs text-gray-400">
              {isEN ? 'Long press to save or screenshot' : '长按图片保存，或截图发给难友'}
            </p>
          </motion.div>

          {/* Receipt */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              ref={receiptRef}
              className="receipt-paper w-[320px] p-5 shadow-2xl"
            >
              {/* Ink stains for authenticity */}
              <div className="ink-stain" style={{ top: 20, right: 30 }} />
              <div className="ink-stain" style={{ bottom: 80, left: 15 }} />
              <div className="ink-stain" style={{ top: 150, right: 10 }} />

              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold tracking-tighter">GAS TEMPLE</h2>
                <p className="text-xs uppercase">Cyber Monastery & Casino</p>
                <p className="text-xs mt-1">Loc: The Metaverse</p>
              </div>

              <div className="receipt-line" />

              {/* Transaction Info */}
              <div className="flex justify-between text-sm mb-1">
                <span>DATE:</span>
                <span>{dateStr}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>TIME:</span>
                <span>{timeStr}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TXID:</span>
                <span>{txId}</span>
              </div>

              <div className="receipt-line" />

              {/* Items */}
              <div className="flex justify-between font-bold text-base mb-2">
                <span>ITEM</span>
                <span>PRICE</span>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">
                    1 x {result.fortune.coin?.symbol?.toUpperCase() || 'UNKNOWN'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.fortune.level} / {getPonziLevel() > 70 ? 'HIGH RISK' : getPonziLevel() > 40 ? 'MED RISK' : 'LOW RISK'}
                  </div>
                </div>
                <div className="font-bold text-right">YOUR SOUL</div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div className="font-bold">GAS FEE</div>
                <div className="font-bold">TOO MUCH</div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div className="font-bold">KARMA EARNED</div>
                <div className="font-bold text-green-700">+{result.gdEarned} $GD</div>
              </div>

              <div className="receipt-line" />

              {/* Total */}
              <div className="flex justify-between text-xl font-bold my-3">
                <span>TOTAL LOSS:</span>
                <span>∞</span>
              </div>

              <div className="receipt-line" />

              {/* Ponzi Meter */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>PONZI LEVEL:</span>
                  <span className="font-bold">{getPonziLevel()}%</span>
                </div>
                <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600"
                    style={{ width: `${getPonziLevel()}%` }}
                  />
                </div>
              </div>

              <div className="receipt-line" />

              {/* Analyst Notes */}
              <div className="mb-4">
                <p className="font-bold text-sm mb-1">ANALYST NOTES:</p>
                <p className="text-[10px] leading-tight uppercase" style={{ fontFamily: 'sans-serif' }}>
                  "{getAnalystNote()}"
                </p>
              </div>

              {/* Barcode */}
              <div className="text-center mt-6">
                <div className="barcode-font">{Math.random().toString().slice(2, 12)}</div>
                <p className="text-[10px] mt-1">NO REFUNDS • GOOD LUCK</p>
                <p className="text-[10px] mt-2 font-bold">gongde.xyz</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex gap-3"
          >
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2 font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? (isEN ? 'GENERATING...' : '生成中...') : (isEN ? 'DOWNLOAD' : '下载图片')}
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 border border-white text-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
              {isEN ? 'CLOSE' : '关闭'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReceiptModal

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Skull, Heart } from 'lucide-react'
import { useLangStore } from '../stores/langStore'

interface PaymentConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  drawCount: number
  cost?: string
}

type DialogStyle = 'system' | 'monk' | 'honest'

const getDialogContent = (style: DialogStyle, drawCount: number, isEN: boolean, cost: string) => {
  if (style === 'system') {
    // AI 系统警告流
    if (drawCount === 0) {
      return {
        icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
        title: isEN ? '⚠️ SYSTEM ALERT' : '⚠️ 系统警告',
        message: isEN 
          ? `Spinning the Wheel of Fate requires ${cost} SOL of computing power.\nWARNING: This operation is irreversible, with 99.9% chance of "Thanks for playing".\nProceed anyway?`
          : `启动命运轮盘需消耗 ${cost} SOL 算力。\n警告：此操作不可逆，且 99.9% 概率获得"谢谢惠顾"。\n是否继续作死？`,
        confirmText: isEN ? '[ CONFIRM SACRIFICE ]' : '[ 确认献祭 ]',
        cancelText: isEN ? '[ LET ME THINK ]' : '[ 我再想想 ]',
      }
    } else if (drawCount < 5) {
      return {
        icon: <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />,
        title: isEN ? '⚠️ DOPAMINE OVERLOAD' : '⚠️ 多巴胺过载',
        message: isEN
          ? `Abnormal dopamine levels detected.\nAre you sure you want to spend another ${cost} SOL to learn a lesson?\nThat money could buy you a nice sandwich.`
          : `检测到多巴胺分泌异常。\n你确定要再花 ${cost} SOL 买个教训？\n这钱留着买个肉包子不香吗？`,
        confirmText: isEN ? '[ I AM BUILT DIFFERENT ]' : '[ 我就是头铁 ]',
        cancelText: isEN ? '[ GET SANDWICH ]' : '[ 去买包子 ]',
      }
    } else {
      return {
        icon: <Skull className="w-8 h-8 text-purple-500" />,
        title: isEN ? '⚠️ WHALE DETECTED' : '⚠️ 检测到大户',
        message: isEN
          ? `You again? Your mining rig must be running hot.\nSince you insist on helping Dev afford a Lambo, I won't hold back.`
          : `又是你？看来你家矿机还没停。\n既然你执意要帮 Dev 换法拉利，那我就不客气了。`,
        confirmText: isEN ? '[ SHUT UP, TAKE IT ]' : '[ 闭嘴，拿钱 ]',
        cancelText: isEN ? '[ STRATEGIC RETREAT ]' : '[ 战略撤退 ]',
      }
    }
  } else if (style === 'monk') {
    // 赛博高僧流
    if (drawCount === 0) {
      return {
        icon: <span className="text-4xl">🙏</span>,
        title: isEN ? '🙏 HOLD, TRAVELER' : '🙏 施主请留步',
        message: isEN
          ? `Peeking at destiny comes with a price.\nLeave ${cost} SOL as incense money, and this humble monk shall open your third eye.\n(Though you'll probably see hell.)`
          : `窥探天机是要付出代价的。\n留下 ${cost} SOL 香火钱，贫僧为你开启天眼。\n（虽然大概率看到的是地狱）`,
        confirmText: isEN ? '[ OFFERING ACCEPTED ]' : '[ 随喜功德 ]',
        cancelText: isEN ? '[ NEXT TIME ]' : '[ 下次一定 ]',
      }
    } else if (drawCount < 5) {
      return {
        icon: <span className="text-4xl">📿</span>,
        title: isEN ? '🙏 ATTACHMENT RUNS DEEP' : '🙏 执念太深',
        message: isEN
          ? `Dear traveler, wealth is but fleeting.\nCannot take it when you're born, cannot take it when you die.\nWhy not give it all to this humble monk?\n(To help you let go... of your wallet.)`
          : `施主，钱财乃身外之物，生带不来死带不去。\n不如都给贫僧，助你早日放下。\n（指钱包归零）`,
        confirmText: isEN ? '[ IF NOT ME, THEN WHO ]' : '[ 我不入地狱谁入地狱 ]',
        cancelText: isEN ? '[ PRESERVE MYSELF ]' : '[ 保全自身 ]',
      }
    } else {
      return {
        icon: <span className="text-4xl">☸️</span>,
        title: isEN ? '☸️ KARMA ACCUMULATING' : '☸️ 业障累积中',
        message: isEN
          ? `This humble monk senses your wallet crying.\nYet you return for more suffering.\nTruly, you have attained... something.`
          : `贫僧感应到你的钱包在哭泣。\n然而你仍返回受苦。\n施主，你悟了...某种东西。`,
        confirmText: isEN ? '[ SUFFERING IS PATH ]' : '[ 苦海无边 ]',
        cancelText: isEN ? '[ TURN BACK ]' : '[ 回头是岸 ]',
      }
    }
  } else {
    // 坦诚相见流
    if (drawCount === 0) {
      return {
        icon: <span className="text-4xl">💸</span>,
        title: isEN ? '💸 FRIENDLY REMINDER' : '💸 友情提示',
        message: isEN
          ? `Once you click, ${cost} SOL is gone forever.\nEven buying a shitcoin would at least make a sound.\nHere? You might just get a jpeg.\n\nThought it through?`
          : `这一发下去，${cost} SOL 就没了。\n这点钱哪怕是买土狗，好歹还能听个响。\n在我这，你可能只得到一张 jpg。\n\n想清楚了吗？`,
        confirmText: isEN ? '[ YOLO ]' : '[ 梭哈 ]',
        cancelText: isEN ? '[ BEING RATIONAL ]' : '[ 理性一点 ]',
      }
    } else if (drawCount < 5) {
      return {
        icon: <span className="text-4xl">📉</span>,
        title: isEN ? '📉 INVESTMENT ADVICE' : '📉 投资建议',
        message: isEN
          ? `Current gas fee could buy you a nice bowl of ramen.\nAre you sure you want to use it on a possibly corrupted research report?`
          : `现在的 Gas 费够你吃顿隆江猪脚饭了。\n你确定要用来抽一个可能全是乱码的研报？`,
        confirmText: isEN ? '[ HIGH-RISK > FOOD ]' : '[ 猪脚饭哪有高风险香 ]',
        cancelText: isEN ? '[ TRUE, RETREAT ]' : '[ 也是，撤了 ]',
      }
    } else {
      return {
        icon: <Heart className="w-8 h-8 text-pink-500" />,
        title: isEN ? '❤️ HONEST WORDS' : '❤️ 掏心窝子的话',
        message: isEN
          ? `Look, we both know this is high-risk.\nI'm here to take your money, you're here to test your luck.\nLet's be real with each other.\n\nBut hey, I appreciate your degeneracy.`
          : `咱也不装了，这就是高风险。\n我是来割你的，你是来赌运气的。\n大家坦坦荡荡。\n\n但说真的，我喜欢你这股傻劲。`,
        confirmText: isEN ? '[ RESPECT, TAKE IT ]' : '[ 敬你是条汉子 ]',
        cancelText: isEN ? '[ TOO REAL, BYE ]' : '[ 太真实了，告辞 ]',
      }
    }
  }
}

export const PaymentConfirmDialog: React.FC<PaymentConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  drawCount,
  cost = '0.01'
}) => {
  const { lang } = useLangStore()
  const isEN = lang === 'en'
  const [style, setStyle] = useState<DialogStyle>('system')
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // 随机选择一种风格
      const styles: DialogStyle[] = ['system', 'monk', 'honest']
      setStyle(styles[Math.floor(Math.random() * styles.length)])
      setTypedText('')
      setIsTyping(true)
    }
  }, [isOpen])

  const content = getDialogContent(style, drawCount, isEN, cost)

  useEffect(() => {
    if (isOpen && isTyping) {
      const fullText = content.message
      let index = 0
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          clearInterval(timer)
        }
      }, 20)
      return () => clearInterval(timer)
    }
  }, [isOpen, isTyping, content.message])

  const handleConfirm = () => {
    if (!isTyping) {
      onConfirm()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full"
          >
            {/* 终端风格边框 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41] via-[#00ff41] to-[#00ff41] opacity-50 blur-sm" />
            <div className="relative bg-black border-2 border-[#00ff41] p-6 font-mono">
              {/* 扫描线效果 */}
              <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
              
              {/* 标题栏 */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#00ff41]/30">
                {content.icon}
                <h3 className="text-[#00ff41] font-bold text-lg tracking-wider">
                  {content.title}
                </h3>
              </div>

              {/* 打字机效果的消息 */}
              <div className="mb-6 min-h-[120px]">
                <p className="text-[#00ff41] text-sm leading-relaxed whitespace-pre-line">
                  <span className="text-gray-500">&gt; </span>
                  {typedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-[#00ff41] ml-1"
                    />
                  )}
                </p>
              </div>

              {/* 费用提示 */}
              <div className="mb-4 p-2 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded">
                <p className="text-center text-sm">
                  <span className="text-gray-400">{isEN ? 'Transaction Cost: ' : '交易费用：'}</span>
                  <span className="text-yellow-400 font-bold">{cost} SOL</span>
                </p>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={isTyping}
                  className={`
                    flex-1 py-3 px-4 text-sm font-bold transition-all
                    ${isTyping 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-500 text-white'
                    }
                  `}
                >
                  {content.confirmText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 text-sm font-bold border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 transition-all"
                >
                  {content.cancelText}
                </motion.button>
              </div>

              {/* 底部小字 */}
              <p className="mt-4 text-[10px] text-gray-600 text-center">
                {isEN 
                  ? '* Dev promises: This money will improve HIS quality of life, not yours.'
                  : '* Dev 承诺：这笔钱将用于改善他的生活质量，而不是你的。'
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentConfirmDialog

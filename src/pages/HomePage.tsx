import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, AlertTriangle } from 'lucide-react'
import { Header } from '../components/Header'
import { DrawButton } from '../components/DrawButton'
import { FortuneCard } from '../components/FortuneCard'
import { GlitchTransition } from '../components/GlitchTransition'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore, GachaResult } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'

// 投资情境题
const QUIZ_QUESTIONS = [
  {
    question: '抄底时你会？',
    options: [
      { text: 'A. 技术分析', modifier: 0 },
      { text: 'B. 信仰梭哈', modifier: 1 },
      { text: 'C. 装死不动', modifier: -1 },
    ],
  },
  {
    question: '看到-50%时你的反应？',
    options: [
      { text: 'A. 加仓抄底', modifier: 1 },
      { text: 'B. 删除App', modifier: 0 },
      { text: 'C. 发微博骂街', modifier: -1 },
    ],
  },
  {
    question: '你相信？',
    options: [
      { text: 'A. 技术改变世界', modifier: 0 },
      { text: 'B. 早期红利', modifier: 1 },
      { text: 'C. 都是骗局', modifier: -1 },
    ],
  },
]

export const HomePage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const { draw, dailyDraws, gdBalance, isDrawing, isRevealing, revealCard, history } = useGachaStore()
  const [showQuiz, setShowQuiz] = useState(false)
  const [drawnResult, setDrawnResult] = useState<GachaResult | null>(null)
  
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const freeDrawsLeft = Math.max(0, 1 - dailyDraws)
  const randomQuiz = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]

  const handleDraw = async () => {
    if (freeDrawsLeft === 0 && gdBalance < 100) {
      alert('功德不足，请积攒功德后再来')
      return
    }
    
    // 显示情境题
    setShowQuiz(true)
  }

  const handleQuizAnswer = async () => {
    setShowQuiz(false)
    
    // 执行抽卡
    const result = await draw()
    if (result) {
      setDrawnResult(result)
    }
  }

  const handleReveal = () => {
    revealCard()
    setDrawnResult(null)
  }

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-lg mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div 
              className="text-5xl mb-4"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isDegen ? '🐸' : '⛩️'}
            </motion.div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDegen ? 'text-degen-green font-pixel text-2xl neon-text' : 'text-goldman-gold'
            }`}>
              {isDegen ? 'CYBER MERIT ($GD)' : '赛博积德 ($GD)'}
            </h1>
            <p className={`text-lg mb-4 ${isDegen ? 'text-degen-cyan' : 'text-gray-400'}`}>
              {isDegen ? 'ON-CHAIN MOKUGYO, ONLINE BEGGING' : '链上木鱼，在线化缘'}
            </p>
            <div className="flex justify-center gap-3">
              <a 
                href="#" 
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  isDegen 
                    ? 'bg-degen-green text-black hover:bg-degen-yellow' 
                    : 'bg-goldman-gold text-black hover:bg-amber-400'
                }`}
              >
                {isDegen ? '🙏 DONATE (BUY)' : '🙏 施舍 (BUY)'}
              </a>
              <a 
                href="#" 
                className={`px-6 py-2 rounded-lg font-bold border transition-all ${
                  isDegen 
                    ? 'border-degen-green text-degen-green hover:bg-degen-green/20' 
                    : 'border-goldman-gold text-goldman-gold hover:bg-goldman-gold/20'
                }`}
              >
                {isDegen ? '👀 WATCH (CHART)' : '👀 围观 (CHART)'}
              </a>
            </div>
          </motion.div>

          {/* 免责声明 */}
          <motion.div 
            className={`mb-6 p-3 rounded-lg text-xs flex items-start gap-2 ${
              isDegen ? 'bg-red-900/30 text-red-400' : 'bg-amber-900/30 text-amber-400'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              NFA (Not Financial Advice) - 本工具仅供娱乐，不构成任何投资建议。
              抽到什么跟你的命运无关，跟我们的随机算法有关。
            </span>
          </motion.div>

          {/* 抽卡区域 */}
          <AnimatePresence mode="wait">
            {drawnResult && isRevealing ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-8"
              >
                <FortuneCard 
                  result={drawnResult} 
                  onReveal={handleReveal}
                />
              </motion.div>
            ) : (
              <motion.div
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 mb-8"
              >
                {/* 香炉图标 */}
                <motion.div 
                  className="text-6xl"
                  animate={{ 
                    y: [0, -5, 0],
                    filter: isDegen 
                      ? ['hue-rotate(0deg)', 'hue-rotate(360deg)'] 
                      : undefined
                  }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity },
                    filter: { duration: 3, repeat: Infinity }
                  }}
                >
                  🏮
                </motion.div>
                
                <DrawButton
                  onClick={handleDraw}
                  isLoading={isDrawing}
                  disabled={isDrawing}
                  freeDrawsLeft={freeDrawsLeft}
                  gdCost={100}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 最近抽卡历史 */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-4 rounded-xl ${
                isDegen ? 'bg-degen-bg border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <History className={`w-4 h-4 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`} />
                <span className={`text-sm font-medium ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                  最近抽卡
                </span>
              </div>
              <div className="space-y-2">
                {history.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isDegen ? 'bg-black/30' : 'bg-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.fortune.emoji}</span>
                      <div>
                        <p className="text-sm text-white font-medium">
                          {isEN ? item.fortune.titleEN : item.fortune.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.fortune.coin?.symbol?.toUpperCase() || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded font-bold"
                      style={{ 
                        backgroundColor: `${
                          item.fortune.level === 'SSR' ? '#f59e0b' :
                          item.fortune.level === 'SR' ? '#8b5cf6' :
                          item.fortune.level === 'R' ? '#3b82f6' : '#6b7280'
                        }20`,
                        color: item.fortune.level === 'SSR' ? '#f59e0b' :
                               item.fortune.level === 'SR' ? '#8b5cf6' :
                               item.fortune.level === 'R' ? '#3b82f6' : '#6b7280'
                      }}
                    >
                      {item.fortune.level}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* 情境题弹窗 */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-sm p-6 rounded-2xl ${
                isDegen ? 'bg-degen-bg border border-degen-green' : 'bg-gray-900 border border-goldman-border'
              }`}
            >
              <h3 className={`text-lg font-bold mb-4 ${
                isDegen ? 'text-degen-green font-pixel text-sm' : 'text-goldman-gold'
              }`}>
                🎯 韭菜的十字路口
              </h3>
              <p className="text-white mb-4">{randomQuiz.question}</p>
              <div className="space-y-2">
                {randomQuiz.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer()}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      isDegen 
                        ? 'bg-degen-green/10 hover:bg-degen-green/20 text-degen-green border border-degen-green/30' 
                        : 'bg-goldman-gold/10 hover:bg-goldman-gold/20 text-goldman-gold border border-goldman-gold/30'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, TrendingDown, AlertTriangle, Users, DoorOpen, Share2, RotateCcw, Sparkles, Skull } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { CryptoProject, calculatePonziScore } from '../data/mockProjects'
import { getRandomQuote, getRandomSoulType, getPonziLevel, LOST_SOUL_TYPES } from '../data/poisonousQuotes'

interface PoisonousReportProps {
  project: CryptoProject
  onClose: () => void
  onRetry: () => void
}

export const PoisonousReport: React.FC<PoisonousReportProps> = ({ project, onClose, onRetry }) => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'

  const ponziScore = calculatePonziScore(project)
  const ponziLevel = getPonziLevel(ponziScore)
  const buddhaQuote = getRandomQuote(isEN)
  const soulType = getRandomSoulType()
  const soulInfo = LOST_SOUL_TYPES[soulType]

  const handleShare = () => {
    const text = isEN 
      ? `🔮 I drew "${project.name}" at Cyber Temple!\n\n"${buddhaQuote}"\n\nPonzi Index: ${ponziScore}% ${ponziLevel.emoji}\n\n⛩️ gongde.xyz\n#GONGDE #CyberKarma`
      : `🔮 我在赛博寺庙抽到了「${project.name}」！\n\n"${buddhaQuote}"\n\n庞氏指数: ${ponziScore}% ${ponziLevel.emoji}\n\n⛩️ gongde.xyz\n#GONGDE #功德`
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6
          ${isDegen 
            ? 'bg-gradient-to-b from-gray-900 to-black border-2 border-degen-green/50' 
            : 'bg-gradient-to-b from-gray-900 to-black border border-goldman-border'
          }
        `}
      >
        {/* 佛祖判词 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="text-4xl mb-3">🐸</div>
          <p className={`
            text-lg font-bold font-pixel
            ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}
          `}>
            "{buddhaQuote}"
          </p>
          <p className="text-xs text-gray-500 mt-2">— {isEN ? 'Buddha says' : '佛曰'}</p>
        </motion.div>

        {/* 项目信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`
            p-4 rounded-xl mb-4
            ${isDegen ? 'bg-degen-green/10 border border-degen-green/30' : 'bg-goldman-gold/10 border border-goldman-border'}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xl font-bold ${isDegen ? 'text-degen-green font-pixel' : 'text-white'}`}>
              {project.name}
            </h2>
            <span className={`text-sm px-2 py-1 rounded ${isDegen ? 'bg-degen-purple/30 text-degen-cyan' : 'bg-gray-700 text-gray-300'}`}>
              {project.ticker}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">{project.chain}</span>
            {project.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            {isEN ? project.description_en : project.description_cn}
          </p>
        </motion.div>

        {/* 庞氏指数 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`
            p-4 rounded-xl mb-4 text-center
            ${isDegen ? 'bg-black/50 border border-degen-pink/30' : 'bg-gray-800/50 border border-gray-700'}
          `}
        >
          <h3 className={`text-sm font-bold mb-2 ${isDegen ? 'text-degen-pink font-pixel' : 'text-gray-400'}`}>
            {isEN ? 'PONZI INDEX™' : '庞氏指数™'}
          </h3>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl">{ponziLevel.emoji}</span>
            <div>
              <span className={`text-4xl font-bold ${ponziLevel.color}`}>
                {ponziScore}%
              </span>
              <p className={`text-sm ${ponziLevel.color}`}>
                {isEN ? ponziLevel.en : ponziLevel.cn}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {isEN ? ponziLevel.desc_en : ponziLevel.desc_cn}
          </p>
        </motion.div>

        {/* 五维度分析 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2 mb-4"
        >
          <h3 className={`text-sm font-bold mb-3 ${isDegen ? 'text-degen-cyan font-pixel' : 'text-gray-400'}`}>
            {isEN ? 'BREAKDOWN' : '五维分析'}
          </h3>
          
          <div className="grid grid-cols-1 gap-2 text-xs">
            <MetricBar 
              icon={<AlertTriangle className="w-3 h-3" />}
              label={isEN ? 'Narrative Dependency' : '叙事依赖度'}
              value={project.ponziMetrics.narrativeDependency}
              max={25}
              isDegen={isDegen}
            />
            <MetricBar 
              icon={<TrendingDown className="w-3 h-3" />}
              label={isEN ? 'Cash Flow' : '现金流自给率'}
              value={project.ponziMetrics.cashFlowSelfSufficiency}
              max={25}
              isDegen={isDegen}
              inverted
            />
            <MetricBar 
              icon={<Skull className="w-3 h-3" />}
              label={isEN ? 'Token Dependency' : 'Token依赖度'}
              value={project.ponziMetrics.tokenDependency}
              max={20}
              isDegen={isDegen}
            />
            <MetricBar 
              icon={<Users className="w-3 h-3" />}
              label={isEN ? 'Late-Comer Risk' : '后来者接盘风险'}
              value={project.ponziMetrics.lateComerRisk}
              max={20}
              isDegen={isDegen}
            />
            <MetricBar 
              icon={<DoorOpen className="w-3 h-3" />}
              label={isEN ? 'Exit Dependency' : '退出依赖性'}
              value={project.ponziMetrics.exitDependency}
              max={10}
              isDegen={isDegen}
            />
          </div>
        </motion.div>

        {/* 佛祖的温柔提醒 - 软萌毒舌分析 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`
            p-4 rounded-3xl mb-4 relative overflow-hidden
            ${isDegen ? 'bg-pink-100/10 border border-pink-300/40 shadow-lg shadow-pink-500/20' : 'bg-pink-50/5 border border-pink-200/30 shadow-lg shadow-pink-400/10'}
          `}
        >
          {/* 可爱装饰 - 星星闪烁 */}
          <div className="absolute top-2 right-2 opacity-30">
            <Sparkles className="w-4 h-4 text-pink-300 animate-pulse" />
          </div>
          
          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDegen ? 'text-pink-400 font-pixel' : 'text-pink-400'}`}>
            <Heart className="w-4 h-4 fill-current animate-pulse" />
            {isEN ? "BUDDHA'S GENTLE REMINDER" : '佛祖的温柔提醒'}
            <Heart className="w-4 h-4 fill-current animate-pulse" />
          </h3>
          <ul className="space-y-2">
            {(isEN ? project.roast_en : project.roast_cn).map((roast, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-pink-400">💕</span>
                {roast}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 盈利模式 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`
            p-4 rounded-xl mb-4
            ${isDegen ? 'bg-degen-purple/10 border border-degen-purple/30' : 'bg-gray-800/50 border border-gray-700'}
          `}
        >
          <h3 className={`text-sm font-bold mb-2 ${isDegen ? 'text-degen-purple font-pixel' : 'text-gray-400'}`}>
            {isEN ? 'HOW IT MAKES MONEY' : '它靠什么活着'}
          </h3>
          <p className="text-sm text-gray-300">
            {isEN ? project.revenueModel_en : project.revenueModel_cn}
          </p>
        </motion.div>

        {/* 迷途羔羊类型 - 软萌版 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`
            p-4 rounded-3xl mb-6 text-center relative overflow-hidden
            ${isDegen ? 'bg-purple-100/10 border border-purple-300/40 shadow-lg shadow-purple-500/20' : 'bg-purple-50/5 border border-purple-200/30 shadow-lg shadow-purple-400/10'}
          `}
        >
          {/* 可爱装饰 */}
          <div className="absolute top-2 left-2 opacity-20">
            <Sparkles className="w-3 h-3 text-purple-300" />
          </div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <Sparkles className="w-3 h-3 text-purple-300" />
          </div>
          
          <h3 className={`text-sm font-bold mb-2 ${isDegen ? 'text-purple-400 font-pixel' : 'text-purple-400'}`}>
            {isEN ? 'YOU ARE A...' : '你是哪种迷途羔羊'}
          </h3>
          <p className={`text-2xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-white'}`}>
            {isEN ? soulInfo.en : soulInfo.cn}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isEN ? soulInfo.desc_en : soulInfo.desc_cn}
          </p>
        </motion.div>

        {/* 免责声明 */}
        <p className="text-[10px] text-gray-600 text-center mb-4">
          {isEN 
            ? '⚠️ Entertainment only. Not financial advice. DYOR.'
            : '⚠️ 娱乐性指标，用于叙事结构分析，不构成投资建议。'
          }
        </p>

        {/* 按钮 */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className={`
              flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2
              ${isDegen 
                ? 'bg-degen-green text-black font-pixel' 
                : 'bg-goldman-gold text-black'
              }
            `}
          >
            <RotateCcw className="w-4 h-4" />
            {isEN ? 'DRAW AGAIN' : '再抽一签'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className={`
              flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2
              ${isDegen 
                ? 'bg-degen-purple text-white font-pixel' 
                : 'bg-blue-600 text-white'
              }
            `}
          >
            <Share2 className="w-4 h-4" />
            {isEN ? 'SHARE' : '分享'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 指标条组件
const MetricBar: React.FC<{
  icon: React.ReactNode
  label: string
  value: number
  max: number
  isDegen: boolean
  inverted?: boolean
}> = ({ icon, label, value, max, isDegen, inverted }) => {
  const percentage = (value / max) * 100
  const getColor = () => {
    if (inverted) {
      if (percentage > 70) return 'bg-green-500'
      if (percentage > 40) return 'bg-yellow-500'
      return 'bg-red-500'
    }
    if (percentage > 70) return 'bg-red-500'
    if (percentage > 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="flex items-center gap-2">
      <span className={isDegen ? 'text-degen-green' : 'text-gray-400'}>{icon}</span>
      <span className="text-gray-400 w-28 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
      <span className="text-gray-400 w-8 text-right">{value}</span>
    </div>
  )
}

export default PoisonousReport

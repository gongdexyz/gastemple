import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Lock, CheckCircle, Skull } from 'lucide-react'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { useGachaStore } from '../stores/gachaStore'
import { ProofOfRekt } from '../components/ProofOfRekt'
import { SacrificePit } from '../components/SacrificePit'

// NFT Relic definitions
const RELICS = [
  {
    id: 'leek-id',
    tier: 1,
    nameCN: '认证韭菜身份证',
    nameEN: 'Verified Leek ID',
    descCN: '灵魂绑定代币 (SBT) - 证明你是合格的韭菜',
    descEN: 'Soulbound Token (SBT) - Proof of being a certified leek',
    requirementCN: '首次连接钱包 + 余额 < 0.1 SOL',
    requirementEN: 'First wallet connect + Balance < 0.1 SOL',
    cost: 0,
    costType: 'free',
    icon: '🪪',
    effect: '门票资格',
    effectEN: 'Entry ticket',
    cardClass: '',
  },
  {
    id: 'cyber-relic',
    tier: 2,
    nameCN: '赛博舍利子',
    nameEN: 'Cyber Relic',
    descCN: '功德金身 - 修行有成的证明',
    descEN: 'Golden Body - Proof of spiritual cultivation',
    requirementCN: '功德值 ≥ 10,000 或 收集 5 个骨灰盒',
    requirementEN: 'Merit ≥ 10,000 or Collect 5 graveyard coins',
    cost: 10000,
    costType: 'merit',
    icon: '💎',
    effect: '空投权重 +20%, 免费抽签 +3/天',
    effectEN: '+20% airdrop weight, +3 free draws/day',
    cardClass: 'golden',
  },
  {
    id: 'rug-insurance',
    tier: 3,
    nameCN: '免死金牌',
    nameEN: 'Rug Pull Insurance',
    descCN: '赎罪券 - 可直接兑换空投',
    descEN: 'Indulgence - Directly redeemable for airdrop',
    requirementCN: '极低概率抽签获得 或 消耗 50,000 功德合成',
    requirementEN: 'Ultra-rare gacha drop or Synthesize with 50,000 merit',
    cost: 50000,
    costType: 'merit',
    icon: '🔥',
    effect: 'TGE 时销毁换取大额代币',
    effectEN: 'Burn at TGE for massive token allocation',
    cardClass: 'burning',
  },
]

export const MintPage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const { gdBalance: merit, history } = useGachaStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'

  const [mintingRelic, setMintingRelic] = useState<string | null>(null)
  const [mintedRelics, setMintedRelics] = useState<string[]>(['leek-id']) // Demo: first one owned
  const [showFlash, setShowFlash] = useState(false)
  const [showResult, setShowResult] = useState<typeof RELICS[0] | null>(null)
  const [drainAmount, setDrainAmount] = useState(0)

  const canMint = (relic: typeof RELICS[0]) => {
    if (mintedRelics.includes(relic.id)) return false
    if (relic.costType === 'free') return true
    if (relic.costType === 'merit') return merit >= relic.cost
    return false
  }

  const handleMint = async (relic: typeof RELICS[0]) => {
    if (!canMint(relic) || mintingRelic) return

    setMintingRelic(relic.id)
    setDrainAmount(relic.cost)

    // Shake animation
    document.body.classList.add('minting-shake')
    
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    document.body.classList.remove('minting-shake')
    
    // Golden flash
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 800)

    // Show result
    setMintedRelics(prev => [...prev, relic.id])
    setShowResult(relic)
    setMintingRelic(null)
    setDrainAmount(0)
  }

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      {/* Golden Flash Effect */}
      {showFlash && <div className="golden-flash" />}

      <main className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-5xl mb-3">🕯️</div>
            <h1 className={`text-2xl font-bold ${isDegen ? 'text-degen-green font-pixel text-xl neon-text' : 'text-goldman-gold'}`}>
              {isEN ? 'THE MINTING SHRINE' : '藏经阁 · 开光祭坛'}
            </h1>
            <p className={`text-sm mt-2 ${isDegen ? 'text-gray-400' : 'text-gray-500'}`}>
              {isEN ? 'Forge your Cyber Relics with accumulated merit' : '以功德铸造赛博法器'}
            </p>
            
            {/* Current Merit Display */}
            <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${
              isDegen ? 'bg-degen-yellow/20 border border-degen-yellow/50' : 'bg-goldman-gold/20 border border-goldman-gold/50'
            }`}>
              <Flame className={`w-4 h-4 ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`} />
              <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                {isEN ? 'Merit:' : '功德:'} {merit.toLocaleString()}
              </span>
              {drainAmount > 0 && (
                <motion.span 
                  className="text-red-400 merit-draining"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0, y: -20 }}
                >
                  -{drainAmount.toLocaleString()}
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Shrine Background - GPU Buddha */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative mb-8 p-6 rounded-xl text-center ${
              isDegen ? 'bg-black/50 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'
            }`}
          >
            {/* ASCII Art GPU Buddha */}
            <pre className={`text-xs font-mono ${isDegen ? 'text-degen-green/60' : 'text-goldman-gold/60'} mb-4`}>
{`      ████████████████████
    ██░░░░░░░░░░░░░░░░░░░░██
   █░░╔══════════════════╗░░█
   █░░║  ⚡ CYBER BUDDHA ⚡ ║░░█
   █░░║   ◉ ═══════ ◉    ║░░█
   █░░║      ╔═══╗       ║░░█
   █░░║      ║ ☯ ║       ║░░█
   █░░║      ╚═══╝       ║░░█
   █░░╚══════════════════╝░░█
    ██░░░░░░░░░░░░░░░░░░░░██
      ████████████████████
         ║║║║║║║║║║║║
       ⚡ GPU POWERED ⚡`}
            </pre>
            <p className={`text-xs italic ${isDegen ? 'text-gray-500' : 'text-gray-600'}`}>
              {isEN ? '"Code is Law. Rug is Karma."' : '"代码即法律。归零即因果。"'}
            </p>
          </motion.div>

          {/* NFT Relics Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {RELICS.map((relic, i) => {
              const owned = mintedRelics.includes(relic.id)
              const minting = mintingRelic === relic.id
              const affordable = canMint(relic)
              
              return (
                <motion.div
                  key={relic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="nft-card-container mx-auto"
                >
                  <div className={`nft-card ${relic.cardClass} ${minting ? 'minting-shake' : ''} p-4 flex flex-col`}>
                    {/* Tier Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                      relic.tier === 1 ? 'bg-gray-600 text-gray-200' :
                      relic.tier === 2 ? 'bg-yellow-600 text-yellow-100' :
                      'bg-orange-600 text-orange-100'
                    }`}>
                      {relic.tier === 1 ? 'SBT' : relic.tier === 2 ? 'RARE' : 'LEGENDARY'}
                    </div>

                    {/* Icon */}
                    <div className="text-6xl text-center mt-4 mb-2">
                      {relic.icon}
                    </div>

                    {/* Name */}
                    <h3 className={`text-center font-bold text-lg mb-1 ${
                      relic.tier === 3 ? 'text-orange-400' :
                      relic.tier === 2 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {isEN ? relic.nameEN : relic.nameCN}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-400 text-center mb-3">
                      {isEN ? relic.descEN : relic.descCN}
                    </p>

                    {/* Requirement */}
                    <div className={`text-xs p-2 rounded mb-3 ${isDegen ? 'bg-black/50' : 'bg-gray-800/50'}`}>
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <Lock className="w-3 h-3" />
                        {isEN ? 'Requirement:' : '解锁条件:'}
                      </div>
                      <div className="text-gray-300">
                        {isEN ? relic.requirementEN : relic.requirementCN}
                      </div>
                    </div>

                    {/* Effect */}
                    <div className={`text-xs p-2 rounded mb-4 ${isDegen ? 'bg-degen-green/10' : 'bg-goldman-gold/10'}`}>
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <Zap className="w-3 h-3" />
                        {isEN ? 'Effect:' : '效果:'}
                      </div>
                      <div className={relic.tier === 3 ? 'text-orange-300' : relic.tier === 2 ? 'text-yellow-300' : 'text-green-300'}>
                        {isEN ? relic.effectEN : relic.effect}
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Mint Button */}
                    {owned ? (
                      <div className="flex items-center justify-center gap-2 py-3 rounded bg-green-900/30 border border-green-500/50 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        {isEN ? 'OWNED' : '已拥有'}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMint(relic)}
                        disabled={!affordable || minting}
                        className={`w-full py-3 rounded font-bold transition-all ${
                          minting 
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 animate-pulse'
                            : affordable
                              ? relic.tier === 3 
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500 hover:bg-orange-500/30'
                                : relic.tier === 2
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500 hover:bg-yellow-500/30'
                                  : 'bg-green-500/20 text-green-400 border border-green-500 hover:bg-green-500/30'
                              : 'bg-gray-700/50 text-gray-500 border border-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {minting ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              ⚡
                            </motion.div>
                            {isEN ? 'MINTING...' : '开光中...'}
                          </span>
                        ) : relic.costType === 'free' ? (
                          isEN ? '🪪 CLAIM FREE' : '🪪 免费领取'
                        ) : (
                          `🔥 ${isEN ? 'MINT' : '铸造'} (${relic.cost.toLocaleString()} ${isEN ? 'Merit' : '功德'})`
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-8 p-4 rounded-xl text-center ${
              isDegen ? 'bg-black/30 border border-degen-green/20' : 'bg-gray-900/30 border border-gray-700'
            }`}
          >
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <div className="text-gray-500">{isEN ? 'Relics Owned' : '已拥有法器'}</div>
                <div className={`text-2xl font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                  {mintedRelics.length} / {RELICS.length}
                </div>
              </div>
              <div>
                <div className="text-gray-500">{isEN ? 'Airdrop Weight' : '空投权重'}</div>
                <div className={`text-2xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                  {mintedRelics.includes('cyber-relic') ? '+20%' : '+0%'}
                </div>
              </div>
              <div>
                <div className="text-gray-500">{isEN ? 'Draws Today' : '今日抽签次数'}</div>
                <div className={`text-2xl font-bold ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold'}`}>
                  {history.length}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Proof of Rekt Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-8 p-6 rounded-xl ${
              isDegen ? 'bg-black/50 border border-red-500/30' : 'bg-gray-900/50 border border-gray-700'
            }`}
          >
            <ProofOfRekt onVerified={(proofs) => {
              console.log('Verified proofs:', proofs)
            }} />
          </motion.div>

          {/* Sacrifice Pit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`mt-8 p-6 rounded-xl ${
              isDegen ? 'bg-black/50 border border-orange-500/30' : 'bg-gray-900/50 border border-gray-700'
            }`}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Skull className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-orange-400 font-pixel">
                  {isEN ? 'THE BURNING RITUAL' : '献祭仪式'}
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                {isEN 
                  ? 'Sacrifice your NFT to receive airdrop allocation'
                  : '献祭 NFT 换取空投份额'
                }
              </p>
            </div>
            
            <div className="flex justify-center">
              <SacrificePit
                isActive={mintedRelics.length > 1}
                onSacrifice={() => {
                  console.log('NFT sacrificed!')
                }}
                nftName={isEN ? 'Cyber Relic' : '赛博舍利子'}
                tokenReward={8888}
              />
            </div>
            
            {mintedRelics.length <= 1 && (
              <p className="text-center text-xs text-gray-500 mt-4">
                {isEN 
                  ? '⚠️ You need at least 2 NFTs to sacrifice one'
                  : '⚠️ 需要至少 2 个 NFT 才能献祭'
                }
              </p>
            )}
          </motion.div>

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs text-gray-600 italic">
            {isEN 
              ? '"These NFTs have no real value. Just like your portfolio."'
              : '"这些 NFT 没有任何实际价值。就像你的投资组合一样。"'
            }
          </p>
        </div>
      </main>

      {/* Mint Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResult(null)}
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="nft-card-container"
              onClick={e => e.stopPropagation()}
            >
              <div className={`nft-card ${showResult.cardClass} p-6 flex flex-col items-center justify-center`}>
                <div className="text-xs text-gray-400 mb-2">{isEN ? 'MINTED SUCCESSFULLY' : '铸造成功'}</div>
                <div className="text-8xl mb-4">{showResult.icon}</div>
                <h3 className={`text-xl font-bold mb-2 text-center ${
                  showResult.tier === 3 ? 'text-orange-400' :
                  showResult.tier === 2 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {isEN ? showResult.nameEN : showResult.nameCN}
                </h3>
                <p className="text-sm text-gray-400 text-center mb-4">
                  {isEN ? showResult.descEN : showResult.descCN}
                </p>
                <div className={`text-sm p-3 rounded w-full text-center ${
                  isDegen ? 'bg-black/50' : 'bg-gray-800/50'
                }`}>
                  <span className="text-gray-500">{isEN ? 'Effect: ' : '效果: '}</span>
                  <span className="text-green-400">{isEN ? showResult.effectEN : showResult.effect}</span>
                </div>
                <button
                  onClick={() => setShowResult(null)}
                  className={`mt-4 px-6 py-2 rounded font-bold ${
                    isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
                  }`}
                >
                  {isEN ? 'AWESOME!' : '太棒了！'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MintPage

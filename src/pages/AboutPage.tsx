import React from 'react'
import { motion } from 'framer-motion'
import { Coins, AlertTriangle, Twitter, MessageCircle } from 'lucide-react'
import { Header } from '../components/Header'
import { GlitchTransition } from '../components/GlitchTransition'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'

export const AboutPage: React.FC = () => {
  const { mode } = useThemeStore()
  const { lang } = useLangStore()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'

  // CN version (Goldman mode - homepage)
  const roadmapCN = [
    { phase: '阶段一：黑客松', items: ['参加 Solana Hackathon，做个能用的产品', '公平发射 $GONGDE，无预售无老鼠仓', '前端开源，逻辑透明'] },
    { phase: '阶段二：发射', items: ['Pump.fun 发射 $GONGDE', '启动 SKR 赋能机制（国库分配）', '上线木鱼游戏，开始积累 TVL'] },
    { phase: '阶段三：赋能', items: ['持续支持 $SKR 流动性', '扩展更多玩法（抽卡、排行榜）', '增强 Seeker 生态共识'] },
  ]

  const roadmapEN = [
    { phase: 'Phase 1: HACKATHON', items: ['Build a working product for Solana Hackathon', 'Fair launch $GONGDE via Pump.fun (no presale, no VC)', 'Frontend open source & transparent logic'] },
    { phase: 'Phase 2: LAUNCH', items: ['Deploy $GONGDE on Pump.fun', 'Activate SKR empowerment (treasury allocation)', 'Launch wooden fish game, accumulate TVL'] },
    { phase: 'Phase 3: EMPOWER', items: ['Keep supporting $SKR liquidity', 'Add more features (gacha, leaderboard)', 'Strengthen Seeker ecosystem consensus'] },
  ]

  const faqsCN = [
    { q: '为什么要为 $SKR 做这个？', a: '因为 Seeker 社区有技术、有共识，但缺少趣味性和流动性。我们用游戏化的方式增强社区粘性，同时用国库收入支持 SKR 生态建设。' },
    { q: '$GONGDE 和 $SKR 什么关系？', a: '$GONGDE 是游戏代币，你玩游戏赚 $GONGDE。玩家用 $SKR 购买代敲服务，这些 SKR 进入国库：50% 回购销毁 $GONGDE，30% 支持 SKR 流动性（减少抛压），20% 用于开发。两个币独立但互相赋能。' },
    { q: '这是黑客松项目？', a: '对，参加 Solana Hackathon。前端代码开源，逻辑透明，不是 PPT 项目。主打一个真诚。' },
    { q: 'Dev 会跑路吗？', a: 'Pump.fun 发射，LP 自动烧毁，合约开源。想跑也跑不了，链上透明自己查。' },
  ]

  const faqsEN = [
    { q: 'Why build this for $SKR?', a: 'Seeker community has solid tech & consensus, but lacks fun & liquidity. We use gamification to boost engagement, while treasury revenue supports SKR ecosystem growth.' },
    { q: 'What\'s the relationship between $GONGDE and $SKR?', a: '$GONGDE is the game token. You play, earn $GONGDE. Players pay $SKR for auto-tap service → Treasury: 50% buyback & burn $GONGDE, 30% support SKR liquidity (reduce sell pressure), 20% dev & ops. Two tokens, mutual empowerment.' },
    { q: 'Is this a hackathon project?', a: 'Yes, for Solana Hackathon. Frontend is open source, logic is transparent. Not a PPT project. We keep it real.' },
    { q: 'Will dev rug?', a: 'Pump.fun launch, LP burned, contract open source. Can\'t rug even if I wanted to. Check on-chain yourself.' },
  ]

  const roadmap = isEN ? roadmapEN : roadmapCN
  const faqs = isEN ? faqsEN : faqsCN

  return (
    <div className={`min-h-screen ${isDegen ? 'bg-degen-bg' : 'bg-goldman-bg'}`}>
      <GlitchTransition />
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div 
              className="text-6xl mb-4"
              animate={isDegen ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {isDegen ? '🐸' : '⛩️'}
            </motion.div>
            <h1 className={`text-3xl font-bold mb-2 ${isDegen ? 'text-degen-green font-pixel text-2xl neon-text' : 'text-goldman-gold'}`}>
              {isEN ? 'CYBER KARMA ($GONGDE)' : '赛博积德 ($GONGDE)'}
            </h1>
            <p className={`text-lg ${isDegen ? 'text-degen-cyan' : 'text-gray-400'}`}>
              {isEN ? 'Your portfolio is red because your Karma is low. Tap to purify your shitcoin sins.' : '链上木鱼，在线化缘'}
            </p>
          </motion.div>

          {/* What is this */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className={`mb-8 p-5 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDegen ? 'text-degen-green font-pixel' : 'text-goldman-gold'}`}>
              {isEN ? 'WTF IS THIS SH*T?' : '这到底是个啥？'}
            </h2>
            {isEN ? (
              <div className={`space-y-3 text-sm leading-relaxed ${isDegen ? 'text-gray-300' : 'text-gray-400'}`}>
                <p>Listen, <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>anon</span>. This is <span className={`font-bold ${isDegen ? 'text-degen-cyan' : 'text-yellow-400'}`}>Solana's "Cyber Sedative"</span>. 💊</p>
                <p>Bro, tired of staring at charts? Stop making random trades, <span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>every transaction is just feeding the whales.</span> (cool)</p>
                <p>Come chill here. In this <span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-yellow-400'}`}>weird cyber temple</span>, we'll keep your $SKR alive.</p>
                <p><span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>One tap, +1 karma, -1 anxiety.</span> (warm)</p>
                <p>In this crazy market, <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>I'll wait for the wind with you.</span></p>
                <p className="italic opacity-70">Can't save your wallet, but at least I can make you smile~ 💕</p>
              </div>
            ) : (
              <div className={`space-y-3 text-sm leading-relaxed ${isDegen ? 'text-gray-300' : 'text-gray-400'}`}>
                <p>别问，问就是 <span className={`font-bold ${isDegen ? 'text-degen-cyan' : 'text-yellow-400'}`}>Solana 链上的「赛博镇静剂」</span>。💊</p>
                <p>兄弟，K线看累了吧？别在那儿瞎操作了，<span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>你的每一次交易都是给庄家送钱。</span> (酷飒)</p>
                <p>不如来这儿歇会儿。我们在这个 <span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-yellow-400'}`}>奇怪的赛博庙</span> 里，给你的 $SKR 续个命。</p>
                <p><span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-green-400'}`}>敲一下，功德 +1，焦虑 -1。</span> (暖心)</p>
                <p>在这个疯狂的市场里，<span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>我陪你一起等风来。</span></p>
                <p className="italic opacity-70">虽然我救不了你的钱包，但至少能让你开心点~ 💕</p>
              </div>
            )}
          </motion.div>

          {/* Tokenomics - Classified Document Style */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`mb-8 p-5 rounded-xl relative overflow-hidden ${isDegen ? 'bg-black/50 border-2 border-red-500/50' : 'bg-gray-900/50 border border-goldman-border'}`}>
            
            {/* Top Secret Stamp */}
            {isDegen && (
              <div className="absolute top-2 right-2 rotate-12 border-2 border-red-500 text-red-500 px-2 py-1 text-xs font-bold opacity-60">
                CLASSIFIED
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-4">
              <Coins className={`w-5 h-5 ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`} />
              <h2 className={`text-xl font-bold ${isDegen ? 'text-degen-yellow font-pixel' : 'text-goldman-gold'}`}>
                {isEN ? '█████NOMICS (REDACTED)' : '██密文件：代币分配'}
              </h2>
            </div>
            
            <div className="space-y-3 font-mono text-sm">
              {/* Total Supply */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40' : 'bg-goldman-gold/10'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-green-400' : 'text-goldman-gold'}>{isEN ? 'SUPPLY:' : '总量:'}</span>
                  <div className="text-right">
                    <span className="text-white">{isEN ? '1,000,000,000' : '10亿个'}</span>
                    <p className={`text-xs ${isDegen ? 'text-gray-500' : 'text-gray-400'}`}>
                      ({isEN ? 'Fair Launch via Pump.fun' : 'Pump.fun 公平发射'})
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Dev Fund */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40' : 'bg-goldman-gold/10'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-degen-yellow' : 'text-yellow-400'}>{isEN ? '☕ DEV FUND:' : '☕ 开发基金:'}</span>
                  <div className="text-right">
                    <span className="text-white">20%</span>
                    <p className={`text-xs ${isDegen ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                      {isEN ? 'Dev gotta eat, can\'t survive on air, right? 😂' : 'Dev也要吃饭，总不能让我去喝西北风吧？😂'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* SKR Empowerment */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40 border-2 border-degen-yellow' : 'bg-goldman-gold/10 border-2 border-yellow-400'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-degen-yellow' : 'text-yellow-400'}>{isEN ? '🔥 SKR EMPOWERMENT:' : '🔥 SKR 赋能机制:'}</span>
                  <div className="text-right">
                    <div className={`text-xs ${isDegen ? 'text-degen-cyan' : 'text-gray-300'} space-y-1`}>
                      <p><span className="font-bold text-white">50%</span> {isEN ? '→ Buyback & Burn $GONGDE' : '→ 回购销毁 $GONGDE'}</p>
                      <p><span className="font-bold text-white">30%</span> {isEN ? '→ $SKR Liquidity Support' : '→ $SKR 流动性支持'}</p>
                      <p><span className="font-bold text-white">20%</span> {isEN ? '→ Dev & Operations' : '→ 开发与运营'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* LP */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40' : 'bg-goldman-gold/10'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-green-400' : 'text-goldman-gold'}>{isEN ? 'LP STATUS:' : 'LP锁仓:'}</span>
                  <div className="text-right">
                    <span className="line-through text-gray-500 mr-2">{isEN ? 'Locked' : '理论上可以跑'}</span>
                    <span className={`${isDegen ? 'text-orange-400' : 'text-white'}`}>
                      {isEN ? '🔥 That\'s chemistry, irreversible!' : '🔥 那是化学反应，不可逆'}
                    </span>
                    <p className={`text-xs ${isDegen ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                      ({isEN ? 'Like your wallet, it\'s not coming back' : '就像你的钱包，回不去了'}) 😂
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Audit */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40' : 'bg-goldman-gold/10'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-green-400' : 'text-goldman-gold'}>{isEN ? 'CODE:' : '代码:'}</span>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 text-xs rounded ${isDegen ? 'bg-degen-cyan/20 text-degen-cyan' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      {isEN ? 'Frontend Open Source' : '前端开源'}
                    </span>
                    <p className={`text-xs ${isDegen ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                      ({isEN ? 'Although my code might be messy, but absolutely no backdoors!' : '虽然我写的代码可能有点乱，但绝对没有后门！'}) 😅
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coffee stain effect */}
            {isDegen && (
              <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-amber-900/10 blur-sm" />
            )}
          </motion.div>

          {/* Roadmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`mb-8 p-5 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDegen ? 'text-degen-pink font-pixel' : 'text-goldman-gold'}`}>
              {isEN ? '🍕 THE MASTER PLAN (COPIUM)' : '画个大饼 (Roadmap)'}
            </h2>
            <div className="space-y-4">
              {roadmap.map((r, i) => (
                <div key={i} className={`p-3 rounded-lg ${isDegen ? 'bg-degen-purple/10 border-l-4 border-degen-purple' : 'bg-amber-900/10 border-l-4 border-goldman-gold'}`}>
                  <h3 className={`font-bold mb-2 ${isDegen ? 'text-degen-purple' : 'text-goldman-gold'}`}>{r.phase}</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {r.items.map((item, j) => <li key={j}>• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className={`mb-8 p-5 rounded-xl ${isDegen ? 'bg-black/30 border border-degen-green/30' : 'bg-gray-900/50 border border-goldman-border'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDegen ? 'text-degen-cyan font-pixel' : 'text-goldman-gold'}`}>
              {isEN ? 'FAQ (ROAST EDITION)' : '常见问题 (怼人版)'}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className={`font-bold mb-1 ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>Q: {faq.q}</h3>
                  <p className="text-sm text-gray-400">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risk Warning */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-5 rounded-xl mb-6 bg-red-900/20 border border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className={`text-lg font-bold text-red-400 ${isDegen ? 'font-pixel text-sm' : ''}`}>
                {isEN ? '⚠️ NFA / DYOR' : '风险提示'}
              </h2>
            </div>
            {isEN ? (
              <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
                <p>This is a <span className="text-red-400 font-bold">Solana Hackathon project</span> + <span className="text-yellow-400 font-bold">social experiment</span>.</p>
                <p><span className="font-bold text-white">No intrinsic value. No promises. Just code & vibes.</span></p>
                <p>The <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>SKR buyback mechanism</span> is real and on-chain, but crypto is volatile. DYOR.</p>
                <p>If you lose money, your Karma was simply too low. Consider touching grass.</p>
                <p className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-pink-400'}`}>Hackathon Disclaimer: This is an experimental project. Use at your own risk.</p>
                <p className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>DYOR. NFA. Don't bet your rent money, degen.</p>
              </div>
            ) : (
              <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
                <p>本项目是 <span className="text-red-400 font-bold">Solana 黑客松作品</span> + <span className="text-yellow-400 font-bold">社交实验</span>。</p>
                <p><span className="font-bold text-white">没有内在价值，没有财务回报承诺，只有代码和信仰。</span></p>
                <p><span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>SKR 回购机制</span>是真实的且链上可查，但加密货币波动大，自己做研究。</p>
                <p>如果你亏钱了，说明你功德还不够，建议再去庙里真捐点。</p>
                <p className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-pink-400'}`}>黑客松免责：这是实验性项目，使用风险自负。</p>
                <p className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>DYOR, 别梭哈，留点钱吃饭。</p>
              </div>
            )}
          </motion.div>

          {/* 社交链接 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex justify-center gap-4">
            <a href="https://x.com/gongdexyz" target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full transition-all ${isDegen ? 'bg-degen-green/20 hover:bg-degen-green/30 text-degen-green' : 'bg-goldman-gold/20 hover:bg-goldman-gold/30 text-goldman-gold'}`}>
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://t.me/mugongde" target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full transition-all ${isDegen ? 'bg-degen-green/20 hover:bg-degen-green/30 text-degen-green' : 'bg-goldman-gold/20 hover:bg-goldman-gold/30 text-goldman-gold'}`}>
              <MessageCircle className="w-5 h-5" />
            </a>
          </motion.div>
          
          {/* Powered by Seeker + Built on Solana */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-gray-700"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>⚡</span>
                <span>{isEN ? 'Powered by' : '基于'}</span>
                <a 
                  href="https://seeker.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`font-bold transition-colors ${isDegen ? 'text-degen-cyan hover:text-degen-green' : 'text-cyan-400 hover:text-cyan-300'}`}
                >
                  Seeker ($SKR)
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>🔗</span>
                <span>{isEN ? 'Built on' : '构建于'}</span>
                <a 
                  href="https://solana.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`font-bold transition-colors ${isDegen ? 'text-degen-purple hover:text-degen-pink' : 'text-purple-400 hover:text-purple-300'}`}
                >
                  Solana
                </a>
              </div>
              <div className={`text-xs italic ${isDegen ? 'text-degen-cyan' : 'text-gray-500'}`}>
                {isEN 
                  ? 'Layer-2 Loyalty Program for Seeker Stakers'
                  : 'Seeker 质押者的 Layer-2 忠诚度计划'
                }
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default AboutPage

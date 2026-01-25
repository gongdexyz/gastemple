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
    { phase: '阶段一：黑客松', items: ['参加 Solana Hackathon，做个能用的产品', '公平发射 $GD，无预售无老鼠仓', '开源代码，接受社区审计'] },
    { phase: '阶段二：发射', items: ['Pump.fun 发射 $GD', '启动 SKR 赋能机制（国库分配）', '上线木鱼游戏，开始积累 TVL'] },
    { phase: '阶段三：赋能', items: ['持续支持 $SKR 流动性', '扩展更多玩法（抽卡、排行榜）', '增强 Seeker 生态共识'] },
  ]

  const roadmapEN = [
    { phase: 'Phase 1: HACKATHON', items: ['Build a working product for Solana Hackathon', 'Fair launch $GD via Pump.fun (no presale, no VC)', 'Open source everything'] },
    { phase: 'Phase 2: LAUNCH', items: ['Deploy $GD on Pump.fun', 'Activate SKR empowerment (treasury allocation)', 'Launch wooden fish game, accumulate TVL'] },
    { phase: 'Phase 3: EMPOWER', items: ['Keep supporting $SKR liquidity', 'Add more features (gacha, leaderboard)', 'Strengthen Seeker ecosystem consensus'] },
  ]

  const faqsCN = [
    { q: '为什么要为 $SKR 做这个？', a: '因为 Seeker 社区有技术、有共识，但缺少趣味性和流动性。我们用游戏化的方式增强社区粘性，同时用国库收入支持 SKR 生态建设。' },
    { q: '$GD 和 $SKR 什么关系？', a: '$GD 是游戏代币，你玩游戏赚 $GD。玩家用 $SKR 购买代敲服务，这些 SKR 进入国库：50% 回购销毁 $GD，30% 支持 SKR 流动性（减少抛压），20% 用于开发。两个币独立但互相赋能。' },
    { q: '这是黑客松项目？', a: '对，参加 Solana Hackathon。代码开源，逻辑透明，不是 PPT 项目。主打一个真诚。' },
    { q: 'Dev 会跑路吗？', a: 'Pump.fun 发射，LP 自动烧毁，合约开源。想跑也跑不了，链上透明自己查。' },
  ]

  const faqsEN = [
    { q: 'Why build this for $SKR?', a: 'Seeker community has solid tech & consensus, but lacks fun & liquidity. We use gamification to boost engagement, while treasury revenue supports SKR ecosystem growth.' },
    { q: 'What\'s the relationship between $GD and $SKR?', a: '$GD is the game token. You play, earn $GD. Players pay $SKR for auto-tap service → Treasury: 50% buyback & burn $GD, 30% support SKR liquidity (reduce sell pressure), 20% dev & ops. Two tokens, mutual empowerment.' },
    { q: 'Is this a hackathon project?', a: 'Yes, for Solana Hackathon. Code is open source, logic is transparent. Not a PPT project. We keep it real.' },
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
              {isEN ? 'CYBER KARMA ($GD)' : '赛博积德 ($GD)'}
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
                <p>Listen, <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>anon</span>. This is <span className={`font-bold ${isDegen ? 'text-degen-cyan' : 'text-yellow-400'}`}>Seeker ecosystem's "Hyperbolic Time Chamber"</span>.</p>
                <p>Tired of staring at charts? Feeling anxious? <span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-yellow-400'}`}>Come relax here.</span></p>
                <p>We built this <span className={`font-bold ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold'}`}>Cyber Monastery</span> for the <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>$SKR community</span>. You tap wooden fish, earn $GD, and we use game revenue to <span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-yellow-400'}`}>build the SKR ecosystem</span>.</p>
                <p className={`font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>Not just a Meme. It's a consensus amplifier.</p>
                <p className="italic opacity-70">Every tap is an on-chain blessing for Seeker. <span className="font-bold">Keep Building, Keep Believing.</span></p>
              </div>
            ) : (
              <div className={`space-y-3 text-sm leading-relaxed ${isDegen ? 'text-gray-300' : 'text-gray-400'}`}>
                <p>别问，问就是 <span className={`font-bold ${isDegen ? 'text-degen-cyan' : 'text-yellow-400'}`}>Seeker 生态的「精神时光屋」</span>。</p>
                <p>兄弟，做交易累了吧？盯着 K 线容易焦虑？<span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-yellow-400'}`}>来这里放松一下。</span></p>
                <p>我们为 <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-yellow-400'}`}>$SKR</span> 社区打造了这个<span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>赛博修道院</span>。你敲木鱼赚 $GD，我们负责把游戏收入用于<span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-yellow-400'}`}>建设 SKR 生态</span>。</p>
                <p><span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>不仅仅是 Meme，更是共识放大器。</span></p>
                <p className="italic opacity-70">在这里，每一次点击都是对 Seeker 的一次链上祈福。<span className="font-bold">Keep Building, Keep Believing.</span></p>
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
              
              {/* Tax */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40' : 'bg-goldman-gold/10'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-green-400' : 'text-goldman-gold'}>{isEN ? 'TAX:' : '税:'}</span>
                  <div className="text-right">
                    <span className="text-white">0%</span>
                    <span className={`ml-2 text-xs ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                      {isEN ? '(Pump.fun standard)' : '(Pump.fun 标准)'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* SKR Empowerment */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40 border-2 border-degen-yellow' : 'bg-goldman-gold/10 border-2 border-yellow-400'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-degen-yellow' : 'text-yellow-400'}>{isEN ? '🔥 SKR EMPOWERMENT:' : '🔥 SKR 赋能机制:'}</span>
                  <div className="text-right">
                    <div className={`text-xs ${isDegen ? 'text-degen-cyan' : 'text-gray-300'} space-y-1`}>
                      <p><span className="font-bold text-white">50%</span> {isEN ? '→ Buyback & Burn $GD' : '→ 回购销毁 $GD'}</p>
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
                    <span className="line-through text-gray-500 mr-2">{isEN ? 'Locked' : '自动烧'}</span>
                    <span className={`${isDegen ? 'text-orange-400' : 'text-white'}`}>
                      {isEN ? '🔥 CREMATED' : '🔥 直接送进火葬场'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Audit */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40' : 'bg-goldman-gold/10'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-green-400' : 'text-goldman-gold'}>{isEN ? 'AUDIT:' : '审计:'}</span>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 text-xs rounded ${isDegen ? 'bg-degen-pink/20 text-degen-pink' : 'bg-pink-500/20 text-pink-400'}`}>
                      {isEN ? 'Hackathon Build' : '黑客松作品'}
                    </span>
                    <p className={`text-xs ${isDegen ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                      ({isEN ? 'Open source on GitHub' : 'GitHub 开源'})
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
        </div>
      </main>
    </div>
  )
}

export default AboutPage

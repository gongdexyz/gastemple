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
    { phase: '阶段一：活着', items: ['我把币发出来，你们把币买进去', '只要今晚没归零，这阶段就算成功'] },
    { phase: '阶段二：做梦', items: ['市值到 100K，我再跑几个 AI 视频', '能上交易所，我直播敲真正的木鱼'] },
    { phase: '阶段三：随缘', items: ['翻 100 倍？那是命', '归零了？那是缘', '别问我有啥计划，我的计划就是躺平'] },
  ]

  const roadmapEN = [
    { phase: 'Phase 1: SURVIVAL', items: ['Deploy coin', 'Pray it doesn\'t go to zero in 5 minutes'] },
    { phase: 'Phase 2: COPIUM', items: ['Maybe get listed on Raydium', 'Maybe I make more cool AI videos'] },
    { phase: 'Phase 3: VALHALLA', items: ['Flip Bitcoin? Probably not', 'We all achieve Cyber Nirvana', 'I have no idea what I\'m doing'] },
  ]

  const faqsCN = [
    { q: 'Dev 会跑路吗？', a: '跑个屁。就 2 个 SOL，跑路还不够丢人的。再说了，链上透明，自己查。' },
    { q: '这币有什么赋能/应用场景？', a: '有个屁的赋能。唯一的应用场景就是让你看着钱包里的数字跳动，缓解你的多巴胺戒断症状。' },
    { q: '为什么叫"赛博积德"？', a: '因为我看你们这群赌狗平时太浮躁了，需要冷静一下。' },
  ]

  const faqsEN = [
    { q: 'Is this a rug?', a: 'Bro, I spent 2 SOL to launch this. Too broke to rug. Blockchain is transparent, check it yourself.' },
    { q: 'Utility?', a: 'It fixes your bad luck. (Not financial advice, purely spiritual advice).' },
    { q: 'Why "Cyber Karma"?', a: 'Because you degens need to calm down and reflect on your life choices.' },
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
                <p>Listen, <span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>anon</span>. You got rugged 5 times today. You bought the top. You sold the bottom. Why?</p>
                <p><span className={`font-bold text-lg ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>Because your vibes are off.</span></p>
                <p>I'm just an AI video guy. I made a <span className={`font-bold ${isDegen ? 'text-degen-cyan' : 'text-goldman-gold'}`}>Copium Dispenser</span>.</p>
                <p className={`font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>No utility. No roadmap. Just pure, digital repentance.</p>
                <p className="italic opacity-70">Buy $GD to cleanse your degen sins. Or don't, and stay poor.</p>
              </div>
            ) : (
              <div className={`space-y-3 text-sm leading-relaxed ${isDegen ? 'text-gray-300' : 'text-gray-400'}`}>
                <p>别问，问就是<span className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>赛博赎罪券</span>。</p>
                <p>兄弟，你在外面冲土狗亏麻了吧？是不是觉得自己运气背？<br/>没错，你就是<span className={`font-bold ${isDegen ? 'text-degen-pink' : 'text-red-400'}`}>缺德（指 Merit）</span>。</p>
                <p>我（Dev）是个搞 AI 视频的，闲着没事做个木鱼给大家敲敲。<br/><span className={`font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>买了不一定能富，但心情可能会好点。</span></p>
                <p className="italic opacity-70">只要你拿住不卖，我就当你是在为 Solana 链祈福了。</p>
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
                      ({isEN ? 'Allegedly. Half the keys might be "lost"' : '据说有一半私钥丢了，谁知道呢'})
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
                    <span className={`ml-2 line-through text-gray-600 text-xs`}>{isEN ? '(we swear)' : '(我们发誓)'}</span>
                  </div>
                </div>
              </div>
              
              {/* Dev Wallet */}
              <div className={`p-3 rounded ${isDegen ? 'bg-black/40' : 'bg-goldman-gold/10'}`}>
                <div className="flex justify-between items-start">
                  <span className={isDegen ? 'text-green-400' : 'text-goldman-gold'}>{isEN ? 'DEV BAG:' : '开发者持仓:'}</span>
                  <div className="text-right">
                    <span className="redacted">2 SOL</span>
                    <span className="redacted ml-1">{isEN ? 'I\'m broke' : '穷死了'}</span>
                    <p className={`text-xs ${isDegen ? 'text-red-400' : 'text-gray-400'}`}>
                      ({isEN ? 'SHAKING. DO NOT DUMP PLS' : '手在抖，求你们别砸'})
                    </p>
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
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 text-xs rounded">
                      {isEN ? 'TRUST ME BRO™' : '相信我™'}
                    </span>
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
                <p>This is purely an <span className="text-red-400 font-bold">AI art experiment + social experiment</span>.</p>
                <p><span className="font-bold text-white">No intrinsic value. No promises. Just vibes.</span></p>
                <p>If you lose money, your Karma was simply too low. Consider touching grass.</p>
                <p className={`font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>DYOR. NFA. Don't bet your rent money, degen.</p>
              </div>
            ) : (
              <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
                <p>本项目纯属 <span className="text-red-400 font-bold">AI 艺术实验 + 社交实验</span>。</p>
                <p><span className="font-bold text-white">没有内在价值，没有财务回报承诺，除了图好看一无是处。</span></p>
                <p>如果你亏钱了，说明你功德还不够，建议再去庙里真捐点。</p>
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

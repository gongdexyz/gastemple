import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Info, Zap, Flame, Skull, Calculator, Sparkles } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'

export const Header: React.FC = () => {
  const { mode } = useThemeStore()
  const { gdBalance } = useGachaStore()
  const { lang, toggleLang } = useLangStore()
  const location = useLocation()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'

  const navItems = [
    { path: '/gacha', label: isEN ? 'GACHA' : '抽签', icon: Zap },
    { path: '/temple', label: isEN ? 'TEMPLE' : '功德殿', icon: Flame },
    { path: '/mint', label: isEN ? 'RELICS' : '法器', icon: Sparkles },
    { path: '/graveyard', label: isEN ? 'RIP' : '骨灰盒', icon: Skull },
    { path: '/regret', label: isEN ? 'IF...' : '如果', icon: Calculator },
    { path: '/leaderboard', label: isEN ? 'LEEKS' : '韭菜榜', icon: Trophy },
    { path: '/about', label: isEN ? 'WTF' : '关于', icon: Info },
  ]

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-40
      ${isDegen ? 'bg-degen-bg/90' : 'bg-goldman-bg/90'}
      backdrop-blur-md border-b
      ${isDegen ? 'border-degen-green/30' : 'border-goldman-border'}
    `}>
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.span 
            className="text-2xl"
            animate={isDegen ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isDegen ? Infinity : 0, repeatDelay: 2 }}
          >
            ⛩️
          </motion.span>
          <span className={`font-bold text-lg ${
            isDegen ? 'text-degen-green font-pixel text-sm' : 'text-goldman-gold'
          }`}>
            {isDegen ? 'GAS TEMPLE' : 'Gas Temple'}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  flex items-center gap-1.5
                  ${isActive 
                    ? isDegen 
                      ? 'bg-degen-green/20 text-degen-green' 
                      : 'bg-goldman-gold/20 text-goldman-gold'
                    : isDegen
                      ? 'text-gray-400 hover:text-degen-green hover:bg-degen-green/10'
                      : 'text-gray-400 hover:text-goldman-gold hover:bg-goldman-gold/10'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* 功德币余额 */}
          <div className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            ${isDegen 
              ? 'bg-degen-yellow/20 text-degen-yellow' 
              : 'bg-goldman-gold/20 text-goldman-gold'
            }
          `}>
            <span>🪙</span>
            <span>{gdBalance.toLocaleString()}</span>
            <span className="text-xs opacity-70">$GD</span>
          </div>

          {/* 语言切换 */}
          <motion.button
            onClick={toggleLang}
            className={`
              px-3 py-1.5 rounded-full text-xs font-bold transition-all
              ${isDegen 
                ? 'bg-degen-green/20 text-degen-green border border-degen-green/50 hover:bg-degen-green/30' 
                : 'bg-goldman-gold/20 text-goldman-gold border border-goldman-gold/50 hover:bg-goldman-gold/30'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEN ? '🇺🇸 EN' : '🇨🇳 中文'}
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default Header

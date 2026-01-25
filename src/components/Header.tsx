import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Info, Zap, Flame, Skull } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'
import { MusicToggle } from './MusicToggle'

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
    { path: '/graveyard', label: isEN ? 'RIP' : '骨灰盒', icon: Skull },
    { path: '/leaderboard', label: isEN ? 'HALL' : '韭菜堂', icon: Trophy },
    { path: '/about', label: isEN ? 'WTF' : '关于', icon: Info },
  ]

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-40
      ${isDegen ? 'bg-degen-bg/90' : 'bg-goldman-bg/90'}
      backdrop-blur-md border-b
      ${isDegen ? 'border-degen-green/30' : 'border-goldman-border'}
    `}>
      <div className="max-w-4xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo - 手机端缩小 */}
        <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <motion.span 
            className="text-xl sm:text-2xl"
            animate={isDegen ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isDegen ? Infinity : 0, repeatDelay: 2 }}
          >
            ⛩️
          </motion.span>
          <span className={`font-bold text-sm sm:text-lg ${
            isDegen ? 'text-degen-green font-pixel' : 'text-goldman-gold'
          }`}>
            {isDegen ? 'GAS' : 'Gas'}
          </span>
        </Link>

        {/* Navigation - 手机端只显示图标 */}
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors
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
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline text-xs sm:text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right section - 手机端简化 */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* 音乐开关 */}
          <MusicToggle />
          
          {/* 功德币余额 - 手机端缩小 */}
          <div className={`
            flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium
            ${isDegen 
              ? 'bg-degen-yellow/20 text-degen-yellow' 
              : 'bg-goldman-gold/20 text-goldman-gold'
            }
          `}
          id="gd-balance-indicator"
          >
            <span className="text-sm sm:text-base">🪙</span>
            <span className="hidden xs:inline">{gdBalance.toLocaleString()}</span>
            <span className="xs:hidden">{gdBalance > 999 ? `${(gdBalance/1000).toFixed(0)}K` : gdBalance}</span>
            <span className="text-[10px] sm:text-xs opacity-70 hidden sm:inline">$GD</span>
          </div>

          {/* 语言切换 - 手机端只显示旗帜 */}
          <motion.button
            onClick={toggleLang}
            className={`
              px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all
              ${isDegen 
                ? 'bg-degen-green/20 text-degen-green border border-degen-green/50 hover:bg-degen-green/30' 
                : 'bg-goldman-gold/20 text-goldman-gold border border-goldman-gold/50 hover:bg-goldman-gold/30'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="sm:hidden">{isEN ? '🇺🇸' : '🇨🇳'}</span>
            <span className="hidden sm:inline">{isEN ? '🇺🇸 EN' : '🇨🇳 中文'}</span>
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default Header

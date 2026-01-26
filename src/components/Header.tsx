import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Info, Zap, Flame, Skull, ChevronDown } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useGachaStore } from '../stores/gachaStore'
import { useLangStore } from '../stores/langStore'
import { MusicToggle } from './MusicToggle'
import { WithdrawalDialog } from './WithdrawalDialog'

export const Header: React.FC = () => {
  const { mode } = useThemeStore()
  const { gdBalance } = useGachaStore()
  const { lang, toggleLang } = useLangStore()
  const location = useLocation()
  const isDegen = mode === 'degen'
  const isEN = lang === 'en'
  const [showBalanceMenu, setShowBalanceMenu] = useState(false)
  const [showWithdrawal, setShowWithdrawal] = useState(false)

  // 防止触摸滑动
  const preventTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const navItems = [
    { path: '/gacha', label: isEN ? 'GACHA' : '抽签', icon: Zap },
    { path: '/temple', label: isEN ? 'TEMPLE' : '功德殿', icon: Flame },
    { path: '/graveyard', label: isEN ? 'RIP' : '骨灰盒', icon: Skull },
    { path: '/leaderboard', label: isEN ? 'HALL' : '韭菜堂', icon: Trophy },
    { path: '/about', label: isEN ? 'WTF' : '关于', icon: Info },
  ]

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-40
        ${isDegen ? 'bg-degen-bg/90' : 'bg-goldman-bg/90'}
        backdrop-blur-md border-b
        ${isDegen ? 'border-degen-green/30' : 'border-goldman-border'}
      `}
      onTouchMove={preventTouchMove}
    >
      <div className="max-w-4xl mx-auto px-1 sm:px-4 h-16 flex items-center justify-between gap-1">
        {/* Logo - 手机端缩小 */}
        <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <motion.span 
            className="text-lg sm:text-2xl"
            animate={isDegen ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isDegen ? Infinity : 0, repeatDelay: 2 }}
          >
            ⛩️
          </motion.span>
          <span className={`font-bold text-xs sm:text-lg ${
            isDegen ? 'text-degen-green font-pixel' : 'text-goldman-gold'
          }`}>
            {isDegen ? 'GAS' : 'Gas'}
          </span>
        </Link>

        {/* Navigation - 手机端紧凑布局 */}
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-1.5 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  flex items-center gap-1
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
                <span className="hidden md:inline text-xs sm:text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right section - 手机端紧凑布局 */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {/* 音乐开关 */}
          <MusicToggle />
          
          {/* 功德币余额 - 可点击展开 */}
          <div className="relative">
            <button
              onClick={() => setShowBalanceMenu(!showBalanceMenu)}
              className={`
                flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
                transition-all cursor-pointer hover:scale-105
                ${isDegen 
                  ? 'bg-degen-yellow/20 text-degen-yellow hover:bg-degen-yellow/30' 
                  : 'bg-goldman-gold/20 text-goldman-gold hover:bg-goldman-gold/30'
                }
              `}
              id="gd-balance-indicator"
            >
              <span className="text-sm sm:text-base">🪙</span>
              <span className="hidden xs:inline text-xs">{gdBalance.toLocaleString()}</span>
              <span className="xs:hidden text-xs">{gdBalance > 999 ? `${(gdBalance/1000).toFixed(0)}K` : gdBalance}</span>
              <span className="text-[10px] sm:text-xs opacity-70 hidden sm:inline">$GD</span>
              <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${showBalanceMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* 余额菜单下拉 */}
            <AnimatePresence>
              {showBalanceMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl border z-50
                    ${isDegen 
                      ? 'bg-black/95 border-degen-yellow/30' 
                      : 'bg-gray-900/95 border-goldman-gold/30'
                    }
                  `}
                  onMouseLeave={() => setShowBalanceMenu(false)}
                >
                  <div className="p-3 space-y-2">
                    {/* 余额显示 */}
                    <div className="text-center pb-2 border-b border-gray-700">
                      <div className="text-xs text-gray-400 mb-1">
                        {isEN ? 'Balance' : '余额'}
                      </div>
                      <div className={`text-xl font-bold ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`}>
                        {gdBalance.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">$GONGDE</div>
                    </div>

                    {/* 提现按钮 */}
                    <button
                      onClick={() => {
                        setShowWithdrawal(true)
                        setShowBalanceMenu(false)
                      }}
                      className={`
                        w-full px-4 py-2 rounded-lg font-bold text-sm transition-all
                        ${isDegen
                          ? 'bg-degen-purple/20 text-degen-purple border border-degen-purple hover:bg-degen-purple/30'
                          : 'bg-purple-900/20 text-purple-400 border border-purple-500 hover:bg-purple-900/30'
                        }
                      `}
                    >
                      💰 {isEN ? 'Withdraw' : '提现'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 语言切换 - 手机端紧凑按钮 */}
          <motion.button
            onClick={toggleLang}
            className={`
              px-1.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0
              ${isDegen 
                ? 'bg-degen-green/20 text-degen-green border border-degen-green/50 hover:bg-degen-green/30' 
                : 'bg-goldman-gold/20 text-goldman-gold border border-goldman-gold/50 hover:bg-goldman-gold/30'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm sm:text-base">{isEN ? '🇺🇸' : '🇨🇳'}</span>
          </motion.button>
        </div>
      </div>

      {/* 提现弹窗 */}
      <AnimatePresence>
        {showWithdrawal && (
          <WithdrawalDialog onClose={() => setShowWithdrawal(false)} />
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header

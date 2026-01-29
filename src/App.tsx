import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useThemeStore } from './stores/themeStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useLangStore } from './stores/langStore'
import GachaPage from './pages/GachaPage'
import LandingPage from './pages/LandingPage'
import TemplePage from './pages/TemplePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AboutPage from './pages/AboutPage'
import GraveyardPage from './pages/GraveyardPage'
import GenesisBanner from './components/GenesisBanner'

function App() {
  const { mode, setMode } = useThemeStore()
  const { lang } = useLangStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [showAutoClickWarning, setShowAutoClickWarning] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const [previousPath, setPreviousPath] = useState<string>('/temple')
  const isEN = lang === 'en'

  // 锁定页面滚动（当弹窗打开时）- 使用CSS类 + 全局touchmove阻止
  useEffect(() => {
    if (showAutoClickWarning) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      const html = document.documentElement
      const header = document.querySelector('header')
      const scrollY = window.scrollY
      
      html.classList.add('scroll-locked')
      
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
        if (header) {
          header.style.paddingRight = `${scrollbarWidth}px`
        }
      }
      
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault()
      }
      
      document.addEventListener('touchmove', preventTouchMove, { passive: false })
      
      return () => {
        html.classList.remove('scroll-locked')
        document.body.style.paddingRight = ''
        if (header) {
          header.style.paddingRight = ''
        }
        document.removeEventListener('touchmove', preventTouchMove)
        window.scrollTo(0, scrollY)
      }
    }
  }, [showAutoClickWarning])

  // 检查自动挂机状态
  const checkAutoClickStatus = () => {
    const savedEndTime = localStorage.getItem('autoClickEndTime')
    const savedMultiplier = localStorage.getItem('autoClickMultiplier')
    
    if (savedEndTime && savedMultiplier) {
      const endTime = parseInt(savedEndTime)
      const multiplier = parseInt(savedMultiplier)
      
      // 如果还在有效期内且倍率大于0，说明正在挂机
      return Date.now() < endTime && multiplier > 0
    }
    return false
  }

  // 监听路由变化，如果正在挂机且离开木鱼页面，弹出提醒
  useEffect(() => {
    const currentPath = location.pathname
    const isLeavingTemplePage = previousPath === '/temple' && currentPath !== '/temple'
    const isAutoClicking = checkAutoClickStatus()
    
    if (isLeavingTemplePage && isAutoClicking && !showAutoClickWarning) {
      // 用户正在挂机且尝试离开木鱼页面，显示警告
      setShowAutoClickWarning(true)
      setPendingPath(currentPath)
    } else if (!showAutoClickWarning) {
      // 正常路由切换，更新 previousPath
      setPreviousPath(currentPath)
    }
  }, [location.pathname, previousPath, showAutoClickWarning])

  // 确认离开
  const handleConfirmLeave = () => {
    setShowAutoClickWarning(false)
    // 更新 previousPath 为当前路径，允许正常导航
    setPreviousPath(location.pathname)
    setPendingPath(null)
  }

  // 取消离开，返回木鱼页面
  const handleCancelLeave = () => {
    setShowAutoClickWarning(false)
    setPendingPath(null)
    // 保持 previousPath 为 /temple
    setPreviousPath('/temple')
    navigate('/temple')
  }

  // 只在从 Landing 进入 Gacha 时触发 glitch（由 LandingPage 处理），其他页面切换不触发
  useEffect(() => {
    const currentPath = location.pathname
    
    const isLandingPage = currentPath === '/'
    if (isLandingPage) return // Landing page has its own styling
    
    const isGachaPage = currentPath === '/gacha'
    const newMode = isGachaPage ? 'goldman' : 'degen'
    
    // 直接切换模式，不触发 glitch
    if (mode !== newMode) {
      setMode(newMode)
    }
  }, [location.pathname, mode, setMode])

  const isLandingPage = location.pathname === '/'
  const isDegen = mode === 'degen'

  return (
    <div className={`min-h-screen ${mode === 'goldman' ? 'mode-goldman' : 'mode-degen'}`}>
      {/* CRT 显示器滤镜 - 不在 Landing Page 显示 */}
      {!isLandingPage && <div className="crt-overlay" />}
      
      {/* 创世期 Banner - 全局显示 */}
      {!isLandingPage && <GenesisBanner />}
      
      {/* 自动挂机离开提醒弹窗 */}
      <AnimatePresence>
        {showAutoClickWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            style={{ touchAction: 'none' }}
            onClick={handleConfirmLeave}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className={`
                relative max-w-md w-full mx-4 p-6 rounded-2xl border-2
                ${isDegen
                  ? 'bg-black/95 border-degen-purple text-white'
                  : 'bg-gray-900/95 border-yellow-500 text-white'
                }
              `}
            >
              {/* 标题 */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⚠️</div>
                <h2 className={`text-xl font-bold ${isDegen ? 'text-degen-purple' : 'text-yellow-400'}`}>
                  {isEN ? 'Auto-Click Active' : '自动挂机进行中'}
                </h2>
              </div>

              {/* 内容 */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <p className="text-gray-300">
                    {isEN 
                      ? 'Your auto-click status is saved and will resume automatically when you return'
                      : '您的挂机状态已保存，返回时会自动恢复'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">⏰</span>
                  <p className="text-gray-300">
                    {isEN 
                      ? 'Valid for 3 hours from activation'
                      : '从启动时起有效期 3 小时'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <p className={isDegen ? 'text-degen-cyan' : 'text-yellow-300'}>
                    {isEN 
                      ? 'Tip: Keep the page open for best experience and maximum rewards'
                      : '建议：保持页面打开以获得最佳体验和最大收益'
                    }
                  </p>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelLeave}
                  className={`
                    flex-1 px-4 py-3 rounded-lg font-bold transition-all
                    ${isDegen
                      ? 'bg-degen-purple text-white hover:bg-degen-purple/80'
                      : 'bg-yellow-500 text-black hover:bg-yellow-400'
                    }
                  `}
                >
                  {isEN ? '← Stay Here' : '← 留在这里'}
                </button>
                <button
                  onClick={handleConfirmLeave}
                  className={`
                    flex-1 px-4 py-3 rounded-lg font-bold transition-all
                    ${isDegen
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  {isEN ? 'Leave Anyway →' : '仍然离开 →'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gacha" element={<GachaPage />} />
        <Route path="/temple" element={<TemplePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/graveyard" element={<GraveyardPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  )
}

export default App

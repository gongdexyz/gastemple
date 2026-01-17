import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useThemeStore } from './stores/themeStore'
import GachaPage from './pages/GachaPage'
import LandingPage from './pages/LandingPage'
import TemplePage from './pages/TemplePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AboutPage from './pages/AboutPage'
import GraveyardPage from './pages/GraveyardPage'
import RegretPage from './pages/RegretPage'
import MintPage from './pages/MintPage'

function App() {
  const { mode, setMode } = useThemeStore()
  const location = useLocation()

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

  return (
    <div className={`min-h-screen ${mode === 'goldman' ? 'mode-goldman' : 'mode-degen'}`}>
      {/* CRT 显示器滤镜 - 不在 Landing Page 显示 */}
      {!isLandingPage && <div className="crt-overlay" />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gacha" element={<GachaPage />} />
        <Route path="/temple" element={<TemplePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/graveyard" element={<GraveyardPage />} />
        <Route path="/regret" element={<RegretPage />} />
        <Route path="/mint" element={<MintPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  )
}

export default App

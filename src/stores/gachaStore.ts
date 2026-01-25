import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateFortune, FortuneResult } from '../services/cryptoApi'

export interface GachaResult {
  id: string
  fortune: FortuneResult
  timestamp: number
  gdEarned: number
}

interface GachaState {
  // 用户状态
  dailyDraws: number
  lastDrawDate: string
  totalDraws: number
  gdBalance: number // 功德币余额
  
  // 抽卡历史
  history: GachaResult[]
  currentResult: GachaResult | null
  
  // 抽卡状态
  isDrawing: boolean
  isRevealing: boolean
  
  // NFT勋章
  badges: string[]
  
  // Actions
  draw: () => Promise<GachaResult | null>
  revealCard: () => void
  resetDaily: () => void
  addGD: (amount: number) => void
  spendGD: (amount: number) => boolean
  earnBadge: (badgeId: string) => void
}

const MAX_FREE_DRAWS = 1
const DRAW_COST_GD = 100

// 检查是否为测试模式 - URL带 ?test=gongde 或 ?test=demo 即可无限余额
const isTestMode = () => {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  const testParam = params.get('test')
  return testParam === 'gongde' || testParam === 'demo'
}

export const useGachaStore = create<GachaState>()(
  persist(
    (set, get) => ({
      dailyDraws: 0,
      lastDrawDate: new Date().toDateString(),
      totalDraws: 0,
      gdBalance: 888, // 实际配送额度
      history: [],
      currentResult: null,
      isDrawing: false,
      isRevealing: false,
      badges: [],

      draw: async () => {
        const state = get()
        const today = new Date().toDateString()
        
        // 检查是否是新的一天
        if (state.lastDrawDate !== today) {
          set({ dailyDraws: 0, lastDrawDate: today })
        }
        
        // 检查是否还有免费抽卡次数
        const currentDailyDraws = state.lastDrawDate !== today ? 0 : state.dailyDraws
        const isFree = currentDailyDraws < MAX_FREE_DRAWS
        
        // 如果不是免费的，检查功德币（测试模式跳过）
        if (!isFree && state.gdBalance < DRAW_COST_GD && !isTestMode()) {
          return null // 余额不足
        }

        set({ isDrawing: true })
        
        // Fetch real crypto data fortune
        const fortune = await generateFortune()
        
        // GD earned based on fortune level
        const gdRewards: Record<string, number> = {
          'SSR': 500,
          'SR': 200,
          'R': 50,
          'N': 10
        }
        const gdEarned = gdRewards[fortune.level] || 10
        
        const result: GachaResult = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          fortune,
          timestamp: Date.now(),
          gdEarned
        }
        
        set((state) => ({
          isDrawing: false,
          isRevealing: true,
          currentResult: result,
          dailyDraws: state.dailyDraws + 1,
          totalDraws: state.totalDraws + 1,
          gdBalance: isTestMode() 
            ? 999999 // 测试模式保持无限余额
            : (isFree ? state.gdBalance : state.gdBalance - DRAW_COST_GD) + gdEarned,
          history: [result, ...state.history].slice(0, 50),
        }))
        
        // 检查是否获得勋章
        const newState = get()
        checkAndAwardBadges(newState, set)
        
        return result
      },

      revealCard: () => {
        set({ isRevealing: false })
      },

      resetDaily: () => {
        set({ dailyDraws: 0, lastDrawDate: new Date().toDateString() })
      },

      addGD: (amount) => {
        set((state) => ({ gdBalance: state.gdBalance + amount }))
      },

      spendGD: (amount) => {
        const state = get()
        if (state.gdBalance >= amount) {
          set({ gdBalance: state.gdBalance - amount })
          return true
        }
        return false
      },

      earnBadge: (badgeId) => {
        set((state) => {
          if (!state.badges.includes(badgeId)) {
            return { badges: [...state.badges, badgeId] }
          }
          return state
        })
      },
    }),
    {
      name: 'gas-temple-gacha',
    }
  )
)

// 勋章检查逻辑
function checkAndAwardBadges(
  state: GachaState, 
  set: (partial: Partial<GachaState> | ((state: GachaState) => Partial<GachaState>)) => void
) {
  const { history, badges, totalDraws } = state
  
  // 流动性贡献者 - 连抽3个N级
  if (history.length >= 3) {
    const last3 = history.slice(0, 3)
    if (last3.every(r => r.fortune.level === 'N') && !badges.includes('liquidity_provider')) {
      set((s) => ({ badges: [...s.badges, 'liquidity_provider'] }))
    }
  }
  
  // SSR收割机 - 抽到SSR
  if (history.some(r => r.fortune.level === 'SSR') && !badges.includes('ssr_hunter')) {
    set((s) => ({ badges: [...s.badges, 'ssr_hunter'] }))
  }
  
  // Gas费燃烧机 - 抽签超过50次
  if (totalDraws >= 50 && !badges.includes('gas_burner')) {
    set((s) => ({ badges: [...s.badges, 'gas_burner'] }))
  }
  
  // 深夜EMO党 - 凌晨抽签
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 5 && !badges.includes('midnight_emo')) {
    set((s) => ({ badges: [...s.badges, 'midnight_emo'] }))
  }
}

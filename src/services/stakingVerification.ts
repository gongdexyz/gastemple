import { Connection, PublicKey } from '@solana/web3.js'
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token'

// SKR 代币地址（从环境变量读取）
const SKR_TOKEN_ADDRESS = import.meta.env.VITE_SKR_TOKEN_ADDRESS || ''
// Seeker 官方质押凭证代币地址（如果有的话，比如 xSKR）
const STAKED_SKR_TOKEN_ADDRESS = import.meta.env.VITE_STAKED_SKR_TOKEN_ADDRESS || ''

export interface StakingTier {
  name: string
  nameEN: string
  minStake: number // 最低持仓要求（SKR）
  withdrawalFee: number // 提现税率（0-1）
  dailyLimit: number // 每日提现限额（USD）
  bonus: number // 额外加成（0-1，负数表示补贴）
  emoji: string
}

// 阶梯配置
export const STAKING_TIERS: StakingTier[] = [
  {
    name: '路人',
    nameEN: 'Tourist',
    minStake: 0,
    withdrawalFee: 0.30, // 30% 重税
    dailyLimit: 2,
    bonus: 0,
    emoji: '🚶'
  },
  {
    name: '香客',
    nameEN: 'Pilgrim',
    minStake: 100,
    withdrawalFee: 0.10, // 10% 正常税
    dailyLimit: 10,
    bonus: 0,
    emoji: '🙏'
  },
  {
    name: '居士',
    nameEN: 'Monk',
    minStake: 1000,
    withdrawalFee: 0, // 免税
    dailyLimit: 50,
    bonus: 0,
    emoji: '🧘'
  },
  {
    name: '方丈',
    nameEN: 'Abbot',
    minStake: 5000,
    withdrawalFee: -0.05, // -5% 补贴
    dailyLimit: Infinity,
    bonus: 0.05,
    emoji: '👨‍🦲'
  }
]

/**
 * 获取用户的 SKR 持仓（包括钱包余额和质押凭证）
 */
export async function getUserSKRBalance(walletAddress: string): Promise<number> {
  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com')
    const userPublicKey = new PublicKey(walletAddress)
    
    let totalBalance = 0
    
    // 1. 查询钱包中的 SKR 余额
    if (SKR_TOKEN_ADDRESS) {
      try {
        const tokenMint = new PublicKey(SKR_TOKEN_ADDRESS)
        const tokenAccount = await getAssociatedTokenAddress(tokenMint, userPublicKey)
        const accountInfo = await getAccount(connection, tokenAccount)
        totalBalance += Number(accountInfo.amount) / (10 ** 9) // 假设 9 位小数
      } catch (error) {
        console.log('No SKR balance in wallet')
      }
    }
    
    // 2. 查询 Seeker 官方质押凭证（如果有的话，比如 xSKR）
    if (STAKED_SKR_TOKEN_ADDRESS) {
      try {
        const stakedTokenMint = new PublicKey(STAKED_SKR_TOKEN_ADDRESS)
        const stakedTokenAccount = await getAssociatedTokenAddress(stakedTokenMint, userPublicKey)
        const stakedAccountInfo = await getAccount(connection, stakedTokenAccount)
        totalBalance += Number(stakedAccountInfo.amount) / (10 ** 9)
      } catch (error) {
        console.log('No staked SKR balance')
      }
    }
    
    return totalBalance
  } catch (error) {
    console.error('Error fetching SKR balance:', error)
    return 0
  }
}

/**
 * 根据持仓量确定用户等级
 */
export function getUserTier(skrBalance: number): StakingTier {
  // 从高到低遍历，找到第一个满足条件的等级
  for (let i = STAKING_TIERS.length - 1; i >= 0; i--) {
    if (skrBalance >= STAKING_TIERS[i].minStake) {
      return STAKING_TIERS[i]
    }
  }
  return STAKING_TIERS[0] // 默认返回最低等级
}

/**
 * 计算提现后的实际到账金额
 */
export function calculateWithdrawalAmount(
  amount: number,
  tier: StakingTier
): {
  grossAmount: number // 提现金额
  fee: number // 税费
  netAmount: number // 实际到账
  feeRate: number // 税率
} {
  const feeRate = tier.withdrawalFee
  const fee = amount * Math.abs(feeRate)
  const netAmount = feeRate < 0 
    ? amount + fee // 负税率表示补贴
    : amount - fee // 正税率表示扣税
  
  return {
    grossAmount: amount,
    fee: feeRate < 0 ? -fee : fee,
    netAmount,
    feeRate
  }
}

/**
 * 获取下一个等级的信息（用于激励用户升级）
 */
export function getNextTier(currentTier: StakingTier): StakingTier | null {
  const currentIndex = STAKING_TIERS.findIndex(t => t.name === currentTier.name)
  if (currentIndex < STAKING_TIERS.length - 1) {
    return STAKING_TIERS[currentIndex + 1]
  }
  return null
}

/**
 * 计算升级到下一等级可以节省多少税费
 */
export function calculateUpgradeSavings(
  amount: number,
  currentTier: StakingTier,
  nextTier: StakingTier
): number {
  const currentFee = Math.abs(amount * currentTier.withdrawalFee)
  const nextFee = Math.abs(amount * nextTier.withdrawalFee)
  return currentFee - nextFee
}

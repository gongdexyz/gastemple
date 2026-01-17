import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ChainType = 'solana' | 'bnb'

interface WalletState {
  // 当前选择的链
  selectedChain: ChainType
  
  // Solana 钱包状态
  solanaAddress: string | null
  solanaConnected: boolean
  
  // BNB Chain 钱包状态
  bnbAddress: string | null
  bnbConnected: boolean
  
  // Actions
  setSelectedChain: (chain: ChainType) => void
  setSolanaWallet: (address: string | null) => void
  setBnbWallet: (address: string | null) => void
  disconnect: () => void
  
  // Computed
  isConnected: () => boolean
  currentAddress: () => string | null
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      selectedChain: 'solana',
      solanaAddress: null,
      solanaConnected: false,
      bnbAddress: null,
      bnbConnected: false,

      setSelectedChain: (chain) => set({ selectedChain: chain }),
      
      setSolanaWallet: (address) => set({ 
        solanaAddress: address, 
        solanaConnected: !!address 
      }),
      
      setBnbWallet: (address) => set({ 
        bnbAddress: address, 
        bnbConnected: !!address 
      }),
      
      disconnect: () => {
        const { selectedChain } = get()
        if (selectedChain === 'solana') {
          set({ solanaAddress: null, solanaConnected: false })
        } else {
          set({ bnbAddress: null, bnbConnected: false })
        }
      },
      
      isConnected: () => {
        const { selectedChain, solanaConnected, bnbConnected } = get()
        return selectedChain === 'solana' ? solanaConnected : bnbConnected
      },
      
      currentAddress: () => {
        const { selectedChain, solanaAddress, bnbAddress } = get()
        return selectedChain === 'solana' ? solanaAddress : bnbAddress
      },
    }),
    {
      name: 'gas-temple-wallet',
    }
  )
)

// BNB Chain 配置
export const BNB_CHAIN_CONFIG = {
  chainId: '0x38', // 56 in decimal
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
}

// Solana 配置
export const SOLANA_CONFIG = {
  network: 'mainnet-beta', // or 'devnet' for testing
  rpcEndpoint: 'https://api.mainnet-beta.solana.com',
}

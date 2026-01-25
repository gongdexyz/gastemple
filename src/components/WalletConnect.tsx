import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ChevronDown, X, Copy, Check } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useWalletStore, BNB_CHAIN_CONFIG } from '../stores/walletStore'
import { Transaction } from '@solana/web3.js'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      isMetaMask?: boolean
    }
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      signTransaction: (transaction: Transaction) => Promise<Transaction>
      signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>
    }
    phantom?: {
      solana?: {
        isPhantom?: boolean
        connect: () => Promise<{ publicKey: { toString: () => string } }>
        signTransaction: (transaction: Transaction) => Promise<Transaction>
        signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>
      }
    }
  }
}

export const WalletConnect: React.FC = () => {
  const { mode } = useThemeStore()
  const { selectedChain, setSelectedChain, solanaAddress, bnbAddress, setSolanaWallet, setBnbWallet, disconnect } = useWalletStore()
  
  const [showModal, setShowModal] = useState(false)
  const [showChainSelector, setShowChainSelector] = useState(false)
  const [copied, setCopied] = useState(false)
  const [connecting, setConnecting] = useState(false)
  
  const isDegen = mode === 'degen'
  const currentAddress = selectedChain === 'solana' ? solanaAddress : bnbAddress
  const isConnected = !!currentAddress

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const connectPhantom = async () => {
    try {
      setConnecting(true)
      const provider = window.phantom?.solana || window.solana
      if (!provider?.isPhantom) {
        window.open('https://phantom.app/', '_blank')
        return
      }
      const response = await provider.connect()
      setSolanaWallet(response.publicKey.toString())
      setShowModal(false)
    } catch (error) {
      console.error('Phantom connection error:', error)
    } finally {
      setConnecting(false)
    }
  }

  const connectMetaMask = async () => {
    try {
      setConnecting(true)
      if (!window.ethereum) {
        window.open('https://metamask.io/', '_blank')
        return
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BNB_CHAIN_CONFIG.chainId }],
        })
      } catch (switchError: unknown) {
        const error = switchError as { code?: number }
        if (error.code === 4902) {
          await window.ethereum?.request({ method: 'wallet_addEthereumChain', params: [BNB_CHAIN_CONFIG] })
        }
      }
      setBnbWallet(accounts[0])
      setShowModal(false)
    } catch (error) {
      console.error('MetaMask connection error:', error)
    } finally {
      setConnecting(false)
    }
  }

  const handleCopy = () => {
    if (currentAddress) {
      navigator.clipboard.writeText(currentAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setShowModal(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => setShowChainSelector(!showChainSelector)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${isDegen ? 'bg-degen-purple/20 text-degen-purple' : 'bg-goldman-gold/20 text-goldman-gold'}`}>
          {selectedChain === 'solana' ? '☀️ SOL' : '🟡 BNB'}
          <ChevronDown className="w-3 h-3" />
        </button>

        <motion.button onClick={() => setShowModal(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isConnected
              ? isDegen ? 'bg-degen-green/20 text-degen-green border border-degen-green/30' : 'bg-goldman-gold/20 text-goldman-gold border border-goldman-gold/30'
              : isDegen ? 'bg-degen-green text-black' : 'bg-goldman-gold text-black'
          }`}>
          <Wallet className="w-4 h-4" />
          {isConnected ? shortenAddress(currentAddress!) : '连接钱包'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showChainSelector && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full right-0 mt-2 p-2 rounded-lg shadow-xl z-50 ${isDegen ? 'bg-degen-bg border border-degen-green/30' : 'bg-gray-900 border border-goldman-border'}`}>
            {(['solana', 'bnb'] as const).map((chain) => (
              <button key={chain} onClick={() => { setSelectedChain(chain); setShowChainSelector(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${selectedChain === chain ? isDegen ? 'bg-degen-green/20 text-degen-green' : 'bg-goldman-gold/20 text-goldman-gold' : 'text-gray-400 hover:text-white'}`}>
                {chain === 'solana' ? '☀️ Solana' : '🟡 BNB Chain'}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-sm p-6 rounded-2xl ${isDegen ? 'bg-degen-bg border border-degen-green' : 'bg-gray-900 border border-goldman-border'}`}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${isDegen ? 'text-degen-green' : 'text-goldman-gold'}`}>
                  {isConnected ? '钱包已连接' : '连接钱包'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {isConnected ? (
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${isDegen ? 'bg-black/30' : 'bg-black/20'}`}>
                    <p className="text-xs text-gray-500 mb-1">{selectedChain === 'solana' ? 'Solana' : 'BNB Chain'} 地址</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-white flex-1 truncate">{currentAddress}</p>
                      <button onClick={handleCopy} className={`p-1 rounded ${isDegen ? 'hover:bg-degen-green/20' : 'hover:bg-goldman-gold/20'}`}>
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <button onClick={handleDisconnect} className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">断开连接</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 mb-4">选择 {selectedChain === 'solana' ? 'Solana' : 'BNB Chain'} 钱包</p>
                  {selectedChain === 'solana' ? (
                    <button onClick={connectPhantom} disabled={connecting}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${isDegen ? 'bg-degen-purple/20 hover:bg-degen-purple/30 border border-degen-purple/30' : 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30'}`}>
                      <span className="text-2xl">👻</span>
                      <div className="text-left"><p className="font-medium text-white">Phantom</p><p className="text-xs text-gray-500">推荐</p></div>
                    </button>
                  ) : (
                    <button onClick={connectMetaMask} disabled={connecting}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${isDegen ? 'bg-degen-yellow/20 hover:bg-degen-yellow/30 border border-degen-yellow/30' : 'bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30'}`}>
                      <span className="text-2xl">🦊</span>
                      <div className="text-left"><p className="font-medium text-white">MetaMask</p><p className="text-xs text-gray-500">BNB Chain</p></div>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default WalletConnect

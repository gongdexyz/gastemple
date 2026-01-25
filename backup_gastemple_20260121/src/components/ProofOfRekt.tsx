import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react'
import { useLangStore } from '../stores/langStore'

// Simulated wallet verification results
interface RektProof {
  id: string
  nameCN: string
  nameEN: string
  descCN: string
  descEN: string
  icon: string
  verified: boolean
  date?: string
  amount?: string
}

interface ProofOfRektProps {
  onVerified: (proofs: RektProof[]) => void
}

export const ProofOfRekt: React.FC<ProofOfRektProps> = ({ onVerified }) => {
  const { lang } = useLangStore()
  const isEN = lang === 'en'
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [proofs, setProofs] = useState<RektProof[]>([])
  const [scanComplete, setScanComplete] = useState(false)

  // Simulated wallet connect
  const connectWallet = async () => {
    setIsConnecting(true)
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate fake wallet address
    const fakeAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    
    setWalletAddress(fakeAddress)
    setWalletConnected(true)
    setIsConnecting(false)
  }

  // Simulated on-chain scan
  const scanWallet = async () => {
    setIsScanning(true)
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate random proof results (for demo)
    const possibleProofs: RektProof[] = [
      {
        id: 'luna-victim',
        nameCN: 'LUNA 受难者',
        nameEN: 'LUNA Victim',
        descCN: '系统检测到您曾在 2022 年 5 月持有 LUNA',
        descEN: 'System detected LUNA holdings in May 2022',
        icon: '🌙',
        verified: Math.random() > 0.3,
        date: '2022-05-12',
        amount: '$12,450 → $0.02'
      },
      {
        id: 'gas-philanthropist',
        nameCN: 'Gas 慈善家',
        nameEN: 'Gas Philanthropist',
        descCN: '历史 Gas 消耗超过 5 ETH',
        descEN: 'Total gas spent exceeds 5 ETH',
        icon: '⛽',
        verified: Math.random() > 0.4,
        amount: '6.9 ETH'
      },
      {
        id: 'honeypot-connoisseur',
        nameCN: '貔貅鉴赏家',
        nameEN: 'Honeypot Connoisseur',
        descCN: '曾购买过无法卖出的代币',
        descEN: 'Purchased tokens that cannot be sold',
        icon: '🍯',
        verified: Math.random() > 0.5,
        amount: '3 tokens'
      },
      {
        id: 'ftx-survivor',
        nameCN: 'FTX 幸存者',
        nameEN: 'FTX Survivor',
        descCN: '曾在 FTX 有过交易记录',
        descEN: 'Had trading history on FTX',
        icon: '💀',
        verified: Math.random() > 0.6,
        date: '2022-11-08'
      },
      {
        id: 'rug-veteran',
        nameCN: '跑路老兵',
        nameEN: 'Rug Pull Veteran',
        descCN: '持有过 3 个以上归零项目',
        descEN: 'Held 3+ projects that went to zero',
        icon: '🎖️',
        verified: Math.random() > 0.3,
        amount: '5 projects'
      }
    ]
    
    setProofs(possibleProofs)
    setScanComplete(true)
    setIsScanning(false)
    
    // Callback with verified proofs
    onVerified(possibleProofs.filter(p => p.verified))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🔍</div>
        <h3 className="text-lg font-bold text-red-400 font-pixel">
          {isEN ? 'PROOF OF REKT' : '亏损证明'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {isEN ? 'Verify your on-chain tragedy for exclusive NFTs' : '验证您的链上悲剧以解锁专属 NFT'}
        </p>
      </div>

      {/* Wallet Connection */}
      {!walletConnected ? (
        <motion.button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isConnecting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {isEN ? 'CONNECTING...' : '连接中...'}
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              {isEN ? 'CONNECT WALLET' : '连接钱包'}
            </>
          )}
        </motion.button>
      ) : (
        <div className="space-y-4">
          {/* Connected Wallet */}
          <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/30 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">{isEN ? 'Connected' : '已连接'}</p>
              <p className="text-sm text-green-400 font-mono truncate">{walletAddress}</p>
            </div>
          </div>

          {/* Scan Button */}
          {!scanComplete && (
            <motion.button
              onClick={scanWallet}
              disabled={isScanning}
              className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-red-900/30 border border-red-500/50 text-red-400 hover:bg-red-900/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isScanning ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {isEN ? 'SCANNING CHAIN...' : '扫描链上记录中...'}
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  {isEN ? 'SCAN FOR TRAGEDY' : '扫描悲剧历史'}
                </>
              )}
            </motion.button>
          )}

          {/* Scan Results */}
          <AnimatePresence>
            {scanComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <p className="text-xs text-gray-500 text-center mb-3">
                  {isEN ? '📜 On-chain tragedy detected:' : '📜 链上悲剧检测结果:'}
                </p>
                
                {proofs.map((proof, i) => (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rekt-badge flex items-center gap-3 ${
                      proof.verified 
                        ? 'border-green-500/50 bg-green-900/20' 
                        : 'border-gray-600/50 bg-gray-900/20 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{proof.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${proof.verified ? 'text-green-400' : 'text-gray-500'}`}>
                          {isEN ? proof.nameEN : proof.nameCN}
                        </span>
                        {proof.verified ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {isEN ? proof.descEN : proof.descCN}
                      </p>
                      {proof.verified && (proof.date || proof.amount) && (
                        <p className="text-xs text-red-400 mt-1">
                          {proof.date && `📅 ${proof.date}`}
                          {proof.date && proof.amount && ' | '}
                          {proof.amount && `💸 ${proof.amount}`}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Summary */}
                <div className="mt-4 p-3 rounded-lg bg-black/30 text-center">
                  <p className="text-sm text-gray-400">
                    {isEN ? 'Verified Tragedies:' : '已验证悲剧:'}
                  </p>
                  <p className="text-2xl font-bold text-red-400">
                    {proofs.filter(p => p.verified).length} / {proofs.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isEN 
                      ? 'Each verified proof unlocks exclusive NFT minting rights'
                      : '每个验证通过的证明都可解锁专属 NFT 铸造权'
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-4 text-center text-[10px] text-gray-600 italic">
        {isEN 
          ? '"Your suffering is now verified on-chain. Congratulations?"'
          : '"您的痛苦现已获得链上认证。恭喜？"'
        }
      </p>
    </div>
  )
}

export default ProofOfRekt

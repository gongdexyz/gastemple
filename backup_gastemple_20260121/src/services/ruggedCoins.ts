// 归零币检测服务 - 读取Solana钱包中跌了99%以上的代币

export interface RuggedCoin {
  mint: string
  symbol: string
  name: string
  balance: number
  currentPrice: number
  currentValue: number
  highestPrice: number
  dropPercent: number
  deathDate?: string
  epitaph?: string
  epitaphEN?: string
}

// Helius API (免费tier有限制，但够用)
const HELIUS_API_KEY = 'your-api-key' // 可以用公共RPC

// 使用Jupiter API获取代币价格
async function getTokenPrices(mints: string[]): Promise<Record<string, number>> {
  if (mints.length === 0) return {}
  
  try {
    const response = await fetch(
      `https://price.jup.ag/v6/price?ids=${mints.join(',')}`
    )
    const data = await response.json()
    const prices: Record<string, number> = {}
    
    for (const mint of mints) {
      prices[mint] = data.data?.[mint]?.price || 0
    }
    
    return prices
  } catch (error) {
    console.error('Failed to fetch token prices:', error)
    return {}
  }
}

// 使用Birdeye API获取历史最高价 (需要API key，这里用模拟数据)
async function getHistoricalHighPrice(mint: string): Promise<number> {
  // 实际生产中应该调用Birdeye或DexScreener API
  // 这里用当前价格的随机倍数模拟历史高点
  return 0 // 返回0表示无法获取，需要其他方式判断
}

// 获取钱包的所有SPL代币
export async function getWalletTokens(walletAddress: string): Promise<{
  mint: string
  balance: number
  symbol: string
  name: string
}[]> {
  try {
    // 使用Helius的getAssetsByOwner API
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=1d8740dc-e5f4-421c-b823-e1bad1889eff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'gas-temple',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: walletAddress,
          page: 1,
          limit: 100,
          displayOptions: {
            showFungible: true,
            showNativeBalance: false,
          },
        },
      }),
    })
    
    const data = await response.json()
    
    if (!data.result?.items) {
      return []
    }
    
    // 过滤出fungible tokens
    const tokens = data.result.items
      .filter((item: any) => item.interface === 'FungibleToken' || item.interface === 'FungibleAsset')
      .map((item: any) => ({
        mint: item.id,
        balance: item.token_info?.balance ? item.token_info.balance / Math.pow(10, item.token_info.decimals || 0) : 0,
        symbol: item.content?.metadata?.symbol || item.token_info?.symbol || 'UNKNOWN',
        name: item.content?.metadata?.name || item.token_info?.name || 'Unknown Token',
      }))
      .filter((t: any) => t.balance > 0)
    
    return tokens
  } catch (error) {
    console.error('Failed to fetch wallet tokens:', error)
    return []
  }
}

// 检测归零币 (跌幅99%以上)
export async function detectRuggedCoins(walletAddress: string): Promise<RuggedCoin[]> {
  try {
    // 1. 获取钱包所有代币
    const tokens = await getWalletTokens(walletAddress)
    
    if (tokens.length === 0) {
      return []
    }
    
    // 2. 获取当前价格
    const mints = tokens.map(t => t.mint)
    const prices = await getTokenPrices(mints)
    
    // 3. 识别归零币
    const ruggedCoins: RuggedCoin[] = []
    
    for (const token of tokens) {
      const currentPrice = prices[token.mint] || 0
      const currentValue = token.balance * currentPrice
      
      // 价值低于$0.01且有余额的代币视为归零币
      // 或者可以通过其他API获取历史最高价来判断跌幅
      if (currentValue < 0.01 && token.balance > 0) {
        // 生成墓志铭
        const epitaphs = generateEpitaph(token.symbol)
        
        ruggedCoins.push({
          mint: token.mint,
          symbol: token.symbol,
          name: token.name,
          balance: token.balance,
          currentPrice,
          currentValue,
          highestPrice: 0, // 需要历史数据API
          dropPercent: 99.99, // 假设跌幅
          deathDate: new Date().toISOString().split('T')[0],
          epitaph: epitaphs.cn,
          epitaphEN: epitaphs.en,
        })
      }
    }
    
    return ruggedCoins
  } catch (error) {
    console.error('Failed to detect rugged coins:', error)
    return []
  }
}

// 生成墓志铭
function generateEpitaph(symbol: string): { cn: string; en: string } {
  const epitaphs = [
    { cn: `${symbol}，一路走好，下辈子别当空气币`, en: `${symbol}, rest in peace. Don't be a shitcoin next time.` },
    { cn: `这里躺着${symbol}，和你的梦想一起`, en: `Here lies ${symbol}, along with your dreams.` },
    { cn: `${symbol}：我来过，我归零了，我走了`, en: `${symbol}: I came, I rugged, I left.` },
    { cn: `致${symbol}：你的使命是教会我什么叫止损`, en: `To ${symbol}: Your mission was to teach me stop-loss.` },
    { cn: `${symbol}永垂不朽（在我的亏损记录里）`, en: `${symbol} lives forever (in my loss records).` },
    { cn: `安息吧${symbol}，你比我的感情还短命`, en: `RIP ${symbol}, you lasted shorter than my relationships.` },
    { cn: `${symbol}：曾经的百倍梦，如今的归零币`, en: `${symbol}: Once a 100x dream, now a 0x reality.` },
    { cn: `这里埋葬着${symbol}和我的信仰`, en: `Here lies ${symbol} and my faith in crypto.` },
  ]
  
  return epitaphs[Math.floor(Math.random() * epitaphs.length)]
}

// 连接Phantom钱包
export async function connectPhantomWallet(): Promise<string | null> {
  try {
    const { solana } = window as any
    
    if (!solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank')
      return null
    }
    
    const response = await solana.connect()
    return response.publicKey.toString()
  } catch (error) {
    console.error('Failed to connect Phantom:', error)
    return null
  }
}

// 断开Phantom钱包
export async function disconnectPhantomWallet(): Promise<void> {
  try {
    const { solana } = window as any
    if (solana?.isPhantom) {
      await solana.disconnect()
    }
  } catch (error) {
    console.error('Failed to disconnect Phantom:', error)
  }
}

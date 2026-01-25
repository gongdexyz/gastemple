# 价格 API 配置指南

## 📋 配置步骤

### 1. 填写 `.env.local` 文件

打开项目根目录的 `.env.local` 文件，填写以下信息：

```bash
# ============================================
# 代币价格 API 配置
# ============================================

# API 基础 URL（从 cryptopulse-ai 项目复制）
VITE_PRICE_API_URL=https://your-api.com/api

# API Key（如果需要）
VITE_PRICE_API_KEY=your_api_key_here

# SKR 代币地址（Solana）
VITE_SKR_TOKEN_ADDRESS=SKR_TOKEN_ADDRESS_HERE

# GONGDE 代币地址（Solana）
VITE_GONGDE_TOKEN_ADDRESS=GONGDE_TOKEN_ADDRESS_HERE

# ============================================
# Solana 配置
# ============================================

# 收款钱包地址（接收 SKR 的地址）
VITE_RECIPIENT_ADDRESS=YOUR_WALLET_ADDRESS

# 网络选择（mainnet-beta 或 devnet）
VITE_SOLANA_NETWORK=mainnet-beta
```

### 2. API 返回格式

价格服务期望 API 返回以下格式：

```json
{
  "price": 0.1234,
  "priceUSD": 0.1234,
  "change24h": 5.67,
  "priceChange24h": 5.67
}
```

如果你的 API 返回格式不同，请修改 `src/services/priceService.ts` 中的 `fetchTokenPrice` 方法。

### 3. 调整 API 端点

如果你的 API 端点格式不是 `/token/{address}`，请修改：

```typescript
// src/services/priceService.ts 第 XXX 行
const response = await fetch(`${this.API_URL}/token/${address}`, {
  // 改成你的 API 格式，例如：
  // `${this.API_URL}/price?address=${address}`
  // `${this.API_URL}/tokens/${address}/price`
})
```

---

## 🎮 使用方法

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问木鱼页面

```
http://localhost:5173/temple
```

### 3. 查看经济分析

点击右下角的 **💰 经济分析** 按钮，会显示：

- **实时价格**：SKR 和 GONGDE 的当前价格
- **汇率**：1 SKR = ? GD
- **利润分析**：三个档位的盈亏情况
  - 收入（SKR 价值）
  - 成本（GD 产出成本）
  - 利润（USD）
  - 利润率（%）

---

## 🔧 调整经济参数

### 方法 1：通过 `.env.local` 调整

```bash
# 代敲 GD 产出概率（0.01 = 1%）
VITE_AUTO_CLICK_REWARD_RATE=0.01

# 代敲 GD 奖励范围（最小值）
VITE_AUTO_CLICK_REWARD_MIN=1

# 代敲 GD 奖励范围（最大值）
VITE_AUTO_CLICK_REWARD_MAX=3
```

### 方法 2：直接修改代码

在 `src/components/WoodenFish.tsx` 中：

```typescript
// 第 XXX 行 - 调整产出概率
if (randomValue < 0.01) {  // 改这个数字（0.01 = 1%）
  gdReward = Math.floor(Math.random() * 3) + 1  // 改这个范围（1-3）
}

// 第 XXX 行 - 调整价格
const AUTO_CLICK_OPTIONS = [
  { price: 33, multiplier: 1 },   // 改这些价格
  { price: 58, multiplier: 3 },
  { price: 108, multiplier: 5 }
]
```

---

## 📊 实时监控

经济计算器会：

1. **每分钟自动更新价格**
2. **实时计算盈亏**
3. **显示利润率**

如果价格显示为 $0.0000，说明：
- API 配置不正确
- 代币地址错误
- API 服务不可用

请检查浏览器控制台的错误信息。

---

## 🐛 故障排查

### 问题 1：价格显示为 0

**原因**：
- `.env.local` 未配置
- API URL 错误
- 代币地址错误

**解决**：
1. 检查 `.env.local` 配置
2. 打开浏览器控制台查看错误
3. 点击"🔄 刷新价格"按钮

### 问题 2：显示"获取价格失败"

**原因**：
- API 服务不可用
- 网络问题
- API Key 无效

**解决**：
1. 检查 API 服务是否运行
2. 验证 API Key 是否正确
3. 查看控制台详细错误信息

### 问题 3：利润计算不准确

**原因**：
- 产出参数配置错误
- 价格数据延迟

**解决**：
1. 检查 `.env.local` 中的产出参数
2. 点击"🔄 刷新价格"更新数据
3. 对比实际游戏产出调整参数

---

## 📝 示例配置

### 从 cryptopulse-ai 复制配置

1. 打开 `G:\cryptopulse-ai\.env`
2. 找到以下配置：
   ```
   API_URL=...
   API_KEY=...
   ```
3. 复制到当前项目的 `.env.local`：
   ```
   VITE_PRICE_API_URL=...
   VITE_PRICE_API_KEY=...
   ```

### 获取代币地址

1. 访问 Solana Explorer
2. 搜索 SKR 和 GONGDE 代币
3. 复制合约地址到 `.env.local`

---

## 🎯 下一步

配置完成后：

1. ✅ 启动开发服务器
2. ✅ 访问 `/temple` 页面
3. ✅ 点击"💰 经济分析"查看实时数据
4. ✅ 根据利润率调整代敲价格和产出
5. ✅ 确保所有档位都有正利润

如果有任何问题，请查看浏览器控制台的详细日志！

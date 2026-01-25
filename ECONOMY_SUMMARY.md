# 经济系统总结

## 📊 当前经济参数（从 .env.local）

### 代币市价（实时获取）
- **SOL**: 通过 CoinGecko API 实时获取
- **SKR**: 通过 CoinGecko API 实时获取（地址：`9KhzCKMWkjfz8DcyDxDqR9bDPen2FvUhT15eMk5mvaxb`）
- **GONGDE**: 通过 CoinGecko API 实时获取（地址：`9KhzCKMWkjfz8DcyDxDqR9bDPen2FvUhT15eMk5mvaxb`）

### 冥想模式（免费游玩）

#### 手动点击
- **奖励概率**: 20% (`VITE_MEDITATION_MANUAL_RATE=0.20`)
- **奖励范围**: 5-15 GD (`VITE_MEDITATION_MANUAL_MIN=5`, `VITE_MEDITATION_MANUAL_MAX=15`)
- **平均奖励**: 10 GD
- **每小时产出**: ~600 GD（假设每小时点击 300 次）
  - 计算：300 次 × 20% × 10 GD = 600 GD

#### 自动代敲
- **奖励概率**: 2% (`VITE_AUTO_CLICK_REWARD_RATE=0.02`)
- **奖励范围**: 1-5 GD (`VITE_AUTO_CLICK_REWARD_MIN=1`, `VITE_AUTO_CLICK_REWARD_MAX=5`)
- **平均奖励**: 3 GD
- **每小时产出**: ~216 GD（每小时 3600 次）
  - 计算：3600 次 × 2% × 3 GD = 216 GD

### 功德模式（消耗代币）

#### 基础消耗
- **每次消耗**: 100 GD
- **基础暴击率**: 4%

#### 暴击奖励（手动）
- **因果级** (72%): 1200 GD
- **福报级** (22%): 2000 GD（需要 combo ≥ 3）
- **天启级** (6%): 5000 GD（需要 combo ≥ 5）

#### 暴击奖励（代敲）
- 所有奖励 × 0.7（降低 30%）
- **因果级**: 840 GD
- **福报级**: 1400 GD
- **天启级**: 3500 GD

#### 非暴击奖励
- **200 GD**: 12% 概率
- **80 GD**: 50% 概率
- **0 GD**: 38% 概率

### 代敲价格（3小时）

#### 冥想模式
- **档位 1**: 33 SKR（×1 倍速）
- **档位 2**: 58 SKR（×3 倍速）
- **档位 3**: 108 SKR（×5 倍速）

#### 功德模式（价格 5 倍）
- **档位 1**: 165 SKR（×1 倍速）
- **档位 2**: 290 SKR（×3 倍速）
- **档位 3**: 540 SKR（×5 倍速）

### 兑换比例

#### GD → SKR
- **汇率**: 100 GD = 1 SKR (`VITE_GD_TO_SKR_RATE=100`)
- **你的成本**: 0（GD 是你发行的）
- **你的利润**: 100% 纯利

#### SKR → GD
- **汇率**: 1 SKR = 50 GD (`VITE_SKR_TO_GD_RATE=50`)
- **目的**: 防止套利（汇率低于 GD→SKR）
- **建议**: 禁用或保持低汇率

---

## 💰 玩家盈利路径

### 路径 1：纯免费玩家
```
手动玩 1 小时 → 600 GD
每天玩 3 小时 → 1,800 GD
一个月（30天）→ 54,000 GD

兑换：54,000 GD ÷ 100 = 540 SKR
```

### 路径 2：小额投资玩家
```
投资 $10 买 SKR（假设 SKR = $0.01）
→ 1000 SKR

购买冥想模式代敲（档位 3）：108 SKR
→ 挂机 3 小时产出：216 GD × 3 × 5 = 3,240 GD

用 GD 玩功德模式追求暴击
→ 运气好可能获得大量 GD
→ 兑换回 SKR 慢慢回本
```

### 路径 3：大户玩家
```
投资 $100 买 SKR
→ 10,000 SKR

购买功德模式代敲（档位 3）：540 SKR
→ 挂机 3 小时，追求暴击大奖
→ 天启级暴击：3500 GD × 多次
→ 可能扭亏为盈
```

---

## 📈 你的收入模型

### 收入来源 1：代敲服务

#### 冥想模式（档位 3）
- **收入**: 108 SKR
- **成本**: 3,240 GD（3小时 × 5倍速 × 216 GD/小时）
- **你的成本**: 3,240 GD × $GONGDE 价格
- **利润**: 108 SKR - 成本

#### 功德模式（档位 3）
- **收入**: 540 SKR
- **成本**: 玩家消耗 GD，你回收 GD
- **净成本**: 很低（玩家消耗 > 产出）
- **利润**: 接近 100%

### 收入来源 2：GD → SKR 兑换
- **收入**: 玩家支付 100 GD
- **支出**: 你给玩家 1 SKR
- **你的成本**: 1 SKR 的市价
- **利润**: 取决于 GD 和 SKR 的价格差

### 收入来源 3：功德模式消耗
- **玩家消耗**: 100 GD/次
- **你回收**: 减少 GD 流通
- **效果**: 支撑 GD 价值

---

## 🎯 关键设计优势

### 1. 降低兑换门槛
- **100 GD = 1 SKR**（而不是 2000 GD）
- 玩家玩 1 小时就能兑换 6 SKR
- 看到真实收益，更有动力

### 2. 提高免费产出
- **手动 20% × 10 GD**（而不是 10% × 5.5 GD）
- 玩家 1 小时赚 600 GD
- 感觉能赚钱，愿意继续玩

### 3. 平衡代敲产出
- **代敲 2% × 3 GD**（降低产出）
- 防止自动挂机产出过高
- 鼓励手动游玩

### 4. 功德模式高价格
- **功德模式代敲价格 5 倍**
- 因为有暴击奖励
- 平衡经济，保持利润

---

## 📊 经济面板功能

### 新增组件：EconomyDashboard.tsx
位置：左下角（与右下角的 EconomicCalculator 对称）

#### 显示内容
1. **实时市价**
   - SOL 价格
   - SKR 价格
   - GONGDE 价格
   - 汇率

2. **你的余额**
   - $GONGDE 数量
   - USD 价值

3. **冥想模式产出**
   - 手动点击参数
   - 代敲参数
   - 每小时产出预期

4. **功德模式消耗**
   - 每次消耗
   - 暴击率
   - 暴击奖励

5. **代敲价格**
   - 冥想模式价格
   - 功德模式价格
   - USD 价值

6. **兑换比例**
   - GD → SKR
   - SKR → GD
   - USD 价值

7. **盈利路径**
   - 每小时/每天/每月产出
   - 可兑换 SKR 数量
   - USD 价值

---

## 🚀 已实现功能

✅ 更新 `.env.local` 经济参数
✅ 更新 `WoodenFish.tsx` 冥想模式产出逻辑
✅ 更新 `EconomicCalculator.tsx` 显示新参数
✅ 创建 `EconomyDashboard.tsx` 完整经济面板
✅ 集成到 `App.tsx`（Temple 页面）
✅ 实时获取 SOL、SKR、GONGDE 价格
✅ 显示所有消耗和产出数据
✅ 计算 USD 价值

---

## ⚠️ 待实现功能

❌ 每日任务系统
❌ 排行榜系统
❌ SKR → GD 链上兑换
❌ 防刷号机制
❌ 大额兑换审核

---

## 🔧 如何使用

### 查看经济数据
1. 访问 `/temple` 页面
2. 点击左下角 "💎 经济面板" 按钮
3. 查看所有实时数据

### 查看利润分析
1. 访问 `/temple` 页面
2. 点击右下角 "💰 经济分析" 按钮
3. 查看代敲利润分析

### 测试模式
- URL 添加 `?test=demo` 或 `?test=skr`
- 免费使用自动代敲功能
- 用于演示和测试

---

## 📝 环境变量配置

所有经济参数都在 `.env.local` 中配置：

```bash
# 兑换比例
VITE_GD_TO_SKR_RATE=100
VITE_SKR_TO_GD_RATE=50

# 冥想模式手动点击
VITE_MEDITATION_MANUAL_RATE=0.20
VITE_MEDITATION_MANUAL_MIN=5
VITE_MEDITATION_MANUAL_MAX=15

# 冥想模式代敲
VITE_AUTO_CLICK_REWARD_RATE=0.02
VITE_AUTO_CLICK_REWARD_MIN=1
VITE_AUTO_CLICK_REWARD_MAX=5

# 代币地址
VITE_SKR_TOKEN_ADDRESS=9KhzCKMWkjfz8DcyDxDqR9bDPen2FvUhT15eMk5mvaxb
VITE_GONGDE_TOKEN_ADDRESS=9KhzCKMWkjfz8DcyDxDqR9bDPen2FvUhT15eMk5mvaxb

# 收款地址
VITE_RECIPIENT_ADDRESS=9KhzCKMWkjfz8DcyDxDqR9bDPen2FvUhT15eMk5mvaxb

# API 配置
VITE_PRICE_API_URL=https://api.coingecko.com/api/v3
VITE_COINGECKO_API_KEY=CG-YuViF7d3gsWveB697HBgjV12
```

---

## 🎮 玩家体验优化

### 让玩家感觉能赚钱
1. ✅ 降低兑换门槛（100 GD = 1 SKR）
2. ✅ 提高免费产出（20% × 10 GD）
3. ✅ 显示实时 USD 价值
4. ✅ 显示盈利路径
5. ❌ 每日任务奖励（待实现）
6. ❌ 排行榜奖励（待实现）

### 保持你的利润
1. ✅ 代敲产出低于手动（2% vs 20%）
2. ✅ 功德模式高价格（5倍）
3. ✅ 功德模式回收 GD
4. ✅ SKR → GD 低汇率（防套利）
5. ❌ 防刷号机制（待实现）
6. ❌ 大额兑换审核（待实现）

---

你现在可以在 Temple 页面看到完整的经济数据面板！

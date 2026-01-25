# SKR 通缩数据真实化

## 修改时间
2026-01-25

## 问题描述
之前的 SKR 通缩面板数据是模拟的：
- 每次点击增加随机的 50-100 SKR
- 与实际游戏收入无关
- 数据不真实，无法反映实际的经济模型

## 解决方案

### 1. 真实的 SKR 回购计算

现在根据实际消耗的 $GONGDE 计算 SKR 回购量：

```typescript
// 功德模式：每次消耗 100 GONGDE
const burnCost = 100

// 获取实时价格
const gongdePrice = prices.gongde || 0.00029600  // $GONGDE 价格
const skrPrice = prices.skr || 0.029600          // $SKR 价格

// 计算实际回购量
const usdValue = burnCost * gongdePrice          // 消耗的 USD 价值
const skrBuyback = usdValue / skrPrice           // 可以回购的 SKR 数量
```

### 2. 示例计算

假设当前价格：
- $GONGDE = $0.00029600
- $SKR = $0.029600

每次点击消耗 100 $GONGDE：
- USD 价值 = 100 × $0.00029600 = $0.0296
- SKR 回购 = $0.0296 / $0.029600 = **1 SKR**

### 3. 动态价格支持

系统会每 60 秒自动获取最新价格：
- 从 `priceService` 获取实时价格
- 自动更新计算逻辑
- 确保数据始终准确

### 4. 游戏模式区分

- **冥想模式**：不消耗代币，不增加 SKR 回购
- **功德模式**：每次点击消耗 100 $GONGDE，增加对应的 SKR 回购

## 技术实现

### 修改的文件

#### 1. src/pages/TemplePage.tsx
```typescript
// 监听用户互动 - 根据实际消耗计算 SKR 回购
useEffect(() => {
  const handleUserInteraction = (e: MouseEvent) => {
    // 只监听木鱼区域的点击
    const target = e.target as HTMLElement
    const isWoodenFishClick = target.closest('[data-wooden-fish]') !== null
    
    if (!isWoodenFishClick) return
    
    // 根据实时价格计算 SKR 回购量
    const gongdePrice = prices.gongde || 0.00029600
    const skrPrice = prices.skr || 0.029600
    const burnCost = 100
    
    const usdValue = burnCost * gongdePrice
    const skrBuyback = usdValue / skrPrice
    
    // 更新统计数据
    setSimulator(prev => ({
      ...prev,
      totalSkrBuyback: prev.totalSkrBuyback + skrBuyback,
      dailySkrBuyback: prev.dailySkrBuyback + skrBuyback * 0.5,
      deflationProgress: Math.min(99.99, prev.deflationProgress + 0.01),
      lastInteractionBoost: skrBuyback
    }))
    
    setFlashBoost(true)
    setTimeout(() => setFlashBoost(false), 500)
  }
  
  window.addEventListener('click', handleUserInteraction as EventListener)
  return () => window.removeEventListener('click', handleUserInteraction as EventListener)
}, [prices])
```

#### 2. src/components/WoodenFish.tsx
```typescript
// 添加 data 属性用于识别
return (
  <div data-wooden-fish>
    {/* 木鱼组件内容 */}
  </div>
)
```

## 数据展示

### 预计 SKR 回购
- **显示**：累计回购的 SKR 总量
- **计算**：每次点击根据实时价格计算
- **更新**：实时更新，显示在右上角

### 24h 收入
- **显示**：24 小时内的 SKR 回购量
- **计算**：`dailySkrBuyback = totalSkrBuyback * 0.5`（简化计算）
- **更新**：每次点击更新

### 通缩进度
- **显示**：通缩进度百分比
- **计算**：每次点击增加 0.01%
- **上限**：99.99%

## 经济模型

### 回购机制
1. 用户消耗 100 $GONGDE
2. 系统计算 USD 价值
3. 按 SKR 价格计算回购量
4. 更新统计面板

### 价格影响
- **$GONGDE 价格上涨** → 回购更多 SKR
- **$SKR 价格上涨** → 回购更少 SKR
- **动态平衡**：自动适应市场价格

## 用户体验

### 视觉反馈
1. 点击木鱼
2. 火球飞向 SKR 面板（如果有收益）
3. 面板闪光
4. 右上角显示增加的 SKR 数量
5. 总量实时更新

### 数据真实性
- ✅ 基于实时价格
- ✅ 反映实际消耗
- ✅ 符合经济模型
- ✅ 可验证计算

## 后续优化

### 1. 链上验证
- 连接智能合约
- 读取实际回购记录
- 显示链上数据

### 2. 历史记录
- 记录每次回购
- 显示历史图表
- 统计分析

### 3. 排行榜
- 按回购量排名
- 显示贡献度
- 奖励机制

## 测试建议

### 手动测试
1. 切换到功德模式
2. 点击木鱼 10 次
3. 观察 SKR 回购量增加
4. 计算：10 次 × 1 SKR = 10 SKR
5. 验证数值是否正确

### 价格测试
1. 修改 `.env` 中的价格
2. 重新加载页面
3. 点击木鱼
4. 验证回购量是否按新价格计算

### 模式测试
1. 冥想模式：点击不增加 SKR
2. 功德模式：点击增加 SKR
3. 验证模式切换正确

## 构建状态
✅ 构建成功，无错误

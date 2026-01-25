# 基于收益的火球特效修复 + SKR 面板优化

## 修复时间
2026-01-25

## 问题描述

### 问题 1：火球特效逻辑不准确
之前的实现是根据游戏模式（冥想/功德）来决定是否触发火球特效，但实际上：
- **冥想模式**：虽然免费玩耍，但有小概率（20%）获得 $GONGDE 奖励
- **功德模式**：消耗代币，总是产生 SKR 回购收益

问题在于：冥想模式下即使没有产生收益，也会触发火球飞行，造成视觉误导。

### 问题 2：SKR 面板动画过于突兀
SKR 回购面板在数值增加时会整体上下扩展（scale 动画），视觉效果不够优雅。

## 解决方案

### 1. 修改 addMerit 函数返回值
让 `addMerit` 函数返回 `boolean` 类型，表示是否真的产生了收益：

#### 冥想模式
```typescript
// 返回是否产生了收益
return isGDReward  // 只有当 gdReward > 0 时才返回 true
```

#### 功德模式
```typescript
return true  // 功德模式总是消耗代币产生收益
```

### 2. 修改点击处理函数
根据 `addMerit` 的返回值决定是否触发火球：

#### handleCenterClick
```typescript
// 触发功德，获取是否有收益
const hasReward = addMerit()

// 只有在有收益时才触发能量传输效果
if (hasReward && fishButtonRef.current) {
  const rect = fishButtonRef.current.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  triggerBurnEffect({ x: centerX, y: centerY })
}
```

#### handleTargetClick
```typescript
// 触发功德并生成新圈，获取是否有收益
const hasReward = addMerit(true)

// 只有在有收益时才触发能量传输效果
if (hasReward) {
  const rect = e.currentTarget.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  triggerBurnEffect({ x: centerX, y: centerY })
}
```

### 3. 优化 SKR 面板动画
移除整体 scale 动画，将增加的数值显示在右边空白处：

```typescript
<div className="flex items-baseline gap-1">
  <motion.div className="text-xl font-bold">
    {simulator.totalSkrBuyback.toLocaleString(...)}
  </motion.div>
  <div className="text-xs text-gray-400">SKR</div>
  
  {/* 增加数值显示在右边 */}
  <AnimatePresence>
    {flashBoost && simulator.lastInteractionBoost > 0 && (
      <motion.div
        initial={{ opacity: 0, x: -10, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 10 }}
        className="ml-auto text-sm font-bold text-green-300"
      >
        +{simulator.lastInteractionBoost.toFixed(2)}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

## 效果对比

### 修复前

#### 冥想模式
- ❌ 每次点击都触发火球（即使没有收益）
- ❌ 用户误以为每次都产生了 SKR 回购

#### SKR 面板
- ❌ 整个面板上下扩展（scale 动画）
- ❌ 增加数值显示在下方，导致面板高度变化

### 修复后

#### 冥想模式
- ✅ 只有在真的获得 $GONGDE 奖励时才触发火球
- ✅ 80% 的点击不会触发火球（因为没有收益）
- ✅ 20% 的点击触发火球（有收益）

#### 功德模式
- ✅ 每次点击都触发火球（因为总是消耗代币产生收益）
- ✅ 暴击时触发多个金币飞行

#### SKR 面板
- ✅ 面板大小固定，不再上下扩展
- ✅ 增加数值显示在右边空白处
- ✅ 数值从左侧滑入，然后向右侧淡出
- ✅ 视觉效果更优雅

## 用户体验改进

### 1. 视觉逻辑一致性
- 火球特效 = 真实收益产生
- 没有火球 = 没有收益
- 用户可以通过火球判断是否获得了奖励

### 2. 冥想模式更真实
- 大部分点击没有火球（符合"免费玩耍"的定位）
- 偶尔触发火球时，用户会感到惊喜（"哇，中奖了！"）

### 3. SKR 面板更稳定
- 面板不再跳动，视觉更稳定
- 增加数值在右边显示，不影响主数值阅读
- 动画更流畅，不会造成视觉疲劳

## 技术细节

### 冥想模式收益概率
- **手动点击**：20% 概率获得 6-18 $GONGDE
- **自动挂机**：15% 概率获得 1-12 $GONGDE（降低 70%）

### 功德模式收益
- **消耗**：每次点击消耗 100 $GONGDE
- **暴击**：10% 基础概率，可获得 1500-10000 $GONGDE
- **非暴击**：50% 概率 0，30% 概率 80，15% 概率 150，4% 概率 500，1% 概率 2000

### 动画参数
```typescript
// 增加数值动画
initial={{ opacity: 0, x: -10, scale: 0.8 }}  // 从左侧小尺寸开始
animate={{ opacity: 1, x: 0, scale: 1 }}      // 滑入并放大到正常
exit={{ opacity: 0, x: 10 }}                  // 向右淡出
transition={{ duration: 0.5 }}                // 持续 0.5 秒
```

## 文件修改

### 修改的文件
1. `src/components/WoodenFish.tsx`
   - 修改 `addMerit` 函数返回类型为 `boolean`
   - 修改 `handleCenterClick` 根据返回值触发火球
   - 修改 `handleTargetClick` 根据返回值触发火球

2. `src/pages/TemplePage.tsx`
   - 移除 SKR 面板的 scale 动画
   - 将增加数值移到右边显示
   - 优化动画效果

## 测试建议

### 冥想模式测试
1. 切换到冥想模式
2. 连续点击木鱼 20 次
3. 观察：大约 4 次会触发火球（20% 概率）
4. 确认：只有显示 "$GONGDE" 奖励时才有火球

### 功德模式测试
1. 切换到功德模式
2. 点击木鱼
3. 观察：每次都有火球飞行
4. 暴击时：多个金币飞行

### SKR 面板测试
1. 点击木鱼触发收益
2. 观察左侧 SKR 面板
3. 确认：面板大小不变
4. 确认：增加数值在右边显示
5. 确认：数值从左滑入，向右淡出

## 构建状态
✅ 构建成功，无错误
⚠️ 11 个未使用变量警告（不影响功能）

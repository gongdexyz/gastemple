# 冥想模式火球特效修复

## 问题描述
在冥想模式（免费玩耍，不消耗代币）下，点击木鱼时仍然会触发火球飞向左侧面板的特效，但实际上冥想模式没有任何收益产生，这会造成视觉误导。

## 修复方案
在所有触发 `triggerBurnEffect` 的地方添加 `gameMode === 'merit'` 判断，确保只有在功德模式（消耗代币有收益）下才触发火球特效。

## 修改位置

### 1. handleTargetClick 函数
```typescript
// 修改前：无条件触发
triggerBurnEffect({ x: centerX, y: centerY })

// 修改后：只在功德模式触发
if (gameMode === 'merit') {
  triggerBurnEffect({ x: centerX, y: centerY })
}
```

### 2. handleCenterClick 函数
```typescript
// 修改前：无条件触发
if (fishButtonRef.current) {
  triggerBurnEffect({ x: centerX, y: centerY })
}

// 修改后：只在功德模式触发
if (gameMode === 'merit' && fishButtonRef.current) {
  triggerBurnEffect({ x: centerX, y: centerY })
}
```

### 3. 暴击特效触发
```typescript
// 修改前：只检查 fishButtonRef 和 shouldSpawnTarget
if (fishButtonRef.current && shouldSpawnTarget) {
  triggerBurnEffect({ x: centerX, y: centerY }, true)
}

// 修改后：增加 gameMode 检查
if (gameMode === 'merit' && fishButtonRef.current && shouldSpawnTarget) {
  triggerBurnEffect({ x: centerX, y: centerY }, true)
}
```

## 效果

### 冥想模式（免费玩耍）
- ✅ 点击木鱼有音效
- ✅ 显示功德文案（"心平气和"等）
- ✅ 累计本次修行功德数
- ❌ **不再触发火球飞行特效**（因为没有实际收益）
- ❌ 不消耗 $GONGDE
- ❌ 不产生 SKR 回购

### 功德模式（消耗代币）
- ✅ 点击木鱼有音效
- ✅ 显示功德文案
- ✅ **触发火球飞行特效**（有实际收益）
- ✅ 消耗 $GONGDE
- ✅ 产生 SKR 回购
- ✅ 有概率暴击获得 $GONGDE 奖励

## 用户体验改进
1. **视觉逻辑一致**：火球特效只在有实际收益时出现
2. **避免误导**：冥想模式下不会让用户误以为产生了收益
3. **性能优化**：减少不必要的动画渲染

## 测试建议
1. 切换到冥想模式，点击木鱼，确认没有火球飞行
2. 切换到功德模式，点击木鱼，确认有火球飞行
3. 在功德模式下触发暴击，确认有多个金币飞行
4. 在冥想模式下快速点击，确认不会有任何火球

## 文件修改
- `src/components/WoodenFish.tsx`

## 构建状态
✅ 构建成功，无错误

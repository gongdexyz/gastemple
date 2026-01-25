# 英文本地化修复

## 修复内容

### 1. 自动代敲选项英文化
**位置**：`src/components/WoodenFish.tsx` - `getAutoClickOptions()` 函数

**修复前**：
```typescript
{ price: 100, multiplier: 1, label: '自动代敲', description: '小沙弥为你代劳', emoji: '🤖' }
{ price: 250, multiplier: 3, label: '功德加持', description: '功德×3，效率提升', emoji: '✨' }
{ price: 400, multiplier: 5, label: '方丈加持', description: '法力无边，功德×5', emoji: '👨‍🦲' }
```

**修复后**：
```typescript
// 英文模式
{ price: 100, multiplier: 1, label: 'Auto-Click', description: 'Novice monk helps you', emoji: '🤖' }
{ price: 250, multiplier: 3, label: 'Merit Boost', description: 'Merit ×3, efficiency up', emoji: '✨' }
{ price: 400, multiplier: 5, label: 'Abbot Blessing', description: 'Boundless power, Merit ×5', emoji: '👨‍🦲' }

// 中文模式
{ price: 100, multiplier: 1, label: '自动代敲', description: '小沙弥为你代劳', emoji: '🤖' }
{ price: 250, multiplier: 3, label: '功德加持', description: '功德×3，效率提升', emoji: '✨' }
{ price: 400, multiplier: 5, label: '方丈加持', description: '法力无边，功德×5', emoji: '👨‍🦲' }
```

### 2. 功德称号英文化
**位置**：`src/components/WoodenFish.tsx` - `getTitle()` 函数

**修复前**：
```typescript
return '赛博活佛 Cyber Buddha'  // 中英文混合
return '功德圆满 Merit Master'
return '虔诚信徒 Devoted One'
return '善良韭菜 Kind Leek'
return '迷途羔羊 Lost Soul'
```

**修复后**：
```typescript
// 英文模式
return 'Cyber Buddha'
return 'Merit Master'
return 'Devoted One'
return 'Kind Leek'
return 'Lost Soul'

// 中文模式
return '赛博活佛'
return '功德圆满'
return '虔诚信徒'
return '善良韭菜'
return '迷途羔羊'
```

## 已确认正确的英文化

以下内容已经有正确的英文支持，无需修改：

### 1. 自动挂机按钮
```typescript
{isAutoClicking
  ? (isEN ? 'Monk Working' : '方丈工作中')
  : (isEN ? 'Hire Monk' : '雇佣方丈')
}
```

### 2. 游戏模式
```typescript
{isEN ? '🧘 Meditation' : '🧘 冥想模式'}
{isEN ? '🔥 Merit Burn' : '🔥 功德模式'}
```

### 3. 模式说明
```typescript
{isEN ? 'Free play, no token consumption' : '免费游玩，不消耗代币'}
{isEN ? 'Burns $GONGDE tokens, earns real merit' : '消耗$GONGDE代币，积累真实功德'}
```

### 4. 操作提示
```typescript
{isEN ? 'CATCH THE CIRCLE! ⭕' : '快点圈圈！'}
{isEN ? 'CLICK THE FROG TO START 🐸' : '点击蛙蛙开始'}
```

### 5. 消耗提示
```typescript
{isEN ? 'Cost: 0 $GONGDE (Free)' : '每次消耗 0 $GONGDE (免费)'}
{isEN ? `Cost: ${burnCost} $GONGDE each` : `每次消耗 ${burnCost} $GONGDE`}
```

## 测试建议

1. 切换到英文模式（点击右上角语言切换）
2. 检查自动代敲选项是否显示英文
3. 检查功德称号是否只显示英文（不再有中文）
4. 验证所有弹窗和提示都是英文

## 翻译对照表

| 中文 | 英文 |
|------|------|
| 自动代敲 | Auto-Click |
| 功德加持 | Merit Boost |
| 方丈加持 | Abbot Blessing |
| 小沙弥为你代劳 | Novice monk helps you |
| 功德×3，效率提升 | Merit ×3, efficiency up |
| 法力无边，功德×5 | Boundless power, Merit ×5 |
| 赛博活佛 | Cyber Buddha |
| 功德圆满 | Merit Master |
| 虔诚信徒 | Devoted One |
| 善良韭菜 | Kind Leek |
| 迷途羔羊 | Lost Soul |

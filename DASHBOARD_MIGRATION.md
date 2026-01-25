# Dashboard Migration - SKR 通缩统计替换燃烧数据

## 修改日期
2026-01-25

## 修改内容

### 1. 备份原有组件
- **备份文件**: `src/components/EconomicCalculator.tsx.backup`
- **原组件**: EconomicCalculator（燃烧数据统计面板）
- **用途**: 显示 GD 燃烧统计、经济模型计算等

### 2. 新组件上线
- **新组件**: EconomyDashboard（SKR 通缩统计面板）
- **位置**: 左下角固定位置
- **显示范围**: 所有页面（除了 Landing Page）

### 3. 显示逻辑变更

#### 修改前
```tsx
{/* 经济面板 - 只在 Temple 页面且管理员模式下显示 */}
{location.pathname === '/temple' && location.search.includes('admin=true') && <EconomyDashboard />}

{/* 经济计算器 - 只在 Temple 页面且管理员模式下显示 */}
{location.pathname === '/temple' && location.search.includes('admin=true') && <EconomicCalculator />}
```

#### 修改后
```tsx
{/* SKR 通缩统计面板 - 全局显示（除了 Landing Page） */}
{!isLandingPage && <EconomyDashboard />}

{/* 经济计算器 - 备份，只在管理员模式下显示 */}
{location.pathname === '/temple' && location.search.includes('admin=true') && <EconomicCalculator />}
```

## 新面板功能

### SKR 通缩统计面板 (EconomyDashboard)

#### 核心功能
1. **预计 SKR 回购量**
   - 显示累计回购的 SKR 总量
   - 实时 USD 价值计算
   - 心跳增长：每秒 +0.01 SKR
   - 互动暴击：点击时 +50-100 SKR

2. **国库通缩进度**
   - 显示通缩百分比
   - 动态进度条
   - 距离下一轮减产提示

3. **24h 协议收入**
   - 显示 24 小时 SKR 收入
   - 标注"全部用于回购"
   - 实时增长动画

4. **信徒数量**
   - 显示当前活跃用户数
   - "正在为 SKR 祈福"状态

5. **实时价格**
   - SKR 价格
   - GONGDE 价格
   - 汇率计算

6. **生态贡献说明**
   - 1000 日活用户预期
   - 每日回购 500-1000 SKR
   - "流动性黑洞"定位

#### 特色功能
- **心跳增长**: 模拟其他玩家活动，数字自动增长
- **互动暴击**: 用户点击时数字跳动，边框闪烁
- **实时反馈**: 显示"+XX SKR 来自你的操作！"
- **中英双语**: 支持语言切换

## 访问方式

### 普通用户
- 访问任意页面（除了首页）即可看到左下角的 **"🔥 SKR 通缩"** 按钮
- 点击按钮展开面板

### 管理员模式
- 访问 `http://localhost:5173/temple?admin=true`
- 可以同时看到 SKR 通缩面板和经济计算器（备份）

## 恢复原有面板

如果需要恢复原有的燃烧数据面板：

1. 恢复备份文件：
```bash
Copy-Item -Path "src/components/EconomicCalculator.tsx.backup" -Destination "src/components/EconomicCalculator.tsx" -Force
```

2. 修改 `src/App.tsx`，将显示逻辑改回：
```tsx
{/* 经济计算器 - 全局显示 */}
{!isLandingPage && <EconomicCalculator />}
```

## 黑客松演示建议

### 演示重点
1. **打开面板**: 展示左下角按钮
2. **心跳增长**: 让评委看到数字自动增长
3. **互动暴击**: 点击木鱼，展示数字跳动效果
4. **生态贡献**: 强调"1000 用户 = 500-1000 SKR 回购"

### 解说词
> "这是我们的 SKR 通缩引擎。虽然目前是黑客松模拟阶段，但经济模型显示，仅需 1000 名日活用户，每天就能从市场回购 500-1000 个 SKR。当我点击木鱼时（演示点击），大家可以看到，SKR 的回购数据实时更新。这不仅是一个游戏，更是 SKR 的流动性黑洞。"

## 技术细节

### 模拟数据
- **基数**: 10,240.56 SKR（看起来已有测试用户）
- **心跳增长**: 每秒 +0.01 SKR
- **互动增长**: 每次点击 +50-100 SKR（随机）
- **信徒增长**: 10% 概率每秒 +1 人

### 动画效果
- 数字跳动：scale [1, 1.1, 1]
- 边框闪烁：borderColor 绿色渐变
- 进度条：平滑过渡动画
- 反馈提示：淡入淡出

## 文件清单

### 修改的文件
- `src/App.tsx` - 修改面板显示逻辑

### 备份的文件
- `src/components/EconomicCalculator.tsx.backup` - 原燃烧数据面板

### 新增的文件
- `DASHBOARD_MIGRATION.md` - 本说明文档

### 保持不变的文件
- `src/components/EconomyDashboard.tsx` - SKR 通缩面板（已存在）
- `src/components/EconomicCalculator.tsx` - 原燃烧数据面板（保留，仅在 admin 模式显示）

---

**修改完成！** ✅

现在访问任意页面（除了首页）都能看到 SKR 通缩统计面板了！

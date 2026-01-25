# 使用 PWABuilder 生成 APK - 完整操作步骤

## ✅ 你的网站信息

**网站 URL**: `https://gongde.xyz`
**状态**: ✅ 在线可访问

---

## 🎨 PWABuilder 操作步骤

### 步骤 1: 访问 PWABuilder

打开浏览器，访问：**https://www.pwabuilder.com/**

### 步骤 2: 输入网站 URL

1. 在首页的大输入框中输入：`https://gongde.xyz`
2. 点击 **"Start"** 或 **"Package For Stores"** 按钮

### 步骤 3: 等待分析

PWABuilder 会分析你的网站（大约 10-30 秒）。

**如果显示错误或警告：**
- 不用担心，PWABuilder 仍然可以生成 APK
- 点击 "Continue" 或 "Next" 继续

### 步骤 4: 选择 Android 平台

1. 在平台选择页面，找到 **"Android"** 卡片
2. 点击 **"Store Package"** 或 **"Generate Package"** 按钮

### 步骤 5: 配置 Android 应用（重要！）

填写以下信息（请完全按照这个填写）：

#### 基本信息
- **Package ID**: `com.gastemple.app`
- **App name**: `Gas Temple`
- **Launcher name**: `Gas Temple`
- **App version**: `1.0.0`
- **App version code**: `1`

#### 网站信息
- **Host**: `gongde.xyz` （注意：不要加 https://）
- **Start URL**: `/`

#### 显示设置
- **Display mode**: `standalone`
- **Orientation**: `portrait`

#### 颜色设置
- **Theme color**: `#c9a962`
- **Background color**: `#0a0a0a`

#### 签名密钥（选择其中一个）

**选项 A: 使用默认密钥（推荐）**
- **Key alias**: `android`
- **Key password**: `android`
- **Store password**: `android`

**选项 B: 自动生成（更安全）**
- 勾选 **"Generate new signing key"**
- PWABuilder 会自动创建新的签名密钥

#### 图标设置
- 使用默认（PWABuilder 会尝试从网站获取）
- 或者上传 `public/temple.svg` 转换为 PNG

### 步骤 6: 生成 APK

1. 检查所有配置信息是否正确
2. 点击 **"Build My Package"** 或 **"Generate"** 按钮
3. 等待生成（通常 1-3 分钟）

**生成过程中会显示：**
- "Building your package..."
- "Generating APK..."
- 进度条

### 步骤 7: 下载 APK

生成完成后：

1. 点击 **"Download"** 按钮
2. 会下载一个 `.zip` 文件（例如：`gas-temple-android.zip`）
3. 保存到你的电脑

### 步骤 8: 解压并查找 APK

1. 找到下载的 zip 文件
2. 右键点击，选择"解压到当前文件夹"
3. 打开解压后的文件夹

**文件结构：**
```
gas-temple-android/
├── app-release-signed.apk  ← 这是你需要的 APK 文件！
├── assetlinks.json
├── signing-key.keystore
└── README.md
```

4. 找到 `app-release-signed.apk` 文件
5. 可以重命名为 `gas-temple-release.apk`（可选）

---

## 📋 提交到 Solana dApp Store

现在你有了 APK 文件，可以提交了！

### 填写表单信息

根据你之前看到的 Solana 提交表单：

#### 1. dApp名称
```
Gas Temple - 功德无量
```
或简化为：
```
Gas Temple
```

#### 2. 软件包名称
```
com.gastemple.app
```

#### 3. 名言（Tagline）
```
既然都要亏，不如亏得好笑一点
```

#### 4. 描述
```
Gas Temple 是一个加密货币研究娱乐平台，将枯燥的加密货币研究转化为"抽卡式"游戏体验。

核心功能：
• 盲盒投研 - 随机抽取加密项目卡牌，获得极简研报
• 庞氏指数 - 直观展示项目风险等级
• 韭菜名人堂 - 链上排行榜记录"光辉战绩"
• SBT勋章 - 灵魂绑定的"耻辱勋章"系统
• 赛博木鱼 - 敲击数字木鱼积累功德，缓解投资焦虑

⚠️ 高风险警告：本应用涉及加密货币内容。所有信息仅供娱乐，不构成任何投资建议。加密货币投资具有高风险。

功德无量 - NFA (Not Financial Advice)
```

### 上传文件

#### APK 文件
- 上传刚才下载的 `app-release-signed.apk`

#### 应用截图（5张）
从 `screenshots/` 目录上传：
1. `gacha1.png` - 抽签随机项目辣评
2. `gacha2.png` - 赛博木鱼功德
3. `gacha3.png` - 辣评项目详情
4. `gacha4.png` - 项目坟场
5. `gacha5.png` - 开发者项目介绍

#### 应用图标
- 上传 `public/temple.svg` 或转换为 512x512 PNG

### 发布者信息

- **Publisher Name**: `Gas Temple Studio`
- **Website**: `https://gongde.xyz`
- **Contact Email**: 你的邮箱地址
- **Publisher Avatar**: 512x512 PNG 图像（"敲木鱼的蛙"头像）

### 法律文件 URL

- **Privacy Policy**: `https://gongde.xyz/privacy-policy.html`
- **EULA**: `https://gongde.xyz/eula.html`

### 分类和评级

- **Category**: `Entertainment`
- **Age Rating**: `12+`
- **Content Warnings**: ✅ Financial/Cryptocurrency Content

### 身份验证

- ✅ 勾选 "Complete identity verification now"

---

## ⚠️ 常见问题

### Q: PWABuilder 显示 "PWA not found"

**不用担心！** PWABuilder 仍然可以生成 APK。
- 点击 "Continue anyway" 或 "Skip"
- 继续填写配置信息

### Q: 生成失败或下载不了

**解决方案：**
1. 刷新页面重试
2. 检查网络连接
3. 尝试使用不同的浏览器（推荐 Chrome）

### Q: APK 文件太大

**正常情况：**
- APK 大小通常在 5-20 MB
- Solana dApp Store 接受最大 100 MB

### Q: 下载的是 .aab 文件而不是 .apk

**解决方案：**
- 在 PWABuilder 配置中选择 "APK" 而不是 "App Bundle"
- 或者两个都下载，提交时使用 .apk 文件

---

## 🎯 快速检查清单

PWABuilder 操作：
- [ ] 访问 https://www.pwabuilder.com/
- [ ] 输入 URL: `https://gongde.xyz`
- [ ] 选择 Android 平台
- [ ] 填写 Package ID: `com.gastemple.app`
- [ ] 填写应用名称和版本
- [ ] 配置颜色和显示模式
- [ ] 生成并下载 APK
- [ ] 解压 zip 文件
- [ ] 找到 .apk 文件

Solana 提交准备：
- [ ] APK 文件已下载
- [ ] 5 张截图已准备
- [ ] Publisher Avatar 已准备（512x512 PNG）
- [ ] 所有表单信息已准备
- [ ] 法律文件 URL 可访问

---

## 🎉 预计时间

- PWABuilder 生成 APK: 5-10 分钟
- 下载和解压: 2 分钟
- 填写 Solana 表单: 10-15 分钟
- **总计: 约 20-30 分钟**

---

**现在开始！**

1. 打开浏览器访问：https://www.pwabuilder.com/
2. 输入：`https://gongde.xyz`
3. 按照上面的步骤操作

**完成后告诉我，我会帮你检查 APK 并指导提交！**
